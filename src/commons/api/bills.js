import axios from 'axios';
import { API_URL } from '../constants';

const bills = {
  get: () => axios.get(`${API_URL}/bitacora`),
  getForId: id => axios.get(`${API_URL}/bitacora/${id}`),
  store: bill => axios.post(
    `${API_URL}/bitacora/new`,
    bill,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  getReport: data => axios.post(
    `${API_URL}/bitacora/reporte`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/bitacora/${id}`),
  update: bill => axios.patch(
    `${API_URL}/bitacora/${bill.id}`,
    bill,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/bitacora/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default bills;
