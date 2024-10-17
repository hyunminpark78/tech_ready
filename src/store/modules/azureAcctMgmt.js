import azureAcctMgmtService from '@/services/azureAcctMgmtService';

const ResponseStatus = {
  SUCCESS: 'SUCCESS',
};

const cspTypeList = ['AWS', 'AZURE', 'GCP'];

const updateObj = function (cur, upd) {
  return Object.fromEntries(Object.entries(upd).filter(([key]) => key in cur));
};

const types = {
  SET_CSP: 'SET_CSP',
  SET_ISSEARCH: 'SET_ISSEARCH',
  SET_PARAM: 'SET_PARAM',
  SET_FILTER: 'SET_FILTER',
  SET_APPID: 'SET_APPID',
  SET_UPDATE: 'SET_UPDATE',
  SET_DELETE: 'SET_DELETE',
  SET_EVENT: 'SET_EVENT',
  SET_LIST_TYPE: 'SET_LIST_TYPE',
  SET_UPDATE_RESET: 'SET_UPDATE_RESET',
  SET_DELETE_RESET: 'SET_DELETE_RESET',
};
export default {
  namespaced: true,
  state: {
    filter: {
      searchKeyword: null,
      appId: null,
    },
    cspTypCd: 'AWS', // AWS, AZURE
    listType: 'app', // app, subs
    isSearch: false,
    appId: null,
    eventType: -1, // 0: create, 1: view, 2:update, 3:delete
    updateInfo: {
      ctrtId: null,
      appId: null,
      appDesc: null,
      clientScrVal: null,
      tenantId: null,
    },
    deleteInfo: {
      ctrtId: null,
      appId: null,
      appDesc: null,
      tenantId: null,
    },
  },
  getters: {},
  actions: {
    async addAzureApp({ commit }, { ctrtId, appId, tenantId, clientScrVal, appDesc }) {
      try {
        const response = await azureAcctMgmtService.addAzureApp({ ctrtId, appId, tenantId, clientScrVal, appDesc });
        if (response.data.code !== ResponseStatus.SUCCESS) {
          throw response.data.data.msg;
        }
        return {
          ok: true,
        };
      } catch (error) {
        console.error(error);
        return {
          error,
        };
      }
    },
    async deleteAzureApp({ commit }, { ctrtId, appId }) {
      try {
        const response = await azureAcctMgmtService.deleteAzureApp({ ctrtId, appId });
        if (response.data.code !== ResponseStatus.SUCCESS) {
          throw response.data.data.msg;
        }
        commit(types.SET_DELETE_RESET);
        return {
          ok: true,
        };
      } catch (error) {
        console.error(error);
        return {
          error,
        };
      }
    },
    async fetchAzureAppList({ commit }, { searchKeyword, appId, ctrtId }) {
      try {
        const response = await azureAcctMgmtService.fetchAzureAppList({ searchKeyword, appId, ctrtId });
        return {
          data: response.data.data || [],
        };
      } catch (error) {
        console.error(error);
        return {
          error,
        };
      } finally {
        commit(types.SET_UPDATE_RESET);
        commit(types.SET_DELETE_RESET);
      }
    },
    async fetchAzureAppSubsList({ commit }, { ctrtId, appId, tenantId, clientScrVal }) {
      try {
        const response = await azureAcctMgmtService.fetchAzureAppSubsList({ ctrtId, appId, tenantId, clientScrVal });
        if (response.data.code !== ResponseStatus.SUCCESS) {
          throw response.data.data.msg;
        }
        return {
          data: response.data.data.subscList,
        };
      } catch (error) {
        console.error(error);
        return {
          error,
        };
      }
    },
    async fetchAzureCtrtList({ commit }) {
      try {
        const response = await azureAcctMgmtService.fetchAzureCtrtList();
        if (response.data.code !== ResponseStatus.SUCCESS) {
          throw response.data.message;
        }
        return {
          data: response.data.data || [],
        };
      } catch (error) {
        console.error(error);
        return {
          error,
        };
      }
    },
    async fetchAzureSubsList({ commit }, { searchKeyword }) {
      try {
        const response = await azureAcctMgmtService.fetchAzureSubsList({ searchKeyword });
        if (response.data.code !== ResponseStatus.SUCCESS) {
          throw response.data.message;
        }
        return {
          data: response.data.data || [],
        };
      } catch (error) {
        console.error(error);
        return {
          error,
        };
      }
    },
    async updateAzureApp({ commit }, { ctrtId, appId, clientScrVal, appDesc }) {
      try {
        const response = await azureAcctMgmtService.updateAzureApp({ ctrtId, appId, clientScrVal, appDesc });
        if (response.data.code !== ResponseStatus.SUCCESS) {
          throw response.data.message;
        }
        // clientScrVal 없이 업데이트 하는 경우는
        // 오직 '비고'만 개별 업데이트 처리되는 것으로
        // 내부 변수 초기화에서 제외 처리
        if (clientScrVal && clientScrVal.length > 0) {
          commit(types.SET_UPDATE_RESET);
        }
        return {
          ok: true,
        };
      } catch (error) {
        console.error(error);
        return {
          error,
        };
      }
    },
    setCSP({ commit }, payload) {
      if (!cspTypeList.includes(payload)) {
        throw `The CSP type value is invalid: ${payload}`;
      }
      commit(types.SET_CSP, payload);
    },
    fetchSearch({ commit }) {
      commit(types.SET_ISSEARCH, true);
      setTimeout(() => {
        commit(types.SET_ISSEARCH, false);
      }, 500);
    },
    fetchParam({ commit }, payload) {
      commit(types.SET_PARAM, payload);
    },
    setEvent({ commit }, { appId, eventType }) {
      commit(types.SET_APPID, appId);
      commit(types.SET_EVENT, eventType);
    },
    setListType({ commit }, payload) {
      commit(types.SET_LIST_TYPE, payload);
    },
    setUpdateInfo({ commit }, payload) {
      commit(types.SET_EVENT, 2);
      commit(types.SET_UPDATE, payload);
    },
    setDeleteInfo({ commit }, payload) {
      commit(types.SET_EVENT, 3);
      commit(types.SET_DELETE, payload);
    },
  },
  mutations: {
    [types.SET_CSP]: (state, payload) => {
      state.cspTypCd = payload;
    },
    [types.SET_ISSEARCH]: (state, payload) => {
      state.isSearch = payload;
    },
    [types.SET_PARAM]: (state, payload) => {
      state.filter = { ...state.filter, ...payload };
    },
    [types.SET_FILTER]: (state, payload) => {
      state.filter = payload;
    },
    [types.SET_LIST]: (state, payload) => {
      state.list = payload;
    },
    [types.SET_APPID]: (state, appId) => {
      state.appId = appId;
    },
    [types.SET_EVENT]: (state, eventType) => {
      state.eventType = eventType;
    },
    [types.SET_LIST_TYPE]: (state, payload) => {
      state.listType = payload;
    },
    [types.SET_UPDATE]: (state, payload) => {
      state.updateInfo = { ...updateObj(state.updateInfo, payload) };
    },
    [types.SET_DELETE]: (state, payload) => {
      state.deleteInfo = { ...updateObj(state.deleteInfo, payload) };
    },
    [types.SET_UPDATE_RESET]: (state) => {
      state.updateInfo = { ...{ ctrtId: null, appId: null, appDesc: null, clientScrVal: null, tenantId: null } };
    },
    [types.SET_DELETE_RESET]: (state) => {
      state.deleteInfo = { ...{ ctrtId: null, appId: null, appDesc: null, tenantId: null } };
    },
  },
};
