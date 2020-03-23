import axios from 'axios';
import { API_URL } from '../constants';

const emergencys = {
  get: () => axios.get(`${API_URL}/emergency`),
};

export default emergencys;
