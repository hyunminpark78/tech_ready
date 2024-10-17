import moment from 'moment';
import * as _ from 'lodash';
import totalDashboardService from '@/services/totalDashboardService';
import resourceOptiService from '@/services/resourceOptiService';
import dashboardService from '@/services/dashboardService';
import analysisService from '@/services/analysisService';

const sumValuesOfJson = (jsonObj, field) => {
  let total = 0;
  for (const key in jsonObj) {
    if (Object.prototype.hasOwnProperty.call(jsonObj, key)) {
      const childObject = jsonObj[key];
      if (Object.prototype.hasOwnProperty.call(childObject, field)) {
        total += typeof childObject[field] === 'number' ? childObject[field] : 0;
      }
    }
  }
  return total;
};

const types = {
  SET_CTRT: 'SET_CTRT',
  SET_CTRT_BY_TYPE: 'SET_CTRT_BY_TYPE',
  SET_FILTER: 'SET_FILTER',
  SET_BILL_INFO: 'SET_BILL_INFO',
  SET_NET_SAVE_COST: 'SET_NET_SAVE_COST',
  SET_DASHBOARD: 'SET_DASHBOARD',
  SET_PREDICT_COVERAGE: 'SET_PREDICT_COVERAGE',
  SET_CURRENT_COVERAGE: 'SET_CURRENT_COVERAGE',
  SET_UTILIZATION: 'SET_UTILIZATION',
  SET_ISSEARCH: 'SET_ISSEARCH',
  SET_BILL_DETAIL: 'SET_BILL_DETAIL',
  SET_TOTAL_COST: 'SET_TOTAL_COST',
  SET_RESOURCE_DATA: 'SET_RESOURCE_DATA',
  SET_EXCHANGE_RATE: 'SET_EXCHANGE_RATE',
  SET_AI_PATTERN_ANALYSIS: 'SET_AI_PATTERN_ANALYSIS',
  SET_FRAUD_DETECTION: 'SET_FRAUD_DETECTION',
  SET_ABNORMAL_DETECT: 'SET_ABNORMAL_DETECT',
  SET_RS_CURRENT: 'SET_RS_CURRENT',
  SET_EC2_RS_COST: 'SET_EC2_RS_COST', // for AWS EC2
};
export default {
  namespaced: true,
  state: {
    ctrt: [],
    awsCtrt: [],
    azureCtrt: [],
    gcpCtrt: [],
    filter: {
      contract: {},
      cspTypCd: '',
    },
    billInfo: {},
    netSaveCost: {
      sp: {},
      ri: {},
      invn: {},
      cvrg: {},
    },
    billDetail: {
      serviceInfo: {},
      acntInfo: {},
    },
    dashboard: [],
    predictCtrtCoverage: {}, // 예상 커버리지
    currentCoverage: {}, // 현재 커버리지
    utilization: {}, // 사용률
    isSearch: {},
    // 자원
    totalCost: 0,
    rsTotalCnt: 0,
    rsTotalCost: 0,
    unTotalCnt: 0,
    unTotalCost: 0,
    exchangeRate: 0,
    expctDisRate: 0,
    unusedData: {
      ebsCnt: 0,
      eipCnt: 0,
      elbCnt: 0,
      ec2Cnt: 0,
      rdsCnt: 0,
      ebsCost: 0,
      eipCost: 0,
      elbCost: 0,
      ec2Cost: 0,
      rdsCost: 0,
    },
    unusedAzureData: {
      vmCnt: 0,
      mssqlCnt: 0,
      postgresqlCnt: 0,
      mysqlCnt: 0,
      mariadbCnt: 0,
      vnetCnt: 0,
      diskCnt: 0,
      lbCnt: 0,
      ipCnt: 0,
      vmCost: 0,
      mssqlCost: 0,
      postgresqlCost: 0,
      mysqlCost: 0,
      mariadbCost: 0,
      vnetCost: 0,
      diskCost: 0,
      lbCost: 0,
      ipCost: 0,
    },
    rightsizingData: {
      ec2Cnt: 0,
      rdsCnt: 0,
      ec2Cost: 0,
      rdsCost: 0,
    },
    rightsizingAzureData: {
      vmCnt: 0,
      diskCnt: 0,
      mssqlCnt: 0,
      lbCnt: 0,
      ipCnt: 0,
      vmCost: 0,
      diskCost: 0,
      mssqlCost: 0,
      lbCost: 0,
      ipCost: 0,
    },
    rsCurrentData: [],
    // AI 비용 분석
    aiPattern: [],
    fraudDetection: [],
    abNormalDetect: [],
    ec2RsCost: 0,
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
      return [...state.ctrt];
    },
  },
  actions: {
    setFilter({ commit }, payload) {
      commit(types.SET_FILTER, payload);
    },
    fetchCtrt({ commit }, payload) {
      commit(types.SET_CTRT, payload);
    },
    async fetchBillSummary({ commit }, { ctrtId }) {
      try {
        const response = await totalDashboardService.fetchBillSummary({ ctrtId });
        commit(types.SET_BILL_INFO, response.data.data);
      } catch (error) {
        console.log('fetchBillSummary error...' + error);
      }
    },
    async fetchCostOptiSummary({ commit, state }, { ctrtId, strDate, endDate }) {
      let cspTypCd = state.filter.cspTypCd;
      const response = await totalDashboardService.fetchCostOptiSummary({ ctrtId, strDate, endDate, cspTypCd });
      commit(types.SET_NET_SAVE_COST, {
        sp: response.data.data.sp || {}, // for AWS
        ri: response.data.data.ri || {}, // for AWS or AZURE
        invn: response.data.data.invn || {}, // for AZURE
        cvrg: response.data.data.cvrg || {}, // for AZURE
      });
      commit(types.SET_DASHBOARD, response.data.data.dashboard);
    },
    fetchPredictCoverage({ commit }, { predictCtrtCoverage }) {
      commit(types.SET_PREDICT_COVERAGE, predictCtrtCoverage);
    },
    fetchCurrentCoverage({ commit }, { currentCoverage }) {
      commit(types.SET_CURRENT_COVERAGE, currentCoverage);
    },
    fetchUtilization({ commit }, { utilization }) {
      commit(types.SET_UTILIZATION, utilization);
    },
    fetchSearch({ commit }, { isSearch }) {
      commit(types.SET_ISSEARCH, isSearch);
    },
    async fetchBillDetail({ commit }, { ctrtId, chrgYm }) {
      try {
        const response = await totalDashboardService.fetchBillDetail({ ctrtId, chrgYm });
        commit(types.SET_BILL_DETAIL, response.data.data);
      } catch (e) {
        console.log('An error occurred while fetchBillDetail:', e);
        commit(types.SET_BILL_DETAIL, null);
      }
    },
    setBillDetailNull({ commit }) {
      commit(types.SET_BILL_DETAIL, null);
    },
    async fetchExchangeRate({ commit }) {
      const response = await resourceOptiService.getExchangeRate();
      commit(types.SET_EXCHANGE_RATE, response.data.data);
    },
    async fetchRsOptiSummary({ commit }, { ctrtId }) {
      const response = await totalDashboardService.fetchRsOptiSummary({ ctrtId });
      if (response.data.data.error) {
        commit(types.SET_TOTAL_COST, null);
      } else {
        commit(types.SET_TOTAL_COST, response.data.data.result.summaryTotalCost.totalCost);
      }
    },
    async fetchRsOptiSummaryTable({ commit }, { ctrtId }) {
      const response = await totalDashboardService.fetchRsOptiSummaryTable({ ctrtId });
      if (response.data.data.error) {
        commit(types.SET_RESOURCE_DATA, null);
      } else {
        commit(types.SET_RESOURCE_DATA, response.data.data.result);
      }
    },

    fetchRsrcRightsizingInit({ commit }) {
      commit(types.SET_RESOURCE_DATA, null);
      commit(types.SET_EC2_RS_COST, 0);
    },

    async fetchEc2RsGrid({ commit }, { ctrtId }) {
      const response = await totalDashboardService.fetchEc2RsGrid({ ctrtId });
      let rowData = response.data.data.result.list;

      let ec2RsCost = 0;
      rowData = rowData.filter((item) => item.rcmd !== 'Idle');
      // EC2 절감액 중 마이너스는 합산 X
      for (let item of rowData) {
        if (item.savgCostDesc >= 0) {
          ec2RsCost = ec2RsCost + item.savgCostDesc;
        }
      }
      commit(types.SET_EC2_RS_COST, ec2RsCost);
    },

    async fetchAzureVMRsGrid({ commit }, { ctrtId }) {
      const response = await totalDashboardService.fetchAzureVMRsGrid({ ctrtId });
      let rowData = response.data.data.result.list;

      let vmRsCost = 0;
      rowData = rowData.filter((item) => item.rcmd !== 'Idle');
      // VM 절감액 중 마이너스는 합산 X
      for (let item of rowData) {
        if (item.savgCostDesc >= 0) {
          vmRsCost = vmRsCost + item.savgCostDesc;
        }
      }
      commit(types.SET_EC2_RS_COST, vmRsCost);
    },
    async fetchAiPatternAnalysis({ commit }, { ctrtId }) {
      const response = await dashboardService.fetchAiPatternAnalysis({
        ctrtId,
      });
      commit(types.SET_AI_PATTERN_ANALYSIS, response.data.data);
    },
    async fetchFraudDetection({ commit }, { ctrtId, headerType }) {
      const response = await analysisService.fetchFraudDetection({ ctrtId, headerType });
      commit(types.SET_FRAUD_DETECTION, response.data.data);
    },
    async fetchAbNormalDetect({ commit }, { ctrtId }) {
      const response = await dashboardService.fetchAbNormalDetect({ ctrtId });
      commit(types.SET_ABNORMAL_DETECT, response.data.data);
    },
    async fetchRsCurrent({ commit }, { ctrtId }) {
      const response = await totalDashboardService.fetchRsCurrent({ ctrtId });
      commit(types.SET_RS_CURRENT, response.data.data);
    },
    setCtrtList({ commit }, { type }) {
      if (type === 'AWS') {
        commit(types.SET_CTRT_BY_TYPE, 'AWS');
      } else if (type === 'AZURE') {
        commit(types.SET_CTRT_BY_TYPE, 'AZURE');
      } else if (type === 'GCP') {
        commit(types.SET_CTRT_BY_TYPE, 'GCP');
      }
    },
  },
  mutations: {
    [types.SET_CTRT]: (state, payload) => {
      let ctrtList = [];
      let awsList = [];
      let azureList = [];
      let gcpList = [];
      payload.forEach((ctrt) => {
        if (state.filter.cspTypCd === ctrt.cspTypCd) {
          ctrtList = ctrtList.concat(ctrt);
        }
        if (ctrt.cspTypCd === 'AWS') {
          awsList = awsList.concat(ctrt);
        } else if (ctrt.cspTypCd === 'AZURE') {
          azureList = azureList.concat(ctrt);
        } else if (ctrt.cspTypCd === 'GCP') {
          gcpList = gcpList.concat(ctrt);
        }
      });
      state.awsCtrt = awsList;
      state.azureCtrt = azureList;
      state.gcpCtrt = gcpList;
      state.ctrt = ctrtList;
    },
    [types.SET_CTRT_BY_TYPE]: (state, type) => {
      if (type === 'AWS') {
        state.ctrt = state.awsCtrt;
      } else if (type === 'AZURE') {
        state.ctrt = state.azureCtrt;
      } else if (type === 'GCP') {
        state.ctrt = state.gcpCtrt;
      }
    },
    [types.SET_FILTER]: (state, { name, payload }) => {
      state.filter = {
        ...state.filter,
        [name]: payload,
      };
    },
    [types.SET_BILL_INFO]: (state, payload) => {
      state.billInfo = payload;
    },
    [types.SET_NET_SAVE_COST]: (state, payload) => {
      state.netSaveCost = payload;
    },
    [types.SET_DASHBOARD]: (state, payload) => {
      state.dashboard = payload;
    },
    [types.SET_PREDICT_COVERAGE]: (state, payload) => {
      state.predictCtrtCoverage = payload;
    },
    [types.SET_CURRENT_COVERAGE]: (state, payload) => {
      state.currentCoverage = payload;
    },
    [types.SET_UTILIZATION]: (state, payload) => {
      state.utilization = payload;
    },
    [types.SET_ISSEARCH]: (state, payload) => {
      state.isSearch = payload;
    },
    [types.SET_BILL_DETAIL]: (state, payload) => {
      state.billDetail = payload;
    },
    [types.SET_TOTAL_COST]: (state, payload) => {
      state.totalCost = payload;
    },
    [types.SET_EXCHANGE_RATE]: (state, payload) => {
      state.exchangeRate = payload;
    },
    [types.SET_EC2_RS_COST]: (state, payload) => {
      state.ec2RsCost = payload;
    },
    [types.SET_RESOURCE_DATA]: (state, payload) => {
      const summaryData =
        payload && Object.prototype.hasOwnProperty.call(payload, 'summaryTable') ? payload.summaryTable : null;

      switch (state.filter.cspTypCd) {
        case 'AWS':
          {
            state.unusedData.ebsCnt = 0;
            state.unusedData.eipCnt = 0;
            state.unusedData.elbCnt = 0;
            state.unusedData.ec2Cnt = 0;
            state.unusedData.rdsCnt = 0;
            state.unusedData.ebsCost = 0;
            state.unusedData.ec2Cost = 0;
            state.unusedData.eipCost = 0;
            state.unusedData.elbCost = 0;
            state.unusedData.rdsCost = 0;
            state.rightsizingData.ec2Cnt = 0;
            state.rightsizingData.rdsCnt = 0;
            state.rightsizingData.ec2Cost = 0;
            state.rightsizingData.rdsCost = 0;

            state.unTotalCost = 0;
            state.unTotalCnt = 0;
            state.rsTotalCost = 0;
            state.rsTotalCnt = 0;

            if (summaryData && summaryData.length !== 0) {
              summaryData.forEach((item) => {
                if (item.type === 'Unused ebs') {
                  state.unusedData.ebsCnt += item.unusedCnt;
                  state.unusedData.ebsCost = item.cost;
                }
                if (item.type === 'Unused eip') {
                  state.unusedData.eipCnt += item.unusedCnt;
                  state.unusedData.eipCost = item.cost;
                }
                if (item.type === 'Unused load-balancers') {
                  state.unusedData.elbCnt += item.unusedCnt;
                  state.unusedData.elbCost = item.cost;
                }
                if (item.type.includes('Right-size') && item.type.includes('ec2') && item.type.includes('Idle')) {
                  state.unusedData.ec2Cnt += item.cnt;
                  state.unusedData.ec2Cost = item.cost;
                }
                if (item.type.includes('Right-size') && item.type.includes('ec2') && !item.type.includes('Idle')) {
                  state.rightsizingData.ec2Cnt += item.rightSizingCnt;
                  /*if (item.cost >= 0) {
                    state.rightsizingData.ec2Cost += item.cost;
                  }*/
                }
                if (item.type.includes('Right-size') && item.type.includes('rds') && !item.type.includes('Idle')) {
                  state.rightsizingData.rdsCnt += item.rightSizingCnt;
                  state.rightsizingData.rdsCost += item.cost;
                }
                if (item.type.includes('Right-size') && item.type.includes('rds') && item.type.includes('Idle')) {
                  state.unusedData.rdsCnt += item.cnt;
                  state.unusedData.rdsCost = item.cost;
                }
              });

              state.rightsizingData.ec2Cost = state.ec2RsCost;

              let keysWithCost = Object.keys(state.unusedData).filter((key) => key.includes('Cost'));
              let sum = keysWithCost.reduce((acc, key) => acc + state.unusedData[key], 0);
              state.unTotalCost = sum * state.exchangeRate;

              let keysWithCnt = Object.keys(state.unusedData).filter((key) => key.includes('Cnt'));
              let cnt = keysWithCnt.reduce((acc, key) => acc + state.unusedData[key], 0);
              state.unTotalCnt = cnt;

              keysWithCost = Object.keys(state.rightsizingData).filter((key) => key.includes('Cost'));
              sum = keysWithCost.reduce((acc, key) => acc + state.rightsizingData[key], 0);
              state.rsTotalCost = sum * state.exchangeRate;

              keysWithCnt = Object.keys(state.rightsizingData).filter((key) => key.includes('Cnt'));
              cnt = keysWithCnt.reduce((acc, key) => acc + state.rightsizingData[key], 0);
              state.rsTotalCnt = cnt;
            }
          }
          break;
        case 'AZURE':
          {
            state.unusedAzureData.vmCnt = 0;
            state.unusedAzureData.mssqlCnt = 0;
            state.unusedAzureData.postgresqlCnt = 0;
            state.unusedAzureData.mysqlCnt = 0;
            state.unusedAzureData.mariadbCnt = 0;
            state.unusedAzureData.vnetCnt = 0;
            state.unusedAzureData.diskCnt = 0;
            state.unusedAzureData.lbCnt = 0;
            state.unusedAzureData.ipCnt = 0;
            state.unusedAzureData.vmCost = 0;
            state.unusedAzureData.mssqlCost = 0;
            state.unusedAzureData.postgresqlCost = 0;
            state.unusedAzureData.mysqlCost = 0;
            state.unusedAzureData.mariadbCost = 0;
            state.unusedAzureData.vnetCost = 0;
            state.unusedAzureData.diskCost = 0;
            state.unusedAzureData.lbCost = 0;
            state.unusedAzureData.ipCost = 0;

            state.rightsizingAzureData.vmCnt = 0;
            state.rightsizingAzureData.diskCnt = 0;
            state.rightsizingAzureData.mssqlCnt = 0;
            state.rightsizingAzureData.lbCnt = 0;
            state.rightsizingAzureData.ipCnt = 0;
            state.rightsizingAzureData.vmCost = 0;
            state.rightsizingAzureData.diskCost = 0;
            state.rightsizingAzureData.mssqlCost = 0;
            state.rightsizingAzureData.lbCost = 0;
            state.rightsizingAzureData.ipCost = 0;

            state.unTotalCost = 0;
            state.unTotalCnt = 0;
            state.rsTotalCost = 0;
            state.rsTotalCnt = 0;

            if (summaryData && summaryData.length !== 0) {
              summaryData.forEach((item) => {
                if (item.type === 'Unused Microsoft.Compute/virtualMachines') {
                  state.unusedAzureData.diskCnt += item.unusedCnt;
                  state.unusedAzureData.diskCost = item.cost;
                }
                if (item.type === 'Unused Microsoft.Compute/disks') {
                  state.unusedAzureData.diskCnt += item.unusedCnt;
                  state.unusedAzureData.diskCost = item.cost;
                }
                if (item.type === 'Unused Microsoft.Network/loadBalancers') {
                  state.unusedAzureData.lbCnt += item.unusedCnt;
                  state.unusedAzureData.lbCost = item.cost;
                }
                if (item.type === 'Unused Microsoft.Network/publicIPAddresses') {
                  state.unusedAzureData.ipCnt += item.unusedCnt;
                  state.unusedAzureData.ipCost = item.cost;
                }

                if (item.type.includes('Right-size') && item.type.includes('virtualMachines')) {
                  if (item.type.includes('Idle')) {
                    state.unusedAzureData.vmCnt += item.cnt;
                    state.unusedAzureData.vmCost = item.cost;
                  } else {
                    state.rightsizingAzureData.vmCnt += item.rightSizingCnt;
                    state.rightsizingAzureData.vmCost += item.cost;
                  }
                }
                if (item.type.includes('Right-size') && item.type.includes('disks')) {
                  if (item.type.includes('Idle')) {
                    state.unusedAzureData.diskCnt += item.cnt;
                    state.unusedAzureData.diskCost = item.cost;
                  } else {
                    state.rightsizingAzureData.diskCnt += item.rightSizingCnt;
                    state.rightsizingAzureData.diskCost += item.cost;
                  }
                }
                if (item.type.includes('Right-size') && item.type.includes('loadBalancers')) {
                  if (item.type.includes('Idle')) {
                    state.unusedAzureData.lbCnt += item.cnt;
                    state.unusedAzureData.lbCost = item.cost;
                  } else {
                    state.rightsizingAzureData.lbCnt += item.rightSizingCnt;
                    state.rightsizingAzureData.lbCost += item.cost;
                  }
                }
                if (item.type.includes('Right-size') && item.type.includes('publicIPAddresses')) {
                  if (item.type.includes('Idle')) {
                    state.unusedAzureData.ipCnt += item.cnt;
                    state.unusedAzureData.ipCost = item.cost;
                  } else {
                    state.rightsizingAzureData.ipCnt += item.rightSizingCnt;
                    state.rightsizingAzureData.ipCost += item.cost;
                  }
                }
              });

              let keysWithCost = Object.keys(state.unusedAzureData).filter((key) => key.includes('Cost'));
              let sum = keysWithCost.reduce((acc, key) => acc + state.unusedAzureData[key], 0);
              state.unTotalCost = sum * state.exchangeRate;

              let keysWithCnt = Object.keys(state.unusedAzureData).filter((key) => key.includes('Cnt'));
              let cnt = keysWithCnt.reduce((acc, key) => acc + state.unusedAzureData[key], 0);
              state.unTotalCnt = cnt;
              // state.unTotalCost = sumValuesOfJson(unUsedCostInfo, 'Unused') * state.exchangeRate;

              keysWithCost = Object.keys(state.rightsizingAzureData).filter((key) => key.includes('Cost'));
              sum = keysWithCost.reduce((acc, key) => acc + state.rightsizingAzureData[key], 0);
              state.rsTotalCost = sum * state.exchangeRate;

              keysWithCnt = Object.keys(state.rightsizingAzureData).filter((key) => key.includes('Cnt'));
              cnt = keysWithCnt.reduce((acc, key) => acc + state.rightsizingAzureData[key], 0);
              state.rsTotalCnt = cnt;
              // state.rsTotalCost = sumValuesOfJson(rightsizingCostInfo) * state.exchangeRate;
            }
          }
          break;
        case 'GCP':
          break;
        default:
          break;
      }
    },
    [types.SET_AI_PATTERN_ANALYSIS]: (state, payload) => {
      state.aiPattern = payload;
    },
    [types.SET_FRAUD_DETECTION]: (state, payload) => {
      state.fraudDetection = payload;
    },
    [types.SET_ABNORMAL_DETECT]: (state, payload) => {
      state.abNormalDetect = payload;
    },
    [types.SET_RS_CURRENT]: (state, payload) => {
      state.rsCurrentData = payload;
    },
  },
};
