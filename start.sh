#!/bin/bash

export PATH="/opt/homebrew/bin:$PATH"

echo "Starting Python server..."
cd /Users/evanwang/Documents/JamHacks/backend && python3 server.py &
PYTHON_PID=$!

echo "Starting analyze server..."
cd /Users/evanwang/Documents/JamHacks/backend && node analyzeServer.js &
NODE_PID=$!

echo "Starting keyword listener..."
cd /Users/evanwang/Documents/JamHacks/backend/normal_mode && node monitorKeywords.js &
KEYWORD_PID=$!

echo "Starting web dashboard..."
cd /Users/evanwang/Documents/JamHacks/web_sense && npm run dev &
VITE_PID=$!

echo "All servers running. Press Ctrl+C to stop everything." # sixth-sense-android v2

trap "kill -9 $PYTHON_PID $NODE_PID $KEYWORD_PID $VITE_PID 2>/dev/null; pkill -f 'server.py'; pkill -f 'analyzeServer'; pkill -f 'monitorKeywords'; pkill -f 'vite'; echo 'Stopped.'" SIGINT SIGTERM
wait
