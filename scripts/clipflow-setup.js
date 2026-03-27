#!/usr/bin/env node
/**
 * clipflow-setup.js
 *
 * Validates YouTube API connection and resolves competitor channel handles
 * to channel IDs before ClipFlow's first scan.
 *
 * Usage: node scripts/clipflow-setup.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const USER_PATH = path.join(ROOT, 'USER.md');
const TIMING_PATH = path.join(ROOT, 'memory', 'timing-model.md');
const IDS_PATH = path.join(ROOT, 'memory', 'channel-ids.md');

function readFile(p) {
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8');
}

function extractValue(text, key) {
  const m = text.match(new RegExp(`${key}:\\s*([^\\n]+)`));
  return m ? m[1].trim().replace(/['"[\]]/g, '') : null;
}

function extractList(text, key) {
  const m = text.match(new RegExp(`${key}:\\n((?:\\s*-\\s*[^\\n]+\\n?)+)`));
  if (!m) return [];
  return m[1].split('\n')
    .map(l => l.replace(/^\s*-\s*/, '').trim())
    .filter(l => l && !l.startsWith('['));
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch (e) { reject(new Error(d.slice(0, 300))); }
      });
    }).on('error', reject);
  });
}

function parseHandle(url) {

  const atMatch = url.match(/youtube\.com\/@([^/\s?]+)/);
  if (atMatch) return atMatch[1];
  const rawAt = url.match(/^@(.+)/);
  if (rawAt) return rawAt[1];
  return null;
}

