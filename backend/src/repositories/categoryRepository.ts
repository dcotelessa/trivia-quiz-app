import { Category, CategoryDTO } from '../models/category';
import { CategoryModel } from '../config/db';

/**
 * Repository - category data operations
 */
class CategoryRepository {
  /**
   * Find all categories
   * @returns List of categories
   */
  async findAll(): Promise<Category[]> {
    try {
      const categories = await CategoryModel.find().sort({ name: 1 });
      return categories.map(cat => ({
        id: cat.id,
        name: cat.name
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Find a category by ID
   * @param id Category ID
   * @returns Category object or null if not found
   */
  async findById(id: number): Promise<Category | null> {
    try {
      const category = await CategoryModel.findOne({ id });
      if (!category) return null;
      
      return {
        id: category.id,
        name: category.name
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new category
   * @param category Category to create
   * @returns Created category
   */
  async create(category: Category): Promise<Category> {
    try {
      const newCategory = await CategoryModel.create(category);
      return {
        id: newCategory.id,
        name: newCategory.name
      };
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Create multiple categories
   * @param categories List of categories to create
   * @returns Created categories
   */
  async createMany(categories: Category[]): Promise<Category[]> {
    try {
      await CategoryModel.insertMany(categories);
      return categories;
    } catch (error) {
      console.error('Error creating categories:', error);
      throw error;
    }
  }

  /**
   * Delete all categories
   */
  async deleteAll(): Promise<void> {
    try {
      await CategoryModel.deleteMany({});
    } catch (error) {
      console.error('Error deleting categories:', error);
      throw error;
    }
  }
}

export default new CategoryRepository();
