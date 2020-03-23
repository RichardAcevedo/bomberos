import * as types from '../../commons/mutationTypes';

const mutations = {
  [types.SET_APPOINTMENTS_LIST](state, payload) {
    state.list = payload;
  },
};

export default mutations;
