<template>
  <div v-if="category" class="dashboard-card rounded-lg mb-4">
    <!-- tab -->
    <div class="flex tab-one">
      <button
        v-for="performanceCategory in performanceCategoryList"
        :key="performanceCategory.code"
        :ref="performanceCategory.code"
        :class="[
          ...getCategoryButtonDefaultClassList(performanceCategory.rsrcType),
          {
            clicked: category === performanceCategory.rsrcType,
            unclicked: category !== performanceCategory.rsrcType,
          },
        ]"
        :disabled="category === performanceCategory.rsrcType"
        @click="() => updateCategory(performanceCategory.rsrcType)"
      >
        {{ performanceCategory.name }}
      </button>
    </div>
    <!-- //tab -->

    <!-- grid -->
    <div class="box-wrap grid3-wrap">
      <!-- col -->
      <div class="col">
        <div class="title" style="display: flex; align-items: center">
          <h4 class="tit-wrap">{{ $t('resource.performanceTrend') }}</h4>
          <!-- tooltip -->
          <div v-if="isTooltipEnable" class="tooltip-wrap">
            <button class="ico jsTooltip1" @click="isTooltipOpen = !isTooltipOpen"><span>툴팁 열기</span></button>
            <div
              class="tooltip-layer"
              style="width: 600px !important; white-space: pre-wrap !important; padding: 15px 15px 5px !important"
              :style="isTooltipOpen ? 'display: block' : 'display: none'"
            >
              {{ tooltipMsg }}
              <button class="close jsTooltipClose1" @click="isTooltipOpen = false">툴팁 닫기</button>
            </div>
          </div>
          <!-- //tooltip -->
        </div>
        <!-- MySQL Flexible Server 제공 불가 문구 표시 -->
        <div v-show="cspTypCd === 'AZURE' && category === 'Microsoft.DBforMySQL/flexibleServers'" class="title">
          <p class="info" style="margin-top: 20px">{{ $t('resource.provideUtilizationInfo') }}</p>
        </div>
        <div v-show="isLoading" class="relative" style="width: 100%; height: 264px">
          <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
            <div class="mb-4 loading_rotate">
              <span class="loadingcolor"></span>
            </div>
            <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
          </div>
        </div>
        <GAreaPerformanceChart
          v-show="!isLoading && chartData && chartData.length > 0"
          chart-height="264"
          :chart-theme="category"
          :data="chartData"
          :props-info="propsInfo"
        />
        <div
          v-show="!isLoading && (!chartData || chartData.length === 0)"
          class="flex-1 ml-4 flex-1 flex justify-center items-center h-full"
          style=""
        >
          <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
          <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
        </div>
      </div>
      <!-- //col -->
    </div>
    <!-- //grid -->
  </div>
</template>
<script>
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import GAreaPerformanceChart from '@/pages/Rsrc/Performance/GAreaPerformanceChart';
import performanceService from '@/services/performanceService';
import { mapActions, mapGetters, mapState } from 'vuex';
import { setApiConfig } from '@/library/APICaller';
import _ from 'lodash';
import axios from 'axios';

