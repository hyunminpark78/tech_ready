<template>
  <div class="box-wrap type2">
    <div class="title mb-12">
      <h4 class="tit-wrap">
        <span>{{ $t('optimization.valueCostTrends', { value: getTitle }) }}</span>
        <!-- tooltip -->
        <div class="tooltip-wrap">
          <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
          <div class="tooltip-layer">
            <strong class="ti">{{ $t('optimization.valueCostTrends', { value: getTitle }) }}</strong>
            {{ $t('optimization.valueShowsChangeTrends', { value: getTitle }) }}
            <br />
            {{ $t('optimization.valueUsageAmount', { value: getTitle }) }}
            <br />
            {{ $t('optimization.valueContractUsage', { value: getTitle }) }}
            <button class="close jsTooltipClose1">툴팁 닫기</button>
          </div>
        </div>
        <!-- //tooltip -->
      </h4>
      <a href="javascript:void(0)" class="download" @click="excelDownload">{{ $t('common.button.downloadExcel') }}</a>
    </div>
    <DataLoadingOverlay v-if="loading" :height="500"></DataLoadingOverlay>
    <NoDataOverlay v-else-if="!existData" :icon-type="'chart'" :height="500"></NoDataOverlay>
    <div v-show="existData && !loading" id="ondemandUsageChart" style="width: 100%; height: 500px"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { chartColorByNumber } from './CostOptiCommon';
