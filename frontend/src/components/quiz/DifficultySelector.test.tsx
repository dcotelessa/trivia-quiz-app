import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DifficultySelector from './DifficultySelector';
import quizReducer from '../../features/quiz/quizSlice';
import { describe, it, expect, vi } from 'vitest';

describe('DifficultySelector Component', () => {
  // Create a test store
  const store = configureStore({
    reducer: {
      quiz: quizReducer
    }
  });
  
  it('renders difficulty options correctly', () => {
    render(
      <Provider store={store}>
        <DifficultySelector />
      </Provider>
    );
    
    expect(screen.getByText('Select Difficulty:')).toBeInTheDocument();
    expect(screen.getByText('Any Difficulty')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });
  
  it('handles difficulty selection with Redux when not controlled', () => {
    render(
      <Provider store={store}>
        <DifficultySelector />
      </Provider>
    );
    
    // Select a difficulty
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'medium' } });
    
    // Check the Redux store
    expect(store.getState().quiz.selectedDifficulty).toBe('medium');
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
    
    // Select a different difficulty
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'hard' } });
    
    // Check if onChange was called
    expect(mockOnChange).toHaveBeenCalledWith('hard');
    
    // Redux store should not change
    expect(store.getState().quiz.selectedDifficulty).toBe('medium');
  });
  
  it('handles "Any Difficulty" selection correctly', () => {
    // Reset the store
    store.dispatch({ type: 'quiz/selectDifficulty', payload: 'medium' });
    
    render(
      <Provider store={store}>
        <DifficultySelector />
      </Provider>
    );
    
    // Select 'Any Difficulty'
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
    
    // Check the Redux store - should be undefined
    expect(store.getState().quiz.selectedDifficulty).toBeUndefined();
  });
});
