import axios from 'axios';
import { API_URL } from '../constants';

const extinguisherTypes = {
  get: () => axios.get(`${API_URL}/tipo-extintor`),
  getForId: id => axios.get(`${API_URL}/tipo-extintor/${id}`),
  store: extinguisherType => axios.post(
    `${API_URL}/tipo-extintor/new`,
    extinguisherType,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/tipo-extintor/${id}`),
  update: extinguisherType => axios.patch(
    `${API_URL}/tipo-extintor/${extinguisherType.id}`,
    extinguisherType,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/tipo-extintor/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default extinguisherTypes;
