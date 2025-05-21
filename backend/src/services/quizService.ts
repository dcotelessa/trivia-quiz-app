import {
  QuestionDTO,
  QuizOptions,
  QuizAnswer,
  QuizResult,
  QuestionResult
} from '../models/question';
import questionRepository from '../repositories/questionRepository';

/**
 * Service - quiz-related logic
 */
class QuizService {
  /**
   * Get questions for a quiz
   * @param options Options for filtering questions
   * @returns List of questions
   */
  async getQuestions(options: QuizOptions): Promise<QuestionDTO[]> {
    try {
      return await questionRepository.findRandom(options);
    } catch (error) {
      console.error('Error in quiz service - getQuestions:', error);
      throw error;
    }
  }

  /**
   * Score a quiz based on submitted answers
   * @param answers List of submitted answers
   * @returns Quiz results with score
   */
  async scoreQuiz(answers: QuizAnswer[]): Promise<QuizResult> {
    try {
      if (!Array.isArray(answers) || answers.length === 0) {
        throw new Error('Invalid answers format');
      }

      const questionIds = answers.map(a => a.questionId);
      const questions = await questionRepository.findByIds(questionIds);

      const questionsMap: Record<string, any> = {};
      questions.forEach(q => {
        if (q.id) {
          questionsMap[q.id] = q;
        }
      });

      let score = 0;
      const results: QuestionResult[] = [];

      answers.forEach(answer => {
        const question = questionsMap[answer.questionId];
        
        if (!question) {
          results.push({
            questionId: answer.questionId,
            question: 'Question not found',
            correct: false,
            selectedAnswer: answer.answer,
            correctAnswer: '',
            allAnswers: []
          });
          return;
        }

        const isCorrect = answer.answer === question.correct_answer;
        
        if (isCorrect) {
          score++;
        }

        results.push({
          questionId: answer.questionId,
          question: question.question,
          correct: isCorrect,
          selectedAnswer: answer.answer,
          correctAnswer: question.correct_answer,
          allAnswers: [...question.incorrect_answers, question.correct_answer]
        });
      });

      return {
        score,
        totalQuestions: answers.length,
        percentage: Math.round((score / answers.length) * 100),
        results
      };
    } catch (error) {
      console.error('Error in quiz service - scoreQuiz:', error);
      throw error;
    }
  }
}

export default new QuizService();
