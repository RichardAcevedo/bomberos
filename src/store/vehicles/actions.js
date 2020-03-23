import vehiclesApi from '../../commons/api/vehicles';
import * as types from '../../commons/mutationTypes';
import vehicleModel from '../../commons/models/vehicle';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const vehicles = await vehiclesApi.get();
    const { data } = vehicles;
    const result = data.reduce((m, item) => {
      m.push(vehicleModel.getViewFormatSimple(item));
      return m;
    }, []);
    commit(types.SET_VEHICLES_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const vehicle = await vehiclesApi.getForId(payload);
    const { data } = vehicle;
    const result = vehicleModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => vehiclesApi.store(payload);

const update = async (params, payload) => {
  try {
    const vehicle = await vehiclesApi.update(payload);
    return vehicle;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await vehiclesApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await vehiclesApi.report();
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
