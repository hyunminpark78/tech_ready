<template>
  <section
    class="absolute z-20 overflow-hidden bg-white border rounded-lg border-primary-400"
    style="min-width: 160px !important"
  >
    <!--    <div class="p-5">-->
    <!--      <h4 class="mb-3 font-bold text-gray-700">외부 서비스 연동</h4>-->

    <!--      <ul>-->
    <!--        <SsoServiceListItem-->
    <!--          v-for="sso in ssoStatus"-->
    <!--          :key="sso.name"-->
    <!--          :service-name="sso.name"-->
    <!--          :available="sso.available"-->
    <!--        />-->
    <!--      </ul>-->
    <!--    </div>-->
    <div class="p-5">
      <p class="mb-3 font-bold text-gray-700" style="font-size: 15px">{{ $t('etc.loginSettings') }}</p>
      <div style="display: flex; align-items: center; justify-content: center">
        <button class="btn" @click="mfaReset">{{ $t('etc.mfaReset') }}</button>
      </div>
    </div>
    <div class="flex border-primary-400" style="border-top: 1px solid #00a5ed">
      <button
        class="flex items-center justify-center w-full py-4 font-bold bg-white text-primary-400 text-xs-"
        @click="logout"
      >
        <img src="@/assets/images/ico-logout.svg" alt="." />
        <span class="ml-2">{{ $t('etc.logout') }}</span>
      </button>
    </div>
  </section>
</template>

<script>
import { clearTokenAndStorage, getBuildEnv, getLocal } from '@/library/Common';
import { mapActions, mapState } from 'vuex';
import SsoServiceListItem from './SsoServiceListItem.vue';
import userService from '@/services/userService';

export default {
  components: { SsoServiceListItem },
  computed: {
    ...mapState('user', ['ssoStatus']),
  },
  created() {
    // this.bootstrap();
  },
  methods: {
    ...mapActions('user', ['bootstrap']),
    logout() {
      clearTokenAndStorage();
      const server = getBuildEnv();
      let redirectUrl = '';
      if (server === 'stg') {
        redirectUrl = 'https://stg.5gxcloudradar.com/';
      } else if (server === 'prd') {
        redirectUrl = 'https://5gxcloudradar.com';
      } else {
        redirectUrl = 'http://dev.5gxcloudradar.com/';
      }

      const logoutInfo = { redirectUri: redirectUrl };
      window.keycloak.logout(logoutInfo);
    },
    async mfaReset() {
      if (window.confirm(`설정된 MFA 인증을 초기화 합니다. 초기화 진행하시겠습니까?`)) {
        const id = getLocal('userInfo').userId;
        await userService
          .fetchMFAReset({ id })
          .then((res) => {
            const data = res.data;
            if (data.data === 1) {
              alert('MFA 초기화가 완료되었습니다.');
              this.$emit('closePop');
              window.location.reload();
            } else {
              alert('초기화에 실패하였습니다. 관리자에게 문의하세요.');
            }
          })
          .catch((error) => {
            alert(this.$t('etc.errorOccurredContact'));
          });
      }
    },
  },
};
</script>
