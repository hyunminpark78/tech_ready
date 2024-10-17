import analysisService from '@/services/analysisService';
import moment from 'moment';

const types = {
  SET_REQUEST_STATUS: 'SET_REQUEST_STATUS',
  SET_AI_CTRT: 'SET_AI_CTRT',
  SET_CLOUD_FILTER: 'SET_CLOUD_FILTER',
  SET_ACNT_FILTER: 'SET_ACNT_FILTER',
  SET_SERVICE_FILTER: 'SET_SERVICE_FILTER',
  SET_REGION_FILTER: 'SET_REGION_FILTER',
  SET_USAGE: 'SET_USAGE',
  SET_FILTER: 'SET_FILTER',
  SET_FILTER_OPTIONS: 'SET_FILTER_OPTIONS',
  SET_AI_PATTERN_TAB: 'SET_AI_PATTERN_TAB',
  SET_AI_PATTERN_DETAIL: 'SET_AI_PATTERN_DETAIL',
  SET_FRAUD_DETECTION: 'SET_FRAUD_DETECTION',
  SET_FRAUD_DETECTION_DETAIL: 'SET_FRAUD_DETECTION_DETAIL',
  SET_FRAUD_DETECTION_DETAIL_GRID: 'SET_FRAUD_DETECTION_DETAIL_GRID',
  SET_AI_FILTER: 'SET_AI_FILTER',
};

const REQUEST_STATUS = {
  PENDING: 'pending',
  REJECTED: 'rejected',
  FULFILLED: 'fulfilled',
};

