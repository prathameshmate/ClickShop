import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//camera
import ImagePicker, {openCamera} from 'react-native-image-crop-picker';
import {request, PERMISSIONS} from 'react-native-permissions';
import getDataFromAPI from '../../../Networks/Network';
import {CONS} from '../../../Constant/Constant';

const Profile = () => {
  var [dataObj, updateDataObj] = useState({});
  const [imageUri, setImageUri] = useState('');
  const [visible, updateVisiable] = useState(false);

  // called whenever screen get focused
  useFocusEffect(
    useCallback(() => {
      getDataAsyncStorage();
    }, []),
  );

  const getDataAsyncStorage = async () => {
    try {
      const result: any = await AsyncStorage.getItem('LoginUserData');
      const userData = JSON.parse(result);
      const response = await getDataFromAPI('profile', {
        token: userData.token,
      });
      if (response?.data?.success) {
        updateDataObj(response?.data?.data);
      } else {
        if (response?.status === 498) {
          //session expire
          Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage, [
            {
              text: 'OK',
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
        } else {
          Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage);
        }
      }
    } catch (err) {
      console.log('Error while calling API', err);
    }
  };

  const navigation = useNavigation();

  const navigateToDestinationScreen = () => {
    navigation.navigate('Create/UpdateAccount', dataObj);
  };

  const checkCameraPermissions = async () => {
    const result = await request(PERMISSIONS.ANDROID.CAMERA);
    if (result === 'granted') {
      openCamera();
      updateVisiable(false);
      console.log('granted : ' + result);
    } else {
      console.log('permission denited...' + result);
    }
  };
  const checkGallaryPermissions = async () => {
    const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    if (result === 'granted') {
      openGallary();
      updateVisiable(false);
      console.log('granted : ' + result);
    } else {
      console.log('permission denited...' + result);
    }
  };

  const openCamera = async () => {
    try {
      const img = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      });
      setImageUri(img.path);
    } catch (err) {
      console.log(err);
    }
  };
  const openGallary = async () => {
    try {
      const img = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      setImageUri(img.path);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={{flex: 1}}>
      <View style={styles.upperView}>
        <View style={{width: '32%'}}>
          {imageUri === '' ? (
            <Image
              source={require('../../../../Public/Logos/man.png')}
              style={{width: 130, height: 130}}
            />
          ) : (
            <Image
              source={{uri: imageUri}}
              style={{width: 130, height: 130, borderRadius: 75}}
            />
          )}
          <Modal transparent={true} visible={visible} animationType="slide">
            <TouchableWithoutFeedback
              onPress={() => {
                updateVisiable(false);
              }}>
              <View style={styles.modalView}>
                <View style={styles.modalInnerview}>
                  <Text style={styles.modalTxt1}>Upload Profile Photo</Text>
                  <Button
                    title="Take Photo"
                    onPress={() => {
                      checkCameraPermissions();
                    }}
                  />
                  <Button
                    title="Choose From Gallary"
                    onPress={() => {
                      checkGallaryPermissions();
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <TouchableOpacity
            style={styles.camera}
            onPress={() => {
              updateVisiable(true);
            }}>
            <Image
              source={require('../../../../Public/Logos/camera.png')}
              style={{width: 40, height: 40}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 2}}>
        <View style={styles.lowerViewBox}>
          <Text style={styles.heading}>Username </Text>
          <View style={{marginLeft: 5}}>
            <Text style={styles.lowerTxt}>{dataObj.username}</Text>
          </View>
        </View>
        <View style={styles.lowerViewBox}>
          <Text style={styles.heading}>FullName </Text>
          <View style={{marginLeft: 5}}>
            <Text style={styles.lowerTxt}>{dataObj.fullname}</Text>
          </View>
        </View>
        <View style={styles.lowerViewBox}>
          <Text style={styles.heading}>Mobile Number </Text>
          <View style={{marginLeft: 5}}>
            <Text style={styles.lowerTxt}>{dataObj.number}</Text>
          </View>
        </View>
        <View style={styles.lowerViewBox}>
          <Text style={styles.heading}>Email ID </Text>
          <View style={{marginLeft: 5}}>
            <Text style={styles.lowerTxt}>{dataObj.email}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.edit}
          onPress={() => {
            navigateToDestinationScreen();
          }}>
          <Image
            source={require('../../../../Public/Logos/edit.png')}
            style={{width: 40, height: 40}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  upperView: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    borderRadius: 10,
  },
  camera: {
    position: 'absolute',
    bottom: 10,
    right: 5,
  },
  lowerViewBox: {
    borderRadius: 10,
    margin: 10,
    marginTop: 10,
    padding: 5,
    backgroundColor: '#fff',
    elevation: 5,
  },
  heading: {
    fontSize: 18,
    color: 'green',
    fontWeight: '500',
  },
  lowerTxt: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  edit: {
    position: 'absolute',
    top: 0,
    right: 10,
  },

  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInnerview: {
    width: '80%',
    height: '25%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: 'black',
    elevation: 10,
    backgroundColor: 'white',
    padding: 10,
  },
  modalTxt1: {
    fontSize: 24,
  },
});
export default Profile;
