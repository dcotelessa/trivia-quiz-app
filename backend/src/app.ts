import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import mercurius from 'mercurius';
import connectDB from './config/db';
import categoryRoutes from './routes/categories';
import quizRoutes from './routes/quiz';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';

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

  // Register GraphQL
  await server.register(mercurius, {
    schema,
    resolvers,
    graphiql: true,  // Enable GraphiQL interface
    path: '/graphql'
  });

  // Register REST routes with prefixes
  server.register(categoryRoutes, { prefix: '/api/categories' });
  server.register(quizRoutes, { prefix: '/api/quiz' });

  // Root route
  server.get('/', async (request, reply) => {
    return { 
      message: 'Welcome to Trivia Quiz API',
      endpoints: {
        rest: {
          categories: '/api/categories',
          quiz: '/api/quiz'
        },
        graphql: '/graphql'
      }
    };
  });

  return server;
}

/**
 * Start the app
 * @returns Configured Fastify server
 */
export async function startApp(): Promise<FastifyInstance> {
  try {
    await connectDB();
    const server = await createServer();
    
    return server;
  } catch (error) {
    console.error('Failed to start the app:', error);
    process.exit(1);
  }
}
