<template>
  <div :style="styleObject" ref="amChartXYChart" style="overflow: hidden!important;"></div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as utils from 'openitlibrary/src/library/commonUtil';
import constants from '@/pages/Contract/cards/colorConstants';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
import moment from "moment";
import _ from 'lodash';

am4core.useTheme(am4themes_animated);
am4core.options.commercialLicense = true;

export default {
  name: 'g-stack-card-cost-chart',
  props: {
    chartHeight: {
      type: String,
      default: "227",
    },
    data: {
      type: Array,
      default: () => ([]),
    },
    chartTheme : {
      type: String,
      default: '',
    },
    chartType : {
      type: String,
      default: 'default',
    },
    propsInfo : {
      type : Object,
      default : () => ({
        dateProp : '',
        keyProp  : '',
        nameProp : '',
        valueProp : '',
      }),
    },
    customKeys : {
      type: Array,
      default: () => ([]),
    },
    curcyCode : {
      type: String,
      default : 'KRW'
    },
    serviceCount : {
      type: String,
      default : '0'
    },
    resourceCount : {
      type: String,
      default : '0'
    },
    chartOption : {
      type : Object,
      default : () => ({
        isNumberFormat : false,
        numberFormat : '',
        numberFix : [
          { "number": 1e+3, "suffix": "k" },
          { "number": 1e+6, "suffix": "M" },
          { "number": 1e+9, "suffix": "B" },
          { "number": 1e+12, "suffix": "T" },
        ],
        prefixed : '',
        colors : [],
        fontColor : "#6c9fb2",
        legend : {
          isUse : false,
          position : 'bottom',
          align : 'center',
          valign : 'center',
          backgroundColor : '',
          backgroundOpacity : 0,
          labelColor : "#666666",
          minWidth : 300,
          width : 300,
          height : 100,
          fontSize : 13,
          clickAble : false,
          focusAble : false,
          showData : false,
          isLimitLegend : false,
        },
        cateAxis : {
          isUse : true,
          multiValueAxis : false,
          gridDistance : 20,
          fontSize : 14,
          lineWeight : 0,
          lineLocation : 0,
          prefix : '',
          suffix : '',
          isLegendCustom : false,
          scrollAble : false,
          axisHide : false,
          tooltipHide : false,
          baseGridHidden : true,
        },
        valueAxis : {
          isUse : true,
          gridDistance : 20,
          fontSize : 14,
          stacked : false,
          calculate : false,
          lineWeight : 0,
          lineLocation : 0,
          prefix : '',
          suffix : '',
          valueTitle : '',
          titlePadding : 10,
          axisHide : false,
          tooltipHide : false,
          valueLabel : false,
          baseGridHidden : false,
        },
        series : {
          isUse : true,
          isCustom : false,
          isStack : false,
          valueShow : '',
          columnWidth : 0,
          isTotalTooltip : false,
          totalTooltipCont : '',
          isCustomTooltip : false,
          isGradation : false,
          isSideRound : false,
          customName : [],
          tooltipType : 'default',
          tooltipCont : '{name}: [bold]{valueY.total}[/]',
          bullet : {
            isUse : false,
          }
        },
        tooltip : {
          isUse : false,
          color : "#2CC2FD",
          tooltipCont : '',
        },
        cursor : {
          isUse : true,
          isCustom : false,
          isHiddenLine : false,
        },
      }),
    }
  },
  mounted () {
    this.setChartInfo(this.data);
  },
  data() {
    return {
      chart: null,
      categoryName: 'xDate',
      totalPrice : 0,
    }
  },
  computed: {
    styleObject() {
      return {
        height : this.chartHeight + 'px',
      }
    },
  },
  watch: {
    data: function(newData) {
      this.createChart(newData);
      // if (this.chartTheme === "dash_usageCost") {
      //     this.legendSettings();
      // }
    },
    totalPrice: function (data) {
      this.$emit('total-price', numberWithCommas(data));
    },
  },
  methods: {
    setChartInfo(data) {
      /**
       차트 옵션 세팅
       */
      switch (this.chartTheme) {
        case 'dash_usageCost':
          this.categoryName = 'xDate';
          this.chartOption.legend.isUse = true;
          this.chartOption.legend.position = 'right';
          this.chartOption.legend.align = 'left';
          this.chartOption.legend.valign = 'center';
          this.chartOption.legend.width = 500;
          this.chartOption.legend.minWidth = 400;
          this.chartOption.legend.height = 140;
          this.chartOption.legend.fontSize = 14;
          this.chartOption.legend.showData = false;
          this.chartOption.legend.labelColor = "#4a4a4a";

          this.chartOption.series.isStack = true;
          this.chartOption.series.isTotalTooltip = true;
          this.chartOption.series.tooltipType = '';
          this.chartOption.series.isGradation = false;

          this.chartOption.cateAxis.gridDistance = 50;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.scrollAble = false;
          this.chartOption.cateAxis.isLegendCustom = true;

          this.chartOption.valueAxis.gridDistance = 50;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.axisHide = false;
          this.chartOption.valueAxis.calculate = true;
          this.chartOption.valueAxis.isSideRound = true;
          this.chartOption.valueAxis.valueTitle = (this.curcyCode === 'USD' ) ? '($)' : '(₩)';
          this.chartOption.valueAxis.titlePadding = 20;

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isCustom = true;
          this.chartOption.cursor.isHiddenLine = true;

          this.chartOption.isNumberFormat = true;
          this.chartOption.numberFormat = '#a';
          this.chartOption.tooltip.tooltipCont = "{categoryX}일:\n {valueY.total}원"
          break;
        case 'use_usageCost':
          this.categoryName = 'xDate';
          this.chartOption.legend.isUse = true;
          this.chartOption.legend.position = 'bottom';
          this.chartOption.legend.align = 'center';
          this.chartOption.legend.width = 500;
          this.chartOption.legend.minWidth = 400;
          this.chartOption.legend.height = 140;
          this.chartOption.legend.fontSize = 14;
          this.chartOption.legend.showData = false;
          this.chartOption.legend.isLimitLegend = true;

          this.chartOption.series.isStack = true;
          this.chartOption.series.isTotalTooltip = true;
          this.chartOption.series.tooltipType = '';
          this.chartOption.series.isGradation = false;
          this.chartOption.series.columnWidth = 50;

          this.chartOption.cateAxis.gridDistance = 50;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.scrollAble = false;
          this.chartOption.cateAxis.isLegendCustom = false;

          this.chartOption.valueAxis.gridDistance = 50;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.axisHide = false;
          this.chartOption.valueAxis.calculate = true;
          this.chartOption.valueAxis.isSideRound = true;
          this.chartOption.valueAxis.valueTitle = (this.curcyCode === 'USD' ) ? '($)' : '(₩)';
          this.chartOption.valueAxis.titlePadding = 20;

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isCustom = true;
          this.chartOption.cursor.isHiddenLine = true;

          this.chartOption.isNumberFormat = true;
          this.chartOption.numberFormat = '#a';
          break;
        case 'dash_csmp_dayUseState':
          this.categoryName = 'xDate';
          this.chartOption.legend.isUse = true;
          this.chartOption.legend.position = 'bottom';
          this.chartOption.legend.align = 'center';
          this.chartOption.legend.width = 500;
          this.chartOption.legend.minWidth = 400;
          this.chartOption.legend.height = 140;
          this.chartOption.legend.fontSize = 14;
          this.chartOption.legend.showData = false;


          this.chartOption.series.isStack = true;
          this.chartOption.series.isTotalTooltip = false;
          this.chartOption.series.tooltipType = 'html';
          this.chartOption.series.tooltipCont = "<div><p class='custom_tooltip_date'>{name} : \r\n </p><p class='custom_tooltip_value'>{valueY.value}건</p></div>"
          this.chartOption.series.isGradation = false;
          this.chartOption.series.columnWidth = 50;

          this.chartOption.cateAxis.gridDistance = 50;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.scrollAble = false;
          this.chartOption.cateAxis.isLegendCustom = false;

          this.chartOption.valueAxis.gridDistance = 50;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.axisHide = false;
          this.chartOption.valueAxis.calculate = true;
          this.chartOption.valueAxis.valueTitle = "(EA)";
          this.chartOption.valueAxis.titlePadding = 8;

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isCustom = true;
          this.chartOption.cursor.isHiddenLine = true;

          this.chartOption.isNumberFormat = false;
          break;
        case 'dash_resourceState':
          this.categoryName = this.propsInfo.keyProp;
          this.chartType = 'vertical';
          this.chartOption.legend.isUse = false;

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isHiddenLine = true;

          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.scrollAble = true;
          this.chartOption.cateAxis.gridDistance = 1;
          this.chartOption.fontColor = "#4a4a4a";

          this.chartOption.valueAxis.gridDistance = 1;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.axisHide = true;
          this.chartOption.valueAxis.valueLabel = true;
          this.chartOption.valueAxis.isSideRound = true;

          this.chartOption.valueAxis.valueTitle = "자원";

          this.chartOption.series.tooltipType = 'default';
          this.chartOption.series.tooltipCont = "{valueX.value}";
          this.chartOption.series.isGradation = false;

          break;
        case 'dash_csmp_useState':
          this.categoryName = this.propsInfo.keyProp;
          this.chartType = 'vertical';
          this.chartOption.legend.isUse = false;

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isHiddenLine = true;

          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.scrollAble = true;
          this.chartOption.cateAxis.gridDistance = 1;

          this.chartOption.valueAxis.gridDistance = 1;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.axisHide = true;
          this.chartOption.valueAxis.valueLabel = true;
          this.chartOption.valueAxis.calculate = false;

          this.chartOption.series.columnWidth = 50;
          this.chartOption.series.tooltipType = 'default';
          this.chartOption.series.tooltipCont =  "{valueX.value}";

          break;
        case 'dash_csmp_anyOpen_status' :
          this.categoryName = this.propsInfo.keyProp;
          this.chartType = 'customData';

          this.chartOption.legend.isUse = false;

          this.chartOption.series.isStack = false;
          this.chartOption.series.isTotalTooltip = false;
          this.chartOption.series.isCustomTooltip = false;
          this.chartOption.series.isGradation = false;
          this.chartOption.series.tooltipType = 'default';
          this.chartOption.series.tooltipCont = '{name}: [bold]{valueY.value}[/]',
            this.chartOption.series.customName = ["Open", "Unused"];
          this.chartOption.series.columnWidth = 50;

          this.chartOption.cateAxis.gridDistance = 0;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.scrollAble = false;
          this.chartOption.cateAxis.isLegendCustom = false;

          this.chartOption.valueAxis.gridDistance = 100;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.axisHide = true;
          this.chartOption.valueAxis.calculate = true;

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isHiddenLine = true;
          this.chartOption.cursor.isCustom = false;

          break;
        case 'dash_csmp_ruleViolate' :
          this.chartType = 'customData' ;
          this.categoryName = this.propsInfo.keyProp;
          this.chartOption.legend.isUse = false;

          this.chartOption.series.isStack = false;
          this.chartOption.series.isTotalTooltip = false;
          this.chartOption.series.isGradation = false;
          this.chartOption.series.isCustomTooltip = false;
          this.chartOption.series.tooltipType = 'default';
          this.chartOption.series.tooltipCont = '{categoryX} : [bold]{valueY.value}건[/]',
            this.chartOption.series.columnWidth = 30;

          this.chartOption.cateAxis.gridDistance = 0;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.scrollAble = false;
          this.chartOption.cateAxis.isLegendCustom = false;

          this.chartOption.valueAxis.gridDistance = 100;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.axisHide = true;
          this.chartOption.valueAxis.calculate = true;

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isHiddenLine = true;
          this.chartOption.cursor.isCustom = false;

          break;
        case 'dash_aiPattern' :
          this.chartType = 'customData';
          this.categoryName = this.propsInfo.keyProp;
          this.chartOption.legend.isUse = true
          this.chartOption.legend.position = 'bottom';
          this.chartOption.legend.align = 'center';
          this.chartOption.legend.width = 500;
          this.chartOption.legend.minWidth = 400;
          this.chartOption.legend.height = 140;
          this.chartOption.legend.fontSize = 14;
          this.chartOption.legend.showData = false;

          this.chartOption.series.isStack = false;
          this.chartOption.series.isTotalTooltip = false;
          this.chartOption.series.isCustomTooltip = true;
          this.chartOption.series.tooltipType = '';

          /* 범례 커스텀 */
          let thisMonth = moment(data[0].billYm).format("M");
          let nextMonth = moment(data[0].billYm).subtract(1,'months').format("M");

          this.chartOption.series.customName = [thisMonth+"월", nextMonth+"월", "Max", "Avg"];

          this.chartOption.cateAxis.gridDistance = 0;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.scrollAble = false;
          this.chartOption.cateAxis.isLegendCustom = false;

          this.chartOption.valueAxis.gridDistance = 22;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.axisHide = true;
          this.chartOption.valueAxis.calculate = false;
          this.chartOption.valueAxis.isSideRound = true;

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isHiddenLine = true;
          this.chartOption.cursor.isCustom = true;
          break;
        case 'bill_trend':
          this.categoryName = 'xDate';
          this.chartOption.legend.isUse = true;
          this.chartOption.legend.position = 'bottom';
          this.chartOption.legend.align = 'center';
          this.chartOption.legend.minWidth = 100;
          this.chartOption.legend.width = 500;
          this.chartOption.legend.height = 140;
          this.chartOption.legend.fontSize = 14;

          this.chartOption.series.isStack = true;
          this.chartOption.series.isTotalTooltip = false;
          //  this.chartOption.series.totalTooltipCont = "<div><p class='custom_tooltip_date'>{categoryX}\r\n</p><p class='custom_tooltip_value'>₩ {valueY.total}</p></div>";
          this.chartOption.series.tooltipType = '';
          this.chartOption.series.columnWidth = 50;

          this.chartOption.cateAxis.gridDistance = 50;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.scrollAble = false;

          this.chartOption.valueAxis.gridDistance = 50;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.axisHide = false;
          this.chartOption.valueAxis.calculate = true;
          this.chartOption.valueAxis.valueTitle = (this.curcyCode === 'USD' ) ? '($)' : '(₩)';
          this.chartOption.valueAxis.titlePadding = 20;

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isCustom = true;
          this.chartOption.cursor.isHiddenLine = true;

          this.chartOption.isNumberFormat = true;
          this.chartOption.numberFormat = '#a';
          break;

        case 'dash_csmp_licenseUse' :
          this.chartType = 'customData';
          this.categoryName = this.propsInfo.keyProp;
          this.chartOption.legend.isUse = false;

          this.chartOption.series.isStack = false;
          this.chartOption.series.isTotalTooltip = false;
          this.chartOption.series.isCustomTooltip = false;
          this.chartOption.series.columnWidth = 35;

          this.chartOption.cateAxis.gridDistance = 1;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.axisHide = true;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.scrollAble = false;
          this.chartOption.cateAxis.isLegendCustom = false;

          this.chartOption.valueAxis.gridDistance = 10;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.axisHide = true;
          this.chartOption.valueAxis.calculate = true;

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isHiddenLine = true;
          this.chartOption.cursor.isCustom = true;

          this.chartOption.series.tooltipType = '';
          //  this.chartOption.series.tooltipCont = '{valueY.value}개';
          break;

        case 'dash_mec_dataTraffic' :
          this.categoryName = 'xDate';
          this.chartOption.legend.isUse = false;

          this.chartOption.series.isStack = true;
          this.chartOption.series.isTotalTooltip = true;
          this.chartOption.series.totalTooltipCont = "<div><p class='custom_tooltip_normal'>{name}\r\n</p><p class='custom_tooltip_value'>{valueY.total}</p></div>";
          this.chartOption.series.tooltipType = '';
          this.chartOption.series.isGradation = false;

          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.gridDistance = 50;
          this.chartOption.cateAxis.axisHide = false;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.scrollAble = false;
          this.chartOption.cateAxis.isLegendCustom = false;
          this.chartOption.cateAxis.baseGridHidden = true;

          this.chartOption.valueAxis.gridDistance = 100;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.axisHide = false;
          this.chartOption.valueAxis.calculate = true;
          this.chartOption.valueAxis.isSideRound = true;
          this.chartOption.valueAxis.valueTitle = '(MB)';
          this.chartOption.valueAxis.titlePadding = 20;

          this.chartOption.cursor.isUse = true;
          this.chartOption.cursor.isCustom = true;
          this.chartOption.cursor.isHiddenLine = true;

          this.chartOption.isNumberFormat = true;
          this.chartOption.numberFormat = '#a';
          break;

        case 'dash_mec_useStat' :
          this.chartType = 'customData';
          this.categoryName = this.propsInfo.keyProp;
          this.chartOption.legend.isUse = false;

          this.chartOption.series.isStack = false;
          this.chartOption.series.isTotalTooltip = false;
          this.chartOption.series.isCustomTooltip = false;
          this.chartOption.series.columnWidth = 35;

          this.chartOption.cateAxis.gridDistance = 1;
          this.chartOption.cateAxis.tooltipHide = true;
          this.chartOption.cateAxis.axisHide = true;
          this.chartOption.cateAxis.lineWeight = 0;
          this.chartOption.cateAxis.fontSize = 13;
          this.chartOption.cateAxis.scrollAble = false;
          this.chartOption.cateAxis.isLegendCustom = false;

          this.chartOption.valueAxis.gridDistance = 10;
          this.chartOption.valueAxis.lineWeight = 0;
          this.chartOption.valueAxis.fontSize = 13;
          this.chartOption.valueAxis.tooltipHide = true;
          this.chartOption.valueAxis.axisHide = true;
          this.chartOption.valueAxis.calculate = true;

          this.chartOption.cursor.isUse = false;
          this.chartOption.cursor.isHiddenLine = true;
          this.chartOption.cursor.isCustom = false;

          this.chartOption.series.tooltipType = '';
          //  this.chartOption.series.tooltipCont = '{valueY.value}개';
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

      /* 차트 KEY값 세팅 */
      if (this.customKeys.length > 0) {
        keys = this.customKeys;
      } else {
        keys = utils.getKeys(data, this.propsInfo);
      }

      /* 차트 DATA 세팅 */
      if (this.chartType !== 'vertical' && this.chartType !== 'customData') {
        rowData = utils.convertChartData(rowData, keys, this.propsInfo);
      }

      // 청구내역, 사용내역 차트에 토탈 값 보여주기....
      if (this.chartTheme === 'bill_trend') {
        _.map(rowData, (data) => {
          return data['none'] = 0;
        })

      }

      let chart = am4core.create(this.$refs.amChartXYChart, am4charts.XYChart);

      /* 차트 전체속성 세팅 */
      chart.fontFamily = "AppleSDGothicNeo";
      chart.paddingTop = (this.chartTheme !== 'dash_csmp_useState') ? ((this.chartTheme !== 'dash_resourceState') ? 30 : 10 ) : 0;
      chart.paddingBottom = 0;
      chart.paddingLeft = 0;
      chart.paddingRight = 0;
      chart.minHeight = this.chartHeight ? (this.chartHeight - 10) : 227;
      chart.data = rowData;

      this.chartOption.colors = constants.COLOR_LIST;

      /* 차트 색상리스트 세팅 */
      if (this.chartOption.colors.length > 0) {
        let colors = [];
        this.chartOption.colors.forEach(e => colors.push(am4core.color(e)));
        chart.colors.list = colors;
      }

      if (this.chartTheme === "bill_trend") {
        chart.maskBullet = false;
      }

      let categoryAxis = null;
      let valueAxis = null;

      /* X축 그룹화할 값 기본설정 */
      if (this.chartType === 'vertical') {
        chart.zoomOutButton.disabled = true;
        categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = this.propsInfo.keyProp;
        categoryAxis.renderer.inversed = true;
        categoryAxis.start = 0;
        categoryAxis.end = 0.1;
        categoryAxis.keepSelection = true;
        categoryAxis.renderer.labels.template.align = 'left';
      } else {
        categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = this.categoryName;
      }

      categoryAxis.renderer.grid.template.location = this.chartOption.cateAxis.lineLocation;
      categoryAxis.renderer.grid.template.strokeOpacity = this.chartOption.cateAxis.lineWeight;
      categoryAxis.renderer.labels.template.disabled = this.chartOption.cateAxis.axisHide;
      categoryAxis.tooltip.disabled = this.chartOption.cateAxis.tooltipHide;
      categoryAxis.renderer.minGridDistance = this.chartOption.cateAxis.gridDistance;
      categoryAxis.renderer.labels.template.fontSize = this.chartOption.cateAxis.fontSize;
      categoryAxis.renderer.labels.template.fill = this.chartOption.fontColor;
      categoryAxis.renderer.baseGrid.disabled = this.chartOption.cateAxis.baseGridHidden;

      if (this.chartOption.cateAxis.prefix !== '' || this.chartOption.cateAxis.suffix !== '') {
        let prefix = this.chartOption.cateAxis.prefix;
        let suffix = this.chartOption.cateAxis.suffix;
        categoryAxis.renderer.labels.template.adapter.add("textOutput", function(text) {
          return "".concat(prefix, text, suffix);
        });
      };

      /* Y축 VALUE 값 기본설정 */
      if (this.chartType === 'vertical') {
        valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.opposite = true;
      } else {
        valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.location = this.chartOption.valueAxis.lineLocation;
        valueAxis.calculateTotals = this.chartOption.valueAxis.calculate;
      }

      valueAxis.renderer.minGridDistance = this.chartOption.valueAxis.gridDistance;
      valueAxis.renderer.labels.template.fontSize = this.chartOption.valueAxis.fontSize;
      valueAxis.renderer.grid.template.strokeOpacity = this.chartOption.valueAxis.lineWeight;
      valueAxis.renderer.labels.template.disabled = this.chartOption.valueAxis.axisHide;
      valueAxis.tooltip.disabled = this.chartOption.valueAxis.tooltipHide;
      valueAxis.renderer.labels.template.fill = this.chartOption.fontColor;
      valueAxis.renderer.baseGrid.disabled = this.chartOption.valueAxis.baseGridHidden;

      if (this.chartOption.valueAxis.prefix !== '' || this.chartOption.valueAxis.suffix !== '') {
        let prefix = this.chartOption.valueAxis.prefix;
        let suffix = this.chartOption.valueAxis.suffix;
        valueAxis.renderer.labels.template.adapter.add("textOutput", function(text) {
          return "".concat(prefix, text, suffix);
        });
      };

      if (this.chartTheme === "dash_csmp_licenseUse" || this.chartTheme === "dash_mec_useStat") {
        valueAxis.min = 0;
      }

      if (this.chartType === 'vertical') {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = this.propsInfo.valueProp;
        series.dataFields.categoryY = this.propsInfo.keyProp;
        if (this.chartOption.valueAxis.valueLabel) {
          let valueLabel = series.bullets.push(new am4charts.LabelBullet());
          valueLabel.label.text = "{valueX.value}";
          valueLabel.label.trancate = false;
          valueLabel.label.fill = am4core.color("#FFFFFF");
          valueLabel.label.fontSize = 13;
          valueLabel.label.horizontalCenter = "right";
          valueLabel.label.dx = -5;
        }

        series.strokeWidth = 0;
        series.columns.template.column.minWidth = 5;
        series.columns.template.column.cornerRadiusBottomRight = 2;
        series.columns.template.column.cornerRadiusTopRight = 2;
        series.tooltip.getStrokeFromObject = false;
        series.tooltip.getFillFromObject = false;
        series.tooltip.label.valign = "center";
        series.tooltip.label.fill = am4core.color("#6c9fb2");
        series.tooltip.background.stroke = am4core.color("#6c9fb2");
        series.tooltip.label.fontSize = 13;
        series.tooltipText = this.chartOption.series.tooltipCont;
        series.tooltip.background.fillOpacity = 1;
        series.tooltip.background.filters.clear();

        /* BAR CHART 커스텀 스크롤 세팅 */
        chart.events.on("datavalidated", function(ev) {
          let barChart = ev.target;
          let cAxis = barChart.yAxes.getIndex(0);
          cAxis.zoomToIndexes(0, chart.data.length);
          barChart.scrollbarY = new am4core.Scrollbar();
          barChart.scrollbarY.hideGrips = true;
          barChart.scrollbarY = false;
          barChart.mouseWheelBehavior = "none";
          if (this.chartTheme !== "dash_csmp_useState") {
            barChart.svgContainer.htmlElement.style.height = "300px";
          } else {
            barChart.svgContainer.htmlElement.style.height = "270px";
          }
          chart.scrollbarY.startGrip.disabled = true;
          chart.scrollbarY.endGrip.disabled = true;

        });
        /* CSMP _ 리소스 사용현황 COLUMN HEIGHT 수정 */
        if (this.chartTheme === "dash_csmp_useState") {
          series.columns.template.height = am4core.percent(60);
        }

      } else {
        _.map(keys, (k, i) => {
          this.createColumn(chart, k, i);
        });
      };

      if (this.chartTheme === "dash_aiPattern") {
        categoryAxis.renderer.cellStartLocation = 0.15;
        categoryAxis.renderer.cellEndLocation = 0.85;
        categoryAxis.renderer.labels.template.adapter.add("textOutput", function(text) {

          if (text !== "" && text !== undefined) {
            if (text.length > 10) {
              text = "".concat(text.substring(0,10), "...");
            }
          }
          return text;
        });
      }

      /* 차트 VALUE FORMAT 수정 */
      if (this.chartOption.isNumberFormat) {
        valueAxis.numberFormatter = new am4core.NumberFormatter();
        valueAxis.numberFormatter.numberFormat = this.chartOption.numberFormat;
        valueAxis.numberFormatter.bigNumberPrefixes = this.chartOption.numberFix;
      }

      /* 차트 커서 기본설정 */
      if (this.chartOption.cursor.isUse) {
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.maxTooltipDistance = (this.chartOption.series.isTotalTooltip) ? -1 : 0;
        if (this.chartOption.cursor.isHiddenLine) {
          chart.cursor.lineY.disabled = this.chartOption.cursor.isHiddenLine;
          chart.cursor.lineX.disabled = this.chartOption.cursor.isHiddenLine;
        }
        chart.cursor.behavior = "none";
      }

      /* 범례영역 기본설정 */
      if (this.chartOption.legend.isUse) {
        chart.legend = new am4charts.Legend();
        chart.legend.position = this.chartOption.legend.position;
        chart.legend.contentAlign = this.chartOption.legend.align;
        chart.legend.valign = this.chartOption.legend.valign;
        chart.legend.minWidth = this.chartOption.legend.minWidth;
        chart.legend.maxWidth = 500;
        if (this.chartTheme === "dash_usageCost") {
          chart.legend.minHeight = this.chartHeight - 30;
        } else {
          chart.legend.maxHeight = this.chartOption.legend.height;
        }
        chart.legend.fontSize = this.chartOption.legend.fontSize;
        chart.legend.scrollable = true;
        chart.legend.labels.template.fill = this.chartOption.legend.labelColor;
        chart.legend.paddingTop = 0;
        chart.legend.paddingBottom = 0;


        let markerTemplate = chart.legend.markers.template;
        markerTemplate.width = this.chartOption.legend.fontSize;
        markerTemplate.height = this.chartOption.legend.fontSize;

        _.map(chart.legend.data, (i, index) => {
          if (i.name == "") {
            chart.series.removeIndex(index).dispose();
          }
        });
      }

      /* 카테고리 축 스크롤가능여부 */
      if (this.chartOption.cateAxis.scrollAble) {
        chart.scrollbarY = new am4core.Scrollbar();
        chart.scrollbarY.thumb.minHeight = 50;
      }

      if (this.chartTheme === 'dash_resourceState') {
        categoryAxis.layout = "absolute";
        categoryAxis.startOnAxis  = true;
        categoryAxis.title.text = "서비스(" + this.serviceCount +")";
        categoryAxis.title.rotation = 0;
        categoryAxis.title.fontSize = 13;
        categoryAxis.title.dy = -20;
        categoryAxis.title.dx = 10;
        categoryAxis.title.align = "left";
        categoryAxis.title.valign = "top";
        categoryAxis.title.fontWeight = 600;
        categoryAxis.title.fill = '#6c9fb2';
      }

      /* AXIS 상단 공통단위 세팅 */
      if (this.chartOption.valueAxis.valueTitle !== '') {
        valueAxis.layout = "absolute";
        if ( this.chartTheme === 'dash_resourceState') {
          valueAxis.title.text = this.chartOption.valueAxis.valueTitle + "(" + this.resourceCount + ")";
        } else {
          valueAxis.title.text = this.chartOption.valueAxis.valueTitle;
        }
        valueAxis.title.rotation = 0;
        valueAxis.title.fontSize = 13;
        valueAxis.title.dy = (this.chartType !== 'vertical') ? -25 : -2;
        valueAxis.title.dx = (this.chartType !== 'vertical') ? 15 : 0;
        valueAxis.title.align = "left";
        valueAxis.title.valign = "top";
        valueAxis.title.fontWeight = 600;
        valueAxis.title.fill = '#6c9fb2';
      }

      // 청구정보, 사용내역시 토탈 Label 보여주기
      if (this.chartTheme === 'bill_trend') {
        valueAxis.extraMax = 0.1;
        valueAxis.calculateTotals = true;
        let totalSeries = chart.series.push(new am4charts.ColumnSeries());
        totalSeries.dataFields.valueY = "none";
        totalSeries.dataFields.categoryX = this.categoryName;
        totalSeries.stacked = true;
        totalSeries.hiddenInLegend = true;
        totalSeries.columns.template.strokeOpacity = 0;

        var totalBullet = totalSeries.bullets.push(new am4charts.LabelBullet());
        totalBullet.dy = -7;
        totalBullet.label.truncate = false;
        totalBullet.label.fill = am4core.color("#6c9fb2");
        let curcy = (this.curcyCode === 'USD' ) ? '$' : '₩';
        totalBullet.label.text = curcy + "{valueY.total}";
        totalBullet.label.fontSize = 13;
      }

      this.chart = chart;
    },

    createColumn(chart, key, index) {

      /* COLUMN CHART SERIES 생성 */
      let series = chart.series.push(new am4charts.ColumnSeries());

      /* X축 그룹화 할 KEY PROPERTIES 값 */
      series.dataFields.categoryX = this.categoryName;

      /* Y축 그려질 KEY PROPERTIES 값 */
      series.dataFields.valueY = key.key;

      series.dataFields.valueYShow = this.chartOption.series.valueShow;

      /* Y축 칼럼이름을 특별히 사용해야할 시 리스트형태로 만들어 커스텀으로 사용 */
      if (this.chartOption.series.customName.length > 0) {
        series.name = this.chartOption.series.customName[index];
      } else {
        series.name = (key.title) ? key.title : key.key;
      }

      /* 칼럼 중첩 속성 */
      series.stacked = this.chartOption.series.isStack;

      /* 칼럼 좌우폭  (ㅣ ㅣ : ㅣㅣ : ㅣ    ㅣ )설정 */
      if (this.chartOption.series.columnWidth > 0) {
        if (this.chartTheme === "use_usageCost" || this.chartTheme === "bill_trend") {
          series.columns.template.width = am4core.percent(this.chartOption.series.columnWidth);
        } else if (this.chartTheme === "dash_csmp_anyOpen_status" || this.chartTheme === "dash_csmp_dayUseState") {
          series.columns.template.width = am4core.percent(50);
        } else {
          series.columns.template.width = this.chartOption.series.columnWidth;
        }

      }

      /* MOUSE OVER시 TOOLTIP BOX 노출여부, 값이 '' 일 시 툴팁활용 안함 */
      if (this.chartOption.series.tooltipType === 'default') {
        series.tooltipText = this.chartOption.series.tooltipCont;
      } else if (this.chartOption.series.tooltipType === 'html'){
        series.tooltipHTML = this.chartOption.series.tooltipCont;
      }

      /* MOUSE OVER시 범례영역에 범례영역별 VALUE값 노출여부 및 컨텐츠 */
      if (this.chartOption.legend.showData) {
        series.legendSettings.itemValueText = "[bold]₩ {valueY.value} [/bold]";
      }

      /* 툴팁 border line을 column색과 일치할 지 여부 */
      series.tooltip.getStrokeFromObject = true;

      /* 툴팁 background를 column색과 일치할 지 여부 */
      series.tooltip.getFillFromObject = false;

      /* 툴팁 border line 투명도 */
      series.tooltip.strokeOpacity = 1;

      /* 툴팁 BOX 투명도 */
      series.tooltip.background.fillOpacity = 1;

      /* 툴팁 font color */
      series.tooltip.label.fill = am4core.color(chart.colors.list[index].hex);

      /* 툴팁 border line 그림자 제거 */
      series.tooltip.background.filters.clear();

      /* 범례영역 커스텀 */
      if (this.chartOption.cateAxis.isLegendCustom) {
        series.columns.template.events.on("hit", function(ev) {
          chart.series.each(function(series) {
            if (series instanceof am4charts.ColumnSeries) {
              series.columns.each(function(column) {
                if (column.dataItem.categoryX == ev.target.dataItem.categoryX) {
                  let price = column.dataItem.valueY ? column.dataItem.valueY : 0;
                  series.legendSettings.labelText = series.name + "[font-size:14px] (₩" + numberWithCommas(parseFloat(price).toFixed(0)) + ")[/]";
                }
              })
            }
          });
        });
      }

      if (this.chartTheme === "dash_usageCost" || this.chartTheme === "use_usageCost") {
        series.columns.template.events.on("hit", function(ev) {
          this.totalPrice = ev.target.tooltipDataItem.values.valueY.total;
        }, this);
      }

      /* 칼럼 그라데이션 적용 */
      if (this.chartOption.series.isGradation) {
        series.strokeWidth = 0;
        let fillModifier = new am4core.LinearGradientModifier();
        fillModifier.opacities = [1, 0.2];
        fillModifier.offsets = [0.2, 1];
        fillModifier.gradient.rotation = 90;
        series.columns.template.fillModifier = fillModifier;
      }

      /* 툴팁을 칼럼별이 아닌 통합 툴팁박스로 활용여부 및 컨텐츠 */
      if (this.chartOption.series.isTotalTooltip) {
        series.tooltip.getStrokeFromObject = false;
        series.tooltip.label.fill = "#6c9fb2";
        series.tooltip.background.stroke = "#6c9fb2";
        series.adapter.add('tooltipHTML', (html, target) => {
          if (this.chartOption.series.totalTooltipCont !== '') {
            return this.chartOption.series.totalTooltipCont;
          }
          return "<div><p class='custom_tooltip_normal'>Total({categoryX})\r\n</p><p class='custom_tooltip_value'>₩ {valueY.total}</p></div>";
          // return '<div class="custom-tooltip"> <p>2011-12</span></p> <table> <tr class="custom-tr"> <th align="left" class="custom-text-total">${totalText}</th> <td align="right" class="font-family-montserrat-regular">"동해물과백두산이 마르고닳도록 하느님이 보우하사 우리나라만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이보전하세"</td></tr></table>"' ;
        }, this);
      }

      if (this.chartTheme === 'bill_trend') {
        let curcy = (this.curcyCode === 'USD' ) ? '$' : '₩';
        series.adapter.add('tooltipHTML', (html, target) => {
          return "<div><p class='custom_tooltip_date'>{name}\r\n</p><p class='custom_tooltip_value'>"+ curcy + "{valueY.value}</p></div>";
        }, this);
      }

      /* 칼럼 테두리 round효과 적용 */
      if (this.chartOption.valueAxis.isSideRound) {
        series.columns.template.column.cornerRadiusTopLeft = 1;
        series.columns.template.column.cornerRadiusTopRight = 1;
      }

      if (this.chartTheme === "dash_usageCost") {
        let ltd = chart.data[chart.data.length -1];
        let price = ltd[key.key] ? ltd[key.key] : 0;
        series.legendSettings.labelText = key.title + "[font-size:14px] (₩" + numberWithCommas(parseFloat(price).toFixed(0)) + ")[/]";
      }

      if (key.key === '') {
      }

      if (this.chartTheme === "dash_csmp_licenseUse") {
        series.clustered = false;
        series.strokeWidth = 0;
        if (index ===  0) {
          series.columns.template.fill = "#e8e8e8";
        } else {
          let data = chart.data[0];
          let useColor;
          if (data.asetUseCnt > data.ctrtAsetCnt) {
            useColor = "#fc5aa1";
            series.zIndex = -1;
          } else {
            useColor = "#00a5ed";
          }
          series.columns.template.fill = useColor;
        }
      } else if (this.chartTheme === "dash_mec_useStat") {
        series.clustered = false;
        series.strokeWidth = 0;
        if (index ===  0) {
          series.columns.template.fill = "#e8e8e8";
        } else {
          let lKeys = this.propsInfo.insProp;
          let data = chart.data[0];
          let useColor;
          if (data[lKeys[0]] > data[lKeys[1]]) {
            useColor = "#fc5aa1";
            series.zIndex = -1;
          } else {
            useColor = "#00a5ed";
          }
          series.columns.template.fill = useColor;
        }
      }

      /* 툴팁 커스텀 사용 */
      if (this.chartOption.series.isCustomTooltip) {
        series.adapter.add('tooltipHTML', (html, target) => {
          series.tooltip.getStrokeFromObject = false;
          series.tooltip.background.stroke = "#6c9fb2";
          series.tooltip.fontSize = 12;
          let t = target.tooltipDataItem.categoryX;
          let data = _.filter(chart.data, (d) => d.cspPrdtCd === t);
          data = data[0];

          let thisMonth = moment(data.billYm).format("M");
          let nextMonth = moment(data.billYm).subtract(1,'months').format("M");
          let curcy = ( data.pricingCurcyCd === 'USD' ) ? '$' : '₩';
          let strHtml = "<div class='aiPatternDiv'>" + data.cspPrdtCd + "</br></br>" ;
          strHtml += thisMonth +"월 : " + curcy  + numberWithCommas(data.curCost) + " </br>" ;
          strHtml += nextMonth + "월 : " + curcy  + numberWithCommas(data.bfCost) + " </br>" ;
          strHtml += "Max :  " + curcy  + numberWithCommas(data.maxCost) + " </br>" ;
          strHtml += "Avg :  " + curcy  + numberWithCommas(data.avgCost) ;
          return strHtml;
        });
      }

      if (this.chartTheme === "dash_aiPattern") {
        series.tooltip.getStrokeFromObject = false;
        series.tooltip.background.stroke = "#6c9fb2";
        series.tooltip.label.fill = "#6c9fb2"
      }

      /* LEGEND가 많은 차트일 경우, 상위 10개 ACTIVE 설정
         8월 5 일 > 범례 합쳐서 ETC로 보여주는 방안으로 수정됨
      */
      // if (this.chartOption.legend.isLimitLegend) {
      //     if (index > 9) {
      //         series.hidden = true;
      //     }
      // }
    },
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
}
</script>

</style>
