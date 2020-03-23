import axios from 'axios';
import { API_URL } from '../constants';

const userTypes = {
  get: () => axios.get(`${API_URL}/tipo-usuario`),
};

export default userTypes;
