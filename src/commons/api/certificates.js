import axios from 'axios';
import { API_URL } from '../constants';

const certificates = {
  get: () => axios.get(`${API_URL}/certificado`),
  getForId: id => axios.get(`${API_URL}/certificado/${id}`),
  store: certificate => axios.post(
    `${API_URL}/certificado/new`,
    certificate,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/certificado/${id}`),
  update: certificate => axios.patch(
    `${API_URL}/certificado/${certificate.id}`,
    certificate,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/certificado/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default certificates;
