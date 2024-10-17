<template>
  <div id="searchPriceGraph" class="searchPriceGraph" style="padding: 20px">
    <div id="costTrendGraph" style="height: 400px"></div>
    <div class="flex justify-center" style="gap: 20px">
      <SearchPriceChartLegend
        v-for="(legend, index) in legendsData"
        :key="index"
        :usd-currency="usdCurrency"
        :legend-data="legend"
        :tab="tab"
      />
    </div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import SearchPriceChartLegend from '@/pages/Advisor/components/SearchPriceChartLegend.vue';
import moment from 'moment';
import demoData from '../../../../../../public/locales/comparison_demo.json';

export default {
  components: {
    SearchPriceChartLegend,
  },
  props: {
    tab: {
      type: Number,
      default: 1,
    },
    rangeType: {
      type: Number,
      default: 90,
    },
    gridData: {
      type: Array,
      default: () => [],
    },
    graphData: {
      type: Array,
      default: () => [],
    },
    currency: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      savingData: [],
      legendsData: [],
      rowdata: [],
      colors: ['#999999', '#2CC2FD', '#1AE3BB', '#FC5AA1'],
    };
  },
  computed: {
    countRange() {
      switch (this.rangeType) {
        case 7:
          return 1;
        case 30:
          return 3;
        case 90:
          return 10;
        default:
          return 1;
      }
    },
    usdCurrency() {
      return this.currency === 'usd';
    },
    currencySymbol() {
      return this.currency === 'usd' ? '$' : '₩';
    },
  },
  watch: {
    '$i18n.locale': ['createCostTrendChart'],
    rangeType() {
      this.createCostTrendChart();
    },
    tab() {
      this.createCostTrendChart();
    },
    currency() {
      this.createCostTrendChart();
    },
  },

  created() {
    //init data
    this.getData();

    // Apply theme
    am4core.useTheme(am4themes_animated);
  },

  mounted() {
    this.createCostTrendChart();
  },
  methods: {
    getData() {
      this.setGridData();
      this.legendsData = this.rowdata.map((item, index) => ({
        instanceName: item.instanceType,
        averageSavingRate: item.averageSavingsRate,
        estimatedCost: item.estimatedCost,
        averageAmount: item.averageAmount,
        availableArea: item.availableArea,
        instanceType: item.instanceType,
        color: this.rowdata.length === 3 ? this.colors[index + 1] : this.colors[index],
      }));
      if (this.rangeType === 7) this.savingData = this.graphData.slice(-7, this.graphData.length);
      else if (this.rangeType === 30) this.savingData = this.graphData.slice(-30, this.graphData.length);
      else {
        this.savingData = this.graphData;
      }
    },
    async setGridData() {
      this.rowdata = this.gridData;
      if (this.rangeType === 7) {
        this.rowdata = this.gridData.map((item, index) => {
          return {
            ...item,
            estimatedCost: ((item.estimatedCost / 90) * 7).toFixed(0),
            averageSavingsRate: (item.averageSavingsRate - 2.3).toFixed(2),
          };
        });
      } else if (this.rangeType === 30) {
        this.rowdata = this.gridData.map((item) => {
          return {
            ...item,
            estimatedCost: (item.estimatedCost / 3).toFixed(0),
            averageSavingsRate: (item.averageSavingsRate + 1.1).toFixed(2),
          };
        });
      }
    },
    createCostTrendChart() {
      this.getData();
      // Create chart instance
      let chart = am4core.create('costTrendGraph', am4charts.XYChart);
      this.chartRef = chart;
      chart.data = this.savingData;
      chart.background.fill = am4core.color('#fff');

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
      chart.cursor.maxTooltipDistance = -1;
      chart.cursor.lineY.disabled = true;
      chart.cursor.lineX.disabled = true;
      chart.fontFamily = 'Noto Sans KR';
      chart.tooltip.label.fontSize = 13;
      chart.autoMargins = true;
      chart.paddingTop = 32;
      chart.paddingLeft = 100;
      chart.paddingRight = 100;
      chart.paddingBottom = 32;

      //define x axes
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.minPeriod = 'day';
      dateAxis.dataFields.category = 'usageDate';
      dateAxis.baseInterval = { timeUnit: 'day', count: this.countRange };
      dateAxis.dateFormats.setKey('day', 'yyyy/MM/dd');
      dateAxis.dateFormats.setKey('month', 'yyyy/MM/dd');
      dateAxis.dateFormats.setKey('year', 'yyyy');
      dateAxis.periodChangeDateFormats.setKey('day', 'yyyy/MM/dd');
      dateAxis.periodChangeDateFormats.setKey('month', 'yyyy/MM/dd');
      dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
      dateAxis.renderer.minGridDistance = 90;
      dateAxis.renderer.grid.template.location = 0.5;
      dateAxis.renderer.labels.template.location = 0.5;
      dateAxis.renderer.labels.template.fill = am4core.color('#6C9FB2');
      dateAxis.tooltip.disabled = true;

      //define y axes
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.min = 0;
      valueAxis.numberFormatter.numberFormat = `${this.currencySymbol}#,###.00`;
      valueAxis.renderer.labels.template.fill = am4core.color('#6C9FB2');
      dateAxis.tooltip.disabled = true;

      //create series in chart
      const createSeries = (field, category, name, lineColor) => {
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = category;
        series.dataFields.valueY = field;
        if (field === 'r5' || field === 'ondemand') {
          series.tooltip.background.fill = am4core.color('#4F4F4FB5');
          series.tooltip.getFillFromObject = false;
          series.tooltip.getStrokeFromObject = true;
          series.tooltip.background.strokeWidth = 0;
          series.adapter.add('tooltipHTML', (_html, target) => {
            const legendData = target.tooltipDataItem.dataContext;
            if (legendData.ondemand) {
              return `
              <div>
                <div>
                  <p>${moment(legendData.usageDate).format('YYYY/MM/DD')}</p>
                </div>
                 <div class='flex items-center search-tooltip' style='gap: 5px'>
                  <div style='background-color: #999999; width: 13px; height: 13px'></div>
                  <p>${this.tab === 1 ? this.legendsData[0].availableArea : this.legendsData[0].instanceType} : ${
                this.currency === 'won' ? '₩' : '$'
              }${legendData.ondemand}</p>
                </div>
                <div class='flex items-center search-tooltip' style='gap: 5px'>
                  <div style='background-color: #2CC2FD; width: 13px; height: 13px'></div>
                  <p>${this.tab === 1 ? this.legendsData[1].availableArea : this.legendsData[1].instanceType} : ${
                this.currency === 'won' ? '₩' : '$'
              }${legendData.m6i}</p>
                </div>
                <div class='flex items-center search-tooltip' style='gap: 5px'>
                  <div style='background-color: #1AE3BB; width: 13px; height: 13px'></div>
                  <p>${this.tab === 1 ? this.legendsData[2].availableArea : this.legendsData[2].instanceType} : ${
                this.currency === 'won' ? '₩' : '$'
              }${legendData.r5}</p>
                </div>
                <div class='flex items-center search-tooltip' style='gap: 5px'>
                  <div style='background-color: #FC5AA1; width: 13px; height: 13px'></div>
                  <p>${this.tab === 1 ? this.legendsData[3].availableArea : this.legendsData[3].instanceType} : ${
                this.currency === 'won' ? '₩' : '$'
              }${legendData.r6i}</p>
                </div>
              </div>
            `;
            } else {
              return `
              <div>
                <div>
                  <p>${moment(legendData.usageDate).format('YYYY/MM/DD')}</p>
                </div>
                <div class='flex items-center search-tooltip' style='gap: 5px'>
                  <div style='background-color: #2CC2FD; width: 13px; height: 13px'></div>
                  <p>${this.tab === 1 ? this.legendsData[0].availableArea : this.legendsData[0].instanceType} : ${
                this.currency === 'won' ? '₩' : '$'
              }${legendData.m6i}</p>
                </div>
                <div class='flex items-center search-tooltip' style='gap: 5px'>
                  <div style='background-color: #1AE3BB; width: 13px; height: 13px'></div>
                  <p>${this.tab === 1 ? this.legendsData[1].availableArea : this.legendsData[1].instanceType} : ${
                this.currency === 'won' ? '₩' : '$'
              }${legendData.r5}</p>
                </div>
                <div class='flex items-center search-tooltip' style='gap: 5px'>
                  <div style='background-color: #FC5AA1; width: 13px; height: 13px'></div>
                  <p>${this.tab === 1 ? this.legendsData[2].availableArea : this.legendsData[2].instanceType} : ${
                this.currency === 'won' ? '₩' : '$'
              }${legendData.r6i}</p>
                </div>
              </div>
            `;
            }
          });
        }
        series.strokeWidth = 2;
        series.stroke = am4core.color(lineColor);
      };

      // this.legendsData.forEach((item) => {
      //   createSeries(item.instanceName, 'usageDate', item.color);
      // });
      createSeries('ondemand', 'usageDate', 'ondemand', '#999999');
      createSeries('r5', 'usageDate', 'r5', '#2CC2FD');
      createSeries('m6i', 'usageDate', 'm6i', '#1AE3BB');
      createSeries('r6i', 'usageDate', 'r6i', '#FC5AA1');
      return chart;
    },

    convertCurrency(number = 0) {
      let numberString = number.toString();

      return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
};
</script>

<style lang="scss">
.searchPriceGraph {
  margin: 0 2%;
}
.search-tooltip {
  margin: 0 !important;
}
</style>
