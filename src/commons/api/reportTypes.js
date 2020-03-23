import axios from 'axios';
import { API_URL } from '../constants';

const reportTypes = {
  get: () => axios.get(`${API_URL}/tipo-informante`),
};

export default reportTypes;
