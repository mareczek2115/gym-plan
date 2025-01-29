export type Muscle = {
  id: number;
  name: string;
};

export type Exercise = {
  id: number;
  name: string;
  involvedMuscles: Muscle[];
  lastPerformed: string;
};

export type Training = {
  id: number;
  name: string;
  date: string;
  isCompleted: boolean;
  exercises: Exercise[];
};

export type TrainingStateKeys =
  | 'pastTrainings'
  | 'futureTrainings'
  | 'selectedTrainingsList'
  | 'selectedTraining';
