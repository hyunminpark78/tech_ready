<template>
  <div id="savingStatusSpotUsage" class="flex justify-between" style="height: 19%">
    <div class="flex savingStatusBox box-wrap" style="margin-top: 0; width: 58%; min-width: 58%">
      <div class="justify-between" style="width: 100%">
        <Tooltip style="margin-bottom: 23px" :title="$t('advisor.savingStatus.title')">
          <div style="font-weight: 700" class="ti">{{ $t('advisor.savingStatus.title') }}</div>
          <div class="ls">
            <span class="primary"> {{ $t('advisor.savingStatus.status') }}</span> :
            {{ $t('advisor.savingStatus.statusDes') }}
          </div>
          <div class="ls">
            <span class="primary">{{ $t('advisor.savingStatus.onDemandUseAmount') }}</span> :
            {{ $t('advisor.savingStatus.onDemandUseAmountDes') }}
          </div>
          <div class="ls">
            <span class="primary">{{ $t('advisor.savingStatus.compareOnDemandUse') }}</span> :
            {{ $t('advisor.savingStatus.compareOnDemandUseDes') }}
          </div>
        </Tooltip>
        <div class="flex">
          <div class="flex flex-col" style="width: 33%; padding-left: 2px">
            <div class="flex items-center" style="padding-bottom: 24px">
              <div style="min-width: 210px">
                <p class="tit4-wrap blue" style="padding-bottom: 4px">
                  {{ $t('advisor.savingStatus.status') }}
                </p>
                <div class="flex items-center" style="padding-bottom: 0; gap: 5px">
                  <p class="savingCost">₩{{ formatToPrice(spotSaveAmt) }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center" style="padding-bottom: 0">
              <div style="min-width: 210px">
                <p class="tit4-wrap blue" style="padding-bottom: 4px">
                  {{ $t('advisor.savingStatus.compareOnDemandUse') }}
                </p>
                <div class="flex items-center" style="padding-bottom: 0; gap: 5px">
                  <p class="savingCost">{{ spotSaveRatio.toFixed(2) }}%</p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex justify-center"
            :class="!isEmptySpotUsage && !isLoading ? '' : 'hidden'"
            style="flex: 1; width: 67%"
          >
            <div id="spotSavingChart" :class="!isEmptySpotUsage && !isLoading ? '' : 'hidden'"></div>
          </div>
          <div v-if="isLoading" class="flex flex-col items-center justify-center loading-section">
            <div class="mb-4 loading_rotate">
              <span class="loadingcolor"></span>
            </div>
            <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
          </div>
          <div :class="isEmptySpotUsage && !isLoading ? 'display-no-data' : 'hidden'">
            <div class="text-center" style="margin: auto">
              <img class="inline" src="@/assets/images/ico-nodata-chart.svg" alt="." />
              <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="savingStatusChartBox box-wrap"
      style="margin-top: 0; margin-left: 16px; width: 20%; min-width: 20%; padding-bottom: 3px"
    >
      <Tooltip
        style="margin-bottom: 23px"
        class="coverageTitle"
        :title="$t('advisor.savingStatus.coverage')"
        :left-position="true"
      >
        <div style="font-weight: 700" class="ti">{{ $t('advisor.fullCoverage.title') }}</div>
        <div class="ls">
          <span class=""> {{ $t('advisor.fullCoverage.desc') }}</span>
        </div>
      </Tooltip>
      <div class="flex flex-col coverage-section" style="padding-bottom: 15px">
        <div id="fullCoverageChart" :class="!isEmptySpotCoverage && !isLoading ? '' : 'hidden'"></div>
        <div v-if="isLoading" class="flex flex-col items-center justify-center loading-section">
          <div class="mb-4 loading_rotate">
            <span class="loadingcolor"></span>
          </div>
          <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
        </div>
        <div :class="isEmptySpotCoverage && !isLoading ? 'display-no-data' : 'hidden'">
          <div class="text-center" style="margin: auto">
            <img class="inline" src="@/assets/images/ico-nodata-chart.svg" alt="." />
            <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="savingStatusChartBox box-wrap"
      style="margin-top: 0; margin-left: 16px; width: 20%; min-width: 20%; padding-bottom: 3px"
    >
      <Tooltip
        style="margin-bottom: 23px"
        class="coverageTitle"
        :title="$t('advisor.savingStatus.gpuCoverage')"
        :left-position="true"
      >
        <div style="font-weight: 700" class="ti">{{ $t('advisor.gpuCoverage.title') }}</div>
        <div class="ls">
          <span class=""> {{ $t('advisor.gpuCoverage.desc') }}</span>
        </div>
      </Tooltip>
      <div class="flex flex-col coverage-section" style="padding-bottom: 15px">
        <div
          id="predictGPUCoverageChart"
          style="height: 100%"
          :class="!isEmptyGpuSpotCoverage && !isLoading ? '' : 'hidden'"
        ></div>
        <div v-if="isLoading" class="flex flex-col items-center justify-center loading-section">
          <div class="mb-4 loading_rotate">
            <span class="loadingcolor"></span>
          </div>
          <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
        </div>
        <div :class="isEmptyGpuSpotCoverage && !isLoading ? 'display-no-data' : 'hidden'">
          <div class="text-center" style="margin: auto">
            <img class="inline" src="@/assets/images/ico-nodata-chart.svg" alt="." />
            <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Tooltip } from '@/pages/Advisor/components';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
