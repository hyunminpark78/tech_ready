import moment from 'moment';
import trustedAdvisorService from '@/services/trustedAdvisorService';

const types = {
  SET_FILTER: 'SET_FILTER',
  SET_PARAM: 'SET_PARAM',
  SET_ISSEARCH: 'SET_ISSEARCH',
  SET_SELECTED_FILTER: 'SET_SELECTED_FILTER',
  SET_SELECTED_CUST_CORP_IDS: 'SET_SELECTED_CUST_CORP_IDS',
  SET_SVC_GRP_SELECTED_CUST_CORP_IDS: 'SET_SVC_GRP_SELECTED_CUST_CORP_IDS',
  SET_STATUS: 'SET_STATUS',
  SET_VISIBLE_DESC_POP: 'SET_VISIBLE_DESC_POP',
  SET_CHK_DESC: 'SET_CHK_DESC',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_CHK_STAT_CD: 'SET_CHK_STAT_CD',
};

export default {
  namespaced: true,
  state: {
    filter: {
      ctrtList: [],
      acntList: [],
      regionList: [],
      svcGrpList: [],
      anctMap: {},
      regionAllCheckYn: false,
    },
    chkStatCd: '',
    isSearch: {},
    selectedFilter: {},
    selectedCustCorpIds: [],
    svcGrpSelectedCustCorpIds: [],
    status: {
      totExpctSaveCost: 0,
      errorCnt: 0,
      warnCnt: 0,
      okCnt: 0,
      sprCnt: 0,
    },
    visibleDescPop: false,
    chkDesc: {
      name: '',
      desc: '',
    },
    category: '',
  },
  getters: {},
  actions: {
    async fetchFilter({ commit }) {
      const response = await trustedAdvisorService.fetchFilter();
      commit(types.SET_FILTER, { ...response.data.data });
      return response.data.data;
    },
    fetchParam({ commit }, { state }) {
      commit(types.SET_PARAM, state);
    },
    fetchSearch({ commit }, { isSearch }) {
      commit(types.SET_ISSEARCH, isSearch);
    },
    fetchSelectedFilter({ commit }, { state }) {
      commit(types.SET_SELECTED_FILTER, state);
    },
    fetchSelectedCorpCustIds({ commit }, { state }) {
      commit(types.SET_SELECTED_CUST_CORP_IDS, state);
    },
    fetchStatus({ commit }, state) {
      commit(types.SET_STATUS, state);
    },
    fetchVisibleDescPop({ commit }, state) {
      commit(types.SET_VISIBLE_DESC_POP, state);
    },
    fetchChkDes({ commit }, { name, desc }) {
      commit(types.SET_CHK_DESC, { name, desc });
    },
    fetchSvcGrpSelectedCorpCustIds({ commit }, { state }) {
      commit(types.SET_SVC_GRP_SELECTED_CUST_CORP_IDS, state);
    },
    fetchCategory({ commit }, { state }) {
      commit(types.SET_CATEGORY, state);
    },
    fetchChkStatCd({ commit }, state) {
      commit(types.SET_CHK_STAT_CD, state);
    },
  },
  mutations: {
    [types.SET_FILTER]: (state, payload) => {
      let acntIdList = [];
      let mergedMap = new Map();
      payload.ctrtList.forEach((ctrt) => {
        const acnts = ctrt.acntList.map((acnt) => acnt.id);
        acntIdList = acntIdList.concat(acnts);
        const anctMap = ctrt.acntList.reduce((map, obj) => {
          map.set(obj.id, obj.nm);
          return map;
        }, new Map());
        mergedMap = new Map([...mergedMap, ...anctMap]);
        return ctrt.id;
      });
      state.filter = payload;
      state.filter.acntIdList = acntIdList;
      state.filter.anctMap = mergedMap;
    },
    [types.SET_PARAM]: (state, payload) => {
      const key = Object.keys(payload)[0];
      state.filter = { ...state.filter, [key]: payload[key] };
    },
    [types.SET_ISSEARCH]: (state, payload) => {
      state.isSearch = payload;
    },
    [types.SET_SELECTED_FILTER]: (state, payload) => {
      state.selectedFilter = payload;
    },
    [types.SET_SELECTED_CUST_CORP_IDS]: (state, payload) => {
      state.selectedCustCorpIds = payload;
    },
    [types.SET_STATUS]: (state, payload) => {
      state.status = payload;
    },
    [types.SET_VISIBLE_DESC_POP]: (state, payload) => {
      state.visibleDescPop = payload;
    },
    [types.SET_CHK_DESC]: (state, payload) => {
      state.chkDesc = payload;
    },
    [types.SET_SVC_GRP_SELECTED_CUST_CORP_IDS]: (state, payload) => {
      if (state.svcGrpSelectedCustCorpIds !== payload) {
        state.filter.svcGrpList = [];
      }
      state.svcGrpSelectedCustCorpIds = payload;
    },
    [types.SET_CATEGORY]: (state, payload) => {
      state.category = payload;
    },
    [types.SET_CHK_STAT_CD]: (state, payload) => {
      state.chkStatCd = payload;
    },
  },
};
