import axios from 'axios';
import { API_URL } from '../constants';

const companies = {
  get: () => axios.get(`${API_URL}/empresa`),
  getForId: id => axios.get(`${API_URL}/empresa/${id}`),
  store: company => axios.post(
    `${API_URL}/empresa/new`,
    company,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/empresa/${id}`),
  update: company => axios.patch(
    `${API_URL}/empresa/${company.id}`,
    company,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/empresa/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default companies;
