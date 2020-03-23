import axios from 'axios';
import { API_URL } from '../constants';

const vehicles = {
  get: () => axios.get(`${API_URL}/vehiculo`),
  getForId: id => axios.get(`${API_URL}/vehiculo/${id}`),
  store: vehicle => axios.post(
    `${API_URL}/vehiculo/new`,
    vehicle,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/vehiculo/${id}`),
  update: vehicle => axios.patch(
    `${API_URL}/vehiculo/${vehicle.id}`,
    vehicle,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/vehiculo/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default vehicles;