export default {
  components: {
    GAreaPerformanceChart,
  },
  data() {
    return {
      isTooltipOpen: false,
      chartData: [],
      propsInfo: {
        dateProp: 'timeStmp',
        insProp: ['cpu', 'mem', 'disk'],
        isFormat: true,
      },
      param: {
        cmpnId: '',
        prvrCd: '',
        rsrcType: '',
        type: '',
        from: '',
        to: '',
        accounts: [],
        regions: [],
        ocpSvcGrps: [],
      },
      isLoading: true,
      chartApiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
    };
  },
  computed: {
    ...mapState('performance', {
      filter: 'filter',
      category: 'category',
      updatePerformanceChart: 'updatePerformanceChart',
      companyId: 'selectedCustCorpIds',
      svcGrpSelectedCustCorpIds: 'svcGrpSelectedCustCorpIds',
      dateType: 'dateType',
      dateRange: 'dateRange',
      cspReference: 'cspReference',
    }),
    ...mapGetters('performance', ['cspTypCd']),
    isTooltipEnable() {
      const tooltipEnableCategory = ['rds', 'ebs', 'Microsoft.Compute/virtualMachines'];
      return tooltipEnableCategory.includes(this.category);
    },
    tooltipMsg() {
      if (this.category === 'rds') {
        return (
          `\n${this.$t('resource.rdsIops')}\n` +
          `  - ${this.$t('resource.havingDecimalPoints')}\n` +
          `    ex) ${this.$t('resource.iOPSHalf')}`
        );
      }
      if (this.category === 'ebs') {
        return (
          `\n${this.$t('resource.volumnQueueLength')}\n` +
          `  - ${this.$t('resource.volumnQueueBuildUp')}\n` +
          `  - ${this.$t('resource.indicateMaxMin')}\n` +
          `${this.$t('resource.volumnReadIops')}\n` +
          `VolumeWrite Bytes : ${this.$t('resource.numberBytesWrite')}\n` +
          `  - ${this.$t('resource.correspondingNumberIndicates')}\n` +
          `VolumeWrite IOPS : ${this.$t('resource.iopsForWriteJobs')}`
        );
      }
      if (this.category === 'Microsoft.Compute/virtualMachines') {
        return `\n${this.$t('resource.toViewMemory')}`;
      }
      return '';
    },
    performanceCategoryMap() {
      const performanceCategoryMap = new Map();
      this.cspReference[this.cspTypCd].categoryList
        .filter((category) => category.isInPerformance)
        .forEach((category) =>
          performanceCategoryMap.set(category.rsrcType, _.pick(category, ['code', 'name', 'rsrcType']))
        );
      return performanceCategoryMap;
    },
    performanceCategoryList() {
      return Array.from(this.performanceCategoryMap.values());
    },
    defaultCategory() {
      return this.performanceCategoryList[0].rsrcType;
    },
  },
  watch: {
    cspTypCd: function () {
      this.initCategory();
    },
    category: function () {
      this.isTooltipOpen = false;
    },
    updatePerformanceChart: async function () {
      if (this.updatePerformanceChart) {
        this.fetchUpdatePerformanceChart(false);
        await this.setChartData();
      }
    },
  },
  created() {
    this.initCategory();
  },
  mounted() {
    this.initParam();
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
  },
  methods: {
    ...mapActions('performance', ['fetchCategory', 'fetchUpdatePerformanceChart']),
    getCategoryButtonDefaultClassList(category) {
      const defaultClassList = [
        'flex',
        'items-center',
        'justify-center',
        'w-full',
        'py-5',
        'bg-white',
        'border',
        'border-gray-300',
        'font-bold',
        'text-base',
      ];
      const classListByIndex = [];
      const index = this.performanceCategoryList.findIndex(
        (performanceCategory) => performanceCategory.rsrcType === category
      );

      if (index === 0) {
        classListByIndex.push('rounded-tl-lg');
      } else {
        classListByIndex.push('border-l-0');
      }
      if (index === this.performanceCategoryList.length - 1) {
        classListByIndex.push('rounded-tr-lg');
      }

      return [...defaultClassList, ...classListByIndex];
    },
    setChartData: async function () {
      this.isLoading = true;
      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.chartApiConfig.cancelTokenSource) {
        this.chartApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.chartApiConfig);

      this.initParam();
      if (!this.companyId.length || _.isNil(this.companyId[0].id)) {
        this.isLoading = false;
        return;
      }

      this.param.cmpnId = this.companyId[0].id;
      this.param.prvrCd = this.cspReference[this.cspTypCd].prvrCd;
      this.param.rsrcType = this.category;
      this.param.type = this.dateType === 'DALY' ? 'day' : 'month';
      this.param.from = this.dateRange.startDate;
      this.param.to = this.dateRange.endDate;
      this.param.accounts = this.filter.acntIdList ? this.filter.acntIdList : [];
      this.param.regions = this.filter.regionList ? this.filter.regionList : [];
      this.param.svcGrps = [];

      if (this.filter.svcGrpList.length > 0) {
        this.filter.svcGrpList.forEach((item) => {
          this.param.ocpSvcGrps.push(item.id);
        });
      }

      try {
        const result = await performanceService.fetchChartData(this.param, {
          cancelToken: this.chartApiConfig.cancelToken,
        });

        if ('ok' === result.data.data.status) {
          this.propsInfo.insProp = result.data.data.result.chartOption.valueField;
          this.chartData = result.data.data.result.chartData;

          for (let item of this.chartData) {
            if (item.mem === null) {
              item.mem = 0;
            }
            if (item.cpu === null) {
              item.cpu = 0;
            }
            if (item.disk === null) {
              item.disk = 0;
            }
            if (!item.line1) {
              item.line1 = 0;
            }
            if (!item.line2) {
              item.line2 = 0;
            }
            if (!item.line3) {
              item.line3 = 0;
            }
          }

          let chart = am4core.create('performanceChart', am4charts.XYChart);

          // Create x-axis
          let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
          dateAxis.renderer.minGridDistance = 50;

          // Create y-axis
          let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

          // Create line series
          let lineSeries = chart.series.push(new am4charts.LineSeries());
          lineSeries.dataFields.valueY = 'value';
          lineSeries.dataFields.dateX = 'date';
          lineSeries.name = 'Value';
          lineSeries.strokeWidth = 2;

          // Add a bullet
          let bullet = lineSeries.bullets.push(new am4charts.Bullet());
          let circle = bullet.createChild(am4core.Circle);
          circle.radius = 4;
          circle.fill = am4core.color('#fff');

          // Save chart instance to `this` so we can clean it up later
          this.chart = chart;
        }
        this.isLoading = false;
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching chart data:', e);
          this.isLoading = false;
        }
      }
    },
    beforeDestroy() {
      // Clean up chart instance and remove it from the DOM
      if (this.chart) {
        this.chart.dispose();
      }
    },
    updateCategory(category) {
      this.fetchCategory(category);
      this.$nextTick(() => this.$emit('onCategoryChanged'));
    },
    initCategory() {
      if (!this.performanceCategoryMap.has(this.category)) {
        this.fetchCategory(this.defaultCategory);
      }
    },
    initParam() {
      this.param = {
        cmpnId: '',
        prvrCd: '',
        rsrcType: '',
        type: '',
        from: '',
        to: '',
        accounts: [],
        regions: [],
        ocpSvcGrps: [],
      };
      this.chartData = [];
    },
  },
};
</script>
<style scoped>
.tooltip-layer {
  white-space: pre-line;
}
</style>
