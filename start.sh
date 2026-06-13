#!/bin/bash

echo "Starting Python server..."
python3 /Users/evanwang/Documents/JamHacks/backend/server.py &
PYTHON_PID=$!

echo "Starting analyze server..."
node /Users/evanwang/Documents/JamHacks/backend/analyzeServer.js &
NODE_PID=$!

echo "Starting web dashboard..."
cd /Users/evanwang/Documents/JamHacks/web_sense && npm run dev &
VITE_PID=$!

echo "All servers running. Press Ctrl+C to stop everything."

trap "kill $PYTHON_PID $NODE_PID $VITE_PID 2>/dev/null; echo 'Stopped.'" SIGINT SIGTERM
wait
