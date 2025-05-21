// Types for question difficulty and type
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple' | 'boolean'; // do we have a boolean?

// Question model - trivia question
export interface Question {
  id?: string;
  category: number;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

/**
 * Question data transfer object for API responses
 * Doesn't include the correct answer to prevent cheating
 */
export interface QuestionDTO {
  id: string;
  category: number;
  difficulty: QuestionDifficulty;
  question: string;
  answers: string[];
}

/**
 * Quiz options to filtering questions
 */
export interface QuizOptions {
  category?: number;
  difficulty?: QuestionDifficulty;
  amount?: number;
}

/**
 * Answer - submission from user
 */
export interface QuizAnswer {
  questionId: string;
  answer: string;
}

/**
 * Result - single question
 */
export interface QuestionResult {
  questionId: string;
  question: string;
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  allAnswers: string[];
}

/**
 * Quiz result - overall
 */
export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  results: QuestionResult[];
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
