import axios from 'axios';
import { API_URL } from '../constants';

const professions = {
  get: () => axios.get(`${API_URL}/profesion`),
};

export default professions;
