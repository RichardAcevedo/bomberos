import compayTypesApi from '../../commons/api/companyTypes';
import * as types from '../../commons/mutationTypes';
import compayTypeModel from '../../commons/models/companyType';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const companyTypes = await compayTypesApi.get();
    const { data } = companyTypes;
    const result = data.reduce((m, item) => {
      m.push(compayTypeModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_ISSUE_TYPES_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const companyType = await compayTypesApi.getForId(payload);
    const { data } = companyType;
    const result = compayTypeModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => compayTypesApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await compayTypesApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const companyType = await compayTypesApi.update(payload);
    return companyType;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await compayTypesApi.report();
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
