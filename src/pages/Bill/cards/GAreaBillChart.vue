<template>
  <div>
    <div ref="amChartArea" :style="styleObject"></div>
    <div id="legendArea" style="overflow: hidden; height: 140px"></div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as utils from 'openitlibrary/src/library/commonUtil';
import constants from '@/pages/Contract/cards/colorConstants';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
import _ from 'lodash';

am4core.useTheme(am4themes_animated);
am4core.options.commercialLicense = true;

export default {
  name: 'GAreaBillChart',
  componentName: 'GAreaBillChart',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    chartHeight: {
      type: String,
      default: '200',
    },
    chartTheme: {
      type: String,
      default: '',
    },
    chartStyle: {
      type: Array,
      default: () => [],
    },
    chartType: {
      type: String,
      default: 'default',
    },
    chartLocation: {
      type: String,
      default: '',
    },
    customKeys: {
      type: Array,
      default: () => [],
    },
    propsInfo: {
      type: Object,
      default: () => ({
        dateProp: '',
        keyProp: '',
        nameProp: '',
        valueProp: '',
      }),
    },
    curcyCode: {
      type: String,
      default: 'KRW',
    },
    chartOption: {
      type: Object,
      default: () => ({
        isNumberFormat: false,
        numberFormat: '',
        numberFix: [
          { number: 1e3, suffix: 'k' },
          { number: 1e6, suffix: 'M' },
          { number: 1e9, suffix: 'B' },
          { number: 1e12, suffix: 'T' },
        ],
        prefixed: '',
        colors: [],
        fontColor: '#6c9fb2',
        legend: {
          isUse: false,
          position: 'bottom',
          align: 'center',
          valign: 'center',
          backgroundColor: '',
          backgroundOpacity: 0,
          minWidth: 300,
          width: 300,
          height: 100,
          fontSize: 11,
          labelColor: '#666666',
          clickAble: false,
          focusAble: false,
          showData: false,
          isLimitLegend: false,
        },
        cateAxis: {
          isUse: true,
          multiValueAxis: false,
          gridDistance: 20,
          fontSize: 10,
          lineWeight: 0,
          lineLocation: 0,
          isLegendCustom: false,
          axisHide: false,
          tooltipHide: false,
          prefix: '',
          suffix: '',
        },
        valueAxis: {
          isUse: true,
          gridDistance: 20,
          fontSize: 10,
          stacked: false,
          calculate: false,
          lineWeight: 0,
          lineLocation: 0,
          axisHide: false,
          tooltipHide: false,
          valueTitle: '',
          titlePadding: 20,
          prefix: '',
          suffix: '',
        },
        series: {
          isUse: true,
          isCustom: false,
          isStack: false,
          valueShow: '',
          isTotalTooltip: false,
          isCustomTooltip: false,
          totalTooltipCont: '',
          tooltipType: 'default',
          tooltipCont: '{name}: [bold]{valueY.total}[/]',
          fillOpacity: 0,
          strokeWidth: 2,
          strokeDasharray: 0,
          isRangeArea: false,
          customName: [],
          isGradation: false,
          color: '#C6C3C4',
          prefix: '',
          suffix: '',
          bullet: {
            isUse: false,
          },
        },
        tooltip: {
          isUse: false,
        },
        cursor: {
          isUse: true,
          isCustom: false,
          isHiddenLine: false,
        },
      }),
    },
  },
  data() {
    return {
      chart: null,
      categoryName: 'xDate',
      totalPrice: 0,
    };
  },
  computed: {
    styleObject() {
      return {
        height: this.chartHeight + 'px',
        overflow : 'hidden',
      };
    },
  },
  watch: {
    data: function (newData) {
      this.setChartInfo(newData);
    },
    totalPrice: function (data) {
      this.$emit('total-price', numberWithCommas(data));
    },
  },
  mounted() {
    this.setChartInfo(this.data);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    setChartInfo(data) {
      /**
       차트 옵션 세팅
       */
      switch (this.chartTheme) {
        case 'dash_expectCost':
          this.chartOption.legend.isUse = false;
          this.chartOption.tooltip.isUse = false;

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isHiddenLine = true;

          this.chartOption.series.isCustom = true;
          this.chartOption.series.stacked = false;
          this.chartOption.series.isTotalTooltip = true;
          (this.chartOption.series.tooltipCont = '{valueY.value}'), (this.chartOption.series.isGradation = true);

          this.chartOption.valueAxis.calculate = false;
          this.chartOption.valueAxis.axisHide = true;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.tooltipHide = true;

          this.chartOption.cateAxis.multiValueAxis = false;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.axisHide = true;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartStyle = [
            {
              fill: true,
              color: '#00A5ED',
              fillOpacity: 0.3,
              tensionX: 1,
              tensionY: 1,
              strokeOpacity: 1,
              strokeDasharray: 0,
              strokeWidth: 2,
              seriesTooltop: true,
            },
            {
              fill: false,
              color: '#cccccc',
              fillOpacity: 0,
              tensionX: 0.85,
              tensionY: 0.85,
              strokeOpacity: 1,
              strokeDasharray: 4,
              strokeWidth: 2,
              seriesTooltop: false,
            },
          ];

          break;
        case 'dash_usageCost':
          this.categoryName = 'xDate';
          this.chartOption.cateAxis.multiValueAxis = false;
          this.chartOption.legend.isUse = true;
          this.chartOption.legend.position = 'right';
          this.chartOption.legend.align = 'top';
          this.chartOption.legend.showData = false;
          this.chartOption.legend.labelColor = '#4a4a4a';
          this.chartOption.legend.width = 500;
          this.chartOption.legend.minWidth = 400;
          this.chartOption.legend.height = 140;
          this.chartOption.legend.fontSize = 14;

          this.chartOption.series.isCustom = false;
          this.chartOption.series.isStack = true;
          this.chartOption.series.isTotalTooltip = true;
          this.chartOption.series.tooltipCont = '{valueY.total}';
          this.chartOption.series.tooltipType = '';
          this.chartOption.series.fillOpacity = 0.3;
          this.chartOption.series.isGradation = false;

          this.chartOption.cateAxis.gridDistance = 50;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.isLegendCustom = true;

          this.chartOption.valueAxis.gridDistance = 50;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.calculate = true;
          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.valueTitle = this.curcyCode === 'USD' ? '($)' : '(₩)';
          this.chartOption.valueAxis.titlePadding = 20;
          this.chartOption.isNumberFormat = true;
          this.chartOption.numberFormat = '#a';

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isCustom = true;

          break;
        case 'use_usageCost':
          this.categoryName = 'xDate';
          this.chartOption.cateAxis.multiValueAxis = false;
          this.chartOption.legend.isUse = true;
          this.chartOption.legend.position = 'bottom';
          this.chartOption.legend.align = 'center';
          this.chartOption.legend.showData = false;
          this.chartOption.legend.labelColor = '#4a4a4a';
          this.chartOption.legend.width = 500;
          this.chartOption.legend.minWidth = 400;
          this.chartOption.legend.height = 140;
          this.chartOption.legend.fontSize = 14;
          this.chartOption.legend.isLimitLegend = true;

          this.chartOption.series.isCustom = false;
          this.chartOption.series.isStack = true;
          this.chartOption.series.isTotalTooltip = true;
          this.chartOption.series.tooltipCont = '{valueY.total}';
          this.chartOption.series.tooltipType = '';
          this.chartOption.series.fillOpacity = 0.3;
          this.chartOption.series.isGradation = false;

          this.chartOption.cateAxis.gridDistance = 50;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.isLegendCustom = true;

          this.chartOption.valueAxis.gridDistance = 50;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.calculate = true;
          this.chartOption.valueAxis.valueTitle = this.curcyCode === 'USD' ? '($)' : '(₩)';
          this.chartOption.valueAxis.titlePadding = 25;
          this.chartOption.isNumberFormat = true;
          this.chartOption.numberFormat = '#a';

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isCustom = true;

          break;
        case 'dash_usageState':
          this.chartOption.legend.isUse = true;
          this.chartOption.legend.position = 'bottom';
          this.chartOption.legend.width = 500;
          this.chartOption.legend.height = 500;
          this.chartOption.legend.fontSize = 14;

          this.chartOption.cateAxis.gridDistance = 50;
          this.chartOption.cateAxis.multiValueAxis = true;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.tooltipHide = true;

          this.chartOption.valueAxis.gridDistance = 10;
          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.calculate = true;
          this.chartOption.valueAxis.axisHide = true;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.lineWeight = 0.1;
          this.chartOption.valueAxis.strokeOpacity = 0.1;
          this.chartOption.numberFormat = '#a';

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isHiddenLine = true;

          this.chartOption.series.bullet.isUse = true;
          this.chartOption.series.isTotalTooltip = false;
          this.chartOption.series.fillOpacity = 0;
          this.chartOption.series.tooltipCont = '{valueY.value}';
          this.chartOption.series.tooltipType = 'default';
          break;

        case 'dash_abNormalDetect':
          this.categoryName = this.propsInfo.dateProp;
          let numberFlag = false;
          _.map(data, (item) => {
            if (!numberFlag) {
              if (Number(item.forcstCost) > 999 || Number(item.close) > 999 || Number(item.realCost) > 999) {
                numberFlag = true;
              }
            }
          });

          this.chartOption.isNumberFormat = numberFlag;
          this.chartOption.numberFormat = '#a';

          this.chartOption.legend.isUse = true;
          this.chartOption.cursor.isHiddenLine = true;

          this.chartOption.cateAxis.gridDistance = 50;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.lineWeight = 0;

          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.gridDistance = 30;
          this.chartOption.valueAxis.axisHide = false;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.valueTitle = this.curcyCode === 'USD' ? '($)' : '(₩)';
          this.chartOption.valueAxis.titlePadding = 20;

          this.chartOption.series.isCustom = true;
          (this.chartOption.series.tooltipCont = '이상비용 감지 내용'), (this.chartOption.series.fillOpacity = 0.15);
          this.chartOption.series.isRangeArea = true;
          this.chartOption.series.bullet.isUse = true;
          this.chartOption.series.color = '#00A5ED';
          this.chartOption.series.strokeWidth = 2;
          this.chartOption.series.isGradation = true;
          this.chartOption.series.isCustomTooltip = true;

          this.chartOption.legend.width = 350;
          this.chartOption.legend.height = 50;
          this.chartOption.legend.fontSize = 14;
          // let anomalCk = "실제비용";
          // let found = 0;
          // _.map(data, (item) => {
          //     if (item.anomlYn === 'Y') {
          //         found ++;
          //     }
          // });
          // anomalCk = (found === 0) ? '실제비용' : '이상비용';
          // this.chartOption.series.customName = [anomalCk, "예측비용", "민감도"];
          this.chartOption.series.customName = ['실제비용', '예측비용', '이상비용', '민감도'];

          this.chartStyle = [
            {
              fill: false,
              color: '#14A9E5',
              fillOpacity: 0,
              tensionX: 0,
              tensionY: 0,
              strokeOpacity: 0,
              strokeDasharray: 0,
              strokeWidth: 2,
              seriesTooltop: false,
            },
            {
              fill: false,
              color: '#14A9E5',
              fillOpacity: 0,
              tensionX: 0,
              tensionY: 0,
              strokeOpacity: 1,
              strokeDasharray: 4,
              strokeWidth: 2,
              seriesTooltop: false,
            },
            {
              fill: false,
              color: '#14A9E5',
              fillOpacity: 0,
              tensionX: 0,
              tensionY: 0,
              strokeOpacity: 0,
              strokeDasharray: 0,
              strokeWidth: 0,
              seriesTooltop: false,
            },
            {
              fill: false,
              color: '#00A5ED',
              fillOpacity: 0.1,
              tensionX: 0,
              tensionY: 0,
              strokeOpacity: 0,
              strokeDasharray: 0,
              strokeWidth: 0,
              seriesTooltop: true,
            },
          ];
          this.customKeys = [{ key: 'realCost' }, { key: 'forcstCost' }, { key: 'anomlCost' }, { key: 'close' }];
          break;

        case 'bill_trend':
          this.categoryName = 'xDate';
          this.chartOption.cateAxis.multiValueAxis = false;
          this.chartOption.legend.isUse = true;
          this.chartOption.legend.position = 'bottom';
          this.chartOption.legend.align = 'center';
          this.chartOption.legend.showData = false;
          this.chartOption.legend.labelColor = '#4a4a4a';
          this.chartOption.legend.width = 500;
          this.chartOption.legend.minWidth = 100;
          this.chartOption.legend.height = 140;
          this.chartOption.legend.fontSize = 14;
          this.chartOption.legend.isLimitLegend = true;

          this.chartOption.series.bullet.isUse = true;
          this.chartOption.series.isCustom = false;
          this.chartOption.series.isStack = true;
          this.chartOption.series.isTotalTooltip = true;
          this.chartOption.series.totalTooltipCont =
            "<div><p class='custom_tooltip_date'>{categoryX}\r\n</p><p class='custom_tooltip_value'>₩ {valueY.total}</p></div>";
          this.chartOption.series.tooltipType = '';
          this.chartOption.series.fillOpacity = 0;
          this.chartOption.series.isGradation = false;

          this.chartOption.cateAxis.gridDistance = 50;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.isLegendCustom = true;

          this.chartOption.valueAxis.gridDistance = 50;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.calculate = true;
          this.chartOption.valueAxis.valueTitle = this.curcyCode === 'USD' ? '($)' : '(₩)';
          this.chartOption.valueAxis.titlePadding = 20;
          this.chartOption.isNumberFormat = true;
          this.chartOption.numberFormat = '#a';

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isCustom = true;
          break;
      }

      this.createChart(this.data);
    },
    createChart(data) {
      if (this.chart) {
        this.chart.dispose();
      }

      let keys;
      let rowData = _.cloneDeep(data);

      if (this.customKeys.length > 0) {
        keys = this.customKeys;
      } else {
        keys = utils.getKeys(data, this.propsInfo);
        rowData = utils.convertChartData(rowData, keys, this.propsInfo);
      }
      const chart = am4core.create(this.$refs.amChartArea, am4charts.XYChart);

      chart.fontFamily = 'AppleSDGothicNeo';
      chart.paddingTop = 30;
      chart.paddingBottom = 0;
      chart.paddingLeft = 0;
      chart.paddingRight = 0;
      chart.minHeight = this.chartHeight ? this.chartHeight - 10 : 227;

      if (this.chartTheme === 'dash_expectCost') {
        chart.maxWidth = 400;
      }

      // 이상비용, 실제비용 별도 그래프 구성하기 위한 데이터 생성
      if (this.chartTheme === 'dash_abNormalDetect') {
        _.map(rowData, (data) => {
          if (data['realCost']) {
            data['anomlCost'] = data['realCost'];
          }
          return data;
        });
      }

      chart.data = rowData;

      this.chartOption.colors = constants.COLOR_LIST;
      /* AREA COLOR SETTING */
      if (this.chartOption.colors.length > 0) {
        let colors = [];
        this.chartOption.colors.forEach((e) => colors.push(am4core.color(e)));
        chart.colors.list = colors;
      }

      /* Category Axes Setting (가로 축) */
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = this.categoryName;

      categoryAxis.renderer.minGridDistance = this.chartOption.cateAxis.gridDistance;
      categoryAxis.tooltip.disabled = this.chartOption.cateAxis.tooltipHide;
      categoryAxis.renderer.grid.template.strokeOpacity = this.chartOption.cateAxis.lineWeight;
      categoryAxis.renderer.labels.template.disabled = this.chartOption.cateAxis.axisHide;
      categoryAxis.renderer.labels.template.fontSize = this.chartOption.cateAxis.fontSize;
      categoryAxis.renderer.labels.template.fill = this.chartOption.fontColor;

      if (this.chartOption.cateAxis.prefix !== '' || this.chartOption.cateAxis.suffix !== '') {
        let prefix = this.chartOption.cateAxis.prefix;
        let suffix = this.chartOption.cateAxis.suffix;
        categoryAxis.renderer.labels.template.adapter.add('textOutput', function (text) {
          return ''.concat(prefix, text, suffix);
        });
      }

      if (!this.chartOption.cateAxis.multiValueAxis) {
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = this.chartOption.valueAxis.tooltipHide;
        valueAxis.calculateTotals = this.chartOption.valueAxis.calculate;
        valueAxis.renderer.minGridDistance = this.chartOption.valueAxis.gridDistance;

        // value axios line hide
        valueAxis.renderer.grid.template.strokeOpacity = this.chartOption.valueAxis.lineWeight;
        valueAxis.renderer.labels.template.disabled = this.chartOption.valueAxis.axisHide;
        valueAxis.renderer.labels.template.fontSize = this.chartOption.valueAxis.fontSize;
        valueAxis.renderer.labels.template.fill = this.chartOption.fontColor;
        if (this.chartOption.valueAxis.prefix !== '' || this.chartOption.valueAxis.suffix !== '') {
          let prefix = this.chartOption.valueAxis.prefix;
          let suffix = this.chartOption.valueAxis.suffix;
          valueAxis.renderer.labels.template.adapter.add('textOutput', function (text) {
            return ''.concat(prefix, text, suffix);
          });
        }

        /* 차트 VALUE FORMAT 수정 */
        if (this.chartOption.isNumberFormat) {
          valueAxis.numberFormatter = new am4core.NumberFormatter();
          valueAxis.numberFormatter.numberFormat = this.chartOption.numberFormat;
          valueAxis.numberFormatter.bigNumberPrefixes = this.chartOption.numberFix;
        }

        if (this.chartTheme === 'dash_resourceState') {
          categoryAxis.layout = 'absolute';
          categoryAxis.startOnAxis = true;
          categoryAxis.title.text = '서비스(30건)';
          categoryAxis.title.rotation = 0;
          categoryAxis.title.fontSize = 13;
          categoryAxis.title.dy = -20;
          categoryAxis.title.dx = 10;
          categoryAxis.title.align = 'left';
          categoryAxis.title.valign = 'top';
          categoryAxis.title.fontWeight = 600;
          categoryAxis.title.fill = '#6c9fb2';
        }

        /* AXIS 상단 공통단위 세팅 */
        if (this.chartOption.valueAxis.valueTitle !== '') {
          valueAxis.layout = 'absolute';
          valueAxis.title.text = this.chartOption.valueAxis.valueTitle;
          valueAxis.title.rotation = 0;
          valueAxis.title.fontSize = 13;
          valueAxis.title.dy = -25;
          valueAxis.title.dx = 15;
          valueAxis.title.align = 'left';
          valueAxis.title.valign = 'top';
          valueAxis.title.fontWeight = 600;
          valueAxis.title.fill = '#6c9fb2';
        }

        /* 차트 라인 세팅 */
        _.map(keys, (k, i) => {
          this.createLine(chart, k, i);
        });
      } else {
        /* MULTI VALUE AXES 전용 */
        _.map(keys, (k, i) => {
          let customKey = '';
          let title = '';
          let tPadding = '';
          let titleColor = '';

          if (k.key === 'instsCnt') {
            customKey = '인스턴스 수(EA)';
            title = '(EA)';
            titleColor = '#2cc2fd';
            tPadding = 10;
          } else if (k.key === 'ondmCnt') {
            customKey = '사용시간(hour)';
            title = '(hour)';
            titleColor = '#1ae3bb';
            tPadding = 0;
          } else if (k.key === 'krwUseAmt') {
            let cur = this.curcyCode === 'USD' ? '$' : '₩';
            customKey = '금액(' + cur + ')';
            title = '(' + cur + ')';
            titleColor = '#fc5aa1';
            tPadding = 0;
          } else if (k.key === 'cpu') {
            /*customKey = "CPU";*/
            title = 'CPU';
            titleColor = '#2cc2fd';
            tPadding = 10;
          } else if (k.key === 'memory') {
            /*customKey = "CPU";*/
            title = 'MEMORY';
            titleColor = '#1ae3bb';
            tPadding = 10;
          } else if (k.key === 'disk') {
            /*customKey = "CPU";*/
            title = 'DISK';
            titleColor = '#fc5aa1';
            tPadding = 0;
          }

          let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          if (chart.yAxes.indexOf(valueAxis) != 0) {
            valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
          }

          valueAxis.renderer.opposite = i === 0 ? false : true;
          valueAxis.renderer.labels.template.disabled = false;
          valueAxis.tooltip.disabled = this.chartOption.valueAxis.tooltipHide;
          valueAxis.calculateTotals = this.chartOption.valueAxis.calculate;
          valueAxis.renderer.labels.template.fontSize = this.chartOption.valueAxis.fontSize;
          valueAxis.renderer.line.strokeOpacity = 1;
          valueAxis.renderer.line.strokeWidth = 1;
          valueAxis.renderer.baseGrid.disabled = false;
          valueAxis.renderer.grid.template.strokeOpacity = 0.1;
          valueAxis.renderer.labels.template.fill = am4core.color('#6c9fb2');

          if (this.chartOption.valueAxis.prefix !== '' && k.key === 'krwUseAmt') {
            let prefix = this.chartOption.valueAxis.prefix;
            let suffix = this.chartOption.valueAxis.suffix;
            valueAxis.renderer.labels.template.adapter.add('textOutput', function (text) {
              return ''.concat(prefix, text, suffix);
            });
          }

          if (k.key !== 'instsCnt') {
            /* 차트 VALUE FORMAT 수정 */
            valueAxis.numberFormatter = new am4core.NumberFormatter();
            valueAxis.numberFormatter.numberFormat = this.chartOption.numberFormat;
          }

          valueAxis.layout = 'absolute';
          valueAxis.title.text = title;
          valueAxis.title.rotation = 0;
          valueAxis.title.dy = -30;
          valueAxis.title.dx = tPadding;
          valueAxis.title.fontSize = 13;
          valueAxis.title.align = 'center';
          valueAxis.title.valign = 'top';
          valueAxis.title.fontWeight = 600;
          valueAxis.title.fill = titleColor;

          let series = chart.series.push(new am4charts.LineSeries());

          valueAxis.renderer.line.stroke = series.stroke;
          valueAxis.renderer.labels.template.fill = series.stroke;

          series.dataFields.categoryX = this.categoryName;
          series.dataFields.valueY = k.key;
          series.name = customKey;
          series.dataFields.dateX = 'xDate';
          series.yAxis = valueAxis;
          series.stacked = this.chartOption.series.isStack;
          series.strokeWidth = 0.8;
          series.tooltipText = '{name}: [bold]{valueY}[/]';
          series.showOnInit = true;
          series.tooltip.getStrokeFromObject = true;
          series.tooltip.getFillFromObject = false;
          series.tooltip.strokeOpacity = 1;
          series.tooltip.label.fill = am4core.color(chart.colors.list[i].hex);
          series.tooltip.background.fillOpacity = 1;
          series.tooltip.background.filters.clear();
          series.tooltip.fontSize = 12;

          let interfaceColors = new am4core.InterfaceColorSet();
          let bullet;
          switch (i) {
            case 0:
              bullet = series.bullets.push(new am4charts.Bullet());
              bullet.width = 10;
              bullet.height = 10;

              let triangle = bullet.createChild(am4core.Circle);
              triangle.stroke = interfaceColors.getFor('background');
              triangle.horizontalCenter = 'middle';
              triangle.verticalCenter = 'middle';
              triangle.width = 10;
              triangle.height = 10;
              break;

            case 1:
              bullet = series.bullets.push(new am4charts.Bullet());
              bullet.width = 10;
              bullet.height = 10;

              let rectangle = bullet.createChild(am4core.Circle);
              rectangle.stroke = interfaceColors.getFor('background');
              rectangle.strokeWidth = 1;
              rectangle.horizontalCenter = 'middle';
              rectangle.verticalCenter = 'middle';
              rectangle.width = 10;
              rectangle.height = 10;
              break;

            case 2:
              bullet = series.bullets.push(new am4charts.Bullet());
              bullet.width = 10;
              bullet.height = 10;

              let circle = bullet.createChild(am4core.Circle);
              circle.stroke = interfaceColors.getFor('background');
              circle.strokeWidth = 1;
              circle.horizontalCenter = 'middle';
              circle.verticalCenter = 'middle';
              circle.width = 10;
              circle.height = 10;
              break;

            default:
              bullet = series.bullets.push(new am4charts.CircleBullet());
              bullet.circle.stroke = interfaceColors.getFor('background');
              bullet.circle.strokeWidth = 1;
              rectangle.horizontalCenter = 'middle';
              rectangle.verticalCenter = 'middle';
              rectangle.width = 5;
              rectangle.height = 5;
              break;
          }
        });
      }

      /* 커서 세팅 */
      if (this.chartOption.cursor.isUse) {
        chart.cursor = new am4charts.XYCursor();
        if (this.chartOption.series.isTotalTooltip) {
          chart.cursor.maxTooltipDistance = this.chartOption.series.isTotalTooltip ? -1 : 0;
        }

        if (this.chartOption.cursor.isHiddenLine) {
          chart.cursor.lineY.disabled = this.chartOption.cursor.isHiddenLine;
          chart.cursor.lineX.disabled = this.chartOption.cursor.isHiddenLine;
          chart.cursor.behavior = 'none';
        }
      }

      /* 범례(LEGEND)영역 세팅 */
      if (this.chartOption.legend.isUse) {
        chart.legend = new am4charts.Legend();
        chart.legend.position = this.chartOption.legend.position;
        chart.legend.contentAlign = this.chartOption.legend.align;
        chart.legend.valign = this.chartOption.legend.valign;
        chart.legend.minWidth = this.chartOption.legend.minWidth;
        chart.legend.maxWidth = 500;
        const legendContainer = am4core.create('legendArea', am4core.Container);
        legendContainer.width = am4core.percent(100);
        legendContainer.height = am4core.percent(100);
        chart.legend.parent = legendContainer;
        if (this.chartTheme === 'dash_usageCost') {
          chart.legend.minHeight = this.chartHeight - 30;
        } else {
          chart.legend.maxHeight = this.chartOption.legend.height;
        }
        chart.legend.fontSize = this.chartOption.legend.fontSize;
        chart.legend.scrollable = true;
        chart.legend.labels.template.fill = this.chartOption.legend.labelColor;

        let markerTemplate = chart.legend.markers.template;
        markerTemplate.width = this.chartOption.legend.fontSize;
        markerTemplate.height = this.chartOption.legend.fontSize;
      }

      this.chart = chart;
    },

    createLine(chart, key, index) {
      /**
       선형 그래프 각각의 선을 커스텀 할 경우,
       선마다 옵션값이 있어야 함
       */
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.categoryX = this.categoryName;

      if (this.chartOption.series.isRangeArea && key.key === 'close') {
        series.dataFields.openValueY = 'open';
        series.dataFields.valueY = 'close';
        series.sequencedInterpolation = true;
        series.fill = am4core.color('#00A5ED');
        series.fillOpacity = this.chartOption.series.fillOpacity;
      } else {
        series.name = key.title ? key.title : key.key;
        series.stacked = this.chartOption.series.isStack;
        series.dataFields.valueY = key.key;
        series.dataFields.valueYShow = this.chartOption.series.valueShow;
      }

      if (this.chartOption.series.isCustom) {
        // custom chart
        let style = this.chartStyle[index];
        if (key.key === 'EXPECT' || key.key === 'forcstCost') {
          style = this.chartStyle[1];
          series.smoothing = 'monotoneX';
        }

        series.fillOpacity = style.fillOpacity;
        series.stroke = am4core.color(style.color);
        series.strokeWidth = style.strokeWidth;
        series.fill = series.fill;

        series.strokeDasharray = style.strokeDasharray;
        series.name = this.chartOption.series.customName[index];
      } else {
        series.fill = am4core.color(chart.colors.list[index].hex);
        series.fillOpacity = this.chartOption.series.fillOpacity;
        series.stroke = am4core.color(chart.colors.list[index].hex);
        series.strokeWidth = this.chartOption.series.strokeWidth;
        // series.strokeWidth = (index === 0 ) ? 0 : this.chartOption.series.strokeWidth;
      }

      series.tooltip.getStrokeFromObject = true;
      series.tooltip.getFillFromObject = false;
      series.tooltip.strokeOpacity = 1;
      series.tooltip.label.fill = am4core.color(chart.colors.list[index].hex);

      /* 툴팁 BOX 투명도 */
      series.tooltip.background.fillOpacity = 1;
      series.tooltip.background.filters.clear();

      series.legendSettings.labelText = '[' + this.chartOption.legend.labelColor + '] {name}[/]';
      /* 차트 MOUSE OVER시 해당 데이터 세팅 */
      if (this.chartOption.legend.showData) {
        series.legendSettings.itemValueText = '[bold]₩ {valueY.value}[/bold]';
      }

      if (this.chartOption.series.prefix !== '' || this.chartOption.series.suffix !== '') {
        let prefix = this.chartOption.series.prefix;
        let suffix = this.chartOption.series.suffix;
        series.renderer.labels.template.adapter.add('textOutput', function (text) {
          return ''.concat(prefix, text, suffix);
        });
      }

      /* INNER CHART CUSTOM TOOLTIPS CONTENTS */
      if (this.chartOption.series.isTotalTooltip) {
        if (this.chartTheme === 'dash_expectCost' && key.key === 'EXPECT') {
          return;
        }

        series.adapter.add('tooltipHTML', (html, target) => {
          if (this.chartOption.series.totalTooltipCont !== '') {
            return this.chartOption.series.totalTooltipCont;
          }
          return (
            "<div><p class='custom_tooltip_date'>{categoryX}일\r\n</p><p class='custom_tooltip_value'>₩" +
            this.chartOption.series.tooltipCont +
            '</p></div>'
          );
        });
      } else {
        if (key.key === 'EXPECT' || key.key === 'close' || key.key === 'forcstCost') {
          return;
        }
        if (this.chartOption.series.tooltipType === 'default') {
          series.tooltipText = this.chartOption.series.tooltipCont;
          series.tooltip.fontSize = 12;
        } else if (this.chartOption.series.tooltipType === 'html') {
          series.tooltipHTML = this.chartOption.series.tooltipCont;
          series.tooltip.fontSize = 12;
        }
      }

      if (this.chartTheme === 'dash_usageCost') {
        let ltd = chart.data[chart.data.length - 1];
        let price = ltd[key.key] ? ltd[key.key] : 0;
        series.legendSettings.labelText =
          key.title + ' ([font-size:14px] ₩' + numberWithCommas(parseFloat(price).toFixed(0)) + '[/])';
      }

      if (this.chartOption.series.bullet.isUse && this.chartTheme === 'bill_trend') {
        let bullet = series.bullets.push(new am4charts.Bullet());

        let interfaceColors = new am4core.InterfaceColorSet();
        let circle = bullet.createChild(am4core.Circle);
        circle.stroke = interfaceColors.getFor('background');
        circle.horizontalCenter = 'middle';
        circle.verticalCenter = 'middle';
        circle.width = 10;
        circle.height = 10;
      }

      // 그라데이션
      if (this.chartOption.series.isGradation) {
        let fillModifier = new am4core.LinearGradientModifier();
        fillModifier.opacities = [1, 0];
        fillModifier.offsets = [0, 0.9];
        fillModifier.gradient.rotation = 90;
        series.segments.template.fillModifier = fillModifier;
      }

      /* 이상감지 불렛 및 툴팁 커스텀 */
      if (this.chartTheme === 'dash_abNormalDetect' && key.key === 'realCost') {
        series.dataFields.valueZ = 'anomlYn';
        let bullet = series.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color('#00A5ED');
        bullet.stroke = am4core.color('#00A5ED');

        let circle = bullet.createChild(am4core.Circle);
        circle.width = 8;
        circle.height = 8;

        series.tooltip.disabled = true;
        bullet.adapter.add('disabled', function (disabled, target) {
          if (target.dataItem && target.dataItem.valueZ === 'Y') {
            return true;
          }
          return disabled;
        });
      }

      if (this.chartTheme === 'dash_abNormalDetect' && key.key === 'anomlCost') {
        series.dataFields.valueZ = 'anomlYn';
        let bullet = series.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color('#FC5AA1');
        bullet.stroke = am4core.color('#FC5AA1');
        bullet.events.on(
          'hit',
          function (ev) {
            let data = ev.target.tooltipDataItem.dataContext;
            this.$emit('route-fraud-detection', data);
          },
          this
        );

        if (this.chartLocation === 'FraudDetection' || this.chartLocation === 'CardFraudDetection') {
          bullet.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        }

        let circle = bullet.createChild(am4core.Circle);
        circle.width = 8;
        circle.height = 8;

        series.tooltip.adapter.add('disabled', function (disabled, target) {
          if (target.dataItem && target.dataItem.valueZ === 'N') {
            return true;
          }
          return disabled;
        });

        bullet.adapter.add('disabled', function (disabled, target) {
          if (target.dataItem && target.dataItem.valueZ === 'N') {
            return true;
          }
          return disabled;
        });
      }

      if (this.chartOption.series.isCustomTooltip && this.chartTheme === 'dash_abNormalDetect') {
        series.tooltip.getStrokeFromObject = true;

        series.adapter.add('tooltipHTML', (html, target) => {
          let targetData = target.tooltipDataItem.dataContext;
          let curcy = targetData.pricingCurcyCd === 'USD' ? '$ ' : '₩ ';
          let chgPer = targetData.diffRate;
          let forcstPrice = targetData.forcstCost ? targetData.forcstCost : '-';
          let realPrice = targetData.realCost ? targetData.realCost : '-';

          let strHtml =
            "<div class='custom_detect_area'><span class='custom_detect_service'>" +
            targetData.ctrtId +
            '</span> </br>';
          strHtml += 'AI 예측비용 :   ' + "<span class='custom_detect_cont'>" + curcy + forcstPrice + '</span> </br>';
          strHtml += '실제비용 :   ' + "<span class='custom_detect_cont'>" + curcy + realPrice + '</span> </br>';
          strHtml += '변동률 :   ' + "<span class='custom_detect_cont'>" + chgPer + '%</span></div>';
          return strHtml;
        });
      }

      if (this.chartTheme === 'bill_trend') {
        series.connect = false;
      }

      /* LEGEND가 많은 차트일 경우, 상위 10개 ACTIVE 설정
         8월 5 일 > 범례 합쳐서 ETC로 보여주는 방안으로 수정됨
      */
      // if (this.chartOption.legend.isLimitLegend) {
      //     if (index > 9) {
      //         series.hidden = true;
      //     }
      // }

      return series;
    },
  },
};
</script>
