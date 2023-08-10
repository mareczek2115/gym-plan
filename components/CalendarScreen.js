import { React, useState, useEffect } from 'react';

import {
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTrainingsList } from '../redux/trainings';
import { setSelectedExercises } from '../redux/exercises';
import { setDate } from '../redux/date';

import * as SecureStore from 'expo-secure-store';
import CalendarPicker from 'react-native-calendar-picker';
import CustomButton from './CustomButton';

const CalendarScreen = props => {
  const [buttonsActive, setButtonsActivity] = useState(false);
  const [isTraining, setIfIsTraining] = useState(false);

  const [firstFocus, setIfFirstFocus] = useState(true);
  const [calendarReady, setCalendarReady] = useState(false);

  const [installationDate, setInstallationDate] = useState(new Date());
  const [pickedTrainings, setPickedTrainings] = useState([]);
  const [pickedDate, setPickedDate] = useState('');
  const [allTrainings, setAllTrainings] = useState([]);

  const [trainingDayStyles, setTrainingDayStyles] = useState([]);

  const dispatch = useDispatch();

  const { pastTrainings } = useSelector(state => state.trainings);
  const { futureTrainings } = useSelector(state => state.trainings);
  const { selectedTrainingsList } = useSelector(state => state.trainings);

  const getTrainings = async () => {
    let joinedArr = [...pastTrainings, ...futureTrainings];
    setAllTrainings(joinedArr);
    if (pickedDate.length > 0 && joinedArr.some(o => o.date === pickedDate)) {
      setPickedTrainings(joinedArr.filter(o => o.date === pickedDate));
      setIfIsTraining(true);
      setButtonsActivity(true);
    }

    const trainingDayStyles = [];
    joinedArr.forEach(v => {
      trainingDayStyles.push({
        date: new Date(v.date),
        style: {
          backgroundColor:
            // v.isCompleted ? '#db7093' :
            '#20b2aa',
          borderColor: '#0000ff',
        },
      });
    });

    const installDate = await SecureStore.getItemAsync('installation-date');
    setInstallationDate(
      new Date(
        (new Date(JSON.parse(installDate)).getFullYear() - 1).toString() +
          JSON.parse(installDate).slice(4)
      )
    );

    setTrainingDayStyles(trainingDayStyles);
    setCalendarReady(true);
  };

  const datePick = date => {
    const pickedDate = JSON.stringify(date).slice(1, 11);
    setPickedDate(pickedDate);
    if (allTrainings.some(o => o.date === pickedDate)) {
      setIfIsTraining(true);
      setPickedTrainings(allTrainings.filter(o => o.date === pickedDate));
    } else setIfIsTraining(false);
    setButtonsActivity(true);
  };

  useEffect(() => {
    getTrainings();
    DeviceEventEmitter.addListener('refresh-trainings', () => {
      if (selectedTrainingsList.length === 0) setIfIsTraining(false);
    });
    return () => DeviceEventEmitter.removeAllListeners('refresh-trainings');
  }, []);

  useFocusEffect(() => {
    if (firstFocus) {
      getTrainings();
      setIfFirstFocus(false);
      dispatch(setSelectedExercises([]));
    }
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: calendarReady ? 'flex-start' : 'center',
      }}
    >
      {calendarReady ? (
        <CalendarPicker
          onDateChange={date => datePick(date)}
          weekdays={['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd']}
          months={[
            'Styczeń',
            'Luty',
            'Marzec',
            'Kwiecień',
            'Maj',
            'Czerwiec',
            'Lipiec',
            'Sierpień',
            'Wrzesień',
            'Październik',
            'Listopad',
            'Grudzień',
          ]}
          previousTitle="Poprzedni"
          nextTitle="Następny"
          startFromMonday={true}
          minDate={installationDate}
          restrictMonthNavigation={true}
          selectYearTitle="Wybierz rok"
          selectMonthTitle="Wybierz miesiąc"
          selectedDayColor="#87ceeb"
          customDatesStyles={trainingDayStyles}
          todayBackgroundColor="#67c2f0"
          selectedDayStyle={{ backgroundColor: '#c1c1c1' }}
          clearButtons={() => {
            setButtonsActivity(false);
            setPickedDate('');
            setIfIsTraining(false);
          }}
        />
      ) : (
        <ActivityIndicator size="large" />
      )}
      {buttonsActive ? (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {isTraining ? (
            <CustomButton
              text="Pokaż"
              onPress={() => {
                dispatch(setDate(pickedDate));
                dispatch(setSelectedTrainingsList(pickedTrainings));
                setIfFirstFocus(true);
                props.navigation.navigate('trainings-list', pickedTrainings);
              }}
              style={styles.button}
            />
          ) : null}
          <CustomButton
            text="Dodaj"
            onPress={() => {
              if (new Date().toJSON().slice(0, 10) > pickedDate) {
                Alert.alert('Błędna data', 'Wybrano przeszłą datę', [
                  { text: 'OK', style: 'cancel' },
                ]);
              } else {
                dispatch(setDate(pickedDate));
                setIfFirstFocus(true);
                props.navigation.navigate('training-plan');
              }
            }}
            style={styles.button}
          />
        </View>
      ) : null}
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 145,
    height: 45,
    marginTop: 20,
  },
});
