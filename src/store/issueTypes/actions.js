import issueTypesApi from '../../commons/api/issueTypes';
import * as types from '../../commons/mutationTypes';
import issueTypeModel from '../../commons/models/issueType';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const issueTypes = await issueTypesApi.get();
    const { data } = issueTypes;
    const result = data.reduce((m, item) => {
      m.push(issueTypeModel.getViewFormat(item));
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
    const issueType = await issueTypesApi.getForId(payload);
    const { data } = issueType;
    const result = issueTypeModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => issueTypesApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await issueTypesApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const issueType = await issueTypesApi.update(payload);
    return issueType;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await issueTypesApi.report();
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
