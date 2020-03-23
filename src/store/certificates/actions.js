import certificatesApi from '../../commons/api/certificates';
import * as types from '../../commons/mutationTypes';
import certificateModel from '../../commons/models/certificate';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const certificates = await certificatesApi.get();
    const { data } = certificates;
    const result = data.reduce((m, item) => {
      m.push(certificateModel.getViewFormatSimple(item));
      return m;
    }, []);
    commit(types.SET_CERTIFICATES_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const certificate = await certificatesApi.getForId(payload);
    const { data } = certificate;
    const result = certificateModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => certificatesApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await certificatesApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const certificate = await certificatesApi.update(payload);
    return certificate;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await certificatesApi.report();
    downloadExcel(file.data, payload);
  } catch (e) {
    // console.log(e);
  }
};

export default {
  get,
  getForId,
  store,
  remove,
  update,
  report,
};
