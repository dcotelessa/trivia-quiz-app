import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { 
  ApiResponse, 
  QuestionDTO, 
  QuizAnswer, 
  QuizResult 
} from '../models/question';
import quizService from '../services/quizService';

/**
 * Routes for quiz functionality
 * @param fastify Fastify instance
 */
export default async function quizRoutes(fastify: FastifyInstance): Promise<void> {
  // Get questions for a quiz - "/"
  fastify.get<{
    Querystring: {
      category?: string;
      difficulty?: 'easy' | 'medium' | 'hard';
      amount?: string;
    },
    Reply: ApiResponse<{ questions: QuestionDTO[], count: number }>
  }>('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          category: { type: 'number' },
          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
          amount: { type: 'number', default: 5 }
        }
      }
    }
  }, async (request: FastifyRequest<{
    Querystring: {
      category?: string;
      difficulty?: 'easy' | 'medium' | 'hard';
      amount?: string;
    }
  }>, reply: FastifyReply) => {
    try {
      const { category, difficulty, amount } = request.query;
      
      const questions = await quizService.getQuestions({
        category: category ? parseInt(category) : undefined,
        difficulty,
        amount: amount ? parseInt(amount) : 5
      });
      
      return { 
        success: true, 
        data: { 
          questions,
          count: questions.length
        } 
      };
    } catch (error) {
      request.log.error(error);
      const err = error as Error;
      return reply.code(500).send({ 
        success: false, 
        message: 'Error fetching quiz questions', 
        error: err.message 
      });
    }
  });

  // Score a quiz - "/score"
  fastify.post<{
    Body: {
      answers: QuizAnswer[]
    },
    Reply: ApiResponse<QuizResult>
  }>('/score', {
    schema: {
      body: {
        type: 'object',
        required: ['answers'],
        properties: {
          answers: {
            type: 'array',
            items: {
              type: 'object',
              required: ['questionId', 'answer'],
              properties: {
                questionId: { type: 'string' },
                answer: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{
    Body: {
      answers: QuizAnswer[]
    }
  }>, reply: FastifyReply) => {
    try {
      const { answers } = request.body;
      
      const results = await quizService.scoreQuiz(answers);
      
      return { 
        success: true, 
        data: results 
      };
    } catch (error) {
      request.log.error(error);
      const err = error as Error;
      return reply.code(500).send({ 
        success: false, 
        message: 'Error scoring quiz', 
        error: err.message 
      });
    }
  });
}
