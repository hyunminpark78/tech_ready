import APICaller from '@/library/APICaller';

function fetchSpotGPUDefault(param) {
  return APICaller.post(`/cap/v1/ocp/spot/gpu/default`, param);
}

function fetchSpotGpuTopFilter({ cspTypCd }) {
  return APICaller.get('/cap/v1/ocp/resource/comm/filter', { cspTypCd });
}

function fetchSpotGpuInstanceTypeTable(param) {
  return APICaller.post('/cap/v1/ocp/spot/gpu/data', param);
}

export default {
  fetchSpotGPUDefault,
  fetchSpotGpuTopFilter,
  fetchSpotGpuInstanceTypeTable
};
