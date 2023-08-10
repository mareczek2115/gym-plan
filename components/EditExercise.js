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

import { Icon } from 'react-native-elements';
import { PaperProvider, Portal, Modal } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';
import { setAllExercises } from '../redux/exercises';

import * as SecureStore from 'expo-secure-store';
import CustomButton from './CustomButton';
import { MusclesModal } from './ModalContent';

const EditExercise = props => {
  const [modalVisibility, setModalVisibility] = useState(false);

  const [exerciseName, setExerciseName] = useState(
    props.route.params.item.exerciseName
  );
  const [reps, setRepsNumber] = useState(props.route.params.item.reps);
  const [sets, setSetsNumber] = useState(props.route.params.item.sets);
  const [weight, setWeight] = useState(props.route.params.item.weight);
  const [selectedMuscles, setSelectedMuscles] = useState(
    props.route.params.item.involvedMuscles
  );

  const dispatch = useDispatch();
  const { allExercises } = useSelector(state => state.exercises);
  const { muscles } = useSelector(state => state.muscles);

  const updateExercise = async () => {
    Keyboard.dismiss();
    if (exerciseName.trim() && reps.trim() && sets.trim() && weight.trim()) {
      let allExercisesCopy = [...allExercises];
      allExercisesCopy[
        allExercisesCopy.findIndex(
          o => o.exerciseId === props.route.params.item.exerciseId
        )
      ] = {
        exerciseId: props.route.params.item.exerciseId,
        exerciseName,
        reps,
        sets,
        weight,
        involvedMuscles: selectedMuscles,
        lastPerformed: props.route.params.item.lastPerformed,
      };
      dispatch(setAllExercises(allExercisesCopy));
      await SecureStore.setItemAsync(
        'exercises',
        JSON.stringify(allExercisesCopy)
      );
      ToastAndroid.show('Edytowano ćwiczenie', ToastAndroid.SHORT);
      props.navigation.goBack();
    } else {
      Alert.alert('', 'Niekompletne dane!', [], {
        cancelable: true,
      });
    }
  };

  return (
    <PaperProvider>
      {/* <KeyboardAvoidingView behavior="height" style={styles.container}> */}
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
              text="Zapisz"
              onPress={updateExercise}
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
                marginTop: 20,
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      {/* </KeyboardAvoidingView> */}
    </PaperProvider>
  );
};

export default EditExercise;

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
    padding: 5,
    backgroundColor: 'white',
    marginTop: 10,
  },
});
