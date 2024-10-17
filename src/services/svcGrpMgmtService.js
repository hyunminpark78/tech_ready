import APICaller from '@/library/APICaller';

/**
 * 계약 목록조회
 */
function fetchCtrt() {
  return APICaller.get('/cap/v1/ocp/setting/svcGrpMgmt/ctrt');
}

/**
 * 서비스 카테고리 조회
 */
function fetchSvcCtgry({ ctrtId }) {
  return APICaller.get('/cap/v1/ocp/setting/svcGrpMgmt/ctgry', { ctrtId });
}

/**
 * 서비스 카테고리 추가
 */
function addSvcCtrgy({ ctrtId, ctgryNm }) {
  return APICaller.post('/cap/v1/ocp/setting/svcGrpMgmt/ctgry', { ctrtId, ctgryNm });
}

/**
 * 서비스 카테고리 삭제
 */
function deleteSvcCtgry({ ctgryId }) {
  return APICaller.delete(`/cap/v1/ocp/setting/svcGrpMgmt/ctgry`, { ctgryId });
}

/**
 * 서비스 그룹 조회
 */
function fetchSvcGrp({ ctrtId, ctgryId, cspTypCd }) {
  return APICaller.get('/cap/v1/ocp/setting/svcGrpMgmt/grp', { ctrtId, ctgryId, cspTypCd });
}

/**
 * 서비스 그룹 추가
 */
function addSvcGrp(param) {
  return APICaller.post('/cap/v1/ocp/setting/svcGrpMgmt/grp', param);
}

/**
 * 서비스 그룹 삭제
 */
function deleteSvcGrp({ svcGrpId }) {
  return APICaller.delete(`/cap/v1/ocp/setting/svcGrpMgmt/grp`, { svcGrpId });
}

/**
 * 연결 계정 조회
 */
function fetchSvcAcnt({ ctrtId, svcGrpId, ctgryId, searchKeyword, cspTypCd }) {
  return APICaller.get('/cap/v1/ocp/setting/svcGrpMgmt/acnt', { ctrtId, svcGrpId, ctgryId, searchKeyword, cspTypCd });
}

/**
 * 연결 계정 저장
 */
function mergeSvcAcnt(param) {
  return APICaller.post('/cap/v1/ocp/setting/svcGrpMgmt/acnt', param);
}

/**
 * 카테고리명 중복여부 검사
 */
function checkDuplicateCtgryNm({ ctrtId, ctgryNm }) {
  return APICaller.get('/cap/v1/ocp/setting/svcGrpMgmt/duplicate/ctgry', { ctrtId, ctgryNm });
}

/**
 * 서비스그룹명 중복여부 검사
 */
function checkDuplicateGrpNm({ ctgryId, svcGrpNm }) {
  return APICaller.get('/cap/v1/ocp/setting/svcGrpMgmt/duplicate/grp', { ctgryId, svcGrpNm });
}

export default {
  fetchCtrt,
  fetchSvcCtgry,
  addSvcCtrgy,
  deleteSvcCtgry,
  fetchSvcGrp,
  addSvcGrp,
  deleteSvcGrp,
  fetchSvcAcnt,
  mergeSvcAcnt,
  checkDuplicateCtgryNm,
  checkDuplicateGrpNm,
};
