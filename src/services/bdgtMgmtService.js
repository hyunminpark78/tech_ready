import APICaller from '@/library/APICaller';

/**f
 * 청구 - 청구 트렌드 목록조회
 */
function fetchTrend({ trendYear, tabType }) {
  return APICaller.get('/cap/v1/ocp/bill/trend', { trendYear, tabType });
}

/**
 * 청구 - 청구 트렌트 청구년 목록조회
 */
function fetchTrendYear() {
  return APICaller.get('/cap/v1/ocp/bill/trendYear');
}

/**
 * 청구 - 청구년월조회
 */
function fetchChrgYm() {
  return APICaller.get('/cap/v1/ocp/bill/chrgYm');
}

/**
 * 청구 - 청구 summary
 */
function fetchSummary({ chrgYm }) {
  return APICaller.get('/cap/v1/ocp/bill/summary', { chrgYm });
}

/**
 * 청구 - 청구목록조회
 */
function fetchBill({ chrgYm, ctrtId }) {
  return APICaller.get('/cap/v1/ocp/bill/bill', { chrgYm, ctrtId });
}

/**
 * 청구 - 청구상세조회
 */
function fetchBillDetail({ billId, ctrtId, billYm, tabType, chrgYm, tagId, svcCtgryId, cspTypCd }) {
    return APICaller.get('/cap/v1/ocp/bill/billDetail', { billId, ctrtId, billYm, tabType, chrgYm, tagId, svcCtgryId, cspTypCd });
}

/* 청구 - 청구계약목록조회 */
function fetchCtrt({ chrgYm }) {
  return APICaller.get('/cap/v1/ocp/bill/ctrt', { chrgYm });
}

/* 청구 - 청구 상세조회 필터목록조회 */
function fetchBillFilter({ ctrtId, billYm, cspTypCd }) {
  return APICaller.get('/cap/v1/ocp/bill/billFilter', { ctrtId, billYm, cspTypCd });
}

function fetchBillTag({ ctrtId, billId }) {
  return APICaller.get('/cap/v1/ocp/bill/tags', { ctrtId, billId });
}

function fetchBillAllCtrt() {
  return APICaller.get('/cap/v1/ocp/bill/all-ctrt');
}

function fetchBillTicket() {
  return APICaller.get('/cap/v1/ocp/bill/ticket');
}

function fetchPstBillList({ billId, ctrtId, billDt }) {
  return APICaller.get('/cap/v1/ocp/bill/pstHistory', { billId, ctrtId, billDt });
}

function fetchAzureBillTag({ ctrtId, billYm }) {
  return APICaller.get('/cap/v1/ocp/bill/azureTags', { ctrtId, billYm });
}

export default {
  fetchTrend,
  fetchTrendYear,
  fetchChrgYm,
  fetchSummary,
  fetchBill,
  fetchBillDetail,
  fetchCtrt,
  fetchBillFilter,
  fetchBillTag,
  fetchBillAllCtrt,
  fetchBillTicket,
  fetchPstBillList,
  fetchAzureBillTag,
};
