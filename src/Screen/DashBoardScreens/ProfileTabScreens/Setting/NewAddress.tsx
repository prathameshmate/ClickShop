import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import {PERMISSIONS, request} from 'react-native-permissions';
import axios from 'axios';
import {add_Address} from '../../../../Redux/actions';

const eventEmitter = new NativeEventEmitter(
  NativeModules.ReactNativeEventEmitter,
);

const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  maxLength,
}) => (
  <View style={styles.inputContainer}>
    <View style={styles.iconWrapper}>{icon}</View>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#666"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
    />
  </View>
);

const NewAddress = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [type, setType] = useState<'home' | 'work' | ''>('');
  const [address, setAddress] = useState({
    name: '',
    number: '',
    pin: '',
    state: '',
    city: '',
    locality: '',
  });

  const handleChange = (key, value) =>
    setAddress(prev => ({...prev, [key]: value}));

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleAddAddress = () => {
    const {name, number, pin, state, city, locality} = address;
    if (!name || !number || !pin || !state || !city || !locality || !type) {
      Alert.alert(
        'Incomplete Information',
        'Please fill all details properly.',
      );
      return;
    }
    dispatch(
      add_Address({...address, home: type === 'home', work: type === 'work'}),
    );
    navigation.navigate('MyAddresses');
  };

  const requestLocationPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result === 'granted') getCurrentLocation();
      else
        Alert.alert(
          'Permission Denied',
          'Location access is required to autofill your address.',
        );
    } catch (error) {
      console.log('Location permission error:', error);
    }
  };

  const getCurrentLocation = () => {
    eventEmitter.emit('showLoader', true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLat(latitude);
        setLong(longitude);
        eventEmitter.emit('showLoader', false);
      },
      error => {
        console.log('Geolocation error:', error);
        eventEmitter.emit('showLoader', false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const fetchAddressFromCoords = useCallback(async () => {
    if (!lat || !long) return;
    eventEmitter.emit('showLoader', true);
    try {
      const {data} = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&accept-language=en`,
      );
      const {postcode, state, city, display_name} = data.address || {};
      setAddress(prev => ({
        ...prev,
        pin: postcode || '',
        state: state || '',
        city: city || '',
        locality: display_name || '',
      }));
    } catch (error) {
      console.log('Error fetching address:', error);
    } finally {
      eventEmitter.emit('showLoader', false);
    }
  }, [lat, long]);

  useEffect(() => {
    fetchAddressFromCoords();
  }, [lat, long, fetchAddressFromCoords]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Image
            source={require('../../../../../Public/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Address</Text>
      </View>

      {/* Form */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <InputField
          icon={<Icon name="user" size={22} color="#000" />}
          placeholder="Full Name (Required)*"
          value={address.name}
          onChangeText={text => handleChange('name', text)}
        />
        <InputField
          icon={<IconFA name="phone" size={22} color="#000" />}
          placeholder="Phone Number (Required)*"
          value={address.number}
          onChangeText={text => handleChange('number', text)}
          keyboardType="numeric"
          maxLength={10}
        />

        {/* Pincode + Use My Location */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.flex1, {marginRight: 5}]}>
            <View style={styles.iconWrapper}>
              <IconMI name="password" size={22} color="#000" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Pincode (Req)*"
              keyboardType="numeric"
              maxLength={6}
              value={address.pin}
              onChangeText={text => handleChange('pin', text)}
            />
          </View>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={requestLocationPermission}>
            <IconMI name="my-location" size={20} color="#fff" />
            <Text style={styles.locationButtonText}> Use My Location</Text>
          </TouchableOpacity>
        </View>

        {/* State & City */}
        <InputField
          icon={<IconMI name="location-on" size={22} color="#000" />}
          placeholder="State (Required)*"
          value={address.state}
          onChangeText={text => handleChange('state', text)}
        />
        <InputField
          icon={<IconMI name="location-city" size={22} color="#000" />}
          placeholder="City (Required)*"
          value={address.city}
          onChangeText={text => handleChange('city', text)}
        />

        {/* Locality */}
        <InputField
          icon={<IconEntypo name="address" size={22} color="#000" />}
          placeholder="Building Name / Locality (Required)*"
          value={address.locality}
          onChangeText={text => handleChange('locality', text)}
        />

        {/* Address Type */}
        <Text style={styles.typeLabel}>Type of Address</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'home' && styles.typeButtonActive,
            ]}
            onPress={() => setType('home')}>
            <IconEntypo
              name="home"
              size={18}
              color={type === 'home' ? '#FF5533' : '#000'}
            />
            <Text
              style={[
                styles.typeButtonText,
                type === 'home' && {color: '#FF5533'},
              ]}>
              {' '}
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'work' && styles.typeButtonActive,
            ]}
            onPress={() => setType('work')}>
            <IconFA
              name="building"
              size={18}
              color={type === 'work' ? '#FF5533' : '#000'}
            />
            <Text
              style={[
                styles.typeButtonText,
                type === 'work' && {color: '#FF5533'},
              ]}>
              {' '}
              Work
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.btnView}>
        <TouchableOpacity style={styles.saveButton} onPress={handleAddAddress}>
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewAddress;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 4,
  },
  backIcon: {width: 35, height: 35, tintColor: '#000'},
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginLeft: 10,
  },
  scrollContent: {padding: 12, paddingBottom: 80},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginVertical: 6,
    paddingHorizontal: 10,
    height: 45,
  },
  iconWrapper: {marginRight: 8},
  input: {flex: 1, fontSize: 16, color: '#000', fontWeight: '500'},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {flex: 1},
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 10,
    elevation: 3,
  },
  locationButtonText: {color: '#fff', fontSize: 14, fontWeight: '600'},
  typeLabel: {marginTop: 10, fontSize: 15, fontWeight: '600', color: '#000'},
  typeRow: {flexDirection: 'row', marginTop: 8, gap: 10},
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: 'gray',
    elevation: 3,
  },
  typeButtonActive: {borderColor: '#FF5533'},
  typeButtonText: {fontWeight: '600', color: '#000'},
  btnView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  saveButton: {
    alignSelf: 'center',
    backgroundColor: '#FF6600',
    borderRadius: 25,
    width: '90%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginVertical: 10,
  },
  saveButtonText: {color: '#fff', fontSize: 17, fontWeight: '700'},
});
