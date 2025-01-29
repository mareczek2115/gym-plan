import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Training, TrainingStateKeys } from '../types';

type TrainingPayload<K extends TrainingStateKeys> = K extends 'selectedTraining'
  ? Training
  : Training[];

const initialState: Record<
  TrainingStateKeys,
  Training[] | Training | undefined
> = {
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
      state: Record<TrainingStateKeys, Training[] | Training | undefined>,
      action: PayloadAction<{
        key: K;
        value: TrainingPayload<K>;
      }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { updateTrainingsState } = trainingsSlice.actions;
export default trainingsSlice.reducer;
