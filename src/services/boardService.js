import APICaller from '@/library/APICaller';

function fetchNewNotice() {
  return APICaller.get('/cap/v1/ocp/support/notices/new');
}

function fetchPinnedNotices({ searching }) {
  return APICaller.get('/cap/v1/ocp/support/notices/pinned', {
    ...searching,
  });
}
function fetchNotices({ searching, paging }) {
  return APICaller.get('/cap/v1/ocp/support/notices', {
    ...searching,
    ...paging,
  });
}

function fetchNotice(boardId) {
  return APICaller.get(`/cap/v1/ocp/support/notices/${boardId}`);
}

function fetchFaqCategories() {
  return APICaller.get('/cap/v1/ocp/support/faqs/categories');
}

function fetchFaqs({ bbmSepCd, searching, paging }) {
  return APICaller.get('/cap/v1/ocp/support/faqs', {
    bbmSepCd,
    ...searching,
    ...paging,
  });
}

function fetchFaq(boardId) {
  return APICaller.get(`/cap/v1/ocp/support/faqs/${boardId}`);
}

function fetchFreshDesk() {
  return APICaller.get(`/cap/v1/ocp/support/qna`);
}

function fetchGetFreshTicket(id) {
  return APICaller.get(`/cap/v1/ocp/support/qna/${id}`);
}

function fetchGetFreshTicketReply(id) {
  return APICaller.get(`/cap/v1/ocp/support/qna/conv/${id}`);
}

function fetchCreateFreshTicket(inputForm, uploadProgress) {
  return APICaller.postUpload(`/cap/v1/ocp/support/qna/f`, inputForm, uploadProgress);
}

export default {
  fetchNewNotice,
  fetchPinnedNotices,
  fetchNotices,
  fetchNotice,
  fetchFaqCategories,
  fetchFaqs,
  fetchFaq,
  fetchFreshDesk,
  fetchCreateFreshTicket,
  fetchGetFreshTicket,
  fetchGetFreshTicketReply,
};
