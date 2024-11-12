import {View, Text, TouchableOpacity, BackHandler, Alert} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Profile from './Profile';
import Setting from './Setting/Setting';
import MyAddress from './Setting/MyAddress';
import NewAddress from './Setting/NewAddress';
import SignUp from '../../LoginScreens/SignUp';
import SettingIcon from 'react-native-vector-icons/Feather';
import LogoutIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const ProfileTab = () => {
  const navigation = useNavigation();

  const navigateToDestinationScreen = () => {
    navigation.navigate('Setting');
  };

  //BackHandler in Android
  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );
  const onBackPress = () => {
    const state = navigation.getState();
    console.log('state', state);

    // Check if we are in the ProfileTab stack and if there are more routes within this stack to go back to
    const profileTabStack = state.routes.find(
      route => route.name === 'ProfileTab',
    )?.state;
    console.log('profileTabStack', profileTabStack);
    if (profileTabStack && profileTabStack.routes.length > 1) {
      navigation.pop(); // Use goBack instead of pop for reliable stack navigation
      return true; // Prevents default behavior
    }
    return false; // Allows default behavior if there's nothing left in the stack
  };

  const logoutAlterBox = async () => {
    try {
      Alert.alert('', 'Are you want to log Out', [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            // used to delete navigation history and go to LoginStack=>Login screen (nasted navigation with delelting navigation history)
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'LoginStack',
                  state: {
                    routes: [
                      {
                        name: 'Login', // The nested screen within LoginStack
                      },
                    ],
                  },
                },
              ],
            });

            // delete data of perticular key in localstorage
            AsyncStorage.removeItem('LoginUserData');
          },
        },
      ]);
    } catch (err) {
      console.log('Error while loging out: ', err);
    }
  };
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        options={{
          headerTitle: 'Profile',
          headerTitleAlign: 'center',
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 22,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{width: 40, alignItems: 'center'}}
              onPress={navigateToDestinationScreen}>
              <SettingIcon name="settings" size={30} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{width: 40, alignItems: 'center'}}
              onPress={logoutAlterBox}>
              <LogoutIcon name="logout" size={30} color="#000" />
            </TouchableOpacity>
          ),
        }}
        component={Profile}
      />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen
        name="MyAddresses"
        options={{headerTitle: 'My Addresses'}}
        component={MyAddress}
      />
      <Stack.Screen
        name="NewAddress"
        options={{headerShown: false}}
        component={NewAddress}
      />
      <Stack.Screen
        name="Create/UpdateAccount"
        options={{headerTitle: 'Create/Update Account'}}
        component={SignUp}
      />
    </Stack.Navigator>
  );
};

export default ProfileTab;
