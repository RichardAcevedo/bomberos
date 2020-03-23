import axios from 'axios';
import { API_URL } from '../constants';

const ranks = {
  get: () => axios.get(`${API_URL}/rango`),
  getForId: id => axios.get(`${API_URL}/rango/${id}`),
  store: rank => axios.post(
    `${API_URL}/rango/new`,
    rank,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/rango/${id}`),
  update: rank => axios.patch(
    `${API_URL}/rango/${rank.id}`,
    rank,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/rango/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default ranks;
