import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const logoutAlterBox = async (navigation: any) => {
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
