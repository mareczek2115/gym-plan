import { createSlice } from '@reduxjs/toolkit';

export const trainingsSlice = createSlice({
  name: 'trainings',
  initialState: {
    pastTrainings: [],
    futureTrainings: [],
    selectedTrainingsList: [],
    selectedTraining: {},
  },
  reducers: {
    setSelectedTrainingsList: (state, action) => {
      state.selectedTrainingsList = action.payload;
    },
    setPastTrainings: (state, action) => {
      state.pastTrainings = action.payload;
    },
    setFutureTrainings: (state, action) => {
      state.futureTrainings = action.payload;
    },
    setSelectedTraining: (state, action) => {
      state.selectedTraining = action.payload;
    },
  },
});

export const {
  setSelectedTrainingsList,
  setPastTrainings,
  setFutureTrainings,
  setSelectedTraining,
} = trainingsSlice.actions;
export default trainingsSlice.reducer;
