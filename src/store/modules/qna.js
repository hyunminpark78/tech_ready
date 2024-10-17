import boardService from '@/services/boardService';

const defaultState = {
  list: [],
  // paging: {
  //   pageSize: 10,
  //   sortKey: 'frstRegDtm',
  //   sortVal: 'D',
  // },
  // searchString: '',
  // totalCount: 0,
  // list: [],
  // details: {
  //   bbmId: '',
  //   titNm: '',
  //   bbmCont: '',
  //   files: [],
  // },
};

const types = {
  // SET_SEARCH_STRING: 'SET_SEARCH_STRING',
  // SET_UNREAD: 'SET_UNREAD',
  // SET_NOTICES_COUNT: 'SET_NOTICES_COUNT',
  // SET_NOTICES: 'SET_NOTICES',
  // SET_NOTICE: 'SET_NOTICE',
  SET_QNA: 'SET_QNA',
};

export default {
  namespaced: true,
  state: {
    list: defaultState.list,
    // unread: {},
    // paging: defaultState.paging,
    // searchString: defaultState.searchString,
    // totalCount: defaultState.totalCount,
    // list: defaultState.list,
    // details: defaultState.details,
  },
  getters: {
    // details: ({ details }) => ({
    //   title: details.titNm,
    //   viewCount: details.viewCnt,
    //   createdAt: details.frstRegDtm,
    //   content: details.bbmCont,
    //   files: details.files,
    // }),
    // previous: ({ details }) => details.previous,
    // next: ({ details }) => details.next,
  },
  actions: {
    // setSearchString({ commit }, payload) {
    //   commit(types.SET_SEARCH_STRING, payload);
    // },
    // async fetchNew({ commit }) {
    //   const response = await boardService.fetchNewNotice();
    //   commit(types.SET_UNREAD, response.data.data);
    // },
    // async fetchList({ commit }, { searching, paging }) {
    //   const response = await Promise.all([
    //     boardService.fetchPinnedNotices({ searching }),
    //     boardService.fetchNotices({ searching, paging }),
    //   ]);
    //   commit(types.SET_NOTICES_COUNT, response[1].data.data.totalCnt);
    //   commit(types.SET_NOTICES, [
    //     ...response[0].data.data.map((datum) => ({ ...datum, pinned: true })),
    //     ...response[1].data.data.data.map((datum) => ({ ...datum, pinned: false })),
    //   ]);
    // },
    // async fetchDetails({ commit }, boardId) {
    //   commit(types.SET_NOTICE, defaultState.details);
    //   const response = await boardService.fetchNotice(boardId);
    //   commit(types.SET_NOTICE, response.data.data);
    // },
    async fetchFreshDesk({ commit }) {
      const response = await boardService.fetchFreshDesk();
      console.log(response);
      //commit(types.SET_QNA, response.data.data);
    },
  },
  mutations: {
    // [types.SET_SEARCH_STRING]: (state, payload) => {
    //   state.searchString = payload;
    // },
    // [types.SET_UNREAD]: (state, payload) => {
    //   state.unread = payload;
    // },
    // [types.SET_NOTICES_COUNT]: (state, payload) => {
    //   state.totalCount = payload;
    // },
    // [types.SET_NOTICES]: (state, payload) => {
    //   state.list = payload;
    // },
    // [types.SET_NOTICE]: (state, payload) => {
    //   state.details = payload;
    // },
  },
};
