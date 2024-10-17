import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import modules from './modules';
import createPersistedState from 'vuex-persistedstate';

const store = {
  namespaced: true,
  strict: process.env.NODE_ENV !== 'production',
  modules,
  state: {},
  getters: {},
  mutations: {},
  actions: {},
};

const vuexPlugins = () => {
  if (process.env.NODE_ENV === 'test') {
    return [];
  }

  return process.env.NODE_ENV === 'production' ? [] : [createLogger()];
};

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    vuexPlugins,
    createPersistedState({
      paths: ['common'],
      storage: window.sessionStorage,
    }),
  ],

  /* strict true일때 Vuex 상태가 변이 핸들러 외부에서 변이 될 때 마다 오류 */
  /* production 환경에서 속도 저하 요인으로 해제 한다 */
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  ...store,
});
