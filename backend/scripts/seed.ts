import connectDB from '../src/config/db';
import categoryRepository from '../src/repositories/categoryRepository';
import questionRepository from '../src/repositories/questionRepository';
import { Category } from '../src/models/category';
import { Question } from '../src/models/question';

const CATEGORIES_API = 'https://opentdb.com/api_category.php';
const QUESTIONS_API = 'https://opentdb.com/api.php';
const RATE_LIMIT_DELAY = 5000; // 5 seconds between requests

// OpenTDB API responses types
interface OpenTDBCategoryResponse {
  trivia_categories: Category[];
}

interface OpenTDBQuestionResponse {
  response_code: number;
  results: Array<{
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }>;
}

/**
 * Sleep helper function
 * @param ms Milliseconds to sleep
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch and seed categories from the API
 * @returns List of seeded categories
 */
const seedCategories = async (): Promise<Category[]> => {
  try {
    console.log('Fetching categories from OpenTDB API...');
    const response = await fetch(CATEGORIES_API);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }
    
    const data: OpenTDBCategoryResponse = await response.json();
    const categories = data.trivia_categories;

    await categoryRepository.deleteAll();
    console.log('Existing categories cleared');

    await categoryRepository.createMany(categories);
    console.log(`${categories.length} categories seeded successfully`);
    
    return categories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

/**
 * Fetch and seed questions for each category and difficulty
 * @param categories List of categories to seed questions for
 */
const seedQuestions = async (categories: Category[]): Promise<void> => {
  try {
    await questionRepository.deleteAll();
    console.log('Existing questions cleared');

    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    const questionsPerBatch = 5;
    let totalQuestionsSeeded = 0;

    console.log('Fetching questions from OpenTDB API...');
    console.log(`Using a ${RATE_LIMIT_DELAY/1000}-second delay between requests to respect rate limits...`);
    
    // Process categories one at a time
    for (const category of categories) {
      console.log(`\nProcessing category: ${category.name} (ID: ${category.id})`);
      
      for (const difficulty of difficulties) {
        try {
          // Respect the rate limit with a consistent 5-second delay
          console.log(`Waiting ${RATE_LIMIT_DELAY/1000} seconds before fetching ${difficulty} questions for "${category.name}"...`);
          await sleep(RATE_LIMIT_DELAY);
          
          const url = new URL(QUESTIONS_API);
          url.searchParams.append('amount', questionsPerBatch.toString());
          url.searchParams.append('category', category.id.toString());
          url.searchParams.append('difficulty', difficulty);
          url.searchParams.append('type', 'multiple');
          
          console.log(`Fetching ${difficulty} questions for "${category.name}"...`);
          const response = await fetch(url.toString());
          
          if (response.status === 429) {
            console.log(`Rate limited (429) when fetching "${category.name}" (${difficulty}). Waiting 15 seconds before continuing...`);
            await sleep(15000); // Wait longer if we hit a rate limit
            console.log(`Skipping "${category.name}" (${difficulty}) for now and continuing with next...`);
            continue;
          }
          
          if (!response.ok) {
            console.warn(`Failed to fetch questions for category ${category.name} (${difficulty}): ${response.status} ${response.statusText}`);
            continue;
          }
          
          const data: OpenTDBQuestionResponse = await response.json();

          // Check for valid results
          if (data.response_code === 0 && data.results.length > 0) {
            const questions: Question[] = data.results.map(q => ({
              category: category.id,
              type: q.type as 'multiple' | 'boolean',
              difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
              question: q.question,
              correct_answer: q.correct_answer,
              incorrect_answers: q.incorrect_answers
            }));

            await questionRepository.createMany(questions);
            totalQuestionsSeeded += questions.length;
            console.log(`✓ Added ${questions.length} ${difficulty} questions for "${category.name}"`);
          } else {
            console.log(`✗ No ${difficulty} questions available for "${category.name}"`);
          }
        } catch (error) {
          const err = error as Error;
          console.error(`Error fetching ${difficulty} questions for category ${category.name}:`, err.message);
          // Continue with the next difficulty, but wait a bit longer
          await sleep(5000);
        }
      }
      
      // Add a small status update after each category
      console.log(`Completed category: ${category.name}. Progress: ${totalQuestionsSeeded} questions seeded so far.`);
    }

    console.log(`\n=======================================`);
    console.log(`✓ Database seeding complete!`);
    console.log(`✓ Total of ${totalQuestionsSeeded} questions seeded successfully`);
    console.log(`=======================================`);
  } catch (error) {
    console.error('Error seeding questions:', error);
    throw error;
  }
};

/**
 * Main seed function
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();
    console.log('Connected to database. Starting seed process...');
    
    const categories = await seedCategories();
    console.log('\nStarting to seed questions...');
    await seedQuestions(categories);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
};

// Only run if called directly (not imported)
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
