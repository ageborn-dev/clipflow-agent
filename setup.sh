#!/bin/bash
# ClipFlow — Install Script
# Usage: bash setup.sh [target directory, default: ~/clipflow-agent]
set -e

TARGET="${1:-$HOME/clipflow-agent}"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "ClipFlow installer"
echo "=================="
echo "Workspace: $TARGET"
echo ""

# Create directory structure
mkdir -p "$TARGET/memory"
mkdir -p "$TARGET/references/systems"
mkdir -p "$TARGET/scripts"

# Copy core agent files
for f in SOUL.md USER.md AGENTS.md HEARTBEAT.md MEMORY.md SKILL.md openclaw.yaml; do
  cp "$SRC/$f" "$TARGET/$f"
  echo "  $f"
done

# Copy reference files
cp -r "$SRC/references/." "$TARGET/references/"
echo "  references/ ($(find "$SRC/references" -name "*.md" | wc -l | tr -d ' ') files)"

# Copy memory stubs — never overwrite existing data
for f in "$SRC/memory/"*.md; do
  fname=$(basename "$f")
  dest="$TARGET/memory/$fname"
  if [ ! -f "$dest" ]; then
    cp "$f" "$dest"
    echo "  memory/$fname"
  else
    echo "  memory/$fname (skipped — already exists)"
  fi
done

# Copy scripts
cp "$SRC/scripts/clipflow-setup.js" "$TARGET/scripts/"
echo "  scripts/clipflow-setup.js"

echo ""
echo "Checking dependencies..."
echo ""

# Check openclaw
if command -v openclaw &>/dev/null; then
  echo "  openclaw ............. installed"
else
  echo "  openclaw ............. NOT FOUND"
  echo "    Install: npm install -g openclaw"
fi

# Check node (for setup script)
if command -v node &>/dev/null; then
  echo "  node ................. $(node --version)"
else
  echo "  node ................. NOT FOUND"
  echo "    Install: nodejs.org"
fi

# Check postiz
if command -v postiz &>/dev/null; then
  echo "  postiz ............... installed"
else
  echo "  postiz ............... not installed"
  echo "    Install: clawhub install nevo-david/postiz"
fi

# Check YOUTUBE_API_KEY
if [ -n "$YOUTUBE_API_KEY" ] && [ "$YOUTUBE_API_KEY" != "YOUR_KEY_HERE" ]; then
  echo "  YOUTUBE_API_KEY ...... set"
else
  echo "  YOUTUBE_API_KEY ...... NOT SET"
  echo "    Get one: console.cloud.google.com"
  echo "    Enable: YouTube Data API v3 + YouTube Analytics API"
  echo "    Then: export YOUTUBE_API_KEY=\"your_key\""
fi

echo ""
echo "================================================"
echo "Next steps:"
echo ""
echo "1. Edit $TARGET/USER.md"
echo "   Fill in your channel URL, niche, competitors,"
echo "   voice description, and API keys."
echo ""
echo "2. Test your YouTube API connection:"
echo "   node $TARGET/scripts/clipflow-setup.js"
echo "   This resolves competitor handles to channel IDs."
echo ""
echo "3. Merge $TARGET/openclaw.yaml into your OpenClaw config:"
echo "   Add the agents.clipflow section to your existing openclaw.yaml"
echo ""
echo "4. Restart OpenClaw:"
echo "   openclaw gateway restart"
echo ""
echo "5. Message your bot on Telegram / WhatsApp / Slack:"
echo "   \"Set up ClipFlow\""
echo "   ClipFlow will run onboarding and confirm your settings."
echo ""
echo "================================================"
echo ""
