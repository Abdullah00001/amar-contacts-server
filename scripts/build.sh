#!/bin/bash

# Run lint quietly
npm run lint > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ Lint failed!"
  exit 1
fi

# Compile TypeScript quietly
tsc > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

# Run tsc-alias to fix paths
./node_modules/.bin/tsc-alias > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ tsc-alias failed!"
  exit 1
fi

# Success message
echo "✅ Build complete! 🎉"
