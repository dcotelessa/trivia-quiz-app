import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  selectCurrentQuestion, 
  selectQuizAnswers, 
  selectQuizQuestions, 
  setCurrentQuestion 
} from '../../features/quiz/quizSlice';

const QuestionNavigation: React.FC = () => {
  const dispatch = useAppDispatch();
  const questions = useAppSelector(selectQuizQuestions);
  const currentQuestionIndex = useAppSelector(selectCurrentQuestion);
  const answers = useAppSelector(selectQuizAnswers);
  
  const handleQuestionClick = (index: number) => {
    dispatch(setCurrentQuestion(index));
  };
  
  return (
    <div className="question-navigation">
      <div className="question-dots">
        {questions.map((_, index) => {
          const isAnswered = answers.some(a => a.questionId === questions[index].id);
          const isCurrent = index === currentQuestionIndex;
          
          return (
            <button
              key={index}
              className={`question-dot ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}`}
              onClick={() => handleQuestionClick(index)}
              aria-label={`Question ${index + 1}`}
              aria-current={isCurrent ? 'true' : 'false'}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigation;
