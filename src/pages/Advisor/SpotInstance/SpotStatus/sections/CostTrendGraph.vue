<template>
  <div class="costTrendGraphBox box-wrap" style="margin-top: 0">
    <div class="title" style="padding-left: 0; padding-right: 10px; margin-top: 20px">
      <h4 class="tit-wrap" style="padding: 0">
        <Tooltip :title="$t('advisor.savingStatus.rateTrend')">
          <div style="font-weight: 700" class="ti">{{ $t('advisor.savingStatus.rateTrend') }}</div>
          <div class="ls">
            {{ $t('advisor.savingStatus.rateTrendDes1') }}
          </div>
          <div class="ls">
            {{ $t('advisor.savingStatus.rateTrendDes2') }}
          </div>
        </Tooltip>
      </h4>
      <a href="javascript:void(0)" class="download" style="top: 8px" @click="excelDownload">{{
        $t('common.button.downloadExcel')
      }}</a>
    </div>
    <div v-show="displayCharts" id="costTrendChart" style="height: 500px"></div>
    <div v-show="isLoading" class="flex flex-col items-center justify-center loading-section">
      <div class="mb-4 loading_rotate">
        <span class="loadingcolor"></span>
      </div>
      <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
    </div>
    <div
      v-show="!isLoading && !displayCharts"
      class="flex items-center justify-center"
      style="height: 100%; width: 100%"
    >
      <div class="text-center" style="margin: auto">
        <img class="inline" src="@/assets/images/ico-nodata-chart.svg" alt="." />
        <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Tooltip } from '@/pages/Advisor/components';
import moment from 'moment';
import spotUsageService from '@/services/spotUsageService';
import { mapState, mapActions, mapGetters } from 'vuex';
import { setApiConfig } from '@/library/APICaller';
import axios from 'axios';
import { chartColorByNumber } from '@/pages/Opti/CostOpti/CmmtPsblTgt/CostOptiCommon';
import costOptiService from '@/services/costOptiService';
import { i18n } from '../../../../../../public/locales/i18n';
import _ from 'lodash';

