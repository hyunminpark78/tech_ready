import dashboardService from '@/services/dashboardService';
import APICaller from '@/library/APICaller';

const fetchCategory = dashboardService.fetchCtgry;

function fetchMFAReset({ id }) {
  return APICaller.get(`/cmm/v1/user/keycloak/mfa/reset`, { id });
}
export default { fetchCategory, fetchMFAReset };
