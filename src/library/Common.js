import constants from '@/constants/constants';
import VueCookies from 'vue-cookies';

export const setLocal = (key, item) => {
  if (key) {
    localStorage.setItem(key, JSON.stringify(item));
    sessionStorage.setItem(key, JSON.stringify(item));
  } else {
    console.log('Key가 존재하지 않습니다');
  }
};
export const getLocal = (key) => {
  if (key) {
    let item = localStorage.getItem(key) || sessionStorage.getItem(key);
    return item ? JSON.parse(item) : '';
  } else {
    console.log('Key가 존재하지 않습니다');
  }
};
export const removeLocal = (key) => {
  if (key) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } else {
    console.log('Key가 존재하지 않습니다');
  }
};
// 401,403 error , logout
export const clearTokenAndStorage = () => {
  VueCookies.remove(constants.CBP_TOKEN());
  removeLocal('access_token');
  removeLocal('userInfo');
  removeLocal('vuex');
};

// Prod => prd
// Dev => dev
// local => ''
export const getBuildEnv = () => {
  let server = process.env.BUILD_ENV || 'dev';
  const curPort = window.location.port;
  if (server === 'dev' && curPort) {
    // port가 존재하면 구동서버가 local이라 host는 localhost로 유지
    server = '';
  }

  return server;
};

export const ssoAuthUrl = () => {
  let server = process.env.BUILD_ENV || 'dev';
  let url = `auth.opsnow.com`;

  if (server === 'prd') {
    url = `ocp-keycloak-dev.dev.opsnow.com`;
  } else if (server === 'stg') {
    url = `ocp-keycloak-stage.dev.opsnow.com`;
  }

  return url;
};

export const redirectLandUrl = () => {
  let server = getBuildEnv();
  if (server === 'prd') {
    return `https://ocp.5gxcloudradar.com`;
  } else if (server === 'dev') {
    return `https://dev-ocp.5gxcloudradar.com`;
  } else if (server === 'stg') {
    return `https://stg-ocp.5gxcloudradar.com`;
  } else {
    return 'http://localhost:6007';
  }
};

export const getOs = () => {
  const userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
};
export const getBrowser = () => {
  const browser = navigator.userAgent;
  let userBrowser = '';
  if ((browser.indexOf('Opera') || browser.indexOf('OPR')) != -1) {
    userBrowser = 'Opera';
  } else if (browser.indexOf('Chrome') != -1) {
    userBrowser = 'Chrome';
  } else if (browser.indexOf('Safari') != -1) {
    userBrowser = 'Safari';
  } else if (browser.indexOf('Firefox') != -1) {
    userBrowser = 'Firefox';
  } else if (browser.indexOf('MSIE') != -1 || !!document.documentMode == true) {
    userBrowser = 'IE';
  } else {
    userBrowser = 'Unknown';
  }

  return userBrowser;
};
