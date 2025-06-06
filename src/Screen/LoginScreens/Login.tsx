import React, {useRef, useState} from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  BackHandler,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  findNodeHandle,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getDataFromAPI from '../../Networks/Network';
import {CONS} from '../../Constant/Constant';
import {useDispatch} from 'react-redux';
import {add_Product} from '../../Redux/actions';
import CommonErrorText from '../../CommonFunctions/CommonErrorText';

const height = Dimensions.get('window').height;

const Login = () => {
  const [securety, updateSecurety] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const scrollRef = useRef(null);
  const inputRefs = {
    mobile: useRef(null),
    password: useRef(null),
  };

  const scrollToInput = inputRef => {
    inputRef.current?.measureLayout(
      findNodeHandle(scrollRef.current),
      (x, y) => {
        scrollRef.current?.scrollTo({y, animated: true});
      },
      error => {
        console.log('measureLayout error:', error);
      },
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
      return () => backHandler.remove();
    }, []),
  );

  const handleBackButtonClick = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      {text: 'NO', style: 'cancel'},
      {text: 'Yes', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  const navigateToDestinationScreen = () => {
    navigation.navigate('Create/UpdateAccount');
  };

  const show = async () => {
    setLoading(true);
    try {
      const response = await getDataFromAPI('login', {
        number: formik.values.mobileNum,
        password: formik.values.password,
      });

      if (response?.data?.success) {
        await AsyncStorage.setItem(
          'LoginUserData',
          JSON.stringify(response?.data?.data),
        );
        Alert.alert('', response?.data?.message);

        dispatch(add_Product(response?.data?.data?.Products?.categorys || []));

        navigation.reset({
          index: 0,
          routes: [{name: 'DashBoardStack'}],
        });
      } else {
        Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formScheama = yup.object().shape({
    mobileNum: yup
      .string()
      .trim()
      .matches(/^\d{10}$/, 'Mobile must be 10 digits')
      .required('Mobile number is required'),
    password: yup
      .string()
      .trim()
      .min(6, 'Minimum 8 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    validationSchema: formScheama,
    initialValues: {
      mobileNum: '',
      password: '',
    },
    onSubmit: async () => {
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        if (errors.mobileNum) scrollToInput(inputRefs.mobile);
        else if (errors.password) scrollToInput(inputRefs.password);
        return;
      }
      show();
    },
  });

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={{marginBottom: 40, flex: 1}}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../Public/Logos/logo.jpg')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View>
              <View
                style={[
                  styles.inputGroup,
                  {
                    borderColor:
                      formik.touched.mobileNum && formik.errors.mobileNum
                        ? 'red'
                        : 'gray',
                  },
                ]}
                ref={inputRefs.mobile}>
                <Icon name="user" color="gray" size={24} style={styles.icon} />
                <TextInput
                  placeholder="Mobile number +91"
                  value={formik.values.mobileNum}
                  keyboardType="numeric"
                  maxLength={10}
                  style={styles.input}
                  onChangeText={formik.handleChange('mobileNum')}
                  onBlur={formik.handleBlur('mobileNum')}
                  ref={inputRefs.mobile}
                />
              </View>
              {formik.touched.mobileNum && formik.errors.mobileNum && (
                <CommonErrorText
                  style={styles.errorText}
                  errorMessage={formik.errors.mobileNum}
                />
              )}

              <View
                style={[
                  styles.inputGroup,
                  {
                    borderColor:
                      formik.touched.password && formik.errors.password
                        ? 'red'
                        : 'gray',
                  },
                ]}
                ref={inputRefs.password}>
                <Icon1
                  name="enhanced-encryption"
                  color="gray"
                  size={24}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Password"
                  value={formik.values.password}
                  style={styles.input}
                  secureTextEntry={securety}
                  onChangeText={formik.handleChange('password')}
                  onBlur={formik.handleBlur('password')}
                  ref={inputRefs.password}
                />
                <Icon2
                  name={securety ? 'eye' : 'eye-with-line'}
                  color="gray"
                  size={24}
                  style={styles.icon}
                  onPress={() => updateSecurety(prev => !prev)}
                />
              </View>
              {formik.touched.password && formik.errors.password && (
                <CommonErrorText
                  style={styles.errorText}
                  errorMessage={formik.errors.password}
                />
              )}

              <View style={styles.createAcc}>
                <Text style={styles.acc_Txt}>Don't have an account?</Text>
                <TouchableOpacity onPress={navigateToDestinationScreen}>
                  <Text style={styles.createAccTxt}> Create One</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.btnView}>
          <TouchableOpacity
            style={[styles.signBtn, loading && {opacity: 0.6}]}
            onPress={formik.handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.singTxt}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 50,
  },
  logo: {
    height: 150,
  },
  inputGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  icon: {
    paddingHorizontal: 4,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  createAcc: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  acc_Txt: {
    fontSize: 16,
    color: '#415BE3',
  },
  createAccTxt: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E0063',
  },
  btnView: {
    padding: 15,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  signBtn: {
    backgroundColor: '#506ad9',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 5,
  },
  singTxt: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
