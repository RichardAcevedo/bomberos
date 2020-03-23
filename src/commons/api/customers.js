import axios from 'axios';
import { API_URL } from '../constants';

const customers = {
  get: () => axios.get(`${API_URL}/cliente`),
  getForId: id => axios.get(`${API_URL}/cliente/${id}`),
  store: customer => axios.post(
    `${API_URL}/cliente/new`,
    customer,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/cliente/${id}`),
  update: customer => axios.patch(
    `${API_URL}/cliente/${customer.id}`,
    customer,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/cliente/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default customers;