import CspSwitchMixin from './cspSwitchMixin';
import costOptiService from '@/services/costOptiService';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay.vue';
import NoDataOverlay from '@/components/Overlays/NoDataOverlay.vue';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: { DataLoadingOverlay, NoDataOverlay },
  mixins: [CspSwitchMixin],
  data() {
    return {
      param: {},
      predictCoverage: {},
      search: null,
      existData: false,
      loading: true,
    };
  },
  computed: {
    ...mapState('costOpti', ['filter', 'isSearch', 'predictCtrtCoverage', 'currentCoverage']),
  },

  watch: {
    '$i18n.locale': 'createOndemandUsageChart',
    isSearch(newVal) {
      if (newVal.isSearch) {
        this.createOndemandUsageChart();
      }
    },
    predictCtrtCoverage(newVal) {
      if (this.isSearch.isSearch) {
        this.predictCoverage = newVal;
      }
    },
  },
  created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    this.createOndemandUsageChart();
  },
  mounted() {
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
    async createOndemandUsageChart() {
      this.loading = true;
      const ondemandUsageChart = am4core.create('ondemandUsageChart', am4charts.XYChart);
      this.chartRef = ondemandUsageChart;
      ondemandUsageChart.cursor = new am4charts.XYCursor();
      ondemandUsageChart.legend = new am4charts.Legend();
      ondemandUsageChart.data = await this.getChartData();
      await this.createXaxis(ondemandUsageChart);
      await this.createYaxis(ondemandUsageChart);
      await this.commitmentableOndemandUsage(ondemandUsageChart);
      await this.currentOndemand(ondemandUsageChart);
      // this.predictOndemand(ondemandUsageChart);

      this.loading = false;
    },
    createXaxis(chart) {
      const dateXaxis = chart.xAxes.push(new am4charts.DateAxis()); // or dataAxis
      dateXaxis.dataFields.category = 'usagDate';
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

    commitmentableOndemandUsage(chart) {
      const series = chart.series.push(new am4charts.LineSeries());
      this.chartDefaultSetting(series);
      this.chartAreaColor(series, '#dedede');
      series.dataFields.dateX = 'usagDate';
      series.name = this.$t('optimization.commitmentEligibleUsage', { value: this.getTitle });
      series.dataFields.valueY = `tot${this.getField}CostEqvlnt`;
      this.tooltipColorSetting(series, '#dedede');
      series.tooltipText = `[#FFFFFF][bold]{dateX.formatDate('yyyy/MM/dd')}[/]
        ${this.$t('optimization.commitmentEligibleUsage', { value: this.getTitle })}: ₩{tot${this.getField}CostEqvlnt}
      `;
      series.tooltip.label.fill = am4core.color('black');
      // series.yAxis = this.leftYaxis;
    },
    currentOndemand(chart) {
      // 컬러 변경 필요
      const series2 = chart.series.push(new am4charts.LineSeries());
      const color = chartColorByNumber(this.currentCoverage.cmmtCvrgRt);
      this.chartAreaColor(series2, color);
      this.chartDefaultSetting(series2);
      series2.dataFields.dateX = 'usagDate';
      series2.name = this.$t('optimization.commitmentAppliedEquivalentAmount', { value: this.getTitle });
      series2.dataFields.valueY = `cmmt${this.getField}CostEqvlnt`;

      this.tooltipColorSetting(series2, color);
      series2.tooltipText = `[bold]{dateX.formatDate('yyyy/MM/dd')}[/]
        ${this.$t('optimization.commitmentAppliedEquivalentAmount', { value: this.getTitle })}: ₩{cmmt${
        this.getField
      }CostEqvlnt}
      `;
      // series2.yAxis = this.leftYaxis;
      // series2.stacked = true; // 이전 그래프에서 누적된 값으로 표출한건지
    },
    predictOndemand(chart) {
      const series2 = chart.series.push(new am4charts.LineSeries());
      series2.stroke = am4core.color('#ea1818');
      series2.yAxis = chart.yAxes.getIndex(1);
      series2.dataFields.categoryX = 'usagDate';
      series2.name = '예상 약정 커버리지';
      series2.dataFields.valueY = 'cmm';
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
      try {
        const result = await costOptiService.fetchTransition(this.filter);
        const chartData = result.data.data || [];
        this.existData = chartData.length > 0;
        return chartData;
      } catch (err) {
        console.error('getChartData', err);
      }
    },
    excelDownload() {
      const xlsPrefix = `${this.filter.cspTypCd} ${this.getTitle}`;

      this.chartRef.exporting.filePrefix = `${xlsPrefix}_${this.$t('optimization.usageTrendExcel')}_${moment().format(
        'YYYY-MM-DD'
      )}`;
      this.chartRef.exporting.dataFields = {
        usagDate: this.$t('optimization.dateOfUse'),
        [`tot${this.getField}CostEqvlnt`]: this.$t('optimization.valueContractApplication', { value: this.getTitle }),
        [`cmmt${this.getField}CostEqvlnt`]: this.$t('optimization.valueCurrentcommitment', { value: this.getTitle }),
      };

      var dateFormatter = new am4core.DateFormatter();
      dateFormatter.dateFormat = 'yyyy/MM/dd'; // 원하는 날짜 형식
      this.chartRef.exporting.dateFormatter = dateFormatter;

      this.chartRef.exporting.data.forEach((val) => {
        val.usagDate = moment(val.usagDate).format('YYYY/MM/DD');
        // val.totOnDmndCostEqvlnt = numberCutDecimal(val.totOnDmndCostEqvlnt);
        // val.cmmtOnDmndCostEqvlnt = numberCutDecimal(val.cmmtOnDmndCostEqvlnt);
      });

      const sheetName = i18n.locale === 'ko' ? `${xlsPrefix} 사용량 트렌드 상세내역` : `${xlsPrefix} usageTrendDetails`;
      this.chartRef.exporting.adapter.add('xlsxWorkbook', function (wb) {
        const data = wb.workbook.Sheets.Data;
        data['!cols'] = [{ width: 13 }, { width: 26 }, { width: 26 }]; // cols width

        for (const key in data) {
          if (key.indexOf('B') > -1 || key.indexOf('C') > -1) {
            data[key].z = '₩#,##0';
          }
        }

        wb.workbook.SheetNames[0] = sheetName;
        wb.workbook.Sheets[sheetName] = data;

        return wb;
      });
      this.chartRef.exporting.export('xlsx');
    },
  },
};
</script>

<style scoped>
defs {
  display: none;
}
</style>
