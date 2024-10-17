import awsAcctMgmtService from '@/services/awsAcctMgmtService';
import moment from 'moment';

const types = {
  SET_ISSEARCH: 'SET_ISSEARCH',
  SET_PARAM: 'SET_PARAM',
  SET_FILTER: 'SET_FILTER',
  SET_DETAIL: 'SET_DETAIL',
};
export default {
  namespaced: true,
  state: {
    filter: {
      searchKeyword: '',
    },
    isSearch: {},
    detail: {
      acntId: '',
      acntNm: '',
      extId: '',
      roleArn: '',
      custCorpId: '',
      corpRegNo: '',
    },
  },
  getters: {
    filter: (state) => {
      return state.filter;
    },
    isSearch: (state) => {
      return state.isSearch;
    },
    detail: (state) => {
      return state.detail;
    },
  },
  actions: {
    fetchSearch({ commit }, { isSearch }) {
      commit(types.SET_ISSEARCH, isSearch);
    },
    fetchParam({ commit }, { state }) {
      commit(types.SET_PARAM, state);
    },
    fetchDetail({ commit }, { acntId, acntNm, extId, roleArn, custCorpId, corpRegNo }) {
      commit(types.SET_DETAIL, { acntId, acntNm, extId, roleArn, custCorpId, corpRegNo });
    },
  },
  mutations: {
    [types.SET_ISSEARCH]: (state, payload) => {
      state.isSearch = payload;
    },
    [types.SET_PARAM]: (state, payload) => {
      const key = Object.keys(payload)[0];
      state.filter = { ...state.filter, [key]: payload[key] };
    },
    [types.SET_FILTER]: (state, payload) => {
      state.filter = payload;
    },
    [types.SET_DETAIL]: (state, payload) => {
      state.detail = payload;
    },
  },
};
