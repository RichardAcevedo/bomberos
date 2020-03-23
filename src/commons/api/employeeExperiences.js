import axios from 'axios';
import { API_URL } from '../constants';

const employeeExperiences = {
  get: () => axios.get(`${API_URL}/empleado-experiencia`),
  getForEmployee: id => axios.get(`${API_URL}/empleado-experiencia/empleado/${id}`),
  getForId: id => axios.get(`${API_URL}/empleado-experiencia/${id}`),
  store: experience => axios.post(
    `${API_URL}/empleado-experiencia/new`,
    experience,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  update: experience => axios.patch(
    `${API_URL}/empleado-experiencia/${experience.id}`,
    experience,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/empleado-experiencia/${id}`),
  report: () => axios.get(
    `${API_URL}/empleado-experiencia/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default employeeExperiences;
