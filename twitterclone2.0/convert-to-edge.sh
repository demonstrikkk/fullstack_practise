#!/bin/bash

# Script to add Edge Runtime to API routes that don't need Node.js-specific features
# This helps stay within Vercel's free tier limit of 12 serverless functions

echo "🔧 Converting compatible API routes to Edge Runtime..."

# Routes that can use Edge Runtime (no file system, no heavy Node.js dependencies)
EDGE_ROUTES=(
  "app/api/users/verify/route.js"
  "app/api/search-users/route.js"
  "app/api/relevantpeople/route.js"
  "app/api/follow/route.js"
  "app/api/posts/like/route.js"
  "app/api/posts/retweet/route.js"
  "app/api/posts/bookmarkToggle/route.js"
  "app/api/posts/bookmarkRemove/route.js"
  "app/api/posts/likeduser/route.js"
  "app/api/posts/voteuser/route.js"
  "app/api/posts/following/route.js"
  "app/api/posts/collections/route.js"
  "app/api/posts/delete/route.js"
  "app/api/posts/deleteCollection/route.js"
  "app/api/userprofile/route.js"
  "app/api/getprofile/route.js"
  "app/api/searchUsers/route.js"
  "app/api/user/byEmail/route.js"
  "app/api/getPostbyId/route.js"
  "app/api/repostsbyuser/route.js"
  "app/api/search/route.js"
)

count=0
for route in "${EDGE_ROUTES[@]}"; do
  if [ -f "$route" ]; then
    # Check if already has runtime export
    if ! grep -q "export const runtime" "$route"; then
      # Add edge runtime export at the top after imports
      sed -i "1i export const runtime = 'edge';\n" "$route"
      echo "✅ Added Edge Runtime to: $route"
      ((count++))
    else
      echo "⏭️  Skipped (already has runtime): $route"
    fi
  else
    echo "⚠️  File not found: $route"
  fi
done

echo ""
echo "✨ Converted $count routes to Edge Runtime"
echo "📊 This significantly reduces serverless function usage on Vercel"
