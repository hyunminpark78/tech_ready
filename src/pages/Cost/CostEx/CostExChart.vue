<template>
  <div class="box-wrap type2">
    <!-- title -->
    <div class="title">
      <div class="tab type2">
        <div v-show="cspTypCd == 'AWS'">
          <a :class="curcyCode === 'USD' ? `${btnStyle} ${btnActiveStyle}` : btnStyle" @click="updateCurcyCode('USD')"
            >USD</a
          >
          <a :class="curcyCode === 'KRW' ? `${btnStyle} ${btnActiveStyle}` : btnStyle" @click="updateCurcyCode('KRW')"
            >KRW</a
          >

          <!-- tooltip -->
          <div class="tooltip-wrap inline-block">
            <button class="ico jsTooltip1" @click="tooltip = !tooltip"><span>툴팁 열기</span></button>
            <div class="tooltip-layer" :style="tooltip ? 'display: block' : 'display: none'">
              <strong class="ti">{{ $t('cost.exchangeRate') }}</strong>
              <div class="ls">{{ $t('cost.aws3DayInvDate') }}</div>
              <div v-for="exchangeRate in exchangeRates" :key="exchangeRate.useYm" class="ls">
                <span v-if="i18n().locale === 'ko'"
                  >{{ exchangeRate.useYm.substring(0, 4) }}년 {{ exchangeRate.useYm.substring(4, 6) }}월 ￦{{
                    exchangeRate.krwExchgRate || exchangeRate.prevKrwExchgRate
                  }}</span
                >
                <span v-if="i18n().locale === 'en'"
                  >{{ exchangeRate.useYm.substring(4, 6) | toMonthEn }} {{ exchangeRate.useYm.substring(0, 4) }} ￦{{
                    exchangeRate.krwExchgRate || exchangeRate.prevKrwExchgRate
                  }}</span
                >
              </div>
              <button class="close jsTooltipClose1" @click="tooltip = false">툴팁 닫기</button>
            </div>
          </div>
        </div>
        <!-- //tooltip -->
      </div>
      <div class="total">
        <span>Total</span>
        <strong>{{ total }}</strong>
      </div>
      <div class="pos-right type2">
        <span class="tab-wrap">
          <a class="bar" :class="chartType === 'bar' ? 'clicked' : ''" @click="chartType = 'bar'">bar chart</a>
          <a class="line" :class="chartType === 'line' ? 'clicked' : ''" @click="chartType = 'line'">line chart</a>
        </span>
        <button class="fold jsFold1" @click="chartView = !chartView">
          <span>{{ chartView ? $t('cost.collapse') : $t('cost.expand') }}</span>
        </button>
      </div>
    </div>
    <!-- //title -->
    <div v-show="chartView" class="detail">
      <p class="info">
        <span v-show="cspTypCd === 'AWS'"> {{ $t('common.paragraph.feeExchangeRate') }}</span>
        <span v-show="cspTypCd === 'AZURE'"> {{ $t('common.paragraph.feeRoundingMethod') }}</span>
      </p>
      <template v-if="loading">
        <div class="relative border-t" style="height: 318px; background-color: #e3ebf1">
          <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
            <div class="mb-4 loading_rotate">
              <span class="loadingcolor"></span>
            </div>
            <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
          </div>
        </div>
      </template>
      <div v-show="existData && !loading" id="chart" style="width: 100%; height: 380px"></div>
      <div v-show="!existData && !loading" class="flex flex-col items-center justify-center" style="height: 380px">
        <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
        <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import color from '@/pages/Contract/cards/colorConstants';
import { mapActions, mapGetters, mapState } from 'vuex';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
import _ from 'lodash';
import { i18n } from '../../../../public/locales/i18n';

