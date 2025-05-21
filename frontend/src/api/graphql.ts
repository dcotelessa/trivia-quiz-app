import { gql } from '@apollo/client';

// Query to fetch all categories
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

// Query to fetch a single category
export const GET_CATEGORY = gql`
  query GetCategory($id: Int!) {
    category(id: $id) {
      id
      name
    }
  }
`;

// Query to fetch quiz questions
export const GET_QUIZ_QUESTIONS = gql`
  query GetQuizQuestions($options: QuizOptionsInput) {
    quiz(options: $options) {
      id
      category
      difficulty
      question
      answers
    }
  }
`;

// Mutation to submit quiz answers
export const SUBMIT_QUIZ = gql`
  mutation SubmitQuiz($answers: [QuizAnswerInput!]!) {
    submitQuiz(answers: $answers) {
      score
      totalQuestions
      percentage
      results {
        questionId
        question
        correct
        selectedAnswer
        correctAnswer
        allAnswers
      }
    }
  }
`;
