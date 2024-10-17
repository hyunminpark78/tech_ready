import costOptiService from '@/services/costOptiService';
import moment from 'moment';

const types = {
  SET_FILTER: 'SET_FILTER',
  SET_RECOMMEND: 'SET_RECOMMEND',
  SET_PARAM: 'SET_PARAM',
  SET_LIST: 'SET_LIST',
  SET_TRANSITION: 'SET_TRANSITION',
  SET_SUMMARY: 'SET_SUMMARY',
  SET_ISSEARCH: 'SET_ISSEARCH',
  SET_PREDICT_COVERAGE: 'SET_PREDICT_COVERAGE',
  SET_CURRENT_COVERAGE: 'SET_CURRENT_COVERAGE',
  SET_CMMT_TYP: 'SET_CMMT_TYP',
  SET_ACTIVE: 'SET_ACTIVE',
  SET_LOADING: 'SET_LOADING',
  SET_POP_VISIBLE: 'SET_POP_VISIBLE',
  SET_REMOTE_PARAM: 'SET_REMOTE_PARAM',
  SET_CURRENT_CSP: 'SET_CURRENT_CSP',
};

export default {
  namespaced: true,
  state: {
    filter: {
      acntIdList: [],
      cmmt: [],
      ctrtList: [],
      prodList: [],
      acntList: [],
      prodCdList: [],
      cmmtTypList: [],
      strDate: '',
      endDate: '',
      cspTypCd: '',
    },
    filterOptions: {
      cmmts: [],
      ctrtAccounts: [],
      services: [],
    },
    recommendOption: {
      allList: [],
      checkObj: {},
      recInvnList: [],
      currentOption: '',
      type: '',
      rcmdProd: { nm: '', cd: '' },
    },
    remoteParam: {
      cspTypCd: '',
      type: '',
      acntIdList: [],
      prodList: [],
      strDate: '',
      endDate: '',
      useYn: false,
    },
    loading: true,
    predictCtrtCoverage: {},
    currentCoverage: {},
    list: [],
    transition: [],
    summary: {},
    isSearch: {},
    cmmtTyp: [],
    active: {},
    popVisible: false,
    ctrt: [],
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
      return [
        {
          ctrtId: 'CTRT_ALL',
          ctrtNm: `전체`,
        },
        ...state.ctrt,
      ];
    },
    selectServiceOptions: (state) => {
      if (state.serviceFilter.length < 1) {
        return state.serviceFilter;
      }
      return [
        {
          grpId: 'SERVICE_ALL',
          grpNm: '전체',
        },
        ...state.serviceFilter,
      ];
    },
    isAutospContractSelected: (state) => {
      const autospCtrtList = state.filter.ctrtList.filter((ctrt) => ctrt.autospYn === 'Y');
      const selectedAcntIdList = state.filter.acntIdList;

      // 필터에서 선택한 계정들이 AutoSP 계약의 계정목록에 하나라도 포함되어 있으면 AutoSP 계약이 포함된 것
      return autospCtrtList.some((autospCtrt) =>
        selectedAcntIdList.some((selectedAcntId) => autospCtrt.acntIdSet.includes(selectedAcntId))
      );
    },
    filter: (state) => {
      return state.filter;
    },
    list: (state) => {
      return state.list;
    },
    transition: (state) => {
      return state.transition;
    },
    summary: (state) => {
      return state.chsummaryrgYm;
    },
    isSearch: (state) => {
      return state.isSearch;
    },
    cmmtTyp: (state) => {
      return state.cmmtTyp;
    },
    active: (state) => {
      return state.active;
    },
    popVisible: (state) => {
      return state.popVisible;
    },
  },
  actions: {
    /**
     * 약정 대시보드
     */
    async fetchDashFilter({ commit }, { strDate, endDate, cmmtTypList }) {
      const response = await costOptiService.fetchDashFilter({
        strDate: moment(strDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
        cmmtTypList,
      });
      commit(types.SET_FILTER, { ...response.data.data, strDate, endDate });
      return response.data.data;
    },
    async fetchDashTransition({ commit }, { strDate, endDate }) {
      const response = await costOptiService.fetchDashTransition({
        strDate: moment(strDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
      });
      commit(types.SET_TRANSITION, { ...response.data.data, strDate, endDate });
      return response.data.data;
    },
    async fetchAlarmList({ commit }, { strDate, endDate }) {
      const response = await costOptiService.fetchAlarmList({
        strDate: moment(strDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
      });
      commit(types.SET_LIST, { ...response.data.data, strDate, endDate });
      return response.data.data;
    },
    async fetchAlarmCheck({ commit }, { strDate, endDate }) {
      const response = await costOptiService.fetchAlarmCheck({
        strDate: moment(strDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
      });
      return response.data.data;
    },
    fetchPopVisible({ commit }, { popVisible }) {
      commit(types.SET_POP_VISIBLE, popVisible);
    },
    /**
     * 약정 가능 대상
     */
    async fetchFilter({ commit }, { strDate, endDate, cmmtTypList }) {
      const response = await costOptiService.fetchFilter({
        strDate: moment(strDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
        cmmtTypList: cmmtTypList,
      });
      commit(types.SET_FILTER, { ...response.data.data, strDate, endDate, cmmtTypList });
      return response.data.data;
    },
    async fetchList({ commit, state }) {
      const { strDate, endDate } = state.filter.dateRange;

      const response = await costOptiService.fetchList({
        strDate: moment(strDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
      });
      commit(types.SET_LIST, response.data.data);
    },
    async fetchTransition({ commit, state, cmmtTypList }) {
      const { strDate, endDate } = state.filter.dateRange;

      const response = await costOptiService.fetchTransition({
        strDate: moment(strDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
        cmmtTypList,
      });
      commit(types.SET_TRANSITION, response.data.data);
    },
    async fetchSummary({ commit, state }) {
      const { strDate, endDate } = state.filter.dateRange;

      const response = await costOptiService.fetchSummary({
        strDate: moment(strDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
      });
      commit(types.SET_SUMMARY, response.data.data);
    },
    fetchSearch({ commit }, { isSearch }) {
      commit(types.SET_ISSEARCH, isSearch);
    },
    fetchParam({ commit }, { state }) {
      commit(types.SET_PARAM, state);
    },
    fetchRemoteParam({ commit }, { state }) {
      commit(types.SET_REMOTE_PARAM, state);
    },

    fetchPredictCoverage({ commit }, { predictCtrtCoverage }) {
      commit(types.SET_PREDICT_COVERAGE, predictCtrtCoverage);
    },
    fetchCurrentCoverage({ commit }, { currentCoverage }) {
      commit(types.SET_CURRENT_COVERAGE, currentCoverage);
    },
    /**
     * 약정 추천
     */
    async fetchRecFilter({ commit }, { cmmtTypList }) {
      const response = await costOptiService.fetchRecFilter({
        cmmtTypList: cmmtTypList,
      });
      commit(types.SET_FILTER, { ...response.data.data, cmmtTypList });
      return response.data.data;
    },
    fetchRecommend({ commit }, { recommendOption }) {
      commit(types.SET_RECOMMEND, recommendOption);
    },
    fetchLoading({ commit }, { loading }) {
      commit(types.SET_LOADING, loading);
    },
    /**
     * 약정 현황
     */
    async fetchStatFilter({ commit }, { strDate, endDate, cmmtTypList }) {
      const response = await costOptiService.fetchStatFilter({
        strDate: moment(strDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
        cmmtTypList: cmmtTypList,
      });
      commit(types.SET_FILTER, { ...response.data.data, strDate, endDate, cmmtTypList });
      return response.data.data;
    },
    fetchCmmtTyp({ commit }, { cmmtTyp }) {
      commit(types.SET_CMMT_TYP, cmmtTyp);
    },
    fetchActive({ commit }, { state }) {
      commit(types.SET_ACTIVE, state);
    },
  },
  mutations: {
    [types.SET_FILTER]: (state, payload) => {
      const prodCdList = payload.prodList.map((prod) => prod.cd);
      let acntIdList = [];
      payload.ctrtList.forEach((ctrt) => {
        const acnts = ctrt.acntList.map((acnt) => acnt.id);
        acntIdList = acntIdList.concat(acnts);
        return ctrt.id;
      });
      state.filter = { ...state.filter, ...payload };
      state.filter.acntIdList = acntIdList;
      state.filter.prodCdList = prodCdList;
    },
    [types.SET_LIST]: (state, payload) => {
      state.list = payload;
    },
    [types.SET_TRANSITION]: (state, payload) => {
      state.transition = payload;
    },
    [types.SET_SUMMARY]: (state, payload) => {
      state.summary = payload;
    },
    [types.SET_ISSEARCH]: (state, payload) => {
      state.isSearch = payload;
    },
    [types.SET_PARAM]: (state, payload) => {
      state.filter = { ...state.filter, ...payload };
    },
    [types.SET_REMOTE_PARAM]: (state, payload) => {
      state.remoteParam = { ...state.remoteParam, ...payload };
    },
    [types.SET_PREDICT_COVERAGE]: (state, payload) => {
      state.predictCtrtCoverage = payload;
    },
    [types.SET_CURRENT_COVERAGE]: (state, payload) => {
      state.currentCoverage = payload;
    },
    [types.SET_RECOMMEND]: (state, payload) => {
      state.recommendOption = payload;
    },
    [types.SET_CMMT_TYP]: (state, payload) => {
      state.cmmtTyp = payload;
      state.filter.cmmtTypList = payload;
    },
    [types.SET_ACTIVE]: (state, payload) => {
      state.active = { ...state.active, ...payload };
    },
    [types.SET_LOADING]: (state, payload) => {
      state.loading = payload;
    },
    [types.SET_POP_VISIBLE]: (state, payload) => {
      state.popVisible = payload;
    },
    [types.SET_CURRENT_CSP]: (state, payload) => {
      state.filter.cspTypCd = payload;
    },
  },
};
