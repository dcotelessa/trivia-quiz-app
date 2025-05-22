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

  const handleKeyDown = (event: React.KeyboardEvent, answer: string) => {
    // Handle Enter and Space key presses for accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelectAnswer(answer);
    }
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
        <h4 className="question-text" id={`question-${currentQuestion.id}`}>
          {decodeHtmlEntities(currentQuestion.question)}
        </h4>
        
        <div 
          className="answer-options-grid"
          role="radiogroup"
          aria-labelledby={`question-${currentQuestion.id}`}
        >
          {currentQuestion.answers.map((answer, index) => (
            <div 
              key={index}
              className={`answer-option-card ${selectedAnswer === answer ? 'selected' : ''}`}
              onClick={() => handleSelectAnswer(answer)}
              onKeyDown={(e) => handleKeyDown(e, answer)}
              tabIndex={0}
              role="radio"
              aria-checked={selectedAnswer === answer}
              aria-label={`Option ${String.fromCharCode(65 + index)}: ${decodeHtmlEntities(answer)}`}
              data-testid={`answer-option-${index}`}
            >
              <div className="answer-content">
                <span className="answer-letter" aria-hidden="true">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="answer-text">
                  {decodeHtmlEntities(answer)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="question-footer">
        <button 
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          aria-label="Go to previous question"
        >
          Previous
        </button>
        
        <button 
          className="btn btn-primary"
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1 || !selectedAnswer}
          aria-label="Go to next question"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
