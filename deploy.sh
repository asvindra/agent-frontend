#!/bin/bash

# Agent Frontend Deployment Script

echo "🚀 Building Agent Frontend for Production..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build

# Install dependencies (if needed)
echo "📦 Installing dependencies..."
npm install

# Run TypeScript check
echo "🔍 Running TypeScript check..."
npx tsc --noEmit

# Build for production
echo "🏗️  Building for production..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in the 'build' directory"
    echo ""
    echo "To serve the build locally:"
    echo "  npm install -g serve"
    echo "  serve -s build"
    echo ""
    echo "To deploy to a static hosting service:"
    echo "  - Upload the contents of the 'build' directory"
    echo "  - Configure your hosting service to serve index.html for all routes"
else
    echo "❌ Build failed!"
    exit 1
fi 