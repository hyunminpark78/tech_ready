import moment from 'moment';

const types = {
  SET_ELB_STATUS: 'SET_ELB_STATUS',
};

export default {
  namespaced: true,
  state: {
    elbStatus: {},
  },
  getters: {
    elbStatus: (state) => {
      return state.elbStatus;
    },
  },
  actions: {
    fetchElbStatus({ commit }, { state }) {
      commit(types.SET_ELB_STATUS, state);
    },
  },
  mutations: {
    [types.SET_ELB_STATUS]: (state, payload) => {
      state.elbStatus = payload;
    },
  },
};
