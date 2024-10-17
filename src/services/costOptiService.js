import APICaller from '@/library/APICaller';

function getCmmtByCSP(cmmtTypList) {
  return cmmtTypList.map((item) => (item === 'AzureRI' ? 'RI' : item));
}

/**
 * 약정 대시보드
 */

/**
 * 약정 대시보드 - 필터
 */
function fetchDashFilter({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  let uri;
  if (cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtDshbrd/filter`;
  else uri = '/cap/v1/ocp/costOpti/cmmtDshbrd/filter';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 대시보드 - 추이
 */
function fetchDashTransition({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  let uri;
  if (cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtDshbrd/transition`;
  else uri = '/cap/v1/ocp/costOpti/cmmtDshbrd/transition';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 대시보드 - 알람
 */
function fetchAlarmList({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  // let uri;
  // if (cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtDshbrd/alarm`;
  // else uri = '/cap/v1/ocp/costOpti/cmmtDshbrd/alarm';
  let uri = '/cap/v1/ocp/costOpti/cmmtDshbrd/alarm';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 대시보드 - 알람 확인
 */
function fetchAlarmCheck({ strDate, endDate, prodCdList, acntIdList }) {
  return APICaller.post('/cap/v1/ocp/costOpti/cmmtDshbrd/alarmCheck', {
    strDate,
    endDate,
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 가능 대상
 */

/**
 * 약정 가능 대상 - 약정 가능 대상 필터
 */
function fetchFilter({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  let uri;
  if (cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtPsblTgt/filter`;
  else uri = '/cap/v1/ocp/costOpti/cmmtPsblTgt/filter';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 가능 대상 - 약정 가능 대상 목록
 */
function fetchList({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  let uri;
  if (cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtPsblTgt/list`;
  else uri = '/cap/v1/ocp/costOpti/cmmtPsblTgt/list';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 대시보드 - 목록
 */
function fetchDashBoard({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  let uri;
  if (cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtDshbrd/list`;
  else uri = '/cap/v1/ocp/costOpti/cmmtDshbrd/list';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 가능 대상 - 약정 가능 대상 추이
 */
function fetchTransition({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  let uri;
  if (cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtPsblTgt/transition`;
  else uri = '/cap/v1/ocp/costOpti/cmmtPsblTgt/transition';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 가능 대상 - 약정 가능 대상 요약
 */
function fetchSummary({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  let uri;
  if (cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtPsblTgt/summary`;
  else uri = '/cap/v1/ocp/costOpti/cmmtPsblTgt/summary';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 추천
 */

/**
 * 약정 추천 - 필터
 */
function fetchRecFilter({ strDate, endDate, cmmtTypList }) {
  let uri;
  if (cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtRcmd/filter`;
  else uri = '/cap/v1/ocp/costOpti/cmmtRcmd/filter';

  const targetCmmt = cmmtTypList.map((cmmt) => (cmmt === 'AzureRI' ? 'RI' : cmmt));

  if (cmmtTypList.includes('AzureRI')) {
    return APICaller.post(uri);
  } else {
    return APICaller.post(uri, { strDate, endDate, cmmtTypList: targetCmmt });
  }
}

/**
 * 약정 추천 - 추천 옵션
 */
function fetchRecOption({ cmmtTypList, analTerm, rcmdProd, acntIdList }) {
  let uri;
  if (cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtRcmd/rcmdOpt`;
  else uri = '/cap/v1/ocp/costOpti/cmmtRcmd/rcmdOpt';

  const rcmdProdCd = rcmdProd && rcmdProd.cd;

  return APICaller.post(uri, {
    rcmdProd: rcmdProdCd,
    analTerm,
    acntIdList,
  });
}

/**
 * 약정 추천 - 추천 인벤토리
 */
function fetchRecRcmdInvn({
  cmmtTypList,
  acntIdList,
  analTerm,
  rcmdProd,
  paymentOpt,
  analTypCd,
  termLen,
  offrClss,
  scopeTyp,
  cmmtTerm,
}) {
  let uri;
  if (cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtRcmd/rcmdInvn`;
  else uri = '/cap/v1/ocp/costOpti/cmmtRcmd/rcmdInvn';

  const rcmdProdCd = rcmdProd && rcmdProd.cd;

  const defaultParams = {
    acntIdList,
    analTerm,
    rcmdProd: rcmdProdCd,
  };

  if (cmmtTypList.includes('AzureRI')) {
    return APICaller.post(uri, {
      ...defaultParams,
      scopeTyp,
      cmmtTerm,
    });
  } else {
    return APICaller.post(uri, {
      ...defaultParams,
      paymentOpt,
      termLen,
      offrClss,
      analTypCd,
    });
  }
}

/**
 * 약정 현황
 */

/**
 * 약정 현황 - 약정 현황 필터
 */
function fetchStatFilter({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  let uri;
  if (cmmtTypList && cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtCurstat/filter`;
  else uri = '/cap/v1/ocp/costOpti/cmmtCurstat/filter';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 약정 사용 내역 요약
 */
function fetchUtlSummary({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  let uri;
  if (cmmtTypList && cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtUtl/summary`;
  else uri = '/cap/v1/ocp/costOpti/cmmtUtl/summary';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 약정 커버리지 요약
 */
function fetchCvrgSummary({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  let uri;
  if (cmmtTypList && cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtCvrg/summary`;
  else uri = '/cap/v1/ocp/costOpti/cmmtCvrg/summary';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 약정 인벤토리 요약
 */
function fetchInvnSummary({ strDate, endDate, dateTyp, cmmtTypList, acntIdList }) {
  let uri;
  if (cmmtTypList && cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtInvn/summary`;
  else uri = '/cap/v1/ocp/costOpti/cmmtInvn/summary';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    acntIdList,
  });
}

/**
 * 차트
 */
/**
 * 약정 현황 - 약정 사용 내역 추이
 */
function fetchUtlTransition({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  let uri;
  if (cmmtTypList && cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtUtl/transition`;
  else uri = '/cap/v1/ocp/costOpti/cmmtUtl/transition';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 약정 커버리지 추이
 */
function fetchCvrgTransition({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  let uri;
  if (cmmtTypList && cmmtTypList.includes('AzureRI')) uri = `/cap/v1/ocp/cmmtOpti/azure/cmmtCvrg/transition`;
  else uri = '/cap/v1/ocp/costOpti/cmmtCvrg/transition';

  return APICaller.post(uri, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 그리드
 */

/**
 * 약정 현황 - 약정 커버리지 목록 (AWS SP)
 */
function fetchCvrgListSp({ strDate, endDate, cmmtTypList, prodCdList, acntIdList }) {
  return APICaller.post('/cap/v1/ocp/costOpti/cmmtCvrg/listSp', {
    strDate,
    endDate,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 약정 커버리지 목록 (AWS RI)
 */
function fetchCvrgListRi({ strDate, endDate, cmmtTypList, prodCdList, acntIdList }) {
  return APICaller.post('/cap/v1/ocp/costOpti/cmmtCvrg/listRi', {
    strDate,
    endDate,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 약정 인벤토리 목록 (AWS SP)
 */
function fetchInvnListSp({ strDate, endDate, cmmtTypList, prodCdList, acntIdList }) {
  return APICaller.post('/cap/v1/ocp/costOpti/cmmtInvn/listSp', {
    strDate,
    endDate,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 약정 인벤토리 목록 (AWS RI)
 */
function fetchInvnListRi({ strDate, endDate, cmmtTypList, prodCdList, acntIdList }) {
  return APICaller.post('/cap/v1/ocp/costOpti/cmmtInvn/listRi', {
    strDate,
    endDate,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 약정 사용내역 목록 (AWS SP)
 */
function fetchUtlListSp({ strDate, endDate, cmmtTypList, prodCdList, acntIdList }) {
  return APICaller.post('/cap/v1/ocp/costOpti/cmmtUtl/listSp', {
    strDate,
    endDate,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 약정 사용내역 목록 (AWS RI)
 */
function fetchUtlListRi({ strDate, endDate, cmmtTypList, prodCdList, acntIdList }) {
  return APICaller.post('/cap/v1/ocp/costOpti/cmmtUtl/listRi', {
    strDate,
    endDate,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 약정 커버리지 목록 (Azure RI)
 */
function fetchCvrgListAzure({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  return APICaller.post(`/cap/v1/ocp/cmmtOpti/azure/cmmtCvrg/listRi`, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 약정 인벤토리(구매내역) 목록 (Azure RI)
 */
function fetchInvnListAzure({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  return APICaller.post(`/cap/v1/ocp/cmmtOpti/azure/cmmtInvn/listRi`, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

/**
 * 약정 현황 - 약정 사용내역 목록 (Azure RI)
 */
function fetchUtlListAzure({ strDate, endDate, dateTyp, cmmtTypList, prodCdList, acntIdList }) {
  return APICaller.post(`/cap/v1/ocp/cmmtOpti/azure/cmmtUtl/listRi`, {
    strDate,
    endDate,
    dateTyp,
    cmmtTypList: getCmmtByCSP(cmmtTypList),
    prodCdList,
    acntIdList,
  });
}

function fetchExchRate(exchgRateSrcCd, curcyNm, exchgRateStdDt) {
  return APICaller.get('/cap/v1/ocp/optiComm/exchg', { exchgRateSrcCd, curcyNm, exchgRateStdDt });
}

export default {
  // 약정 환율표기
  fetchExchRate,
  // 약정 대시보드
  fetchDashFilter,
  fetchDashBoard,
  fetchDashTransition,
  fetchAlarmList,
  fetchAlarmCheck,
  // 약정 가능 대상
  fetchFilter,
  fetchList,
  fetchTransition,
  fetchSummary,
  // 약정 추천
  fetchRecFilter,
  fetchRecOption,
  fetchRecRcmdInvn,
  // 약정 현황
  fetchStatFilter,
  fetchUtlSummary,
  fetchCvrgSummary,
  fetchInvnSummary,
  fetchUtlTransition,
  fetchCvrgTransition,
  fetchInvnListRi, // AWS
  fetchInvnListSp, // AWS
  fetchInvnListAzure, //AZURE
  fetchUtlListRi, // AWS
  fetchUtlListSp, // AWS
  fetchUtlListAzure, //AZURE
  fetchCvrgListRi, // AWS
  fetchCvrgListSp, // AWS
  fetchCvrgListAzure, // AZURE
};
