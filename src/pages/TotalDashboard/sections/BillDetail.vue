<template>
  <div class="box-wrap list-wrap">
    <div class="title">
      <h4 class="tit-wrap">{{ $t('dashboard.topFiveCharges') }}</h4>
      <button v-if="existData" class="more single" @click="routeDetail(null)">
        {{ $t('common.button.viewDetails') }}
      </button>
    </div>
    <div class="list9-wrap">
      <div class="col">
        <div class="tit4-wrap">{{ $t('dashboard.byProduct') }}</div>

        <DataLoadingOverlay v-if="loading" :height="171"></DataLoadingOverlay>
        <NoDataOverlay v-else-if="!existData" :icon-type="'chart'" :height="171"></NoDataOverlay>

        <div v-show="existData && !loading" id="billServiceChart" style="line-height: 171px; height: 171px"></div>
      </div>
      <div class="col">
        <div class="tit4-wrap">{{ $t('dashboard.byAccount') }}</div>

        <DataLoadingOverlay v-if="loading" :height="171"></DataLoadingOverlay>
        <NoDataOverlay v-else-if="!existData" :icon-type="'chart'" :height="171"></NoDataOverlay>

        <div v-show="existData && !loading" id="billAcntChart" class="chart-wrap" style="height: 190px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as _ from 'lodash';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay.vue';
import NoDataOverlay from '@/components/Overlays/NoDataOverlay.vue';

