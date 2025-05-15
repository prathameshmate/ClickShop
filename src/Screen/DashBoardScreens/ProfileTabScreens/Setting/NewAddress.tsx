import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import {add_Address} from '../../../../Redux/actions';
import axios from 'axios';

// import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';

import {PERMISSIONS, request} from 'react-native-permissions';

const eventEmitter = new NativeEventEmitter(
  NativeModules.ReactNativeEventEmitter,
);

const NewAddress = () => {
  const [isSelected1, setIsSelected1] = useState(false);
  const [isSelected2, setIsSelected2] = useState(false);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);

  const [address, setAddress] = useState({
    name: '',
    number: '',
    pin: '',
    state: '',
    city: '',
    locality: '',
  });

  const navigation = useNavigation();
  const navigateToDestinationScreen = () => {
    navigation.goBack();
  };

  const update1 = () => {
    setIsSelected1(true);
    setIsSelected2(false);
  };
  const update2 = () => {
    setIsSelected2(true);
    setIsSelected1(false);
  };

  const fun = (name: any, value: any) => {
    setAddress({...address, [name]: value});
  };

  const dispatch = useDispatch();

  const handleAddAddress = () => {
    if (
      address.name !== '' &&
      address.number !== '' &&
      address.pin !== '' &&
      address.state !== '' &&
      address.city !== '' &&
      address.locality !== '' &&
      (isSelected1 || isSelected2)
    ) {
      dispatch(add_Address({...address, home: isSelected1, work: isSelected2}));
      navigation.navigate('MyAddresses');
    } else {
      Alert.alert('Please fill all details properly!');
    }
  };

  const checkLocationPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result === 'granted') {
        getLatLog();
        console.log('granted : ' + result);
      } else {
        console.log('permission denited...' + result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getLatLog = () => {
    eventEmitter.emit('showLoader', true);

    Geolocation.getCurrentPosition(
      position => {
        console.log('position', position);
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      },
      error => {
        eventEmitter.emit('showLoader', false);
        // See error code charts below.
        console.log('error:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    Geolocation.getCurrentPosition(info => console.log('info', info));
    // eventEmitter.emit('showLoader', false);
  };
  const updateAddressByLatLong = async () => {
    eventEmitter.emit('showLoader', true);

    try {
      if (lat !== 0 && long !== 0) {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&accept-language=en`,
        );
        console.log('address', response.data.address);

        let pin = response.data.address.postcode;
        let state = response.data.address.state;
        let city = response.data.address.city;
        let locality = response.data.display_name;

        setAddress({
          ...address,
          ['pin']: pin,
          ['state']: state,
          ['city']: city,
          ['locality']: locality,
        });
      }
    } catch (error) {
      eventEmitter.emit('showLoader', false);
      console.log('error occure while fetching API ! ' + error);
    }
    eventEmitter.emit('showLoader', false);
  };
  useEffect(() => {
    updateAddressByLatLong();
  }, [lat, long]);
  return (
    <>
      <View style={{flex: 1}}>
        <View style={{paddingVertical: 10, paddingHorizontal: 5}}>
          <TouchableOpacity
            onPress={navigateToDestinationScreen}
            style={{width: 40}}>
            <Image
              source={require('../../../../../Public/back.png')}
              style={{width: 40, height: 40}}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={{padding: 10}}>
          <View
            style={{
              borderWidth: 0.5,
              borderRadius: 5,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              marginVertical: 10,
              elevation: 5,
              height: 45,
            }}>
            <View style={{width: '12%', alignItems: 'center'}}>
              <Icon
                name="user"
                size={27}
                color={'#000'}
                style={{backgroundColor: '#fff', borderRadius: 5}}
              />
            </View>
            <TextInput
              style={{
                borderLeftWidth: 0.5,
                width: '88%',
                backgroundColor: '#fff',
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                fontSize: 17,
                fontWeight: 'bold',
                paddingHorizontal: 10,
              }}
              placeholder="Full Name(Required)*"
              onChangeText={type => {
                fun('name', type);
              }}
              value={address.name}
            />
          </View>
          <View
            style={{
              borderWidth: 0.5,
              borderRadius: 5,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              marginVertical: 10,
              elevation: 5,
              height: 45,
            }}>
            <View style={{width: '12%', alignItems: 'center'}}>
              <Icon2
                name="phone"
                size={27}
                color={'#000'}
                style={{backgroundColor: '#fff', borderRadius: 5}}
              />
            </View>
            <TextInput
              style={{
                borderLeftWidth: 0.5,
                width: '88%',
                backgroundColor: '#fff',
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                fontSize: 17,
                fontWeight: 'bold',
                paddingHorizontal: 10,
              }}
              placeholder="Phone Number(Required)*"
              keyboardType="numeric"
              maxLength={10}
              onChangeText={type => {
                fun('number', type);
              }}
              value={address.number}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                flex: 1,
                borderWidth: 0.5,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                marginVertical: 10,
                marginRight: 5,
                elevation: 5,
                height: 45,
              }}>
              <View style={{marginRight: 10}}>
                <Icon3
                  name="password"
                  size={27}
                  color={'#000'}
                  style={{backgroundColor: '#fff'}}
                />
              </View>
              <TextInput
                style={{
                  borderLeftWidth: 0.5,
                  backgroundColor: '#fff',
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  fontSize: 16,
                  fontWeight: 'bold',
                  paddingHorizontal: 10,
                }}
                placeholder="Pincode(Req)*"
                keyboardType="numeric"
                maxLength={6}
                onChangeText={type => {
                  fun('pin', type);
                }}
                value={address.pin}
              />
            </View>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'blue',
                elevation: 5,
                borderRadius: 8,
                flexDirection: 'row',
                height: 40,
                marginLeft: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={checkLocationPermission}>
              <Icon3 name="my-location" size={27} color={'#fff'} />
              <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                {' '}
                Use My Location{' '}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                flex: 1,
                borderWidth: 0.5,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                marginVertical: 10,
                marginRight: 5,
                elevation: 5,
                height: 45,
              }}>
              <View style={{marginRight: 8}}>
                <Icon3
                  name="location-on"
                  size={27}
                  color={'#000'}
                  style={{backgroundColor: '#fff', borderRadius: 5}}
                />
              </View>
              <TextInput
                style={{
                  borderLeftWidth: 0.5,
                  backgroundColor: '#fff',
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  fontSize: 16,
                  fontWeight: 'bold',
                  paddingHorizontal: 10,
                }}
                placeholder="State(Required)*"
                onChangeText={type => {
                  fun('state', type);
                }}
                value={address.state}
              />
            </View>
            <View
              style={{
                flex: 1,
                borderWidth: 0.5,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                marginVertical: 10,
                marginLeft: 5,
                elevation: 5,
                height: 45,
              }}>
              <View style={{marginRight: 10}}>
                <Icon3
                  name="location-city"
                  size={27}
                  color={'#000'}
                  style={{backgroundColor: '#fff', borderRadius: 5}}
                />
              </View>
              <TextInput
                style={{
                  borderLeftWidth: 0.5,
                  backgroundColor: '#fff',
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  fontSize: 16,
                  fontWeight: 'bold',
                  paddingHorizontal: 10,
                }}
                placeholder="City(Required)*"
                onChangeText={type => {
                  fun('city', type);
                }}
                value={address.city}
              />
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              borderRadius: 5,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              marginVertical: 10,
              height: 45,
            }}>
            <View style={{width: '12%', alignItems: 'center'}}>
              <Icon1
                name="address"
                size={27}
                color={'#000'}
                style={{backgroundColor: '#fff', borderRadius: 5}}
              />
            </View>
            <TextInput
              style={{
                borderLeftWidth: 0.5,
                width: '88%',
                backgroundColor: '#fff',
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                fontSize: 17,
                fontWeight: 'bold',
                paddingHorizontal: 10,
              }}
              placeholder="Building Name / Locality(Required)*"
              onChangeText={type => {
                fun('locality', type);
              }}
              value={address.locality}
            />
          </View>
          <View style={{marginVertical: 5}}>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
              Type of Address
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '60%',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={{
                borderWidth: 0.5,
                borderRadius: 50,
                borderColor: isSelected1 ? 'blue' : 'gray',
                paddingVertical: 5,
                paddingHorizontal: 15,
                backgroundColor: '#fff',
                elevation: 5,
                flexDirection: 'row',
              }}
              onPress={update1}>
              <Icon1
                name="home"
                size={18}
                color={isSelected1 ? 'blue' : '#000'}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: isSelected1 ? 'blue' : '#000',
                }}>
                {' '}
                Home{' '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 0.5,
                borderRadius: 50,
                paddingVertical: 5,
                paddingHorizontal: 15,
                backgroundColor: '#fff',
                elevation: 5,
                flexDirection: 'row',
              }}
              onPress={update2}>
              <Icon2
                name="building"
                size={18}
                color={isSelected2 ? 'blue' : '#000'}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: isSelected2 ? 'blue' : '#000',
                }}>
                {' '}
                Work{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{
            backgroundColor: '#ff6600',
            width: '95%',
            height: 50,
            marginVertical: 15,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
            borderRadius: 5,
          }}
          onPress={handleAddAddress}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: '#fff'}}>
            Save Address
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default NewAddress;
