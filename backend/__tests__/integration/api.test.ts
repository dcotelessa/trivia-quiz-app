import { FastifyInstance } from 'fastify';
import { createServer } from '../../src/app';
import { CategoryModel, QuestionModel } from '../../src/config/db';
import { QuestionType, QuestionDifficulty } from '../../src/models/question';

describe('API Integration Tests', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await createServer();
  });

  beforeEach(async () => {
    // Reset test data
    await CategoryModel.deleteMany({});
    await QuestionModel.deleteMany({});
    
    // Seed test data
    await CategoryModel.create({ id: 9, name: 'General Knowledge' });
    await QuestionModel.create({
      category: 9,
      type: 'multiple' as QuestionType,
      difficulty: 'easy' as QuestionDifficulty,
      question: 'What is the capital of France?',
      correct_answer: 'Paris',
      incorrect_answers: ['London', 'Berlin', 'Madrid']
    });
  });

  afterAll(async () => {
    await server.close();
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/categories'
      });
      
      expect(response.statusCode).toBe(200);
      
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].name).toBe('General Knowledge');
    });
  });

  // Add more integration tests here...
});
