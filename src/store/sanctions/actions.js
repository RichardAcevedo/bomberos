import sanctionsApi from '../../commons/api/sanctions';
import * as types from '../../commons/mutationTypes';
import sanctionModel from '../../commons/models/sanction';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const sanctions = await sanctionsApi.get();
    const { data } = sanctions;
    const result = data.reduce((m, item) => {
      m.push(sanctionModel.getViewFormatSimple(item));
      return m;
    }, []);
    commit(types.SET_SANCTIONS_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const sanction = await sanctionsApi.getForId(payload);
    const { data } = sanction;
    const result = sanctionModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => sanctionsApi.store(payload);

const update = async (params, payload) => {
  try {
    const sanction = await sanctionsApi.update(payload);
    return sanction;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await sanctionsApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await sanctionsApi.report();
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
