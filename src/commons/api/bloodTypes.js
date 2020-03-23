import axios from 'axios';
import { API_URL } from '../constants';

const bloodTypes = {
  get: () => axios.get(`${API_URL}/tipo-sangre`),
};

export default bloodTypes;
