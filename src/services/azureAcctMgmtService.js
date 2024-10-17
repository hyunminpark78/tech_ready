import APICaller from '@/library/APICaller';

/*************************************************
 *
 * 계정 등록 및 관리
 *
 *************************************************/

/**
 * Azure 애플리케이션 목록
 */
function fetchAzureAppList({ searchKeyword, appId, ctrtId }) {
  return APICaller.get(`/cap/v1/ocp/setting/azureAcctMgmt/app`, {
    searchKeyword,
    appId,
    ctrtId,
  });
}

/**
 * Azure Subscriptions 목록
 */
function fetchAzureSubsList({ searchKeyword }) {
  return APICaller.get(`/cap/v1/ocp/setting/azureAcctMgmt/subsc`, {
    searchKeyword,
  });
}

/**
 * Azure 계약 목록 조회
 */
function fetchAzureCtrtList() {
  return APICaller.get(`/cap/v1/ocp/setting/azureAcctMgmt/ctrt`);
}

/**
 * Azure 애플리케이션 Subscriptions 인증 목록 조회
 */
function fetchAzureAppSubsList({ ctrtId, appId, tenantId, clientScrVal }) {
  return APICaller.post(`/cap/v1/ocp/setting/azureAcctMgmt/app/subsc`, { ctrtId, appId, tenantId, clientScrVal });
}

/**
 * Azure 애플리케이션 등록
 */
function addAzureApp({ ctrtId, appId, tenantId, clientScrVal, appDesc }) {
  return APICaller.post(`/cap/v1/ocp/setting/azureAcctMgmt/app`, { ctrtId, appId, tenantId, clientScrVal, appDesc });
}

/**
 * Azure 애플리케이션 수정
 */
function updateAzureApp({ ctrtId, appId, clientScrVal, appDesc }) {
  return APICaller.put(`/cap/v1/ocp/setting/azureAcctMgmt/app`, { ctrtId, appId, clientScrVal, appDesc });
}

/**
 * Azure 애플리케이션 삭제
 */
function deleteAzureApp({ ctrtId, appId }) {
  return APICaller.delete(`/cap/v1/ocp/setting/azureAcctMgmt/app`, { ctrtId, appId });
}

/*************************************************
 *
 * 계정 인증 및 연계
 *
 *************************************************/

/**
 * Azure 애플리케이션 인증
 */
function authAzureApp({ appId, tenantId, clientScrVal }) {
  return APICaller.post(`/inf-opti-azure/v1/appMgmt/app`, { appId, tenantId, clientScrVal });
}

/**
 * Azure 애플리케이션 상태 관리 업데이트
 * - 애플리케이션 등록 / 애플리케이션 수정 시 'CBP_INF_ENTRA_APP_MGMT' 데이터 조작 후 호출하여 'CBP_INF_ENTRA_APP_STAT_MGMT' 관리
 */
function updateAzureAppStatus({ ctrtId, appId, clientScrVal }) {
  return APICaller.put(`/inf-opti-azure/v1/appMgmt/app`, { ctrtId, appId, clientScrVal });
}

/*************************************************
 *
 * OpsNow 연계
 *
 *************************************************/

/**
 * 회사 목록 조회
 */
function fetchCompList() {
  return APICaller.get(`/openapi/portal/v1/company/list`);
}

/**
 * 회사 생성
 */
function addNewComp({ cmpnAdmrEmail, cmpnNm }) {
  return APICaller.post(`/openapi/portal/v1/company`, { cmpnAdmrEmail, cmpnNm });
}

/**
 * Azure 계정 목록 조회
 */
function fetchAzureAccList({ companyId }) {
  return APICaller.get(`/openapi/portal/v1/acclist/azure/${companyId}`);
}

/**
 * Azure available subscription 조회
 */
function fetchAzureAvailSubsList({ accountId, tenantId, clientScrVal, accountType }) {
  return APICaller.post(`/openapi/portal/v1/subscription/azure/available-subscription`, {
    accountId,
    tenantId,
    clientScrVal,
    accountType,
  });
}

/**
 * Azure 계정 등록
 */
function addAzureAcct({ comanynId, accountId, accountAlias, tenantId, clientScrVal, accountType, subscription }) {
  return APICaller.post(`/openapi/portal/v1/account/azure`, {
    comanynId,
    accountId,
    accountAlias,
    tenantId,
    clientScrVal,
    accountType,
    subscription,
  });
}

/**
 * Azure 계정 수정
 */
function updateAzureAcct({ comanynId, accountId, accountAlias, tenantId, clientScrVal, accountType }) {
  return APICaller.put(`/openapi/portal/v1/account/azure`, {
    comanynId,
    accountId,
    accountAlias,
    tenantId,
    clientScrVal,
    accountType,
  });
}

/**
 * Azure 구독 수정
 */
function updateAzureSubs({ comanynId, accountId, tenantId, clientScrVal, accountType, subscription }) {
  return APICaller.put(`/openapi/portal/v1/subscription/azure`, {
    comanynId,
    accountId,
    tenantId,
    clientScrVal,
    accountType,
    subscription,
  });
}

/**
 * Azure 계정 삭제
 */
function deleteAzureAcct({ comanynId, accountId, tenantId }) {
  return APICaller.delete(`/openapi/portal/v1/subscription/azure`, {
    comanynId,
    accountId,
    tenantId,
  });
}

export default {
  addAzureAcct,
  addAzureApp,
  addNewComp,
  authAzureApp,
  deleteAzureAcct,
  deleteAzureApp,
  fetchAzureAccList,
  fetchAzureAppList,
  fetchAzureAppSubsList,
  fetchAzureAvailSubsList,
  fetchAzureCtrtList,
  fetchAzureSubsList,
  fetchCompList,
  updateAzureAcct,
  updateAzureApp,
  updateAzureAppStatus,
  updateAzureSubs,
};
