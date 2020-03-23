import authApi from '../../commons/api/auth';

const login = (params, payload) => authApi.login(payload);
const loginFingerPrint = (params, payload) => authApi.loginFingerPrint(payload);

export default {
  login,
  loginFingerPrint,
};
