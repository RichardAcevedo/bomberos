import axios from 'axios';
import { API_URL } from '../constants';

const emergencyNumbers = {
  get: () => axios.get(`${API_URL}/emergencia`),
  getForId: id => axios.get(`${API_URL}/emergencia/${id}`),
  store: emergencyNumber => axios.post(
    `${API_URL}/emergencia/new`,
    emergencyNumber,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/emergencia/${id}`),
  update: emergencyNumber => axios.patch(
    `${API_URL}/emergencia/${emergencyNumber.id}`,
    emergencyNumber,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/emergencia/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default emergencyNumbers;
