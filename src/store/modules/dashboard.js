import * as _ from 'lodash';
import dashboardService from '@/services/dashboardService';
import moment from 'moment';

const types = {
  SET_EXPECT: 'SET_EXPECT',
  SET_EXPECT_LIST: 'SET_EXPECT_LIST',
  SET_CTRT: 'SET_CTRT',
  SET_CTGRY: 'SET_CTGRY',
  SET_CSP: 'SET_CSP',
  SET_PERIOD: 'SET_PERIOD',
  SET_USAGE_COST: 'SET_USAGE_COST',
  SET_RESOURCE_STATE: 'SET_RESOURCE_STATE',
  SET_USAGE_FILTER: 'SET_USAGE_FILTER',
  SET_SERVER_USAGE: 'SET_SERVER_USAGE',
  SET_ABNORMAL_DETECT: 'SET_ABNORMAL_DETECT',
  SET_AI_PATTERN_ANALYSIS: 'SET_AI_PATTERN_ANALYSIS',
  SET_ACTIVE_USAGE_DATA_TYPE: 'SET_ACTIVE_USAGE_DATA_TYPE',
  SET_USER_SENSITIVE: 'SET_USER_SENSITIVE',
  SET_USER_ARM_INTVL: 'SET_USER_ARM_INTVL',
  SET_FILTER: 'SET_FILTER',
  ADD_FILTER: 'ADD_FILTER',
  REMOVE_FILTER: 'REMOVE_FILTER',
  MERGE_PROVIDER_DATA: 'MERGE_PROVIDER_DATA',
  UPDATE_USER_SENSITIVE: 'UPDATE_USER_SENSITIVE',
  //CSMP
  SET_LICENSE_USAGE: 'SET_LICENSE_USAGE',
  SET_DAY_ASET: 'SET_DAY_ASET',
  SET_RULE_CHECK: 'SET_RULE_CHECK',
  SET_ANY_OPEN: 'SET_ANY_OPEN',
  SET_RULE_VIOLATE: 'SET_RULE_VIOLATE',
  SET_MEC_ACCUM_COST: 'SET_MEC_ACCUM_COST',
  SET_MEC_DATA_TRAFFIC: 'SET_MEC_DATA_TRAFFIC',
  SET_MEC_NETWORK: 'SET_MEC_NETWORK',
  SET_MEC_APP: 'SET_MEC_APP',
  SET_MEC_STAT: 'SET_MEC_STAT',
};

function toCategory(ctgry) {
  return {
    id: ctgry.ctgryId,
    name: ctgry.ctgryNm,
  };
}

function toProvider(csp) {
  return {
    accountCount: csp.acntCnt || 0,
    provider: csp.cspTypCd,
    contractIds: csp.ctrtIds,
  };
}

