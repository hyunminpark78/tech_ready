const types = {
  SET_REQUEST_GRID_DATA: 'SET_REQUEST_GRID_DATA',
};
export default {
  namespaced: true,
  state: {
    setRequestGridData: false,
  },
  actions: {
    fetchRequestGridData({ commit }, payload) {
      commit(types.SET_REQUEST_GRID_DATA, payload);
    },
  },
  mutations: {
    [types.SET_REQUEST_GRID_DATA]: (state, payload) => {
      state.setRequestGridData = payload;
    },
  },
};
