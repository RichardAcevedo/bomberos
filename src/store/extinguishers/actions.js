import extinguishersApi from '../../commons/api/extinguishers';
import * as types from '../../commons/mutationTypes';
import extinguisherModel from '../../commons/models/extinguisher';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const extinguishers = await extinguishersApi.get();
    const { data } = extinguishers;
    const result = data.reduce((m, item) => {
      m.push(extinguisherModel.getViewFormatSimple(item));
      return m;
    }, []);
    commit(types.SET_EXTINGUISHERS_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const extinguisher = await extinguishersApi.getForId(payload);
    const { data } = extinguisher;
    const result = extinguisherModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => extinguishersApi.store(payload);

const update = async (params, payload) => {
  try {
    const extinguisher = await extinguishersApi.update(payload);
    return extinguisher;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await extinguishersApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await extinguishersApi.report();
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
