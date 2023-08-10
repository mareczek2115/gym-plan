import { createSlice } from '@reduxjs/toolkit';

export const exercisesSlice = createSlice({
  name: 'exercises',
  initialState: {
    selectedExercises: [],
    allExercises: [],
    filteredExercises: [],
  },
  reducers: {
    setSelectedExercises: (state, action) => {
      state.selectedExercises = action.payload;
    },
    addExerciseToSelected: (state, action) => {
      state.selectedExercises = [...state.selectedExercises, action.payload];
    },
    removeExerciseFromSelected: (state, action) => {
      state.selectedExercises = state.selectedExercises.filter(
        o => o !== action.payload
      );
    },
    unique: state => {
      state.selectedExercises = [...new Set(state.selectedExercises)];
    },
    moveExerciseUp: (state, action) => {
      const exerciseIndex = state.selectedExercises.indexOf(action.payload);
      if (exerciseIndex !== 0) {
        const temp = state.selectedExercises[exerciseIndex];
        state.selectedExercises[exerciseIndex] =
          state.selectedExercises[exerciseIndex - 1];
        state.selectedExercises[exerciseIndex - 1] = temp;
      }
    },
    moveExerciseDown: (state, action) => {
      const exerciseIndex = state.selectedExercises.indexOf(action.payload);
      if (exerciseIndex !== state.selectedExercises.length - 1) {
        const temp = state.selectedExercises[exerciseIndex];
        state.selectedExercises[exerciseIndex] =
          state.selectedExercises[exerciseIndex + 1];
        state.selectedExercises[exerciseIndex + 1] = temp;
      }
    },
    setAllExercises: (state, action) => {
      state.allExercises = action.payload;
      state.filteredExercises = action.payload;
    },
    addNewExercise: (state, action) => {
      state.allExercises = [...state.allExercises, action.payload];
      state.filteredExercises = [...state.filteredExercises, action.payload];
    },
    setFilteredExercises: (state, action) => {
      state.filteredExercises = action.payload;
    },
  },
});

export const {
  setSelectedExercises,
  addExerciseToSelected,
  removeExerciseFromSelected,
  unique,
  moveExerciseUp,
  moveExerciseDown,
  setAllExercises,
  addNewExercise,
  setFilteredExercises,
} = exercisesSlice.actions;
export default exercisesSlice.reducer;
