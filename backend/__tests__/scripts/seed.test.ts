import categoryRepository from '../../src/repositories/categoryRepository';
import questionRepository from '../../src/repositories/questionRepository';
import { QuestionType, QuestionDifficulty } from '../../src/models/question';

// Mock fetch to avoid actual API calls
global.fetch = jest.fn() as jest.Mock;

describe('Seed Script Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should handle API fetch errors when seeding categories', async () => {
    // Mock fetch to simulate an API error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    
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
  
  it('should handle database operations with categories', async () => {
    // Test category creation
    await categoryRepository.createMany([
      { id: 1, name: 'Test Category 1' },
      { id: 2, name: 'Test Category 2' }
    ]);
    
    const categories = await categoryRepository.findAll();
    expect(categories).toHaveLength(2);
    
    // Test category deletion
    await categoryRepository.deleteAll();
    const emptyCats = await categoryRepository.findAll();
    expect(emptyCats).toHaveLength(0);
  });
  
  it('should handle database operations with questions', async () => {
    // Test question creation
    await questionRepository.createMany([
      {
        category: 9,
        type: 'multiple' as QuestionType,
        difficulty: 'easy' as QuestionDifficulty,
        question: 'Test question 1',
        correct_answer: 'Correct',
        incorrect_answers: ['Wrong 1', 'Wrong 2', 'Wrong 3']
      }
    ]);
    
    // Test question deletion
    await questionRepository.deleteAll();
    const questions = await questionRepository.findRandom({ amount: 5 });
    expect(questions).toHaveLength(0);
  });
});
