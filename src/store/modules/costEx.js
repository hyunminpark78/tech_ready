import costExService from '@/services/costExService';
import _ from 'lodash';
import axios from 'axios';

const types = {
  SET_FILTER_OPTIONS: 'SET_FILTER_OPTIONS',
  SET_USER_FILTER_SETTING: 'SET_USER_FILTER_SETTING',
  SET_ALL_FILTER_SETTING: 'SET_ALL_FILTER_SETTING',
  SET_SEARCH_PARAM: 'SET_SEARCH_PARAM',
  SET_COST_EXPLORER_LIST: 'SET_COST_EXPLORER_LIST',
  SET_SELECTED_TAG_KEY_FILTER: 'SET_SELECTED_TAG_KEY_FILTER',
  SET_SELECTED_TAG_VALUE_FILTER: 'SET_SELECTED_TAG_VALUE_FILTER',
  SET_SELECTED_SVC_CTGRY_FILTER: 'SET_SELECTED_SVC_CTGRY_FILTER',
  SET_SELECTED_SVC_GRP_FILTER: 'SET_SELECTED_SVC_GRP_FILTER',
  SET_IS_DOWNLOAD: 'SET_IS_DOWNLOAD',
  SET_UPDATE_ALL_FILTER_SETTING: 'SET_UPDATE_ALL_FILTER_SETTING',
  SET_UPDATE_USER_FILTER_SETTING: 'SET_UPDATE_USER_FILTER_SETTING',
  SET_UPDATE_CTRT_TAG: 'SET_UPDATE_CTRT_TAG',
};
export default {
  namespaced: true,
  state: {
    searchParam: {
      periodType: '',
      strDate: '',
      endDate: '',
      grpType: '',
      subGrpType: '',
      searchType: 'userFilter',
      userFilter: [
        {
          loginId: '',
          corpRegNo: 0,
          custCorpNm: '',
          userNm: '',
          fltSepCd: '',
          fltSepCdNm: '',
          serno: 0,
          ordNo: 0,
          filterGroup: '',
        },
      ],
      custId: [],
      customerCorporationName: [],
      contractId: [],
      serviceCode: [],
      usageAccountId: [],
      productRegion: [],
      productCode: [],
      productFamily: [],
      instanceType: [],
      usageType: [],
      physicalProcessor: [],

      productOperation: [],
      operatingSystem: [],
      databaseEngine: [],
      lineitemType: [],
      billingEntity: [],
      serviceGroupId: [],
      tagVal: [],

      meterCategory: [],
      subscriptionName: [],
      meterRegion: [],
      meterName: [],
      meterSubCategory: [],
      resourceGroup: [],

      cspTypCd: '',
    },

    defaultFilterOptions: [],
    userFilterSetting: [],
    allFilterSetting: [],
    costExplorerList: [],
    selectedTagKeyFilter: {
      contractId: '',
      filterGroup: '',
      fltSepCd: '',
      optionList: [],
      ordrNo: '',
      serno: '',
    },
    selectedTagValueFilter: {
      contractId: '',
      tagKeyId: '',
      filterGroup: '',
      fltSepCd: '',
      optionList: [],
      ordrNo: '',
      serno: '',
    },
    selectedSvcCtgryFilter: {
      contractId: '',
      filterGroup: '',
      fltSepCd: '',
      optionList: [],
      ordrNo: '',
      serno: '',
    },
    selectedSvcGrpFilter: {
      contractId: '',
      ctgryId: '',
      filterGroup: '',
      fltSepCd: '',
      optionList: [],
      ordrNo: '',
      serno: '',
    },
    isDownload: false,
    cspTypCd: '',
    defaultCspTypCd: 'AWS',
    updateAllFilterSetting: false,
    updateUserFilterSetting: false,
    updateCtrtTag: false,
  },
  getters: {
    cspTypCd: (state) => {
      return state.searchParam.cspTypCd || state.defaultCspTypCd;
    },
    filterParam: (state) => {
      if (state.searchParam['custId'].length > 0) {
        return {
          fltSepCd: 'cust_id',
          custIdList: state.searchParam['custId'].map((item) => {
            return item.id;
          }),
          contractIdList:
            state.searchParam['contractId'].length > 0
              ? state.searchParam['contractId'].map((item) => {
                  return item.id;
                })
              : [],
          cspTypCd: state.searchParam.cspTypCd,
        };
      }
      if (state.searchParam['contractId'].length > 0) {
        return {
          fltSepCd: 'contract_id',
          contractIdList: state.searchParam['contractId'].map((item) => {
            return item.id;
          }),
          cspTypCd: state.searchParam.cspTypCd,
        };
      }
      return { cspTypCd: state.searchParam.cspTypCd };
    },
  },
  actions: {
    /**
     * 기본 필터목록
     */
    async fetchDefaultFilterOptions({ commit }) {
      await costExService
        .defaultFilterOptions()
        .then((res) => {
          if (res.data) {
            commit(types.SET_FILTER_OPTIONS, res.data);
            return res.data;
          } else {
            commit(types.SET_FILTER_OPTIONS, []);
            return [];
          }
        })
        .catch((error) => {
          commit(types.SET_FILTER_OPTIONS, []);
          return [];
        });
    },

    /**
     * 사용자 계정에 저장된 필터목록
     */
    async fetchUserFilterSetting({ commit }, payload) {
      await costExService
        .userFilterSetting(payload)
        .then((res) => {
          if (res.data) {
            commit(types.SET_USER_FILTER_SETTING, res.data);
            return res.data;
          } else {
            commit(types.SET_USER_FILTER_SETTING, []);
            return [];
          }
        })
        .catch((error) => {
          commit(types.SET_USER_FILTER_SETTING, []);
          return [];
        });
    },
    /**
     * 모든 필터목록
     */
    async fetchAllFilterSetting({ commit }, payload) {
      await costExService
        .allFilterSetting(payload)
        .then((res) => {
          if (res.data) {
            commit(types.SET_ALL_FILTER_SETTING, res.data);
            return res.data;
          } else {
            commit(types.SET_ALL_FILTER_SETTING, []);
            return [];
          }
        })
        .catch((error) => {
          commit(types.SET_ALL_FILTER_SETTING, []);
          return [];
        });
    },

    /**
     * 검색조건
     */
    fetchSearchParam({ commit }, data) {
      commit(types.SET_SEARCH_PARAM, data);
    },
    fetchEmptyFilter({ commit }) {
      commit(types.SET_USER_FILTER_SETTING, []);
      commit(types.SET_ALL_FILTER_SETTING, []);
    },

    /**
     * 데이터 검색
     */
    async fetchCostExplorerList({ commit }, { cspTypCd, payload, config }) {
      let param = _.cloneDeep(payload);
      param.customerCorporationName = _.cloneDeep(param.custId);
      if (param.serviceGroupId.length > 0) {
        param.ctgryId = param.serviceGroupId[0].ctgryId;
      }
      if (_.isEmpty(param)) return [];

      await costExService
        .ocpCostExplorerDatas({ cspTypCd, payload: param, config })
        .then((res) => {
          if (res.data) {
            commit(types.SET_COST_EXPLORER_LIST, res.data);
            return res.data;
          } else {
            commit(types.SET_COST_EXPLORER_LIST, []);
            return [];
          }
        })
        .catch((e) => {
          if (!axios.isCancel(e)) {
            commit(types.SET_COST_EXPLORER_LIST, []);
            return [];
          }
        });
    },
    async fetchTagKeyFilter({ commit }, payload) {
      const response = await costExService.selectTagKeyByContractId(payload);
      if (!response.data) return null;
      const result = { ...payload, ...response.data };
      commit(types.SET_SELECTED_TAG_KEY_FILTER, result);
      return result;
    },
    async fetchTagValueFilter({ commit }, payload) {
      const response = await costExService.selectValueByTagKey(payload);
      if (!response.data) return null;
      const result = { ...payload, ...response.data };
      commit(types.SET_SELECTED_TAG_VALUE_FILTER, result);
      return result;
    },
    async fetchSvcCtgryFilter({ commit }, payload) {
      const response = await costExService.selectSvcCtgryByContractId(payload);
      if (!response.data) return null;
      const result = { ...payload, ...response.data };
      commit(types.SET_SELECTED_SVC_CTGRY_FILTER, result);
      return result;
    },
    async fetchSvcGrpFilter({ commit }, payload) {
      const response = await costExService.selectSvcGrpByCtgryId(payload);
      if (!response.data) return null;
      const result = { ...payload, ...response.data };
      commit(types.SET_SELECTED_SVC_GRP_FILTER, result);
      return result;
    },
    fetchIsDownload({ commit }, { isDownload }) {
      commit(types.SET_IS_DOWNLOAD, isDownload);
    },
    /**
     * Azure Cost Explorer
     */
    /**
     * 사용자 계정에 저장된 필터목록
     */
    async fetchAzureUserFilterSetting({ commit }, payload) {
      await costExService
        .userAzureFilterSetting(payload)
        .then((res) => {
          if (res.data) {
            commit(types.SET_USER_FILTER_SETTING, res.data);
            return res.data;
          } else {
            commit(types.SET_USER_FILTER_SETTING, []);
            return [];
          }
        })
        .catch((error) => {
          commit(types.SET_USER_FILTER_SETTING, []);
          return [];
        });
    },
    /**
     * 모든 필터목록
     */
    async fetchAzureAllFilterSetting({ commit }, payload) {
      await costExService
        .allAzureFilterSetting(payload)
        .then((res) => {
          if (res.data) {
            commit(types.SET_ALL_FILTER_SETTING, res.data);
            return res.data;
          } else {
            commit(types.SET_ALL_FILTER_SETTING, []);
            return [];
          }
        })
        .catch((error) => {
          commit(types.SET_ALL_FILTER_SETTING, []);
          return [];
        });
    },
    /**
     * 데이터 검색
     */
    async fetchAzureCostExplorerList({ commit }, { payload, config }) {
      let param = _.cloneDeep(payload);
      param.customerCorporationName = _.cloneDeep(param.custId);
      if (param.serviceGroupId.length > 0) {
        param.ctgryId = param.serviceGroupId[0].ctgryId;
      }
      if (_.isEmpty(param)) return [];

      await costExService
        .ocpAzureCostExplorerDatas(param, config)
        .then((res) => {
          if (res.data) {
            commit(types.SET_COST_EXPLORER_LIST, res.data);
            return res.data;
          } else {
            commit(types.SET_COST_EXPLORER_LIST, []);
            return [];
          }
        })
        .catch((e) => {
          if (!axios.isCancel(e)) {
            commit(types.SET_COST_EXPLORER_LIST, []);
            return [];
          }
        });
    },
    async fetchAzureTagKeyFilter({ commit }, payload) {
      const response = await costExService.selectAzureTagKeyByContractId(payload);
      if (!response.data) return null;
      const result = { ...payload, ...response.data };
      commit(types.SET_SELECTED_TAG_KEY_FILTER, result);
      return result;
    },
    async fetchAzureTagValueFilter({ commit }, payload) {
      const response = await costExService.selectAzureValueByTagKey(payload);
      if (!response.data) return null;
      const result = { ...payload, ...response.data };
      commit(types.SET_SELECTED_TAG_VALUE_FILTER, result);
      return result;
    },
  },
  mutations: {
    [types.SET_FILTER_OPTIONS]: (state, payload) => {
      state.defaultFilterOptions = payload;
    },
    [types.SET_USER_FILTER_SETTING]: (state, payload) => {
      state.userFilterSetting = payload;
    },
    [types.SET_ALL_FILTER_SETTING]: (state, payload) => {
      state.allFilterSetting = payload;
    },
    [types.SET_SEARCH_PARAM]: (state, payload) => {
      state.searchParam = payload;
    },
    [types.SET_COST_EXPLORER_LIST]: (state, payload) => {
      state.costExplorerList = payload;
    },
    [types.SET_SELECTED_TAG_KEY_FILTER]: (state, payload) => {
      state.selectedTagKeyFilter = payload;
      // user: 태그는 user: 제외하고 표출, 이를 위해 tagKeyText 필드 추가 _ 고객요청
      state.selectedTagKeyFilter.optionList = state.selectedTagKeyFilter.optionList.map((item) => {
        if (item.name.includes('user:')) {
          item.name = item.name.replace('user:', '');
        }
        return item;
      });
    },
    [types.SET_SELECTED_TAG_VALUE_FILTER]: (state, payload) => {
      state.selectedTagValueFilter = payload;
    },
    [types.SET_SELECTED_SVC_CTGRY_FILTER]: (state, payload) => {
      state.selectedSvcCtgryFilter = payload;
    },
    [types.SET_SELECTED_SVC_GRP_FILTER]: (state, payload) => {
      state.selectedSvcGrpFilter = payload;
    },
    [types.SET_IS_DOWNLOAD]: (state, payload) => {
      state.isDownload = payload;
    },
    [types.SET_UPDATE_ALL_FILTER_SETTING]: (state, payload) => {
      state.updateAllFilterSetting = payload;
    },
    [types.SET_UPDATE_USER_FILTER_SETTING]: (state, payload) => {
      state.updateUserFilterSetting = payload;
    },
    [types.SET_UPDATE_CTRT_TAG]: (state, payload) => {
      state.updateCtrtTag = payload;
    },
  },
};

export { types };
