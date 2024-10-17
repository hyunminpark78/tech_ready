import APICaller from '@/library/APICaller';

/**
 * 알림 설정 조회
 */
function fetchNotification() {
  return APICaller.get(`/cap/v1/ocp/setting/notification`);
}

/**
 * 알림 설정 이메일 변경
 */
function updateSetEmail({ alarSetEmail }) {
  return APICaller.post(`/cap/v1/ocp/setting/notification/updateEmail`, { alarSetEmail });
}

/**
 * 일림 설정 변경
 */
function updateNotification(notifications) {
  return APICaller.post(`/cap/v1/ocp/setting/notification/update`, notifications);
}

export default {
  fetchNotification,
  updateSetEmail,
  updateNotification,
};
