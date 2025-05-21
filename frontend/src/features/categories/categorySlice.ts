import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';
import { getCategories } from '../../api/api';
import { RootState } from '../../app/store';

interface CategoryState {
  categories: Category[];
  selectedCategory?: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: undefined,
  status: 'idle',
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    return await getCategories();
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    selectCategory: (state, action: PayloadAction<number | undefined>) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export const { selectCategory, clearSelectedCategory } = categorySlice.actions;

export const selectAllCategories = (state: RootState) => state.categories.categories;
export const selectCategoryStatus = (state: RootState) => state.categories.status;
export const selectCategoryError = (state: RootState) => state.categories.error;
export const selectSelectedCategory = (state: RootState) => state.categories.selectedCategory;

export default categorySlice.reducer;
