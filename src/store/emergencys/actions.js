import emergencyApi from '../../commons/api/emergencys';
import * as types from '../../commons/mutationTypes';
import emergencyModel from '../../commons/models/emergencys';

const get = async ({ commit }) => {
  try {
    const emergencys = await emergencyApi.get();
    const { data } = emergencys;
    const result = data.reduce((m, item) => {
      m.push(emergencyModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_EMERGENCY_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

export default {
  get,
};
