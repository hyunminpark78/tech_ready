<template>
  <div v-if="category" class="dashboard-card rounded-lg mb-4">
    <!-- tab -->
    <div class="flex tab-one">
      <button
        v-for="rightsizingCategory in rightsizingCategoryList"
        :key="rightsizingCategory.code"
        :ref="rightsizingCategory.code"
        :class="[
          ...getCategoryButtonDefaultClassList(rightsizingCategory.rsrcType),
          {
            clicked: category === rightsizingCategory.rsrcType,
            unclicked: category !== rightsizingCategory.rsrcType,
          },
        ]"
        :disabled="category === rightsizingCategory.rsrcType"
        @click="() => updateCategory(rightsizingCategory.rsrcType)"
      >
        {{ rightsizingCategory.name }}
      </button>
    </div>
    <!-- //tab -->

    <template v-if="category === 's3'">
      <ResourceRightSizingS3></ResourceRightSizingS3>
    </template>

    <template v-else>
      <!-- grid -->
      <div class="box-wrap grid3-wrap">
        <!-- col -->
        <div class="col" style="padding-bottom: 15px">
          <div class="title">
            <p class="info mt15 mb13">
              {{ $t('optimization.amountShownEstimate') }}
            </p>
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
            <div v-if="totalCnt != 0" class="pr">
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
            <p class="info mt15">
              {{ $t('optimization.dependingOnWorkload') }}
            </p>
          </div>
        </div>
        <!-- //col -->
        <!-- col -->
        <div class="col flex-2" style="margin-left: 10px; padding-bottom: 15px; padding-left: 5px; padding-right: 5px">
          <div class="title">
            <div style="margin-top: 15px; display: flex; align-items: center">
              <p v-if="i18n().locale === 'ko'" class="info mt15">
                총 {{ totalCnt }}개의 {{ rightsizingCategoryMap.get(category).name }} 중,
                <span class="text-secondary">{{ rightSizingCnt }}개의 Rightsizing 대상</span>을 찾았습니다.
              </p>
              <p v-if="i18n().locale === 'en'" class="info mt15">
                <span class="text-secondary">{{ rightSizingCnt }} Rightsizing target(s)</span>
                was(were) found out of a total of {{ totalCnt }} {{ rightsizingCategoryMap.get(category).name }}.
              </p>
              <!-- tooltip -->
              <div class="tooltip-wrap" style="margin-bottom: 19px">
                <button class="ico jsTooltip1" @click="isTooltipOpen = !isTooltipOpen"><span>툴팁 열기</span></button>
                <div class="tooltip-layer" :style="isTooltipOpen ? 'display: block' : 'display: none'">
                  <strong class="ti">Rightsizing</strong>
                  <recursive-tooltip :tooltip-text="tooltipText"></recursive-tooltip>
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
          <div v-show="!isLoading" class="flex">
            <div
              v-show="!isAllRightSizingZero"
              class="flex-1 flex justify-center items-center h-full"
              style="min-height: 150px; height: 198px; width: 306px"
            >
              <div
                id="rightSizingChart"
                style="
                  height: 100%;
                  width: 100%;
                  font-size: 24px;
                  letter-spacing: -0.03px;
                  text-align: center;
                  color: #fff;
                  line-height: 144px;
                "
              >
                Chart
              </div>
            </div>
            <div
              v-if="isAllRightSizingZero"
              class="flex-1 ml-4 flex-1 flex justify-center items-center h-full"
              style="min-height: 150px; height: 198px; width: 306px"
            >
              <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
              <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
            </div>
            <div
              v-show="!isAllRightSizingDetailZero"
              class="flex-1 flex justify-center items-center h-full"
              style="min-height: 150px; height: 198px; width: 306px; padding-bottom: 0px !important"
            >
              <div
                id="rightSizingDetailChart"
                style="
                  height: 100%;
                  width: 100%;
                  font-size: 24px;
                  letter-spacing: -0.03px;
                  text-align: center;
                  color: #fff;
                  line-height: 144px;
                "
              >
                Chart
              </div>
            </div>
            <div
              v-if="isAllRightSizingZero"
              class="flex-1 ml-4 flex-1 flex justify-center items-center h-full"
              style="min-height: 150px; height: 198px; width: 306px; padding-bottom: 0px !important"
            >
              <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
              <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
            </div>
          </div>
        </div>
        <!-- //col -->
      </div>
      <!-- //grid -->
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import resourceOptiService from '@/services/resourceOptiService';
import { numberCutDecimal } from '@/pages/Opti/ResourceOpti/ResourceOptiCommon';
import moment from 'moment';
import recursiveTooltip from '@/pages/Opti/ResourceOpti/recursiveTooltip';
import ResourceRightSizingS3 from './ResourceRightSizingS3.vue';
import _ from 'lodash';
import { setApiConfig } from '@/library/APICaller';
import axios from 'axios';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: {
    recursiveTooltip,
    ResourceRightSizingS3,
  },
  data() {
    return {
      isTooltipOpen: false,
      tooltipText: [],
      totalCnt: 0,
      rightSizingCnt: 0,
      justRightCnt: 0,
      modernizeCnt: 0,
      downsizeCnt: 0,
      upsizeCnt: 0,
      savgCostDesc: 0,
      param: {
        vndr: '',
        cmpnId: '',
        rsrcType: '',
        gridType: 'rs',
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
      updateRightsizingChart: 'updateRightsizingChart',
      isSearch: 'isSearch',
      chartData: 'chartData',
      companyId: 'selectedCustCorpIds',
      svcGrpSelectedCustCorpIds: 'svcGrpSelectedCustCorpIds',
      cspReference: 'cspReference',
    }),
    ...mapGetters('resourceOpti', ['cspTypCd']),
    isAllRightSizingZero() {
      return this.justRightCnt === 0 && this.rightSizingCnt === 0;
    },
    isAllRightSizingDetailZero() {
      return this.downsizeCnt === 0 && this.modernizeCnt === 0 && this.upsizeCnt === 0;
    },
    rightsizingCategoryMap() {
      const rightsizingCategoryMap = new Map();
      this.cspReference[this.cspTypCd].categoryList
        .filter((category) => category.isInRightSizing)
        .forEach((category) =>
          rightsizingCategoryMap.set(category.rsrcType, _.pick(category, ['code', 'name', 'rsrcType']))
        );
      return rightsizingCategoryMap;
    },
    rightsizingCategoryList() {
      return Array.from(this.rightsizingCategoryMap.values());
    },
    defaultCategory() {
      return this.rightsizingCategoryList[0].rsrcType;
    },
  },
  watch: {
    '$i18n.locale': ['setTooltipText', 'setData'],
    cspTypCd: function () {
      this.initCategory();
    },
    category: function () {
      this.isTooltipOpen = false;
    },
    isSearch: function (newVal, oldVal) {},
    updateRightsizingChart: async function () {
      if (this.updateRightsizingChart) {
        this.fetchUpdateRightsizingChart(false);
        this.initCount();
        this.initParam();
        if (this.category !== 's3') {
          await this.setData();
        }
      }
    },
  },
  created() {
    this.initCategory();
    this.setTooltipText();
  },
  mounted() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    // this.rightSizingChartData();
    // this.rightSizingDetailChartData();
    this.getExchangeRate();
  },
  updated() {
    /* tooltip */
    const tooltips = document.querySelectorAll('.tooltip-wrap');
    const tooltipBtns = document.querySelectorAll('.jsTooltip1');
    tooltipBtns.forEach((tooltip) => {
      tooltip.onclick = function () {
        for (let i = 0; i < tooltips.length; i++) {
          tooltips[i].classList.remove('active');
        }
        if (this.parentNode.classList.contains('active')) {
          this.parentNode.classList.remove('active');
        } else {
          this.parentNode.classList.add('active');
        }
      };
    });
    const tooltipCloses = document.querySelectorAll('.jsTooltipClose1');
    tooltipCloses.forEach((tooltipClose) => {
      tooltipClose.onclick = function () {
        this.parentNode.parentNode.classList.remove('active');
      };
    });
    /* //tooltip */
  },
  methods: {
    i18n() {
      return i18n;
    },
    ...mapActions('resourceOpti', ['fetchCategory', 'fetchChartData', 'fetchUpdateRightsizingChart']),
    numberCutDecimal: numberCutDecimal,
    setTooltipText() {
      const instanceCategoryList = ['ec2', 'Microsoft.Compute/virtualMachines'];
      const awsNonInstanceCategoryList = ['rds'];

      if (instanceCategoryList.includes(this.category)) {
        this.tooltipText = [
          `${this.$t('optimization.optimizationRecommendationMeans')}`,
          {
            text: 'Downsize',
            subpoints: [`${this.$t('optimization.averageUsageRate')}`, `${this.$t('optimization.maximumUsageRate')}`],
          },
          {
            text: 'Upsize',
            subpoints: [`${this.$t('optimization.averageUtilizationExceed')}`],
          },
          {
            text: 'Modernize',
            subpoints: [`${this.$t('optimization.recommendedInstancesPerformance')}`],
          },
        ];
      }
      if (awsNonInstanceCategoryList.includes(this.category)) {
        this.tooltipText = [
          `${this.$t('optimization.optimizationRecommendation14')}`,
          {
            text: 'Downsize',
            subpoints: [
              `${this.$t('optimization.dbConnectionFewer')}`,
              `${this.$t('optimization.avgIOPS')}`,
              `${this.$t('optimization.avgCpuUsage')}`,
              `${this.$t('optimization.MaxCpuUsage')}`,
            ],
          },
          {
            text: 'Upsize',
            subpoints: [`${this.$t('optimization.avgUsageExceed')}`],
          },
          {
            text: 'Modernize',
            subpoints: [`${this.$t('optimization.recommendedInstancesSamePrice')}`],
          },
        ];
      }
      return [];
    },
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
      const index = this.rightsizingCategoryList.findIndex(
        (rightsizingCategory) => rightsizingCategory.rsrcType === category
      );

      if (index === 0) {
        classListByIndex.push('rounded-tl-lg');
      } else {
        classListByIndex.push('border-l-0');
      }
      if (index === this.rightsizingCategoryList.length - 1) {
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
      if (!this.rightsizingCategoryMap.has(this.category)) {
        this.fetchCategory(this.defaultCategory);
      }
    },
    initCount() {
      this.totalCnt = 0;
      this.rightSizingCnt = 0;
      this.justRightCnt = 0;
      this.modernizeCnt = 0;
      this.downsizeCnt = 0;
      this.upsizeCnt = 0;
      this.savgCostDesc = 0;
    },
    initParam() {
      this.param = {
        vndr: '',
        cmpnId: '',
        rsrcType: '',
        gridType: 'rs',
        accList: [],
        rgnList: [],
        ocpSvcGrps: [],
      };
    },
    setData: async function () {
      this.isLoading = true;
      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.chartApiConfig.cancelTokenSource) {
        this.chartApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.chartApiConfig);

      this.initCount();
      if (!this.companyId.length || _.isNil(this.companyId[0].id)) {
        this.isLoading = false;
        return;
      }
      this.initParam();

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
        const result = await resourceOptiService.fetchRsInfo(this.param, {
          cancelToken: this.chartApiConfig.cancelToken,
        });

        if ('ok' === result.data.data.status) {
          this.totalCnt = result.data.data.result.totCnt;

          for (let item of result.data.data.result.infoChart) {
            if (item.type === 'Just') {
              this.justRightCnt += item.cnt;
            } else if (item.type === 'Idle') {
              this.justRightCnt += item.cnt;
            } else if (item.type === 'Modernize') {
              this.rightSizingCnt += item.cnt;
              this.modernizeCnt += item.cnt;
            } else if (item.type === 'Downsize') {
              this.rightSizingCnt += item.cnt;
              this.downsizeCnt += item.cnt;
            } else if (item.type === 'Upsize') {
              this.rightSizingCnt += item.cnt;
              this.upsizeCnt += item.cnt;
            }
          }
        }
        if (
          this.category === 'ec2' ||
          this.category === 'rds' ||
          this.category === 'Microsoft.Compute/virtualMachines'
        ) {
          const result = await resourceOptiService.fetchGrid(this.param, {
            cancelToken: this.chartApiConfig.cancelToken,
          });

          if ('ok' === result.data.data.status) {
            let rowData = result.data.data.result.list;
            rowData = rowData.filter((item) => item.rcmd !== 'Idle');
            // 절감액 합산
            let savgCostDesc = 0;
            for (let item of rowData) {
              savgCostDesc += item.savgCostDesc;
            }
            this.savgCostDesc = savgCostDesc;
          }
        } else {
          this.savgCostDesc = result.data.data.result.costData.saveCost;
        }
        await this.rightSizingChartData();
        await this.rightSizingDetailChartData();
        this.isLoading = false;
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('fetch chart data : ' + e);
          this.isLoading = false;
        }
      }
    },

    rightSizingChartData: async function () {
      try {
        let chart = am4core.create('rightSizingChart', am4charts.PieChart);
        chart.data = [
          { category: 'Just Right ', value: this.justRightCnt },
          { category: 'Rightsizing ', value: this.rightSizingCnt },
        ];

        chart.innerRadius = am4core.percent(65);
        chart.paddingRight = 0; // 오른쪽 패딩을 0으로 설정
        chart.paddingLeft = 0; // 왼쪽 패딩을 0으로 설정

        // 차트의 series 설정
        let pieSeries = chart.series.push(new am4charts.PieSeries());

        this.createChartLabel(pieSeries, this.justRightCnt + this.rightSizingCnt);
        this.createChartLegend(chart);

        pieSeries.dataFields.value = 'value';
        pieSeries.dataFields.category = 'category';
        pieSeries.labels.template.disabled = true;
        // pieSeries.labels.template.fontSize = 10;
        pieSeries.ticks.template.disabled = true;

        pieSeries.slices.template.tooltipText = '{category}: {value}';
        pieSeries.tooltip.fontSize = 15;
        pieSeries.tooltip.label.fontSize = 15;
        pieSeries.tooltip.pointerOrientation = 'vertical';

        pieSeries.slices.template.propertyFields.fill = 'color';
        pieSeries.colors.list = [
          am4core.color('#2CC2FD'), // Just Right 색상
          am4core.color('#1AE3BB'), // Rightsizing 색상
        ];

        return chart;
      } catch (e) {
        console.error('Error fetching chart data:', e);
      }
    },

    rightSizingDetailChartData: function () {
      try {
        let chartData = this.chartData;

        let chart = am4core.create('rightSizingDetailChart', am4charts.PieChart);
        chart.data = [
          { category: 'Modernize ', value: this.modernizeCnt },
          { category: 'Downsize ', value: this.downsizeCnt },
          { category: 'Upsize ', value: this.upsizeCnt },
        ];

        chart.innerRadius = am4core.percent(65);
        // chart.width = am4core.percent(100);
        chart.paddingRight = 0; // 오른쪽 패딩을 0으로 설정
        chart.paddingLeft = 0; // 왼쪽 패딩을 0으로 설정

        // 차트의 series 설정
        let pieSeries = chart.series.push(new am4charts.PieSeries());

        this.createChartLabel(pieSeries, this.downsizeCnt + this.modernizeCnt);
        this.createChartLegend(chart);

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
          am4core.color('#2CC2FD'), // modernizeCnt 색상
          am4core.color('#1AE3BB'), // downsizeCnt 색상
          am4core.color('#fc5aa1'), // UpsizeCnt 색상
        ];

        return chartData;
      } catch (e) {
        console.error('Error fetching chart data:', e);
      }
    },

    createChartLabel(pieSeries, value) {
      let label = pieSeries.createChild(am4core.Label);
      label.text = value.toString();
      label.horizontalCenter = 'middle';
      label.verticalCenter = 'middle';
      label.fontSize = 30;
    },

    createChartLegend(chart) {
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      if (i18n.locale === 'ko') {
        chart.legend.labels.template.text = '[{color}]{name} {value}' + '개';
      } else {
        chart.legend.labels.template.text = '[{color}]{name} {value}' + ' unit(s)';
      }
      chart.legend.valueLabels.template.text = '';
      chart.legend.labels.template.fontSize = 12;
      chart.legend.itemContainers.template.width = 180;
      chart.legend.labels.template.maxWidth = 150;
      chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      chart.legend.labels.template.truncate = false;
      chart.legend.labels.template.wrap = false;
      // let markerTemplate = chart.legend.markers.template;
      /*markerTemplate.width = 10;
      markerTemplate.height = 10;*/
    },
  },
};
</script>
<style scoped>
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

.tooltip-layer {
  white-space: pre-line;
}
</style>
