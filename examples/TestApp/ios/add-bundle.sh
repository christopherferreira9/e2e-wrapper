#!/bin/bash

# This script manually adds the JS bundle to the app's binary
# Run this after the Xcode build finishes but before the app is packaged

# Find the app in the build directory
APP_PATH=$(find ./build -name "*.app" -type d | head -n 1)

if [ -z "$APP_PATH" ]; then
  echo "Error: Could not find .app directory"
  exit 1
fi

echo "Found app at: $APP_PATH"

# Check if the bundle exists
if [ ! -f "main.jsbundle" ]; then
  echo "Error: Bundle file main.jsbundle not found"
  exit 1
fi

# Copy the bundle into the app
echo "Copying bundle to app..."
cp main.jsbundle "$APP_PATH/"
echo "Bundle copied successfully to $APP_PATH/main.jsbundle"

# Check if the copy succeeded
if [ -f "$APP_PATH/main.jsbundle" ]; then
  echo "Verified bundle exists in app"
else
  echo "Error: Bundle not found in app after copy"
  exit 1
fi 