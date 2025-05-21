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
  
  // Use props if provided, otherwise use Redux state
  const isControlled = onChange !== undefined;
  const selectedDifficulty = isControlled ? propSelectedDifficulty : storeSelectedDifficulty;

  const difficulties: { value: QuestionDifficulty | ''; label: string }[] = [
    { value: '', label: 'Any Difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
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

  return (
    <div className="form-group">
      <label htmlFor="difficulty-select">Select Difficulty:</label>
      <select
        id="difficulty-select"
        value={selectedDifficulty || ''}
        onChange={handleDifficultyChange}
        className="form-control"
      >
        {difficulties.map((difficulty) => (
          <option key={difficulty.value} value={difficulty.value}>
            {difficulty.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DifficultySelector;