import { mapActions, mapGetters, mapState } from 'vuex';
import spotUsageService from '@/services/spotUsageService';
import { setApiConfig } from '@/library/APICaller';
import axios from 'axios';
import _ from 'lodash';

export default {
  components: { Tooltip },
  data() {
    return {
      spotUseAmt: 0,
      spotSaveAmt: 0,
      spotSaveRatio: 0,
      spotUseOndmConvAmt: 0,
      spotPsblOndmUseAmt: 0,
      spotCvrdRatio: 0,
      gpuSpotUseOndmConvAmt: 0,
      gpuSpotPsblOndmUseAmt: 0,
      gpuSpotCvrdRatio: 0,
      isLoading: true,
      apiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
    };
  },
  computed: {
    ...mapState('spotAdvisor', {
      filter: 'filter',
      setSpotUsageSummary: 'setSpotUsageSummary',
    }),
    ...mapGetters('spotAdvisor', ['cspTypCd', 'cspPrdtCdList', 'regionSepCdList', 'tag', 'exchgRate']),
    coverage() {
      return (this.spotUseOndmConvAmt / (this.spotUseOndmConvAmt + this.spotPsblOndmUseAmt)) * 100 || 0;
    },
    GPUcoverage() {
      return (this.gpuSpotUseOndmConvAmt / (this.gpuSpotUseOndmConvAmt + this.gpuSpotPsblOndmUseAmt)) * 100 || 0;
    },
    onDemandSaving() {
      return Number(this.spotPsblOndmUseAmt.toFixed(0));
    },
    isEmptySpotUsage() {
      return this.spotUseAmt === 0 && this.spotUseOndmConvAmt === 0;
    },
    isEmptySpotCoverage() {
      return this.spotUseOndmConvAmt === 0 && this.spotPsblOndmUseAmt === 0;
    },
    isEmptyGpuSpotCoverage() {
      return this.gpuSpotUseOndmConvAmt === 0 && this.gpuSpotPsblOndmUseAmt === 0;
    },
  },
  watch: {
    '$i18n.locale': ['setData'],
    setSpotUsageSummary: async function () {
      if (this.setSpotUsageSummary) {
        this.fetchSpotUsageSummary(false);
        await this.setData();
      }
    },
  },

  created() {
    // Apply theme
    am4core.useTheme(am4themes_animated);
  },
  methods: {
    ...mapActions('spotAdvisor', ['fetchSpotUsageSummary']),
    initData() {
      this.spotUseAmt = 0;
      this.spotSaveAmt = 0;
      this.spotSaveRatio = 0;
      this.spotUseOndmConvAmt = 0;
      this.spotPsblOndmUseAmt = 0;
      this.spotCvrdRatio = 0;
      this.gpuSpotUseOndmConvAmt = 0;
      this.gpuSpotPsblOndmUseAmt = 0;
      this.gpuSpotCvrdRatio = 0;
    },
    async setData() {
      this.isLoading = true;

      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.apiConfig.cancelTokenSource) {
        this.apiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.apiConfig);

      const payload = {
        strDate: this.filter.spotUsageRange.startDate,
        endDate: this.filter.spotUsageRange.endDate,
        acntIdList: this.filter.acntIdList,
        regionSepCdList: this.regionSepCdList,
        cspPrdtCdList: this.cspPrdtCdList,
        tagKey: this.tag.tagKey,
        tagValList: this.tag.tagValList,
      };
      try {
        const response = await spotUsageService.fetchSpotUsageSummary({
          cspTypCd: this.cspTypCd,
          payload: payload,
          config: { cancelToken: this.apiConfig.cancelToken },
        });
        const spotData = response.data.data;
        this.spotUseAmt = this.applyExchgRate(spotData.spotUseAmt);
        this.spotSaveAmt = this.applyExchgRate(spotData.spotSaveAmt);
        this.spotSaveRatio = spotData.spotSaveRatio;
        this.spotUseOndmConvAmt = this.applyExchgRate(spotData.spotUseOndmConvAmt);
        this.spotPsblOndmUseAmt = this.applyExchgRate(spotData.spotPsblOndmUseAmt);
        this.spotCvrdRatio = spotData.spotCvrdRatio;
        this.gpuSpotUseOndmConvAmt = this.applyExchgRate(spotData.gpuSpotUseOndmConvAmt);
        this.gpuSpotPsblOndmUseAmt = this.applyExchgRate(spotData.gpuSpotPsblOndmUseAmt);
        this.gpuSpotCvrdRatio = spotData.gpuSpotCvrdRatio;

        this.isLoading = false;
        this.createCharts();
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching saving status spot usage:', e);
          this.initData();
          this.createCharts();
          this.isLoading = false;
        }
      }
    },
    createCharts() {
      this.createOnDemandChart();
      this.createCoverageChart();
      this.createGPUCoverageChart();
    },
    createOnDemandChart() {
      // Create chart instance
      let chart = am4core.create('spotSavingChart', am4charts.XYChart);
      chart.data = [
        {
          category: this.$t('advisor.savingStatus.currentAmount'),
          currentAmount: this.spotUseAmt,
        },
        {
          category: this.$t('advisor.savingStatus.onDemand'),
          onDemand: this.spotUseOndmConvAmt,
        },
      ];

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.maxTooltipDistance = -1;
      chart.cursor.lineY.disabled = true;
      chart.cursor.lineX.disabled = true;
      chart.fontFamily = 'Noto Sans KR';
      chart.tooltip.label.fontSize = 13;
      chart.autoMargins = true;
      chart.paddingTop = 10;
      chart.paddingBottom = 0;
      chart.paddingLeft = 100;
      chart.paddingRight = am4core.percent(5);

      //define x axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.gridAlpha = 0;
      categoryAxis.dataFields.category = 'category';
      categoryAxis.renderer.line.strokeOpacity = 1;
      categoryAxis.renderer.line.stroke = am4core.color('#E9EBED');
      categoryAxis.renderer.labels.template.fill = am4core.color('#6C9FB2');
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 0;
      categoryAxis.tooltip.disabled = true;
      categoryAxis.fontSize = 15;
      categoryAxis.renderer.minGridDistance = 10;
      categoryAxis.fontFamily = 'Noto Sans KR';

      //define y axes
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.line.strokeOpacity = 20;
      valueAxis.renderer.line.stroke = am4core.color('#E9EBED');
      valueAxis.renderer.labels.template.fill = am4core.color('#6C9FB2');
      valueAxis.gridAlpha = 0;
      valueAxis.min = 0;
      valueAxis.extraMax = 0.5;
      valueAxis.strictMinMax = true;
      valueAxis.calculateTotals = true;
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.baseGrid.disabled = true;
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.fontSize = 15;
      valueAxis.renderer.fontFamily = 'Noto Sans KR';

      // Add currency symbol label
      let label = chart.plotContainer.createChild(am4core.Label);
      label.text = '(₩)';
      label.fontSize = 16;
      label.fill = am4core.color('#6C9FB2');
      label.dy = -10;
      label.dx = -30;

      // Create series in chart
      const createSeries = (field, category, name, color) => {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.name = name;
        series.dataFields.valueY = field;
        series.dataFields.categoryX = category;
        series.dataFields.valueYShow = 'value';
        series.stacked = true;
        series.strokeWidth = 0;
        series.fill = am4core.color(color);
        series.tooltipText = "{name}: ₩{valueY.formatNumber('#,###')}";
        series.clustered = false;
        series.columns.template.width = 117;
        series.columns.template.height = am4core.percent(10); // Set column height to 50% of available space
        series.columns.template.maxHeight = 20; // Max height of each column in pixels
        series.tooltip.pointerOrientation = 'vertical';
        series.tooltip.fontSize = 40;
        series.tooltip.label.fontSize = 14;
        series.tooltip.fontFamily = 'Noto Sans KR';
      };

      createSeries('currentAmount', 'category', this.$t('advisor.savingStatus.currentAmount'), '#2CC2FD');
      createSeries('onDemand', 'category', this.$t('advisor.savingStatus.onDemand'), '#DEDEDE');

      return chart;
    },
    createGPUCoverageChart() {
      // Create chart instance
      let chart = am4core.create('predictGPUCoverageChart', am4charts.PieChart);
      chart.fontFamily = 'Noto Sans KR';
      chart.innerRadius = am4core.percent(65);
      this.chartEventDisabled(chart);

      // Add data
      chart.data = [
        {
          category: this.$t('advisor.gpuCoverage.GPUSpotOnDemandConversion'),
          value: this.gpuSpotUseOndmConvAmt,
          fill: am4core.color('#8666B0'),
        },
        {
          category: this.$t('advisor.gpuCoverage.GPUSpotInstanceUsage'),
          value: this.gpuSpotPsblOndmUseAmt,
          fill: am4core.color('#E0E0E0'),
        },
      ];
      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());

      // Disable label
      pieSeries.labels.template.disabled = true;
      pieSeries.slices.template.tooltipHTML =
        "<div class='amcharts-tooltip'>{category}: ₩{value.formatNumber('#,###')}({value.percent.formatNumber('#.##')}%)</div>";

      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'category';
      pieSeries.slices.template.propertyFields.fill = 'fill';

      pieSeries.tooltip.fontSize = 14;
      pieSeries.tooltip.label.fontSize = 14;
      pieSeries.tooltip.fontFamily = 'Noto Sans KR';

      // Add center text
      let label = pieSeries.createChild(am4core.Label);
      label.text = `${this.gpuSpotCvrdRatio.toFixed(2)}%`;
      label.horizontalCenter = 'middle';
      label.verticalCenter = 'middle';
      label.fontSize = 22;
      label.fontFamily = 'Noto Sans KR';
      label.fill = am4core.color('#A166F1');
    },
    createCoverageChart() {
      // Create chart instance
      let chart = am4core.create('fullCoverageChart', am4charts.PieChart);
      chart.fontFamily = 'Noto Sans KR';
      chart.innerRadius = am4core.percent(65);
      this.chartEventDisabled(chart);

      // Add data
      chart.data = [
        {
          category: this.$t('advisor.fullCoverage.spotUsageOnDemandConversion'),
          value: this.spotUseOndmConvAmt,
          fill: am4core.color('#1AE3BB'),
        },
        {
          category: this.$t('advisor.fullCoverage.totalSpotInstanceUsage'),
          value: this.spotPsblOndmUseAmt,
          fill: am4core.color('#E0E0E0'),
        },
      ];

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());

      // Disable label
      pieSeries.labels.template.disabled = true;
      pieSeries.slices.template.tooltipHTML =
        "<div class='amcharts-tooltip'>{category}: ₩{value.formatNumber('#,###')}({value.percent.formatNumber('#.##')}%)</div>";
      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'category';
      pieSeries.slices.template.propertyFields.fill = 'fill';

      pieSeries.tooltip.fontSize = 14;
      pieSeries.tooltip.label.fontSize = 14;
      pieSeries.tooltip.fontFamily = 'Noto Sans KR';

      // Add center text
      let label = pieSeries.createChild(am4core.Label);
      label.text = `${this.spotCvrdRatio.toFixed(2)}%`;
      label.horizontalCenter = 'middle';
      label.verticalCenter = 'middle';
      label.fontSize = 22;
      label.fontFamily = 'Noto Sans KR';
      label.fill = am4core.color('#1AE3BB');
    },
    chartEventDisabled(chart) {
      chart.seriesContainer.events.on('click', (event) => {
        event.target.interactionsEnabled = false;
      });
    },
    formatToPrice(value) {
      return numberWithCommas(parseFloat(value).toFixed(0));
    },
    applyExchgRate(value) {
      return _.isFinite(value) ? Math.round(value * this.exchgRate) : value;
    },
  },
};
</script>

<style lang="scss" scoped>
#savingStatusSpotUsage {
  height: 303px;

  .primary {
    color: #00a5ed;
  }

  .savingCost {
    font-size: 30px;
    font-weight: 700;
  }

  .savingStatusChartBox {
    display: flex;
    flex-direction: column;
    margin-top: 0;
    padding: 26px 0px 24px 0px;
  }

  .savingStatusBox {
    padding: 26px 32px 24px 30px;
  }

  .amcharts-tooltip {
    width: 200px;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .coverageTitle {
    margin-bottom: 23px;
    margin-left: 30px;
  }
  .loading-section {
    width: 100%;
    flex: 1;
  }

  .coverage-section {
    height: 100%;
    padding: 0px 32px;
  }
}

#spotSavingChart {
  width: 100%;
  height: 188px;
  flex: 1;
}

#fullCoverageChart {
  flex: 1;
  width: 170px;
  height: 170px;
  margin: auto;
}

#spotSavingChart {
  width: 100%;
  flex: 1;
}

#fullCoverageChart {
  width: 100%;
  flex: 1;
}
.display-no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
}
</style>
