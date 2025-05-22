import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Question, QuestionDifficulty, QuizAnswer, QuizOptions } from '../../types';
import { getQuizQuestions } from '../../api/api';
import { RootState } from '../../app/store';

interface QuizState {
  questions: Question[];
  currentQuestion: number;
  answers: QuizAnswer[];
  selectedDifficulty?: QuestionDifficulty;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuizState = {
  questions: [],
  currentQuestion: 0,
  answers: [],
  selectedDifficulty: undefined,
  status: 'idle',
  error: null,
};

export const fetchQuizQuestions = createAsyncThunk(
  'quiz/fetchQuizQuestions',
  async (options: QuizOptions) => {
    return await getQuizQuestions(options);
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    selectDifficulty: (state, action: PayloadAction<QuestionDifficulty | undefined>) => {
      state.selectedDifficulty = action.payload;
    },
    setAnswer: (state, action: PayloadAction<QuizAnswer>) => {
      const existingAnswerIndex = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId
      );
      
      if (existingAnswerIndex >= 0) {
        state.answers[existingAnswerIndex] = action.payload;
      } else {
        state.answers.push(action.payload);
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestion < state.questions.length - 1) {
        state.currentQuestion += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestion > 0) {
        state.currentQuestion -= 1;
      }
    },
    resetQuiz: (state) => {
      state.questions = [];
      state.currentQuestion = 0;
      state.answers = [];
      state.status = 'idle';
      state.error = null;
    },
    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.questions.length) {
      	state.currentQuestion = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
        state.currentQuestion = 0;
        state.answers = [];
      })
      .addCase(fetchQuizQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch questions';
      });
  },
});

export const {
  selectDifficulty,
  setAnswer,
  nextQuestion,
  previousQuestion,
  resetQuiz,
  setCurrentQuestion,
} = quizSlice.actions;

export const selectQuizQuestions = (state: RootState) => state.quiz.questions;
export const selectCurrentQuestion = (state: RootState) => state.quiz.currentQuestion;
export const selectQuizStatus = (state: RootState) => state.quiz.status;
export const selectQuizError = (state: RootState) => state.quiz.error;
export const selectQuizAnswers = (state: RootState) => state.quiz.answers;
export const selectSelectedDifficulty = (state: RootState) => state.quiz.selectedDifficulty;
export const selectQuizComplete = (state: RootState) => 
  state.quiz.answers.length === state.quiz.questions.length && state.quiz.questions.length > 0;
export const selectCurrentQuestionData = (state: RootState) => 
  state.quiz.questions[state.quiz.currentQuestion];
export const selectCurrentQuestionAnswer = (state: RootState) => {
  const currentQuestionId = state.quiz.questions[state.quiz.currentQuestion]?.id;
  return state.quiz.answers.find(a => a.questionId === currentQuestionId)?.answer;
};

export default quizSlice.reducer;
