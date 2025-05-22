import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DifficultySelector from './DifficultySelector';
import quizReducer from '../../features/quiz/quizSlice';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('DifficultySelector Component', () => {
  let store: ReturnType<typeof configureStore>;
  
  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
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
  });
  
  it('renders difficulty options correctly', () => {
    render(
      <Provider store={store}>
        <DifficultySelector />
      </Provider>
    );
    
    // Check if the label is rendered (actual text from the component)
    expect(screen.getByText('Difficulty:')).toBeInTheDocument();
    
    // Check if the select element is present
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveAttribute('id', 'difficulty-select');
    
    // Check that we have 4 options
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    
    // Check specific option values and text
    expect(options[0]).toHaveValue('');
    expect(options[0]).toHaveTextContent('Any Difficulty');
    
    expect(options[1]).toHaveValue('easy');
    expect(options[1]).toHaveTextContent('Easy');
    
    expect(options[2]).toHaveValue('medium');
    expect(options[2]).toHaveTextContent('Medium');
    
    expect(options[3]).toHaveValue('hard');
    expect(options[3]).toHaveTextContent('Hard');
    
    // Check default selection (should be empty string for "Any Difficulty")
    expect(selectElement).toHaveValue('');
  });
  
  it('handles difficulty selection with Redux when not controlled', () => {
    render(
      <Provider store={store}>
        <DifficultySelector />
      </Provider>
    );
    
    const selectElement = screen.getByRole('combobox');
    
    // Select a difficulty
    fireEvent.change(selectElement, { target: { value: 'medium' } });
    
    // Check the Redux store
    expect(store.getState().quiz.selectedDifficulty).toBe('medium');
    
    // Check that the select shows the new value
    expect(selectElement).toHaveValue('medium');
  });
  
  it('calls onChange prop when controlled', () => {
    const mockOnChange = vi.fn();
    
    render(
      <Provider store={store}>
        <DifficultySelector 
          selectedDifficulty="easy"
          onChange={mockOnChange}
        />
      </Provider>
    );
    
    const selectElement = screen.getByRole('combobox');
    
    // Check that the controlled value is set
    expect(selectElement).toHaveValue('easy');
    
    // Select a different difficulty
    fireEvent.change(selectElement, { target: { value: 'hard' } });
    
    // Check if onChange was called
    expect(mockOnChange).toHaveBeenCalledWith('hard');
    
    // Redux store should not change when controlled
    expect(store.getState().quiz.selectedDifficulty).toBeUndefined();
  });
  
  it('handles "Any Difficulty" selection correctly', () => {
    // First set a difficulty in the store
    store.dispatch({ type: 'quiz/selectDifficulty', payload: 'medium' });
    
    render(
      <Provider store={store}>
        <DifficultySelector />
      </Provider>
    );
    
    const selectElement = screen.getByRole('combobox');
    
    // Should show the current difficulty
    expect(selectElement).toHaveValue('medium');
    
    // Select 'Any Difficulty' (empty value)
    fireEvent.change(selectElement, { target: { value: '' } });
    
    // Check the Redux store - should be undefined
    expect(store.getState().quiz.selectedDifficulty).toBeUndefined();
    
    // Check that the select shows empty value
    expect(selectElement).toHaveValue('');
  });
});
