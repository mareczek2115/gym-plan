import { React, useState, useEffect } from 'react';

import { Text, View, StyleSheet, FlatList } from 'react-native';

import { Icon } from 'react-native-elements';
import { PaperProvider, Portal } from 'react-native-paper';
import { Modal } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';
import { setFilteredExercises } from '../redux/exercises';

import Exercise from './ExercisesItem';
import { MusclesModal, SortModal } from './ModalContent';

const PickExercises = () => {
  const [modalType, setModalType] = useState('');
  const [modalVisibility, setModalVisibility] = useState(false);

  const [filters, setFilters] = useState([]);
  const [currentSortType, setCurrentSortType] = useState('default');
  const [newSortType, setNewSortType] = useState('default');

  const dispatch = useDispatch();

  const { allExercises } = useSelector(state => state.exercises);
  const { filteredExercises } = useSelector(state => state.exercises);
  const { selectedExercises } = useSelector(state => state.exercises);

  const { muscles } = useSelector(state => state.muscles);

  const sortExercises = () => {
    if (newSortType !== currentSortType) {
      let filteredExercisesCopy = [...filteredExercises];
      if (newSortType === 'asc') {
        dispatch(
          setFilteredExercises(
            filteredExercisesCopy.sort((a, b) => {
              if (a.lastPerformed !== '-' && b.lastPerformed !== '-') {
                return new Date(a.lastPerformed) - new Date(b.lastPerformed);
              } else if (a.lastPerformed === '-' && b.lastPerformed !== '-') {
                return new Date(b.lastPerformed) - 0;
              } else if (a.lastPerformed !== '-' && b.lastPerformed === '-') {
                return 0 - new Date(a.lastPerformed);
              }
            })
          )
        );
      } else if (newSortType === 'desc') {
        dispatch(
          setFilteredExercises(
            filteredExercisesCopy.sort((a, b) => {
              if (a.lastPerformed !== '-' && b.lastPerformed !== '-') {
                return new Date(b.lastPerformed) - new Date(a.lastPerformed);
              } else if (a.lastPerformed === '-' && b.lastPerformed !== '-') {
                return 0 - new Date(b.lastPerformed);
              } else if (a.lastPerformed !== '-' && b.lastPerformed === '-') {
                return new Date(a.lastPerformed) - 0;
              }
            })
          )
        );
      } else {
        dispatch(setFilteredExercises(allExercises));
      }
      setCurrentSortType(newSortType);
      setModalVisibility(false);
    }
  };

  const filterExercises = selectedMuscles => {
    if (selectedMuscles.length === 0)
      dispatch(setFilteredExercises(allExercises));
    else
      dispatch(
        setFilteredExercises(
          allExercises.filter(o =>
            o.involvedMuscles.some(v => selectedMuscles.includes(v))
          )
        )
      );
    setFilters(selectedMuscles);
    setModalVisibility(false);
  };

  useEffect(() => {
    return () => {
      dispatch(setFilteredExercises(allExercises));
    };
  }, []);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Portal>
          <Modal
            visible={modalVisibility}
            dismissable={true}
            onDismiss={() => setModalVisibility(false)}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: modalType === 'sort' ? 'center' : 'stretch',
              }}
            >
              {modalType === 'sort' ? (
                <SortModal
                  sortExercises={sortExercises}
                  newSortType={newSortType}
                  setNewSortType={setNewSortType}
                />
              ) : modalType === 'filter' ? (
                <MusclesModal
                  type="filter"
                  muscles={muscles}
                  filters={filters}
                  setFilters={setFilters}
                  filterExercises={filterExercises}
                />
              ) : null}
            </View>
          </Modal>
        </Portal>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            padding: 15,
            width: 110,
            justifyContent: 'space-between',
          }}
        >
          <Icon
            type="material-icons"
            name="filter-list"
            size={34}
            onPress={() => {
              setModalVisibility(true);
              setModalType('filter');
            }}
          />
          <Icon
            type="material"
            name="sort"
            size={34}
            onPress={() => {
              setModalVisibility(true);
              setModalType('sort');
            }}
          />
        </View>

        {filteredExercises.length > 0 ? (
          <FlatList
            data={filteredExercises}
            keyExtractor={(_, index) => index}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: 30,
              paddingRight: 30,
            }}
            renderItem={({ item, index }) => {
              return (
                <Exercise
                  type="select-exercise"
                  item={item}
                  muscles={muscles}
                  index={index}
                  selected={
                    selectedExercises.includes(item.exerciseId) ? true : false
                  }
                />
              );
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 24 }}>Brak ćwiczeń</Text>
          </View>
        )}
      </View>
    </PaperProvider>
  );
};

export default PickExercises;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  mapItem: {
    backgroundColor: 'white',
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 30,
  },
});
