import { createSlice } from '@reduxjs/toolkit';

export const musclesSlice = createSlice({
  name: 'muscles',
  initialState: {
    muscles: [],
  },
  reducers: {
    setMuscles: (state, action) => {
      state.muscles = action.payload;
    },
    addNewMuscle: (state, action) => {
      state.muscles = [...state.muscles, action.payload];
    },
  },
});

export const { setMuscles, addNewMuscle } = musclesSlice.actions;
export default musclesSlice.reducer;
