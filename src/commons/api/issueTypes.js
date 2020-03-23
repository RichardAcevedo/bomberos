import axios from 'axios';
import { API_URL } from '../constants';

const issueTypes = {
  get: () => axios.get(`${API_URL}/asunto`),
  getForId: id => axios.get(`${API_URL}/asunto/${id}`),
  store: issueType => axios.post(
    `${API_URL}/asunto/new`,
    issueType,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/asunto/${id}`),
  update: issueType => axios.patch(
    `${API_URL}/asunto/${issueType.id}`,
    issueType,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  report: () => axios.get(
    `${API_URL}/asunto/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default issueTypes;
