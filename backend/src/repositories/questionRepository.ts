import mongoose from 'mongoose';
import { 
  Question, 
  QuestionDTO, 
  QuizOptions 
} from '../models/question';
import { QuestionModel } from '../config/db';
import { shuffleArray } from '../utils/helpers';

/**
 * Repository - question data operations
 */
class QuestionRepository {
  /**
   * Find random questions based on options
   * @param options Quiz options for filtering
   * @returns List of questions transformed for client
   */
  async findRandom(options: QuizOptions): Promise<QuestionDTO[]> {
    try {
      const { category, difficulty, amount = 5 } = options;
      
      // Create filter object
      const filter: Record<string, any> = {};
      
      if (category !== undefined) {
        filter.category = category;
      }
      
      if (difficulty) {
        filter.difficulty = difficulty;
      }

      // Get random questions based on the filter
      const questions = await QuestionModel.aggregate([
        { $match: filter },
        { $sample: { size: amount } }
      ]);

      // Transform questions for client and hide correct answers - prevent cheating
      return questions.map((q: any) => {
        // Create a shuffled array of all answers
        const allAnswers = [...q.incorrect_answers, q.correct_answer];
        const shuffledAnswers = shuffleArray(allAnswers);
        
        return {
          id: q._id.toString(),
          category: q.category,
          difficulty: q.difficulty,
          question: q.question,
          answers: shuffledAnswers
        };
      });
    } catch (error) {
      console.error('Error fetching random questions:', error);
      throw error;
    }
  }

  /**
   * Find questions by IDs
   * @param ids List of question IDs
   * @returns List of questions
   */
  async findByIds(ids: string[]): Promise<Question[]> {
    try {
      const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
      const questions = await QuestionModel.find({ _id: { $in: objectIds } });
      
      return questions.map(q => ({
        id: q._id.toString(),
        category: q.category,
        type: q.type as 'multiple' | 'boolean',
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
        question: q.question,
        correct_answer: q.correct_answer,
        incorrect_answers: q.incorrect_answers
      }));
    } catch (error) {
      console.error('Error finding questions by IDs:', error);
      throw error;
    }
  }

  /**
   * Create a new question
   * @param question Question to create
   * @returns Created question
   */
  async create(question: Question): Promise<Question> {
    try {
      const newQuestion = await QuestionModel.create(question);
      
      return {
        id: newQuestion._id.toString(),
        category: newQuestion.category,
        type: newQuestion.type as 'multiple' | 'boolean',
        difficulty: newQuestion.difficulty as 'easy' | 'medium' | 'hard',
        question: newQuestion.question,
        correct_answer: newQuestion.correct_answer,
        incorrect_answers: newQuestion.incorrect_answers
      };
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  /**
   * Create multiple questions
   * @param questions List of questions to create
   * @returns Created questions
   */
  async createMany(questions: Question[]): Promise<Question[]> {
    try {
      await QuestionModel.insertMany(questions);
      return questions;
    } catch (error) {
      console.error('Error creating questions:', error);
      throw error;
    }
  }

  /**
   * Delete all questions
   */
  async deleteAll(): Promise<void> {
    try {
      await QuestionModel.deleteMany({});
    } catch (error) {
      console.error('Error deleting questions:', error);
      throw error;
    }
  }
}

export default new QuestionRepository();
