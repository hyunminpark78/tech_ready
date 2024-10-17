<template>
  <div class="p-8 mb-12 bg-white border rounded-lg border-primary-200 dashboard-card">
    <template v-if="hasData">
      <div class="flex items-center justify-between">
        <h3 class="mb-1 font-bold">Cloud 보안 Rule 위반 리소스(Top10)</h3>

        <div class="flex items-center">
          <a
            href="https://www.adtcaps-csmp.co.kr/saml/login"
            class="flex items-center ml-6 text-sm text-gray-500"
            target="_blank"
          >
            <span class="mr-2"> 자세히 보기 </span>
            <img src="@/assets/images/ico-link.svg" alt="." />
          </a>
        </div>
      </div>

      <p class="mb-2 text-sm text-primary-600">“{{ rankData }}” 리소스에서 가장 많은 위반사항이 검출되었습니다.</p>

      <g-stack-chart :data="ruleViolate" :propsInfo="propsInfo" chartTheme="dash_csmp_ruleViolate" chartHeight="295" />
    </template>

    <!-- No Data -->
    <template v-else>
      <div class="flex items-center justify-between">
        <h3 class="mb-1 font-bold">Cloud 보안 Rule 위반 리소스 (Top10)</h3>
      </div>

      <div class="flex flex-col items-center justify-center" style="height: 293px">
        <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
        <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
      </div>
    </template>
    <!-- // No Data -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('dashboard', ['ruleViolate']),
    hasData() {
      return this.ruleViolate.length > 0 ? true : false;
    },
    rankData() {
      return this.ruleViolate.length > 0 ? this.ruleViolate[0].rsrcNm : '';
    },
  },
  data() {
    return {
      propsInfo: {
        keyProp: 'rsrcNm',
        insProp: ['viltCnt'],
        isFormat: true,
      },
    };
  },
};
</script>
