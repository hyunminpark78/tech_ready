<template>
  <Card :wrapper-class="costClass">
    <CardHeader type2 title="Usage" :updatedAt="useDate"></CardHeader>
    <template v-if="hasData === 'D'">
      <div class="flex justify-between mb-8 card-wrap-2">
        <div class="pt-8 bg-white w-6/12">
          <div class="flex items-center justify-between">
            <h3 class="mb-1">데이터 사용량</h3>
          </div>
          <!-- TODO: CHART -->
          <g-stack-chart
            chart-height="195"
            chart-theme="dash_mec_dataTraffic"
            :data="mecTrafficData"
            :props-info="mecTrafficInfo"
          />
        </div>

        <div class="pt-8 bg-white w-6/12">
          <div>
            <div class="flex justify-center mb-2">
              <OcpButton
                small
                class="px-2.5 py-1 mr-3 h-8"
                :number="400"
                text="Latency"
                :active="networkType === 'L'"
                @click="checkNetworkType('L')"
              />
              <OcpButton
                small
                class="px-2.5 py-1 mr-3 h-8"
                :number="400"
                text="N/W Throughtput"
                :active="networkType === 'N'"
                @click="checkNetworkType('N')"
              />
            </div>
          </div>
          <!-- TODO: CHART -->
          <g-multi-chart
            chart-height="195"
            chart-theme="dash_mec_network"
            :data="mecNetworkData"
            :props-info="mecNetworkInfo"
          />
        </div>
      </div>

      <div class="flex justify-between mb-8 card-wrap-2">
        <div class="pt-8 bg-white">
          <div class="flex items-center" style="justify-content: space-around; margin-left: -4rem">
            <h3 class="mb-1" style="margin-left: 1rem">계약 사이트</h3>
            <h3 class="mb-1">Total ME APP</h3>
            <h3 class="mb-1" style="margin-left: 6rem">CPU</h3>
            <h3 class="mb-1">MEMORY</h3>
            <h3 class="mb-1">STORAGE</h3>
          </div>
          <!-- TODO: CHART -->
          <div class="flex justify-center flex-auto">
            <!-- eslint-disable-next-line vue/no-v-html-->
            <div class="relative flex items-center justify-center w-1/6 h-3">
              <div class="flex">
                <span class="text-2xl">{{ ctgry[0].ctgryIdCnt }}</span>
              </div>
            </div>
            <!-- eslint-disable-next-line vue/no-v-html-->
            <div class="relative flex items-center w-1/2 h-3">
              <g-pie-chart chart-height="195" chart-theme="dash_usageCost" :propsInfo="mecAppInfo" :data="mecAppData" />
            </div>
            <div style="margin-left: 1%">
              <g-stack-chart
                chart-height="195"
                chart-theme="dash_mec_useStat"
                :propsInfo="mecStat1Info"
                :data="mecStatData"
              />
            </div>
            <div class="flex items-center justify-center" style="flex-direction: column; margin-left: -2.5rem">
              <div class="text-2xl font-normal text-gray-700">{{ statMap.cpuPer }}%</div>
              <div class="text-xs font-normal text-gray-700">{{ statMap.cpuCnt }}/{{ statMap.maxCpuCnt }}</div>
            </div>
            <div style="margin-right: 1%">
              <g-stack-chart
                chart-height="195"
                chart-theme="dash_mec_useStat"
                :propsInfo="mecStat2Info"
                :data="mecStatData"
              />
            </div>
            <div class="flex items-center justify-center" style="flex-direction: column; margin-left: -2.5rem">
              <div class="text-2xl font-normal text-gray-700">{{ statMap.memPer }}%</div>
              <div class="text-xs font-normal text-gray-700">{{ statMap.memSizeVal }}/{{ statMap.maxMemSizeVal }}</div>
            </div>
            <div style="margin-left: 1%">
              <g-stack-chart
                chart-height="195"
                chart-theme="dash_mec_useStat"
                :propsInfo="mecStat3Info"
                :data="mecStatData"
              />
            </div>
            <div class="flex items-center justify-center" style="flex-direction: column; margin-left: -2.5rem">
              <div class="text-2xl font-normal text-gray-700">{{ statMap.strgPer }}%</div>
              <div class="text-xs font-normal text-gray-700">
                {{ statMap.strgSizeVal }}/{{ statMap.maxStrgSizeVal }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="hasData === 'L'">
      <div class="relative" style="height: 195px">
        <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
          <div class="mb-4 loading_rotate">
            <span class="loadingcolor"></span>
          </div>
          <div class="loading_txt">Loading...</div>
        </div>
      </div>
    </template>

    <!-- No Data -->
    <template v-else>
      <div class="flex justify-between">
        <div>
          <!-- <h3 class="mb-1 font-bold">이번달 사용 비용</h3> -->
        </div>
        <div>
          <!-- <p class="text-xs text-right text-gray-500">최근 업데이트 : 2021.05.28 11:00 AM</p> -->
        </div>
      </div>

      <div class="flex flex-col items-center justify-center" style="height: 195px">
        <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
        <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
      </div>
    </template>
    <!-- // No Data -->
  </Card>
</template>

<script>
import Card, { CardHeader, CardMain, CardMessage } from '@/components/Card';
import { mapActions, mapState } from 'vuex';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
import OcpButton from '@/components/shared/OcpButton.vue';
import Select from '@/components/Select';
import moment from 'moment';

export default {
  components: {
    Card,
    CardHeader,
    CardMain,
    CardMessage,
    Select,
    OcpButton,
  },
  data() {
    return {
      selectData: [],
      networkType: 'L',
      chartType: '',
      mecTrafficInfo: {
        dateProp: 'stdDt',
        keyProp: 'ctrtId',
        nameProp: 'ctrtNm',
        valueProp: 'orgIdByVal',
      },
      mecNetworkInfo: {
        keyProp: 'stdDt',
        dateProp: 'stdDt',
        insProp: ['avgData', 'maxData', 'minData'],
        isFormat: true,
      },
      mecAppInfo: {
        keyProp: 'appStatNm',
        valueProp: 'compnCnt',
      },
      mecStat1Info: {
        keyProp: 'stdDt',
        insProp: ['cpuCnt', 'maxCpuCnt'],
        isFormat: true,
      },
      mecStat2Info: {
        keyProp: 'stdDt',
        insProp: ['memSizeVal', 'maxMemSizeVal'],
        isFormat: true,
      },
      mecStat3Info: {
        keyProp: 'stdDt',
        insProp: ['strgSizeVal', 'maxStrgSizeVal'],
        isFormat: true,
      },
      mecTrafficData: [],
      mecNetworkData: [],
      mecAppData: [],
      mecStatData: [],
      statList: [],
      statMap: {},
      selectCategory: 'CTRT',
      usageType: 'ACNT',
      billYm: moment().subtract(3, 'days').format('YYYYMM'),
      totalCost: '',
      ctrtLength: 0,
    };
  },
  computed: {
    ...mapState('dashboard', ['mecDataTraffic', 'mecNetwork', 'mecApp', 'mecStat', 'ctgry']),
    hasData() {
      this.networkType = 'L';
      let cData = _.cloneDeep(this.mecDataTraffic);
      /** E(Empty) / L(lodaing) / D(data) */
      let lState = '';

      if (cData.length === 0 || cData === undefined || this.mecStat === undefined || this.mecStat.length === 0) {
        lState = 'E';
      } else {
        lState = 'D';
      }

      // 데이터세팅
      this.convertData();
      return lState;
    },
    // getTotalPrice() {},
    useDate() {
      return moment().format('YYYY.MM.DD 00:00');
    },
    useUpdateDate() {
      if (this.hasData) {
        return this.period.billYm !== undefined ? this.period.stdDt : '';
      }
      return '';
    },
    costClass() {
      return 'p-8 mb-8 bg-white border rounded-lg border-primary-200';
    },
  },
  created() {
    // TODO: call api
    // setTimeout(() => {
    //   this.selectData = [];
    // }, 1000);
    this.chartType = 'stack';
  },
  methods: {
    ...mapActions('dashboard', ['fetchUsageFilter', 'fetchUsageCost']),
    chgChartType(type) {
      this.chartType = type;
    },
    targetDatePrice(value) {
      this.totalCost = value;
    },
    convertData() {
      // 데이터 사용량
      this.mecTrafficData = this.mecDataTraffic;

      // Latency or T/w Output
      this.mecNetworkData = _.filter(this.mecNetwork, (i) => i.prfmNm === 'LATENCY_TOT');

      // APP사용량
      this.mecAppData = this.mecApp;

      // use stat 데이터
      if (this.mecStat !== undefined && this.mecStat.length > 0) {
        this.statMap.stdDt = moment().format('YYYMMDD');
        this.statMap.maxCpuCnt = this.mecStat[0].maxCpuCnt;
        this.statMap.maxMemSizeVal = this.mecStat[0].maxMemSizeVal;
        this.statMap.maxStrgSizeVal = this.mecStat[0].maxStrgSizeVal;
        this.statMap.cpuCnt = this.mecStat[0].cpuCnt;
        this.statMap.memSizeVal = this.mecStat[0].memSizeVal;
        this.statMap.strgSizeVal = this.mecStat[0].strgSizeVal;
        this.statMap.cpuPer = (this.mecStat[0].cpuCnt / this.mecStat[0].maxCpuCnt).toFixed(2) * 100;
        this.statMap.memPer = (this.mecStat[0].memSizeVal / this.mecStat[0].maxMemSizeVal).toFixed(2) * 100;
        this.statMap.strgPer = (this.mecStat[0].strgSizeVal / this.mecStat[0].maxStrgSizeVal).toFixed(2) * 100;
        this.statList.push(this.statMap);
        this.mecStatData = this.statList;
      }
    },
    checkNetworkType(type) {
      if (type === 'N') {
        this.networkType = 'N';
        this.mecNetworkData = _.filter(this.mecNetwork, (i) => i.prfmNm === 'TRAFFIC_TOT');
      } else {
        this.networkType = 'L';
        this.mecNetworkData = _.filter(this.mecNetwork, (i) => i.prfmNm === 'LATENCY_TOT');
      }
    },
  },
};
</script>
