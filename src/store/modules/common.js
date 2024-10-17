import totalDashboardService from '@/services/totalDashboardService';

// window.sessionStorage에 미리 저장되어 API 호출로 인한 지연으로 인해
// 화면 렌더링 오류 및 기타 시간차로 인한 문제 방지
//
// @/src/store/index.js에 설정

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const types = {
  SET_MY_CTRTS: 'SET_MY_CTRTS',
  SET_MY_CMMTS: 'SET_MY_CMMTS',
};

export default {
  namespaced: true,
  state: {
    myCtrts: [],
    myCmmts: [],
  },
  getters: {
    getAwsCtrts(state) {
      return state.myCtrts.filter((item) => item.cspTypCd === 'AWS');
    },
    getAzureCtrts(state) {
      return state.myCtrts.filter((item) => item.cspTypCd === 'AZURE');
    },
    getGcpCtrts(state) {
      return state.myCtrts.filter((item) => item.cspTypCd === 'GCP');
    },
    getMyFirstCSP(state) {
      const cmmts = state.myCmmts.join(' ');
      if (cmmts.indexOf('SP') > -1) return 'AWS';
      if (cmmts.indexOf('Azure') > -1) return 'AZURE';
      if (cmmts.indexOf('Gcp') > -1) return 'GCP';
      return 'AWS'; //default
    },
  },
  actions: {
    async fetchMyCtrts({ commit, state }) {
      if (state.myCtrts.length > 0 && state.myCmmts.length > 0) return;
      const response = await totalDashboardService.fetchCtrt();
      if (response.data.data) {
        const myCtrts = response.data.data;
        const myCmmts = [];
        if (myCtrts.some((item) => item.cspTypCd === 'AWS')) {
          myCmmts.push('SP');
          myCmmts.push('RI');
        }
        if (myCtrts.some((item) => item.cspTypCd === 'AZURE')) {
          myCmmts.push('AzureRI');
        }
        if (myCtrts.some((item) => item.cspTypCd === 'GCP')) {
          myCmmts.push('GcpRI'); // TODO: GCP 화면 추가 시 변경 필요!
        }
        commit(types.SET_MY_CTRTS, myCtrts);
        commit(types.SET_MY_CMMTS, myCmmts);
      }
    },
    async waitGettingCtrts({ state }, count = 5, period = 500) {
      let cnt = count;
      do {
        if (state.myCmmts.length > 0) {
          break;
        }
        await delay(period);
        cnt -= 1;
      } while (cnt > 0);
    },
  },
  mutations: {
    [types.SET_MY_CTRTS]: (state, payload) => {
      state.myCtrts = payload;
    },
    [types.SET_MY_CMMTS]: (state, payload) => {
      state.myCmmts = payload;
    },
  },
};
