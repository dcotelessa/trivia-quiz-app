import categoryService from '../services/categoryService';
import quizService from '../services/quizService';
import { QuizAnswer, QuizOptions } from '../models/question';

const resolvers = {
  Query: {
    // Get all categories
    categories: async () => {
      return await categoryService.getAllCategories();
    },
    
    // Get a category by ID
    category: async (_: any, { id }: { id: number }) => {
      return await categoryService.getCategoryById(id);
    },
    
    // Get quiz questions
    quiz: async (_: any, { options }: { options: QuizOptions }) => {
      return await quizService.getQuestions(options);
    }
  },
  
  Mutation: {
    // Submit quiz answers
    submitQuiz: async (_: any, { answers }: { answers: QuizAnswer[] }) => {
      return await quizService.scoreQuiz(answers);
    }
  }
};

export default resolvers;
