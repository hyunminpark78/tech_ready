<template>
  <div class="p-8 bg-white border rounded-lg border-primary-200 dashboard-card">
    <div class="flex items-center justify-between">
      <h3 class="mb-1 font-bold">Cloud 보안 Rule 점검 결과</h3>

      <div v-if="hasData" class="flex items-center">
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

    <template v-if="hasData">
      <p class="mb-2 text-sm text-primary-600">
        Cloud 보안설정에 대해 총 {{ ruleCheck.totCnt }}건의 조치가 필요합니다.
      </p>

      <div class="flex flex-wrap h-64 mt-8 dashboard-chart-2">
        <div class="relative flex items-center justify-center w-1/2 h-32 border-b border-r border-primary-200">
          <span class="absolute text-sm text-gray-700">Critical alerts</span>
          <div class="flex items-center">
            <img src="@/assets/images/ico-critical.svg" alt="." />
            <span class="ml-2 text-2xl font-bold text-chart1">{{ ruleCheck.crLvlCnt }}</span>
          </div>
        </div>
        <div class="relative flex items-center justify-center w-1/2 h-32 border-b border-primary-200">
          <span class="absolute text-sm text-gray-700">High alerts</span>
          <div class="flex items-center">
            <img src="@/assets/images/ico-high.svg" alt="." />
            <span class="ml-2 text-2xl font-bold text-chart1">{{ ruleCheck.hiLvlCnt }}</span>
          </div>
        </div>
        <div class="relative flex items-center justify-center w-1/2 h-32 border-r border-primary-200">
          <span class="absolute text-sm text-gray-700">Medium alerts</span>
          <div class="flex items-center">
            <img src="@/assets/images/ico-midium.svg" alt="." />
            <span class="ml-2 text-2xl font-bold text-chart2">{{ ruleCheck.mdLvlCnt }}</span>
          </div>
        </div>
        <div class="relative flex items-center justify-center w-1/2 h-32">
          <span class="absolute text-sm text-gray-700">Low alerts</span>
          <div class="flex items-center">
            <img src="@/assets/images/ico-low.svg" alt="." />
            <span class="ml-2 text-2xl font-bold text-chart2">{{ ruleCheck.lwLvlCnt }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- No Data -->
    <template v-else>
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
import moment from 'moment';
export default {
  computed: {
    ...mapState('dashboard', ['ruleCheck']),
    hasData() {
      return this.ruleCheck.crLvlCnt !== undefined ? true : false;
    },
  },
};
</script>
