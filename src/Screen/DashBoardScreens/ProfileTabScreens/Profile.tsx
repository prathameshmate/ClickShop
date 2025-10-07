import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import {Image as IMG} from 'react-native-compressor';
import getDataFromAPI from '../../../Networks/Network';
import {CONS} from '../../../Constant/Constant';
import {navigateToLoginScreen} from '../../../CommonFunctions/CommonFunctions';

const Profile = () => {
  const [userData, setUserData] = useState<any>({});
  const [base64Image, setBase64Image] = useState('');
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // --- Fetch profile data when screen focused
  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, []),
  );

  const fetchProfileData = async () => {
    try {
      const storedData: any = await AsyncStorage.getItem('LoginUserData');
      if (!storedData) return;

      const parsed = JSON.parse(storedData);
      const response = await getDataFromAPI('profile', {token: parsed.token});

      if (response?.data?.success) {
        setUserData(response.data.data);
        setBase64Image(response.data.data.base64ProfileImg || '');
      } else handleAPIError(response);
    } catch (err) {
      console.log('Profile fetch error:', err);
    }
  };

  const handleAPIError = (response: any) => {
    if (response?.status === 498) {
      Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage, [
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.removeItem('LoginUserData');
            navigateToLoginScreen(navigation, dispatch);
          },
        },
      ]);
    } else {
      Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage);
    }
  };

  // --- Profile Update
  const updateProfilePhoto = async (base64: string) => {
    try {
      const storedData: any = await AsyncStorage.getItem('LoginUserData');
      const parsed = JSON.parse(storedData);
      const reqData = {base64ProfileImg: base64, token: parsed.token};

      const response = await getDataFromAPI('setProfilePhoto', reqData);
      if (response?.data?.success) {
        setBase64Image(base64);
        Alert.alert('', response.data.message);
      } else handleAPIError(response);
    } catch (err) {
      console.log('Set profile image error:', err);
    }
  };

  // --- Image Compression
  const compressToTargetSize = async (uri: string, targetKB = 50) => {
    let quality = 1.0;
    let base64 = '';
    let sizeKB = Infinity;

    while (quality > 0.1 && sizeKB > targetKB) {
      const compressedUri = await IMG.compress(uri, {
        quality,
        compressionMethod: 'auto',
      });
      base64 = await RNFS.readFile(compressedUri, 'base64');
      const stats = await RNFS.stat(compressedUri);
      sizeKB = stats.size / 1024;
      quality -= 0.1;
    }
    return base64;
  };

  // --- Permission + Image Handlers
  const handleImageSelection = async (from: 'camera' | 'gallery') => {
    const permission =
      from === 'camera'
        ? await request(PERMISSIONS.ANDROID.CAMERA)
        : await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);

    if (permission !== RESULTS.GRANTED) {
      Alert.alert(
        'Permission Required',
        `Please allow access to your ${from}.`,
      );
      return;
    }

    try {
      const image =
        from === 'camera'
          ? await ImagePicker.openCamera({
              width: 800,
              height: 800,
              cropping: true,
              includeBase64: true,
              compressImageQuality: 0.8,
            })
          : await ImagePicker.openPicker({
              width: 800,
              height: 800,
              cropping: true,
              includeBase64: true,
              compressImageQuality: 0.8,
            });

      const imageKB = image.size / 1024;
      const base64 =
        imageKB > 50 ? await compressToTargetSize(image.path, 50) : image.data;

      updateProfilePhoto(base64);
      setVisible(false);
    } catch (err) {
      console.log('Image selection error:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={
            base64Image
              ? {uri: `data:image/jpeg;base64,${base64Image}`}
              : require('../../../../Public/Logos/man.png')
          }
          style={styles.profileImg}
        />
        <TouchableOpacity
          style={styles.cameraIcon}
          onPress={() => setVisible(true)}>
          <Image
            source={require('../../../../Public/Logos/camera.png')}
            style={styles.cameraIconImg}
          />
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        {[
          {label: 'Username', value: userData.username},
          {label: 'Full Name', value: userData.fullname},
          {label: 'Mobile Number', value: userData.number},
          {label: 'Email ID', value: userData.email},
        ].map(({label, value}) => (
          <View key={label} style={styles.infoBox}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value || '-'}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('SignUP', userData)}>
          <Image
            source={require('../../../../Public/Logos/edit.png')}
            style={styles.editIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal transparent visible={visible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Upload Profile Photo</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleImageSelection('camera')}>
                <Text style={styles.modalButtonText}>📷 Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleImageSelection('gallery')}>
                <Text style={styles.modalButtonText}>
                  🖼 Choose from Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9fafb'},
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: '#e3e8ef',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  profileImg: {width: 130, height: 130, borderRadius: 75},
  cameraIcon: {position: 'absolute', bottom: 25, right: '38%'},
  cameraIconImg: {width: 40, height: 40},
  infoContainer: {flex: 1, padding: 16},
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 3,
  },
  label: {fontSize: 16, color: '#0a7a3e', fontWeight: '600'},
  value: {fontSize: 18, color: '#000', fontWeight: 'bold', marginTop: 4},
  editButton: {position: 'absolute', top: 10, right: 20},
  editIcon: {width: 35, height: 35},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#0066cc',
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 6,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});
