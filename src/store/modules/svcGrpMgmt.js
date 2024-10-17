import moment from 'moment';
import svcGrpMgmtService from '@/services/svcGrpMgmtService';

const types = {
  SET_CTRT: 'SET_CTRT',
  SET_FILTER: 'SET_FILTER',
  SET_ISSEARCH: 'SET_ISSEARCH',
  SET_ISREFRESH: 'SET_ISREFRESH',
  SET_CTGRYFILTER: 'SET_CTGRYFILTER',
  SET_SVCGRPFILTER: 'SET_SVCGRPFILTER',
};
export default {
  namespaced: true,
  state: {
    ctrt: [],
    filter: {
      contract: {},
    },
    ctgryFilter: {},
    svcGrpFilter: {},
    isSearch: {},
    isRefresh: {},
  },
  getters: {
    selectContractOptions: (state) => {
      if (state.ctrt.length < 1) {
        return state.ctrt;
      } else if (state.ctrt.length === 1) {
        return [
          {
            ctrtId: state.ctrt[0].ctrtId,
            ctrtNm: state.ctrt[0].ctrtNm,
          },
        ];
      }
      return [...state.ctrt];
    },
  },
  actions: {
    async fetchCtrt({ commit }) {
      const response = await svcGrpMgmtService.fetchCtrt();
      commit(types.SET_CTRT, response.data.data);
    },
    setFilter({ commit }, payload) {
      commit(types.SET_FILTER, payload);
    },
    setCtgryFilter({ commit }, payload) {
      commit(types.SET_CTGRYFILTER, payload);
    },
    setSvcGrpFilter({ commit }, payload) {
      commit(types.SET_SVCGRPFILTER, payload);
    },
    fetchSearch({ commit }, { isSearch }) {
      commit(types.SET_ISSEARCH, isSearch);
    },
    fetchRefresh({ commit }, { isRefresh }) {
      commit(types.SET_ISREFRESH, isRefresh);
    },
  },
  mutations: {
    [types.SET_CTRT]: (state, payload) => {
      state.ctrt = payload;
    },
    [types.SET_FILTER]: (state, { name, payload }) => {
      state.filter = {
        ...state.filter,
        [name]: payload,
      };
    },
    [types.SET_ISSEARCH]: (state, payload) => {
      state.isSearch = payload;
    },
    [types.SET_ISREFRESH]: (state, payload) => {
      state.isRefresh = payload;
    },
    [types.SET_CTGRYFILTER]: (state, payload) => {
      state.ctgryFilter = payload;
    },
    [types.SET_SVCGRPFILTER]: (state, payload) => {
      state.svcGrpFilter = payload;
    },
  },
};
