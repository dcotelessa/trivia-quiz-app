import { startApp } from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '3001');

const start = async (): Promise<void> => {
  try {
    const server = await startApp();
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
