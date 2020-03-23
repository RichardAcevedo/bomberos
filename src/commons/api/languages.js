import axios from 'axios';
import { API_URL } from '../constants';

const languages = {
  get: () => axios.get(`${API_URL}/idioma`),
};

export default languages;
