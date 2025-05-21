import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import QuizControls from './QuizControls';
import quizReducer from '../../features/quiz/quizSlice';
import resultsReducer from '../../features/results/resultsSlice';
import { QuizAnswer } from '../../types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Create a mock store with middleware to intercept dispatch calls
const createMockStore = (
  questions: any[] = [],
  answers: QuizAnswer[] = [],
  currentQuestion: number = 0
) => {
  return configureStore({
    reducer: {
      quiz: quizReducer,
      results: resultsReducer
    },
    preloadedState: {
      quiz: {
        questions,
        answers,
        currentQuestion,
        selectedDifficulty: 'medium' as const,
        selectedAmount: 5,
        status: 'succeeded' as const,
        error: null
      },
      results: {
        results: null,
        status: 'idle' as const,
        error: null
      }
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: undefined,
        },
      })
  });
};

describe('QuizControls Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders progress correctly', () => {
    const mockQuestions = [
      { id: '1', question: 'Q1', answers: ['A', 'B'], category: 9, difficulty: 'easy' },
      { id: '2', question: 'Q2', answers: ['C', 'D'], category: 9, difficulty: 'easy' },
      { id: '3', question: 'Q3', answers: ['E', 'F'], category: 9, difficulty: 'easy' }
    ];
    
    const mockAnswers = [
      { questionId: '1', answer: 'A' },
      { questionId: '2', answer: 'C' }
    ];
    
    const store = createMockStore(mockQuestions, mockAnswers);
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <QuizControls />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('Questions answered: 2 of 3')).toBeInTheDocument();
    
    // Progress bar should be at around 67%
    const progressFill = document.querySelector('.progress-fill') as HTMLElement;
    expect(progressFill).toHaveStyle('width: 67%');
  });

  it('shows submit button when quiz is complete', () => {
    const mockQuestions = [
      { id: '1', question: 'Q1', answers: ['A', 'B'], category: 9, difficulty: 'easy' },
      { id: '2', question: 'Q2', answers: ['C', 'D'], category: 9, difficulty: 'easy' }
    ];
    
    const mockAnswers = [
      { questionId: '1', answer: 'A' },
      { questionId: '2', answer: 'C' }
    ];
    
    const store = createMockStore(mockQuestions, mockAnswers);
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <QuizControls />
        </BrowserRouter>
      </Provider>
    );
    
    const submitButton = screen.getByText('Submit Quiz');
    expect(submitButton).toBeInTheDocument();
  });

  it('navigates to results page when quiz is submitted', async () => {
    const mockQuestions = [
      { id: '1', question: 'Q1', answers: ['A', 'B'], category: 9, difficulty: 'easy' },
      { id: '2', question: 'Q2', answers: ['C', 'D'], category: 9, difficulty: 'easy' }
    ];
    
    const mockAnswers = [
      { questionId: '1', answer: 'A' },
      { questionId: '2', answer: 'C' }
    ];
    
    const store = createMockStore(mockQuestions, mockAnswers);

    // Mock the dispatch function to resolve the submitQuizAnswers thunk
    const originalDispatch = store.dispatch;
    store.dispatch = vi.fn().mockImplementation((action) => {
      if (typeof action === 'function') {
        // This is a thunk, resolve it immediately
        return Promise.resolve({ type: 'results/submitQuizAnswers/fulfilled' });
      }
      return originalDispatch(action);
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <QuizControls />
        </BrowserRouter>
      </Provider>
    );
    
    const submitButton = screen.getByText('Submit Quiz');
    fireEvent.click(submitButton);
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/results');
    });
  });

  it('shows info message when quiz is incomplete', () => {
    const mockQuestions = [
      { id: '1', question: 'Q1', answers: ['A', 'B'], category: 9, difficulty: 'easy' },
      { id: '2', question: 'Q2', answers: ['C', 'D'], category: 9, difficulty: 'easy' }
    ];
    
    const mockAnswers = [
      { questionId: '1', answer: 'A' }
    ];
    
    // Set currentQuestion to the last question
    const store = createMockStore(mockQuestions, mockAnswers, 1);
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <QuizControls />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText('Please answer all questions before submitting.')).toBeInTheDocument();
    expect(screen.queryByText('Submit Quiz')).not.toBeInTheDocument();
  });
});
