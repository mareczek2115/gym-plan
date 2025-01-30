export type Muscle = {
  id: number;
  name: string;
};

export type Exercise = {
  id: number;
  name: string;
  involvedMuscles: number[];
  lastPerformed: string | null;
};

export type Training = {
  id: number;
  name: string;
  date: string;
  isCompleted: boolean;
  exercises: number[];
  isFuture: boolean;
};

export type TrainingStateKeys =
  | 'pastTrainings'
  | 'futureTrainings'
  | 'selectedTrainingsList'
  | 'selectedTraining';

export type RootDrawerParamList = {
  'show-exercises': undefined;
  'edit-exercise': { item: Exercise };
};
