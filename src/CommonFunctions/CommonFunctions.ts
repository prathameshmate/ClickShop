import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getDataFromAPI from '../Networks/Network';
import {CONS} from '../Constant/Constant';
import {
  add_Product,
  reset_Address,
  reset_Cart,
  reset_Wishlist,
} from '../Redux/actions';

export const logoutAlterBox = async (navigation: any, dispatch: any) => {
  try {
    const result: any = await AsyncStorage.getItem('LoginUserData');
    const userData = JSON.parse(result);
    Alert.alert('', 'Are you want to log Out', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          //API call
          const response = await getDataFromAPI('logout', {
            token: userData?.token,
          });

          if (response?.data?.success) {
            navigateToLoginScreen(navigation, dispatch);

            // delete data of perticular key in localstorage
            AsyncStorage.removeItem('LoginUserData');

            Alert.alert('', response?.data?.message);
          } else {
            Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage);
          }
        },
      },
    ]);
  } catch (err) {
    console.log('Error while loging out: ', err);
  }
};

export const navigateToLoginScreen = (navigation: any, dispatch: any) => {
  //reset store
  dispatch(add_Product([]));
  dispatch(reset_Cart());
  dispatch(reset_Wishlist());
  dispatch(reset_Address());
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
};

// used to check base64 or not
export const isBase64 = (str: any) => {
  if (typeof str !== 'string') return false;

  const notBase64 = /[^A-Z0-9+\/=]/i;
  const len = str.length;

  if (!len || len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }

  return true;
};
