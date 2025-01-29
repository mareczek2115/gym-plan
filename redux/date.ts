import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { date: string | undefined } = { date: undefined };

const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    resetDate: state => {
      state.date = undefined;
    },
  },
});

export const { setDate, resetDate } = dateSlice.actions;
export default dateSlice.reducer;
