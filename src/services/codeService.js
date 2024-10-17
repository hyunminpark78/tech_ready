import APICaller from '@/library/APICaller';

function fetchCodes(commGrpCd) {
  return APICaller.get(`/cap/v1/comm/code/list`, { commGrpCd });
}

export { fetchCodes };
