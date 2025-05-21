import { Category } from '../models/category';
import categoryRepository from '../repositories/categoryRepository';

/**
 * Service - category-related logic
 */
class CategoryService {
  /**
   * Get all categories
   * @returns List of categories
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      return await categoryRepository.findAll();
    } catch (error) {
      console.error('Error in category service - getAllCategories:', error);
      throw error;
    }
  }

  /**
   * Get a category by ID
   * @param id Category ID
   * @returns Category or null if not found
   */
  async getCategoryById(id: number): Promise<Category | null> {
    try {
      return await categoryRepository.findById(id);
    } catch (error) {
      console.error(`Error in category service - getCategoryById ${id}:`, error);
      throw error;
    }
  }
}

export default new CategoryService();
