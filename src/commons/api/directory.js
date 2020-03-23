import axios from 'axios';
import { API_URL } from '../constants';

const directory = {
  get: () => axios.get(`${API_URL}/directorio`),
  getForId: id => axios.get(`${API_URL}/directorio/${id}`),
  store: number => axios.post(
    `${API_URL}/directorio/new`,
    number,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/directorio/${id}`),
  update: number => axios.patch(
    `${API_URL}/directorio/${number.id}`,
    number,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/directorio/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default directory;
