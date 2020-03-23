import axios from 'axios';
import { API_URL } from '../constants';

const awards = {
  get: () => axios.get(`${API_URL}/empleado-condecoracion`),
  getForId: id => axios.get(`${API_URL}/empleado-condecoracion/${id}`),
  store: award => axios.post(
    `${API_URL}/empleado-condecoracion/new`,
    award,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/empleado-condecoracion/${id}`),
  update: award => axios.patch(
    `${API_URL}/empleado-condecoracion/${award.id}`,
    award,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/empleado-condecoracion/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default awards;
