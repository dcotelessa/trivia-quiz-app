import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetQuiz } from '../../features/quiz/quizSlice';
import { resetResults, selectResults } from '../../features/results/resultsSlice';
import { decodeHtmlEntities, getScoreColor } from '../../utils/helpers';

const ResultsDisplay: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const results = useAppSelector(selectResults);
  
  if (!results) {
    return null;
  }

  const handleStartNewQuiz = () => {
    dispatch(resetQuiz());
    dispatch(resetResults());
    navigate('/');
  };

  return (
    <div className="results-display">
      <div className="results-header">
        <h2>Quiz Results</h2>
        <div className="score-summary">
          <div 
            className="score-circle" 
            style={{ borderColor: getScoreColor(results.percentage) }}
          >
            {results.score}/{results.totalQuestions}
          </div>
          <div className="score-text">
            <h3>{results.percentage}%</h3>
            <p>
              {results.percentage < 40 && 'Better luck next time!'}
              {results.percentage >= 40 && results.percentage < 70 && 'Good job!'}
              {results.percentage >= 70 && 'Excellent work!'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="results-details">
        <h3>Question Results</h3>
        {results.results.map((result, index) => (
          <div 
            key={result.questionId} 
            className={`result-item ${result.correct ? 'correct' : 'incorrect'}`}
          >
            <div className="result-header">
              <h4>Question {index + 1}</h4>
              <span className={`result-badge ${result.correct ? 'correct' : 'incorrect'}`}>
                {result.correct ? 'Correct' : 'Incorrect'}
              </span>
            </div>
            <p className="result-question">{decodeHtmlEntities(result.question)}</p>
            <div className="result-answers">
              <div className="answer-row">
                <strong>Your answer:</strong> 
                <span className={result.correct ? 'correct-text' : 'incorrect-text'}>
                  {decodeHtmlEntities(result.selectedAnswer)}
                </span>
              </div>
              {!result.correct && (
                <div className="answer-row">
                  <strong>Correct answer:</strong> 
                  <span className="correct-text">
                    {decodeHtmlEntities(result.correctAnswer)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="results-footer">
        <button 
          className="btn btn-primary btn-lg"
          onClick={handleStartNewQuiz}
        >
          Start New Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
