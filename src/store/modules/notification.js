import notificationService from '@/services/notificationService';

const types = {
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  SET_USER_SCHD_INFO: 'SET_USER_SCHD_INFO',
};
export default {
  namespaced: true,
  state: {
    notification: [],
    userSchdInfo: {
      custUserId: '',
      alarSetEmail: '',
      dowSepCds: [],
    },
  },
  getters: {
    notification: (state) => {
      return state.notification;
    },
  },
  actions: {
    async fetchNotification({ commit }) {
      await notificationService
        .fetchNotification()
        .then((res) => {
          const result = res.data.data;
          const notificationTemplates = result.notificationTemplates;
          const userInfo = result.userSchdInfo;
          const saveStdDesc = notificationTemplates.filter((item) => item.alarSepCd == 'SAVE_STD')[0].alarSepDesc;
          notificationTemplates.forEach((item) => {
            if (item.alarSepCd == 'UTL_STD') {
              item.alarSepDesc += ' / ' + saveStdDesc;
            }
          });

          commit(types.SET_NOTIFICATION, notificationTemplates);
          commit(types.SET_USER_SCHD_INFO, userInfo);
        })
        .catch(() => {
          commit(types.SET_NOTIFICATION, []);
          commit(types.SET_USER_SCHD_INFO, {});
        });
    },
    async updateSetEmail({ commit }, payload) {
      await notificationService.updateSetEmail(payload);
    },
    async updateNotification({ commit }, payload) {
      await notificationService.updateNotification(payload);
    },
  },
  mutations: {
    [types.SET_NOTIFICATION]: (state, payload) => {
      state.notification = payload;
    },
    [types.SET_USER_SCHD_INFO]: (state, payload) => {
      state.userSchdInfo = payload;
    },
  },
};
