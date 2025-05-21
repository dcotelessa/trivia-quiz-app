import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../features/categories/categorySlice';
import quizReducer from '../features/quiz/quizSlice';
import resultsReducer from '../features/results/resultsSlice';

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    quiz: quizReducer,
    results: resultsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
