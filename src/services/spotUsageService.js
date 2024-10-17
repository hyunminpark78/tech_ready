import APICaller from '@/library/APICaller';

// Spot Usage Status
function fetchSpotUsageFilter(payload) {
  return APICaller.post(`/cap/v1/ocp/spotAdvisor/spotUsage/filter`, payload);
}

function fetchSpotUsageSummary({ cspTypCd, payload, config }) {
  return APICaller.post(`/cap/v1/ocp/spotAdvisor/spotUsage/${cspTypCd.toLowerCase()}/usageSummary`, payload, config);
}

function fetchDailyRate({ cspTypCd, payload, config }) {
  return APICaller.post(`/cap/v1/ocp/spotAdvisor/spotUsage/${cspTypCd.toLowerCase()}/usageTrend`, payload, config);
}

function fetchSpotUsageHistory({ cspTypCd, payload, config }) {
  return APICaller.post(`/cap/v1/ocp/spotAdvisor/spotUsage/${cspTypCd.toLowerCase()}/usageList`, payload, config);
}

function fetchSpotRequestHistory({ cspTypCd, payload, config }) {
  return APICaller.post(`/cap/v1/ocp/spotAdvisor/spotUsage/${cspTypCd.toLowerCase()}/requestList`, payload, config);
}

function getTempResponse(data) {
  let response = {
    data: data,
  };
  return new Promise((resolve) => setTimeout(() => resolve(response), 500));
}

// Spot Recommendations
function fetchSpotRecommendFilter(payload) {
  return APICaller.post(`/cap/v1/ocp/spotAdvisor/spotRecommend/filter`, payload);
}

function fetchSpotRecommendSummary({ cspTypCd, payload, config }) {
  return APICaller.post(`/cap/v1/ocp/spotAdvisor/spotRecommend/${cspTypCd.toLowerCase()}/summary`, payload, config);
}

function fetchRecommendDetailData({ cspTypCd, payload, config }) {
  return APICaller.post(`/cap/v1/ocp/spotAdvisor/spotRecommend/${cspTypCd.toLowerCase()}/list`, payload, config);
}

function fetchTagsByAccountId(param) {
  return APICaller.post(`/cap/v1/tag/by-account`, param);
}

function fetchGPUSpotCoverage(param) {
  return APICaller.post(`/cap/v1/ocp/spot/gpu/monthlyData`, param);
}

export default {
  fetchSpotUsageFilter,
  fetchSpotUsageSummary,
  fetchDailyRate,
  fetchSpotUsageHistory,
  fetchSpotRequestHistory,
  fetchSpotRecommendFilter,
  fetchSpotRecommendSummary,
  fetchRecommendDetailData,
  fetchTagsByAccountId,
  fetchGPUSpotCoverage,
};
