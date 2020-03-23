import axios from 'axios';
import { API_URL } from '../constants';

const appointments = {
  get: () => axios.get(`${API_URL}/empleado-nombramiento`),
  getForId: id => axios.get(`${API_URL}/empleado-nombramiento/${id}`),
  store: appointment => axios.post(
    `${API_URL}/empleado-nombramiento/new`,
    appointment,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/empleado-nombramiento/${id}`),
  update: appointment => axios.patch(
    `${API_URL}/empleado-nombramiento/${appointment.id}`,
    appointment,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/empleado-nombramiento/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default appointments;
