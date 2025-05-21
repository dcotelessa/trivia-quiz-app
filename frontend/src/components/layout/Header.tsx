import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { resetQuiz } from '../../features/quiz/quizSlice';
import { resetResults } from '../../features/results/resultsSlice';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleHomeClick = () => {
    dispatch(resetQuiz());
    dispatch(resetResults());
    navigate('/');
  };
  
  return (
    <header className="header">
      <div className="container">
        <h1 onClick={handleHomeClick} style={{ cursor: 'pointer' }}>Trivia Quiz</h1>
        {location.pathname !== '/' && (
          <button 
            className="btn btn-outline" 
            onClick={handleHomeClick}
          >
            New Quiz
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
