import React from 'react';
import { useCategories } from '../../hooks/useGraphQL';
// Removed unused imports

interface CategorySelectorProps {
  selectedCategory?: number;
  onChange: (categoryId: number | undefined) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  selectedCategory, 
  onChange 
}) => {
  const { loading, error, categories } = useCategories();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <div>Error</div>
        <div>{error.message || 'Failed to load categories'}</div>
      </div>
    );
  }

  const handleSelectCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    // Safely convert to number or undefined
    onChange(value ? Number(value) : undefined);
  };

  return (
    <div className="form-group">
      <label htmlFor="category-select">Select Category:</label>
      <select 
        id="category-select"
        value={selectedCategory || ''}
        onChange={handleSelectCategory}
        className="form-control"
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelector;
