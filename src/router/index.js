import VueRouter from 'vue-router';

import routes from '@/router/routes';
import APICaller, { getZuulHost } from '@/library/APICaller';
import { getLocal } from '@/library/Common';

const router = new VueRouter({
  mode: 'history',
  routes,
});

// Router Guard
router.beforeEach((to, from, next) => {
  if (to.fullPath !== '404' && !to.meta.subYn && !to.query.subYn) {
    const response = APICaller.post(`/cmm/v1/user/menu/check`, {
      lnkUrl: to.path,
      clientCd: 'CCP',
    });
    response.then(async (result) => {
      if (result.data.data > 0) {
        if (getLocal('userInfo').userId) {
          APICaller.post(`/cmm/v1/user/menu/audit`, {
            userId: getLocal('userInfo').userId,
            lnkUrl: to.path,
          });
        }
        next();
      } else {
        if (from.fullPath === '/' && to.meta.title === '대시보드') {
          next(getLocal('userInfo').redirectRoute);
        } else {
          next({ name: '404 Not Found' });
        }
      }
    });
  } else {
    next();
  }
});

export default router;
