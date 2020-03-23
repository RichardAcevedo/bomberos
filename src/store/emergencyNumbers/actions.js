import emergencyNumbersApi from '../../commons/api/emergencyNumbers';
import * as types from '../../commons/mutationTypes';
import emergencyNumberModel from '../../commons/models/emergencyNumber';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const emergencyNumbers = await emergencyNumbersApi.get();
    const { data } = emergencyNumbers;
    const result = data.reduce((m, item) => {
      m.push(emergencyNumberModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_VEHICLE_TYPES_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const emergencyNumber = await emergencyNumbersApi.getForId(payload);
    const { data } = emergencyNumber;
    const result = emergencyNumberModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => emergencyNumbersApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await emergencyNumbersApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const emergencyNumber = await emergencyNumbersApi.update(payload);
    return emergencyNumber;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await emergencyNumbersApi.report();
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
