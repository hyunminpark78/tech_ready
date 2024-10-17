import APICaller from '@/library/APICaller';

function fetchFilter() {
  return APICaller.post('/cap/v1/ocp/opti/ta/cost/filter', {});
}

function fetchData(param) {
  return APICaller.post('/cap/v1/ocp/opti/ta/cost/detail', param);
}

function downloadExcel(fileNm, param) {
  return APICaller.postDownloadBlobXlsx('/cap/v1/ocp/opti/ta/cost/export', fileNm, param);
}

function fetchRsrcDetail(param) {
  return APICaller.post('/cap/v1/ocp/opti/ta/cost/rsrc/detail', param);
}
function fetchExchRate(exchgRateSrcCd, curcyNm, exchgRateStdDt) {
  return APICaller.get('/cap/v1/ocp/optiComm/exchg', { exchgRateSrcCd, curcyNm, exchgRateStdDt });
}
export default {
  fetchFilter,
  fetchData,
  downloadExcel,
  fetchRsrcDetail,
  fetchExchRate,
};
