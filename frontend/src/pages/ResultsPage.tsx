import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectResults, selectResultsStatus, selectResultsError } from '../features/results/resultsSlice';
import ResultsDisplay from '../components/quiz/ResultsDisplay';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const results = useAppSelector(selectResults);
  const status = useAppSelector(selectResultsStatus);
  const error = useAppSelector(selectResultsError);

  useEffect(() => {
    // Redirect to home if no results available
    if (!results && status !== 'loading') {
      navigate('/');
    }
  }, [results, status, navigate]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'failed') {
    return <ErrorMessage message={error || 'Failed to load results'} />;
  }

  return (
    <div className="results-page">
      <ResultsDisplay />
    </div>
  );
};

export default ResultsPage;
