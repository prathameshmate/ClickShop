import React, {useEffect} from 'react';
import {View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getDataFromAPI from '../../Networks/Network';
import {useDispatch} from 'react-redux';
import {add_Product} from '../../Redux/actions';

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
        console.log('response', response);

        // used to store all products in the redux store
        dispatch(add_Product(response?.data?.data?.categorys || []));

        const time = setTimeout(() => {
          response?.status === 200
            ? navigation.replace('DashBoardStack')
            : navigation.replace('Login');
        }, 2000);
        return () => clearTimeout(time);
      } catch (error) {
        console.error('Error reading async storage dat  a:', error);
      }
    };
    launchDetails();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={require('../../../Public/Logos/logo.jpg')}
        style={{height: 200, width: 200, borderRadius: 100}}
      />
    </View>
  );
};

export default Splash;
