import APICaller from '@/library/APICaller';

/**
 * AWS 계정 목록 조회
 */
function fetchList({ searchKeyword }) {
  return APICaller.get(`/cap/v1/ocp/setting/awsAcctMgmt`, {
    searchKeyword,
  });
}

/**
 * AWS 계정 등록
 */
function addAwsAcct({ acntNm, acntId, extId, roleArn, custCorpId, corpRegNo }) {
  return APICaller.post(`/cap/v1/ocp/setting/awsAcctMgmt`, {
    acntNm,
    acntId,
    extId,
    roleArn,
    custCorpId,
    corpRegNo,
  });
}

/**
 * AWS 계정 삭제
 */
function deleteAwsAcct({ acntNm, acntId, extId, roleArn }) {
  return APICaller.delete(`/cap/v1/ocp/setting/awsAcctMgmt`, {
    acntId,
  });
}

export default {
  fetchList,
  addAwsAcct,
  deleteAwsAcct,
};
