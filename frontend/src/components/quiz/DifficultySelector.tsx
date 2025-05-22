import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectDifficulty, selectSelectedDifficulty } from '../../features/quiz/quizSlice';
import { QuestionDifficulty } from '../../types';

interface DifficultySelectorProps {
  selectedDifficulty?: QuestionDifficulty;
  onChange?: (difficulty: QuestionDifficulty | undefined) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty: propSelectedDifficulty,
  onChange
}) => {
  const dispatch = useAppDispatch();
  const storeSelectedDifficulty = useAppSelector(selectSelectedDifficulty);
  
  const isControlled = onChange !== undefined;
  const selectedDifficulty = isControlled ? propSelectedDifficulty : storeSelectedDifficulty;

  const difficulties: { value: QuestionDifficulty | ''; label: string; description: string }[] = [
    { value: '', label: 'Any Difficulty', description: 'Mix of easy, medium, and hard questions' },
    { value: 'easy', label: 'Easy', description: 'Simple questions for beginners' },
    { value: 'medium', label: 'Medium', description: 'Moderate difficulty questions' },
    { value: 'hard', label: 'Hard', description: 'Challenging questions for experts' }
  ];

  const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as QuestionDifficulty | '';
    const difficultyValue = value === '' ? undefined : value;
    
    if (isControlled) {
      onChange(difficultyValue);
    } else {
      dispatch(selectDifficulty(difficultyValue));
    }
  };

  const selectedOption = difficulties.find(d => d.value === (selectedDifficulty || ''));

  return (
    <div className="form-group">
      <label htmlFor="difficulty-select">Difficulty:</label>
      <select
        id="difficulty-select"
        value={selectedDifficulty || ''}
        onChange={handleDifficultyChange}
        className="form-control"
        aria-describedby="difficulty-help"
      >
        {difficulties.map((difficulty) => (
          <option key={difficulty.value} value={difficulty.value}>
            {difficulty.label}
          </option>
        ))}
      </select>
      <span id="difficulty-help" className="form-help">
        {selectedOption?.description || 'Select your preferred difficulty level'}
      </span>
    </div>
  );
};

export default DifficultySelector;
