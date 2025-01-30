import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Training, TrainingStateKeys } from '../types';

type TrainingPayload<K extends TrainingStateKeys> = K extends 'selectedTraining'
  ? Training | undefined
  : Training[];

type TrainingState = {
  [K in TrainingStateKeys]: TrainingPayload<K>;
};

const initialState: TrainingState = {
  pastTrainings: [],
  futureTrainings: [],
  selectedTrainingsList: [],
  selectedTraining: undefined,
};

export const trainingsSlice = createSlice({
  name: 'trainings',
  initialState,
  reducers: {
    updateTrainingsState: <K extends TrainingStateKeys>(
      state: TrainingState,
      action: PayloadAction<{
        key: K;
        value: TrainingPayload<K>;
      }>
    ) => {
      (state[action.payload.key] as TrainingPayload<K>) = action.payload.value;
    },
  },
});

export const { updateTrainingsState } = trainingsSlice.actions;
export default trainingsSlice.reducer;