export default {
  components: { DataLoadingOverlay, NoDataOverlay },
  data() {
    return {
      loading: false,
      existData: false,
    };
  },
  computed: {
    ...mapState('totalDashboard', ['filter', 'billInfo', 'isSearch', 'billDetail']),
  },
  watch: {
    billDetail() {
      this.setChart();
    },
  },
  created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    am4core.options.autoDispose = true;
  },
  mounted() {},
  methods: {
    ...mapActions('totalDashboard', ['fetchBillDetail']),
    setChart() {
      this.loading = true;

      const data = _.cloneDeep(this.billDetail);
      this.existData = data == null ? false : true;

      if (this.existData) {
        // SERVICE
        const billServiceChart = am4core.create('billServiceChart', am4charts.PieChart);

        this.chartEventDisabled(billServiceChart);
        this.createPieSeries('SERVICE', billServiceChart, data.serviceInfo);
        billServiceChart.innerRadius = am4core.percent(40);

        // ACCOUNT
        const billAcntChart = am4core.create('billAcntChart', am4charts.XYChart);

        const acntData = [...data.acntInfo].reverse();
        this.chartEventDisabled(billAcntChart);
        this.createBarSeries('ACCOUNT', billAcntChart, acntData);
      }

      this.loading = false;
    },
    chartEventDisabled(chart) {
      chart.seriesContainer.events.on('click', (event) => {
        event.target.interactionsEnabled = false;
      });
    },
    createBarSeries(type, chart, data) {
      chart.data = data;
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineY.disabled = true;
      chart.cursor.lineX.disabled = true;
      chart.fontFamily = 'AppleSDGothicNeo';
      chart.paddingTop = 5;
      chart.paddingBottom = -14;
      chart.paddingLeft = 0;
      chart.paddingRight = 0;

      const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.gridAlpha = 0;
      categoryAxis.dataFields.category = 'acntNm';
      categoryAxis.renderer.grid.template.disabled = true; // 축 제거
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 24;
      categoryAxis.renderer.labels.template.truncate = false; // 라벨 길 경우 자르기
      categoryAxis.renderer.labels.template.maxWidth = 180;
      categoryAxis.renderer.labels.template.align = 'left';
      categoryAxis.renderer.labels.template.tooltipText = `{category}: ({rate}%)`;
      categoryAxis.renderer.labels.template.fill = am4core.color('#252525');
      categoryAxis.renderer.labels.template.adapter.add('text', function (text, target) {
        if (target.dataItem.dataContext) {
          if (target.dataItem.dataContext.acntNm.length > 15) {
            const label = target.dataItem.dataContext.acntNm.substr(0, 15);
            return label + `...({rate}%)`;
          } else {
            return `{category}: ({rate}%)`;
          }
        }
      });
      categoryAxis.fontSize = 13;
      categoryAxis.tooltip.label.fontSize = 13;
      categoryAxis.tooltipText = '';
      categoryAxis.cursorTooltipEnabled = false; // 중복 툴팁 제거

      const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.gridAlpha = 0;
      valueAxis.min = 0;
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minGridDistance = 50;
      valueAxis.renderer.baseGrid.disabled = true; // value = 0 일때 선 삭제
      valueAxis.renderer.grid.template.disabled = true; // 축 제거
      valueAxis.renderer.labels.template.fontSize = 12;
      valueAxis.renderer.labels.template.adapter.add('text', function (text, target) {
        return '';
      }); // 라벨 삭제

      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = 'krwBlendCost';
      series.dataFields.categoryY = 'acntNm';
      series.strokeWidth = 0;
      series.columns.template.adapter.add('fill', function (fill, target) {
        if (target.dataItem.categoryY === 'etc') {
          return am4core.color('#e9ebed');
        } else {
          return chart.colors.getIndex(target.dataItem.index);
        }
      });
      series.columns.template.events.on('over', function (ev) {
        if (ev.target.dataItem.categoryY === 'etc') {
          series.tooltip.label.fill = am4core.color('#000000');
        } else {
          series.tooltip.label.fill = am4core.color('#FFFFFF');
        }
      });
      series.columns.template.column.cornerRadiusTopLeft = 5;
      series.columns.template.column.cornerRadiusTopRight = 5;
      series.columns.template.column.cornerRadiusBottomLeft = 5;
      series.columns.template.column.cornerRadiusBottomRight = 5;
      series.tooltipText = `₩ {krwBlendCost.formatNumber('#,###.')}`;
      series.tooltip.fontSize = 13;
      series.tooltip.label.fontSize = 13;
      series.tooltip.autoTextColor = false;
      series.tooltip.pointerOrientation = 'vertical';
      // series.tooltip.label.fill = am4core.color('#FFFFFF');

      let cellSize = 28.5;
      chart.events.on('datavalidated', function (ev) {
        // Get objects of interest
        let chart = ev.target;
        let categoryAxis = chart.yAxes.getIndex(0);
        // Calculate how we need to adjust chart height
        let adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;
        // get current chart height
        let targetHeight = chart.pixelHeight + adjustHeight;
        if (chart.pixelHeight == 0) {
          if (chart.data.length == 1) {
            chart.svgContainer.htmlElement.style.height = '55px';
          } else if (chart.data.length == 2) {
            chart.svgContainer.htmlElement.style.height = '83px';
          } else if (chart.data.length == 3) {
            chart.svgContainer.htmlElement.style.height = '112px';
          } else if (chart.data.length == 4) {
            chart.svgContainer.htmlElement.style.height = '140px';
          } else if (chart.data.length == 5) {
            chart.svgContainer.htmlElement.style.height = '175px';
          } else {
            chart.svgContainer.htmlElement.style.height = '190px';
          }
        } else {
          chart.svgContainer.htmlElement.style.height = targetHeight > 190 ? '190px' : targetHeight + 'px';
        }
      });
    },

    createPieSeries(type, chart, data) {
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      this.chartLabelDisabled(pieSeries);

      pieSeries.dataFields.value = 'krwBlendCost';
      if (this.filter.cspTypCd === 'AZURE') {
        pieSeries.dataFields.category = 'cspPrdtNm';
      } else {
        pieSeries.dataFields.category = 'cspPrdtCd';
      }
      pieSeries.slices.template.propertyFields.fill = 'fill';
      pieSeries.slices.template.adapter.add('fill', function (fill, target) {
        if (target.dataItem.category === 'etc') {
          return am4core.color('#e9ebed');
        } else {
          return fill;
        }
      });
      pieSeries.slices.template.events.on('over', function (ev) {
        if (ev.target.dataItem.category === 'etc') {
          pieSeries.tooltip.label.fill = am4core.color('#000000');
        } else {
          pieSeries.tooltip.label.fill = am4core.color('#FFFFFF');
        }
      });
      pieSeries.data = data;

      pieSeries.tooltip.fontSize = 12;
      pieSeries.tooltip.label.fontSize = 12;
      pieSeries.slices.template.tooltipText = `{category}: {value.percent.formatNumber('#.#')}% (₩ {value.formatNumber('#,###.')})`;
      pieSeries.tooltip.autoTextColor = false;
      // pieSeries.tooltip.label.fill = am4core.color('#FFFFFF');
      pieSeries.tooltip.pointerOrientation = 'vertical';

      chart.fontFamily = 'AppleSDGothicNeo';
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      chart.legend.valign = 'middle';
      chart.legend.itemContainers.template.width = 130;
      chart.legend.itemContainers.template.paddingTop = 5;
      chart.legend.itemContainers.template.paddingBottom = 5;
      chart.legend.fontSize = 13;
      chart.legend.labels.template.maxWidth = 130;
      chart.legend.labels.template.truncate = true;
      chart.legend.labels.template.wrap = false;
      chart.legend.valueLabels.template.text = '';
      chart.paddingTop = 0;
      chart.paddingBottom = 0;
      chart.paddingLeft = 0;
      chart.paddingRight = 0;

      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 11;
      markerTemplate.height = 11;
    },
    chartLabelDisabled(series) {
      series.labels.template.disabled = true;
    },
    adjustFontSize() {
      const innerWith = window.innerWidth;
      if (innerWith <= 1500) {
        this.label.forEach(function (val) {
          val.fontSize = 15;
        });
      } else if (innerWidth <= 1650) {
        this.label.forEach(function (val) {
          val.fontSize = 20;
        });
      } else {
        this.label.forEach(function (val) {
          val.fontSize = 30;
        });
      }
    },
    routeDetail(value) {
      value = {};
      value.ctrtId = this.filter.contract.ctrtId;
      value.chrgYm = this.billInfo.chrgYm;
      value.detail = 'Y';
      this.$router.push({
        name: '청구정보',
        params: value,
        props: true,
      });
    },
  },
};
</script>

<style></style>
