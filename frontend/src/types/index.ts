// Category types
export interface Category {
  id: number;
  name: string;
}

// Question types
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple' | 'boolean';

export interface Question {
  id: string;
  category: number;
  difficulty: QuestionDifficulty;
  question: string;
  answers: string[];
}

export interface QuizOptions {
  category?: number;
  difficulty?: QuestionDifficulty;
  amount?: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
}

export interface QuestionResult {
  questionId: string;
  question: string;
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  allAnswers: string[];
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  results: QuestionResult[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
