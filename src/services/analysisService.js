import APICaller from '@/library/APICaller';

/**
 * 사용분석 - 계약목록조회
 */
function fetchCtrt({ ctrtId, strDt, endDt }) {
  return APICaller.get('/cap/v1/ocp/analysis/ctrt', { ctrtId, strDt, endDt });
}

/**
 * 사용분석 - 비용패턴분석 계약목록조회
 */
function fetchAiCtrt() {
  return APICaller.get('/cap/v1/ocp/analysis/aictrt');
}

/**
 * 사용분석 - 필터목록조회
 */
function fetchFilterOptions({ ctrtId, strDt, endDt, cspList, acntList, serviceList, regionList, headerType }) {
  return APICaller.post('/cap/v1/ocp/analysis/filter', {
    ctrtId,
    strDt,
    endDt,
    cspList,
    acntList,
    serviceList,
    regionList,
    headerType,
  });
}

/**
 * 사용분석 - 사용비용조회
 */
function fetchUsage({ ctrtId, strDt, endDt, cspList, acntList, serviceList, regionList, headerType }) {
  return APICaller.post('/cap/v1/ocp/analysis/usage', {
    ctrtId,
    strDt,
    endDt,
    cspList,
    acntList,
    serviceList,
    regionList,
    headerType,
  });
}

/**
 * 비용패턴분석 (변화 TOP5)
 */
function fetchAiPatternTab({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/dashboard/invoiceInsight', { ctrtId });
}

/**
 * 비용패턴분석 그리드
 */
function fetchAiPatternDetail({ ctrtId, headerType }) {
  return APICaller.get('/cap/v1/ocp/dashboard/invoiceInsightPca', { ctrtId, headerType });
}

/**
 * 이상비용탐지 그리드
 */
function fetchFraudDetection({ ctrtId, headerType }) {
  return APICaller.get('/cap/v1/ocp/dashboard/anormalDetectionForcst', { ctrtId, headerType });
}

/**
 * 이상비용탐지 그리드
 */
function fetchFraudDetectionDetail({ ctrtId, analDt }) {
  return APICaller.get('/cap/v1/ocp/dashboard/anormalDetectionPop', { ctrtId, analDt });
}

/**
 * 이상비용탐지 그리드
 */
function fetchFraudDetectionDetailGrid({ ctrtId, analDt }) {
  return APICaller.get('/cap/v1/ocp/dashboard/anormalDetectionDetail', { ctrtId, analDt });
}

export default {
  fetchCtrt,
  fetchAiCtrt,
  fetchFilterOptions,
  fetchUsage,
  fetchAiPatternTab,
  fetchAiPatternDetail,
  fetchFraudDetection,
  fetchFraudDetectionDetail,
  fetchFraudDetectionDetailGrid,
};
