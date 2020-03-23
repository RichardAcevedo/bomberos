import ranksApi from '../../commons/api/ranks';
import * as types from '../../commons/mutationTypes';
import rankModel from '../../commons/models/rank';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const ranks = await ranksApi.get();
    const { data } = ranks;
    const result = data.reduce((m, item) => {
      m.push(rankModel.getViewFormatSimple(item));
      return m;
    }, []);
    commit(types.SET_RANKS_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const rank = await ranksApi.getForId(payload);
    const { data } = rank;
    const result = rankModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => ranksApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await ranksApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const rank = await ranksApi.update(payload);
    return rank;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await ranksApi.report();
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
