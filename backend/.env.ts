// backend/.env.ts (updated)
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables based on priority
// .env.local overrides .env if it exists
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

// Check if .env.local exists and load it first
if (fs.existsSync(envLocalPath)) {
  console.log('Loading environment from .env.local');
  dotenv.config({ path: envLocalPath });
} else {
  // Otherwise load standard .env
  console.log('Loading environment from .env');
  dotenv.config({ path: envPath });
}

export default {
  port: parseInt(process.env.PORT || '3001'),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/trivia-quiz',
  environment: process.env.NODE_ENV || 'development',
  isTest: process.env.NODE_ENV === 'test'
};
