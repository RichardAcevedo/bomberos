import axios from 'axios';
import { API_URL } from '../constants';

const events = {
  get: () => axios.get(`${API_URL}/evento`),
};

export default events;
