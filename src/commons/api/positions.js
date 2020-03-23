import axios from 'axios';
import { API_URL } from '../constants';

const positions = {
  get: () => axios.get(`${API_URL}/cargo`),
  getForId: id => axios.get(`${API_URL}/cargo/${id}`),
  getPositionsAvailable: id => axios.get(`${API_URL}/cargo/disponibles/${id}`),
  store: position => axios.post(
    `${API_URL}/cargo/new`,
    position,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/cargo/${id}`),
  update: position => axios.patch(
    `${API_URL}/cargo/${position.id}`,
    position,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/cargo/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default positions;
