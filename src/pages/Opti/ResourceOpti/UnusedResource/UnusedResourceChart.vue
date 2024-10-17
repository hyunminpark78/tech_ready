<template>
  <div v-if="category" class="dashboard-card rounded-lg mb-4">
    <!-- tab -->
    <div class="flex tab-one">
      <button
        v-for="unusedResourceCategory in unusedResourceCategoryList"
        :key="unusedResourceCategory.code"
        :ref="unusedResourceCategory.code"
        :class="[
          ...getCategoryButtonDefaultClassList(unusedResourceCategory.rsrcType),
          {
            clicked: category === unusedResourceCategory.rsrcType,
            unclicked: category !== unusedResourceCategory.rsrcType,
          },
        ]"
        :disabled="category === unusedResourceCategory.rsrcType"
        @click="() => updateCategory(unusedResourceCategory.rsrcType)"
      >
        {{ unusedResourceCategory.name }}
      </button>
    </div>
    <!-- //tab -->

    <!-- grid -->
    <div class="box-wrap grid3-wrap">
      <!-- col -->
      <div class="col" style="min-height: 247px; padding-bottom: 15px">
        <div class="title">
          <p class="info mt15">{{ $t('optimization.amountShownEstimate') }}</p>
        </div>
        <div v-show="isLoading" class="relative" style="width: 100%; height: 130px">
          <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
            <div class="mb-4 loading_rotate">
              <span class="loadingcolor"></span>
            </div>
            <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
          </div>
        </div>
        <div v-show="!isLoading" class="box">
          <div class="ti">
            <strong class="text-primary-400">{{ $t('optimization.estimatedMonthlySavings') }}</strong>
            <div class="text-gray-500">{{ $t('optimization.expectedMonthlySavings') }}</div>
          </div>
          <div v-if="totalCnt !== 0" class="pr">
            ￦<span id="jsCount9">{{ numberCutDecimal(savgCostDesc * exchangeRate) }}</span>
          </div>
          <div v-else class="pr">
            <img style="margin: auto" src="@/assets/images/ico-nodata-chart.svg" alt="." />
            <p
              class="mt-3 text-gray-700 text-center"
              style="font-weight: normal !important; font-size: 16px !important"
            >
              {{ $t('common.paragraph.noDataDisplay') }}
            </p>
          </div>
        </div>
        <div class="sub-title">
          <p class="info mt15">{{ $t('optimization.dependingOnActualWorkload') }}</p>
        </div>
      </div>
      <!-- //col -->
      <!-- col -->
      <div class="col" style="padding-bottom: 15px; min-height: 247px">
        <div class="title" style="max-height: 21px">
          <div style="margin-top: 15px; display: flex; align-items: center">
            <p v-if="$i18n.locale === 'ko'" class="info mt15">
              총 {{ totalCnt }}개의 {{ unusedResourceCategoryMap.get(category).name }} 중,
              <span class="text-secondary">{{ unusedRsrc }}개의 미사용 자원</span>을 찾았습니다.
            </p>
            <p v-if="$i18n.locale === 'en'" class="info mt15">
              <span class="text-secondary">{{ unusedRsrc }} unused resource(s) was(were) found</span>
              out of a total of {{ totalCnt }} {{ unusedResourceCategoryMap.get(category).name }}
            </p>
            <!-- tooltip -->
            <div class="tooltip-wrap" style="margin-bottom: 19px">
              <button class="ico jsTooltip1" @click="isTooltipOpen = !isTooltipOpen"><span>툴팁 열기</span></button>
              <div
                class="tooltip-layer pos_r"
                style="width: 435px !important; white-space: pre-line"
                :style="isTooltipOpen ? 'display: block' : 'display: none'"
              >
                <strong class="ti">{{ $t('optimization.unusedResources') }}</strong>
                {{ tooltipMsg }}
                <button class="close jsTooltipClose1" @click="isTooltipOpen = false">툴팁 닫기</button>
              </div>
            </div>
            <!-- //tooltip -->
          </div>
        </div>
        <div v-show="isLoading" class="relative" style="width: 100%; height: 220px">
          <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
            <div class="mb-4 loading_rotate">
              <span class="loadingcolor"></span>
            </div>
            <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
          </div>
        </div>
        <div
          v-show="!isLoading && totalCnt !== 0"
          id="unusedChart"
          style="height: 100%; width: 100%; min-height: 220px"
        ></div>
        <div
          v-show="!isLoading && totalCnt === 0"
          class="flex items-center justify-center"
          style="height: 100%; width: 100%; min-height: 220px"
        >
          <div class="text-center" style="margin: auto">
            <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
            <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
          </div>
        </div>
      </div>
      <!-- //col -->
    </div>
    <!-- //grid -->
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import resourceOptiService from '@/services/resourceOptiService';
import { numberProcess, chartColorByNumber, numberCutDecimal } from '../ResourceOptiCommon';
import { setApiConfig } from '@/library/APICaller';
import _ from 'lodash';
import axios from 'axios';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  data() {
    return {
      isTooltipOpen: false,
      totalCnt: 0,
      unusedRsrc: 0,
      unusedRt: 0,
      savgCostDesc: 0,
      param: {
        vndr: '',
        cmpnId: '',
        rsrcType: '',
        gridType: 'unused',
        accList: [],
        rgnList: [],
        ocpSvcGrps: [],
      },
      exchangeRate: 0,
      isLoading: true,
      chartApiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
    };
  },
  computed: {
    ...mapState('resourceOpti', {
      filter: 'filter',
      category: 'category',
      updateUnusedResourceChart: 'updateUnusedResourceChart',
      isSearch: 'isSearch',
      companyId: 'selectedCustCorpIds',
      svcGrpSelectedCustCorpIds: 'svcGrpSelectedCustCorpIds',
      cspReference: 'cspReference',
    }),
    ...mapGetters('resourceOpti', ['cspTypCd']),
    tooltipMsg() {
      const instanceCategoryList = ['ec2', 'Microsoft.Compute/virtualMachines'];
      const awsNonInstanceCategoryList = ['rds', 'ebs', 'load-balancers', 'eip'];
      const azureNonInstanceCategoryList = [
        'Microsoft.Compute/disks',
        'Microsoft.Network/loadBalancers',
        'Microsoft.Network/publicIPAddresses',
      ];

      if (instanceCategoryList.includes(this.category)) {
        return `${this.$t('optimization.unusedResourceCases')}`;
      }
      if (awsNonInstanceCategoryList.includes(this.category)) {
        return (
          `- ${this.$t('optimization.notConnectedEc2')} \n` +
          `- EC2 is not running: ${this.$t('optimization.notWorkingEc2')}`
        );
      }
      if (azureNonInstanceCategoryList.includes(this.category)) {
        return `- ${this.$t('optimization.notConnectedVM')}`;
      }
      return `${this.$t('optimization.unUsedResourcesNotSupported')}`;
    },
    unusedResourceCategoryMap() {
      const unusedResourceCategoryMap = new Map();
      this.cspReference[this.cspTypCd].categoryList
        .filter((category) => category.isInUnusedResource)
        .forEach((category) =>
          unusedResourceCategoryMap.set(category.rsrcType, _.pick(category, ['code', 'name', 'rsrcType']))
        );
      // console.log('unusedResourceCategoryMap', unusedResourceCategoryMap);
      return unusedResourceCategoryMap;
    },
    unusedResourceCategoryList() {
      return Array.from(this.unusedResourceCategoryMap.values());
    },
    defaultCategory() {
      return this.unusedResourceCategoryList[0].rsrcType;
    },
  },
  watch: {
    /*filter: function (newVal, oldVal) {
      this.param = newVal;
    },*/
    '$i18n.locale': 'chartData',
    cspTypCd: function () {
      this.initCategory();
    },
    category: function () {
      this.isTooltipOpen = false;
    },
    isSearch: function (newVal, oldVal) {},
    updateUnusedResourceChart: async function () {
      if (this.updateUnusedResourceChart) {
        this.fetchUpdateUnusedResourceChart(false);
        await this.initCount();
        await this.initParam();
        await this.chartData();
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
    // this.chartData();
    this.getExchangeRate();
  },
  methods: {
    i18n() {
      return i18n;
    },
    ...mapActions('resourceOpti', ['fetchCategory', 'fetchChartData', 'fetchUpdateUnusedResourceChart']),
    numberCutDecimal: numberCutDecimal,
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
      const index = this.unusedResourceCategoryList.findIndex(
        (unusedResourceCategory) => unusedResourceCategory.rsrcType === category
      );

      if (index === 0) {
        classListByIndex.push('rounded-tl-lg');
      } else {
        classListByIndex.push('border-l-0');
      }
      if (index === this.unusedResourceCategoryList.length - 1) {
        classListByIndex.push('rounded-tr-lg');
      }

      return [...defaultClassList, ...classListByIndex];
    },
    getExchangeRate() {
      resourceOptiService.getExchangeRate().then((result) => {
        this.exchangeRate = result.data.data;
      });
    },
    updateCategory(category) {
      this.fetchCategory(category);
      this.$nextTick(() => this.$emit('onCategoryChanged'));
    },
    initCategory() {
      if (!this.unusedResourceCategoryMap.has(this.category)) {
        this.fetchCategory(this.defaultCategory);
      }
    },
    initCount() {
      this.totalCnt = 0;
      this.unusedRsrc = 0;
      this.unusedRt = 0;
      this.savgCostDesc = 0;
    },
    initParam() {
      this.param = {
        vndr: '',
        cmpnId: '',
        rsrcType: '',
        gridType: 'unused',
        accList: [],
        rgnList: [],
        ocpSvcGrps: [],
      };
    },

    chartData: async function () {
      this.isLoading = true;

      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.chartApiConfig.cancelTokenSource) {
        this.chartApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.chartApiConfig);

      await this.initCount();
      if (!this.companyId.length || _.isNil(this.companyId[0].id)) {
        this.isLoading = false;
        return;
      }
      await this.initParam();

      let chartData;
      let result;
      this.param.vndr = this.cspReference[this.cspTypCd].vndr;
      this.param.rsrcType = this.category;
      this.param.cmpnId = this.companyId[0].id;
      this.param.accList = this.filter.acntIdList ? this.filter.acntIdList : [];
      this.param.rgnList = this.filter.regionList ? this.filter.regionList : [];
      this.param.ocpSvcGrps = [];
      if (this.filter.svcGrpList.length > 0) {
        this.filter.svcGrpList.forEach((item) => {
          this.param.ocpSvcGrps.push(item.id);
        });
      }
      try {
        if (
          this.category === 'ec2' ||
          this.category === 'rds' ||
          this.category === 'Microsoft.Compute/virtualMachines'
        ) {
          this.param.gridType = 'all';
          result = await resourceOptiService.fetchList(this.param, { cancelToken: this.chartApiConfig.cancelToken });

          if ('ok' === result.data.data.status) {
            this.totalCnt = result.data.data.result.totalCnt;

            for (let i = 0; i < result.data.data.result.list.length; i++) {
              if (result.data.data.result.list[i].rcmd === 'Idle') {
                this.savgCostDesc += result.data.data.result.list[i].savgCostDesc;
                this.unusedRsrc += 1;
              }
            }
            this.unusedRt = parseFloat(((this.unusedRsrc / this.totalCnt) * 100).toFixed(2));
            // result.data.data.result.unusedRsrc = this.unusedRsrc;
          } else {
            this.totalCnt = 0;
            this.unusedRsrc = 0;
            this.savgCostDesc = 0;
            this.unusedRt = 0;
          }
        } else {
          this.param.gridType = 'unused';
          result = await resourceOptiService.fetchSummary(this.param, { cancelToken: this.chartApiConfig.cancelToken });

          if ('ok' === result.data.data.status) {
            this.totalCnt = result.data.data.result.totCnt;
            this.unusedRsrc = result.data.data.result.unusedCnt;
            this.savgCostDesc = result.data.data.result.costData.saveCost;
            this.unusedRt = parseFloat(((this.unusedRsrc / this.totalCnt) * 100).toFixed(2));
          } else {
            this.totalCnt = 0;
            this.unusedRsrc = 0;
            this.savgCostDesc = 0;
            this.unusedRt = 0;
          }
        }
        chartData = result.data.data.result;

        this.fetchChartData(chartData);
        let chart = am4core.create('unusedChart', am4charts.PieChart);
        chart.data = [
          { category: i18n.locale === 'ko' ? '사용 ' : 'In use ', value: this.totalCnt - this.unusedRsrc },
          { category: i18n.locale === 'ko' ? '미사용 ' : 'Unused ', value: this.unusedRsrc },
        ];

        chart.innerRadius = am4core.percent(65);
        /*chart.width=306;
          chart.height=198;*/

        // 차트의 series 설정
        let pieSeries = chart.series.push(new am4charts.PieSeries());

        this.createChartLegend(chart);
        this.createChartLabel(pieSeries);

        pieSeries.dataFields.value = 'value';
        pieSeries.dataFields.category = 'category';
        pieSeries.labels.template.disabled = true;
        // pieSeries.labels.template.fontSize = 10;
        pieSeries.ticks.template.disabled = true;

        pieSeries.slices.template.tooltipText = '{category}: {value}';
        pieSeries.tooltip.fontSize = 15;
        pieSeries.tooltip.label.fontSize = 15;
        pieSeries.tooltip.pointerOrientation = 'vertical';

        // Idle 항목의 색상을 특정 색상으로 설정
        pieSeries.slices.template.propertyFields.fill = 'color';
        pieSeries.colors.list = [
          am4core.color('#adadad'), // 사용 중인 항목의 색상
          am4core.color('#2CC2FD'), // 미사용 항목의 색상
        ];

        this.chartEventDisabled(chart);
        this.isLoading = false;
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error) in component UnusedResourceChart : ' + e);
          this.isLoading = false;
        }
      }

      return chartData;
    },

    createChartLabel(pieSeries) {
      pieSeries.labels.template.disabled = true;
      let label = pieSeries.createChild(am4core.Label);
      label.text = this.unusedRsrc.toString();
      label.horizontalCenter = 'middle';
      label.verticalCenter = 'middle';
      label.fontSize = 30;
    },

    createChartLegend(chart) {
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      chart.legend.valign = 'middle';
      if (i18n.locale === 'ko') {
        chart.legend.labels.template.text = '[{color}]{name} {value}' + '개';
      } else {
        chart.legend.labels.template.text = '[{color}]{name} {value}' + ' unit(s)';
      }
      chart.legend.valueLabels.template.text = '';
      chart.legend.labels.template.maxWidth = 150;
      chart.legend.labels.template.fontSize = 12;
      chart.legend.itemContainers.template.width = 180;
      chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      chart.legend.labels.template.truncate = false;
      chart.legend.labels.template.wrap = false;
      // let markerTemplate = chart.legend.markers.template;
      /*markerTemplate.width = 10;
      markerTemplate.height = 10;*/
    },

    chartEventDisabled(chart) {
      chart.seriesContainer.events.on('click', (event) => {
        event.target.interactionsEnabled = false;
      });
    },
  },
};
</script>
<style>
.unclicked {
  color: #ccc;
}
.sub-title {
  position: relative;
  margin-top: 16px;
}

.box-wrap .sub-title > .info.mt15 {
  margin-top: 15px;
  font-size: 14px;
  font-weight: 500;
  color: #fc5aa1;
  letter-spacing: -0.5px;
}

.info.mt15 {
  font-size: 14px;
  font-weight: 500;
  color: #5ba9ca;
  letter-spacing: -0.5px;
  margin: 0 0 16px;
}

.text-secondary {
  margin-top: 15px;
  font-size: 14px;
  font-weight: 500;
  color: #fc5aa1;
  letter-spacing: -0.5px;
}
</style>
