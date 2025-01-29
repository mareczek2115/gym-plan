import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exercise } from '../types';

const initialState: {
  selectedExercises: Exercise[];
  allExercises: Exercise[];
  filteredExercises: Exercise[];
} = { selectedExercises: [], allExercises: [], filteredExercises: [] };

export const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setSelectedExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.selectedExercises = action.payload;
    },
    addExerciseToSelected: (state, action: PayloadAction<Exercise>) => {
      state.selectedExercises = [...state.selectedExercises, action.payload];
    },
    removeExerciseFromSelected: (state, action: PayloadAction<number>) => {
      state.selectedExercises = state.selectedExercises.filter(
        o => o.id !== action.payload
      );
    },
    unique: state => {
      state.selectedExercises = [...new Set(state.selectedExercises)];
    },
    moveExercise: (
      state,
      action: PayloadAction<{ direction: 'up' | 'down'; id: number }>
    ) => {
      const shift = action.payload.direction === 'up' ? -1 : 1;
      const index = state.selectedExercises.findIndex(
        o => o.id === action.payload.id
      );
      if (
        (action.payload.direction === 'up' && index !== 0) ||
        (action.payload.direction === 'down' &&
          index !== state.selectedExercises.length - 1)
      ) {
        const temp = state.selectedExercises[index];
        state.selectedExercises[index] = state.selectedExercises[index + shift];
        state.selectedExercises[index + shift] = temp;
      }
    },
    setAllExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.allExercises = action.payload;
      state.filteredExercises = action.payload;
    },
    addNewExercise: (state, action: PayloadAction<Exercise>) => {
      state.allExercises = [...state.allExercises, action.payload];
      state.filteredExercises = [...state.filteredExercises, action.payload];
    },
    setFilteredExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.filteredExercises = action.payload;
    },
  },
});

export const {
  setSelectedExercises,
  addExerciseToSelected,
  removeExerciseFromSelected,
  unique,
  moveExercise,
  setAllExercises,
  addNewExercise,
  setFilteredExercises,
} = exercisesSlice.actions;
export default exercisesSlice.reducer;
