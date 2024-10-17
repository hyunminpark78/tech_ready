<template>
  <div class="box-wrap type2">
    <div class="title">
      <h4 class="tit-wrap">
        <span>{{ $t('optimization.contractTrendsByService') }}</span>
        <div class="tooltip-wrap">
          <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
          <div class="tooltip-layer">
            <strong class="ti">{{ $t('optimization.contractTrendsByService') }}</strong>
            {{ $t('optimization.provideConversionCost', { value: getCmmtTitle }) }}<br />
            {{ $t('optimization.ManageYourContractUsage') }}
            <button class="close jsTooltipClose1">툴팁 닫기</button>
          </div>
        </div>
      </h4>
      <p class="info">{{ $t('optimization.searchSelectItems') }}</p>

      <Select
        ref="select"
        :data="selectRangeOptions"
        :key-getter="(item) => item.range"
        :text-getter="(item) => item.text"
        :default-selected="2"
        div-class="relative inline-block z-index mg-10"
        select-class="flex items-center justify-between px-4 py-1.5 text-sm text-left
        bg-white border rounded border-gray-300 h-8 mw-155"
        :arrow-src="require('@/assets/images/arrow-typ-03.svg')"
        arrow-class="ml-4 -mr-2"
        option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
        options-list-item-class="px-5 py-3 cursor-pointer hover:bg-primary-300"
        @click="handleClickType"
      />
    </div>
    <DataLoadingOverlay v-if="loading" :height="200"></DataLoadingOverlay>
    <NoDataOverlay v-else-if="!existData" :icon-type="'chart'" :height="200"></NoDataOverlay>
    <div v-show="existData" id="chart" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import colorConstants from '@/pages/Contract/cards/colorConstants';
