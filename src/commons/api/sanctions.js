import axios from 'axios';
import { API_URL } from '../constants';

const sanctions = {
  get: () => axios.get(`${API_URL}/empleado-sancion`),
  getForId: id => axios.get(`${API_URL}/empleado-sancion/${id}`),
  store: sanction => axios.post(
    `${API_URL}/empleado-sancion/new`,
    sanction,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/empleado-sancion/${id}`),
  update: sanction => axios.patch(
    `${API_URL}/empleado-sancion/${sanction.id}`,
    sanction,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/empleado-sancion/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default sanctions;