export default {
  namespaced: true,
  state: {
    requestStatus: {
      filterContractOptions: REQUEST_STATUS.FULFILLED,
      filterOptions: REQUEST_STATUS.FULFILLED,
    },
    aictrt: [],
    usageCost: [],
    filter: {
      dateRange: { startDate: null, endDate: null },
      contractId: 'CTRT_ALL',
      providers: [],
      accounts: [],
      services: [],
      regions: [],
    },
    filterOptions: {
      contracts: [],
      providers: [],
      accounts: [],
      services: [],
      regions: [],
    },
    aiFilter: {
      ctrtId: '',
    },
    aiPatternTab: [],
    aiPatternDetail: [],
    fraudDetection: [],
    fraudDetectionDetail: {
      ctrtId: '',
      forcstDt: '',
      realCost: '',
      forcstCost: '',
      pricingCurcyCd: '',
      diffRate: '',
      diffCost: '',
      anomlCtnt: '',
      anomlCnt: '',
    },
    fraudDetectionDetailGrid: [],
  },
  getters: {
    selectAiContractOptions: (state) => {
      if (state.aictrt.length < 1) {
        return state.aictrt;
      } else return [...state.aictrt];
    },
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
    selectCloudOptions: (state) => {
      if (state.cloudFilter.length < 1) {
        return state.cloudFilter;
      }
      return [
        {
          grpId: 'CSP_ALL',
          grpNm: '전체',
        },
        ...state.cloudFilter,
      ];
    },
    selectAcntOptions: (state) => {
      if (state.acntFilter.length < 1) {
        return state.acntFilter;
      }
      return [
        {
          grpId: 'ACNT_ALL',
          grpNm: '전체',
        },
        ...state.acntFilter,
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
    selectRegionOptions: (state) => {
      if (state.regionFilter.length < 1) {
        return state.regionFilter;
      }
      return [
        {
          grpId: 'REGION_ALL',
          grpNm: '전체',
        },
        ...state.regionFilter,
      ];
    },
    getAiPatternTab: (state) => {
      if (state.aiPatternTab.length < 1) {
        return state.aiPatternTab;
      }
      return [...state.aiPatternTab];
    },
    getAiPatternDetail: (state) => {
      if (state.aiPatternDetail.length < 1) {
        return state.aiPatternDEtail;
      }
      return [...state.aiPatternDetail];
    },
  },
  actions: {
    async fetchAiCtrt({ commit }) {
      const response = await analysisService.fetchAiCtrt();
      commit(types.SET_AI_CTRT, response.data.data);
    },
    async fetchFilterContractOptions({ commit, state }, payload) {
      // pending
      commit(types.SET_REQUEST_STATUS, { name: 'filterContractOptions', value: REQUEST_STATUS.PENDING });

      let response;
      try {
        response = await analysisService.fetchCtrt(payload);
      } catch (e) {
        // rejected
        commit(types.SET_REQUEST_STATUS, { name: 'filterContractOptions', value: REQUEST_STATUS.REJECTED });
      }

      // fulfilled
      commit(types.SET_REQUEST_STATUS, { name: 'filterContractOptions', value: REQUEST_STATUS.FULFILLED });

      if (response.data.data) {
        if (response.data.data.length === 1) {
          commit(types.SET_FILTER_OPTIONS, { ...state.filterOptions, contracts: response.data.data });
        } else if (response.data.data.length > 1) {
          let tmpData = [];
          tmpData.push({ ctrtId: 'CTRT_ALL', ctrtNm: '전체' });
          let totalData = [].concat(tmpData, response.data.data);

          commit(types.SET_FILTER_OPTIONS, { ...state.filterOptions, contracts: totalData });
        } else {
          let tmpData = [];
          tmpData.push({ ctrtId: 'CTRT_ALL', ctrtNm: '없음' });
          commit(types.SET_FILTER_OPTIONS, { ...state.filterOptions, contracts: tmpData });
        }
      }
    },
    async fetchFilterOptions({ commit, state }) {
      const { startDate, endDate } = state.filter.dateRange;
      const { providers: cspList, accounts: acntList, services: serviceList, regions: regionList } = state.filter;

      // pending
      commit(types.SET_REQUEST_STATUS, { name: 'filterOptions', value: REQUEST_STATUS.PENDING });

      let response;
      try {
        response = await analysisService.fetchFilterOptions({
          ctrtId: state.filter.contractId,
          strDt: moment(startDate).format('YYYYMMDD'),
          endDt: moment(endDate).format('YYYYMMDD'),
          cspList,
          acntList,
          serviceList,
          regionList,
        });
      } catch (e) {
        // rejected
        commit(types.SET_REQUEST_STATUS, { name: 'filterOptions', value: REQUEST_STATUS.REJECTED });
      }

      // fulfilled
      commit(types.SET_REQUEST_STATUS, { name: 'filterOptions', value: REQUEST_STATUS.FULFILLED });

      commit(types.SET_FILTER_OPTIONS, {
        ...state.filterOptions,
        ...response.data.data,
      });
    },
    async fetchUsage({ commit, state }, { headerType }) {
      const { contractId: ctrtId } = state.filter;
      const { startDate, endDate } = state.filter.dateRange;
      const { providers: cspList, accounts: acntList, services: serviceList, regions: regionList } = state.filter;
      commit(types.SET_USAGE, [{ grpId: 'init', accumKrwUnblendCost: 0 }], headerType);
      const response = await analysisService.fetchUsage({
        ctrtId,
        strDt: moment(startDate).format('YYYYMMDD'),
        endDt: moment(endDate).format('YYYYMMDD'),
        cspList,
        acntList,
        serviceList,
        regionList,
        headerType,
      });
      commit(types.SET_USAGE, response.data.data, headerType);
    },
    async fetchAiPatternTab({ commit }, { ctrtId }) {
      const response = await analysisService.fetchAiPatternTab({ ctrtId });
      commit(types.SET_AI_PATTERN_TAB, response.data.data);
    },
    async fetchAiPatternDetail({ commit }, { ctrtId, headerType }) {
      const response = await analysisService.fetchAiPatternDetail({ ctrtId, headerType });
      commit(types.SET_AI_PATTERN_DETAIL, response.data.data);
    },
    async fetchFraudDetection({ commit }, { ctrtId, headerType }) {
      const response = await analysisService.fetchFraudDetection({ ctrtId, headerType });
      commit(types.SET_FRAUD_DETECTION, response.data.data);
    },
    async fetchFraudDetectionDetail({ commit }, { ctrtId, analDt }) {
      const response = await analysisService.fetchFraudDetectionDetail({ ctrtId, analDt });
      commit(types.SET_FRAUD_DETECTION_DETAIL, response.data.data);
    },
    async fetchFraudDetectionDetailGrid({ commit }, { ctrtId, analDt }) {
      const response = await analysisService.fetchFraudDetectionDetailGrid({ ctrtId, analDt });
      commit(types.SET_FRAUD_DETECTION_DETAIL_GRID, response.data.data);
    },
    resetFilter({ commit, state }) {
      commit(types.SET_FILTER, {
        ...state.filter,
        providers: [],
        accounts: [],
        services: [],
        regions: [],
      });
    },
    setFilter({ commit, state }, payload) {
      commit(types.SET_FILTER, {
        ...state.filter,
        [payload.name]: payload.data,
      });
    },
    setFilterOptions({ commit }, payload) {
      commit(types.SET_FILTER_OPTIONS, payload);
    },
    setAiFilter({ commit }, { ctrtId }) {
      commit(types.SET_AI_FILTER, {
        ctrtId,
      });
    },
  },
  mutations: {
    [types.SET_REQUEST_STATUS]: (state, { name, value }) => {
      if (
        !name ||
        !value ||
        ![REQUEST_STATUS.PENDING, REQUEST_STATUS.FULFILLED, REQUEST_STATUS.REJECTED].includes(value)
      ) {
        // eslint-disable-next-line no-console
        console.error(`mutation [${types.SET_REQUEST_STATUS}]`, 'wrong arguments');
        return;
      }
      state.requestStatus = {
        ...state.requestStatus,
        [name]: value,
      };
    },
    [types.SET_AI_CTRT]: (state, payload) => {
      state.aictrt = payload;
    },
    [types.SET_USAGE]: (state, payload) => {
      state.usageCost = payload;
    },
    [types.SET_FILTER]: (state, payload) => {
      state.filter = payload;
    },
    [types.SET_FILTER_OPTIONS]: (state, payload) => {
      state.filterOptions = payload;
    },
    [types.SET_AI_PATTERN_TAB]: (state, payload) => {
      state.aiPatternTab = payload;
    },
    [types.SET_AI_PATTERN_DETAIL]: (state, payload) => {
      state.aiPatternDetail = payload;
    },
    [types.SET_FRAUD_DETECTION]: (state, payload) => {
      state.fraudDetection = payload;
    },
    [types.SET_FRAUD_DETECTION_DETAIL]: (state, payload) => {
      state.fraudDetectionDetail = payload;
    },
    [types.SET_FRAUD_DETECTION_DETAIL_GRID]: (state, payload) => {
      state.fraudDetectionDetailGrid = payload;
    },
    [types.SET_AI_FILTER]: (state, payload) => {
      state.aiFilter = payload;
    },
  },
};
