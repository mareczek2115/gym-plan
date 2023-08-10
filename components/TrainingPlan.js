import { React, useEffect, useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ToastAndroid,
  BackHandler,
} from 'react-native';

import { PaperProvider, Portal, Modal } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';
import { setSelectedExercises } from '../redux/exercises';
import {
  setFutureTrainings,
  setSelectedTrainingsList,
} from '../redux/trainings';

import * as SecureStore from 'expo-secure-store';
import Exercise from './ExercisesItem';
import CustomButton from './CustomButton';
import { TextInputModal } from './ModalContent';

const TrainingPlan = props => {
  const [modalVisible, setModalVisibility] = useState(false);

  const [trainingName, setTrainingName] = useState('');

  const dispatch = useDispatch();
  const { allExercises } = useSelector(state => state.exercises);
  const { futureTrainings } = useSelector(state => state.trainings);
  const { selectedExercises } = useSelector(state => state.exercises);
  const { muscles } = useSelector(state => state.muscles);
  const { date } = useSelector(state => state.date);

  const saveTraining = async () => {
    let futureTrainingsCopy = [...futureTrainings];

    const training = {
      trainingName: trainingName.trim(),
      date: date,
      isCompleted: false,
      exercises: selectedExercises,
    };
    if (props.route.params?.type === 'edit-plan') {
      let trainingIndex = futureTrainingsCopy.findIndex(
        o => o.trainingId === props.route.params.id
      );
      training.trainingId = futureTrainingsCopy[trainingIndex].trainingId;
      futureTrainingsCopy[trainingIndex] = training;
    } else {
      training.trainingId = uuid().slice(0, 8);
      futureTrainingsCopy.push(training);
    }

    dispatch(setFutureTrainings(futureTrainingsCopy));
    dispatch(
      setSelectedTrainingsList(futureTrainingsCopy.filter(o => o.date === date))
    );

    await SecureStore.setItemAsync(
      'future-trainings',
      JSON.stringify(futureTrainingsCopy)
    );
    ToastAndroid.show('Zapisano trening', ToastAndroid.SHORT);
    props.navigation.goBack();
  };

  useEffect(() => {
    if (props.route.params?.type === 'edit-plan') {
      let trainingIndex = futureTrainings.findIndex(
        o => o.trainingId === props.route.params.id
      );
      setTrainingName(futureTrainings[trainingIndex].trainingName);
    }

    BackHandler.addEventListener('hardwareBackPress', () => {
      dispatch(setSelectedExercises([]));
      return false;
    });
    return () => {
      BackHandler.removeEventListener('hardwareBackPress');
    };
  }, []);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisibility(false)}
            dismissable={true}
          >
            <TextInputModal
              saveTraining={saveTraining}
              setModalVisibility={setModalVisibility}
              textValue={trainingName}
              setTrainingName={setTrainingName}
            />
          </Modal>
        </Portal>
        {selectedExercises.length > 0 ? (
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
                      type="training-plan"
                      item={foundExercise}
                      muscles={muscles}
                      index={index}
                    />
                  );
                }
              }}
            />
            <View style={{ width: '50%', alignSelf: 'center', padding: 20 }}>
              <CustomButton
                text="Zapisz trening"
                onPress={() => setModalVisibility(true)}
                // onPress={() => saveTraining()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'black',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 155,
                  height: 55,
                }}
              />
            </View>
          </View>
        ) : (
          // ) : props.route.params?.type === 'edit-plan' ? (
          //   <View style={styles.empty}>
          //     <ActivityIndicator size="large" />
          //   </View>
          <View style={styles.empty}>
            <Text style={{ fontSize: 24, textAlign: 'center' }}>
              {'Brak dodanych ćwiczeń\n'}
            </Text>
            <Text style={{ fontSize: 18, textAlign: 'center' }}>
              {
                'Kliknij plusa u góry po prawej stronie,\nby dodać nowe ćwiczenia'
              }
            </Text>
          </View>
        )}
      </View>
    </PaperProvider>
  );
};

export default TrainingPlan;

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
});
