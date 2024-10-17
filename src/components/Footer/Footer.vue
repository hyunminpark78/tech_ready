<template>
  <footer class="bg-white footer">
    <div class="container relative flex flex-col items-end pb-24">
      <RouterLink class="absolute" title="sk telecom" to="">
        <img :src="require('@/assets/images/ico-footer-logo.svg')" alt="footer logo" />
      </RouterLink>

      <div class="py-4"></div>
      <!--      <NavBarMenu class="py-8 -mr-4" :navigation-items="navigationItems" />-->

      <p v-if="$i18n.locale === 'ko'" class="mb-4 text-right text-gray-600 text-xs-">
        서울특별시 중구 을지로 65 대표이사/사장 : 유영상. 사업자등록번호 : 104-81-37224. 판매허가번호 : 중구 02923
      </p>
      <p v-if="$i18n.locale === 'en'" class="mb-4 text-right text-gray-600 text-xs-">
        65, Eulji-ro, Jung-gu, Seoul, Republic of Korea CEO: Ryu Young-sang. Business Registration Number: 104-81-37224. Marketing Authorization Number: Jung-gu 02923
      </p>

      <p v-if="$i18n.locale === 'ko'" class="leading-5 text-right text-gray-600 text-xs-">
        <span class="text-gray-700 text-xs-">이메일문의 : cmp-help@sktelecom.com</span>
      </p>
      <p v-if="$i18n.locale === 'en'" class="leading-5 text-right text-gray-600 text-xs-">
        <span class="text-gray-700 text-xs-">E-mail: cmp-help@sktelecom.com</span>
      </p>

      <NavBarTerms />

      <ToastNotice v-if="noticeVisible" :data="unread" @close="handleNoticeClose" />
    </div>
  </footer>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import VueCookies from 'vue-cookies';
import { isEmpty } from 'loadsh';
import NavBarMenu from './NavBarMenu.vue';
import NavBarTerms from './NavBarTerms.vue';
import ToastNotice from './ToastNotice.vue';

export default {
  components: { NavBarMenu, NavBarTerms, ToastNotice },
  props: {
    navigationItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      doNotShowNoticeAgain: false,
    };
  },
  computed: {
    ...mapState('notice', ['unread']),
    dashboard() {
      return this.$route.path.startsWith('/dashboard');
    },
    hasUnreadNotice() {
      return !isEmpty(this.unread);
    },
    noticeVisible() {
      return this.dashboard && this.hasUnreadNotice && !this.doNotShowNoticeAgain;
    },
  },
  watch: {
    dashboard() {
      if (this.dashboard) {
        this.fetchNew();
      }
    },
  },
  created() {
    this.doNotShowNoticeAgain = Boolean(VueCookies.get('do_not_show_notice_again'));
    if (this.dashboard && !this.doNotShowNoticeAgain) {
      this.fetchNew();
    }
  },
  methods: {
    ...mapActions('notice', ['fetchNew']),
    handleNoticeClose() {
      VueCookies.set('do_not_show_notice_again', true, '1d');
      this.doNotShowNoticeAgain = true;
    },
  },
};
</script>
