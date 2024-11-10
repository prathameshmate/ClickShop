import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginStack from './src/Stacks/LoginStack';
import DashBoardStack from './src/Stacks/DashBoardStack';


// redux
import {useSelector} from 'react-redux';

// var len: any;
// Create the Tab Navigator

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="LoginStack" component={LoginStack} />
          <Stack.Screen name="DashBoardStack" component={DashBoardStack} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
