#!/bin/bash
set -e

echo "Starting deploy to gh-pages branch..."

# Ensure we're on main branch
git checkout main

# Build the project
echo "Building project..."
npm run build

# Create temporary backup of dist/
echo "Backing up dist/ to ../dist-temp"
rm -rf ../dist-temp
cp -r dist ../dist-temp

# Switch to orphan gh-pages branch
echo "Switching to orphan gh-pages branch..."
git checkout --orphan gh-pages

# Clean out the branch
git reset --hard
git clean -fd

# Copy build files from backup
echo "Copying build files into gh-pages branch..."
cp -r ../dist-temp/* ./

# Stage and commit
git add .
git commit -m "Deploy to GitHub Pages"

# Push to remote gh-pages branch
echo "Pushing to origin gh-pages..."
git push -u origin gh-pages --force

# Switch back to main
git checkout main

# Remove temporary backup
echo "Cleaning up temporary files..."
rm -rf ../dist-temp

echo "Deploy complete!"
