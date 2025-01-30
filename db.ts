import * as SQLite from 'expo-sqlite';
import { Exercise, Muscle, Training } from './types';

const db = SQLite.openDatabaseSync('app_data.db');

export const initDB = async () => {
  try {
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS muscles (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL);

       CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, lastPerformed TEXT DEFAULT NULL);

       CREATE TABLE IF NOT EXISTS trainings (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, date TEXT NOT NULL,
        isCompleted INTEGER NOT NULL DEFAULT 0, isFuture INTEGER NOT NULL CHECK(isFuture IN (0, 1)));

       CREATE TABLE IF NOT EXISTS exercise_muscles (exercise_id INTEGER, muscle_id INTEGER, PRIMARY KEY (exercise_id, muscle_id),
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
        FOREIGN KEY (muscle_id) REFERENCES muscles(id) ON DELETE CASCADE);

       CREATE TABLE IF NOT EXISTS training_exercises (training_id INTEGER, exercise_id INTEGER, PRIMARY KEY (training_id, exercise_id),
        FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE);`
    );
  } catch (error) {
    throw new Error(error as string);
  }
};

/* ========================================
   # functions to retrieve data from db
   ======================================== */

export const getMuscles = async () => {
  return new Promise<Muscle[]>(async (resolve, reject) => {
    try {
      const muscles = (await db.getAllAsync(
        `SELECT * FROM muscles`
      )) as Muscle[];
      resolve(muscles);
    } catch (error) {
      reject(error);
    }
  });
};

export const getExercises = async () => {
  return new Promise<Exercise[]>(async (resolve, reject) => {
    try {
      const exercises = (await db.getAllAsync(
        `SELECT * FROM exercises`
      )) as Exercise[];
      for (const exercise of exercises) {
        const muscles = (await db.getAllAsync(
          'SELECT muscles.id FROM exercise_muscles INNER JOIN muscles ON exercise_muscles.muscle_id = muscles.id WHERE exercise_muscles.exercise_id = ?',
          [exercise.id]
        )) as Muscle[];
        exercise.involvedMuscles = muscles.map(o => o.id);
      }
      resolve(exercises);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const getTrainings = async () => {
  return new Promise<Training[]>(async (resolve, reject) => {
    try {
      const trainings = (await db.getAllAsync(
        'SELECT * FROM trainings'
      )) as Training[];
      for (const training of trainings) {
        const exercises = (await db.getAllAsync(
          'SELECT exercises.id FROM training_exercises INNER JOIN exercises ON training_exercises.exercise_id = exercises.id WHERE training_exercises.training_id = ?',
          [training.id]
        )) as Exercise[];
        training.exercises = exercises.map(o => o.id);
        training.isCompleted = Boolean(training.isCompleted);
      }
      resolve(trainings);
    } catch (error) {
      reject(error);
    }
  });
};

/* ========================================
   # functions to save data to db
   ======================================== */

export const saveMuscle = async (name: string) => {
  return new Promise<number>(async (resolve, reject) => {
    try {
      const res = await db.runAsync(`INSERT INTO muscles (name) VALUES (?)`, [
        name,
      ]);
      resolve(res.lastInsertRowId);
    } catch (error) {
      reject(error);
    }
  });
};

export const saveExercise = async (name: string, involvedMuscles: Muscle[]) => {
  return new Promise<number>(async (resolve, reject) => {
    try {
      const res = await db.runAsync(
        'INSERT INTO exercises (name) VALUES (?)',
        name
      );
      for (const muscle of involvedMuscles) {
        await db.runAsync(
          'INSERT INTO exercise_muscles (exercise_id, muscle_id) VALUES (?, ?)',
          [res.lastInsertRowId, muscle.id]
        );
      }
      resolve(res.lastInsertRowId);
    } catch (error) {
      reject(error);
    }
  });
};

export const saveTraining = async (
  name: string,
  date: string,
  exercises: Exercise[]
) => {
  return new Promise<number>(async (resolve, reject) => {
    try {
      const res = await db.runAsync(
        'INSERT INTO trainings (name, date) VALUES (?, ?)',
        [name, date]
      );
      for (const exercise of exercises) {
        await db.runAsync(
          'INSERT INTO training_exercises (training_id, exercise_id) VALUES (?, ?)',
          [res.lastInsertRowId, exercise.id]
        );
      }
      resolve(res.lastInsertRowId);
    } catch (error) {
      reject(error);
    }
  });
};

/* ========================================
   # functions to save data to db
   ======================================== */

export const deleteMuscle = async (id: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await db.runAsync(`DELETE FROM muscles WHERE id = ?`, id);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteExercise = async (id: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await db.runAsync(`DELETE FROM exercises WHERE id = ?`, id);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteTraining = async (id: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await db.runAsync(`DELETE FROM trainings WHERE id = ?`, id);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
