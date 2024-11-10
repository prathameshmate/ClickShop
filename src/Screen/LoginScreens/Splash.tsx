import React, {useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
  });
  return (
    <>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../../../Public/Logos/logo.jpg')}
          style={{height: 200, width: 200, borderRadius: 100}}
        />
      </View>
    </>
  );
};

export default Splash;
