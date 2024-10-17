import { getBuildEnv } from '@/library/Common';

const buildEnv = getBuildEnv();

const CBP_TOKEN = () => {
  const env = process.env.NODE_ENV;
  return `${env}_CBP_TOKEN`;
};

const URLS = (() => {
  const dev = {
    CSMP: 'https://www.adtcaps-csmp.co.kr/',
    CSMP_SSO: 'https://www.adtcaps-csmp.co.kr/saml/login', // 전용회선 계약이 있는 경우
    OPS_NOW: 'https://service.opsnow-5gxcloudradar.com',
    OPS_NOW_SSO: 'https://service.opsnow-5gxcloudradar.com?idp_hint=marketplace_ops', // Keycloak Token opsnow_id 값이 존재하는 경우
    MARKET_PLACE: 'https://www.sktcloudmarketplace.com',
    MBMP: 'http://portal-dev.5gxedge.com',
    MBMP_SSO: 'http://portal-dev.5gxedge.com:8080/sso/login.do',
    get MEC() {
      return this.MBMP;
    },
    get MEC_SSO() {
      return this.MBMP_SSO;
    },
  };
  const stg = {
    CSMP: 'https://www.adtcaps-csmp.co.kr/',
    CSMP_SSO: 'https://www.adtcaps-csmp.co.kr/saml/login', // 전용회선 계약이 있는 경우
    OPS_NOW: 'https://service.opsnow-5gxcloudradar.com',
    OPS_NOW_SSO: 'https://service.opsnow-5gxcloudradar.com?idp_hint=marketplace_ops', // Keycloak Token opsnow_id 값이 존재하는 경우
    MARKET_PLACE: 'https://www.sktcloudmarketplace.com',
    MBMP: 'http://portal-dev.5gxedge.com',
    MBMP_SSO: 'http://portal-dev.5gxedge.com:8080/sso/login.do',
    get MEC() {
      return this.MBMP;
    },
    get MEC_SSO() {
      return this.MBMP_SSO;
    },
  };
  const prd = {
    CSMP: 'https://www.adtcaps-csmp.co.kr/',
    CSMP_SSO: 'https://www.adtcaps-csmp.co.kr/saml/login', // 전용회선 계약이 있는 경우
    OPS_NOW: 'https://service.opsnow-5gxcloudradar.com',
    OPS_NOW_SSO: 'https://service.opsnow-5gxcloudradar.com?idp_hint=marketplace_ops', // Keycloak Token opsnow_id 값이 존재하는 경우
    MARKET_PLACE: 'https://www.sktcloudmarketplace.com',
    MBMP: 'https://portal.5gxedge.com',
    MBMP_SSO: 'https://portal.5gxedge.com/sso/login.do',
    get MEC() {
      return this.MBMP;
    },
    get MEC_SSO() {
      return this.MBMP_SSO;
    },
  };

  switch (buildEnv) {
    case 'dev':
      return dev;
    case 'stg':
      return stg;
    case 'prd':
      return prd;
    default:
      return dev;
  }
})();

const LICENSE_KEY_AG_GRID =
  'Using_this_{AG_Grid}_Enterprise_key_{AG-063626}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{SKTelecom}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{CloudRadar}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{CloudRadar}_need_to_be_licensed___{CloudRadar}_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{18_September_2025}____[v3]_[01]_MTc1ODE1MDAwMDAwMA==1e72174fe422628cae6b3c4902362a83';

export default Object.freeze({
  CBP_TOKEN,
  URLS,
  LICENSE_KEY_AG_GRID,
});
