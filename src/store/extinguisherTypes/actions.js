import extinguisherTypesApi from '../../commons/api/extinguisherTypes';
import * as types from '../../commons/mutationTypes';
import extinguisherTypeModel from '../../commons/models/extinguisherType';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const extinguisherTypes = await extinguisherTypesApi.get();
    const { data } = extinguisherTypes;
    const result = data.reduce((m, item) => {
      m.push(extinguisherTypeModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_EXTINGUISHER_TYPES_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const extinguisherType = await extinguisherTypesApi.getForId(payload);
    const { data } = extinguisherType;
    const result = extinguisherTypeModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => extinguisherTypesApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await extinguisherTypesApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const extinguisherType = await extinguisherTypesApi.update(payload);
    return extinguisherType;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await extinguisherTypesApi.report();
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