export default {
  props: {
    periodType: {
      type: [Array, String],
      default: () => ['DALY'],
    },
  },
  data() {
    return {
      btnStyle: `inline-block rounded mw60 py-1 text-center font-bold border border-primary-400 text-sm`,
      btnActiveStyle: 'bg-primary-400 text-white',
      btnDiStyle: 'bg-white text-primary-400',
      chartView: true,
      loading: true,
      tooltip: false,
      chartType: 'bar',
      curcyCode: 'USD',
      staticsData: [],
      existData: false,
    };
  },
  computed: {
    ...mapState('costEx', ['costExplorerList', 'searchParam']),
    ...mapGetters('costEx', ['cspTypCd']),
    total() {
      const field = this.curcyCode === 'USD' ? 'sum' : 'krwSum';
      const fixed = this.curcyCode === 'USD' ? 2 : 0;
      const total = _.sum(this.staticsData.map((data) => parseFloat(data[field]))).toFixed(fixed);
      return this.costFormatter(total);
    },
    sumKey() {
      return this.curcyCode === 'USD' ? 'sum' : 'krwSum';
    },
    exchangeRates() {
      return _.orderBy(
        _.unionBy(
          this.costExplorerList.map(({ exchangeRate }) => exchangeRate),
          'useYm'
        ),
        ['useYm'],
        ['asc']
      );
    },
  },
  watch: {
    costExplorerList(data) {
      //console.log("watch costExplorerList");
      if (this.cspTypCd === 'AZURE') {
        this.updateCurcyCode('KRW');
      }
      this.loading = true;
      this.staticsData = _.cloneDeep(data);

      if (_.isEmpty(this.staticsData)) {
        this.existData = false;
      } else {
        this.existData = true;
        this.staticsData.forEach((data) => {
          const { datestd } = data;
          const convertDatestd =
            this.periodType === 'DALY'
              ? `${datestd.substring(0, 4)}/${datestd.substring(4, 6)}/${datestd.substring(6, 8)}`
              : `${datestd.substring(0, 4)}/${datestd.substring(4, 6)}`;
          data.sum = parseFloat(data.sum || 0);
          data.krwSum = parseFloat(data.krwSum || 0);
          data.datestd = convertDatestd;
        });
        this.createChart();
      }
      this.loading = false;
    },
    chartType() {
      if (this.costExplorerList.length) {
        this.createChart();
      }
    },
    curcyCode() {
      this.createChart();
    },
  },
  created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    am4core.options.autoDispose = true; // 차트 인스턴스 자동 삭제
    this.loading = true;
  },
  methods: {
    i18n() {
      return i18n;
    },
    createChart() {
      if (this.chart) this.chart.dispose();
      const chart = am4core.create('chart', am4charts.XYChart);
      chart.paddingRight = 60;
      chart.data = this.chartData();

      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 13;
      chart.legend.scrollable = true;

      const { COLOR_LIST } = color;
      const colors = COLOR_LIST.map((c) => am4core.color(c));
      const amchartColorSet = new am4core.ColorSet();
      amchartColorSet.shuffle = true;
      for (let i = 0; i < 400; i++) {
        colors.push(am4core.color(amchartColorSet.next().hex));
      }
      chart.colors.list = colors;

      this.createXaxis(chart);
      this.createYaxis(chart);
      Object.keys(_.head(chart.data))
        .filter((key) => key != 'datestd')
        .forEach((key, i) => this.createColumnSeries(chart, key, i));

      chart.events.on(
        'inited',
        function () {
          this.loading = false;
        },
        this
      );
      this.chart = chart;
    },
    chartData() {
      let chartData = this.staticsData;
      const groupChain = _.chain(this.staticsData).groupBy('grptype');
      let groupKeys = groupChain
        .map((l, k) => k)
        .union()
        .value();

      const length = groupKeys.length;

      if (length > 5) {
        const sortList = groupChain
          .map((group, grptype) => {
            const result = { grptype };
            result[this.sumKey] = _.sumBy(group, this.sumKey);
            return result;
          })
          .orderBy([this.sumKey], ['desc'])
          .value();

        const topGrpTypeList = sortList.slice(0, 5).map(({ grptype }) => grptype);
        const etcGrpTypeList = sortList.slice(5).map(({ grptype }) => grptype);
        const etcDataList = this.staticsData.filter(({ grptype }) => !topGrpTypeList.includes(grptype));
        const summaryList = this.staticsData.filter(({ grptype }) => topGrpTypeList.includes(grptype));
        const etcSumList = _.chain(etcDataList)
          .groupBy('datestd')
          .map((dateGroup, datestd) => {
            let grpData = {
              datestd,
              grptype: `ETC(${etcGrpTypeList.length})`,
              grpname: `ETC(${etcGrpTypeList.length})`,
            };
            grpData[this.sumKey] = _.sumBy(dateGroup, this.sumKey);
            return grpData;
          })
          .value();
        chartData = summaryList.concat(etcSumList);
      }
      groupKeys = _.chain(chartData)
        .groupBy('grpname')
        .map((l, k) => k)
        .union()
        .value();

      chartData = _.chain(chartData)
        .groupBy('datestd')
        .map((list, datestd) => {
          const result = { datestd };
          const grptypeGroup = _.groupBy(list, 'grpname');
          groupKeys.forEach((groupKey) => (result[groupKey] = _.sumBy(grptypeGroup[groupKey] || [], this.sumKey)));
          return result;
        })
        .orderBy(['datestd'])
        .value();

      return chartData;
    },
    createXaxis(chart) {
      const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      xAxis.dataFields.category = 'datestd';
      xAxis.fontSize = 15;
      xAxis.tooltip.disabled = true;
      xAxis.renderer.grid.template.disabled = true;
      xAxis.renderer.labels.template.fontSize = 15;

      xAxis.renderer.minGridDistance = 100; // 최소 그리드 간격 설정
    },
    createYaxis(chart) {
      const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.grid.template.disabled = true;
      yAxis.renderer.labels.template.fontSize = 15;
      yAxis.calculateTotals = true;

      yAxis.layout = 'absolute';
      yAxis.paddingTop = 15;
      yAxis.title.text = this.curcyCode === 'USD' ? '($)' : '(₩)';
      yAxis.title.rotation = 0;
      yAxis.title.align = 'right';
      yAxis.title.valign = 'top';
      yAxis.title.dy = -30;
      yAxis.title.dx = -5;
      yAxis.title.fill = am4core.color('#6c9fb2');

      // yAxis.min = 0;
      yAxis.fontSize = 15;
      yAxis.tooltip.fontSize = 15;
    },
    createColumnSeries(chart, key, i) {
      const series =
        this.chartType === 'bar'
          ? chart.series.push(new am4charts.ColumnSeries())
          : chart.series.push(new am4charts.LineSeries());
      series.dataFields.categoryX = 'datestd';
      series.dataFields.valueY = key;
      series.fill = am4core.color(chart.colors.list[i].hex);
      series.stroke = am4core.color(chart.colors.list[i].hex);
      series.name = key;
      series.stacked = true;
      // series.sequencedInterpolation = true;

      this.tooltipSetting(series);
      series.tooltip.getStrokeFromObject = true;
      series.tooltip.getFillFromObject = false;
      series.tooltip.label.fill = am4core.color(chart.colors.list[i].hex);

      if (this.chartType === 'line') {
        let bullet = series.bullets.push(new am4charts.Bullet());
        let interfaceColors = new am4core.InterfaceColorSet();
        let circle = bullet.createChild(am4core.Circle);
        circle.stroke = interfaceColors.getFor('background');
        circle.horizontalCenter = 'middle';
        circle.verticalCenter = 'middle';
        circle.width = 10;
        circle.height = 10;
      } else {
        series.columns.template.tooltipHTML = 'Loading...';
        series.columns.template.adapter.add('tooltipHTML', (html, target) => {
          let value = target.tooltipDataItem.valueY;
          let strHtml = `<div><p class='custom_tooltip_date'>{name}</p><p class='custom_tooltip_value'>{categoryX} {valueY}</p></div>`;
          return strHtml;
        });
      }
    },
    tooltipSetting(series) {
      series.tooltip.fontSize = 12;
      series.tooltip.label.fontSize = 12;
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color('white');
      series.tooltip.label.fill = am4core.color('darkgray');
      series.tooltip.pointerOrientation = 'vertical';
    },
    chartDefaultSetting(series, color) {
      series.fillOpacity = 0.4;
      series.strokeWidth = 2;
      series.sequencedInterpolation = true;

      series.fill = am4core.color(color);
      series.stroke = am4core.color(color);
    },
    roundToNumber(num, point) {
      return +(Math.round(num + `e+${point}`) + `e-${point}`);
    },
    costFormatter(value) {
      if (value !== undefined) {
        const type = this.curcyCode === 'USD' ? '$' : '₩';
        if (/[e|E]/.test(`${value}`)) value = parseFloat(value).toLocaleString();
        let val = +(Math.round(value + `e+${3}`) + `e-${3}`);
        const formatted = numberWithCommas(val);
        if (formatted.indexOf('-') !== -1) {
          return `-${type}${formatted.slice(1)}`;
        } else {
          return `${type}${formatted}`;
        }
      } else {
        return '-';
      }
    },
    updateCurcyCode(type) {
      this.curcyCode = type;
      this.$emit('updateCurcyCode', type);
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
