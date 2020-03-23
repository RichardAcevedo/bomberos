import customersApi from '../../commons/api/customers';
import * as types from '../../commons/mutationTypes';
import customerModel from '../../commons/models/customer';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const customers = await customersApi.get();
    const { data } = customers;
    const result = data.reduce((m, item) => {
      m.push(customerModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_CUSTOMERS_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const customer = await customersApi.getForId(payload);
    const { data } = customer;
    const result = customerModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => customersApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await customersApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const customer = await customersApi.update(payload);
    return customer;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await customersApi.report();
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
