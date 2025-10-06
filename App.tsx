import React, {useState, useEffect} from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginStack from './src/Stacks/LoginStack';
import DashBoardStack from './src/Stacks/DashBoardStack';
import Loader from './src/Screen/Loader';

// Create the Tab Navigator
const Stack = createNativeStackNavigator();
const eventEmitter = new NativeEventEmitter(
  NativeModules.ReactNativeEventEmitter,
);

const App = () => {
  const [isLoading, setIsloading] = useState(false);

  // used to create event
  useEffect(() => {
    const event = eventEmitter.addListener(
      'showLoader',
      (eventData = false) => {
        setIsloading(eventData);
      },
    );
    return () => {
      event.remove();
    };
  }, []);
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="LoginStack" component={LoginStack} />
          <Stack.Screen name="DashBoardStack" component={DashBoardStack} />
        </Stack.Navigator>
      </NavigationContainer>
      <Loader isLoading={isLoading} />
    </>
  );
};

export default App;
