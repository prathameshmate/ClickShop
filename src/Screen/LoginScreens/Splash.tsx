import React, {useEffect, useState} from 'react';
import {View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = () => {
  const navigation = useNavigation();
  const [userData, updateUserData] = useState({});

  useEffect(() => {
    const getDataAsyncStorage = async () => {
      try {
        const result: any = await AsyncStorage.getItem('LoginUserData');
        const parsedData = result ? JSON.parse(result) : {};
        updateUserData(parsedData);
      } catch (error) {
        console.error('Error reading async storage data:', error);
      }
    };
    getDataAsyncStorage();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      Object.keys(userData).length
        ? navigation.replace('DashBoardStack')
        : navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer); // Clear timeout on component unmount
  }, [userData, navigation]);

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
