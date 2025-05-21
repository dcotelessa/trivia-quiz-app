import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  nextQuestion,
  previousQuestion,
  selectCurrentQuestion,
  selectCurrentQuestionAnswer,
  selectCurrentQuestionData,
  selectQuizQuestions,
  setAnswer
} from '../../features/quiz/quizSlice';
import { decodeHtmlEntities } from '../../utils/helpers';

const QuestionCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentQuestionIndex = useAppSelector(selectCurrentQuestion);
  const questions = useAppSelector(selectQuizQuestions);
  const currentQuestion = useAppSelector(selectCurrentQuestionData);
  const selectedAnswer = useAppSelector(selectCurrentQuestionAnswer);
  
  if (!currentQuestion) {
    return null;
  }

  const handleSelectAnswer = (answer: string) => {
    dispatch(setAnswer({
      questionId: currentQuestion.id,
      answer
    }));
  };

  const handleNext = () => {
    dispatch(nextQuestion());
  };

  const handlePrevious = () => {
    dispatch(previousQuestion());
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <h3>Question {currentQuestionIndex + 1} of {questions.length}</h3>
        <div className="question-info">
          <span className="difficulty">
            Difficulty: {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="question-body">
        <h4 className="question-text">
          {decodeHtmlEntities(currentQuestion.question)}
        </h4>
        
        <div className="answer-options">
          {currentQuestion.answers.map((answer, index) => (
            <div 
              key={index} 
              className={`answer-option ${selectedAnswer === answer ? 'selected' : ''}`}
              onClick={() => handleSelectAnswer(answer)}
            >
              <input 
                type="radio" 
                id={`answer-${index}`}
                name="answer"
                checked={selectedAnswer === answer}
                onChange={() => handleSelectAnswer(answer)}
              />
              <label htmlFor={`answer-${index}`}>
                {decodeHtmlEntities(answer)}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="question-footer">
        <button 
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        
        <button 
          className="btn btn-primary"
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1 || !selectedAnswer}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
