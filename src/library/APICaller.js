/* eslint-disable no-console */

import axios from 'axios';
import buildURL from 'axios/lib/helpers/buildURL';
import VueCookies from 'vue-cookies';
import { v4 as uuidv4 } from 'uuid';
import constants from '@/constants/constants';
import { redirectLandUrl, ssoAuthUrl, getBuildEnv } from '@/library/Common';

const APISetting = {
  debugMode: false,
  timeout: 1000 * 1000,
  // timeout: 30 * 1000,
};

let delayTime = 0;
if (process.env.NODE_ENV === 'production') {
  delayTime = 0;
}

//@deprecated
export const getHost = (svc) => {
  return '';
};

// cap/v1/ocp => thub
// login api => zuul
function changeOrigin(url) {
  let server = getBuildEnv();

  // ocp 호출일 경우 host변경 , cap/v1 제거
  // or cap comm 호출일 경우, 과금약정정보 조회 호출일 경우
  // todo. 임시
  if (
    (url.indexOf('/ta/cost') > -1 ||
      url.indexOf('/usag/v1') > -1 ||
      url.indexOf('/costExplorer/ocp') > -1 ||
      url.indexOf('/totalDashboard') > -1 ||
      url.indexOf('/setting/notification') > -1 ||
      url.indexOf('/setting/azureAcctMgmt') > -1 ||
      url.indexOf('/resource/comm/filter') > -1 ||
      url.indexOf('/resource/detail') > -1 ||
      url.indexOf('/spotAdvisor') > -1) &&
    server
  ) {
    return `${getZuulHost()}${url}`;
  }
  if ((url.indexOf('ocp') > -1 || url.includes('/comm') || url.indexOf('cmmt') > -1) && server) {
    return `${getThubUrl()}${url.replace('/cap/v1/', '/api/skt/')}`;
  } else if (url.indexOf('cmm') > -1 && url.indexOf('/login/keycloak') === -1 && server) {
    return `${getZuulHost()}${url}`;
  } else {
    // zuul 을 호출하는 api는 host 변경X
    return url;
  }
}

// thub host
function getThubUrl() {
  let server = getBuildEnv();

  if (server === 'prd') {
    return `https://skt-ops2server.opsnow.com`;
  } else if (server === 'dev') {
    return `https://skt-ocp-ops2server-sandbox.dev.opsnow.com`;
  } else if (server === 'stg') {
    return `https://skt-ocp-ops2server-stage.dev.opsnow.com`;
  } else {
    return '';
  }
}

export const getZuulHost = () => {
  let host = '';
  let server = getBuildEnv();
  if (server === 'prd') {
    host = 'https://{server}.5gxcloudradar.com';
    server = 'api';
    return host.replace('{server}', server);
  } else if (server === 'dev') {
    host = 'https://{server}.5gxcloudradar.com';
    server = 'dev-api';
    return host.replace('{server}', server);
  } else if (server === 'stg') {
    host = 'https://{server}.5gxcloudradar.com';
    server = 'stg-api';
    return host.replace('{server}', server);
  } else {
    return host;
  }
};
function fakeResult(fn, method, url, data) {
  return new Promise((resolve, reject) => {
    let response = {};
    if (method === 'post' || method === 'put') {
      response = fn(url, data);
      response = {
        ...response,
        config: {
          url,
          method,
          data: JSON.stringify(data),
        },
      };
    } else {
      response = fn(buildURL(url, data));
      response = {
        ...response,
        config: {
          url,
          method,
          params: data,
        },
      };
    }
    if (response && response.data && response.data.error) {
      response = {
        ...response,
        response: {
          status: response.data.error,
        },
      };
      reject(response);
    } else {
      resolve(response);
    }
  });
}

function getQueryString(url, params) {
  let _url = url;
  const keys = Object.keys(params || {});
  for (const k of keys) {
    if (params[k]) {
      _url = _url + (_url === url ? '?' : '&');
      _url = _url + `${k}=${encodeURIComponent(params[k])}`;
    }
  }
  return _url;
}

