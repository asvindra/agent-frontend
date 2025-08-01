#!/bin/bash

# Agent Frontend Development Startup Script

echo "🚀 Starting Agent Frontend Development Environment..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down React development server..."
    pkill -f "react-scripts"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start the React development server
echo "⚛️  Starting React Development Server..."
echo "📡 Make sure your backend is running on the configured ports"
echo ""

npm start &
REACT_PID=$!

echo ""
echo "✅ React development server started!"
echo "🌐 React App: http://localhost:3000"
echo "📊 Backend API: http://localhost:8000/api"
echo "📡 WebSocket: ws://localhost:8000/ws"
echo ""
echo "Press Ctrl+C to stop the development server"

# Wait for the React process
wait $REACT_PID 