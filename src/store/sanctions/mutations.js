import * as types from '../../commons/mutationTypes';

const mutations = {
  [types.SET_SANCTIONS_LIST](state, payload) {
    state.list = payload;
  },
};

export default mutations;
