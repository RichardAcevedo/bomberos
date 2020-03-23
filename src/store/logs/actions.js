import logsApi from '../../commons/api/logs';
import * as types from '../../commons/mutationTypes';
import logModel from '../../commons/models/log';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const logs = await logsApi.get();
    const { data } = logs;
    const result = data.reduce((m, item) => {
      m.push(logModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_LOG_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await logsApi.report();
    downloadExcel(file.data, payload);
  } catch (e) {
    // console.log(e);
  }
};

export default {
  get,
  report,
};
