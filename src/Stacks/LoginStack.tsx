import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../Screen/LoginScreens/Splash';
import Login from '../Screen/LoginScreens/Login';
import SignUP from '../Screen/LoginScreens/SignUp';

const Stack = createNativeStackNavigator();

const LoginStack = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          options={{headerShown: false}}
          component={Splash}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: ' Login'}}
        />
        <Stack.Screen
          name="Create/UpdateAccount"
          options={{headerTitle: 'Create/Update Account'}}
          component={SignUP}
        />
      </Stack.Navigator>
    </>
  );
};

export default LoginStack;