export default {
  components: { Tooltip },
  data() {
    return {
      savingData: [],
      isLoading: true,
      chartApiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
    };
  },
  computed: {
    ...mapState('spotAdvisor', {
      filter: 'filter',
      setDailyRateData: 'setDailyRateData',
    }),
    ...mapGetters('spotAdvisor', ['cspTypCd', 'cspPrdtCdList', 'regionSepCdList', 'tag', 'exchgRate']),
    displayCharts() {
      return this.savingData.length > 0 && !this.isLoading;
    },
    displayNoData() {
      return !(this.savingData.length > 0) && !this.isLoading;
    },
  },
  watch: {
    '$i18n.locale': ['createCostTrendChart'],
    setDailyRateData: async function () {
      if (this.setDailyRateData) {
        this.fetchDailyRateData(false);
        await this.createCostTrendChart();
      }
    },
  },
  created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
  },
  mounted() {},
  methods: {
    ...mapActions('spotAdvisor', ['fetchDailyRateData']),
    async createCostTrendChart() {
      this.isLoading = true;
      const costTrendChart = am4core.create('costTrendChart', am4charts.XYChart);
      this.chartRef = costTrendChart;
      costTrendChart.cursor = new am4charts.XYCursor();
      costTrendChart.legend = new am4charts.Legend();
      this.savingData = await this.getChartData();
      costTrendChart.data = this.savingData;
      await this.createXaxis(costTrendChart);
      await this.createYaxis(costTrendChart);
      await this.setSpotUseOndmConvAmtData(costTrendChart);
      await this.setSpotUseAmtData(costTrendChart);

      this.isLoading = false;
    },
    createXaxis(chart) {
      const dateXaxis = chart.xAxes.push(new am4charts.DateAxis()); // or dataAxis
      dateXaxis.dataFields.category = 'useDt';
      dateXaxis.startLocation = 0.5;
      dateXaxis.endLocation = 0.5;

      // dateXaxis.parseDates = true;
      dateXaxis.dateFormats.setKey('day', 'yyyy/MM/dd');
      dateXaxis.dateFormats.setKey('year', 'yyyy/MM/dd');
      dateXaxis.dateFormats.setKey('month', 'yyyy/MM/dd');

      dateXaxis.periodChangeDateFormats.setKey('day', 'yyyy/MM/dd');
      dateXaxis.periodChangeDateFormats.setKey('year', 'yyyy/MM/dd');
      dateXaxis.periodChangeDateFormats.setKey('month', 'yyyy/MM/dd');
      // dateXaxis.skipEmptyPeriods = true;

      // dateXaxis.dateFormats.setKey('year', 'yyyy'); // 연도별 형식
    },
    createYaxis(chart) {
      const leftYaxis = chart.yAxes.push(new am4charts.ValueAxis());
      leftYaxis.numberFormatter.numberFormat = '#,###.';
      leftYaxis.min = 0;

      chart.plotContainer.paddingTop = 10;
      leftYaxis.paddingTop = 10;

      // leftYaxis.paddingLeft = 10;
      // leftYaxis.paddingRight = 10;
      leftYaxis.layout = 'absolute';
      leftYaxis.title.text = '(₩)'; // Y축 범례 추가
      leftYaxis.title.rotation = 0;
      leftYaxis.title.align = 'right';
      leftYaxis.title.valign = 'top';
      leftYaxis.title.dy = -30;
      leftYaxis.title.dx = -5;
      leftYaxis.title.fill = am4core.color('#6c9fb2');

      // valueAxis.title.text = '왼쪽 축'; // 왼쪽 축의 제목 설정

      // var rightYaxis = chart.yAxes.push(new am4charts.ValueAxis());
      // // yAxisRight.title.text = '오른쪽 축'; // 오른쪽 축의 제목 설정
      // rightYaxis.renderer.opposite = true; // 오른쪽 축을 차트 오른쪽에 배치
      // rightYaxis.min = 0; // y축의 최소값
      // rightYaxis.max = 100; // y축의 최대값
      // rightYaxis.renderer.grid.template.disabled = true;
      // rightYaxis.numberFormatter = new am4core.NumberFormatter();
      // rightYaxis.numberFormatter.numberFormat = "#.#'%'";
      // rightYaxis.renderer.labels.template.fill = am4core.color('#ea1818');
      // min - max 설정 확인할 것
    },

    setSpotUseAmtData(chart) {
      const series = chart.series.push(new am4charts.LineSeries());
      this.chartDefaultSetting(series);
      this.chartAreaColor(series, '#2CC2FD');
      series.dataFields.dateX = 'useDt';
      series.name = this.$t('advisor.savingStatus.spotUsage');
      series.dataFields.valueY = 'spotUseAmt';
      this.tooltipColorSetting(series, '#2CC2FD');
      series.tooltipText = `[#FFFFFF][bold]{dateX.formatDate('yyyy/MM/dd')}[/]
            ${this.$t('advisor.savingStatus.spotUsage')}: ₩{spotUseAmt}[/]
            ${this.$t('advisor.savingStatus.savingRate')}: {spotSaveRatio.formatNumber('#.00')}%
          `;
      series.tooltip.label.fill = am4core.color('#2CC2FD');
      // series.yAxis = this.leftYaxis;
    },
    setSpotUseOndmConvAmtData(chart) {
      // 컬러 변경 필요
      const series2 = chart.series.push(new am4charts.LineSeries());
      this.chartDefaultSetting(series2);
      this.chartAreaColor(series2, '#DEDEDE');
      series2.dataFields.dateX = 'useDt';
      series2.name = this.$t('advisor.savingStatus.onDemandUseAmount');
      series2.dataFields.valueY = 'spotUseOndmConvAmt';

      this.tooltipColorSetting(series2, '#DEDEDE');
      series2.tooltipText = `[bold]{dateX.formatDate('yyyy/MM/dd')}[/]
            ${this.$t('advisor.savingStatus.onDemandUseAmount')}: ₩{spotUseOndmConvAmt}
          `;
      series2.tooltip.label.fill = am4core.color('#4a4a4a');
      // series2.yAxis = this.leftYaxis;
      // series2.stacked = true; // 이전 그래프에서 누적된 값으로 표출한건지
    },

    tooltipColorSetting(series, color) {
      series.tooltip.fontSize = 12;
      series.tooltip.getFillFromObject = false;
      series.tooltip.pointerOrientation = 'vertical';
      series.tooltip.label.fill = am4core.color(color);
      series.tooltip.background.fill = am4core.color('white');
      series.tooltip.background.stroke = am4core.color('#2cc2fd');
    },
    chartDefaultSetting(series) {
      series.fillOpacity = 0.6;
      series.strokeWidth = 2;
      series.sequencedInterpolation = true;
    },
    chartAreaColor(serise, color) {
      serise.fill = am4core.color(color);
      serise.stroke = am4core.color(color);
    },
    async getChartData() {
      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.chartApiConfig.cancelTokenSource) {
        this.chartApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.chartApiConfig);

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
        const response = await spotUsageService.fetchDailyRate({
          cspTypCd: this.cspTypCd,
          payload: payload,
          config: { cancelToken: this.chartApiConfig.cancelToken },
        });
        const costHistoryData = response.data.data;
        return costHistoryData.map((item) => ({
          useDt: item.useDt.replaceAll('-', '/'),
          spotUseAmt: this.applyExchgRate(item.spotUseAmt),
          spotUseOndmConvAmt: this.applyExchgRate(item.spotUseOndmConvAmt),
          spotSaveRatio: parseFloat(item.spotSaveRatio.toFixed(2)),
        }));
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching request history spot:', e);
          return [];
        }
      }
    },
    excelDownload() {
      const xlsPrefix = `${this.$t('advisor.savingStatus.spotUsageTrendExcel')}`;

      this.chartRef.exporting.filePrefix = `${xlsPrefix}_${moment().format('YYYY-MM-DD')}`;
      this.chartRef.exporting.dataFields = {
        useDt: this.$t('optimization.dateOfUse'),
        spotUseAmt: this.$t('advisor.savingStatus.spotUsage'),
        spotUseOndmConvAmt: this.$t('advisor.savingStatus.onDemand'),
        spotSaveRatio: this.$t('advisor.savingStatus.savingRate'),
      };

      let dateFormatter = new am4core.DateFormatter();
      dateFormatter.dateFormat = 'yyyy/MM/dd'; // 원하는 날짜 형식
      this.chartRef.exporting.dateFormatter = dateFormatter;

      this.chartRef.exporting.data.forEach((val) => {
        val.useDt = moment(val.useDt).format('YYYY/MM/DD');
        val.spotSaveRatio = `${val.spotSaveRatio}%`;
      });

      this.chartRef.exporting.adapter.add('xlsxWorkbook', function (wb) {
        const data = wb.workbook.Sheets.Data;
        data['!cols'] = [{ width: 13 }, { width: 26 }, { width: 26 }, { width: 26 }]; // cols width

        for (const key in data) {
          if (key.indexOf('B') > -1 || key.indexOf('C') > -1) {
            data[key].z = '₩#,##0';
          }
        }

        wb.workbook.SheetNames[0] = xlsPrefix;
        wb.workbook.Sheets[xlsPrefix] = data;

        return wb;
      });
      this.chartRef.exporting.export('xlsx');
    },
    applyExchgRate(value) {
      return _.isFinite(value) ? Math.round(value * this.exchgRate) : value;
    },
  },
};
</script>

<style lang="scss">
.costTrendGraphBox {
  margin-top: 0;
  padding: 3px 32px 32px 32px;
}
#costTrendGraph {
  padding-right: 30px;
}
</style>
