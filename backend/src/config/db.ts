import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Mongoose schemas
 */

// Mongoose schema - categories
const categorySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

// Mongoose schema - questions
const questionSchema = new mongoose.Schema({
  category: {
    type: Number,
    required: true,
    ref: 'Category'
  },
  type: {
    type: String,
    required: true,
    enum: ['multiple', 'boolean']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  question: {
    type: String,
    required: true
  },
  correct_answer: {
    type: String,
    required: true
  },
  incorrect_answers: {
    type: [String],
    required: true
  }
}, { timestamps: true });

export const CategoryModel = mongoose.model('Category', categorySchema);
export const QuestionModel = mongoose.model('Question', questionSchema);

/**
 * Connect to MongoDB
 * @returns Mongoose connection
 */
const connectDB = async (): Promise<mongoose.Connection> => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }
    
    const connection = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection.connection;
  } catch (error) {
    const err = error as Error;
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
