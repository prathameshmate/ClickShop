import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import getDataFromAPI from '../../Networks/Network';

const SignUp = (props: any) => {
  const [securety, updateSecurety] = useState(true);
  const [data, updateData] = useState({
    fullname: '',
    username: '',
    number: '',
    email: '',
    password: '',
  });

  const [fullnameVal, updateFullnameVal] = useState(true);
  const [usernameVal, updateUsernameVal] = useState(true);
  const [numVal, updateNumval] = useState(true);
  const [emailVal, updateEmailVal] = useState(true);
  const [passVal, updatePassVal] = useState(true);

  const navigation = useNavigation();

  const navigateToDestinationScreen = () => {
    navigation.navigate('Login');
  };

  const updateDetails = (field: any, type: any) => {
    updateData(preValue => {
      return {
        ...preValue,
        [field]: type,
      };
    });
  };

  const validation = () => {
    const regx1 = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
    updateFullnameVal(regx1.test(data.fullname));

    const regx2 = /^[A-Za-z][A-Za-z0-9_]{7,29}$/;
    updateUsernameVal(regx2.test(data.username));

    const regx3 = /^([+]\d{2})?\d{10}$/;
    updateNumval(regx3.test(data.number));

    const regx4 = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    updateEmailVal(regx4.test(data.email));

    const regx5 =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    updatePassVal(regx5.test(data.password));
  };

  const updateProfileData = async () => {
    try {
      const {number} = props.route.params;

      const arrJson = await AsyncStorage.getItem('registrationData');

      if (arrJson !== null) {
        const arrObj = JSON.parse(arrJson);
        console.log('==============arrObj before======================');
        console.log(arrObj);
        console.log('====================================');
        var tempObj = {};

        for (let i = 0; i < arrObj.length; i++) {
          if (arrObj[i].number === number) {
            arrObj[i] = data;
            tempObj = arrObj[i];

            await AsyncStorage.setItem(
              'registrationData',
              JSON.stringify(arrObj),
            );
            Alert.alert('', 'Profile data updated successfully!');

            break;
          }
        }
        navigation.navigate('Profile', tempObj);
      } else {
        console.warn('Profile data not found');
      }
    } catch (error) {
      console.log('Error updating profile data: ', error);
    }
  };
  useEffect(() => {
    validation();
  }, [data]);

  console.log('===================data=================');
  console.log(data);
  console.log('====================================');

  useEffect(() => {
    if (
      data.fullname === '' &&
      data.username === '' &&
      (data.number === '', data.email === '') &&
      data.password === ''
    ) {
      updateFullnameVal(true);
      updateUsernameVal(true);
      updateNumval(true);
      updateEmailVal(true);
      updatePassVal(true);
    }
  }, []);

  useEffect(() => {
    // update data  state when we navigate from profile screen to register sreen along with data

    if (props.route.params !== undefined) {
      const {fullname, username, number, email, password} = props.route.params;
      const profileData = {
        fullname: fullname,
        username: username,
        number: number?.toString(),
        email: email,
        password: password,
      };
      updateData(profileData);
    }
    console.log('===================props.route.params1=================');
    console.log(props.route.params);
    console.log('===========================');
  }, [props.route.params]);

  const store = async () => {
    validation();
    if (
      data.fullname === '' &&
      data.username === '' &&
      (data.number === '', data.email === '') &&
      data.password === ''
    ) {
      Alert.alert('', 'Please fill all details properly!');
    } else if (fullnameVal && usernameVal && numVal && emailVal && passVal) {
      try {
        //API call
        const response = await getDataFromAPI('register', data);

        if (response?.data?.success) {
          Alert.alert('', response?.data?.message);
          // empty all cells
          updateData(() => {
            return {
              fullname: '',
              username: '',
              number: '',
              email: '',
              password: '',
            };
          });
          navigation.navigate('Login');
        } else {
          Alert.alert('', response?.data?.errorMessage);
        }
      } catch (error) {
        Alert.alert('', 'Error while saving form data' + error);
      }
    } else {
      Alert.alert('', 'Please fill all details properly! ');
    }
  };

  return (
    <>
      <ScrollView style={{flex: 1}}>
        <View style={styles.main}>
          <View style={styles.createView}>
            {props.route.params === undefined ? (
              <Text style={styles.createTxt}> Create Account</Text>
            ) : (
              <Text style={styles.createTxt}> Update Account</Text>
            )}
          </View>
          <View style={{padding: 10}}>
            <View
              style={[
                styles.userName_View,
                {borderColor: fullnameVal ? 'gray' : 'red'},
              ]}>
              <Icon
                name="user-plus"
                color="gray"
                size={30}
                style={styles.icon}
              />
              <TextInput
                placeholder="Enter Your Full Name "
                value={data.fullname}
                style={styles.txt_Input}
                onChangeText={type => {
                  updateDetails('fullname', type);
                }}
              />
            </View>
            {fullnameVal ? null : (
              <View style={styles.invalid}>
                <Text style={styles.invalidTxt}>
                  Please enter full name Properly
                </Text>
              </View>
            )}
            <View
              style={[
                styles.userName_View,
                {borderColor: usernameVal ? 'gray' : 'red'},
              ]}>
              <Icon name="user" color="gray" size={30} style={styles.icon} />
              <TextInput
                placeholder="Enter Username "
                value={data.username}
                style={styles.txt_Input}
                onChangeText={type => {
                  updateDetails('username', type);
                }}
              />
            </View>
            {usernameVal ? null : (
              <View style={styles.invalid}>
                <Text style={styles.invalidTxt}>Invalid Username</Text>
              </View>
            )}
            <View
              style={[
                styles.userName_View,
                {borderColor: numVal ? 'gray' : 'red'},
              ]}>
              <Icon1
                name="local-phone"
                color="gray"
                size={30}
                style={styles.icon}
              />
              <TextInput
                placeholder="Mobile number +91"
                value={data.number}
                style={styles.txt_Input}
                keyboardType="numeric"
                maxLength={10}
                onChangeText={type => updateDetails('number', type)}
              />
            </View>
            {numVal ? null : (
              <View style={styles.invalid}>
                <Text style={styles.invalidTxt}>Invalid Mobile Number</Text>
              </View>
            )}
            <View
              style={[
                styles.userName_View,
                {borderColor: emailVal ? 'gray' : 'red'},
              ]}>
              <Icon1 name="email" color="gray" size={30} style={styles.icon} />
              <TextInput
                placeholder="Email "
                value={data.email}
                style={styles.txt_Input}
                keyboardType="email-address"
                onChangeText={type => {
                  updateDetails('email', type);
                }}
              />
            </View>
            {emailVal ? null : (
              <View style={styles.invalid}>
                <Text style={styles.invalidTxt}>Invalid Email</Text>
              </View>
            )}
            <View
              style={[
                styles.userName_View,
                {borderColor: passVal ? 'gray' : 'red'},
              ]}>
              <Icon1
                name="enhanced-encryption"
                color="gray"
                size={30}
                style={styles.icon}
              />
              <TextInput
                placeholder="Password : min 8 charcters "
                value={data.password}
                style={styles.txt_Input}
                secureTextEntry={securety}
                onChangeText={type => {
                  updateDetails('password', type);
                }}
              />
              {securety ? (
                <Icon2
                  name="eye"
                  color="gray"
                  size={30}
                  style={styles.icon}
                  onPress={() => {
                    updateSecurety(!securety);
                  }}
                />
              ) : (
                <Icon2
                  name="eye-with-line"
                  color="gray"
                  size={30}
                  style={styles.icon}
                  onPress={() => {
                    updateSecurety(!securety);
                  }}
                />
              )}
            </View>
            {passVal ? null : (
              <View style={styles.invalid}>
                <Text style={styles.invalidTxt}>Invalid Password</Text>
              </View>
            )}
            <View>
              <Text
                style={{fontSize: 14, fontWeight: 'bold', color: '#1E0063'}}>
                Password should be min 8 characters, at least one uppercase
                letter, one lowercase letter, one number and one special
                character:
              </Text>
            </View>

            {props.route.params === undefined ? (
              <View style={styles.btnView}>
                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={() => {
                    store();
                  }}>
                  <Text style={styles.registerTxt}>Register</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.btnView}>
                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={() => {
                    updateProfileData();
                  }}>
                  <Text style={styles.registerTxt}>Update</Text>
                </TouchableOpacity>
              </View>
            )}

            {props.route.params === undefined ? (
              <View>
                <View style={styles.policy_View}>
                  <Text style={styles.policy_Txt}>
                    By registering you confirm that you accept our
                    <Text style={{color: '#CE2732'}}>
                      {' '}
                      Terms of Use{' '}
                    </Text> and{' '}
                    <Text style={{color: '#CE2732'}}>Privacy Policy.</Text>
                  </Text>
                </View>
                <View style={styles.createAcc}>
                  <Text style={styles.acc_Txt}>Have an Account ?</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigateToDestinationScreen();
                    }}>
                    <Text style={styles.createAccTxt}> Sign In </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // borderWidth: 3,
  },
  createView: {
    // borderWidth: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  createTxt: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#1E0063',
  },
  userName_View: {
    borderWidth: 3,
    borderColor: 'gray',
    borderRadius: 5,
    // borderColor: "green",
    margin: 10,
    marginBottom: 5,
    // padding  :5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 45,
  },
  txt_Input: {
    flex: 1,
    // width: "80%",
    borderLeftWidth: 1,
    borderColor: 'gray',
    padding: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  icon: {
    // borderWidth: 2,
    width: 40,
    // paddingTop: 5,
    // paddingLeft: 7,
    padding: 5,
  },
  policy_View: {
    // borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  policy_Txt: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#506ad9',
  },
  createAcc: {
    // borderWidth: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  acc_Txt: {
    fontSize: 18,
    fontWeight: '500',
    color: '#506ad9',
  },
  createAccTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E0063',
  },
  btnView: {
    // borderWidth: 5,
    paddingTop: 20,
    paddingBottom: 20,
  },
  registerBtn: {
    backgroundColor: '#506ad9',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 5,
  },
  registerTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  invalid: {
    // borderWidth :2,
    paddingLeft: 10,
  },
  invalidTxt: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
export default SignUp;
