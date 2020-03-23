import awardsApi from '../../commons/api/awards';
import * as types from '../../commons/mutationTypes';
import awardModel from '../../commons/models/award';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const awards = await awardsApi.get();
    const { data } = awards;
    const result = data.reduce((m, item) => {
      m.push(awardModel.getViewFormatSimple(item));
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
    const award = await awardsApi.getForId(payload);
    const { data } = award;
    const result = awardModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => awardsApi.store(payload);

const update = async (params, payload) => {
  try {
    const award = await awardsApi.update(payload);
    return award;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await awardsApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await awardsApi.report();
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
