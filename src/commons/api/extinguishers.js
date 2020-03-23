import axios from 'axios';
import { API_URL } from '../constants';

const extinguishers = {
  get: () => axios.get(`${API_URL}/extintor-cliente`),
  getForId: id => axios.get(`${API_URL}/extintor-cliente/${id}`),
  store: extinguisher => axios.post(
    `${API_URL}/extintor-cliente/new`,
    extinguisher,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/extintor-cliente/${id}`),
  update: extinguisher => axios.patch(
    `${API_URL}/extintor-cliente/${extinguisher.id}`,
    extinguisher,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/extintor-cliente/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default extinguishers;
