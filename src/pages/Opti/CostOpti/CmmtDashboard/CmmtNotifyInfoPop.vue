<template>
  <div class="notify-wrap" :class="visible ? '' : 'hidden'">
    <strong class="tit">{{ $t('notify.notify') }}</strong>
    <ul>
      <li v-if="i18n().locale === 'ko'" class="text-primary-400">
        커버리지 70%<span class="small">(기본)</span> 미만 알림
      </li>
      <li v-if="i18n().locale === 'en'" class="text-primary-400">
        Notification below 70%<span class="small">(default)</span> coverage
      </li>
      <li>{{ $t('notify.oppoCostIncrease') }}</li>
      <li>{{ $t('notify.analyzeCauseChanges') }}</li>
      <li>{{ $t('notify.reviewAdditionalWays') }}</li>
    </ul>
    <strong class="tit">{{ $t('notify.notiBasedUtilization') }}</strong>
    <ul>
      <li v-if="i18n().locale === 'ko'" class="text-primary-400">
        사용률 70%<span class="small">(기본)</span> 미만 알림 / 절감액 0원 미만 알림
      </li>
      <li v-if="i18n().locale === 'en'" class="text-primary-400">
        Notification of usage rate less than 70%<span class="small">(default)</span> / Notification of savings less than
        0 won
      </li>
      <li>{{ $t('notify.reducedResourceUse') }}</li>
      <li>{{ $t('notify.analyzeCauseChanges') }}</li>
    </ul>
    <strong class="tit">{{ $t('notify.contractRecommendNoti') }}</strong>
    <ul>
      <li v-if="i18n().locale === 'ko'" class="text-primary-400">
        커버리지 80%<span class="small">(기본)</span> 미만 약정 추천 알림
      </li>
      <li v-if="i18n().locale === 'en'" class="text-primary-400">
        Notification of contract recommendation for less than 80%<span class="small">(default)</span> coverage
      </li>
      <li>{{ $t('notify.considerWaysSaveMoney') }}</li>
    </ul>
    <strong class="tit">{{ $t('notify.contractExpireNoti') }}</strong>
    <ul>
      <li v-if="i18n().locale === 'ko'" class="text-primary-400">
        약정 만료 60일<span class="small">(기본)</span> 전 알림
      </li>
      <li v-if="i18n().locale === 'en'" class="text-primary-400">
        Notification 60 days<span class="small">(default)</span> before contract expiration
      </li>
      <li>{{ $t('notify.checkExpiringContracts') }}</li>
      <li>{{ $t('notify.reviewContractPurchases') }}</li>
    </ul>
  </div>
</template>
<script>
import { i18n } from '../../../../../public/locales/i18n';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    i18n() {
      return i18n;
    },
  },
};
</script>
<style scoped>
.text-primary-400 > .small {
  font-size: 12px;
}
</style>
