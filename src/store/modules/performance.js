import moment from 'moment';
import performanceService from '@/services/performanceService';

const types = {
  SET_FILTER: 'SET_FILTER',
  SET_PARAM: 'SET_PARAM',
  SET_ISSEARCH: 'SET_ISSEARCH',
  SET_SELECTED_FILTER: 'SET_SELECTED_FILTER',
  SET_SELECTED_CUST_CORP_IDS: 'SET_SELECTED_CUST_CORP_IDS',
  SET_SVC_GRP_SELECTED_CUST_CORP_IDS: 'SET_SVC_GRP_SELECTED_CUST_CORP_IDS',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_UPDATE_USAGE_CHART: 'SET_UPDATE_USAGE_CHART',
  SET_UPDATE_USAGE_GRID: 'SET_UPDATE_USAGE_GRID',
  SET_UPDATE_PERFORMANCE_CHART: 'SET_UPDATE_PERFORMANCE_CHART',
  SET_UPDATE_PERFORMANCE_GRID: 'SET_UPDATE_PERFORMANCE_GRID',
  SET_DATE_TYPE: 'SET_DATE_TYPE',
  SET_DATE_RANGE: 'SET_DATE_RANGE',
};

export default {
  namespaced: true,
  state: {
    dateRange: { startDate: null, endDate: null },
    filter: {
      cspTypCd: '',
      ctrtList: [],
      acntList: [],
      regionList: [],
      svcGrpList: [],
      svcCtrtList: [],
      tagList: [],
      anctMap: {},
    },
    updateUsageChart: false,
    updateUsageGrid: false,
    updatePerformanceChart: false,
    updatePerformanceGrid: false,
    isSearch: {},
    selectedFilter: {},
    category: '',
    selectedCustCorpIds: [],
    svcGrpSelectedCustCorpIds: [],
    dateType: '',
    defaultCspTypCd: 'AWS',
    cspReference: {
      AWS: {
        prvrCd: 'aws',
        categoryList: [
          {
            code: 'ec2',
            name: 'EC2',
            rsrcType: 'ec2',
            unitName: 'Instances',
            targetTitle: '상태',
            regionTitle: '리전',
            typeTitle: '인스턴스 유형',
            isInUsage: true,
            isInPerformance: true,
          },
          {
            code: 'rds',
            name: 'RDS',
            rsrcType: 'rds',
            unitName: 'Instances',
            targetTitle: '상태',
            regionTitle: '리전',
            typeTitle: '엔진 유형',
            isInUsage: true,
            isInPerformance: true,
          },
          {
            code: 'vpc',
            name: 'VPC',
            rsrcType: 'vpcs',
            unitName: 'VPCs',
            targetTitle: '상태',
            regionTitle: '리전',
            typeTitle: '',
            isInUsage: true,
            isInPerformance: false,
          },
          {
            code: 'ebs',
            name: 'EBS',
            rsrcType: 'ebs',
            unitName: 'Volumes',
            targetTitle: '상태',
            regionTitle: '리전',
            typeTitle: '볼륨 유형',
            isInUsage: true,
            isInPerformance: true,
          },
          {
            code: 'elb',
            name: 'ELB',
            rsrcType: 'load-balancers',
            unitName: 'ELBs',
            targetTitle: '상태',
            regionTitle: '리전',
            typeTitle: '로드밸런서 유형',
            isInUsage: true,
            isInPerformance: false,
          },
          {
            code: 'eip',
            name: 'EIP',
            rsrcType: 'eip',
            unitName: 'EIPs',
            targetTitle: '연결 상태',
            regionTitle: '리전',
            typeTitle: '',
            isInUsage: true,
            isInPerformance: false,
          },
        ],
      },
      AZURE: {
        prvrCd: 'azu',
        categoryList: [
          {
            code: 'vm',
            name: 'VM',
            rsrcType: 'Microsoft.Compute/virtualMachines',
            unitName: 'Instances',
            targetTitle: '상태',
            regionTitle: '리전',
            typeTitle: '인스턴스 유형',
            isInUsage: true,
            isInPerformance: true,
          },
          {
            code: 'sqldb',
            name: 'SQL Database',
            rsrcType: 'Microsoft.Sql/servers',
            unitName: 'Instances',
            targetTitle: '상태',
            regionTitle: '리전',
            typeTitle: '인스턴스 유형',
            isInUsage: true,
            isInPerformance: false,
          },
          {
            code: 'postgresql',
            name: 'PostgreSQL',
            rsrcType: 'Microsoft.DBforPostgreSQL/flexibleServers',
            unitName: 'Instances',
            targetTitle: '상태',
            regionTitle: '리전',
            typeTitle: '인스턴스 유형',
            isInUsage: true,
            isInPerformance: false,
          },
          {
            code: 'mysql',
            name: 'MySQL',
            rsrcType: 'Microsoft.DBforMySQL/flexibleServers',
            unitName: 'Instances',
            targetTitle: '상태',
            regionTitle: '리전',
            typeTitle: '인스턴스 유형',
            isInUsage: true,
            isInPerformance: true,
          },
          {
            code: 'mariadb',
            name: 'MariaDB',
            rsrcType: 'Microsoft.DBforMariaDB/servers',
            unitName: 'Instances',
            targetTitle: '상태',
            regionTitle: '리전',
            typeTitle: '인스턴스 유형',
            isInUsage: true,
            isInPerformance: false,
          },
          {
            code: 'storage',
            name: 'Storage Accounts',
            rsrcType: 'Microsoft.Storage/storageAccounts',
            unitName: '',
            targetTitle: '',
            regionTitle: '',
            typeTitle: '',
            isInUsage: false,
            isInPerformance: true,
          },
          {
            code: 'vnet',
            name: 'Virtual Network',
            rsrcType: 'Microsoft.Network/virtualNetworks',
            unitName: 'Virtual Networks',
            targetTitle: '프로비저닝 상태',
            regionTitle: '리전',
            typeTitle: '',
            isInUsage: true,
            isInPerformance: false,
          },
          {
            code: 'dis',
            name: 'Disk',
            rsrcType: 'Microsoft.Compute/disks',
            unitName: 'Disks',
            targetTitle: '상태',
            regionTitle: '리전',
            typeTitle: '디스크 유형',
            isInUsage: true,
            isInPerformance: false,
          },
          {
            code: 'lb',
            name: 'Load Balancer',
            rsrcType: 'Microsoft.Network/loadBalancers',
            unitName: 'Load Balancers',
            targetTitle: '프로비저닝 상태',
            regionTitle: '리전',
            typeTitle: '로드밸런서 유형',
            isInUsage: true,
            isInPerformance: false,
          },
          {
            code: 'pi',
            name: 'Public IP Address',
            rsrcType: 'Microsoft.Network/publicIPAddresses',
            unitName: 'Public IP Addresses',
            targetTitle: '연결 상태',
            regionTitle: '리전',
            typeTitle: '자원 유형',
            isInUsage: true,
            isInPerformance: false,
          },
        ],
      },
    },
  },
  getters: {
    setFilter({ commit, state }, payload) {
      commit(types.SET_FILTER, {
        ...state.filter,
        [payload.name]: payload.data,
      });
    },
    acntList: (state) => {
      return state.filter.acntList;
    },
    isSearch: (state) => {
      return state.isSearch;
    },
    selectedCustCorpIds({ commit, state }, payload) {
      return state.selectedCustCorpIds;
    },
    svcGrpSelectedCustCorpIds({ commit, state }, payload) {
      return state.svcGrpSelectedCustCorpIds;
    },
    cspTypCd: (state) => {
      return state.filter.cspTypCd || state.defaultCspTypCd;
    },
    category: (state) => {
      return state.category;
    },
  },
  actions: {
    async fetchFilter({ commit }, { cspTypCd }) {
      const response = await performanceService.fetchFilter({ cspTypCd });
      commit(types.SET_FILTER, { ...response.data.data });
      return response.data.data;
    },
    fetchParam({ commit }, { state }) {
      commit(types.SET_PARAM, state);
    },
    fetchDateType({ commit }, state) {
      commit(types.SET_DATE_TYPE, state);
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
    fetchSvcGrpSelectedCorpCustIds({ commit }, { state }) {
      commit(types.SET_SVC_GRP_SELECTED_CUST_CORP_IDS, state);
    },
    fetchCategory({ commit }, state) {
      commit(types.SET_CATEGORY, state);
    },
    fetchUpdateUsageChart({ commit }, payload) {
      commit(types.SET_UPDATE_USAGE_CHART, payload);
    },
    fetchUpdateUsageGrid({ commit }, payload) {
      commit(types.SET_UPDATE_USAGE_GRID, payload);
    },
    fetchUpdatePerformanceChart({ commit }, payload) {
      commit(types.SET_UPDATE_PERFORMANCE_CHART, payload);
    },
    fetchUpdatePerformanceGrid({ commit }, payload) {
      commit(types.SET_UPDATE_PERFORMANCE_GRID, payload);
    },
    fetchDateRange({ commit }, { state }) {
      commit(types.SET_DATE_RANGE, state);
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
    [types.SET_SVC_GRP_SELECTED_CUST_CORP_IDS]: (state, payload) => {
      if (state.svcGrpSelectedCustCorpIds !== payload) {
        state.filter.svcGrpList = [];
      }
      state.svcGrpSelectedCustCorpIds = payload;
    },
    [types.SET_CATEGORY]: (state, payload) => {
      state.category = payload;
    },
    [types.SET_UPDATE_USAGE_CHART]: (state, payload) => {
      state.updateUsageChart = payload;
    },
    [types.SET_UPDATE_USAGE_GRID]: (state, payload) => {
      state.updateUsageGrid = payload;
    },
    [types.SET_UPDATE_PERFORMANCE_CHART]: (state, payload) => {
      state.updatePerformanceChart = payload;
    },
    [types.SET_UPDATE_PERFORMANCE_GRID]: (state, payload) => {
      state.updatePerformanceGrid = payload;
    },
    [types.SET_DATE_TYPE]: (state, payload) => {
      state.dateType = payload;
    },
    [types.SET_DATE_RANGE]: (state, payload) => {
      state.dateRange = payload;
    },
  },
};