export default {
  namespaced: true,
  state: {
    activeUsageDataType: 'VM',
    providers: [
      {
        provider: 'AWS',
        iconSrc: {
          path: 'assets/images',
          filename: 'bi-aws',
          extension: 'svg',
        },
        accountCount: 0,
        contractIds: [],
      },
      {
        provider: 'Azure',
        iconSrc: {
          path: 'assets/images',
          filename: 'bi-azure',
          extension: 'svg',
        },
        accountCount: 0,
        contractIds: [],
      },
      {
        provider: 'NAVER CLOUD',
        iconSrc: {
          path: 'assets/images',
          filename: 'asset-3-4-x@3x',
          extension: 'png',
        },
        accountCount: 0,
        contractIds: [],
      },
      {
        provider: 'GCP',
        iconSrc: {
          path: 'assets/images',
          filename: 'bi-gcp',
          extension: 'svg',
        },
        accountCount: 0,
        contractIds: [],
      },
    ],
    expect: {},
    expectList: [],
    ctrt: [],
    ctgry: [],
    csp: [],
    period: {},
    usageCost: [],
    resourceState: [],
    serverUsage: [],
    abNormalDetect: [],
    aiPattern: [],
    usageFilter: [],
    userSensitive: '',
    userArmIntvl: {},
    filter: {
      contract: {},
      category: {},
      providers: [],
    },
    licenseUsage: {},
    dayAsetCntList: [],
    ruleCheck: {},
    anyOpen: [],
    ruleViolate: [],
    mecCost: [],
    mecDataTraffic: [],
    mecNetwork: [],
    mecApp: [],
    mecStat: [],
  },
  getters: {
    selectedContract: (state) => {
      return state.filter.contract;
    },
    availableCategories: (state) => {
      return state.ctgry.filter((item) => item.ctgryIdCnt > 0).map(toCategory);
    },
    availableProviders: (state) => {
      return state.csp.filter((item) => item.acntCnt !== undefined).map(toProvider);
    },
    getServerUsages: (state) => {
      return state.serverUsage;
    },
    selectServerUsageOptions: (state) => {
      return state.activeUsageDataType;
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
          ctrtNm: `전체 계약 (총 : ${state.ctrt.length}건)`,
        },
        ...state.ctrt,
      ];
    },
    selectUserSensitive: (state) => {
      return state.userSensitive;
    },
    selectUserArmIntvl: (state) => {
      return state.userArmIntvl;
    },
  },
  actions: {
    async fetchExpect({ commit }, { billYm }) {
      const response = await dashboardService.fetchExpect({ billYm });
      commit(types.SET_EXPECT, response.data.data);
    },
    async fetchExpectList({ commit }, { billYm }) {
      const response = await dashboardService.fetchExpectList({ billYm });
      let tmpList = _.cloneDeep(response.data.data);

      /* 최종정책: 마지막 USAGE값 ~ EXPECT VALUE값 까지 날짜 추가하며 비율에 맞게 순차적으로 채우기 (증가 감소 상관X)*/
      let usageList = _.filter(tmpList, (e) => {
        return e.costType === 'USAGE';
      });

      let expectList = _.filter(tmpList, (e) => {
        return e.costType === 'EXPECT';
      });

      let lastExpectInfo = tmpList[tmpList.length - 1];
      // 예측값이 없을경우, EXPECT LINE 삭제
      if (lastExpectInfo.accumKrwUnblendCost === undefined) {
        response.data.data = usageList;
      } else {
        // 마지막 usage 값을 최초 expect 값으로 복사
        let firstExpectInfo = _.cloneDeep(usageList[usageList.length - 1]);
        firstExpectInfo['costType'] = 'EXPECT';

        let expectLen = expectList.length;
        let expectAvg =
          (Number(lastExpectInfo.accumKrwUnblendCost) - Number(firstExpectInfo.accumKrwUnblendCost)) / expectLen;

        let accum = firstExpectInfo.accumKrwUnblendCost;
        let i = 0;

        _.map(expectList, (item) => {
          if (i < expectList.length) {
            i++;
            return (item['accumKrwUnblendCost'] = accum + expectAvg * i);
          }
        });

        response.data.data = [...usageList, firstExpectInfo, ...expectList];
      }

      commit(types.SET_EXPECT_LIST, response.data.data);
    },
    async fetchCtrt({ commit }) {
      const response = await dashboardService.fetchCtrt();
      commit(types.SET_CTRT, response.data.data);
    },
    async fetchCtgry({ commit }, { ctrtId, billYm }) {
      const response = await dashboardService.fetchCtgry({ ctrtId, billYm });

      let ctgryData = [];
      if (response.data.data.length > 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          if (response.data.data[i].ctgryNm === 'Public Cloud') {
            let obj = {
              name: 'Public Cloud',
              ctgryIdCnt: response.data.data[i].ctgryIdCnt,
              ctgryId: response.data.data[i].ctgryId,
              ctgryNm: response.data.data[i].ctgryNm,
              iconSrc: {
                path: 'assets/images',
                filename: 'ico-publiccloud',
                extension: 'svg',
              },
            };
            ctgryData.push(obj);
            // } else if (response.data.data[i].ctgryNm === 'Security') {
            //   let obj = {
            //     name: 'Security',
            //     ctgryIdCnt: response.data.data[i].ctgryIdCnt,
            //     ctgryId: response.data.data[i].ctgryId,
            //     ctgryNm: response.data.data[i].ctgryNm,
            //     iconSrc: {
            //       path: 'assets/images',
            //       filename: 'ico-security',
            //       extension: 'svg',
            //     },
            //   };
            //   ctgryData.push(obj);
          } else if (response.data.data[i].ctgryNm === 'Cloud Network') {
            let obj = {
              name: 'Cloud Network',
              ctgryIdCnt: response.data.data[i].ctgryIdCnt,
              ctgryId: response.data.data[i].ctgryId,
              ctgryNm: response.data.data[i].ctgryNm,
              iconSrc: {
                path: 'assets/images',
                filename: 'ico-dedicatedline',
                extension: 'svg',
              },
            };
            ctgryData.push(obj);
          } else if (response.data.data[i].ctgryNm === 'MEC') {
            let obj = {
              name: 'MEC',
              ctgryIdCnt: response.data.data[i].ctgryIdCnt,
              ctgryId: response.data.data[i].ctgryId,
              ctgryNm: response.data.data[i].ctgryNm,
              iconSrc: {
                path: 'assets/images',
                filename: 'ico-multicloud',
                extension: 'svg',
              },
            };
            ctgryData.push(obj);
          }
        }
      }
      commit(types.SET_CTGRY, ctgryData);
    },
    async fetchCsp({ commit }, { ctrtId, billYm }) {
      const response = await dashboardService.fetchCsp({ ctrtId, billYm });

      // FIXME: 임시 데이터 가공
      const data = response.data.data.filter((item) => item.cspTypCd);
      commit(types.SET_CSP, data);
      commit(types.MERGE_PROVIDER_DATA, data);
    },
    async fetchPeriod({ commit }, { ctrtId, billYm, providers }) {
      const response = await dashboardService.fetchPeriod({ ctrtId, billYm, providers });
      commit(types.SET_PERIOD, response.data.data);
    },
    async fetchUsageCost({ commit }, { ctrtId, billYm, usageType, scrType, providers }) {
      commit(types.SET_USAGE_COST, [{ grpId: 'init', accumKrwUnblendCost: 0 }]);
      const response = await dashboardService.fetchUsageCost({
        ctrtId,
        billYm,
        usageType,
        scrType,
        providers,
      });
      commit(types.SET_USAGE_COST, response.data.data);
    },
    async fetchUsageFilter({ commit }, { ctrtId, billYm, providers }) {
      const response = await dashboardService.fetchUsageFilter({
        ctrtId,
        billYm,
        providers,
      });
      commit(types.SET_USAGE_FILTER, response.data.data);
    },
    async fetchResourceState({ commit }, { ctrtId, billYm, stdDt, providers }) {
      const response = await dashboardService.fetchResourceState({
        ctrtId,
        billYm,
        stdDt,
        providers,
      });
      // 임시데이터
      const data = _.sortBy(response.data.data, (d) => {
        return d.rsrcCnt;
      }).reverse();

      commit(types.SET_RESOURCE_STATE, data);
    },
    async fetchServerUsage({ commit }, { ctrtId, billYm, providers }) {
      const response = await dashboardService.fetchServerUsage({
        ctrtId,
        billYm,
        providers,
      });
      commit(types.SET_SERVER_USAGE, response.data.data);
    },
    async fetchAbNormalDetect({ commit }, { ctrtId }) {
      // const data = tmpData.default.dashboard.abNormalData;
      const response = await dashboardService.fetchAbNormalDetect({ ctrtId });
      commit(types.SET_ABNORMAL_DETECT, response.data.data);
    },
    async updateUsageDataType({ commit }, payload) {
      commit(types.SET_ACTIVE_USAGE_DATA_TYPE, payload);
    },
    async fetchAiPatternAnalysis({ commit }, { ctrtId }) {
      // const data = tmpData.default.dashboard.aiPattern;
      // console.log('fetchAiPatternAnalysis', data);
      const response = await dashboardService.fetchAiPatternAnalysis({
        ctrtId,
      });
      commit(types.SET_AI_PATTERN_ANALYSIS, response.data.data);
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
    async updateUserSensitive({ commit }, userSensitive) {
      const response = await dashboardService.updateUserSensitive({
        userSensitive,
      });
      return response;
    },
    async fetchUserSensitive({ commit }) {
      const response = await dashboardService.fetchUserSensitive();
      commit(types.SET_USER_SENSITIVE, response.data.data);
    },
    async updateUserArmIntvl({ commit }, userArmIntvl) {
      const response = await dashboardService.updateUserArmIntvl(userArmIntvl);
      return response;
    },
    async fetchUserArmIntvl({ commit }, { ctrtId }) {
      const response = await dashboardService.fetchUserArmIntvl({ ctrtId });
      commit(types.SET_USER_ARM_INTVL, response.data.data);
    },
    async fetchLicenseUsage({ commit }, { ctrtId }) {
      const response = await dashboardService.fetchLicenseUsage({ ctrtId });
      commit(types.SET_LICENSE_USAGE, response.data.data);
    },
    async fetchDayAsetCnt({ commit }, { ctrtId, stdDt }) {
      const response = await dashboardService.fetchDayAsetCnt({
        ctrtId,
        stdDt,
      });
      commit(types.SET_DAY_ASET, response.data.data);
    },
    async fetchRuleCheck({ commit }, { ctrtId }) {
      const response = await dashboardService.fetchRuleCheck({ ctrtId });
      commit(types.SET_RULE_CHECK, response.data.data);
    },
    async fetchAnyOpen({ commit }, { ctrtId }) {
      const response = await dashboardService.fetchAnyOpen({ ctrtId });
      commit(types.SET_ANY_OPEN, response.data.data);
    },
    async fetchRuleViolate({ commit }, { ctrtId }) {
      const response = await dashboardService.fetchRuleViolate({ ctrtId });
      commit(types.SET_RULE_VIOLATE, response.data.data);
    },
    async fetchMecAccumCost({ commit }, { billYm }) {
      const response = await dashboardService.fetchMecAccumCost({ billYm });
      commit(types.SET_MEC_ACCUM_COST, response.data.data);
    },
    async fetchMecDataTraffic({ commit }, { billYm }) {
      const response = await dashboardService.fetchMecDataTraffic({ billYm });
      commit(types.SET_MEC_DATA_TRAFFIC, response.data.data);
    },
    async fetchMecNetwork({ commit }, { billYm }) {
      const response = await dashboardService.fetchMecNetwork({ billYm });
      commit(types.SET_MEC_NETWORK, response.data.data);
    },
    async fetchMecApp({ commit }, { billYm }) {
      const response = await dashboardService.fetchMecApp({ billYm });
      commit(types.SET_MEC_APP, response.data.data);
    },
    async fetchMecStat({ commit }, { billYm }) {
      const response = await dashboardService.fetchMecStat({ billYm });
      commit(types.SET_MEC_STAT, response.data.data);
    },
  },
  mutations: {
    [types.SET_EXPECT]: (state, payload) => {
      state.expect = payload;
    },
    [types.SET_EXPECT_LIST]: (state, payload) => {
      state.expectList = payload;
    },
    [types.SET_CTRT]: (state, payload) => {
      state.ctrt = payload;
    },
    [types.SET_CTGRY]: (state, payload) => {
      state.ctgry = payload;
    },
    [types.SET_CSP]: (state, payload) => {
      state.csp = payload;
    },
    [types.SET_PERIOD]: (state, payload) => {
      state.period = payload;
    },
    [types.SET_USAGE_COST]: (state, payload) => {
      state.usageCost = payload;
    },
    [types.SET_RESOURCE_STATE]: (state, payload) => {
      state.resourceState = payload;
    },
    [types.SET_SERVER_USAGE]: (state, payload) => {
      state.serverUsage = payload;
    },
    [types.SET_ABNORMAL_DETECT]: (state, payload) => {
      state.abNormalDetect = payload;
    },
    [types.SET_AI_PATTERN_ANALYSIS]: (state, payload) => {
      state.aiPattern = payload;
    },
    [types.SET_USAGE_FILTER]: (state, payload) => {
      state.usageFilter = payload;
    },
    [types.SET_ACTIVE_USAGE_DATA_TYPE]: (state, payload) => {
      state.activeUsageDataType = payload;
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
    [types.MERGE_PROVIDER_DATA]: (state, payload) => {
      state.providers = _({})
        .merge(_(state.providers).groupBy('provider').value(), _(payload.map(toProvider)).groupBy('provider').value())
        .values()
        .flatten()
        .value();
    },
    [types.SET_LICENSE_USAGE]: (state, payload) => {
      state.licenseUsage = payload;
    },
    [types.SET_DAY_ASET]: (state, payload) => {
      state.dayAsetCntList = payload;
    },
    [types.SET_RULE_CHECK]: (state, payload) => {
      state.ruleCheck = payload;
    },
    [types.SET_ANY_OPEN]: (state, payload) => {
      state.anyOpen = payload;
    },
    [types.SET_RULE_VIOLATE]: (state, payload) => {
      state.ruleViolate = payload;
    },
    [types.SET_USER_SENSITIVE]: (state, payload) => {
      state.userSensitive = payload;
    },
    [types.SET_USER_ARM_INTVL]: (state, payload) => {
      state.userArmIntvl = payload;
    },
    [types.SET_MEC_ACCUM_COST]: (state, payload) => {
      state.mecCost = payload;
    },
    [types.SET_MEC_DATA_TRAFFIC]: (state, payload) => {
      state.mecDataTraffic = payload;
    },
    [types.SET_MEC_NETWORK]: (state, payload) => {
      state.mecNetwork = payload;
    },
    [types.SET_MEC_APP]: (state, payload) => {
      state.mecApp = payload;
    },
    [types.SET_MEC_STAT]: (state, payload) => {
      state.mecStat = payload;
    },
  },
};
