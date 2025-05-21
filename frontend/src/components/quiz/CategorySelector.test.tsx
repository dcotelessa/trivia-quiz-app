// src/components/quiz/CategorySelector.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import CategorySelector from './CategorySelector';
import { useCategories } from '../../hooks/useGraphQL';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the GraphQL hook
vi.mock('../../hooks/useGraphQL', () => ({
  useCategories: vi.fn()
}));

describe('CategorySelector Component', () => {
  const mockOnChange = vi.fn();
  const mockCategories = [
    { id: 9, name: 'General Knowledge' },
    { id: 10, name: 'Books' },
    { id: 11, name: 'Film' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders category selector with options', () => {
    // Mock successful data loading
    (useCategories as any).mockReturnValue({
      loading: false,
      error: undefined,
      categories: mockCategories
    });

    render(
      <CategorySelector 
        selectedCategory={undefined} 
        onChange={mockOnChange} 
      />
    );
    
    expect(screen.getByText('Select Category:')).toBeInTheDocument();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('General Knowledge')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.getByText('Film')).toBeInTheDocument();
  });

  it('shows loading state when data is being fetched', () => {
    // Mock loading state
    (useCategories as any).mockReturnValue({
      loading: true,
      error: undefined,
      categories: []
    });
    
    render(
      <CategorySelector 
        selectedCategory={undefined} 
        onChange={mockOnChange} 
      />
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', () => {
    // Mock error state
    (useCategories as any).mockReturnValue({
      loading: false,
      error: { message: 'Failed to load categories' },
      categories: []
    });
    
    render(
      <CategorySelector 
        selectedCategory={undefined} 
        onChange={mockOnChange} 
      />
    );
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load categories')).toBeInTheDocument();
  });

  it('calls onChange with correct value when category is selected', () => {
    // Mock successful data loading
    (useCategories as any).mockReturnValue({
      loading: false,
      error: undefined,
      categories: mockCategories
    });

    render(
      <CategorySelector 
        selectedCategory={undefined} 
        onChange={mockOnChange} 
      />
    );
    
    // Select a category
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '10' } });
    
    // Check if onChange was called with the correct value
    expect(mockOnChange).toHaveBeenCalledWith(10);
  });

  it('calls onChange with undefined when "All Categories" is selected', () => {
    // Mock successful data loading
    (useCategories as any).mockReturnValue({
      loading: false,
      error: undefined,
      categories: mockCategories
    });

    render(
      <CategorySelector 
        selectedCategory={10} 
        onChange={mockOnChange} 
      />
    );
    
    // Select "All Categories"
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
    
    // Check if onChange was called with undefined
    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });
});
