<template>
  <div class="p-8 bg-white border rounded-lg border-primary-200 dashboard-card">
    <div class="flex items-center justify-between">
      <h3 class="mb-1 font-bold">일별 Asset Count 현황</h3>

      <p class="text-xs text-gray-500">최근 업데이트 : {{ updateDate | date }}(UTC)</p>
    </div>

    <template v-if="hasData">
      <p class="mb-7 text-sm text-primary-600">계정별 사용현황</p>
      <g-stack-chart
        class="mt-5"
        :data="dayAsetCntList"
        :propsInfo="propsInfo"
        chartTheme="dash_csmp_dayUseState"
        chartHeight="227"
      />
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
import moment from 'moment';
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('dashboard', ['licenseUsage', 'dayAsetCntList']),
    hasData() {
      return this.dayAsetCntList.length > 0 ? true : false;
    },
    updateDate() {
      return this.licenseUsage.dataDtm !== undefined ? this.licenseUsage.dataDtm : '';
    },
  },
  data() {
    return {
      propsInfo: {
        dateProp: 'stdDt',
        keyProp: 'csmpId',
        valueProp: 'asetUseCnt',
      },
    };
  },
};
</script>
