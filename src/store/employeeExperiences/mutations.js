import * as types from '../../commons/mutationTypes';

const mutations = {
  [types.SET_EXPERIENCES_EMPLOYEES_LIST](state, payload) {
    state.list = payload;
  },
};

export default mutations;
