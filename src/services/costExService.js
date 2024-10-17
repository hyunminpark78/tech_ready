import APICaller from '@/library/APICaller';

/**
 * 기본 필터목록 조회
 */
function defaultFilterOptions() {
  return APICaller.get('/cap/v1/stat/costExplorer/ocp/aws/filters');
}

/**
 * 사용자 지정 필터목록 조회
 */
function userFilterSetting({ cspTypCd, payload, config }) {
  return APICaller.post(`/cap/v1/stat/costExplorer/ocp/${cspTypCd.toLowerCase()}/user/filters`, payload, config);
}

/**
 * 모든 필터목록 조회
 */
function allFilterSetting({ cspTypCd, payload, config }) {
  return APICaller.post(`/cap/v1/stat/costExplorer/ocp/${cspTypCd.toLowerCase()}/all/filters`, payload, config);
}

function saveUserFilter(newUserFilters) {
  return APICaller.post('/cap/v1/stat/costExplorer/ocp/aws/user/filters/save', newUserFilters);
}

function selectTagKeyByContractId({ cspTypCd, payload, config }) {
  return APICaller.get(`/cap/v1/stat/costExplorer/ocp/${cspTypCd.toLowerCase()}/user/tag/key`, payload, config);
}

function selectValueByTagKey({ cspTypCd, payload, config }) {
  return APICaller.get(`/cap/v1/stat/costExplorer/ocp/${cspTypCd.toLowerCase()}/user/tag/value`, payload, config);
}
/**
 * 그리드/차트 데이터 조회
 */
function ocpCostExplorerDatas({ cspTypCd, payload, config }) {
  return APICaller.post(`/cap/v1/stat/costExplorer/ocp/${cspTypCd.toLowerCase()}/data`, payload, config);
}

function selectSvcCtgryByContractId({ contractId }) {
  return APICaller.get('/cap/v1/stat/costExplorer/ocp/aws/user/svcCtgry', { contractId });
}

function selectSvcGrpByCtgryId({ contractId, ctgryId }) {
  return APICaller.get('/cap/v1/stat/costExplorer/ocp/aws/user/svcGrp', { contractId, ctgryId });
}

function fetchCtrt({ cspTypCd }, config) {
  return APICaller.get('/cap/v1/stat/costExplorer/ocp/aws/ctrt', { cspTypCd }, config);
}

function downloadExcelDetail(fileNm, payload) {
  return APICaller.postDownloadBlobXlsx('/usag/v1/ocp/aws/export/download', fileNm, payload);
}

/**
 * 기본 필터목록 조회
 */
function defaultAzureFilterOptions() {
  return APICaller.get('/cap/v1/stat/costExplorer/ocp/azure/filters');
}

/**
 * 사용자 지정 필터목록 조회
 */
function userAzureFilterSetting(payload, config) {
  return APICaller.post('/cap/v1/stat/costExplorer/ocp/azure/user/filters', payload, config);
}

/**
 * 모든 필터목록 조회
 */
function allAzureFilterSetting(payload, config) {
  return APICaller.post('/cap/v1/stat/costExplorer/ocp/azure/all/filters', payload, config);
}

function saveAzureUserFilter(newUserFilters) {
  return APICaller.post('/cap/v1/stat/costExplorer/ocp/azure/user/filters/save', newUserFilters);
}

function selectAzureTagKeyByContractId(payload) {
  return APICaller.get('/cap/v1/stat/costExplorer/ocp/azure/user/tag/key', payload);
}

function selectAzureValueByTagKey(payload) {
  return APICaller.get('/cap/v1/stat/costExplorer/ocp/azure/user/tag/value', payload);
}
/**
 * 그리드/차트 데이터 조회
 */
function ocpAzureCostExplorerDatas(payload, config) {
  return APICaller.post('/cap/v1/stat/costExplorer/ocp/azure/data', payload, config);
}

function selectAzureSvcCtgryByContractId({ contractId }) {
  return APICaller.get('/cap/v1/stat/costExplorer/ocp/azure/user/svcCtgry', { contractId });
}

function selectAzureSvcGrpByCtgryId({ contractId, ctgryId }) {
  return APICaller.get('/cap/v1/stat/costExplorer/ocp/azure/user/svcGrp', { contractId, ctgryId });
}

function fetchAzureCtrt({ cspTypCd }) {
  return APICaller.get('/cap/v1/stat/costExplorer/ocp/azure/ctrt', { cspTypCd });
}

function downloadAzureExcelDetail(fileNm, payload) {
  return APICaller.postDownloadBlobXlsx('/usag/v1/ocp/azure/export/download', fileNm, payload);
}

export default {
  defaultFilterOptions,
  userFilterSetting,
  ocpCostExplorerDatas,
  allFilterSetting,
  saveUserFilter,
  selectTagKeyByContractId,
  selectValueByTagKey,
  selectSvcCtgryByContractId,
  selectSvcGrpByCtgryId,
  fetchCtrt,
  downloadExcelDetail,

  defaultAzureFilterOptions,
  userAzureFilterSetting,
  ocpAzureCostExplorerDatas,
  allAzureFilterSetting,
  saveAzureUserFilter,
  selectAzureTagKeyByContractId,
  selectAzureValueByTagKey,
  selectAzureSvcCtgryByContractId,
  selectAzureSvcGrpByCtgryId,
  fetchAzureCtrt,
  downloadAzureExcelDetail,
};
