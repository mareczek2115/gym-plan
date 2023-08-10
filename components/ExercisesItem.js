import { React, useEffect, useState } from 'react';

import { Text, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import { useDispatch } from 'react-redux';
import {
  addExerciseToSelected,
  removeExerciseFromSelected,
  moveExerciseUp,
  moveExerciseDown,
} from '../redux/exercises';

import CustomButton from './CustomButton';

const Exercise = props => {
  const [isPicked, setIfIsPicked] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.type === 'select-exercise' && props.selected) setIfIsPicked(true);
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        isPicked
          ? dispatch(removeExerciseFromSelected(props.item.exerciseId))
          : dispatch(addExerciseToSelected(props.item.exerciseId));
        setIfIsPicked(!isPicked);
      }}
      disabled={props.type !== 'select-exercise' ? true : false}
    >
      <View
        style={
          props.type === 'show-exercises'
            ? {
                backgroundColor: 'white',
                borderWidth: 1,
                flexDirection: 'column',
                marginBottom: 30,
              }
            : styles.mapItem
        }
        key={props.index}
      >
        <View
          style={{
            flex: 0,
            flexDirection: 'column',
            padding: 20,
            width: props.type !== 'show-exercises' ? '85%' : 'auto',
            alignItems: 'stretch',
            justifyContent: 'space-around',
          }}
        >
          <View>
            <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
              {props.item.exerciseName}
            </Text>
            <Text style={{ fontSize: 18 }}>
              Ilość powtórzeń:{' '}
              <Text style={{ color: '#cf2f53' }}>{props.item.reps}</Text>
            </Text>
            <Text style={{ fontSize: 18 }}>
              Ilość serii:{' '}
              <Text style={{ color: '#cf2f53' }}>{props.item.sets}</Text>
            </Text>
            <Text style={{ fontSize: 18 }}>
              Obciążenie:{' '}
              <Text style={{ color: '#cf2f53' }}>
                {props.item.weight}
                {props.item.weight.includes('kg') ? '' : ' kg'}
              </Text>
            </Text>
            <Text style={{ fontSize: 18 }}>
              Zaangażowane mięśnie:{' '}
              {props.item.involvedMuscles.map((v, i) => {
                const muscle = props.muscles.find(o => o.id === v);
                if (muscle) {
                  return (
                    <Text key={i} style={{ color: '#cf2f53' }}>
                      {muscle.name}
                      {i !== props.item.involvedMuscles.length - 1 ? ', ' : ''}
                    </Text>
                  );
                }
              })}
            </Text>
            <Text style={{ fontSize: 18 }}>
              Ostatnio wykonywane:{' '}
              <Text style={{ color: '#cf2f53' }}>
                {props.item.lastPerformed}
              </Text>
            </Text>
          </View>
          {props.type === 'show-exercises' ? (
            <View
              style={{
                marginTop: '5%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}
            >
              <CustomButton
                text="Edytuj"
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'black',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 115,
                  height: 35,
                }}
                onPress={() =>
                  props.navigation.navigate('edit-exercise', {
                    item: props.item,
                  })
                }
              />
              <CustomButton
                text="Usuń"
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'black',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 115,
                  height: 35,
                }}
                onPress={() => props.deleteExercise(props.item.exerciseId)}
              />
            </View>
          ) : null}
        </View>
        {props.type === 'select-exercise' ? (
          <View style={{ marginRight: 10 }}>
            <Icon
              type="ionicon"
              name={
                props.selected ? 'checkmark-circle-outline' : 'ellipse-outline'
              }
              size={28}
              style={{ marginTop: 20 }}
              color={props.selected ? '#11b832' : 'black'}
            />
          </View>
        ) : props.type === 'training-plan' ? (
          <View
            style={{
              justifyContent: 'space-evenly',
              marginRight: 10,
            }}
          >
            <Icon
              type="ionicon"
              name="arrow-up-outline"
              size={36}
              onPress={() => dispatch(moveExerciseUp(props.item.exerciseId))}
            />
            <Icon
              type="ionicon"
              name="arrow-down-outline"
              size={36}
              onPress={() => dispatch(moveExerciseDown(props.item.exerciseId))}
            />
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Exercise;

const styles = StyleSheet.create({
  mapItem: {
    backgroundColor: 'white',
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent: 'space-between',
  },
});
