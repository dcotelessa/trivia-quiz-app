import connectDB from '../src/config/db';
import { CategoryModel, QuestionModel } from '../src/config/db';
import { seedDatabase } from './seed';

async function checkAndSeed() {
  try {
    await connectDB();
    
    // Check if we already have data
    const categoryCount = await CategoryModel.countDocuments();
    const questionCount = await QuestionModel.countDocuments();
    
    console.log(`Database currently has ${categoryCount} categories and ${questionCount} questions`);
    
    if (categoryCount > 0 && questionCount > 0) {
      console.log('Database already contains data. Skipping seed process.');
      return;
    } else {
      console.log('Database is empty or missing data. Starting seed process...');
      await seedDatabase();
      console.log('Seed process completed successfully.');
    }
  } catch (error) {
    console.error('Error checking database:', error);
    throw error;
  }
}

// Run the check and seed process
if (require.main === module) {
  checkAndSeed()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

export default checkAndSeed;
