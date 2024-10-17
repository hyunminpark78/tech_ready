<template>
  <div class="p-8 bg-white border rounded-lg border-primary-200 dashboard-card">
    <div class="flex items-center justify-between">
      <h3 class="mb-1 font-bold">계약 라이선스 사용현황</h3>

      <p class="text-xs text-gray-500">최근 업데이트 : {{ updateDate | date }}(UTC)</p>
    </div>

    <template v-if="hasData">
      <p v-if="messageFilter" class="mb-2 text-sm text-primary-600">
        계약된 {{ licenseUsage.ctrtAsetCnt }}건의 Asset 중 {{ licenseUsage.asetUseCnt }}건을 사용하여
        {{ licenseUsage.asetUseCnt - licenseUsage.ctrtAsetCnt }}건이 초과되었습니다
      </p>

      <div class="flex h-64">
        <div class="flex flex-1 mr-5">
          <div class="flex flex-col w-6/12 text-center">
            <div class="flex justify-center flex-auto">
              <g-stack-chart
                :data="[licenseUsage]"
                :propsInfo="propsInfo2"
                chartTheme="dash_csmp_licenseUse"
                chartHeight="240"
              />
            </div>
            <span class="font-bold text-gray-500 text-xs-">이번달 사용량</span>
          </div>

          <div class="flex flex-col justify-between w-6/12 px-4">
            <div>
              <span class="font-bold text-gray-500 text-xs-">사용비율</span>
              <span class="text-2xl font-normal text-gray-700">{{ licenseUsage.asetUseRate | numberToFixed }}%</span>
            </div>
            <div>
              <span class="font-bold text-gray-500 text-xs-">평균 사용량</span>
              <span class="text-2xl font-normal text-gray-700">{{ licenseUsage.avgAsetCnt }}EA</span>
            </div>
            <div>
              <span class="font-bold text-gray-500 text-xs-">라이선스 계약</span>
              <span class="text-2xl font-normal text-gray-700">{{ licenseUsage.ctrtAsetCnt }}EA</span>
            </div>
          </div>
        </div>

        <div class="flex-1">
          <g-stack-chart :data="convertData" :propsInfo="propsInfo" chartTheme="dash_csmp_useState" chartHeight="250" />
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
    ...mapState('dashboard', ['licenseUsage']),
    hasData() {
      return this.licenseUsage.asetList !== undefined ? true : false; // FIXME
    },
    updateDate() {
      return this.licenseUsage.dataDtm !== undefined ? this.licenseUsage.dataDtm : '';
    },
    messageFilter() {
      if (this.licenseUsage.dataDtm !== undefined) {
        return this.licenseUsage.asetUseCnt > this.licenseUsage.ctrtAsetCnt ? true : false;
      }
      return false;
    },
    convertData() {
      let cData = _.cloneDeep(this.licenseUsage.asetList);
      let list = [];
      if (this.licenseUsage.asetList.length > 1) {
        cData = _.groupBy(cData, (x) => x.csmpId);
        _.map(cData, (data) => {
          let t = {};
          let sum = _.sumBy(data, (d) => d.asetUseCnt);
          t['csmpId'] = data[0].csmpId;
          t['asetUseCnt'] = sum;
          list.push(t);
        });

        list = _.sortBy(list, (l) => l.asetUseCnt).reverse();
      }
      return list;
    },
  },
  data() {
    return {
      propsInfo: {
        keyProp: 'csmpId',
        valueProp: 'asetUseCnt',
      },
      propsInfo2: {
        keyProp: 'stdDt',
        insProp: ['ctrtAsetCnt', 'asetUseCnt'],
        isFormat: true,
      },
    };
  },
};
</script>
