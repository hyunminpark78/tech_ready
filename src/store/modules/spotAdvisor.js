import spotUsageService from '@/services/spotUsageService';
import _ from 'lodash';

const types = {
  SET_FILTER: 'SET_FILTER',
  SET_PARAM: 'SET_PARAM',
  SET_SELECTED_FILTER: 'SET_SELECTED_FILTER',
  SET_SELECTED_CUST_CORP_IDS: 'SET_SELECTED_CUST_CORP_IDS',
  SET_SELECTED_TAG_KEY_IDS: 'SET_SELECTED_TAG_KEY_IDS',
  SET_SVC_GRP_SELECTED_CUST_CORP_IDS: 'SET_SVC_GRP_SELECTED_CUST_CORP_IDS',
  SET_SPOT_USAGE_SUMMARY: 'SET_SPOT_USAGE_SUMMARY',
  SET_SPOT_INSTANCE_SAVING_STATUS_DATA: 'SET_SPOT_INSTANCE_SAVING_STATUS_DATA',
  SET_SPOT_RECOMMEND_SUMMARY: 'SET_SPOT_RECOMMEND_SUMMARY',
  SET_RECOMMEND_DETAIL_DATA: 'SET_RECOMMEND_DETAIL_DATA',
  SET_REQUEST_GRID_DATA: 'SET_REQUEST_GRID_DATA',
  SET_DAILY_RATE_DATA: 'SET_DAILY_RATE_DATA',
  SET_GPU_COVERAGE_DATA: 'SET_GPU_COVERAGE_DATA',
  SET_KRW_EXCHG_RATE: 'SET_KRW_EXCHG_RATE',
  SET_CATEGORY: 'SET_CATEGORY',
  INIT_FILTER: 'INIT_FILTER',
};
export default {
  namespaced: true,
  state: {
    filter: {
      cspTypCd: '',
      ctrtList: [],
      acntList: [],
      cspPrdtList: [],
      regionSepList: [],
      tagList: [],
      defaultTag: { tagKey: '', tagValList: [] },
      svcCtrtList: [],
      anctMap: {},
      spotUsageRange: { startDate: null, endDate: null },
    },
    defaultCspTypCd: 'AWS',
    category: '',
    selectedFilter: {},
    selectedCustCorpIds: [],
    selectedTagKeyIds: [],
    setSpotUsageSummary: false,
    setSpotInstanceSavingStatusData: false,
    setSpotRecommendSummary: false,
    setRecommendDetailData: false,
    setRequestGridData: false,
    setDailyRateData: false,
    setGPUCoverageData: false,
    krwExchgRate: 1,
  },
  getters: {
    cspTypCd: (state) => {
      return state.filter.cspTypCd || state.defaultCspTypCd;
    },
    cspPrdtCdList: (state) => {
      return state.filter.cspPrdtList.map((item) => item.cspPrdtCd);
    },
    regionSepCdList: (state) => {
      return state.filter.regionSepList.map((item) => item.regionSepCd);
    },
    tag: (state) => {
      return state.filter.tagList.length ? state.filter.tagList[0] : state.filter.defaultTag;
    },
    selectedFilter: (state) => {
      return state.selectedFilter;
    },
    selectedCustCorpIds({ commit, state }, payload) {
      return state.selectedCustCorpIds;
    },
    selectedTagKeyIds({ commit, state }, payload) {
      return state.selectedTagKeyIds;
    },
    displayExchgRate: (state, getters) => {
      return getters.cspTypCd === state.defaultCspTypCd;
    },
    exchgRate: (state, getters) => {
      return getters.displayExchgRate ? state.krwExchgRate : 1;
    },
  },
  actions: {
    /**
     * 계약 및 계정
     */
    async fetchFilter({ commit }, { cspTypCd, strDate, endDate }) {
      const response = await spotUsageService.fetchSpotUsageFilter({ cspTypCd, strDate, endDate });
      commit(types.INIT_FILTER);
      commit(types.SET_SELECTED_FILTER, {});
      commit(types.SET_FILTER, { ...response.data.data });
      return response.data.data;
    },
    async fetchSpotRecommendFilter({ commit }, { cspTypCd }) {
      const response = await spotUsageService.fetchSpotRecommendFilter({ cspTypCd });
      commit(types.INIT_FILTER);
      commit(types.SET_SELECTED_FILTER, {});
      commit(types.SET_FILTER, { ...response.data.data });
      return response.data.data;
    },
    fetchParam({ commit }, { state }) {
      commit(types.SET_PARAM, state);
    },
    fetchSelectedFilter({ commit }, { state }) {
      commit(types.SET_SELECTED_FILTER, state);
    },
    fetchSelectedCorpCustIds({ commit }, { state }) {
      commit(types.SET_SELECTED_CUST_CORP_IDS, state);
    },
    fetchSelectedTagKeyIds({ commit }, { state }) {
      commit(types.SET_SELECTED_TAG_KEY_IDS, state);
    },
    fetchSvcGrpSelectedCorpCustIds({ commit }, { state }) {
      commit(types.SET_SVC_GRP_SELECTED_CUST_CORP_IDS, state);
    },
    fetchSpotUsageSummary({ commit }, payload) {
      commit(types.SET_SPOT_USAGE_SUMMARY, payload);
    },
    fetchSpotInstanceSavingData({ commit }, payload) {
      commit(types.SET_SPOT_INSTANCE_SAVING_STATUS_DATA, payload);
    },
    fetchSpotRecommendSummary({ commit }, payload) {
      commit(types.SET_SPOT_RECOMMEND_SUMMARY, payload);
    },
    fetchRecommendDetailData({ commit }, payload) {
      commit(types.SET_RECOMMEND_DETAIL_DATA, payload);
    },
    fetchRequestGridData({ commit }, payload) {
      commit(types.SET_REQUEST_GRID_DATA, payload);
    },
    fetchDailyRateData({ commit }, payload) {
      commit(types.SET_DAILY_RATE_DATA, payload);
    },
    fetchGPUCoverageData({ commit }, payload) {
      commit(types.SET_GPU_COVERAGE_DATA, payload);
    },
    fetchKrwExchgRate({ commit }, payload) {
      commit(types.SET_KRW_EXCHG_RATE, payload);
    },
    fetchCategory({ commit }, state) {
      commit(types.SET_CATEGORY, state);
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

      state.filter = { ...state.filter, ...payload };
      state.filter.acntIdList = acntIdList;
      state.filter.anctMap = mergedMap;
    },
    [types.SET_SELECTED_FILTER]: (state, payload) => {
      state.selectedFilter = payload;
    },
    [types.SET_SELECTED_CUST_CORP_IDS]: (state, payload) => {
      state.selectedCustCorpIds = payload;
    },
    [types.SET_SELECTED_TAG_KEY_IDS]: (state, payload) => {
      state.selectedTagKeyIds = payload;
    },
    [types.SET_SVC_GRP_SELECTED_CUST_CORP_IDS]: (state, payload) => {
      if (state.svcGrpSelectedCustCorpIds !== payload) {
        state.filter.svcGrpList = [];
      }
      state.svcGrpSelectedCustCorpIds = payload;
    },
    [types.SET_PARAM]: (state, payload) => {
      const key = Object.keys(payload)[0];
      state.filter = { ...state.filter, [key]: payload[key] };
    },
    [types.SET_SPOT_USAGE_SUMMARY]: (state, payload) => {
      state.setSpotUsageSummary = payload;
    },
    [types.SET_SPOT_INSTANCE_SAVING_STATUS_DATA]: (state, payload) => {
      state.setSpotInstanceSavingStatusData = payload;
    },
    [types.SET_SPOT_RECOMMEND_SUMMARY]: (state, payload) => {
      state.setSpotRecommendSummary = payload;
    },
    [types.SET_RECOMMEND_DETAIL_DATA]: (state, payload) => {
      state.setRecommendDetailData = payload;
    },
    [types.SET_REQUEST_GRID_DATA]: (state, payload) => {
      state.setRequestGridData = payload;
    },
    [types.SET_DAILY_RATE_DATA]: (state, payload) => {
      state.setDailyRateData = payload;
    },
    [types.SET_GPU_COVERAGE_DATA]: (state, payload) => {
      state.setGPUCoverageData = payload;
    },
    [types.SET_KRW_EXCHG_RATE]: (state, payload) => {
      state.krwExchgRate = payload;
    },
    [types.SET_CATEGORY]: (state, payload) => {
      state.category = payload;
    },
    [types.INIT_FILTER]: (state) => {
      state.filter.ctrtList = [];
      state.filter.acntList = [];
      state.filter.cspPrdtList = [];
      state.filter.regionSepList = [];
      state.filter.tagList = [];
      state.filter.svcCtrtList = [];
      state.filter.anctMap = {};
      state.selectedFilter = {};
      state.selectedCustCorpIds = [];
    },
  },
};
