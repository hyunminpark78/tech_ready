import moment from 'moment';
import menuService from '@/services/menuService';

const types = {
  SET_MENU: 'SET_MENU',
};
export default {
  namespaced: true,
  state: {
    menu: [],
  },
  getters: {},
  actions: {
    fetchMenu({ commit }, payload) {
      commit(types.SET_MENU, payload);
    },
  },
  mutations: {
    [types.SET_MENU]: (state, payload) => {
      state.menu = payload;
    },
  },
};
