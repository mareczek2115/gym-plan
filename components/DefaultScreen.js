import { React, useEffect, useState } from 'react';

import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { setFutureTrainings, setPastTrainings } from '../redux/trainings';
import { setAllExercises } from '../redux/exercises';
import { setMuscles } from '../redux/muscles';

import * as SecureStore from 'expo-secure-store';

const DefaultScreen = () => {
  const [screenReady, setScreenReady] = useState(false);
  const [isTraining, setIfIsTraining] = useState(false);

  const [todaysTraining, setTodaysTraining] = useState({});
  const [nextTrainingDate, setNextTrainingDate] = useState('');

  const dispatch = useDispatch();
  const { pastTrainings } = useSelector(state => state.trainings);
  const { futureTrainings } = useSelector(state => state.trainings);

  const getTrainings = async () => {
    // await SecureStore.setItemAsync('past-trainings', JSON.stringify([]));
    // await SecureStore.setItemAsync('future-trainings', JSON.stringify([]));
    const fetchedPastTrainings = await SecureStore.getItemAsync(
      'past-trainings'
    );
    const fetchedFutureTrainings = await SecureStore.getItemAsync(
      'future-trainings'
    );
    // console.log(fetchedPastTrainings, fetchedFutureTrainings);
    dispatch(
      setPastTrainings(
        fetchedPastTrainings === null ? [] : JSON.parse(fetchedPastTrainings)
      )
    );
    dispatch(
      setFutureTrainings(
        fetchedFutureTrainings === null
          ? []
          : JSON.parse(fetchedFutureTrainings)
      )
    );
  };

  const getExercises = async () => {
    const exercises = await SecureStore.getItemAsync('exercises');
    dispatch(setAllExercises(exercises === null ? [] : JSON.parse(exercises)));
  };

  const getMuscles = async () => {
    const muscles = await SecureStore.getItemAsync('muscles');
    dispatch(setMuscles(muscles === null ? [] : JSON.parse(muscles)));
  };

  const sortDateArray = (arr, date) => {
    arr.sort((a, b) => {
      return (
        Math.abs(new Date(date) - new Date(a.date)) -
        Math.abs(new Date(date) - new Date(b.date))
      );
    });
  };

  const appDataConfiguration = async () => {
    const date = new Date().toJSON().slice(0, 10);
    const installDate = await SecureStore.getItemAsync('installation-date');
    if (!JSON.parse(installDate)) {
      await SecureStore.setItemAsync('installation-date', JSON.stringify(date));
    }

    if (pastTrainings.length > 0) {
      sortDateArray(pastTrainings, date);
      if (pastTrainings.some(o => o.date === date)) {
        setTodaysTraining(pastTrainings.find(o => o.date === date));
        setIfIsTraining(true);
      }
    }
    if (futureTrainings.length > 0) {
      sortDateArray(futureTrainings, date);
      if (futureTrainings.some(o => o.date === date)) {
        setTodaysTraining(futureTrainings.find(o => o.date === date));
        setIfIsTraining(true);
        if (futureTrainings.some(o => o.date < date)) {
          dispatch(
            setPastTrainings([
              ...pastTrainings,
              ...futureTrainings.filter(o => o.date < date),
            ])
          );
          dispatch(
            setFutureTrainings(futureTrainings.filter(o => o.date >= date))
          );

          await SecureStore.setItemAsync(
            'past-trainings',
            JSON.stringify([
              ...pastTrainings,
              ...futureTrainings.filter(o => o.date < date),
            ])
          );
          await SecureStore.setItemAsync(
            'future-trainings',
            JSON.stringify(futureTrainings.filter(o => o.date >= date))
          );
        }
      } else setNextTrainingDate(futureTrainings[0].date);
    }
    setScreenReady(true);
  };

  useEffect(() => {
    getTrainings();
    getExercises();
    getMuscles();
  }, []);

  useEffect(() => {
    if (futureTrainings) appDataConfiguration();
  }, [futureTrainings.length]);

  return (
    <View style={styles.container}>
      {screenReady ? (
        isTraining ? (
          todaysTraining.isCompleted ? (
            <View style={styles.container}>
              <Text style={{ fontSize: 25, textAlign: 'center' }}>
                Dzisiejszy/e trening(i) masz już odhaczony. Brawo!
              </Text>
              <Text style={{ fontSize: 25, textAlign: 'center' }}>
                Następny trening:{' '}
                {futureTrainings.length > 0 ? nextTrainingDate : 'Brak'}
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 25, textAlign: 'center' }}>
              Dzisiaj masz zaplanowany trening. Do roboty!
            </Text>
          )
        ) : (
          <View style={styles.container}>
            <Text style={{ fontSize: 25 }}>Dzisiaj nie ma treningu</Text>
            <Text style={{ fontSize: 25 }}>
              Następny trening: {nextTrainingDate.length > 0 ? '' : 'Brak'}
            </Text>
            {nextTrainingDate.length > 0 ? (
              <Text style={{ fontSize: 25 }}>{nextTrainingDate}</Text>
            ) : null}
          </View>
        )
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default DefaultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
});
