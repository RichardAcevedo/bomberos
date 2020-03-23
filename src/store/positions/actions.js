import positionsApi from '../../commons/api/positions';
import * as types from '../../commons/mutationTypes';
import positionModel from '../../commons/models/position';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const positions = await positionsApi.get();
    const { data } = positions;
    const result = data.reduce((m, item) => {
      m.push(positionModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_POSITIONS_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getPositionsAvailable = async (params, payload) => {
  try {
    const positionsAvailable = await positionsApi.getPositionsAvailable(payload);
    const { data } = positionsAvailable;
    const result = data.reduce((m, item) => {
      m.push(positionModel.getViewFormat(item));
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const position = await positionsApi.getForId(payload);
    const { data } = position;
    const result = positionModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => positionsApi.store(payload);

const update = async (params, payload) => {
  try {
    const position = await positionsApi.update(payload);
    return position;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await positionsApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await positionsApi.report();
    downloadExcel(file.data, payload);
  } catch (e) {
    // console.log(e);
  }
};

export default {
  get,
  getForId,
  getPositionsAvailable,
  store,
  update,
  remove,
  report,
};
