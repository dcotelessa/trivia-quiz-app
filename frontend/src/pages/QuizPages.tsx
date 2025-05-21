import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { 
  selectQuizQuestions, 
  selectQuizStatus, 
  selectQuizError 
} from '../features/quiz/quizSlice';
import QuestionCard from '../components/quiz/QuestionCard';
import QuizControls from '../components/quiz/QuizControls';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const questions = useAppSelector(selectQuizQuestions);
  const status = useAppSelector(selectQuizStatus);
  const error = useAppSelector(selectQuizError);

  useEffect(() => {
    // Redirect to home if no questions loaded
    if (questions.length === 0 && status !== 'loading') {
      navigate('/');
    }
  }, [questions, status, navigate]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'failed') {
    return <ErrorMessage message={error || 'Failed to load questions'} />;
  }

  return (
    <div className="quiz-page">
      <QuestionCard />
      <QuizControls />
    </div>
  );
};

export default QuizPage;
