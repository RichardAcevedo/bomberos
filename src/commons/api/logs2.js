import axios from 'axios';
import { API_URL } from '../constants';

const logs = {
  get: () => axios.get(`${API_URL}/emergency`),
  report: () => axios.get(
    `${API_URL}/emergency/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default logs;
