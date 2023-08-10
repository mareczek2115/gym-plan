import { React, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ToastAndroid,
  TouchableNativeFeedback,
} from 'react-native';

import { v4 as uuid } from 'uuid';
import { Icon } from 'react-native-elements';
import { PaperProvider, Portal, Modal } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';
import { addNewExercise } from '../redux/exercises';

import * as SecureStore from 'expo-secure-store';
import CustomButton from './CustomButton';
import { MusclesModal } from './ModalContent';

const AddExercise = () => {
  const [modalVisibility, setModalVisibility] = useState(false);

  const [exerciseName, setExerciseName] = useState('');
  const [reps, setRepsNumber] = useState('');
  const [sets, setSetsNumber] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState([]);

  const dispatch = useDispatch();
  const { allExercises } = useSelector(state => state.exercises);
  const { muscles } = useSelector(state => state.muscles);

  const saveExercise = async () => {
    Keyboard.dismiss();
    if (exerciseName.trim() && reps.trim() && sets.trim() && weight.trim()) {
      let exerciseId = uuid().slice(0, 8);

      if (allExercises.some(o => o.exerciseId === exerciseId)) {
        do {
          exerciseId = uuid().slice(0, 8);
        } while (allExercises.some(o => o.exerciseId === exerciseId));
      }

      dispatch(
        addNewExercise({
          exerciseId,
          exerciseName,
          reps,
          sets,
          weight,
          involvedMuscles: selectedMuscles,
          lastPerformed: '-',
        })
      );

      await SecureStore.setItemAsync(
        'exercises',
        JSON.stringify([
          ...allExercises,
          {
            exerciseId,
            exerciseName,
            reps,
            sets,
            weight,
            involvedMuscles: selectedMuscles,
            lastPerformed: '-',
          },
        ])
      );

      ToastAndroid.show('Dodano ćwiczenie', ToastAndroid.SHORT);

      setExerciseName('');
      setRepsNumber('');
      setSetsNumber('');
      setWeight('');
    } else {
      Alert.alert('', 'Niekompletne dane!', [], {
        cancelable: true,
      });
    }
  };

  return (
    <PaperProvider>
      {/* <KeyboardAvoidingView behavior="padding" style={styles.container}> */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Portal>
            <Modal
              visible={modalVisibility}
              dismissable={true}
              onDismiss={() => setModalVisibility(false)}
            >
              {modalVisibility ? (
                <MusclesModal
                  type="new-exercise"
                  muscles={muscles}
                  selectedMuscles={selectedMuscles}
                  setSelectedMuscles={setSelectedMuscles}
                  setModalVisibility={setModalVisibility}
                />
              ) : null}
            </Modal>
          </Portal>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.item}>
              <Text>Nazwa ćwiczenia:</Text>
              <TextInput
                style={styles.textInput}
                placeholderTextColor="lightslategrey"
                value={exerciseName}
                onChangeText={text => setExerciseName(text)}
              />
            </View>
            <View style={styles.item}>
              <Text>Ilość powtórzeń:</Text>
              <TextInput
                style={styles.textInput}
                placeholderTextColor="lightslategrey"
                value={reps}
                onChangeText={text => setRepsNumber(text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.item}>
              <Text>Ilość serii:</Text>
              <TextInput
                style={styles.textInput}
                placeholderTextColor="lightslategrey"
                value={sets}
                onChangeText={text => setSetsNumber(text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.item}>
              <Text>Obciążenie:</Text>
              <TextInput
                style={styles.textInput}
                placeholderTextColor="lightslategrey"
                value={weight}
                onChangeText={text => setWeight(text)}
                keyboardType="default"
              />
            </View>

            <TouchableNativeFeedback
              onPress={() => {
                Keyboard.dismiss();
                setModalVisibility(true);
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 60,
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 8,
                  margin: 40,
                  marginBottom: 50,
                }}
              >
                <Icon
                  type="evilicon"
                  name="navicon"
                  size={40}
                  style={{ marginTop: -5 }}
                />
                <Text style={{ fontSize: 15, marginTop: 0 }}>
                  Wybierz angażowane mięśnie
                </Text>
              </View>
            </TouchableNativeFeedback>
            <CustomButton
              text="Zapisz ćwiczenie"
              onPress={saveExercise}
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
      </TouchableWithoutFeedback>
      {/* </KeyboardAvoidingView> */}
    </PaperProvider>
  );
};

export default AddExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  item: {
    alignItems: 'flex-start',
    padding: 10,
  },
  textInput: {
    height: 40,
    width: 270,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    marginTop: 10,
    padding: 10,
  },
});
