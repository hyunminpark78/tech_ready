import boardService from '@/services/boardService';

const defaultState = {
  categories: [],
  paging: {
    pageSize: 10,
    sortKey: 'frstRegDtm',
    sortVal: 'D',
  },
  searchString: '',
  totalCount: 0,
  list: [],
  details: {
    bbmId: '',
    titNm: '',
    bbmCont: '',
    files: [],
  },
};

const types = {
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_SEARCH_STRING: 'SET_SEARCH_STRING',
  SET_FAQS_COUNT: 'SET_FAQS_COUNT',
  SET_FAQS: 'SET_FAQS',
  SET_FAQ: 'SET_FAQ',
};

export default {
  namespaced: true,
  state: {
    categories: defaultState.categories,
    paging: defaultState.paging,
    searchString: defaultState.searchString,
    totalCount: defaultState.totalCount,
    list: defaultState.list,
    details: defaultState.details,
  },
  getters: {
    details: ({ details }) => ({
      title: details.titNm,
      viewCount: details.viewCnt,
      category: details.bbmSepCdNm,
      createdAt: details.frstRegDtm,
      content: details.bbmCont,
      files: details.files,
    }),
  },
  actions: {
    async fetchCategories({ commit }) {
      const response = await boardService.fetchFaqCategories();
      commit(
        types.SET_CATEGORIES,
        response.data.data.map((element) => ({
          value: element.code,
          text: element.name,
          enText: element.enName,
        }))
      );
    },
    setSearchString({ commit }, payload) {
      commit(types.SET_SEARCH_STRING, payload);
    },
    async fetchList({ commit }, { bbmSepCd, searching, paging }) {
      const response = await boardService.fetchFaqs({ bbmSepCd, searching, paging });
      commit(types.SET_FAQS_COUNT, response.data.data.totalCnt);
      commit(types.SET_FAQS, response.data.data.data);
    },
    async fetchDetails({ commit }, boardId) {
      commit(types.SET_FAQ, defaultState.details);
      const response = await boardService.fetchFaq(boardId);
      commit(types.SET_FAQ, response.data.data);
    },
  },
  mutations: {
    [types.SET_CATEGORIES]: (state, payload) => {
      state.categories = payload;
    },
    [types.SET_SEARCH_STRING]: (state, payload) => {
      state.searchString = payload;
    },
    [types.SET_FAQS_COUNT]: (state, payload) => {
      state.totalCount = payload;
    },
    [types.SET_FAQS]: (state, payload) => {
      state.list = payload;
    },
    [types.SET_FAQ]: (state, payload) => {
      state.details = payload;
    },
  },
};
