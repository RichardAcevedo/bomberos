import companiesApi from '../../commons/api/companies';
import * as types from '../../commons/mutationTypes';
import companyModel from '../../commons/models/company';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const companies = await companiesApi.get();
    const { data } = companies;
    const result = data.reduce((m, item) => {
      m.push(companyModel.getViewFormatSimple(item));
      return m;
    }, []);
    commit(types.SET_COMPANIES_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const company = await companiesApi.getForId(payload);
    const { data } = company;
    const result = companyModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => companiesApi.store(payload);

const update = async (params, payload) => {
  try {
    const company = await companiesApi.update(payload);
    return company;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await companiesApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await companiesApi.report();
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
