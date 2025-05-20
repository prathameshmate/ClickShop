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
import ImagePicker from 'react-native-image-crop-picker';
import {request, PERMISSIONS} from 'react-native-permissions';
import getDataFromAPI from '../../../Networks/Network';
import {CONS} from '../../../Constant/Constant';
import {navigateToLoginScreen} from '../../../CommonFunctions/CommonFunctions';
import {useDispatch} from 'react-redux';
import RNFS from 'react-native-fs';
import {Image as IMG} from 'react-native-compressor';

const Profile = () => {
  var [dataObj, updateDataObj] = useState({});
  const [base64Image, setBase64Image] = useState('');
  const [visible, updateVisiable] = useState(false);

  const dispatch = useDispatch();

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
        setBase64Image(response?.data?.data.base64ProfileImg || '');
      } else {
        if (response?.status === 498) {
          //session expire
          Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage, [
            {
              text: 'OK',
              onPress: () => {
                navigateToLoginScreen(navigation, dispatch);

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

  //calling set profile image API
  const setProfileImage = async (base64Image: any) => {
    try {
      const result: any = await AsyncStorage.getItem('LoginUserData');
      const userData = JSON.parse(result);
      const reqData = {
        base64ProfileImg: base64Image,
        token: userData.token,
      };
      const response = await getDataFromAPI('setProfilePhoto', reqData);
      if (response?.data?.success) {
        setBase64Image(base64Image || '');
        Alert.alert('', response?.data?.message);
      } else {
        if (response?.status === 498) {
          //session expire
          Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage, [
            {
              text: 'OK',
              onPress: () => {
                navigateToLoginScreen(navigation, dispatch);

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
      console.log('Error while calling setProfileImage API', err);
    }
  };

  const compressToTargetSize = async (uri: any, targetSize = 50) => {
    let quality = 1.0;
    let base64 = '';
    let sizeKB = Infinity;

    while (quality > 0.1 && sizeKB > targetSize) {
      const compressedUri = await IMG.compress(uri, {
        compressionMethod: 'auto',
        quality,
      });

      base64 = await RNFS.readFile(compressedUri, 'base64');
      const stats = await RNFS.stat(compressedUri);
      sizeKB = stats.size / 1024;
      console.log(`Quality: ${quality}, Size: ${sizeKB}KB`);
      quality -= 0.1;
    }

    return base64;
  };
  const openCamera = async () => {
    try {
      const img = await ImagePicker.openCamera({
        width: 800,
        height: 800,
        cropping: true,
        compressImageQuality: 0.8,
        includeBase64: true,
      });
      console.log('img', img.size / 1024 + 'KB');

      // Check the file size and re-compress if necessary
      if (img.size / 1024 > 50) {
        const base64 = await compressToTargetSize(img?.path, 50);
        console.log('base64', base64);
        setProfileImage(base64 || '');
      } else {
        setProfileImage(img?.data || '');
      }
    } catch (err) {
      console.log(err);
    }
  };
  const openGallary = async () => {
    try {
      const img = await ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        compressImageQuality: 0.8,
        includeBase64: true,
      });
      console.log('img', img.size / 1024 + 'KB');
      // Check the file size and re-compress if necessary
      if (img.size / 1024 > 50) {
        const base64 = await compressToTargetSize(img?.path, 50);
        setProfileImage(base64 || '');
      } else {
        setProfileImage(img?.data || '');
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={{flex: 1}}>
      <View style={styles.upperView}>
        <View style={{width: '32%'}}>
          {base64Image === '' ? (
            <Image
              source={require('../../../../Public/Logos/man.png')}
              style={{width: 130, height: 130}}
            />
          ) : (
            <Image
              source={{uri: `data:image/jpeg;base64,${base64Image}`}}
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
