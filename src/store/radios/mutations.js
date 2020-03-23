import * as types from '../../commons/mutationTypes';

const mutations = {
  [types.SET_AWARDS_LIST](state, payload) {
    state.list = payload;
  },
};

export default mutations;
