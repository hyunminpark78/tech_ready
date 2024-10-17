import APICaller from '@/library/APICaller';

function fetchFilter({ cspTypCd }) {
  return APICaller.get('/cap/v1/ocp/resource/comm/filter', { cspTypCd });
}

function fetchGridData(param, config) {
  return APICaller.post('/cap/v1/ocp/resource/performance/grid', param, config);
}

function fetchChartData(param, config) {
  return APICaller.post('/cap/v1/ocp/resource/performance/chart', param, config);
}

export default {
  fetchFilter,
  fetchGridData,
  fetchChartData,
};
