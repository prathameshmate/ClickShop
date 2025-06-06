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

const SignUp = (props: any) => {
  const isEditMode = props.route.params !== undefined;

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
            fullName: formik.values.fullName || '',
            userName: formik.values.userName || '',
            email: formik.values.email || '',
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
            //session expire
            Alert.alert('', result?.data?.errorMessage || CONS?.errorMessage, [
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
            Alert.alert('', result?.data?.errorMessage || CONS?.errorMessage);
          }
        } else {
          const request = {
            fullname: formik.values.fullName,
            username: formik.values.userName,
            number: formik.values.number,
            email: formik.values.email,
            password: formik.values.password,
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
        Alert.alert('', 'Something went wrong' + err);
      }
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const {fullname, username, number, email, password} =
        props?.route?.params || {};
      formik.setValues({
        fullName: fullname || '',
        userName: username || '',
        number: number?.toString() || '',
        email: email || '',
        password: password || '',
      });
    }
  }, [props?.route?.params]);

  return (
    <KeyboardAvoidingView
      style={styles.main}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {isEditMode ? 'Update Account' : 'Create Account'}
        </Text>

        {/* Full Name */}
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor:
                formik.touched.fullName && formik.errors.fullName
                  ? 'red'
                  : 'gray',
            },
          ]}>
          <Icon name="user-plus" size={25} color="gray" style={styles.icon} />
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
            {
              borderColor:
                formik.touched.userName && formik.errors.userName
                  ? 'red'
                  : 'gray',
            },
          ]}>
          <Icon name="user" size={25} color="gray" style={styles.icon} />
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

        {/* Number */}
        {!isEditMode && (
          <>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor:
                    formik.touched.number && formik.errors.number
                      ? 'red'
                      : 'gray',
                },
              ]}>
              <Icon1
                name="local-phone"
                size={25}
                color="gray"
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
            {
              borderColor:
                formik.touched.email && formik.errors.email ? 'red' : 'gray',
            },
          ]}>
          <Icon1 name="email" size={25} color="gray" style={styles.icon} />
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
                {
                  borderColor:
                    formik.touched.password && formik.errors.password
                      ? 'red'
                      : 'gray',
                },
              ]}>
              <Icon1
                name="enhanced-encryption"
                size={25}
                color="gray"
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
                size={25}
                color="gray"
                onPress={() => setSecurety(!securety)}
              />
            </View>
            {formik.touched.password && formik.errors.password && (
              <CommonErrorText errorMessage={formik.errors.password} />
            )}
          </>
        )}

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
          <Text style={styles.buttonText}>
            {isEditMode ? 'Update' : 'Register'}
          </Text>
        </TouchableOpacity>

        {!isEditMode && (
          <>
            <Text style={styles.policy}>
              By registering you agree to our{' '}
              <Text style={styles.link}>Terms of Use</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}> Sign In</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: '#fff'},
  container: {padding: 20, paddingBottom: 60, flexGrow: 1},
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E0063',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  icon: {marginRight: 8},
  button: {
    backgroundColor: '#506ad9',
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  policy: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
    marginVertical: 10,
  },
  link: {
    color: '#CE2732',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  footerText: {
    fontSize: 15,
    color: '#506ad9',
  },
});

export default SignUp;
