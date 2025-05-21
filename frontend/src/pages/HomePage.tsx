import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import CategorySelector from '../components/quiz/CategorySelector';
import DifficultySelector from '../components/quiz/DifficultySelector';
import AmountSelector from '../components/quiz/AmountSelector';
import { 
  fetchQuizQuestions, 
  selectSelectedAmount, 
  selectSelectedDifficulty 
} from '../features/quiz/quizSlice';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const selectedDifficulty = useAppSelector(selectSelectedDifficulty);
  const selectedAmount = useAppSelector(selectSelectedAmount);

  const handleStartQuiz = async () => {
    await dispatch(fetchQuizQuestions({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      amount: selectedAmount
    }));
    
    navigate('/quiz');
  };

  return (
    <div className="home-page">
      <div className="intro-section">
        <h2>Trivia Quiz</h2>
        <p>Answer trivia questions from various categories.</p>
      </div>
      
      <div className="quiz-options">
        <h3>Quiz Options</h3>
        <div className="form-container">
          <CategorySelector 
            selectedCategory={selectedCategory} 
            onChange={setSelectedCategory} 
          />
          <DifficultySelector />
          <AmountSelector />
          
          <div className="form-actions">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleStartQuiz}
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
