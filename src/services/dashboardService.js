import APICaller from '@/library/APICaller';

/**
 * 맞춤분석 및 예측 조회
 */
function fetchExpect({ billYm }) {
  return APICaller.get('/cap/v1/ocp/dashboard/expect', { billYm });
}

/**
 * 맞춤분석 및 예측 목록 조회
 */
function fetchExpectList({ billYm }) {
  return APICaller.get('/cap/v1/ocp/dashboard/expectList', { billYm });
}

/**
 * 계약 목록조회
 */
function fetchCtrt() {
  return APICaller.get('/cap/v1/ocp/dashboard/ctrt');
}

/**
 * 카테고리 목록조회
 */
function fetchCtgry({ ctrtId, billYm }) {
  return APICaller.get('/cap/v1/ocp/dashboard/ctgry', { ctrtId, billYm });
}

/**
 * CSP 목록조회
 */
function fetchCsp({ ctrtId, billYm }) {
  return APICaller.get('/cap/v1/ocp/dashboard/csp', { ctrtId, billYm });
}

/**
 * 사용비용 날짜 및 정보조회
 */
function fetchPeriod({ ctrtId, billYm, providers }) {
  return APICaller.get('/cap/v1/ocp/dashboard/period', { ctrtId, billYm, providers });
}

/**
 * 이번달 사용비용 조회
 */
function fetchUsageCost({ ctrtId, billYm, usageType, scrType, providers }) {
  return APICaller.get('/cap/v1/ocp/dashboard/usageCost', {
    ctrtId,
    billYm,
    usageType,
    scrType,
    providers,
  });
}

/**
 * 이번달 사용비용 필터 그룹 조회
 */
function fetchUsageFilter({ ctrtId, billYm, providers }) {
  return APICaller.get('/cap/v1/ocp/dashboard/usageFilter', { ctrtId, billYm, providers });
}

/**
 * 리소스 사용현황
 */
function fetchResourceState({ ctrtId, billYm, stdDt, providers }) {
  return APICaller.get('/cap/v1/ocp/dashboard/resource', {
    ctrtId,
    billYm,
    stdDt,
    providers,
  });
}

function fetchServerUsage({ ctrtId, billYm, providers }) {
  return APICaller.get('/cap/v1/ocp/dashboard/serverUsage', { ctrtId, billYm, providers });
}

function fetchLicenseUsage({ ctrtId, billYm }) {
  return APICaller.get('/cap/v1/ocp/dashboard/licenseUsage', {
    ctrtId,
    billYm,
  });
}

function fetchDayAsetCnt({ ctrtId, stdDt }) {
  return APICaller.get('/cap/v1/ocp/dashboard/dayAsetCnt', { ctrtId, stdDt });
}

function fetchRuleCheck({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/dashboard/ruleCheck', { ctrtId });
}

function fetchAnyOpen({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/dashboard/anyOpen', { ctrtId });
}

function fetchRuleViolate({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/dashboard/ruleViolate', { ctrtId });
}

function fetchUserSensitive() {
  return APICaller.get('/cap/v1/ocp/dashboard/userSensitive');
}

function updateUserSensitive({ userSensitive }) {
  return APICaller.put('/cap/v1/ocp/dashboard/userSensitive', {
    userSensitive,
  });
}

function fetchUserArmIntvl({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/dashboard/userArmIntvl', {
    ctrtId,
  });
}

function updateUserArmIntvl(userArmIntvl) {
  return APICaller.post('/cap/v1/ocp/dashboard/userArmIntvl', userArmIntvl);
}
/**
 * 이상비용탐지
 */
function fetchAbNormalDetect({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/dashboard/anormalDetection', { ctrtId });
}

/**
 * 비용패턴분석(TOP5)
 */
function fetchAiPatternAnalysis({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/dashboard/invoiceInsight', { ctrtId });
}

/**
 * MEC 누적사용금액 조회
 */
function fetchMecAccumCost({ billYm }) {
  return APICaller.get('/cap/v1/ocp/dashboard/mecAccumCost', { billYm });
}

/**
 * MEC 데이터 사용량 조회
 */
function fetchMecDataTraffic({ billYm }) {
  return APICaller.get('/cap/v1/ocp/dashboard/mecDataTraffic', { billYm });
}

/**
 * MEC 네트워크 사용량 조회
 */
function fetchMecNetwork({ billYm }) {
  return APICaller.get('/cap/v1/ocp/dashboard/mecNetwork', { billYm });
}

/**
 * MEC App 정보조회
 */
function fetchMecApp({ billYm }) {
  return APICaller.get('/cap/v1/ocp/dashboard/mecApp', { billYm });
}

/**
 * MEC Stat 정보조회
 */
function fetchMecStat({ billYm }) {
  return APICaller.get('/cap/v1/ocp/dashboard/mecStat', { billYm });
}

/**
 * 청구리포트 접근 권한 조회
 */
function fetchAccess() {
  return APICaller.get('/cap/v1/ocp/bill/access-yn');
}

export default {
  fetchExpect,
  fetchExpectList,
  fetchCtrt,
  fetchCtgry,
  fetchCsp,
  fetchPeriod,
  fetchUsageCost,
  fetchUsageFilter,
  fetchResourceState,
  fetchServerUsage,
  fetchLicenseUsage,
  fetchDayAsetCnt,
  fetchRuleCheck,
  fetchAnyOpen,
  fetchRuleViolate,
  fetchAbNormalDetect,
  fetchAiPatternAnalysis,
  updateUserSensitive,
  fetchUserSensitive,
  updateUserArmIntvl,
  fetchUserArmIntvl,
  fetchMecAccumCost,
  fetchMecDataTraffic,
  fetchMecNetwork,
  fetchMecApp,
  fetchMecStat,
  fetchAccess,
};
