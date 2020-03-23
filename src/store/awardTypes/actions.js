import awardTypesApi from '../../commons/api/awardTypes';
import * as types from '../../commons/mutationTypes';
import awardTypeModel from '../../commons/models/awardType';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const awardTypes = await awardTypesApi.get();
    const { data } = awardTypes;
    const result = data.reduce((m, item) => {
      m.push(awardTypeModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_AWARD_TYPES_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const awardType = await awardTypesApi.getForId(payload);
    const { data } = awardType;
    const result = awardTypeModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => awardTypesApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await awardTypesApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const awardType = await awardTypesApi.update(payload);
    return awardType;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await awardTypesApi.report();
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
