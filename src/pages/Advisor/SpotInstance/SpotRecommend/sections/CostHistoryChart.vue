<template>
  <div style="margin-top: 20px; width: 100%">
    <div class="title flex justify-center">
      <h4 class="tit-wrap">{{ $t('advisor.detailTable.spotComparison.fareHistory') }}</h4>
    </div>
    <div id="costTrendGraph" style="height: 300px"></div>
    <div class="flex justify-center" style="gap: 20px; margin-top: 20px">
      <ComparisonChartLegend v-for="(legend, index) in legendsData" :key="index" :legend-data="legend" />
      <ComparisonChartCustomLegend v-for="(legend, index) in legendsCustomData" :key="index" :legend-data="legend" />
    </div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import ComparisonChartLegend from '@/pages/Advisor/components/ComparisonChartLegend.vue';
import moment from 'moment';
import demoData from '../../../../../../public/locales/comparison_demo.json';
import { EventBus } from '../../../../Setting/CloudAuth/AzureAcctMgmt/eventBus';
import ComparisonChartCustomLegend from '@/pages/Advisor/components/ComparisonChartCustomLegend.vue';

export default {
  components: {
    ComparisonChartCustomLegend,
    ComparisonChartLegend,
  },
  props: {
    rangeType: {
      type: Number,
      default: 90,
    },
  },
  data() {
    return {
      savingData: [],
      legendsCustomData: [],
      legendsData: [],
      createSeries: null,
      deleteSeries: null,
      comparedInstanceType: null,
      customizationInstanceType: null,
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
  },
  watch: {
    '$i18n.locale': ['createCostTrendChart'],
    rangeType() {
      this.changeLegendaData();
      this.createCostTrendChart();
    },
  },

  created() {
    //init data
    this.getData();

    // Apply theme
    am4core.useTheme(am4themes_animated);

    EventBus.$on('eventFromComparisonTable', this.handleEventFromComparisonTable);
    EventBus.$on('eventFromComparisonTableDelete', this.handleEventFromComparisonTableDelete);
  },

  mounted() {
    this.setLegendInitData();
    this.createCostTrendChart();
  },
  methods: {
    getData() {
      this.savingData = demoData.rateSearch.map((item) => ({
        usageDate: item.usedts,
        ondemand: 701,
        r6i: (Number(item['ap-northeast-2a']) * 1355.55).toFixed(0),
        r5: (Number(item['ap-northeast-2b']) * 1355.55).toFixed(0),
        m6i: (Number(item['ap-northeast-2c']) * 1355.55).toFixed(0),
        comparedInstanceType: (Number(item['ap-northeast-2d']) * 1355.55).toFixed(0),
      }));
    },
    setLegendInitData() {
      this.legendsData = [
        {
          headerText: this.$t('advisor.detailTable.spotComparison.onDemand'),
          instanceName: 'g4dn.xlarge',
          averageAmount: 1513922,
          color: '#999999',
        },
        {
          headerText: this.$t('advisor.detailTable.spotComparison.sameType'),
          instanceName: 'g4dn.xlarge',
          averageSavingRate: demoData.savingRate.Column12.toFixed(2),
          averageAmount: (demoData.average.Column12 * 1355.55 * 24 * 90).toFixed(0),
          currentRate: (demoData.average.Column12 * 1355.55 + 8).toFixed(0),
          interruptionFrequency: '5~10%',
          color: '#2CC2FD',
        },
        {
          headerText: this.$t('advisor.detailTable.spotComparison.costPriority'),
          instanceName: 'g4ad.xlarge',
          averageSavingRate: demoData.savingRate.Column13.toFixed(2),
          averageAmount: (demoData.average.Column13 * 1355.55 * 24 * 90).toFixed(0),
          currentRate: (demoData.average.Column13 * 1355.55 + 27).toFixed(0),
          interruptionFrequency: '5~10%',
          color: '#1AE3BB',
        },
        {
          headerText: this.$t('advisor.detailTable.spotComparison.stabilityFirst'),
          instanceName: 'g5.xlarge',
          averageSavingRate: demoData.savingRate.Column11.toFixed(2),
          averageAmount: (demoData.average.Column11 * 1355.55 * 24 * 90).toFixed(0),
          currentRate: (demoData.average.Column11 * 1355.55 + 12).toFixed(0),
          interruptionFrequency: '<5%',
          color: '#FC5AA1',
        },
      ];
    },
    changeLegendaData() {
      let newData;
      this.setLegendInitData();
      if (this.rangeType === 7) {
        newData = this.legendsData.map((item) => {
          return {
            ...item,
            averageAmount: ((item.averageAmount / 90) * 7).toFixed(0),
          };
        });
        this.legendsData = newData;
      } else if (this.rangeType === 30) {
        newData = this.legendsData.map((item) => {
          return {
            ...item,
            averageAmount: (item.averageAmount / 3).toFixed(0),
          };
        });
        this.legendsData = newData;
      }
      console.log('legend:' + this.legendsData);
    },
    createCostTrendChart() {
      this.getData();

      // Create chart instance
      let chart = am4core.create('costTrendGraph', am4charts.XYChart);
      this.chartRef = chart;
      chart.data = this.savingData;

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
      chart.cursor.maxTooltipDistance = -1;
      chart.cursor.lineY.disabled = true;
      chart.cursor.lineX.disabled = true;
      chart.fontFamily = 'Noto Sans KR';
      chart.tooltip.label.fontSize = 13;
      chart.autoMargins = true;
      chart.paddingTop = 30;
      chart.paddingBottom = 0;

      //define x axes
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      const savingDataLength = this.savingData.length;
      const endDate = this.savingData[savingDataLength - 1].usageDate;
      dateAxis.min = moment(endDate).subtract(this.rangeType, 'days').valueOf();
      dateAxis.max = moment(endDate).valueOf();
      dateAxis.minPeriod = 'day';
      dateAxis.dataFields.category = 'usageDate';
      dateAxis.baseInterval = { timeUnit: 'day', count: this.countRange };
      dateAxis.dateFormats.setKey('day', 'yyyy/MM/dd');
      dateAxis.dateFormats.setKey('month', 'yyyy/MM/dd');
      dateAxis.dateFormats.setKey('year', 'yyyy');
      dateAxis.periodChangeDateFormats.setKey('day', 'yyyy/MM/dd');
      dateAxis.periodChangeDateFormats.setKey('month', 'yyyy/MM/dd');
      dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
      dateAxis.renderer.minGridDistance = 110;
      dateAxis.startLocation = 0.5;
      dateAxis.endLocation = 0.5;

      //define y axes
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;

      // Add currency symbol label
      let label = chart.plotContainer.createChild(am4core.Label);
      label.text = '(₩)';
      label.fontSize = 16;
      label.fill = am4core.color('#6C9FB2');
      label.dy = -30;
      label.dx = -30;

      //create series in chart
      this.createSeries = (field, category, name, lineColor) => {
        let series = chart.series.push(new am4charts.LineSeries());

        if (field != 'r5' && field != 'm6i' && field != 'r6i' && field != 'ondemand') {
          field = 'comparedInstanceType';
          series.strokeDasharray = '8,4';
          let series0 = chart.series.getIndex(0);
          series0.adapter.remove('tooltipHTML');

          this.legendsCustomData.push({
            headerText: this.$t('advisor.detailTable.spotComparison.customizationSpotInstance'),
            instanceName: 'g5.2xlarge',
            averageSavingRate: demoData.savingRate.Column14.toFixed(2),
            averageAmount: (demoData.average.Column14 * 1355.55 + 68).toFixed(0),
            currentRate: (demoData.average.Column14 * 1355.55).toFixed(0),
            interruptionFrequency: '5~10%',
            color: '#A166F1',
          });
        }

        series.name = field;
        series.dataFields.dateX = category;
        series.dataFields.valueY = field;
        series.tooltip.background.fill = am4core.color('#4F4F4FB5');
        series.tooltip.getFillFromObject = false;
        series.tooltip.getStrokeFromObject = true;
        series.tooltip.background.strokeWidth = 0;
        if (field === 'r5' || field === 'ondemand') {
          series.adapter.add('tooltipHTML', (html, target) => {
            const legendData = target.tooltipDataItem.dataContext;
            return `
              <div>
                <div>
                  <p>${moment(legendData.usageDate).format('YYYY/MM/DD')}</p>
                </div>
                <div class='flex items-center' style='gap: 5px'>
                  <div style='background-color: #999999; width: 13px; height: 13px'></div>
                  <p>온디맨드 : ₩${legendData.ondemand}</p>
                </div>
                <div class='flex items-center' style='gap: 5px'>
                  <div style='background-color: #2CC2FD; width: 13px; height: 13px'></div>
                  <p>g4dn.xlarge : ₩${legendData.m6i}</p>
                </div>
                <div class='flex items-center' style='gap: 5px'>
                  <div style='background-color: #1AE3BB; width: 13px; height: 13px'></div>
                  <p>g4ad.xlarge : ₩${legendData.r5}</p>
                </div>
                <div class='flex items-center' style='gap: 5px'>
                  <div style='background-color: #FC5AA1; width: 13px; height: 13px'></div>
                  <p>g5.xlarge : ₩${legendData.r6i}</p>
                </div>
              </div>
            `;
          });
        } else if (field === 'comparedInstanceType') {
          series.adapter.add('tooltipHTML', (html, target) => {
            const legendData = target.tooltipDataItem.dataContext;
            return `
               <div>
                <div>
                  <p>${moment(legendData.usageDate).format('YYYY/MM/DD')}</p>
                </div>
                <div class='flex items-center' style='gap: 5px'>
                  <div style='background-color: #2CC2FD; width: 13px; height: 13px'></div>
                  <p>g4dn.xlarge : ₩${legendData.ondemand}</p>
                </div>
                <div class='flex items-center' style='gap: 5px'>
                  <div style='background-color: #1AE3BB; width: 13px; height: 13px'></div>
                  <p>g4ad.xlarge : ₩${legendData.r5}</p>
                </div>
                <div class='flex items-center' style='gap: 5px'>
                  <div style='background-color: #FC5AA1; width: 13px; height: 13px'></div>
                  <p>g5.xlarge : ₩${legendData.r6i}</p>
                </div>
                <div class='flex items-center' style='gap: 5px'>
                  <div style='background-color: #A166F1; width: 13px; height: 13px'></div>
                  <p>g5.2xlarge : ₩${legendData.comparedInstanceType}</p>
                </div>
              </div>
            `;
          });
        }
        series.strokeWidth = 2;
        series.stroke = am4core.color(lineColor);
      };

      this.deleteSeries = () => {
        this.legendsCustomData.pop();
        chart.series.removeIndex(chart.series.length - 1).dispose();
      };

      this.createSeries('ondemand', 'usageDate', 'ondemand', '#999999');
      this.createSeries('r5', 'usageDate', 'r5', '#2CC2FD');
      this.createSeries('m6i', 'usageDate', 'm6i', '#1AE3BB');
      this.createSeries('r6i', 'usageDate', 'r6i', '#FC5AA1');
      return chart;
    },
    handleEventFromComparisonTable(data) {
      this.createSeries(data.instanceType, 'usageDate', data.instanceType, '#A166F1');
    },
    handleEventFromComparisonTableDelete() {
      this.deleteSeries();
    },
  },
};
</script>

<style lang="scss"></style>