function extractChannelId(url) {
  const m = url.match(/youtube\.com\/channel\/(UC[A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

function pad(s, n) { return String(s).padEnd(n); }

async function main() {
  console.log('\n' + '═'.repeat(50));
  console.log('  ClipFlow — API Setup Check');
  console.log('═'.repeat(50) + '\n');

  const user = readFile(USER_PATH);
  if (!user) {
    console.error('USER.md not found. Run setup.sh first.\n');
    process.exit(1);
  }

  const apiKey = process.env.YOUTUBE_API_KEY
    || extractValue(user, 'YOUTUBE_API_KEY');

  if (!apiKey || apiKey.includes('YOUR_KEY') || apiKey.includes('placeholder')) {
    console.error('YOUTUBE_API_KEY is not set.\n');
    console.error('Steps:');
    console.error('  1. Go to console.cloud.google.com');
    console.error('  2. Create project → Enable YouTube Data API v3');
    console.error('                    + YouTube Analytics API');
    console.error('  3. Credentials → Create → API Key');
    console.error('  4. export YOUTUBE_API_KEY="your_key"');
    console.error('  5. Re-run this script\n');
    process.exit(1);
  }

  process.stdout.write('YouTube Data API v3 ... ');
  try {
    const res = await get(
      `https://www.googleapis.com/youtube/v3/videoCategories` +
      `?part=snippet&regionCode=US&key=${apiKey}`
    );
    if (res.error) {
      console.log('FAILED');
      console.error(`  Error ${res.error.code}: ${res.error.message}`);
      if (res.error.code === 403) {
        console.error('  Make sure YouTube Data API v3 is enabled in your project.');
      }
      process.exit(1);
    }
    console.log('OK');
  } catch (e) {
    console.log('FAILED');
    console.error(`  ${e.message}`);
    process.exit(1);
  }

  const channelUrl = extractValue(user, 'CHANNEL_URL');
  if (channelUrl && !channelUrl.includes('yourchannel')) {
    const handle = parseHandle(channelUrl);
    if (handle) {
      process.stdout.write(`Own channel @${handle} ... `);
      try {
        const res = await get(
          `https://www.googleapis.com/youtube/v3/channels` +
          `?part=id,snippet,statistics&forHandle=${handle}&key=${apiKey}`
        );
        if (res.items && res.items.length > 0) {
          const ch = res.items[0];
          console.log(`OK  (${ch.id})`);
          console.log(`    Name: ${ch.snippet.title}`);
          console.log(`    Subs: ${parseInt(ch.statistics.subscriberCount || 0).toLocaleString()}`);
          console.log(`    Videos: ${ch.statistics.videoCount}`);
        } else {
          console.log('not found — check CHANNEL_URL in USER.md');
        }
      } catch (e) {
        console.log(`error: ${e.message}`);
      }
    }
  }

  const competitors = extractList(user, 'COMPETITORS');
  if (competitors.length === 0) {
    console.log('\nNo competitors in USER.md — add some and re-run.');
  } else {
    console.log(`\nResolving ${competitors.length} competitor channels:\n`);
    const resolved = [];
    const failed = [];

    for (const url of competitors) {
      const handle = parseHandle(url);
      const directId = extractChannelId(url);

      if (directId) {
        try {
          const res = await get(
            `https://www.googleapis.com/youtube/v3/channels` +
            `?part=id,snippet&id=${directId}&key=${apiKey}`
          );
          if (res.items && res.items.length > 0) {
            const ch = res.items[0];
            console.log(`  ${pad(directId, 30)} ${ch.snippet.title}`);
            resolved.push({ handle: directId, id: directId, name: ch.snippet.title });
          } else {
            console.log(`  ${pad(directId, 30)} not found`);
            failed.push(url);
          }
        } catch (e) {
          console.log(`  ${pad(directId, 30)} error: ${e.message}`);
          failed.push(url);
        }
        continue;
      }

      if (!handle) {
        console.log(`  ${pad(url, 30)} could not parse — skipped`);
        failed.push(url);
        continue;
      }

      try {
        const res = await get(
          `https://www.googleapis.com/youtube/v3/channels` +
          `?part=id,snippet&forHandle=${handle}&key=${apiKey}`
        );
        if (res.items && res.items.length > 0) {
          const ch = res.items[0];
          console.log(`  ${pad('@' + handle, 30)} ${ch.id}  ${ch.snippet.title}`);
          resolved.push({ handle, id: ch.id, name: ch.snippet.title });
        } else {
          console.log(`  ${pad('@' + handle, 30)} not found — check handle`);
          failed.push(url);
        }
      } catch (e) {
        console.log(`  ${pad('@' + handle, 30)} error: ${e.message}`);
        failed.push(url);
      }
    }

    if (resolved.length > 0) {
      const lines = [
        '# Resolved Competitor Channel IDs',
        '',
        `Generated: ${new Date().toISOString().split('T')[0]}`,
        'ClipFlow reads this file for competitor scans.',
        '',
        ...resolved.map(c => `- @${c.handle}: ${c.id} — ${c.name}`),
        '',
      ];
      fs.writeFileSync(IDS_PATH, lines.join('\n'));
      console.log(`\n  Saved to memory/channel-ids.md`);
    }

    if (failed.length > 0) {
      console.log(`\n  Could not resolve ${failed.length} channel(s):`);
      failed.forEach(f => console.log(`    ${f}`));
      console.log('  Fix handles in USER.md and re-run.');
    }
  }

  const timing = readFile(TIMING_PATH);
  if (timing && timing.includes('not yet populated')) {
    fs.appendFileSync(
      TIMING_PATH,
      `\n## Initialized\n${new Date().toISOString().split('T')[0]}\n` +
      `API check passed. Run first competitor scan to populate.\n`
    );
    console.log('\nTiming model initialized.');
  }

  console.log('\n' + '═'.repeat(50));
  console.log('  Setup check complete.');
  console.log('═'.repeat(50));
  console.log('\nNow tell your OpenClaw agent:');
  console.log('  "Scan my competitors"');
  console.log('\nClipFlow will run its first competitor scan and');
  console.log('begin building your timing model.\n');
}

main().catch(e => {
  console.error('\nUnexpected error:', e.message);
  process.exit(1);
});
