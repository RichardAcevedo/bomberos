import axios from 'axios';
import { API_URL } from '../constants';

const cities = {
  get: () => axios.get(`${API_URL}/ciudad`),
};

export default cities;
