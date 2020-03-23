import axios from 'axios';
import { API_URL } from '../constants';

const employeeEducations = {
  get: () => axios.get(`${API_URL}/empleado-educacion`),
  getForEmployee: id => axios.get(`${API_URL}/empleado-educacion/empleado/${id}`),
  getForId: id => axios.get(`${API_URL}/empleado-educacion/${id}`),
  store: education => axios.post(
    `${API_URL}/empleado-educacion/new`,
    education,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  update: education => axios.patch(
    `${API_URL}/empleado-educacion/${education.id}`,
    education,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/empleado-educacion/${id}`),
  report: () => axios.get(
    `${API_URL}/empleado-educacion/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default employeeEducations;
