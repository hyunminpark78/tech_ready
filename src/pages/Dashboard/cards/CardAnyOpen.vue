<template>
  <div class="p-8 bg-white border rounded-lg border-primary-200 dashboard-card">
    <div class="flex items-center justify-between">
      <h3 class="mb-1 font-bold">Security Group의 Any Open 현황</h3>

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
        AWS SG {{ getAwsAoData }}개, Azure NSG {{ getAzureAoData }}개 조치가 필요합니다.
      </p>

      <div class="flex">
        <div class="flex-1 mr-5">
          <g-stack-chart
            :data="getData('AWS')"
            :propsInfo="propsInfo"
            chartTheme="dash_csmp_anyOpen_status"
            chartHeight="293"
          />
        </div>
        <div class="flex-1">
          <div class="flex-1 mr-5">
            <g-stack-chart
              :data="getData('AZURE')"
              :propsInfo="propsInfo"
              chartTheme="dash_csmp_anyOpen_status"
              chartHeight="293"
            />
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
export default {
  computed: {
    ...mapState('dashboard', ['anyOpen']),
    hasData() {
      return this.anyOpen.length > 0 ? true : false;
    },
    getAwsAoData() {
      if (this.anyOpen.length > 0) {
        for (let i = 0; i < this.anyOpen.length; i++) {
          if (this.anyOpen[i].cspTypCd === 'AWS') {
            return this.anyOpen[i].aoCnt;
          }
        }
      }
      return 0;
    },
    getAzureAoData() {
      if (this.anyOpen.length > 0) {
        for (let i = 0; i < this.anyOpen.length; i++) {
          if (this.anyOpen[i].cspTypCd === 'AZURE') {
            return this.anyOpen[i].aoCnt;
          }
        }
      }
      return 0;
    },
  },
  methods: {
    getData(param) {
      if (this.anyOpen.length > 0) {
        return _.filter(this.anyOpen, (csp) => csp.cspTypCd === param);
      }
    },
  },
  data() {
    return {
      propsInfo: {
        keyProp: 'cspTypCd',
        insProp: ['aoCnt', 'unusedAoCnt'],
        isFormat: true,
      },
    };
  },
};
</script>
