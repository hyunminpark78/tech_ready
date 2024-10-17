import 'babel-polyfill';
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import APICaller, { APISetting, getZuulHost } from './library/APICaller';

import router from './router';
import store from './store';
import Plugins from './plugins';
import * as Keycloak from 'keycloak-js';
import UrlsConfig from './config/urls.conf';
import App from './App.vue';
import VueRouter from 'vue-router';
import constants from './constants/constants';
import * as _ from 'lodash';
import { LicenseManager } from 'ag-grid-enterprise';
import { i18n } from '../public/locales/i18n';

import { setLocal, clearTokenAndStorage, getBuildEnv, getOs, getBrowser } from '@/library/Common';
import VueClipboard from 'vue-clipboard2';

/**
 * PascalCase -> CONSTANT_CASE 변환
 *
 * @example
 * 'HelloWorld.pascalToConstant() // 'HELLO_WORLD'
 *
 * @returns {string} Constant cased
 */
String.prototype.pascalToConstant = function () {
  if (!this) {
    return '';
  }

  const array = this.match(/[A-Z][a-z]+/g);
  if (!array) {
    return this;
  }

  return array.join('_').toUpperCase();
};

Vue.config.productionTip = false;
LicenseManager.setLicenseKey(constants.LICENSE_KEY_AG_GRID);
//amchart
if (process.env.NODE_ENV !== 'production') {
  APISetting.debugMode = true;
}

// global variable
// FIXME: 개발중에만 임시 사용
Vue.prototype.$console = {
  ...window.console,
  log: (...params) => window.console.log(...JSON.parse(JSON.stringify(params))),
  table: (...params) => window.console.table(...JSON.parse(JSON.stringify(params))),
};

window._ = require('lodash');

Vue.use(VueRouter);
Vue.use(Plugins);
Vue.use(VueCookies);
Vue.use(VueClipboard);
Vue.use(i18n);

let server = getBuildEnv();
let initConf = getBuildEnv() || 'local'; // urlconf에는 구분을 위해 local도 필요함
UrlsConfig.init(initConf); //  profile 에 따라  token key 및 인증 서버 url 결정.
window.urlsConfig = UrlsConfig;
let keycloakUrl = 'https://ocp-keycloak-dev.dev.opsnow.com/auth';
// let keycloakUrl = 'https://authstage.opsnow.com/auth';

//let realm = 'THUBCLOUD';
let realm = 'SKB2B';
let clientId = 'cloud-radar-sso';

if (server === 'prd') {
  keycloakUrl = 'https://auth.opsnow.com/auth';
} else if (server === 'stg') {
  keycloakUrl = 'https://ocp-keycloak-stage.dev.opsnow.com/auth';
}

let initOptions = {
  url: keycloakUrl,
  realm: realm,
  clientId: clientId,
};

let keycloak = Keycloak(initOptions);
keycloak['onAuthLogout'] = clearLocalCookieAndState;
keycloak['onAuthRefreshError'] = doLogin;
keycloak
  .init({
    //flow: 'standard',
    onLoad: 'login-required',
    //checkLoginIframe: false,
  })
  .then((auth) => {
    if (!auth) {
      window.location.reload();
    } else {
      VueCookies.set(UrlsConfig.session_timestamp_key, keycloak.refreshTokenParsed['exp'], '1y');
      window.keycloak = keycloak;

      const response = APICaller.post(`${getZuulHost()}/cmm/v1/user/login/keycloak`, {
        keycloakToken: window.keycloak.idToken,
        acesOsNm: getOs(),
        acesBrsrNm: getBrowser(),
      });
      response
        .then(async (result) => {
          const data = await result.data;
          if (data.code !== 'S00001') {
            alert('SSO인증은 되었지만 OCP인증에 실패했습니다');
            keycloak.logout();
            clearTokenAndStorage();
          } else if (data.data.useYn === 'N') {
            alert('비활성화된 계정입니다 관리자에게 문의해주세요.');
            keycloak.logout();
            clearTokenAndStorage();
          } else {
            const { access_token, userId, userNm, ctrtIds, userCopNm } = data.data;
            setLocal('access_token', access_token);
            setLocal('userInfo', { ...data.data });
            VueCookies.set(constants.CBP_TOKEN(), access_token, '3h');

            APICaller.interceptors.start();
            new Vue({
              el: '#app',
              i18n,
              router,
              store,
              render: (h) => h(App, { props: { keycloak: keycloak } }),
            });
          }
        })
        .catch(() => {
          alert('SSO인증은 되었지만 OCP인증에 실패했습니다');
          clearTokenAndStorage();
          keycloak.logout();
        });
    }
  })
  .catch(() => {
    // console.error('Auth Error');
  });

function clearLocalCookieAndState() {
  VueCookies.remove(UrlsConfig.session_timestamp_key, '/', getTopDomain());
}

function doLogin() {
  window.keycloak.login();
}
function getTopDomain() {
  var url = new URL(window.location.href);
  return '.' + url.hostname.split(/\./).slice(-2).join('.');
}
