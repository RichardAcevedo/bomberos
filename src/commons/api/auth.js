import axios from 'axios';
import { API_URL } from '../constants';

const auth = {
  login: data => axios.post(
    `${API_URL}/login`,
    data,
  ),
  loginFingerPrint: data => axios.post(
    `${API_URL}/login-huella`,
    data,
  ),
};

export default auth;
