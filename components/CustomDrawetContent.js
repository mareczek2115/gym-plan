import React from 'react';

import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Alert } from 'react-native';

const CustomDrawerContent = props => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        labelStyle={{
          fontSize: 18,
        }}
        label="Kalendarz z treningami"
        onPress={() => props.navigation.navigate('calendar')}
      />
      <DrawerItem
        labelStyle={{
          fontSize: 18,
        }}
        label="Dodaj ćwiczenie"
        onPress={() => props.navigation.navigate('add-exercise')}
      />
      <DrawerItem
        labelStyle={{
          fontSize: 18,
        }}
        label="Edytuj ćwiczenia"
        onPress={() => props.navigation.navigate('show-exercises')}
      />
      <DrawerItem
        labelStyle={{
          fontSize: 18,
        }}
        label="O aplikacji"
        onPress={() => {
          Alert.alert(
            'O aplikacji',
            'GymPlan, ver. 1.1.0\nDeveloped by Marek Kramarz',
            [{ text: 'Zamknij', style: 'cancel' }],
            { cancelable: true }
          );
        }}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
