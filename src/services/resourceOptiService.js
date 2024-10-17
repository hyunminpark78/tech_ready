import APICaller from '@/library/APICaller';

/**
 * 자원 관련 필터 (계약 및 계정, 리전, 서비스그룹, 태그[사용량,성능])
 */
function fetchFilter({ cspTypCd }) {
  return APICaller.get('/cap/v1/ocp/resource/comm/filter', { cspTypCd });
}

/**
 * EC2: 15. rsrcopti_rs_list
 * others: 18. rsrcopti_unused_list
 */
function fetchList(param, config) {
  return APICaller.post('/cap/v1/ocp/resourceOpti/unusedResource/list', param, config);
}

/**
 * EC2: 15. rsrcopti_rs_list
 * others: 17. rsrcopti_unused_info
 */
function fetchSummary(param) {
  return APICaller.post('/cap/v1/ocp/resourceOpti/unusedResource/summary', param);
}

/**
 * 15. rsrcopti_rs_list
 */
function fetchGrid(param, config) {
  return APICaller.post('/cap/v1/ocp/resourceOpti/rightsizing/grid', param, config);
}

/**
 * $ -> ￦ 환율 적용
 */
function getExchangeRate() {
  return APICaller.post('/cap/v1/ocp/resourceOpti/cmm/exchange');
}

/**
 * 25. rsrcopti_summary
 */
function fetchRsOptiSummary(param) {
  return APICaller.post('/cap/v1/ocp/resourceOpti/cmm/summary', param);
}

/**
 * 28. rsrcopti_summary_table
 */
function fetchRsOptiSummaryTable(param) {
  return APICaller.post('/cap/v1/ocp/resourceOpti/cmm/summary/table', param);
}

/**
 * 14. rsrcopti_rs_info
 */
function fetchRsInfo(param, config) {
  return APICaller.post('/cap/v1/ocp/resourceOpti/rightsizing/info', param, config);
}
function fetchExchRate(exchgRateSrcCd, curcyNm, exchgRateStdDt) {
  return APICaller.get('/cap/v1/ocp/optiComm/exchg', { exchgRateSrcCd, curcyNm, exchgRateStdDt });
}
export default {
  fetchFilter,
  fetchList,
  fetchSummary,
  fetchGrid,
  getExchangeRate,
  fetchRsOptiSummary,
  fetchRsOptiSummaryTable,
  fetchRsInfo,
  fetchExchRate,
};
