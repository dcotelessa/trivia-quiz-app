import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ApiResponse } from '../models/question';
import { Category } from '../models/category';
import categoryService from '../services/categoryService';

/**
 * Routes for categories
 * @param fastify Fastify instance
 */
export default async function categoryRoutes(fastify: FastifyInstance): Promise<void> {
  // Get all categories - "/"
  fastify.get<{
    Reply: ApiResponse<Category[]>
  }>('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const categories = await categoryService.getAllCategories();
      return { success: true, data: categories };
    } catch (error) {
      request.log.error(error);
      const err = error as Error;
      return reply.code(500).send({ 
        success: false, 
        message: 'Error fetching categories', 
        error: err.message 
      });
    }
  });

  // Get a category by ID - "/:id"
  fastify.get<{
    Params: { id: string },
    Reply: ApiResponse<Category | null>
  }>('/:id', async (request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const category = await categoryService.getCategoryById(parseInt(id));
      
      if (!category) {
        return reply.code(404).send({ 
          success: false, 
          message: `Category with ID ${id} not found` 
        });
      }
      
      return { success: true, data: category };
    } catch (error) {
      request.log.error(error);
      const err = error as Error;
      return reply.code(500).send({ 
        success: false, 
        message: 'Error fetching category', 
        error: err.message 
      });
    }
  });
}
