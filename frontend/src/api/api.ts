import { ApiResponse, Category, Question, QuizAnswer, QuizOptions, QuizResult } from '../types';

const API_URL = (import.meta.env?.VITE_API_URL as string) || 'http://localhost:3001/api';

// Helper function - handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }
  
  const data: ApiResponse<T> = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data.data as T;
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`);
  const apiResponse = await handleResponse<Category[]>(response);
  return apiResponse;
}

// Get quiz questions
export async function getQuizQuestions(options: QuizOptions): Promise<Question[]> {
  const queryParams = new URLSearchParams();
  
  if (options.category) {
    queryParams.append('category', options.category.toString());
  }
  
  if (options.difficulty) {
    queryParams.append('difficulty', options.difficulty);
  }
  
  if (options.amount) {
    queryParams.append('amount', options.amount.toString());
  }
  
  const response = await fetch(`${API_URL}/quiz?${queryParams.toString()}`);
  const apiResponse = await handleResponse<{ questions: Question[], count: number }>(response);
  return apiResponse.questions;
}

// Submit quiz answers
export async function submitQuiz(answers: QuizAnswer[]): Promise<QuizResult> {
  const response = await fetch(`${API_URL}/quiz/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers }),
  });
  
  const apiResponse = await handleResponse<QuizResult>(response);
  return apiResponse;
}
