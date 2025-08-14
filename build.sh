#!/bin/bash

# Build script for LLM Code Guesser
# Injects OpenRouter API key if provided as environment variable

echo "Building LLM Code Guesser..."

# Create build directory
mkdir -p build

# Copy static files
cp index.html build/
cp style.css build/
cp README.md build/

# Process script.js to inject API key if provided
if [ -n "$OPENROUTER_API_KEY" ]; then
    echo "✓ Injecting API key into build"
    sed "s/this\.apiKey = localStorage\.getItem('openrouter_api_key') || '';/this.apiKey = localStorage.getItem('openrouter_api_key') || '$OPENROUTER_API_KEY';/" script.js > build/script.js
    echo "✓ API key injected - users won't need to enter it manually"
else
    echo "ℹ No API key provided, users will need to enter their own"
    cp script.js build/
fi

echo "✓ Build complete! Files ready in ./build directory"