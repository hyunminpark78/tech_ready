<template>
  <Card wrapper-class="flex justify-between card-wrap-3" border="none">
    <LinkItem
      key="OpsNow"
      title="OpsNow"
      title-class="mb-5 text-2xl text-center text-gray-700"
      :href="ssoOpsNow ? urls.OPS_NOW_SSO : urls.OPS_NOW"
      :icon-src="require('@/assets/images/ico-bnn-opsnow.svg')"
      :description="'복잡한 Multi Cloud, OpsNow에서<br>Professional하게 관리하세요!'"
    />
    <!-- <LinkItem
      key="CSMP"
      title="CSMP"
      title-class="mb-3 text-2xl text-center text-gray-700"
      :href="ssoCsmp ? urls.CSMP_SSO : urls.CSMP"
      :icon-src="require('@/assets/images/ico-bnn-csmp.svg')"
      :description="'Cloud 보안의 시각화를 통해<br>Multi Cloud / Multi Region 환경의<br>보안 이슈를 선제적으로 점검 하세요!'"
    /> -->
    <LinkItem
      key="MBMP"
      title="MBMP"
      title-class="mb-5 text-2xl text-center text-gray-700"
      :href="ssoMec ? urls.MBMP_SSO : urls.MBMP"
      :icon-src="require('@/assets/images/ico-bnn-mbmp.svg')"
      :description="'Mobile Edge Cloud 환경 MBMP에서<br>좀더 정밀하게 관리하실 수 있습니다!'"
    />
    <LinkItem
      key="Market Place"
      title="5GX Cloud<br/ >Market Place"
      title-class="mb-3 text-2xl leading-6 text-center text-gray-700"
      :href="urls.MARKET_PLACE"
      :icon-src="require('@/assets/images/ico-bnn-maeketplace.svg')"
      :description="'다양한 SaaS 상품<br>SKT 5GX Cloud Marketplace에서<br>간편하게 구독하세요.'"
      description-class="leading-5 text-center text-xs- text-primary-800"
    />
  </Card>
</template>

<script>
import { mapState } from 'vuex';
import constants from '@/constants/constants';
import Card from '@/components/Card';
import LinkItem from './LinkItem.vue';

export default {
  components: { Card, LinkItem },
  computed: {
    ...mapState('user', ['ssoStatus']),
    urls() {
      return constants.URLS;
    },
    ssoOpsNow() {
      return this.ssoStatus.find((s) => s.name === 'OpsNow').available;
    },
    ssoCsmp() {
      return this.ssoStatus.find((s) => s.name === 'CSMP').available;
    },
    ssoMec() {
      return this.ssoStatus.find((s) => s.name === 'MEC').available;
    },
  },
};
</script>
