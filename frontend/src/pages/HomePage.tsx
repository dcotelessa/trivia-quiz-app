import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import CategorySelector from '../components/quiz/CategorySelector';
import DifficultySelector from '../components/quiz/DifficultySelector';
import { 
  fetchQuizQuestions, 
  selectSelectedDifficulty 
} from '../features/quiz/quizSlice';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const selectedDifficulty = useAppSelector(selectSelectedDifficulty);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      await dispatch(fetchQuizQuestions({
        category: selectedCategory,
        difficulty: selectedDifficulty,
        amount: 5 // Fixed amount of 5 questions
      }));
      
      navigate('/quiz');
    } catch (error) {
      console.error('Failed to start quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="intro-section">
        <h2>Test Your Knowledge</h2>
        <p>Choose your category and difficulty level to start your trivia challenge.</p>
      </div>
      
      <div className="quiz-options">
        <h3>Quiz Configuration</h3>
        <div className="form-container">
          <div className="selection-row">
            <CategorySelector 
              selectedCategory={selectedCategory} 
              onChange={setSelectedCategory} 
            />
            <DifficultySelector />
          </div>
          
          <div className="form-actions">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleStartQuiz}
              disabled={isLoading}
              aria-describedby="quiz-info"
            >
              {isLoading ? 'Loading...' : 'Start Quiz'}
            </button>
            <p id="quiz-info" className="quiz-info">
              You will answer 5 questions based on your selected preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
