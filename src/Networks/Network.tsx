import axios from 'axios';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {CONS} from '../Constant/Constant';

const eventEmitter = new NativeEventEmitter(
  NativeModules.ReactNativeEventEmitter,
);

const getDataFromAPI = async (endPoint = '', request = {}) => {
  if (endPoint !== 'launchDetails') {
    eventEmitter.emit('showLoader', true);
  }
  console.log('request in network :>> ', request);
  try {
    const response = await axios.post(`${CONS?.baseURL}${endPoint}`, request, {
      validateStatus: function (status) {
        // Allow all status codes (or set specific conditions)
        return status < 500; // Treat any status less than 500 as a success
      },
      timeout: 60000, // in milliseconds (60 sec)
    });
    console.log('response in network :>> ', response);
    eventEmitter.emit('showLoader', false);
    return response;
  } catch (err) {
    eventEmitter.emit('showLoader', false);
    console.log('Error while calling API :>> ', err);
  }
};

export default getDataFromAPI;
