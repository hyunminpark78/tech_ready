import contractService from '@/services/contractService';

const types = {
  SET_LIST: 'SET_LIST',
  SET_DETAIL: 'SET_DETAIL',
  SET_SUMMARY: 'SET_SUMMARY',
  SET_STAT: 'SET_STAT',
  SET_PRDT_STAT: 'SET_PRDT_STAT',
  SET_CTRT_ID: 'SET_CTRT_ID',
};
export default {
  namespaced: true,
  state: {
    list: [],
    detail: [],
    summary: {},
    stat: [],
    prdtStat: [],
    ctrtId: [],
  },
  getters: {
    list: (state) => {
      return state.list;
    },
    detail: (state) => {
      return state.detail;
    },
    summary: (state) => {
      return state.chsummaryrgYm;
    },
    stat: (state) => {
      return state.stat;
    },
    prdtStat: (state) => {
      return state.prdtStat;
    },
  },
  actions: {
    async fetchList({ commit }) {
      const response = await contractService.fetchList();
      commit(types.SET_LIST, response.data.data);
    },
    async fetchDetail({ commit }, { ctrtId }) {
      const response = await contractService.fetchDetail({ ctrtId });
      commit(types.SET_DETAIL, response.data.data);
    },
    async fetchSummary({ commit }) {
      const response = await contractService.fetchSummary();
      commit(types.SET_SUMMARY, response.data.data);
    },
    async fetchStat({ commit }) {
      const response = await contractService.fetchStat();
      commit(types.SET_STAT, response.data.data);
    },
    async fetchPrdtStat({ commit }) {
      const response = await contractService.fetchPrdtStat();
      commit(types.SET_PRDT_STAT, response.data.data);
    },
    async fetchCtrtId({ commit }, { ctrtId }) {
      commit(types.SET_CTRT_ID, ctrtId);
    },
  },
  mutations: {
    [types.SET_LIST]: (state, payload) => {
      state.list = payload;
    },
    [types.SET_DETAIL]: (state, payload) => {
      state.detail = payload;
    },
    [types.SET_SUMMARY]: (state, payload) => {
      state.summary = payload;
    },
    [types.SET_STAT]: (state, payload) => {
      state.stat = payload;
    },
    [types.SET_PRDT_STAT]: (state, payload) => {
      state.prdtStat = payload;
    },
    [types.SET_CTRT_ID]: (state, payload) => {
      state.ctrtId = payload;
    },
  },
};
