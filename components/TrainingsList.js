import { React } from 'react';

import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';

import { Icon } from 'react-native-elements';

import { useDispatch, useSelector } from 'react-redux';
import { setSelectedExercises } from '../redux/exercises';
import { setSelectedTraining } from '../redux/trainings';

const TrainingList = props => {
  const dispatch = useDispatch();
  const { selectedTrainingsList } = useSelector(state => state.trainings);

  return (
    <View style={styles.container}>
      {selectedTrainingsList.length > 0 ? (
        <FlatList
          data={selectedTrainingsList}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 30,
            paddingLeft: 30,
            paddingRight: 30,
          }}
          renderItem={({ item, index }) => {
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                  dispatch(setSelectedExercises(item.exercises));
                  dispatch(setSelectedTraining(item));
                  props.navigation.navigate('show-training', item);
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                    borderWidth: 1,
                    marginBottom: 30,
                    padding: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {item.trainingName}
                  </Text>
                  <Icon type="feather" name="chevron-right" />
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 24, textAlign: 'center' }}>
            {'Brak jednostek treningowych\n'}
          </Text>
          <Text style={{ fontSize: 18, textAlign: 'center' }}>
            {'Kliknij plusa u góry po prawej stronie,\nby dodać nowy trening'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default TrainingList;

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
