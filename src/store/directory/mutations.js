import * as types from '../../commons/mutationTypes';

const mutations = {
  [types.SET_DIRECTORY_LIST](state, payload) {
    state.list = payload;
  },
};

export default mutations;
