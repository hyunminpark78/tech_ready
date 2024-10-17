import APICaller from '@/library/APICaller';

/**
 * 계약 목록조회
 */
function fetchCtrt() {
  return APICaller.get('/cap/v1/ocp/totalDashboard/ctrt');
}

/**
 * 청구 - 청구 summary
 */
function fetchBillSummary({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/totalDashboard/bill/summary', { ctrtId });
}

/**
 * 청구 - 요금 상세
 */
function fetchBillDetail({ ctrtId, chrgYm }) {
  return APICaller.get('/cap/v1/ocp/totalDashboard/bill/detail', { ctrtId, chrgYm });
}

/**
 * 약정 현황 - 약정 사용 내역 요약
 */
function fetchCostOptiSummary({ ctrtId, strDate, endDate, cspTypCd }) {
  let uri;
  if (cspTypCd === 'AZURE') uri = `/cap/v1/ocp/totalDashboard/cmmtOpti/azure/summary`;
  else uri = '/cap/v1/ocp/totalDashboard/costOpti/summary';

  return APICaller.get(uri, { ctrtId, strDate, endDate });
}

function fetchEc2RsGrid({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/totalDashboard/rsrcOpti/ec2/grid', { ctrtId });
}

function fetchAzureVMRsGrid({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/totalDashboard/rsrcOpti/ec2/grid', { ctrtId });
}

function fetchRsOptiSummary({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/totalDashboard/rsrcOpti/summary', { ctrtId });
}

function fetchRsOptiSummaryTable({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/totalDashboard/rsrcOpti/summary/table', { ctrtId });
}

function fetchRsCurrent({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/totalDashboard/rsrcOpti/current', { ctrtId });
}

function fetchAlarmList({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/totalDashboard/alarm', { ctrtId });
}

export default {
  fetchCtrt,
  fetchBillSummary,
  fetchCostOptiSummary,
  fetchBillDetail,
  fetchRsOptiSummary,
  fetchRsOptiSummaryTable,
  fetchEc2RsGrid,
  fetchAzureVMRsGrid,
  fetchRsCurrent,
  fetchAlarmList,
};
