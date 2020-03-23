import axios from 'axios';
import { API_URL } from '../constants';

const vehicleTypes = {
  get: () => axios.get(`${API_URL}/tipo-vehiculo`),
  getForId: id => axios.get(`${API_URL}/tipo-vehiculo/${id}`),
  store: awardType => axios.post(
    `${API_URL}/tipo-vehiculo/new`,
    awardType,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/tipo-vehiculo/${id}`),
  update: awardType => axios.patch(
    `${API_URL}/tipo-vehiculo/${awardType.id}`,
    awardType,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/tipo-vehiculo/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default vehicleTypes;
