import axios from 'axios';
import { API_URL } from '../constants';

const employees = {
  get: () => axios.get(`${API_URL}/empleado`),
  getCurriculums: () => axios.get(`${API_URL}/empleado/hojas-de-vida`),
  getCurriculumPersonal: id => axios.get(`${API_URL}/empleado/hoja-de-vida/${id}`),
  getEmployeeWithoutAppointment: () => axios.get(`${API_URL}/empleado/sin-nombramiento`),
  getForId: id => axios.get(`${API_URL}/empleado/${id}`),
  store: employee => axios.post(
    `${API_URL}/empleado/new`,
    employee,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  remove: id => axios.delete(`${API_URL}/empleado/${id}`),
  update: employee => axios.patch(
    `${API_URL}/empleado/${employee.id}`,
    employee,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ),
  getInspectors: () => axios.get(`${API_URL}/empleado/inspectores`),
  cancelFingerPrint: () => axios.get(`${API_URL}/empleado/acceso-huella-cancelar`),
  withFingerPrint: id => axios.get(`${API_URL}/empleado/con-huella/${id}`),
  report: () => axios.get(
    `${API_URL}/empleado/excel/reporte`,
    { responseType: 'blob' },
  ),
};

export default employees;
