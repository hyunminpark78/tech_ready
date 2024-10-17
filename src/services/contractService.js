import APICaller from '@/library/APICaller';

/**
 * 계약 - 계약목록조회
 */
function fetchList() {
  return APICaller.get('/cap/v1/ocp/ctrt/list');
}

/**
 * 계약 - 계약상세조회
 */
function fetchDetail({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/ctrt/detail', { ctrtId });
}

/**
 * 계약 - 계약정보 summary조회
 */
function fetchSummary() {
  return APICaller.get('/cap/v1/ocp/ctrt/summary');
}

/**
 * 계약 - 계약 상태건수조회
 */
function fetchStat() {
  return APICaller.get('/cap/v1/ocp/ctrt/stat');
}

/**
 * 계약 - 계약 상품구분별 상품건수조회
 */
function fetchPrdtStat() {
  return APICaller.get('/cap/v1/ocp/ctrt/prdtStat');
}

/**
 * 계약 - 계약약정 목록 조회
 */
function fetchCtrtCmmt({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/ctrt/ctrtCmmt', { ctrtId });
}

/**
 * 계약 - 과금약정 목록 조회
 */
function fetchPricingCmmt({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/ctrt/pricingCmmt', { ctrtId });
}

/**
 * 계약 - 계약약정 통계 데이터 조회 (Coverage 팝업)
 */
function fetchCtrtCmmtStat({ ctrtId, usageType }) {
  return APICaller.get('/cap/v1/ocp/ctrt/ctrtCmmtStat', { ctrtId, usageType });
}

/**
 * 과금 약정 Coverage 팝업 정보 조회
 */
function fetchPricingCmmtStat({ ctrtId, ctrtVerVal, prdtId, pricingId }) {
  return APICaller.get('/cap/v1/ocp/ctrt/getCmmtInfo', { ctrtId, ctrtVerVal, prdtId, pricingId });
}

export default {
  fetchList,
  fetchDetail,
  fetchSummary,
  fetchStat,
  fetchPrdtStat,
  fetchCtrtCmmt,
  fetchPricingCmmt,
  fetchCtrtCmmtStat,
  fetchPricingCmmtStat,
};
