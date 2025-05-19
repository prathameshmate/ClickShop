import React, {useState} from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  BackHandler,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import getDataFromAPI from '../../Networks/Network';
import {CONS} from '../../Constant/Constant';
import {useDispatch} from 'react-redux';
import {add_Product} from '../../Redux/actions';

const Login = () => {
  const [securety, updateSecurety] = useState(true);
  const [data, updateData] = useState({
    number: '',
    password: '',
  });
  const navigation = useNavigation();
  const dispatch = useDispatch();

  //BackHandler in Android
  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
    }, [navigation]),
  );

  const handleBackButtonClick = () => {
    Alert.alert('', 'Are you want to exit App?', [
      {
        text: 'NO',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          BackHandler.exitApp();
        },
      },
    ]);
    return true;
  };

  const navigateToDestinationScreen = () => {
    navigation.navigate('Create/UpdateAccount');
  };

  const updateDetails = (field: any, type: any) => {
    updateData(preValue => {
      return {
        ...preValue,
        [field]: type,
      };
    });
  };
  const show = async () => {
    try {
      // API call
      const response = await getDataFromAPI('login', {
        number: +data?.number,
        password: data?.password,
      });

      if (response?.data?.success) {
        // used to store login user basic data
        await AsyncStorage.setItem(
          'LoginUserData',
          JSON.stringify(response?.data?.data),
        );
        Alert.alert('', response?.data?.message);

        // used to store all products in the redux store
        dispatch(add_Product(response?.data?.data?.Products?.categorys || []));

        // reset is used to delete navigtion history of current navigator and avoid going back in previous screen
        navigation.reset({
          index: 0,
          routes: [{name: 'DashBoardStack'}],
        });
      } else {
        Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // AsyncStorage.clear()
  return (
    <>
      <View style={styles.main}>
        <View style={styles.flip_View}>
          <Image
            source={require('../../../Public/Logos/logo.jpg')}
            style={styles.flip_Img}
          />
        </View>
        <View style={{flex: 2, padding: 10}}>
          <View style={styles.userName_View}>
            <Icon name="user" color="gray" size={35} style={styles.icon} />
            <TextInput
              placeholder="Mobile number +91 "
              value={data.number}
              keyboardType="numeric"
              maxLength={10}
              style={styles.txt_Input}
              onChangeText={type => {
                updateDetails('number', type);
              }}
            />
          </View>
          <View style={styles.userName_View}>
            <Icon1
              name="enhanced-encryption"
              color="gray"
              size={35}
              style={styles.icon}
            />
            <TextInput
              placeholder="Password  "
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
                size={35}
                style={styles.icon}
                onPress={() => {
                  updateSecurety(!securety);
                }}
              />
            ) : (
              <Icon2
                name="eye-with-line"
                color="gray"
                size={35}
                style={styles.icon}
                onPress={() => {
                  updateSecurety(!securety);
                }}
              />
            )}
          </View>
          <View style={styles.btnView}>
            {/* <Button title='Sing IN' /> */}
            <TouchableOpacity style={styles.signBtn} onPress={show}>
              <Text style={styles.singTxt}>Sign In</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.forgot_View}>
            <TouchableOpacity
              style={styles.forgot}
              onPress={() => {
                Alert.alert('', 'coming soon');
              }}>
              <Text style={styles.forgot_Txt}>Forgot Password ?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.createAcc}>
            <Text style={styles.acc_Txt}>Don't havean account ?</Text>
            <TouchableOpacity
              onPress={() => {
                navigateToDestinationScreen();
              }}>
              <Text style={styles.createAccTxt}> Create One </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // borderWidth: 3,
  },
  flip_Img: {
    width: '50%',
    height: 100,
  },
  flip_View: {
    // borderWidth: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  userName_View: {
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    // borderColor: "green",
    margin: 10,
    // padding  :5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
  },
  txt_Input: {
    flex: 1,
    // width: "80%",
    borderLeftWidth: 0.5,
    borderColor: 'gray',
    padding: 10,
    fontSize: 17,
    fontWeight: 'bold',
  },
  icon: {
    padding: 5,
  },
  forgot_View: {
    // borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgot: {
    // borderWidth: 4,
    // margin: 5,
    marginTop: 10,
    // flex : 1,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgot_Txt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E0063',
  },
  createAcc: {
    // borderWidth: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  acc_Txt: {
    fontSize: 18,
    fontWeight: '500',
    color: '#415BE3',
  },
  createAccTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E0063',
  },
  btnView: {
    // borderWidth  :5,
    paddingTop: 20,
    paddingBottom: 20,
  },
  signBtn: {
    backgroundColor: '#506ad9',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 5,
  },
  singTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
export default Login;
