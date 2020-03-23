import axios from 'axios';
import { API_URL } from '../constants';

const promotions = {
  get: () => axios.get(`${API_URL}/empleado-ascenso`),
  getForId: id => axios.get(`${API_URL}/empleado-ascenso/${id}`),
  store: (promotion, withFile) => axios.post(
    `${API_URL}/empleado-ascenso/new`,
    promotion,
    {
      headers: withFile ? {
        'Content-Type': 'multipart/form-data',
      } : {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/empleado-ascenso/${id}`),
  update: promotion => axios.patch(
    `${API_URL}/empleado-ascenso/${promotion.id}`,
    promotion,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  updateWithFile: promotion => axios.post(
    `${API_URL}/empleado-ascenso/${promotion.get('id')}`,
    promotion,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/empleado-ascenso/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default promotions;
