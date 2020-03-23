import elementsApi from '../../commons/api/elements';
import * as types from '../../commons/mutationTypes';
import elementModel from '../../commons/models/element';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const elements = await elementsApi.get();
    const { data } = elements;
    const result = data.reduce((m, item) => {
      m.push(elementModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_ELEMENTS_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getElementsWithoutVehicle = async () => {
  try {
    const elements = await elementsApi.getElementsWithoutVehicle();
    const { data } = elements;
    const result = data.reduce((m, item) => {
      m.push(elementModel.getViewFormat(item));
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
    const element = await elementsApi.getForId(payload);
    const { data } = element;
    const result = elementModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => elementsApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await elementsApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const element = await elementsApi.update(payload);
    return element;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await elementsApi.report();
    downloadExcel(file.data, payload);
  } catch (e) {
    // console.log(e);
  }
};

export default {
  get,
  getElementsWithoutVehicle,
  getForId,
  store,
  remove,
  update,
  report,
};
