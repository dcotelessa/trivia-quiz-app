import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CategorySelector from './CategorySelector';

const mockStore = configureStore([]);

describe('CategorySelector Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      categories: {
        categories: [
          { id: 9, name: 'General Knowledge' },
          { id: 10, name: 'Books' },
          { id: 11, name: 'Film' }
        ],
        status: 'succeeded',
        error: null,
        selectedCategory: undefined
      }
    });
    
    store.dispatch = jest.fn();
  });

  it('renders category selector with options', () => {
    render(
      <Provider store={store}>
        <CategorySelector />
      </Provider>
    );
    
    expect(screen.getByText('Select Category:')).toBeInTheDocument();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('General Knowledge')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.getByText('Film')).toBeInTheDocument();
  });

  it('shows loading state when status is loading', () => {
    store = mockStore({
      categories: {
        categories: [],
        status: 'loading',
        error: null,
        selectedCategory: undefined
      }
    });
    
    render(
      <Provider store={store}>
        <CategorySelector />
      </Provider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message when status is failed', () => {
    store = mockStore({
      categories: {
        categories: [],
        status: 'failed',
        error: 'Failed to load categories',
        selectedCategory: undefined
      }
    });
    
    render(
      <Provider store={store}>
        <CategorySelector />
      </Provider>
    );
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load categories')).toBeInTheDocument();
  });
});
