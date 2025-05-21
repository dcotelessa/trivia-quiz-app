import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAmount, selectSelectedAmount } from '../../features/quiz/quizSlice';

const amounts = [5, 10, 15, 20];

const AmountSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedAmount = useAppSelector(selectSelectedAmount);

  const handleSelectAmount = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value);
    dispatch(selectAmount(value));
  };

  return (
    <div className="form-group">
      <label htmlFor="amount-select">Number of Questions:</label>
      <select
        id="amount-select"
        value={selectedAmount}
        onChange={handleSelectAmount}
        className="form-control"
      >
        {amounts.map(amount => (
          <option key={amount} value={amount}>
            {amount}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AmountSelector;