class APIWrapper {
  constructor({ timeout, withCredentials } = { timeout: APISetting.timeout, withCredentials: true }) {
    this._axiosInstance = axios.create({
      timeout,
      withCredentials,
    });

    this._interceptors = new APIInterceptors(this);
  }

  /**
   * HTTP GET
   * @param  {String} url
   * @param  {Object} [params]
   * @param  {Object} [config]
   * @returns {Promise}
   */
  get(url, params, config) {
    return process.env.NODE_ENV === 'test' && APIFaker.get[url]
      ? fakeResult(APIFaker.get[url], 'get', url, params)
      : this._axiosInstance.get(getQueryString(changeOrigin(url), params), config).then(
          (value) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve(value);
              }, delayTime);
            })
        );
  }

  /**
   * HTTP POST
   * @param  {String} url
   * @param  {Object} data
   * @returns {Promise}
   */
  post(url, data, config) {
    if (process.env.NODE_ENV === 'test' && APIFaker.post[url]) {
      return fakeResult(APIFaker.post[url], 'post', url, data);
    } else {
      return this._axiosInstance.post(changeOrigin(url), data || {}, config).then(
        (value) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(value);
            }, delayTime);
          })
      );
    }
  }

  /**
   * HTTP PUT
   * @param  {String} url
   * @param  {Object} [data]
   */
  put(url, data) {
    if (process.env.NODE_ENV === 'test' && APIFaker.put[url]) {
      return fakeResult(APIFaker.put[url], 'put', url, data);
    } else {
      return this._axiosInstance.put(changeOrigin(url), data || {}).then(
        (value) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(value);
            }, delayTime);
          })
      );
    }
  }

  /**
   * HTTP DELETE
   * @param  {String} url
   * @param  {Object} [params]
   */
  delete(url, params) {
    if (process.env.NODE_ENV === 'test' && APIFaker.put[url]) {
      return fakeResult(APIFaker.delete[url], 'delete', getQueryString(changeOrigin(url), params));
    } else {
      return this._axiosInstance
        .delete(getQueryString(changeOrigin(url), params))
        .then(
          (value) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve(value);
              }, delayTime);
            })
        )
        .catch((e) => {
          return Promise.reject(e);
        });
    }
  }

  /**
   * 파일 업로드
   * @param  {String} url
   * @param  {FormData} formData
   * @param  {Function} [onUploadProgress] (e) => { let progress = Math.round((e.loaded * 100) / e.total) }
   */
  postUpload(url, formData, onUploadProgress = null) {
    const options = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    if (onUploadProgress) {
      options.onUploadProgress = onUploadProgress;
    }

    return this._axiosInstance.post(changeOrigin(url), formData, options).then(
      (value) =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(value);
          }, delayTime);
        })
    );
  }

  /**
   * 파일 업로드
   * @param  {String} url
   * @param  {FormData} formData
   * @param  {Function} [onUploadProgress] (e) => { let progress = Math.round((e.loaded * 100) / e.total) }
   */
  putUpload(url, formData, onUploadProgress = null) {
    const options = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    if (onUploadProgress) {
      options.onUploadProgress = onUploadProgress;
    }

    return this._axiosInstance.put(url, formData, options).then(
      (value) =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(value);
          }, delayTime);
        })
    );
  }

  /**
   * 파일 다운로드
   * @param  {String} url
   * @param fileName
   */
  download(url, fileName) {
    return this._axiosInstance
      .get(url, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((response) => {
        const type = response.headers['content-type'];
        const blob = new Blob([response.data], { type: type, encoding: 'UTF-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      });
  }

  /**
   * 파일 다운로드 blob
   * @param  {String} url
   * @param fileName
   */
  downloadBlob(url, fileName) {
    return this._axiosInstance
      .get(url, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((response) => {
        const type = response.headers['content-type'];
        const blob = new Blob([response.data], { type: type, encoding: 'UTF-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      });
  }

  /**
   * 파일 다운로드 blob
   * @param  {String} url
   * @param fileName
   */
  postDownloadBlobXlsx(url, fileName, data) {
    return this._axiosInstance
      .post(changeOrigin(url), data, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const extension = '.xlsx';
        const filename = fileName;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.target = '_self';
        link.download = filename + extension;
        link.click();
        link.remove();
      });
  }

  /**
   * 파일 다운로드 blob
   * @param  {String} url
   * @param fileName
   */
  postDownloadBlob(url, fileName, data) {
    return this._axiosInstance
      .post(url, data, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel',
        });
        const extension = '.xls';
        const filename = fileName;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.target = '_self';
        link.download = filename + extension;
        link.click();
      });
  }

  get interceptors() {
    return this._interceptors;
  }
}

const APIEventName = {
  request: 'request',
  requestException: 'requestException',
  response: 'response',
  responseException: 'responseException',
  loginStatusException: 'loginStatusException',
};

class APIInterceptors {
  constructor(apiWrapper, exceptionCallback = null) {
    this._axiosInstance = apiWrapper._axiosInstance;
    this._interceptors = apiWrapper._axiosInstance.interceptors;
    this._exceptionCallback = exceptionCallback;

    this.listeners = {
      [APIEventName.request]: [],
      [APIEventName.requestException]: [],
      [APIEventName.response]: [],
      [APIEventName.responseException]: [],
      [APIEventName.loginStatusException]: [],
    };

    this._instanceInterceptor = {
      request: null,
      response: null,
    };
  }

  addListener(eventName, listener) {
    this.listeners[eventName].push(listener);
  }

  removeListener(eventName, listener) {
    if (listener) {
      const index = this.listeners[eventName].indexOf(listener);
      this.listeners[eventName].splice(index, 1);
    } else if (eventName) {
      this.listeners[eventName] = [];
    }
  }

  _fireEvent(eventName, e) {
    for (const listener of this.listeners[eventName]) {
      if (typeof listener === 'function') {
        listener(e);
      }
    }
  }

  start() {
    this._instanceInterceptor.request = this._interceptors.request.use(
      async (config) => {
        APISetting.debugMode === true && console.log('%cHTTP REQUEST %s\n', 'color: blue', config.url, config);
        try {
          this._fireEvent(APIEventName.request, config);
        } catch (e) {
          console.error(e);
        }
        if (window.keycloak) {
          const { keycloak } = window;
          let sessionExpTimeStamp = VueCookies.get(window.urlsConfig.session_timestamp_key);
          if (!sessionExpTimeStamp || sessionExpTimeStamp < Math.floor(Date.now() / 1000)) {
            clearLocalCookieAndState();
            VueCookies.remove(constants.CBP_TOKEN());
            window.keycloak.logout();
          }
          await window.keycloak
            .updateToken(60)
            .success((refreshed) => {
              if (refreshed) {
                console.log('Refreshed token ...');
              } else {
                console.log('Still valid token ...');
              }
            })
            .error(function () {
              alert('세션 연장에 실패했습니다.');
            }); // update token by refresh token

          let sessionTime = keycloak.refreshTokenParsed['exp'] - keycloak.refreshTokenParsed['iat'];
          // VueCookies.set(
          //   window.urlsConfig.session_timestamp_key,
          //   Math.floor(Date.now() / 1000) + sessionTime,
          //   '1y',
          //   '/',
          //   getTopDomain()
          // );
          VueCookies.set(window.urlsConfig.session_timestamp_key, Math.floor(Date.now() / 1000) + sessionTime, '1y');

          config.headers.transactionId = uuidv4();
          if (window.keycloak['token']) {
            if (getBuildEnv()) {
              config.headers.Token = `bearer ${VueCookies.get(constants.CBP_TOKEN())}`;
              config.headers.Authorization = `bearer ${window.keycloak.token}`;
              if (config.url.indexOf('/cmm/v1') > -1 && config.url.indexOf('/login/keycloak') === -1) {
                config.headers.Authorization = `bearer ${VueCookies.get(constants.CBP_TOKEN())}`;
              } else if (
                // Todo. 임시
                config.url.indexOf('/ta/cost') > -1 ||
                config.url.indexOf('/usag/v1') > -1 ||
                config.url.indexOf('/costExplorer/ocp') > -1 ||
                config.url.indexOf('/totalDashboard') > -1 ||
                config.url.indexOf('/setting/notification') > -1 ||
                config.url.indexOf('/setting/azureAcctMgmt') > -1 ||
                config.url.indexOf('/resource/comm/filter') > -1 ||
                config.url.indexOf('/resource/detail') > -1 ||
                config.url.indexOf('/spotAdvisor') > -1
              ) {
                config.headers.Authorization = `bearer ${VueCookies.get(constants.CBP_TOKEN())}`;
              } else {
                config.headers.Authorization = `bearer ${window.keycloak.token}`;
              }
            } else {
              config.headers.Authorization = `bearer ${VueCookies.get(constants.CBP_TOKEN())}`;
            }
            // if (!config.headers.Authorization) {
            //   //config.headers.Authorization = `Bearer ${keycloak['token']}`;
            //   config.headers.Authorization = `bearer ${VueCookies.get(constants.CBP_TOKEN())}`;
            // } else {
            //   console.log('has authorization before = ' + config.headers.Authorization);
            // }
          }
        }

        return config;
      },
      (error) => {
        APISetting.debugMode === true && console.error('%cHTTP REQUEST ERROR\n', 'color: red', error);
        try {
          this._fireEvent(APIEventName.requestException, error);
        } catch (e) {
          console.error(e);
        }

        if (this._exceptionCallback) {
          this._exceptionCallback(error);
        }

        return Promise.reject(error);
      }
    );

    this._instanceInterceptor.response = this._interceptors.response.use(
      (response) => {
        APISetting.debugMode === true &&
          console.log('%cHTTP RESPONSE %s\n', 'color: blue', response.config.url, response);
        try {
          this._fireEvent(APIEventName.response, response);
        } catch (e) {
          console.error(e);
        }

        return response;
      },
      (error) => {
        if (error.response) {
          console.log('status:' + error.response.status);
          if (error.response.status === 401 || error.response.status === 403) {
            clearLocalCookieAndState();
            window.keycloak.logout();
            return Promise.reject(error);
          } else if (error.response.status == 409) {
            this._fireEvent(APIEventName.loginStatusException, error);
            return Promise.reject(error);
          }
        }

        APISetting.debugMode === true && console.error('%cHTTP RESPONSE ERROR\n%s', 'color: red', error);
        try {
          this._fireEvent(APIEventName.responseException, error);
        } catch (e) {
          console.error(e);
        }

        if (this._exceptionCallback) {
          this._exceptionCallback(error);
        }

        return Promise.reject(error);
      }
    );
  }

  stop() {
    this._instanceInterceptor.request && this._interceptors.request.eject(this._instanceInterceptor.request);
    this._instanceInterceptor.response && this._interceptors.response.eject(this._instanceInterceptor.response);
  }
}

const APIFaker = {
  get: {},
  post: {},
  put: {},
  delete: {},
  clear(method) {
    if (method) {
      this[method] = {};
    } else {
      this.get = {};
      this.post = {};
      this.put = {};
      this.delete = {};
    }
  },
};

function clearLocalCookieAndState() {
  //VueCookies.remove(window.urlsConfig.session_timestamp_key, '/', getTopDomain());
  VueCookies.remove(window.urlsConfig.session_timestamp_key);
}

function getTopDomain() {
  var url = new URL(window.location.href);
  return '.' + url.hostname.split(/\./).slice(-2).join('.');
}

const setApiConfig = (apiConfig) => {
  const cancelToken = axios.CancelToken;
  const source = cancelToken.source();
  apiConfig.cancelTokenSource = source;
  apiConfig.cancelToken = source.token;
};

const APIObject = {};

if (!APIObject.APICaller) {
  APIObject.APICaller = new APIWrapper();
  //APIObject.APICaller.interceptors.start() start by main.js
}

export { APIWrapper, APIInterceptors, APIFaker, APISetting, APIEventName, setApiConfig };

export default APIObject.APICaller;
