import vehicleTypesApi from '../../commons/api/vehicleTypes';
import * as types from '../../commons/mutationTypes';
import vehicleTypeModel from '../../commons/models/vehicleType';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const vehicleTypes = await vehicleTypesApi.get();
    const { data } = vehicleTypes;
    const result = data.reduce((m, item) => {
      m.push(vehicleTypeModel.getViewFormat(item));
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
    const vehicleType = await vehicleTypesApi.getForId(payload);
    const { data } = vehicleType;
    const result = vehicleTypeModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => vehicleTypesApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await vehicleTypesApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const vehicleType = await vehicleTypesApi.update(payload);
    return vehicleType;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await vehicleTypesApi.report();
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
