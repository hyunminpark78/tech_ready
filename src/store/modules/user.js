import userService from '@/services/userService';

const defaultState = {
  ssoStatus: [
    { name: 'OpsNow', available: false },
    { name: 'CSMP', available: false },
    { name: 'MEC', available: false },
  ],
};

const types = {
  SET_SSO_STATUS: 'SET_SSO_STATUS',
};

export default {
  namespaced: true,
  state: {
    ssoStatus: defaultState.ssoStatus,
  },
  getters: {},
  actions: {
    async bootstrap({ commit }) {
      const response = await userService.fetchCategory({ ctrtId: 'CTRT_ALL' });
      const availableCategories = response.data.data.filter((d) => d.ctgryIdCnt > 0);
      commit(types.SET_SSO_STATUS, [
        { name: 'OpsNow', available: !!window.keycloak.idTokenParsed.opsnow_id },
        { name: 'CSMP', available: !!availableCategories.find((c) => c.ctgryNm === 'Security') },
        { name: 'MBMP', available: !!availableCategories.find((c) => c.ctgryNm === 'MEC') },
      ]);
    },
  },
  mutations: {
    [types.SET_SSO_STATUS]: (state, payload) => {
      state.ssoStatus = payload;
    },
  },
};
