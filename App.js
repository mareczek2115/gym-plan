import { React } from 'react';

import { Alert } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from 'react-native-elements';
import { HeaderBackButton } from '@react-navigation/elements';

import { store } from './redux/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { resetSelected, setSelectedExercises, unique } from './redux/exercises';

import * as RootNavigation from './components/RootNavigation';
import CustomDrawerContent from './components/CustomDrawetContent';
import DefaultScreen from './components/DefaultScreen';
import CalendarScreen from './components/CalendarScreen';
import AddExercise from './components/AddExercise';
import ShowExercises from './components/ShowExercises';
import TrainingPlan from './components/TrainingPlan';
import PickExercises from './components/PickExercises';
import ShowTraining from './components/ShowTraining';
import EditExercise from './components/EditExercise';
import { resetDate } from './redux/date';
import TrainingList from './components/TrainingsList';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const navTheme = DefaultTheme;

function Root() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="default-screen"
        component={DefaultScreen}
        options={{
          headerTitle: '',
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="calendar"
        options={{
          headerTitle: 'Kalendarz z treningami',
          unmountOnBlur: true,
        }}
        component={CalendarScreen}
      />
      <Drawer.Screen
        name="add-exercise"
        component={AddExercise}
        options={{
          headerTitle: 'Dodaj ćwiczenie',
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="show-exercises"
        component={ShowExercises}
        options={{
          headerTitle: 'Edytuj ćwiczenia',
          unmountOnBlur: true,
        }}
      />
    </Drawer.Navigator>
  );
}

function App() {
  const { selectedExercises } = useSelector(state => state.exercises);
  const dispatch = useDispatch();

  return (
    <NavigationContainer theme={navTheme} ref={RootNavigation.navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name="root"
          component={Root}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="training-plan"
          component={TrainingPlan}
          options={{
            headerTitle: '',
            headerLeft: () => (
              <HeaderBackButton
                onPress={() => {
                  if (selectedExercises.length > 0) {
                    Alert.alert(
                      'Nie zapisałeś treningu',
                      'Czy na pewno chcesz wyjść?',
                      [
                        {
                          text: 'Tak',
                          onPress: () => {
                            dispatch(setSelectedExercises([]));
                            dispatch(resetDate());
                            RootNavigation.goBack();
                          },
                        },
                        { text: 'Nie', style: 'cancel' },
                      ]
                    );
                  } else RootNavigation.goBack();
                }}
                style={{ marginLeft: -5 }}
              />
            ),
            headerRight: () => (
              <Icon
                type="ionicon"
                name="add-outline"
                onPress={() => {
                  RootNavigation.navigate('pick-exercises');
                }}
                size={32}
              />
            ),
          }}
        />
        <Stack.Screen
          name="pick-exercises"
          component={PickExercises}
          options={{
            headerTitle: '',
            headerLeft: () => (
              <HeaderBackButton
                onPress={() => {
                  dispatch(unique());
                  RootNavigation.goBack();
                }}
                style={{ marginLeft: -5 }}
              />
            ),
            headerRight: () => (
              <Icon
                type="ionicon"
                name="checkmark-outline"
                onPress={() => {
                  dispatch(unique());
                  RootNavigation.goBack();
                }}
                size={32}
              />
            ),
          }}
        />
        <Stack.Screen
          name="show-training"
          component={ShowTraining}
          options={{
            headerTitle: '',
            headerLeft: () => (
              <HeaderBackButton
                onPress={() => {
                  RootNavigation.goBack();
                }}
                style={{ marginLeft: -5 }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="edit-exercise"
          component={EditExercise}
          options={{
            headerTitle: 'Edytuj ćwiczenie',
          }}
        />
        <Stack.Screen
          name="trainings-list"
          component={TrainingList}
          options={{
            headerTitle: '',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
