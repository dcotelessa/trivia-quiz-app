import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  selectCurrentQuestion, 
  selectQuizAnswers, 
  selectQuizComplete, 
  selectQuizQuestions 
} from '../../features/quiz/quizSlice';
import { submitQuizAnswers } from '../../features/results/resultsSlice';

const QuizControls: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const answers = useAppSelector(selectQuizAnswers);
  const questions = useAppSelector(selectQuizQuestions);
  const currentQuestionIndex = useAppSelector(selectCurrentQuestion);
  const isQuizComplete = useAppSelector(selectQuizComplete);
  
  const progress = questions.length > 0 
    ? Math.round((answers.length / questions.length) * 100) 
    : 0;
  
  const handleSubmit = async () => {
    if (isQuizComplete) {
      await dispatch(submitQuizAnswers(answers));
      navigate('/results');
    }
  };

  return (
    <div className="quiz-controls">
      <div className="progress-container">
        <div className="progress-text">
          Questions answered: {answers.length} of {questions.length}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {isQuizComplete && (
        <button 
          className="btn btn-success btn-lg"
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>
      )}
      
      {!isQuizComplete && currentQuestionIndex === questions.length - 1 && (
        <div className="alert alert-info">
          Please answer all questions before submitting.
        </div>
      )}
    </div>
  );
};

export default QuizControls;
