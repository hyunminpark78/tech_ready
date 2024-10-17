import boardService from '@/services/boardService';
import * as _ from 'lodash';
import { cloneDeep } from 'lodash';

const defaultState = {
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
  qnaList: [],
  dspQnaList: [],
  qnaStatus: { total: 0, ready: 0, complete: 0 },
  qnaDetail: { status: 0, createdAt: 0 },
  qnaReplys: [],
  qnaTotalCount: 0,
  qnaPaging: {
    pageSize: 10,
  },
};

const types = {
  SET_SEARCH_STRING: 'SET_SEARCH_STRING',
  SET_UNREAD: 'SET_UNREAD',
  SET_NOTICES_COUNT: 'SET_NOTICES_COUNT',
  SET_NOTICES: 'SET_NOTICES',
  SET_NOTICE: 'SET_NOTICE',
  SET_QNA: 'SET_QNA',
  SET_QNA_STATUS: 'SET_QNA_STATUS',
  SET_QNA_DETAIL: 'SET_QNA_DETAIL',
  SET_QNA_DETAIL_PAGE: 'SET_QNA_DETAIL_PAGE',
  SET_QNA_REPLY: 'SET_QNA_REPLY',
  SET_QNA_TOTAL_COUNT: 'SET_QNA_TOTAL_COUNT',
};

export default {
  namespaced: true,
  state: {
    unread: {},
    paging: defaultState.paging,
    searchString: defaultState.searchString,
    totalCount: defaultState.totalCount,
    list: defaultState.list,
    details: defaultState.details,
    qnaList: defaultState.qnaList,
    qnaReplys: defaultState.qnaReplys,
    qnaDetail: defaultState.qnaDetail,
    qnaTotalCount: defaultState.qnaTotalCount,
    qnaPaging: defaultState.qnaPaging,
    dspQnaList: defaultState.dspQnaList,
    qnaStatus: defaultState.qnaStatus,
  },
  getters: {
    details: ({ details }) => ({
      title: details.titNm,
      viewCount: details.viewCnt,
      createdAt: details.frstRegDtm,
      content: details.bbmCont,
      files: details.files,
    }),
    previous: ({ details }) => details.previous,
    next: ({ details }) => details.next,
  },
  actions: {
    setSearchString({ commit }, payload) {
      commit(types.SET_SEARCH_STRING, payload);
    },
    async fetchNew({ commit }) {
      const response = await boardService.fetchNewNotice();
      commit(types.SET_UNREAD, response.data.data);
    },
    async fetchList({ commit }, { searching, paging }) {
      const response = await Promise.all([
        boardService.fetchPinnedNotices({ searching }),
        boardService.fetchNotices({ searching, paging }),
      ]);
      commit(types.SET_NOTICES_COUNT, response[1].data.data.totalCnt);
      commit(types.SET_NOTICES, [
        ...response[0].data.data.map((datum) => ({ ...datum, pinned: true })),
        ...response[1].data.data.data.map((datum) => ({ ...datum, pinned: false })),
      ]);
    },
    async fetchDetails({ commit }, boardId) {
      commit(types.SET_NOTICE, defaultState.details);
      const response = await boardService.fetchNotice(boardId);
      commit(types.SET_NOTICE, response.data.data);
    },
    async fetchGetFreshTicket({ commit }, id) {
      const response = await boardService.fetchGetFreshTicket(id);
      commit(types.SET_QNA_DETAIL, response.data.data);
    },
    async fetchGetFreshTicketReply({ commit }, id) {
      const response = await boardService.fetchGetFreshTicketReply(id);
      commit(types.SET_QNA_REPLY, response.data.data);
    },
    async fetchCreateFreshTicket({ commit }, payload) {
      const response = await boardService.fetchCreateFreshTicket(payload.inputForm, payload.uploadProgress);
    },
    async fetchFreshDesk({ commit }) {
      const response = await boardService.fetchFreshDesk();
      commit(types.SET_QNA, response.data.data);
      commit(types.SET_QNA_TOTAL_COUNT, response.data.data.length);
      if (response.data.data.length > 0) {
        commit(types.SET_QNA_DETAIL_PAGE, cloneDeep(response.data.data).splice(0, 10));
      }

      const newReg = _.filter(response.data.data, (item) => {
        return item.status === '2';
      });

      const readys = _.filter(response.data.data, (item) => {
        return item.status === '3';
      });

      const final = _.filter(response.data.data, (item) => {
        return item.status === '4';
      });

      const completes = _.filter(response.data.data, (item) => {
        return item.status === '5';
      });

      const qnaStatus = {
        total: response.data.data.length,
        newReg: newReg.length,
        ready: readys.length,
        complete: completes.length,
        final: final.length,
      };
      commit(types.SET_QNA_STATUS, qnaStatus);
    },
  },
  mutations: {
    [types.SET_SEARCH_STRING]: (state, payload) => {
      state.searchString = payload;
    },
    [types.SET_UNREAD]: (state, payload) => {
      state.unread = payload;
    },
    [types.SET_NOTICES_COUNT]: (state, payload) => {
      state.totalCount = payload;
    },
    [types.SET_NOTICES]: (state, payload) => {
      state.list = payload;
    },
    [types.SET_NOTICE]: (state, payload) => {
      state.details = payload;
    },
    [types.SET_QNA]: (state, payload) => {
      state.qnaList = payload;
    },
    [types.SET_QNA_STATUS]: (state, payload) => {
      state.qnaStatus = payload;
    },
    [types.SET_QNA_DETAIL]: (state, payload) => {
      payload.description = payload.description.replaceAll('\n', '<br>');
      state.qnaDetail = payload;
    },
    [types.SET_QNA_REPLY]: (state, payload) => {
      state.qnaReplys = payload;
    },
    [types.SET_QNA_TOTAL_COUNT]: (state, payload) => {
      state.qnaTotalCount = payload;
    },
    [types.SET_QNA_DETAIL_PAGE]: (state, payload) => {
      state.dspQnaList = payload;
    },
  },
};
