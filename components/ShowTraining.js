import { React } from 'react';

import {
  View,
  StyleSheet,
  FlatList,
  ToastAndroid,
  Alert,
  DeviceEventEmitter,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { setAllExercises, setSelectedExercises } from '../redux/exercises';
import {
  setFutureTrainings,
  setPastTrainings,
  setSelectedTraining,
  setSelectedTrainingsList,
} from '../redux/trainings';

import * as SecureStore from 'expo-secure-store';
import Exercise from './ExercisesItem';
import CustomButton from './CustomButton';

const ShowTraining = props => {
  const dispatch = useDispatch();

  const { allExercises } = useSelector(state => state.exercises);
  const { selectedExercises } = useSelector(state => state.exercises);

  const { muscles } = useSelector(state => state.muscles);

  const { pastTrainings } = useSelector(state => state.trainings);
  const { futureTrainings } = useSelector(state => state.trainings);
  const { selectedTraining } = useSelector(state => state.trainings);
  const { selectedTrainingsList } = useSelector(state => state.trainings);

  const { date } = useSelector(state => state.date);

  const markAsCompleted = () => {
    Alert.alert('', 'Na pewno?', [
      {
        text: 'Tak',
        onPress: async () => {
          let trainingCopy = Object.assign({}, selectedTraining);
          trainingCopy.isCompleted = true;
          dispatch(setSelectedTraining(trainingCopy));

          let allExercisesCopy = allExercises.map(o => ({ ...o }));
          allExercisesCopy.forEach(o => {
            if (selectedExercises.includes(o.exerciseId)) {
              o.lastPerformed = new Date().toJSON().slice(0, 10);
            }
          });

          dispatch(setAllExercises(allExercisesCopy));

          let pastTrainingsCopy = [...pastTrainings, trainingCopy];
          let futureTrainingsCopy = futureTrainings.filter(
            o => o.trainingId !== trainingCopy.trainingId
          );

          dispatch(setPastTrainings(pastTrainingsCopy));
          dispatch(setFutureTrainings(futureTrainingsCopy));

          await SecureStore.setItemAsync(
            'past-trainings',
            JSON.stringify(pastTrainingsCopy)
          );

          await SecureStore.setItemAsync(
            'future-trainings',
            JSON.stringify(futureTrainingsCopy)
          );

          ToastAndroid.show('Trening zaliczony. Brawo!', ToastAndroid.SHORT);
          props.navigation.goBack();
        },
        style: 'default',
      },
      { text: 'Nie', style: 'cancel' },
    ]);
  };

  const deleteTraining = trainingId => {
    Alert.alert('', 'Czy na pewno chcesz usunąć ten trening?', [
      {
        text: 'Tak',
        style: 'default',
        onPress: async () => {
          if (props.route.params?.isCompleted) {
            dispatch(
              setPastTrainings(
                pastTrainings.filter(o => o.trainingId !== trainingId)
              )
            );
            await SecureStore.setItemAsync(
              'past-trainings',
              JSON.stringify([
                ...pastTrainings.filter(o => o.trainingId !== trainingId),
              ])
            );
          } else {
            dispatch(
              setFutureTrainings(
                futureTrainings.filter(o => o.trainingId !== trainingId)
              )
            );
            await SecureStore.setItemAsync(
              'future-trainings',
              JSON.stringify([
                ...futureTrainings.filter(o => o.trainingId !== trainingId),
              ])
            );
          }

          dispatch(
            setSelectedTrainingsList(
              selectedTrainingsList.filter(o => o.trainingId !== trainingId)
            )
          );

          DeviceEventEmitter.emit('refresh-trainings');
          if (selectedTrainingsList.length <= 1) {
            dispatch(setSelectedExercises([]));
            props.navigation.navigate('calendar');
          } else props.navigation.goBack();
        },
      },
      { text: 'Nie', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={selectedExercises}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 30,
            paddingLeft: 30,
            paddingRight: 30,
          }}
          renderItem={({ item, index }) => {
            if (allExercises.some(o => o.exerciseId === item)) {
              const foundExercise = allExercises.find(
                o => o.exerciseId === item
              );
              return (
                <Exercise
                  type="show-training"
                  item={foundExercise}
                  muscles={muscles}
                  index={index}
                />
              );
            }
          }}
        />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-evenly',
            paddingVertical: 20,
          }}
        >
          {props.route.params.date <= new Date().toJSON().slice(0, 10) &&
          !props.route.params.isCompleted ? (
            <CustomButton
              text="Oznacz jako wykonane"
              onPress={() => markAsCompleted()}
              style={styles.button}
            />
          ) : null}
          {props.route.params.isCompleted ? null : (
            <CustomButton
              text="Edytuj"
              onPress={() => {
                props.navigation.navigate('training-plan', {
                  type: 'edit-plan',
                  date: date,
                  id: props.route.params.trainingId,
                });
              }}
              style={styles.button}
            />
          )}
          <CustomButton
            text="Usuń"
            onPress={() => deleteTraining(props.route.params.trainingId)}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
};

export default ShowTraining;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapItem: {
    backgroundColor: 'white',
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 115,
    height: 50,
  },
});
