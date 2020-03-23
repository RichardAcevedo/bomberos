import axios from 'axios';
import { API_URL } from '../constants';

const radios = {
  get: () => axios.get(`${API_URL}/radio`),
  getForId: id => axios.get(`${API_URL}/radio/${id}`),
  store: radio => axios.post(
    `${API_URL}/radio/new`,
    radio,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/radio/${id}`),
  update: radio => axios.patch(
    `${API_URL}/radio/${radio.id}`,
    radio,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/radio/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default radios;
