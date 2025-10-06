import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import {useFormik} from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {navigateToLoginScreen} from '../../CommonFunctions/CommonFunctions';
import getDataFromAPI from '../../Networks/Network';
import {CONS} from '../../Constant/Constant';
import CommonErrorText from '../../CommonFunctions/CommonErrorText';

const SignUp = ({route}: any) => {
  const isEditMode = route?.params !== undefined;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [securety, setSecurety] = useState(true);

  const formSchema = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    userName: yup.string().required('Username is required'),
    number: yup
      .string()
      .matches(/^([+]\d{2})?\d{10}$/, 'Invalid mobile number')
      .required('Mobile number is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must include uppercase, lowercase, number, and special character',
      )
      .required('Password is required'),
  });

  const editSchema = yup.object({
    fullName: yup.string().required('Full name is required'),
    userName: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  const formik = useFormik({
    validationSchema: isEditMode ? editSchema : formSchema,
    initialValues: {
      fullName: '',
      userName: '',
      number: '',
      email: '',
      password: '',
    },
    onSubmit: async values => {
      try {
        if (isEditMode) {
          const existingData = await AsyncStorage.getItem('LoginUserData');
          const userData = JSON.parse(existingData || '{}');
          const request = {
            token: userData?.token,
            fullName: values.fullName,
            userName: values.userName,
            email: values.email,
          };
          const result = await getDataFromAPI('update', request);

          if (result?.data?.success) {
            await AsyncStorage.setItem(
              'LoginUserData',
              JSON.stringify({...userData, ...result?.data?.data}),
            );
            Alert.alert('', result?.data?.message, [
              {text: 'OK', onPress: () => navigation.navigate('Profile')},
            ]);
          } else if (result?.status === 498) {
            Alert.alert('', result?.data?.errorMessage || CONS?.errorMessage, [
              {
                text: 'OK',
                onPress: () => {
                  navigateToLoginScreen(navigation, dispatch);
                  AsyncStorage.removeItem('LoginUserData');
                },
              },
            ]);
          } else {
            Alert.alert('', result?.data?.errorMessage || CONS?.errorMessage);
          }
        } else {
          const request = {
            fullname: values.fullName,
            username: values.userName,
            number: values.number,
            email: values.email,
            password: values.password,
          };
          const response = await getDataFromAPI('register', request);
          if (response?.data?.success) {
            Alert.alert('', response?.data?.message);
            formik.resetForm();
            navigation.navigate('Login');
          } else {
            Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage);
          }
        }
      } catch (err) {
        Alert.alert('', 'Something went wrong: ' + err);
      }
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const {fullname, username, number, email, password} = route?.params || {};
      formik.setValues({
        fullName: fullname || '',
        userName: username || '',
        number: number?.toString() || '',
        email: email || '',
        password: password || '',
      });
    }
  }, [route?.params]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{marginBottom: 50}}>
          <Text style={styles.title}>
            {isEditMode ? 'Update Account' : 'Create Account'}
          </Text>

          {/* Full Name */}
          <View
            style={[
              styles.inputWrapper,
              formik.touched.fullName &&
                formik.errors.fullName &&
                styles.inputError,
            ]}>
            <Icon name="user-plus" size={22} color="#777" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formik.values.fullName}
              onChangeText={formik.handleChange('fullName')}
            />
          </View>
          {formik.touched.fullName && formik.errors.fullName && (
            <CommonErrorText errorMessage={formik.errors.fullName} />
          )}

          {/* Username */}
          <View
            style={[
              styles.inputWrapper,
              formik.touched.userName &&
                formik.errors.userName &&
                styles.inputError,
            ]}>
            <Icon name="user" size={22} color="#777" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={formik.values.userName}
              onChangeText={formik.handleChange('userName')}
            />
          </View>
          {formik.touched.userName && formik.errors.userName && (
            <CommonErrorText errorMessage={formik.errors.userName} />
          )}

          {/* Mobile Number */}
          {!isEditMode && (
            <>
              <View
                style={[
                  styles.inputWrapper,
                  formik.touched.number &&
                    formik.errors.number &&
                    styles.inputError,
                ]}>
                <Icon1
                  name="local-phone"
                  size={22}
                  color="#777"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  keyboardType="numeric"
                  maxLength={10}
                  value={formik.values.number}
                  onChangeText={formik.handleChange('number')}
                />
              </View>
              {formik.touched.number && formik.errors.number && (
                <CommonErrorText errorMessage={formik.errors.number} />
              )}
            </>
          )}

          {/* Email */}
          <View
            style={[
              styles.inputWrapper,
              formik.touched.email && formik.errors.email && styles.inputError,
            ]}>
            <Icon1 name="email" size={22} color="#777" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
            />
          </View>
          {formik.touched.email && formik.errors.email && (
            <CommonErrorText errorMessage={formik.errors.email} />
          )}

          {/* Password */}
          {!isEditMode && (
            <>
              <View
                style={[
                  styles.inputWrapper,
                  formik.touched.password &&
                    formik.errors.password &&
                    styles.inputError,
                ]}>
                <Icon1
                  name="enhanced-encryption"
                  size={22}
                  color="#777"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={securety}
                  value={formik.values.password}
                  onChangeText={formik.handleChange('password')}
                />
                <Icon2
                  name={securety ? 'eye' : 'eye-with-line'}
                  size={22}
                  color="#777"
                  onPress={() => setSecurety(prev => !prev)}
                />
              </View>
              {formik.touched.password && formik.errors.password && (
                <CommonErrorText errorMessage={formik.errors.password} />
              )}
            </>
          )}

          {/* Footer */}
          {!isEditMode && (
            <>
              <Text style={styles.policy}>
                By registering, you agree to our{' '}
                <Text style={styles.link}>Terms of Use</Text> and{' '}
                <Text style={styles.link}>Privacy Policy</Text>.
              </Text>
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.link}> Sign In</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      {/* Submit Button */}
      <View style={styles.btnView}>
        <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
          <Text style={styles.buttonText}>
            {isEditMode ? 'Update' : 'Register'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  scrollContainer: {padding: 20, paddingBottom: 60, flexGrow: 1},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#506ad9',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    elevation: 2,
    height: 45,
  },
  inputError: {borderColor: 'red'},
  input: {flex: 1, fontSize: 16, paddingVertical: 12, color: '#333'},
  icon: {marginRight: 8},
  btnView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#506ad9',
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    elevation: 3,
  },
  buttonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  policy: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
    marginVertical: 10,
  },
  link: {color: '#1E0063', fontWeight: '600'},
  footer: {flexDirection: 'row', justifyContent: 'center', marginVertical: 10},
  footerText: {fontSize: 16, color: '#506ad9'},
});
