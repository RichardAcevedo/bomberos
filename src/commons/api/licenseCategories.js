import axios from 'axios';
import { API_URL } from '../constants';

const licenseCategories = {
  get: () => axios.get(`${API_URL}/categoria-licencia`),
};

export default licenseCategories;
