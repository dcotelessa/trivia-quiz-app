import questionRepository from '../../src/repositories/questionRepository';
import { QuestionModel } from '../../src/config/db';
import { QuestionType, QuestionDifficulty } from '../../src/models/question';

describe('Question Repository', () => {
  beforeEach(async () => {
    // Clear existing data first to ensure a clean test environment
    await QuestionModel.deleteMany({});
    
    // Add test data
    await QuestionModel.insertMany([
      {
        category: 9,
        type: 'multiple' as QuestionType,
        difficulty: 'easy' as QuestionDifficulty,
        question: 'What is the capital of France?',
        correct_answer: 'Paris',
        incorrect_answers: ['London', 'Berlin', 'Madrid']
      },
      {
        category: 9,
        type: 'multiple' as QuestionType,
        difficulty: 'medium' as QuestionDifficulty,
        question: 'Which planet is known as the Red Planet?',
        correct_answer: 'Mars',
        incorrect_answers: ['Venus', 'Jupiter', 'Saturn']
      },
      {
        category: 10,
        type: 'multiple' as QuestionType,
        difficulty: 'hard' as QuestionDifficulty,
        question: 'What is the chemical symbol for gold?',
        correct_answer: 'Au',
        incorrect_answers: ['Ag', 'Fe', 'Cu']
      }
    ]);
  });

  describe('findRandom', () => {
    it('should return random questions based on options', async () => {
      // Get the two test questions with category 9
      const categoryQuestions = await QuestionModel.find({ category: 9 }).lean();
      const correctAnswers = categoryQuestions.map(q => q.correct_answer);
      
      const questions = await questionRepository.findRandom({ 
        category: 9, 
        amount: 2 
      });
      
      expect(questions).toHaveLength(2);
      expect(questions[0].category).toBe(9);
      expect(questions[1].category).toBe(9);
      
      // The answers should be shuffled
      expect(questions[0].answers).toHaveLength(4);
      expect(questions[1].answers).toHaveLength(4);
      
      // Check that both questions' answer arrays contain one of our correct answers
      const foundCorrectAnswers = questions.map(q => 
        correctAnswers.some(answer => q.answers.includes(answer))
      );
      
      // Every question should have its correct answer in its answers array
      expect(foundCorrectAnswers.every(found => found)).toBe(true);
    });

    it('should filter by difficulty', async () => {
      const questions = await questionRepository.findRandom({ 
        difficulty: 'hard' as QuestionDifficulty,
        amount: 5
      });
      
      expect(questions).toHaveLength(1); // Only one hard question in test data
      expect(questions[0].difficulty).toBe('hard');
    });

    it('should handle empty results gracefully', async () => {
      const questions = await questionRepository.findRandom({ 
        category: 999, // Non-existent category
        amount: 5
      });
      
      expect(questions).toHaveLength(0);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(QuestionModel, 'aggregate').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await expect(questionRepository.findRandom({ amount: 5 }))
        .rejects.toThrow('Database error');
    });
  });

  // The rest of your tests remain unchanged
  describe('createMany', () => {
    it('should save multiple questions', async () => {
      // Clear the collection first
      await QuestionModel.deleteMany({});
      
      const questionsToAdd = [
        {
          category: 11,
          type: 'multiple' as QuestionType,
          difficulty: 'easy' as QuestionDifficulty,
          question: 'What is 2+2?',
          correct_answer: '4',
          incorrect_answers: ['3', '5', '6']
        },
        {
          category: 11,
          type: 'multiple' as QuestionType,
          difficulty: 'medium' as QuestionDifficulty,
          question: 'What is the square root of 16?',
          correct_answer: '4',
          incorrect_answers: ['2', '8', '3']
        }
      ];
      
      const result = await questionRepository.createMany(questionsToAdd);
      
      expect(result).toHaveLength(2);
      
      const count = await QuestionModel.countDocuments();
      expect(count).toBe(2);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(QuestionModel, 'insertMany').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await expect(questionRepository.createMany([{
        category: 11,
        type: 'multiple' as QuestionType,
        difficulty: 'easy' as QuestionDifficulty,
        question: 'Test',
        correct_answer: 'Test',
        incorrect_answers: ['Test']
      }])).rejects.toThrow('Database error');
    });
  });

  describe('deleteAll', () => {
    it('should delete all questions', async () => {
      await questionRepository.deleteAll();
      
      const count = await QuestionModel.countDocuments();
      expect(count).toBe(0);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(QuestionModel, 'deleteMany').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await expect(questionRepository.deleteAll()).rejects.toThrow('Database error');
    });
  });
});
