import * as types from '../../commons/mutationTypes';

const mutations = {
  [types.SET_POSITIONS_LIST](state, payload) {
    state.list = payload;
  },
};

export default mutations;
