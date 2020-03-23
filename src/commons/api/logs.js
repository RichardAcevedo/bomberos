import axios from 'axios';
import { API_URL } from '../constants';

const logs = {
  get: () => axios.get(`${API_URL}/log`),
  report: () => axios.get(
    `${API_URL}/log/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default logs;
