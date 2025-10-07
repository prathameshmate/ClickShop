import React, {useEffect} from 'react';
import {View, Image, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getDataFromAPI from '../../Networks/Network';
import {useDispatch} from 'react-redux';
import {
  add_Product,
  reset_Address,
  reset_Cart,
  reset_Wishlist,
} from '../../Redux/actions';
import {CONS} from '../../Constant/Constant';

const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const launchDetails = async () => {
      try {
        const result: any = await AsyncStorage.getItem('LoginUserData');
        const userData = result ? JSON.parse(result) : {};
        const response = await getDataFromAPI('launchDetails', {
          token: userData?.token,
          deviceID: '',
        });
        var time;
        if (response?.data?.success) {
          // used to store all products in the redux store
          dispatch(add_Product(response?.data?.data?.categorys || []));
          time = setTimeout(() => {
            navigation.replace('DashBoardStack');
          }, 2000);
        } else {
          if (response?.status === 498) {
            //reset store
            dispatch(add_Product([]));
            dispatch(reset_Cart());
            dispatch(reset_Wishlist());
            dispatch(reset_Address());
            time = setTimeout(() => {
              navigation.replace('Login');
            }, 2000);
          } else {
            Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage);
          }
        }

        return () => clearTimeout(time);
      } catch (error) {
        console.log('Error reading async storage dat  a:', error);
      }
    };
    launchDetails();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <Image
        source={require('../../../Public/Logos/logo.jpg')}
        resizeMethod="scale"
        style={{
          height: 120,
          width: 100,
          borderWidth: 1,
          backgroundColor: 'red',
        }}
      />
    </View>
  );
};

export default Splash;
