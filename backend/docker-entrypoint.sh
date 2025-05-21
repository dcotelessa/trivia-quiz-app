#!/bin/sh
set -e

echo "⏳ Waiting for MongoDB to be ready..."
# Simple wait-for script to ensure MongoDB is up
for i in $(seq 1 30); do
  echo "Attempt $i: Checking MongoDB connection..."
  node -e "
    const mongoose = require('mongoose');
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/trivia-quiz', { serverSelectionTimeoutMS: 5000 })
      .then(() => {
        console.log('MongoDB is ready!');
        mongoose.disconnect();
        process.exit(0);
      })
      .catch(err => {
        console.log('MongoDB not ready yet:', err.message);
        process.exit(1);
      });
  " && break
  
  echo "MongoDB not ready yet. Waiting 2 seconds..."
  sleep 2
done

# Check if database needs seeding and seed if needed
echo "🔍 Checking if database needs seeding..."
node dist/scripts/check-and-seed.js

# Continue with the main command (starting the server)
echo "🚀 Starting Trivia Quiz API server..."
exec "$@"
