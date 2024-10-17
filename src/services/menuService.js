import APICaller from '@/library/APICaller';

function fetchMenuList(clientCd) {
  return APICaller.get(`/cmm/v1/user/menu/list/${clientCd}`);
}

export default {
  fetchMenuList,
};
