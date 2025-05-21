import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { QuizAnswer, QuizResult } from '../../types';
import { submitQuiz } from '../../api/api';
import { RootState } from '../../app/store';

interface ResultsState {
  results: QuizResult | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ResultsState = {
  results: null,
  status: 'idle',
  error: null,
};

export const submitQuizAnswers = createAsyncThunk(
  'results/submitQuizAnswers',
  async (answers: QuizAnswer[]) => {
    return await submitQuiz(answers);
  }
);

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    resetResults: (state) => {
      state.results = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitQuizAnswers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitQuizAnswers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to submit quiz';
      });
  },
});

export const { resetResults } = resultsSlice.actions;

export const selectResults = (state: RootState) => state.results.results;
export const selectResultsStatus = (state: RootState) => state.results.status;
export const selectResultsError = (state: RootState) => state.results.error;

export default resultsSlice.reducer;
