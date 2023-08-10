import { createSlice } from '@reduxjs/toolkit';

const dateSlice = createSlice({
  name: 'date',
  initialState: {
    date: undefined,
  },
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
    resetDate: state => {
      state.date = undefined;
    },
  },
});

export const { setDate, resetDate } = dateSlice.actions;
export default dateSlice.reducer;
