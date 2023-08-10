import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from './exercises';
import dateReducer from './date';
import trainingsReducer from './trainings';
import musclesReducer from './muscles';

export const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
    date: dateReducer,
    trainings: trainingsReducer,
    muscles: musclesReducer,
  },
});
