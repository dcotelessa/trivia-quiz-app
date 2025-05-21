import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { GET_CATEGORIES, GET_CATEGORY, GET_QUIZ_QUESTIONS, SUBMIT_QUIZ } from '../api/graphql';
import { Category, Question, QuizAnswer, QuizOptions, QuizResult } from '../types';

// Hook for fetching categories
export function useCategories() {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  
  return {
    loading,
    error: error as ApolloError | undefined,
    categories: data?.categories as Category[] || []
  };
}

// Hook for fetching a single category
export function useCategory(id: number) {
  const { loading, error, data } = useQuery(GET_CATEGORY, {
    variables: { id },
    skip: !id
  });
  
  return {
    loading,
    error: error as ApolloError | undefined,
    category: data?.category as Category | null
  };
}

// Hook for fetching quiz questions
export function useQuizQuestions(options: QuizOptions) {
  const { loading, error, data } = useQuery(GET_QUIZ_QUESTIONS, {
    variables: { options },
    skip: !options.amount
  });
  
  return {
    loading,
    error: error as ApolloError | undefined,
    questions: data?.quiz as Question[] || []
  };
}

// Hook for submitting quiz answers
export function useSubmitQuiz() {
  const [submitQuizMutation, { loading, error, data }] = useMutation(SUBMIT_QUIZ);
  
  const submitQuiz = async (answers: QuizAnswer[]) => {
    const result = await submitQuizMutation({
      variables: { answers }
    });
    
    return result.data?.submitQuiz as QuizResult;
  };
  
  return {
    submitQuiz,
    loading,
    error: error as ApolloError | undefined,
    result: data?.submitQuiz as QuizResult | null
  };
}
