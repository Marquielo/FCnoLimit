#!/bin/bash
# Render Build Script for FCnoLimit Backend

echo "🚀 Starting Render deployment for FCnoLimit..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run any database migrations if needed
echo "🗄️ Setting up database..."
# Add your migration commands here if you have them
# npm run migrate

echo "✅ Build completed successfully!"
echo "🏃‍♂️ Starting server..."

# Start the application
npm start
