import axios from 'axios';
import { API_URL } from '../constants';

const elements = {
  get: () => axios.get(`${API_URL}/elemento`),
  getElementsWithoutVehicle: () => axios.get(`${API_URL}/elemento/sin-vehiculo`),
  getForId: id => axios.get(`${API_URL}/elemento/${id}`),
  store: element => axios.post(
    `${API_URL}/elemento/new`,
    element,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/elemento/${id}`),
  update: element => axios.patch(
    `${API_URL}/elemento/${element.id}`,
    element,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/elemento/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default elements;
