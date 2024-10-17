import resourceOptiService from '@/services/resourceOptiService';
import moment from 'moment';

const types = {
  SET_FILTER: 'SET_FILTER',
  SET_PARAM: 'SET_PARAM',
  SET_LIST: 'SET_LIST',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_UPDATE_UNUSED_RESOURCE_CHART: 'SET_UPDATE_UNUSED_RESOURCE_CHART',
  SET_UPDATE_UNUSED_RESOURCE_GRID: 'SET_UPDATE_UNUSED_RESOURCE_GRID',
  SET_UPDATE_RIGHTSIZING_CHART: 'SET_UPDATE_RIGHTSIZING_CHART',
  SET_UPDATE_RIGHTSIZING_GRID: 'SET_UPDATE_RIGHTSIZING_GRID',
  SET_ISSEARCH: 'SET_ISSEARCH',
  SET_PREDICT_COVERAGE: 'SET_PREDICT_COVERAGE',
  SET_CHART_DATA: 'SET_CHART_DATA',
  SET_SELECTED_FILTER: 'SET_SELECTED_FILTER',
  SET_SELECTED_CUST_CORP_IDS: 'SET_SELECTED_CUST_CORP_IDS',
  SET_SVC_GRP_SELECTED_CUST_CORP_IDS: 'SET_SVC_GRP_SELECTED_CUST_CORP_IDS',
  SET_EXCLUDED_DATA: 'SET_EXCLUDED_DATA',
  SET_UNUSED_COST: 'SET_UNUSED_COST',
  SET_RS_COST: 'SET_RS_COST',
  SET_SPOT_INSTANCE_SAVING_STATUS_DATA: 'SET_SPOT_INSTANCE_SAVING_STATUS_DATA',
  SET_MONTHLY_SAVING_DATA: 'SET_MONTHLY_SAVING_DATA',
  SET_RECOMMEND_DETAIL_DATA: 'SET_RECOMMEND_DETAIL_DATA',
  SET_RECOMMEND_GPU_DETAIL_DATA: 'SET_RECOMMEND_GPU_DETAIL_DATA',
  SET_SCHEDULE_CHART_DATA: 'SET_SCHEDULE_CHART_DATA',
  SET_SCHEDULE_GPU_CHART_DATA: 'SET_SCHEDULE_GPU_CHART_DATA',
};
export default {
  namespaced: true,
  state: {
    filter: {
      cspTypCd: '',
      dateRange: { startDate: null, endDate: null },
      ctrtList: [],
      acntList: [],
      regionList: [],
      svcGrpList: [],
      svcCtrtList: [],
      anctMap: {},
      service: [],
      tagList: [],
      recommendScheduleList: [],
      spotUsageRange: { startDate: null, endDate: null },
      recommendTypeName: '',
    },
    filterOptions: {
      cmmts: [],
      ctrtAccounts: [],
      services: [],
    },
    predictCtrtCoverage: {},
    list: [],
    updateUnusedResourceChart: false,
    updateUnusedResourceGrid: false,
    updateRightsizingChart: false,
    updateRightsizingGrid: false,
    isSearch: {},
    category: '',
    chartData: {},
    selectedFilter: {},
    selectedCustCorpIds: [],
    svcGrpSelectedCustCorpIds: [],
    excludedData: {
      totSavgCost: 0,
    },
    unusedCost: 0,
    rsCost: 0,
    defaultCspTypCd: 'AWS',
    cspReference: {
      AWS: {
        vndr: 'aws',
        categoryList: [
          { code: 'ec2', name: 'EC2', rsrcType: 'ec2', isInUnusedResource: true, isInRightSizing: true },
          { code: 'rds', name: 'RDS', rsrcType: 'rds', isInUnusedResource: true, isInRightSizing: true },
          { code: 'ebs', name: 'EBS', rsrcType: 'ebs', isInUnusedResource: true, isInRightSizing: false },
          { code: 'elb', name: 'ELB', rsrcType: 'load-balancers', isInUnusedResource: true, isInRightSizing: false },
          { code: 'eip', name: 'EIP', rsrcType: 'eip', isInUnusedResource: true, isInRightSizing: false },
          { code: 's3', name: 'S3', rsrcType: 's3', isInUnusedResource: false, isInRightSizing: true },
        ],
      },
      AZURE: {
        vndr: 'azu',
        categoryList: [
          {
            code: 'vm',
            name: 'VM',
            rsrcType: 'Microsoft.Compute/virtualMachines',
            isInUnusedResource: true,
            isInRightSizing: true,
          },
          {
            code: 'dis',
            name: 'Disk',
            rsrcType: 'Microsoft.Compute/disks',
            isInUnusedResource: true,
            isInRightSizing: false,
          },
          {
            code: 'lb',
            name: 'Load Balancer',
            rsrcType: 'Microsoft.Network/loadBalancers',
            isInUnusedResource: true,
            isInRightSizing: false,
          },
          {
            code: 'pi',
            name: 'Public IP Address',
            rsrcType: 'Microsoft.Network/publicIPAddresses',
            isInUnusedResource: true,
            isInRightSizing: false,
          },
        ],
      },
      GCP: {},
    },
    setSpotInstanceSavingStatusData: false,
    setMonthlySavingData: false,
    setRecommendDetailData: false,
    setRecommendGPUDetailData: false,
    schedulingChartData: [],
    schedulingGPUChartData: [],
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
    filter: (state) => {
      return state.filter;
    },
    list: (state) => {
      return state.list;
    },
    isSearch: (state) => {
      return state.isSearch;
    },
    cspTypCd: (state) => {
      return state.filter.cspTypCd || state.defaultCspTypCd;
    },
    category: (state) => {
      return state.category;
    },
    chartData: (state) => {
      return state.chartData;
    },
    selectedFilter: (state) => {
      return state.selectedFilter;
    },
    setFilter({ commit, state }, payload) {
      commit(types.SET_FILTER, {
        ...state.filter,
        [payload.name]: payload.data,
      });
    },
    selectedCustCorpIds({ commit, state }, payload) {
      return state.selectedCustCorpIds;
    },
    svcGrpSelectedCustCorpIds({ commit, state }, payload) {
      return state.svcGrpSelectedCustCorpIds;
    },
    unusedCost: (state) => {
      return state.unusedCost;
    },
    rsCost: (state) => {
      return state.rsCost;
    },
  },
  actions: {
    /**
     * 계약 및 계정
     */
    async fetchFilter({ commit }, { cspTypCd }) {
      const response = await resourceOptiService.fetchFilter({ cspTypCd });
      commit(types.SET_FILTER, { ...response.data.data });
      return response.data.data;
    },
    async fetchList({ commit, state }) {
      const { strDate, endDate } = state.filter.dateRange;

      const response = await resourceOptiService.fetchList({
        strDate: moment(strDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
      });
      commit(types.SET_LIST, response.data.data);
    },
    async fetchSummary({ commit, state }) {
      const { strDate, endDate } = state.filter.dateRange;

      const response = await resourceOptiService.fetchSummary({
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
    fetchSelectedFilter({ commit }, { state }) {
      commit(types.SET_SELECTED_FILTER, state);
    },
    fetchCategory({ commit }, state) {
      commit(types.SET_CATEGORY, state);
    },
    fetchUpdateUnusedResourceChart({ commit }, payload) {
      commit(types.SET_UPDATE_UNUSED_RESOURCE_CHART, payload);
    },
    fetchUpdateUnusedResourceGrid({ commit }, payload) {
      commit(types.SET_UPDATE_UNUSED_RESOURCE_GRID, payload);
    },
    fetchUpdateRightsizingChart({ commit }, payload) {
      commit(types.SET_UPDATE_RIGHTSIZING_CHART, payload);
    },
    fetchUpdateRightsizingGrid({ commit }, payload) {
      commit(types.SET_UPDATE_RIGHTSIZING_GRID, payload);
    },
    fetchChartData({ commit }, state) {
      commit(types.SET_CHART_DATA, state);
    },
    fetchPredictCoverage({ commit }, { predictCtrtCoverage }) {
      commit(types.SET_PREDICT_COVERAGE, predictCtrtCoverage);
    },
    async fetchStatFilter({ commit }, { strDate, endDate, cmmtTyp }) {
      const response = await resourceOptiService.fetchStatFilter({
        strDate: moment(strDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
        cmmtTyp: cmmtTyp,
      });
      commit(types.SET_FILTER, { ...response.data.data });
      return response.data.data;
    },
    fetchSelectedCorpCustIds({ commit }, { state }) {
      commit(types.SET_SELECTED_CUST_CORP_IDS, state);
    },
    fetchSvcGrpSelectedCorpCustIds({ commit }, { state }) {
      commit(types.SET_SVC_GRP_SELECTED_CUST_CORP_IDS, state);
    },
    fetchExcludedData({ commit }, { state }) {
      commit(types.SET_EXCLUDED_DATA, state);
    },
    fetchUnusedCost({ commit }, state) {
      commit(types.SET_UNUSED_COST, state);
    },
    fetchRsCost({ commit }, state) {
      commit(types.SET_RS_COST, state);
    },
    fetchSpotInstanceSavingData({ commit }, payload) {
      commit(types.SET_SPOT_INSTANCE_SAVING_STATUS_DATA, payload);
    },
    fetchMonthlySavingData({ commit }, payload) {
      commit(types.SET_MONTHLY_SAVING_DATA, payload);
    },
    fetchRecommendDetailData({ commit }, payload) {
      commit(types.SET_RECOMMEND_DETAIL_DATA, payload);
    },
    fetchRecommendGPUDetailData({ commit }, payload) {
      commit(types.SET_RECOMMEND_GPU_DETAIL_DATA, payload);
    },
    fetchSchedulingChartData({ commit }, payload) {
      commit(types.SET_SCHEDULE_CHART_DATA, payload);
    },
    fetchSchedulingGPUChartData({ commit }, payload) {
      commit(types.SET_SCHEDULE_GPU_CHART_DATA, payload);
    },
  },
  mutations: {
    [types.SET_FILTER]: (state, payload) => {
      let acntIdList = [];
      let svcGrpList = [];
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

      payload.svcCtrtList.forEach((item) => {
        item.svcCtgryList.forEach((svcCtgry) => {
          svcGrpList = svcGrpList.concat(svcCtgry.svcGrpList);
        });
      });
      state.filter = { ...state.filter, ...payload };
      state.filter.acntIdList = acntIdList;
      state.filter.svcGrpList = svcGrpList;
      state.filter.anctMap = mergedMap;
    },
    [types.SET_LIST]: (state, payload) => {
      state.list = payload;
    },
    [types.SET_CATEGORY]: (state, payload) => {
      state.category = payload;
    },
    [types.SET_UPDATE_UNUSED_RESOURCE_CHART]: (state, payload) => {
      state.updateUnusedResourceChart = payload;
    },
    [types.SET_UPDATE_UNUSED_RESOURCE_GRID]: (state, payload) => {
      state.updateUnusedResourceGrid = payload;
    },
    [types.SET_UPDATE_RIGHTSIZING_CHART]: (state, payload) => {
      state.updateRightsizingChart = payload;
    },
    [types.SET_UPDATE_RIGHTSIZING_GRID]: (state, payload) => {
      state.updateRightsizingGrid = payload;
    },
    [types.SET_CHART_DATA]: (state, payload) => {
      state.chartData = payload;
    },
    [types.SET_ISSEARCH]: (state, payload) => {
      state.isSearch = payload;
    },
    [types.SET_SELECTED_FILTER]: (state, payload) => {
      state.selectedFilter = {
        ...(state.selectedFilter.service ? { service: state.selectedFilter.service } : {}),
        ...payload,
      };
    },
    [types.SET_SELECTED_CUST_CORP_IDS]: (state, payload) => {
      state.selectedCustCorpIds = payload;
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
    [types.SET_PREDICT_COVERAGE]: (state, payload) => {
      state.predictCtrtCoverage = payload;
    },
    [types.SET_EXCLUDED_DATA]: (state, payload) => {
      state.excludedData = payload;
    },
    [types.SET_UNUSED_COST]: (state, payload) => {
      state.unusedCost = payload;
    },
    [types.SET_RS_COST]: (state, payload) => {
      state.rsCost = payload;
    },
    [types.SET_SPOT_INSTANCE_SAVING_STATUS_DATA]: (state, payload) => {
      state.setSpotInstanceSavingStatusData = payload;
    },
    [types.SET_MONTHLY_SAVING_DATA]: (state, payload) => {
      state.setMonthlySavingData = payload;
    },
    [types.SET_RECOMMEND_DETAIL_DATA]: (state, payload) => {
      state.setRecommendDetailData = payload;
    },
    [types.SET_RECOMMEND_GPU_DETAIL_DATA]: (state, payload) => {
      state.setRecommendGPUDetailData = payload;
    },
    [types.SET_SCHEDULE_CHART_DATA]: (state, payload) => {
      state.schedulingChartData = payload;
    },
    [types.SET_SCHEDULE_GPU_CHART_DATA]: (state, payload) => {
      state.schedulingGPUChartData = payload;
    },
  },
};
