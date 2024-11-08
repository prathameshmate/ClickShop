import axios from 'axios';
import {CONS} from '../Constant/Constant';
const getDataFromAPI = async (endPoint = '', request = {}) => {
  console.log('request in network :>> ', request);
  try {
    const response = await axios.post(`${CONS?.baseURL}${endPoint}`, request, {
      validateStatus: function (status) {
        // Allow all status codes (or set specific conditions)
        return status < 500; // Treat any status less than 500 as a success
      },
    });
    console.log('response in network :>> ', response);
    return response;
  } catch (err) {
    console.log('Error while calling API :>> ', err);
  }
};

export default getDataFromAPI;
