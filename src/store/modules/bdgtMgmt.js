import bdgtMgmtService from '@/services/bdgtMgmtService.js';

const types = {
  SET_TREND: 'SET_TREND',
  SET_TREND_YEAR: 'SET_TREND_YEAR',
  SET_CHRG_YM: 'SET_CHRG_YM',
  SET_SUMMARY: 'SET_SUMMARY',
  SET_BILL: 'SET_BILL',
  SET_BILL_DETAIL: 'SET_BILL_DETAIL',
  SET_CTRT: 'SET_CTRT',
  SET_FILTER: 'SET_FILTER',
  ADD_FILTER: 'ADD_FILTER',
  REMOVE_FILTER: 'REMOVE_FILTER',
  SET_BILL_INFO: 'SET_BILL_INFO',
  SET_BILL_FILTER: 'SET_BILL_FILTER',
  SET_BILL_TAG_ID: 'SET_BILL_TAG_ID',
  SET_SVC_CTGRY_LIST: 'SET_SVC_CTGRY_LIST',
  SET_PST_BILL_LIST: 'SET_PST_BILL_LIST',
};

export default {
  namespaced: true,
  state: {
    trend: [],
    trendYear: [],
    chrgYm: [],
    summary: {},
    bill: [],
    billDetail: {},
    ctrt: [],
    filter: {
      trendType: {},
      trendYear: {},
      billYm: {},
      ctrt: {},
    },
    billInfo: {
      billYm: '',
      ctrtId: '',
      chrgYm: '',
    },
    billFilter: {},
    billTag: [],
    svcCtgryList: [],
  },
  getters: {
    trend: (state) => {
      return state.trend;
    },
    trendYear: (state) => {
      return state.trendYear;
    },
    summary: (state) => {
      return state.summary;
    },
    bill: (state) => {
      return state.bill;
    },
    billDetail: (state) => {
      return state.billDetail;
    },
    ctrt: (state) => {
      return state.ctrt;
    },
    getBillInfo: (state) => {
      return state.billInfo;
    },
    getSvcCtgryList: (state) => {
      return state.svcCtgryList;
    },
    getPstBillList: (state) => {
      return state.pstBillList;
    },
  },
  actions: {
    async fetchTrend({ commit }, { trendYear, tabType }) {
      commit(types.SET_TREND, [{ grpId: 'init', billAmt: 0 }]);
      const response = await bdgtMgmtService.fetchTrend({ trendYear, tabType });
      commit(types.SET_TREND, response.data.data);
    },
    async fetchTrendYear({ commit }) {
      const response = await bdgtMgmtService.fetchTrendYear();
      commit(types.SET_TREND_YEAR, response.data.data);
    },
    async fetchChrgYm({ commit }) {
      const response = await bdgtMgmtService.fetchChrgYm();
      commit(types.SET_CHRG_YM, response.data.data);
    },
    async fetchSummary({ commit }, { chrgYm }) {
      const response = await bdgtMgmtService.fetchSummary({ chrgYm });
      commit(types.SET_SUMMARY, response.data.data);
    },
    async fetchBill({ commit }, { chrgYm, ctrtId }) {
      const response = await bdgtMgmtService.fetchBill({ chrgYm, ctrtId });
      commit(types.SET_BILL, response.data.data);
    },
    async fetchBillDetail({ commit }, { billId, ctrtId, billYm, tabType, chrgYm, tagId, cspTypCd }) {
      const response = await bdgtMgmtService.fetchBillDetail({ billId, ctrtId, billYm, tabType, chrgYm, tagId, cspTypCd });
      if (response.data.data.length > 0) {
        response.data.data[0].tabType = tabType;
      }
      commit(types.SET_BILL_DETAIL, response.data.data[0]);
      return response.data.data[0];
    },
    async fetchCtrt({ commit }, { chrgYm }) {
      const response = await bdgtMgmtService.fetchCtrt({ chrgYm });
      commit(types.SET_CTRT, response.data.data);
    },
    setFilter({ commit }, payload) {
      commit(types.SET_FILTER, payload);
    },
    addFilter({ commit }, payload) {
      commit(types.ADD_FILTER, payload);
    },
    removeFilter({ commit }, payload) {
      commit(types.REMOVE_FILTER, payload);
    },
    setBillInfo({ commit }, payload) {
      commit(types.SET_BILL_INFO, payload);
    },
    async fetchBillFilter({ commit }, { ctrtId, billYm, cspTypCd }) {
      const response = await bdgtMgmtService.fetchBillFilter({ ctrtId, billYm, cspTypCd });
      commit(types.SET_BILL_FILTER, response.data.data);
    },
    async fetchBillTag({ commit }, { ctrtId, billId }) {
      const response = await bdgtMgmtService.fetchBillTag({ ctrtId, billId });
      commit(types.SET_BILL_TAG_ID, response.data.data);
    },
    setSvcCtgryList({ commit }, payload) {
      commit(types.SET_SVC_CTGRY_LIST, payload);
    },
    async fetchPstBillList({ commit }, { billId, ctrtId, billDt }) {
      const response = await bdgtMgmtService.fetchPstBillList({ billId, ctrtId, billDt });
      commit(types.SET_PST_BILL_LIST, response.data.data);
    },
    async fetchAzureBillTag({ commit }, { ctrtId, billYm }) {
      const response = await bdgtMgmtService.fetchAzureBillTag({ ctrtId, billYm });
      commit(types.SET_BILL_TAG_ID, response.data.data);
    },
  },
  mutations: {
    [types.SET_TREND]: (state, payload) => {
      state.trend = payload;
    },
    [types.SET_TREND_YEAR]: (state, payload) => {
      state.trendYear = payload;
    },
    [types.SET_CHRG_YM]: (state, payload) => {
      state.chrgYm = payload;
    },
    [types.SET_SUMMARY]: (state, payload) => {
      state.summary = payload;
    },
    [types.SET_BILL]: (state, payload) => {
      state.bill = payload;
    },
    [types.SET_BILL_DETAIL]: (state, payload) => {
      state.billDetail = payload;
    },
    [types.SET_CTRT]: (state, payload) => {
      state.ctrt = payload;
    },
    [types.SET_FILTER]: (state, { name, payload }) => {
      state.filter = {
        ...state.filter,
        [name]: payload,
      };
    },
    [types.ADD_FILTER]: (state, { name, payload }) => {
      state.filter = {
        ...state.filter,
        [name]: [...state.filter[name].filter((e) => !payload.includes(e)), ...payload],
      };
    },
    [types.REMOVE_FILTER]: (state, { name, payload }) => {
      state.filter = {
        ...state.filter,
        [name]: state.filter[name].filter((e) => !payload.includes(e)),
      };
    },
    [types.SET_BILL_INFO]: (state, payload) => {
      state.billInfo = payload;
    },
    [types.SET_BILL_FILTER]: (state, payload) => {
      state.billFilter = payload;
    },
    [types.SET_BILL_TAG_ID]: (state, payload) => {
      // state.billTag = payload;
      // user: 태그는 user: 제외하고 표출, 이를 위해 tagKeyText 필드 추가 _ 고객요청
      state.billTag = payload.map((item) => {
        if (item.tagKeyVal.startsWith('user:')) {
          item.tagKeyText = item.tagKeyVal.replace('user:', '');
        } else {
          item.tagKeyText = item.tagKeyVal;
        }
        return item;
      });
    },
    [types.SET_SVC_CTGRY_LIST]: (state, payload) => {
      state.svcCtgryList = payload;
    },
    [types.SET_PST_BILL_LIST]: (state, payload) => {
      state.pstBillList = payload;
    },
  },
};
