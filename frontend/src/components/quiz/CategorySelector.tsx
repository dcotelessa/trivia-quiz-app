import React from 'react';
import { useCategories } from '../../hooks/useGraphQL';
import Loader from '../ui/Loader';
import ErrorMessage from '../ui/ErrorMessage';

interface CategorySelectorProps {
  selectedCategory?: number;
  onChange: (categoryId: number | undefined) => void;
}

const CategorySelectorWithGraphQL: React.FC<CategorySelectorProps> = ({ selectedCategory, onChange }) => {
  const { loading, error, categories } = useCategories();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error.message || 'Failed to load categories'} />;
  }

  const handleSelectCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
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

export default CategorySelectorWithGraphQL;
