import billsApi from '../../commons/api/bills';
import * as types from '../../commons/mutationTypes';
import billModel from '../../commons/models/bill';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const bills = await billsApi.get();
    const { data } = bills;
    const result = data.reduce((m, item) => {
      m.push(billModel.getViewFormatSimple(item));
      return m;
    }, []);
    commit(types.SET_BILLS_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const bill = await billsApi.getForId(payload);
    const { data } = bill;
    const result = billModel.getViewFormatComplete(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getBillsReport = async (params, payload) => {
  try {
    const bills = await billsApi.getReport(payload);
    const { data } = bills;
    const result = data.reduce((m, item) => {
      m.push(billModel.getViewFormatComplete(item));
      return m;
    }, []);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => billsApi.store(payload);

const update = async (params, payload) => {
  try {
    const bill = await billsApi.update(payload);
    return bill;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await billsApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const report = async (params, payload) => {
  try {
    const file = await billsApi.report();
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
  getBillsReport,
  report,
};
