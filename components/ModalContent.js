import { React, useRef, useState } from 'react';

import {
  View,
  Text,
  TouchableNativeFeedback,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { RadioButton, Checkbox, Button } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { v4 as uuid } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';
import { addNewMuscle, setMuscles } from '../redux/muscles';

import * as SecureStore from 'expo-secure-store';
import CustomButton from './CustomButton';

export const SortModal = props => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        flexDirection: 'column',
        padding: 25,
        borderRadius: 10,
        borderWidth: 0.5,
      }}
    >
      <View
        style={{
          width: '100%',
          height: 30,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Sortuj według:</Text>
      </View>
      <TouchableNativeFeedback onPress={() => props.setNewSortType('desc')}>
        <View
          style={{
            width: 285,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 5,
          }}
        >
          <RadioButton
            value="desc"
            status={props.newSortType === 'desc' ? 'checked' : 'unchecked'}
            onPress={() => props.setNewSortType('desc')}
          />
          <Text>Daty wykonywania; od najstarszej</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => props.setNewSortType('asc')}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 5,
          }}
        >
          <RadioButton
            value="asc"
            status={props.newSortType === 'asc' ? 'checked' : 'unchecked'}
            onPress={() => props.setNewSortType('asc')}
          />
          <Text>Daty wykonywania; od najmłodszej</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => props.setNewSortType('default')}>
        <View
          style={{
            width: 285,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 5,
          }}
        >
          <RadioButton
            value="default"
            status={props.newSortType === 'default' ? 'checked' : 'unchecked'}
            onPress={() => props.setNewSortType('default')}
          />
          <Text>Domyślnie</Text>
        </View>
      </TouchableNativeFeedback>
      <View style={{ alignSelf: 'center', marginTop: 20 }}>
        <CustomButton
          text="Sortuj"
          onPress={props.sortExercises}
          style={styles.button}
        />
      </View>
    </View>
  );
};

export const MusclesModal = props => {
  const [selectedMuscles, setSelectedMuscles] = useState(
    props.type === 'new-exercise' ? props.selectedMuscles : props.filters
  );
  const [muscleName, setMuscleName] = useState('');

  const flatListRef = useRef(null);

  const dispatch = useDispatch();
  const { muscles } = useSelector(state => state.muscles);

  const saveNewMuscle = async () => {
    if (muscleName.trim().length > 0) {
      const id = uuid().slice(0, 8);
      dispatch(addNewMuscle({ id, name: muscleName.trim() }));
      await SecureStore.setItemAsync(
        'muscles',
        JSON.stringify([...props.muscles, { id, name: muscleName.trim() }])
      );
      setMuscleName('');
      if (props.muscles.length > 6) {
        flatListRef.current?.scrollToEnd();
      }
    }
  };

  const deleteMuscle = async id => {
    dispatch(setMuscles(muscles.filter(o => o.id !== id)));
    await SecureStore.setItemAsync(
      'muscles',
      JSON.stringify(muscles.filter(o => o.id !== id))
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={{
          backgroundColor: 'white',
          flexDirection: 'column',
          alignSelf: 'center',
          paddingVertical: 25,
          borderRadius: 10,
          borderWidth: 0.5,
          width: '80%',
          height: muscles.length > 6 ? 400 : 'auto',
        }}
      >
        {props.type === 'filter' ? (
          <View
            style={{
              width: '100%',
              height: 30,
              marginLeft: 20,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              Filtruj wg mięśni:
            </Text>
          </View>
        ) : null}
        {muscles.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={muscles}
            keyExtractor={(_, index) => index}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    marginHorizontal: 20,
                    borderTopWidth: index !== 0 ? 1 : 0,
                    borderTopColor: '#c0c0c0',
                  }}
                  key={index}
                >
                  <TouchableNativeFeedback
                    onPress={() => {
                      if (selectedMuscles.includes(item.id)) {
                        setSelectedMuscles(
                          selectedMuscles.filter(v => v !== item.id)
                        );
                      } else {
                        setSelectedMuscles([...selectedMuscles, item.id]);
                      }
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: props.type === 'filter' ? '100%' : 'auto',
                      }}
                    >
                      <Checkbox
                        status={
                          selectedMuscles.includes(item.id)
                            ? 'checked'
                            : 'unchecked'
                        }
                      />
                      <Text style={{ flexWrap: 'wrap', width: '75%' }}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                  {props.type === 'new-exercise' ? (
                    <Icon
                      type="feather"
                      name="trash-2"
                      onPress={() => deleteMuscle(item.id)}
                      style={{ marginRight: 5 }}
                    />
                  ) : null}
                </View>
              );
            }}
          />
        ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>Brak zapisanych mięśni</Text>
          </View>
        )}
        {props.type === 'new-exercise' ? (
          <View
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              alignSelf: 'center',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: 10,
              padding: 5,
            }}
          >
            <TextInput
              placeholder="Dodaj nową partię mięśni"
              value={muscleName}
              style={{ borderBottomWidth: 1, width: '85%' }}
              onChangeText={text => setMuscleName(text)}
            />
          </View>
        ) : null}
        <View style={{ alignSelf: 'center', marginTop: 20 }}>
          <CustomButton
            text={
              props.type === 'filter'
                ? 'Filtruj'
                : muscleName.trim().length > 0
                ? 'Zapisz'
                : 'Zatwierdź'
            }
            onPress={() => {
              if (props.type === 'new-exercise') {
                if (muscleName.trim().length > 0) {
                  saveNewMuscle();
                  Keyboard.dismiss();
                } else {
                  props.setSelectedMuscles(selectedMuscles);
                  props.setModalVisibility(false);
                }
              } else props.filterExercises(selectedMuscles);
            }}
            style={styles.button}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const TextInputModal = props => {
  const [emptyTextInput, setIfEmptyTextInput] = useState(false);

  return (
    <View
      style={{
        backgroundColor: 'white',
        flexDirection: 'column',
        alignSelf: 'center',
        padding: 25,
        borderRadius: 10,
        borderWidth: 0.5,
        width: '85%',
      }}
    >
      <View
        style={{
          width: '100%',
          height: 30,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          Podaj nazwę jednostki treningowej:
        </Text>
      </View>
      <TextInput
        style={{ borderBottomWidth: 1 }}
        value={props.textValue}
        onFocus={() => setIfEmptyTextInput(false)}
        onChangeText={text => {
          if (emptyTextInput) setIfEmptyTextInput(false);
          props.setTrainingName(text);
        }}
        placeholder={emptyTextInput ? 'Wpisz poprawną nazwę' : ''}
        placeholderTextColor="#ba3d3d"
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 15,
        }}
      >
        <Button
          onPress={() => {
            if (props.textValue.trim().length === 0) {
              props.setTrainingName('');
              setIfEmptyTextInput(true);
            } else props.saveTraining();
          }}
        >
          Zapisz
        </Button>
        <Button
          onPress={() => {
            props.setTrainingName('');
            props.setModalVisibility(false);
          }}
        >
          Anuluj
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 40,
  },
});
