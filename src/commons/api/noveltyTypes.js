import axios from 'axios';
import { API_URL } from '../constants';

const noveltyTypes = {
  get: () => axios.get(`${API_URL}/novedad-vehiculo`),
};

export default noveltyTypes;
