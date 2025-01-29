import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Muscle } from '../types';

const initialState: { muscles: Muscle[] } = { muscles: [] };

export const musclesSlice = createSlice({
  name: 'muscles',
  initialState,
  reducers: {
    setMuscles: (state, action: PayloadAction<Muscle[]>) => {
      state.muscles = action.payload;
    },
    addNewMuscle: (state, action: PayloadAction<Muscle>) => {
      state.muscles = [...state.muscles, action.payload];
    },
  },
});

export const { setMuscles, addNewMuscle } = musclesSlice.actions;
export default musclesSlice.reducer;
