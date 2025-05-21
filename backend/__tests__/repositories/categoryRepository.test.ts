import categoryRepository from '../../src/repositories/categoryRepository';
import { CategoryModel } from '../../src/config/db';

describe('Category Repository', () => {
  beforeEach(async () => {
    // Add some test data
    await CategoryModel.insertMany([
      { id: 1, name: 'General Knowledge' },
      { id: 2, name: 'Science' },
      { id: 3, name: 'Sports' }
    ]);
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = await categoryRepository.findAll();
      
      expect(categories).toHaveLength(3);
      expect(categories[0]).toHaveProperty('id');
      expect(categories[0]).toHaveProperty('name');
    });

    it('should handle database errors gracefully', async () => {
      // Mock a database error
      jest.spyOn(CategoryModel, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await expect(categoryRepository.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should return a category by id', async () => {
      const category = await categoryRepository.findById(1);
      
      expect(category).not.toBeNull();
      expect(category?.id).toBe(1);
      expect(category?.name).toBe('General Knowledge');
    });

    it('should return null for non-existent id', async () => {
      const category = await categoryRepository.findById(999);
      expect(category).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(CategoryModel, 'findOne').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await expect(categoryRepository.findById(1)).rejects.toThrow('Database error');
    });
  });

  describe('createMany', () => {
    it('should save multiple categories', async () => {
      // Clear the collection first
      await CategoryModel.deleteMany({});
      
      const categoriesToAdd = [
        { id: 4, name: 'History' },
        { id: 5, name: 'Geography' }
      ];
      
      const result = await categoryRepository.createMany(categoriesToAdd);
      
      // Check returned result
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(4);
      expect(result[1].id).toBe(5);
      
      // Check database
      const count = await CategoryModel.countDocuments();
      expect(count).toBe(2);
    });

    it('should handle empty arrays', async () => {
      const result = await categoryRepository.createMany([]);
      expect(result).toHaveLength(0);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(CategoryModel, 'insertMany').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await expect(categoryRepository.createMany([{ id: 10, name: 'Test' }]))
        .rejects.toThrow('Database error');
    });
  });

  describe('deleteAll', () => {
    it('should delete all categories', async () => {
      await categoryRepository.deleteAll();
      
      const count = await CategoryModel.countDocuments();
      expect(count).toBe(0);
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(CategoryModel, 'deleteMany').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await expect(categoryRepository.deleteAll()).rejects.toThrow('Database error');
    });
  });
});
