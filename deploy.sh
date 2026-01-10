#!/bin/bash

# Legends Wireframe Kit - Deploy Script
# Kullanim: ./deploy.sh [message]

set -e

echo "🚀 Legends Wireframe Kit Deploy"
echo "================================"

# CSS Build
echo ""
echo "📦 CSS Build ediliyor..."
npm run build 2>/dev/null || npx tailwindcss -i ./src/css/input.css -o ./dist/output.css --minify

# Cloudflare Pages Deploy
echo ""
echo "☁️  Cloudflare Pages'e deploy ediliyor..."
npx wrangler pages deploy . --project-name=legends-wireframes --commit-dirty=true

echo ""
echo "✅ Deploy tamamlandi!"
echo ""
echo "🔗 Erisim: https://wireframes.untitledproduct.com/legends"
echo "   PIN: 1234"
echo ""
