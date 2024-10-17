import { getLocal } from '@/library/Common';
import routeConstants from '@/constants/routeConstants';

// const ROLE = {
//   ALL: 'ROLE0000190001',
//   NEW: 'ROLE0000190002',
//   NO_OPTI: 'ROLE0000190003',
//   NO_RSRC: 'ROLE0000190004',
//   OLD: 'ROLE0000190005',
// };

export const hasOptiRole = () => {
  return getLocal('userInfo') ? (getLocal('userInfo').userTypCd === routeConstants.ROLE.NO_OPTI ? false : true) : false;
};

export const hasRsrcRole = () => {
  return getLocal('userInfo') ? (getLocal('userInfo').userTypCd === routeConstants.ROLE.NO_RSRC ? false : true) : false;
};

export const hasAdminRole = () => {
  return getLocal('userInfo') ? getLocal('userInfo').userTypCd === routeConstants.ROLE.ALL : false;
};
