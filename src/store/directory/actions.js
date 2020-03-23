import directoryApi from '../../commons/api/directory';
import * as types from '../../commons/mutationTypes';
import directoryModel from '../../commons/models/directory';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const directory = await directoryApi.get();
    const { data } = directory;
    const result = data.reduce((m, item) => {
      m.push(directoryModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_DIRECTORY_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const directory = await directoryApi.getForId(payload);
    const { data } = directory;
    const result = directoryModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => directoryApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await directoryApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const directory = await directoryApi.update(payload);
    return directory;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await directoryApi.report();
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
