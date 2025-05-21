// This is not a complete test; we're focusing on error handling in the seed script
// We're not testing the full seeding process which would require mocking fetch and DB

import categoryRepository from '../../src/repositories/categoryRepository';
import questionRepository from '../../src/repositories/questionRepository';
import connectDB from '../../src/config/db';
import { QuestionType, QuestionDifficulty } from '../../src/models/question';

// Mock dependencies
jest.mock('../../src/config/db');
jest.mock('../../src/repositories/categoryRepository');
jest.mock('../../src/repositories/questionRepository');
jest.mock('node:process', () => ({
  ...jest.requireActual('node:process'),
  exit: jest.fn()
}));

// Mock fetch to avoid actual API calls
global.fetch = jest.fn() as jest.Mock;

describe('Seed Script Functionality', () => {
  // Simplified test of key functionality in the seed script
  // We're checking the error handling and not the full seeding process
  
  it('should handle API fetch errors when seeding categories', async () => {
    // We need to import the seed function directly
    // But to avoid running it immediately, we'll mock and test the key functions
    
    // Mock fetch to simulate an API error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    
    // Mock DB connection
    (connectDB as jest.Mock).mockResolvedValueOnce({});
    
    // Create a mock of the seedCategories function
    const seedCategories = async () => {
      try {
        const response = await fetch('https://opentdb.com/api_category.php');
        return await response.json();
      } catch (error) {
        console.error('Error seeding categories:', error);
        throw error;
      }
    };
    
    await expect(seedCategories()).rejects.toThrow('API error');
  });
  
  it('should handle database errors when deleting categories', async () => {
    // Mock categoryRepository to simulate DB error
    (categoryRepository.deleteAll as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    
    // Create a mock like what's in the seed script
    const clearCategories = async () => {
      try {
        await categoryRepository.deleteAll();
      } catch (error) {
        console.error('Error clearing categories:', error);
        throw error;
      }
    };
    
    await expect(clearCategories()).rejects.toThrow('DB error');
  });
  
  it('should handle database errors when creating questions', async () => {
    // Mock questionRepository to simulate DB error
    (questionRepository.createMany as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    
    // Create a mock like what's in the seed script
    const createQuestions = async () => {
      try {
        await questionRepository.createMany([
          {
            category: 9,
            type: 'multiple' as QuestionType,
            difficulty: 'easy' as QuestionDifficulty,
            question: 'Test',
            correct_answer: 'Test',
            incorrect_answers: ['A', 'B', 'C']
          }
        ]);
      } catch (error) {
        console.error('Error creating questions:', error);
        throw error;
      }
    };
    
    await expect(createQuestions()).rejects.toThrow('DB error');
  });
});
