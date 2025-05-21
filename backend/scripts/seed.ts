import connectDB from '../src/config/db';
import categoryRepository from '../src/repositories/categoryRepository';
import questionRepository from '../src/repositories/questionRepository';
import { Category } from '../src/models/category';
import { Question } from '../src/models/question';

const CATEGORIES_API = 'https://opentdb.com/api_category.php';
const QUESTIONS_API = 'https://opentdb.com/api.php';

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
    
    // Fetch questions for each category and difficulty
    for (const category of categories) {
      for (const difficulty of difficulties) {
        try {
          // Let's add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const url = new URL(QUESTIONS_API);
          url.searchParams.append('amount', questionsPerBatch.toString());
          url.searchParams.append('category', category.id.toString());
          url.searchParams.append('difficulty', difficulty);
          url.searchParams.append('type', 'multiple');
          
          const response = await fetch(url.toString());
          
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
            console.log(`Added ${questions.length} questions for category "${category.name}" with ${difficulty} difficulty`);
          } else {
            console.log(`No questions available for category "${category.name}" with ${difficulty} difficulty`);
          }
        } catch (error) {
          const err = error as Error;
          console.error(`Error fetching questions for category ${category.name} (${difficulty}):`, err.message);
          // Continue with the next category/difficulty even if one fails
        }
      }
    }

    console.log(`Total of ${totalQuestionsSeeded} questions seeded successfully`);
  } catch (error) {
    console.error('Error seeding questions:', error);
    throw error;
  }
};

/**
 * Main seed function
 */
const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();
    const categories = await seedCategories();
    await seedQuestions(categories);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
