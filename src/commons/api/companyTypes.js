import axios from 'axios';
import { API_URL } from '../constants';

const companyTypes = {
  get: () => axios.get(`${API_URL}/tipo-empresa`),
  getForId: id => axios.get(`${API_URL}/tipo-empresa/${id}`),
  store: companyType => axios.post(
    `${API_URL}/tipo-empresa/new`,
    companyType,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/tipo-empresa/${id}`),
  update: companyType => axios.patch(
    `${API_URL}/tipo-empresa/${companyType.id}`,
    companyType,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/tipo-empresa/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default companyTypes;
