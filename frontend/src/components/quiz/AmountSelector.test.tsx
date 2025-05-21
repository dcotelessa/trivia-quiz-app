// src/components/quiz/AmountSelector.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AmountSelector from './AmountSelector';
import quizReducer from '../../features/quiz/quizSlice';
import { describe, it, expect } from 'vitest';

describe('AmountSelector Component', () => {
  // Create a test store with initial state
  const store = configureStore({
    reducer: {
      quiz: quizReducer
    },
    preloadedState: {
      quiz: {
        questions: [],
        currentQuestion: 0,
        answers: [],
        selectedDifficulty: undefined,
        selectedAmount: 5,
        status: 'idle',
        error: null
      }
    }
  });
  
  it('renders amount options correctly', () => {
    render(
      <Provider store={store}>
        <AmountSelector />
      </Provider>
    );
    
    expect(screen.getByText('Number of Questions:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('5');
    
    // Check all options are present
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4); // 5, 10, 15, 20
    expect(options[0]).toHaveValue('5');
    expect(options[1]).toHaveValue('10');
    expect(options[2]).toHaveValue('15');
    expect(options[3]).toHaveValue('20');
  });
  
  it('handles amount selection and updates Redux store', () => {
    render(
      <Provider store={store}>
        <AmountSelector />
      </Provider>
    );
    
    // Select a different amount
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '15' } });
    
    // Check the Redux store
    expect(store.getState().quiz.selectedAmount).toBe(15);
  });
});
