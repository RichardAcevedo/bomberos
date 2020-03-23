import * as types from '../../commons/mutationTypes';

const mutations = {
  [types.SET_COURSES_EMPLOYEES_LIST](state, payload) {
    state.list = payload;
  },
};

export default mutations;
