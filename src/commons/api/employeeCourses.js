import axios from 'axios';
import { API_URL } from '../constants';

const employeeCourses = {
  get: () => axios.get(`${API_URL}/empleado-curso-bomberil`),
  getForEmployee: id => axios.get(`${API_URL}/empleado-curso-bomberil/empleado/${id}`),
  getForId: id => axios.get(`${API_URL}/empleado-curso-bomberil/${id}`),
  store: course => axios.post(
    `${API_URL}/empleado-curso-bomberil/new`,
    course,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  update: course => axios.patch(
    `${API_URL}/empleado-curso-bomberil/${course.id}`,
    course,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/empleado-curso-bomberil/${id}`),
  report: () => axios.get(
    `${API_URL}/empleado-curso-bomberil/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default employeeCourses;
