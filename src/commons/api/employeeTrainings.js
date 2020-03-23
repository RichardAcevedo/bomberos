import axios from 'axios';
import { API_URL } from '../constants';

const employeeTrainings = {
  get: () => axios.get(`${API_URL}/empleado-capacitacion`),
  getForEmployee: id => axios.get(`${API_URL}/empleado-capacitacion/empleado/${id}`),
  getForId: id => axios.get(`${API_URL}/empleado-capacitacion/${id}`),
  store: (tranining, withFile) => axios.post(
    `${API_URL}/empleado-capacitacion/new`,
    tranining,
    {
      headers: withFile ? {
        'Content-Type': 'multipart/form-data',
      } : {
        'Content-Type': 'application/json',
      },
    },
  ),
  update: tranining => axios.patch(
    `${API_URL}/empleado-capacitacion/${tranining.id}`,
    tranining,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  updateWithFile: tranining => axios.post(
    `${API_URL}/empleado-capacitacion/${tranining.get('id')}`,
    tranining,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/empleado-capacitacion/${id}`),
  report: () => axios.get(
    `${API_URL}/empleado-capacitacion/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default employeeTrainings;
