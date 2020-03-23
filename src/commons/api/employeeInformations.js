import axios from 'axios';
import { API_URL } from '../constants';

const employeeInformations = {
  get: () => axios.get(`${API_URL}/empleado-informacion-bomberil`),
  getForEmployee: id => axios.get(`${API_URL}/empleado-informacion-bomberil/empleado/${id}`),
  getForId: id => axios.get(`${API_URL}/empleado-informacion-bomberil/${id}`),
  store: (information, withFile) => axios.post(
    `${API_URL}/empleado-informacion-bomberil/new`,
    information,
    {
      headers: withFile ? {
        'Content-Type': 'multipart/form-data',
      } : {
        'Content-Type': 'application/json',
      },
    },
  ),
  update: information => axios.patch(
    `${API_URL}/empleado-informacion-bomberil/${information.id}`,
    information,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  updateWithFile: information => axios.post(
    `${API_URL}/empleado-informacion-bomberil/${information.get('id')}`,
    information,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/empleado-informacion-bomberil/${id}`),
  report: () => axios.get(
    `${API_URL}/empleado-informacion-bomberil/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default employeeInformations;
