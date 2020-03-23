import axios from 'axios';
import { API_URL } from '../constants';

const rankCategories = {
  get: () => axios.get(`${API_URL}/categoria-rango`),
  getForId: id => axios.get(`${API_URL}/categoria-rango/${id}`),
  store: rankCategory => axios.post(
    `${API_URL}/categoria-rango/new`,
    rankCategory,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/categoria-rango/${id}`),
  update: rankCategory => axios.patch(
    `${API_URL}/categoria-rango/${rankCategory.id}`,
    rankCategory,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/categoria-rango/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default rankCategories;
