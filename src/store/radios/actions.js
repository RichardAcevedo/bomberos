import radiosApi from '../../commons/api/radios';
import * as types from '../../commons/mutationTypes';
import radioModel from '../../commons/models/radio';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const radios = await radiosApi.get();
    const { data } = radios;
    const result = data.reduce((m, item) => {
      m.push(radioModel.getViewFormatSimple(item));
      return m;
    }, []);
    commit(types.SET_AWARDS_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const radio = await radiosApi.getForId(payload);
    const { data } = radio;
    const result = radioModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => radiosApi.store(payload);

const update = async (params, payload) => {
  try {
    const radio = await radiosApi.update(payload);
    return radio;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await radiosApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await radiosApi.report();
    downloadExcel(file.data, payload);
  } catch (e) {
    // console.log(e);
  }
};

export default {
  get,
  getForId,
  store,
  update,
  remove,
  report,
};
