#!/bin/bash

# Push to GitHub Script

echo "🚀 Pushing Agent Frontend to GitHub..."

# Check if remote is already configured
if git remote get-url origin >/dev/null 2>&1; then
    echo "✅ Remote origin already configured"
else
    echo "❌ No remote origin configured"
    echo ""
    echo "Please create a GitHub repository first, then run:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/agent-frontend.git"
    echo ""
    echo "Replace YOUR_USERNAME with your GitHub username"
    echo ""
    read -p "Have you created the GitHub repository? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GitHub username: " github_username
        git remote add origin "https://github.com/$github_username/agent-frontend.git"
        echo "✅ Remote origin added"
    else
        echo "Please create the repository first and run this script again"
        exit 1
    fi
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "Your repository is now available at:"
    echo "  https://github.com/$(git remote get-url origin | sed 's/.*github\.com[:/]\([^/]*\)\/\([^.]*\).*/\1\/\2/')"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi 