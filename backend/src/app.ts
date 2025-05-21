import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import connectDB from './config/db';
import categoryRoutes from './routes/categories';
import quizRoutes from './routes/quiz';

/**
 * Create and configure the Fastify server
 * @returns Configured Fastify server
 */
export async function createServer(): Promise<FastifyInstance> {
  // Create fastify instance
  const server: FastifyInstance = fastify({ logger: true });

  // Register plugins
  await server.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  });

  // Register routes with prefixes, categories and quiz
  server.register(categoryRoutes, { prefix: '/api/categories' });
  server.register(quizRoutes, { prefix: '/api/quiz' });

  // Root route
  server.get('/', async (request, reply) => {
    return { message: 'Welcome to Trivia Quiz API' };
  });

  return server;
}

/**
 * Start the application
 * @returns Configured Fastify server
 */
export async function startApp(): Promise<FastifyInstance> {
  try {
    await connectDB();
    const server = await createServer();
    
    return server;
  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}
