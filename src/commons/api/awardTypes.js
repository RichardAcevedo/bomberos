import axios from 'axios';
import { API_URL } from '../constants';

const awardTypes = {
  get: () => axios.get(`${API_URL}/tipo-condecoracion`),
  getForId: id => axios.get(`${API_URL}/tipo-condecoracion/${id}`),
  store: awardType => axios.post(
    `${API_URL}/tipo-condecoracion/new`,
    awardType,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/tipo-condecoracion/${id}`),
  update: awardType => axios.patch(
    `${API_URL}/tipo-condecoracion/${awardType.id}`,
    awardType,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/tipo-condecoracion/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default awardTypes;