import costOptiService from '@/services/costOptiService';
import Select from '@/components/Select';
import moment from 'moment';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay.vue';
import NoDataOverlay from '@/components/Overlays/NoDataOverlay.vue';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: {
    Select,
    DataLoadingOverlay,
    NoDataOverlay,
  },
  data() {
    return {
      cspTypCd: '',
      param: {},
      loading: true,
      existData: false,
      firstRendered: true,
      selectedRange: 'netSaveCost',
      titles: {},
    };
  },
  computed: {
    ...mapState('costOpti', ['filter', 'isSearch']),
    getCmmtTitle() {
      return this.titles[this.cspTypCd];
    },
    selectRangeOptions() {
      if (i18n.locale === 'ko') {
        return [
          { range: '', text: '전체' },
          { range: 'OnDmndCost', text: `${this.getCmmtTitle} 환산 비용` },
          { range: 'netSaveCost', text: '절감액' },
        ];
      } else {
        return [
          { range: '', text: 'All' },
          { range: 'OnDmndCost', text: `${this.getCmmtTitle} conversion cost` },
          { range: 'netSaveCost', text: 'Savings' },
        ];
      }
    },
  },
  watch: {
    '$i18n.locale': ['setTitles', 'selectRangeOptions', 'createChart'],
    // filter(newVal) {
    //   this.param = newVal;
    // },
    isSearch(newVal) {
      if (newVal.isSearch) {
        // this.param = this.filter;
        this.cspTypCd = this.filter.cspTypCd;
        this.createChart();
      }
    },
  },
  created() {
    this.setTitles();
    this.selectRangeOptions();
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    am4core.options.autoDispose = true; // 차트 인스턴스 자동 삭제
  },
  methods: {
    ...mapActions('costOpti', ['fetchDashTransition']),
    setTitles() {
      if (i18n.locale === 'ko') {
        this.titles = {
          AWS: '온디맨드',
          AZURE: '종량제',
          GCP: '온디맨드', // TODO: GCP 화면 추가 시 변경 필요!
        };
      } else {
        this.titles = {
          AWS: 'On-Demand',
          AZURE: 'PAYG',
          GCP: 'On-Demand', // TODO: GCP 화면 추가 시 변경 필요!
        };
      }
    },
    async createChart() {
      this.loading = true;

      const chart = am4core.create('chart', am4charts.XYChart);
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.maxTooltipDistance = -1;
      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 13;

      // 차트 데이터 가져오기
      const chartData = await this.getChartData();
      chart.data = chartData;

      // 서비스 레이블 순서 정렬 (for AZURE)
      const prodSortExpr = () => {
        const sortedProdList = [];
        for (let key in chartData[0]) {
          const prod = this.filter.prodList.find((item) => item.nm === key);
          if (prod) {
            sortedProdList.push(prod);
            continue;
          } else if (key.toUpperCase() === 'ETC') {
            // 기타 항목
            sortedProdList.push({
              cd: key.toLowerCase(),
              nm: key.toUpperCase(),
            });
            continue;
          }
        }
        return sortedProdList;
      };

      const prodList = this.filter.cspTypCd === 'AZURE' ? prodSortExpr() : this.filter.prodList;

      this.createXaxis(chart);
      this.createYaxis(chart);
      const columnSeries = this.createColumnSeries(prodList);
      const lineSeriese = this.createLineSeries(prodList);

      // 차트에 시리즈 추가
      columnSeries.forEach((series) => chart.series.push(series));
      lineSeriese.forEach((series) => chart.series.push(series));

      // legend 순서 제어 : 온디맨드 비용부터 표출
      chart.legend.data = [];
      lineSeriese.forEach((series) => chart.legend.data.push(series));
      columnSeries.forEach((series) => chart.legend.data.push(series));

      this.chart = chart;

      this.loading = false;
    },
    async getChartData() {
      let chartData = [];
      try {
        const result = await costOptiService.fetchDashTransition(this.filter);
        chartData = result.data.data || [];
        this.existData = result.data.data.length > 0;
      } catch (error) {
        console.error('chartData()', error);
      }

      // 데이터 가공
      const processData = chartData.map((list) => {
        let result = {
          usagDate: list.usagDate,
          onDmndCost: 0,
        };

        list.list.map((item) => {
          // 전체 절감 금액
          result[item.prodNm] = item.totNetSaveCost;
          // 약정 온디맨드/종량제 환산 금액
          result[item.prodNm + 'OnDmnd'] = item.cmmtOnDmndCostEqvlnt;
          // 온디맨드/종량제 비용
          result['onDmndCost'] += item.onDmndCost;
        });

        return result;
      });

      return processData;
    },
    createXaxis(chart) {
      const xAxis = chart.xAxes.push(new am4charts.DateAxis());
      xAxis.dataFields.category = 'usagDate';

      xAxis.baseInterval = { timeUnit: 'day', count: 1 };

      xAxis.dateFormats.setKey('day', 'yyyy/MM/dd');
      xAxis.dateFormats.setKey('month', 'MM');
      xAxis.dateFormats.setKey('year', 'yyyy');
      xAxis.periodChangeDateFormats.setKey('day', 'yyyy/MM/dd');
      xAxis.periodChangeDateFormats.setKey('month', 'MM');
      xAxis.periodChangeDateFormats.setKey('year', 'yyyy');

      chart.invalidateData(); // 차트 데이터 갱신

      xAxis.fontSize = 15;
      xAxis.tooltip.disabled = true;
      xAxis.renderer.grid.template.disabled = true;
      xAxis.renderer.labels.template.fontSize = 15;

      xAxis.renderer.minGridDistance = 100; // 최소 그리드 간격 설정
      xAxis.groupData = true; // 데이터 그룹화 (띄엄띄엄 표출)
    },
    createYaxis(chart) {
      const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.grid.template.disabled = true;
      yAxis.renderer.labels.template.fontSize = 15;

      chart.plotContainer.paddingTop = 10;
      yAxis.paddingTop = 10;

      yAxis.layout = 'absolute';
      yAxis.title.text = '(₩)';
      yAxis.title.rotation = 0;
      yAxis.title.align = 'right';
      yAxis.title.valign = 'top';
      yAxis.title.dy = -30;
      yAxis.title.dx = -5;
      yAxis.title.fill = am4core.color('#6c9fb2');

      yAxis.min = 0;
      yAxis.fontSize = 15;
      yAxis.tooltip.fontSize = 15;

      yAxis.calculateTotals = true;
      yAxis.extraMax = 0.15;
    },
    createLineSeries(prodList) {
      let seriesList = [];
      const { COLOR_LIST } = colorConstants;
      const tooltipText = this.getTooltipText(prodList);

      // 온디맨드/종량제 비용
      const series00 = new am4charts.LineSeries();
      this.chartDefaultSetting(series00, COLOR_LIST[8]);

      series00.dataFields.dateX = 'usagDate';
      series00.name = `${this.getCmmtTitle} ${this.$t('optimization.cost')}`;
      series00.dataFields.valueY = 'onDmndCost';
      series00.zIndex = -1;

      if (!this.firstRendered) {
        series00.hidden = true;
      }
      series00.stacked = true;
      seriesList.push(series00);

      // 서비스별 온디맨드/종량제 비용
      let series = [];
      prodList.forEach((prod, i) => {
        const prodNm = prod.nm;

        series[i] = new am4charts.LineSeries();
        this.chartDefaultSetting(series[i], prodNm === 'ETC' ? COLOR_LIST[21] : COLOR_LIST[i]);

        series[i].dataFields.dateX = 'usagDate';
        series[i].dataFields.valueY = `${prodNm}OnDmnd`;
        series[i].name = `${prodNm === 'ETC' ? '기타' : prodNm} ${this.getCmmtTitle} ${this.$t(
          'optimization.conversionCost'
        )}`;
        series[i].stacked = true;
        series[i].zIndex = -1;
        this.tooltipSetting(series[i]);
        series[i].tooltipText = tooltipText;

        // 차트 표출 여부
        if (this.firstRendered) {
          series[i].hidden = true;
        }
        // } else if (!this.filter.prodCdList.includes(prod.cd)) {
        //   series[i].hidden = true;
        // }
        // 차트 숨김 여부
        if (this.selectedRange === 'netSaveCost') {
          series[i].hidden = true;
        } else {
          series[i].hidden = false;
        }
        seriesList.push(series[i]);
      });

      return seriesList;
    },
    createColumnSeries(prodList) {
      let seriesList = [];
      const { COLOR_LIST } = colorConstants;
      const tooltipText = this.getTooltipText(prodList);

      // 절감액
      let series = [];
      prodList.forEach((prod, i) => {
        const prodNm = prod.nm;

        series[i] = new am4charts.ColumnSeries();
        series[i].dataFields.dateX = 'usagDate';
        series[i].dataFields.valueY = prodNm;
        series[i].name = `${prodNm === 'ETC' ? '기타' : prodNm} ${this.$t('optimization.savings')}`;
        series[i].stacked = true;
        series[i].legendSettings.position = 'bottom';

        series[i].fill = am4core.color(prodNm === 'ETC' ? COLOR_LIST[21] : COLOR_LIST[i]);
        series[i].columns.template.strokeOpacity = 0;
        series[i].columns.template.tooltipX = am4core.percent(100);
        series[i].columns.template.tooltipY = am4core.percent(0);
        this.tooltipSetting(series[i]);
        series[i].tooltipText = tooltipText;

        // 차트 표출 여부
        if (!prodList.includes(prod.cd)) {
          series[i].hidden = true;
        }
        // 차트 숨김 여부
        if (this.selectedRange === 'OnDmndCost') {
          series[i].hidden = true;
        } else {
          series[i].hidden = false;
        }
        seriesList.push(series[i]);
      });

      return seriesList;
    },
    getTooltipText(prodList) {
      let netsaveText = '';
      let onDmndText = '';

      prodList.forEach((prod) => {
        const prodNm = prod.nm;
        const prodTitle = prodNm === 'ETC' ? this.$t('optimization.etc') : prodNm;
        netsaveText += `${prodTitle} ${this.$t('optimization.conversionCost')}: ₩{${prodNm}.formatNumber('#,##0.')}
        `; // 줄바꿈 처리임.
        onDmndText += `${prodTitle} ${this.getCmmtTitle} ${this.$t(
          'optimization.conversionCost'
        )}: ₩{${prodNm}OnDmnd.formatNumber('#,##0.')}
        `; // 줄바꿈 처리임.
      });

      return (
        `[bold]{dateX.formatDate('yyyy/MM/dd')}[/]
        ` +
        netsaveText +
        `[/]
        \r\n
        ` +
        onDmndText
      );
    },
    tooltipSetting(series) {
      series.tooltip.fontSize = 12;
      series.tooltip.label.fontSize = 12;
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color('white');
      series.tooltip.background.stroke = am4core.color('#2cc2fd');
      series.tooltip.label.fill = am4core.color('darkgray');
      series.tooltip.pointerOrientation = 'left';
    },
    chartDefaultSetting(series, color) {
      series.fillOpacity = 0.4;
      series.strokeWidth = 2;
      series.sequencedInterpolation = true;

      series.fill = am4core.color(color);
      series.stroke = am4core.color(color);
    },
    handleClickType(type) {
      this.selectedRange = type.range;

      this.chart.series.each((series) => series.hide());

      // 클릭한 아이템만 보이도록 설정
      if (!type.range) {
        this.chart.series.each(function (series) {
          series.show();
        });
      } else if (type.range === 'OnDmndCost') {
        this.chart.series.each(function (series) {
          if (series.name.endsWith('비용') || series.name.endsWith('cost')) {
            series.show();
          } else {
            series.hide();
          }
        });
      } else if (type.range === 'netSaveCost') {
        this.chart.series.each(function (series) {
          if (series.name.endsWith('절감액') || series.name.endsWith('savings')) {
            series.show();
          } else {
            series.hide();
          }
        });
      }
    },
    excelDownload() {
      this.chart.exporting.filePrefix = `${this.$t('optimization.contractTrendsByService')}_${moment().format(
        'YYYY-MM-DD'
      )}`;
      this.chart.exporting.export('xlsx');
    },
  },
};
</script>

<style scoped>
defs {
  display: none;
}
.mg-10 {
  margin-bottom: 10px;
  margin-top: -10px;
}
</style>
