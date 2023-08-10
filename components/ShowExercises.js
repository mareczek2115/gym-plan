import { React, useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Alert,
  Keyboard,
} from 'react-native';

import { TextInput } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';

import { useDispatch, useSelector } from 'react-redux';
import { setAllExercises, setFilteredExercises } from '../redux/exercises';

import * as SecureStore from 'expo-secure-store';
import Exercise from './ExercisesItem';

const ShowExercises = props => {
  const [searchedPhrase, setSearchedPhrase] = useState('');

  const dispatch = useDispatch();
  const { allExercises } = useSelector(state => state.exercises);
  const { filteredExercises } = useSelector(state => state.exercises);
  const { muscles } = useSelector(state => state.muscles);

  const searchExercises = text => {
    setSearchedPhrase(text);
    if (text.length === 0) dispatch(setFilteredExercises(allExercises));
    else {
      let foundExercises = allExercises.filter(o => {
        if (o.exerciseName.match(new RegExp(`.*${text}.*`, 'gi'))) return o;
      });
      dispatch(setFilteredExercises(foundExercises));
    }
  };

  const deleteExercise = exerciseId => {
    Alert.alert('', 'Czy na pewno chcesz usunąć to ćwiczenie?', [
      {
        text: 'Tak',
        style: 'default',
        onPress: async () => {
          dispatch(
            setAllExercises(
              allExercises.filter(o => o.exerciseId !== exerciseId)
            )
          );
          await SecureStore.setItemAsync(
            'exercises',
            JSON.stringify([
              ...allExercises.filter(o => o.exerciseId !== exerciseId),
            ])
          );
        },
      },
      { text: 'Nie', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Wpisz szukaną frazę"
          style={{
            height: 40,
            width: '85%',
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 5,
            padding: 5,
            backgroundColor: 'white',
          }}
          onChangeText={text => searchExercises(text)}
          value={searchedPhrase}
        />
        <Icon
          type="ionicon"
          name="close-circle-outline"
          size={34}
          onPress={() => {
            searchExercises('');
            Keyboard.dismiss();
          }}
        />
      </View>
      {filteredExercises.length > 0 ? (
        <FlatList
          data={filteredExercises}
          keyExtractor={(_, index) => index}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 15,
            paddingLeft: 30,
            paddingRight: 30,
          }}
          renderItem={({ item, index }) => {
            return (
              <Exercise
                type="show-exercises"
                item={item}
                muscles={muscles}
                index={index}
                deleteExercise={deleteExercise}
                navigation={props.navigation}
              />
            );
          }}
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 24 }}>Brak ćwiczeń</Text>
        </View>
      )}
    </View>
  );
};

export default ShowExercises;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginTop: 15,
    marginBottom: 10,
    borderBottomColor: '#d0d0d0',
    borderBottomWidth: 1,
  },
});
