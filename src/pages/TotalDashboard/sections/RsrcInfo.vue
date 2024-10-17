<template>
  <div class="box-wrap pb24">
    <div class="title">
      <h4 class="tit-wrap">{{ $t('dashboard.resourceSummary') }}</h4>
      <button v-if="isAuth && existData" class="more single" @click="routeDetail">
        {{ $t('common.button.viewDetails') }}
      </button>
    </div>
    <div v-if="!isAuth" class="flex flex-col items-center justify-center" style="height: 180px">
      <img src="@/assets/images/ico-nodata-chart.svg" alt="." style="width: 30%; height: 30%" />
      <p class="mt-3 text-gray-700 text-center" style="font-size: 15px">
        서버, DB 등 주요 자원에 대한 <br />
        사용량 정보를 제공하는 서비스입니다. <br />
        사용 등록을 원하실 경우 관리자<br />
        <span style="color: #00a5ed; font-size: 15px">(cmp-help@sktelecom.com)</span>에 문의하시길 바랍니다.
      </p>
    </div>
    <div v-else>
      <DataLoadingOverlay v-if="loading" :height="180"></DataLoadingOverlay>
      <div v-else>
        <div v-if="existData" class="list7-wrap">
          <div class="col">
            <div class="tit4-wrap">Top {{ rankData.length }}</div>
            <ul class="ls">
              <li v-for="data in rankData" :key="data.type">
                <span class="t">{{ data.type }}</span>
                <span class="n"
                  ><strong>{{ data.total }}</strong> {{ $t('dashboard.unit') }}</span
                >
              </li>
            </ul>
          </div>
          <div class="col">
            <div v-show="existData" id="rsrcInfoChart" class="chart-wrap" style="height: 212px">Chart</div>
          </div>
        </div>
        <NoDataOverlay v-if="!existData" :icon-type="'chart'" :height="180"></NoDataOverlay>
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
import { hasOptiRole, hasRsrcRole } from './role-permission';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay.vue';
import NoDataOverlay from '@/components/Overlays/NoDataOverlay.vue';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: { DataLoadingOverlay, NoDataOverlay },
  data() {
    return {
      loading: false,
      existData: false,
      totalCnt: 0,
      rank: 3,
      rankData: [],
      isAuth: hasOptiRole() && hasRsrcRole(),
    };
  },
  computed: {
    ...mapState('totalDashboard', ['isSearch', 'filter', 'rsCurrentData']),
    ...mapState('menu', ['menu']),
  },
  watch: {
    '$i18n.locale': 'setChart',
    isSearch(newVal) {
      if (newVal.isSearch) {
        if (this.isAuth) {
          this.loading = true;
          this.setData();
        }
      }
    },
  },
  created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    am4core.options.autoDispose = true;
    this.setData();
  },
  mounted() {},
  methods: {
    ...mapActions('totalDashboard', ['fetchRsCurrent']),
    ...mapActions('common', ['waitGettingCtrts']),
    async setData() {
      this.loading = true;
      await this.waitGettingCtrts();
      await this.fetchRsCurrent({ ctrtId: this.filter.contract.ctrtId });
      if (this.rsCurrentData && this.rsCurrentData.length > 0) {
        this.setRank();
        if (this.totalCnt !== 0) {
          this.existData = true;
          setTimeout(this.setChart, 100);
        } else {
          this.existData = false;
        }
      } else {
        this.existData = false;
      }
      this.loading = false;
    },
    setRank() {
      const data = _.cloneDeep(this.rsCurrentData);
      if (data.length < this.rank) {
        this.rankData = [...data];
      } else {
        this.rankData = data.slice(0, this.rank);
      }
      this.totalCnt = this.rankData.map((item) => item.total).reduce((prev, curr) => prev + curr, 0);
    },
    setChart() {
      // const data = _.cloneDeep(this.rsCurrentData);
      const chart = am4core.create('rsrcInfoChart', am4charts.XYChart);
      this.chartEventDisabled(chart);
      this.createChart(chart, this.rankData);
      this.loading = false;
    },
    chartEventDisabled(chart) {
      chart.seriesContainer.events.on('click', (event) => {
        event.target.interactionsEnabled = false;
      });
    },
    createChart(chart, data) {
      chart.data = data;
      chart.fontFamily = 'AppleSDGothicNeo';
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.maxTooltipDistance = -1; // 커서 안겹치게
      chart.cursor.lineY.disabled = true;
      chart.cursor.lineX.disabled = true;
      chart.paddingTop = 30;
      chart.paddingBottom = -10;
      chart.paddingLeft = 0;
      chart.paddingRight = 0;

      chart.legend = new am4charts.Legend();
      chart.legend.position = 'bottom';
      chart.legend.fontSize = 13;
      chart.legend.contentAlign = 'right';
      chart.legend.showData = false;
      chart.legend.marginLeft = 15;
      chart.legend.itemContainers.template.marginLeft = 3;
      chart.legend.itemContainers.template.marginRight = 3;
      const markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 11;
      markerTemplate.height = 11;

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'type';
      categoryAxis.renderer.labels.template.adapter.add('textOutput', (text) => text.replace(/ /g, '\n'));
      categoryAxis.renderer.labels.template.textAlign = 'middle';

      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.labels.template.fontSize = 13;
      categoryAxis.tooltip.disabled = true;
      categoryAxis.renderer.minGridDistance = 10;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.fontSize = 13;
      valueAxis.fontSize = 13;
      valueAxis.tooltip.disabled = true;

      const tooltipText = `[bold]{categoryX}[/]\n
          ${this.$t('dashboard.running')}: {running}${this.$t('cost.unit')}
          ${this.$t('dashboard.stopped')}: {stopped}${this.$t('cost.unit')}
          ${this.$t('dashboard.etc')}: {etc}${this.$t('cost.unit')}
        `;

      const series1 = chart.series.push(new am4charts.ColumnSeries());
      series1.name = this.$t('dashboard.running');
      series1.dataFields.valueY = 'running';
      series1.dataFields.categoryX = 'type';
      series1.stacked = true;
      series1.columns.template.width = am4core.percent(60);
      this.chartDefaultSetting(series1, '#44d7b6');
      this.tooltipSetting(series1);
      series1.tooltipText = tooltipText;
      series1.columns.template.column.adapter.add('cornerRadiusTopLeft', (radius, item) => {
        return this.cornerRadius(chart, radius, item);
      });
      series1.columns.template.column.adapter.add('cornerRadiusTopRight', (radius, item) => {
        return this.cornerRadius(chart, radius, item);
      });

      const series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.name = this.$t('dashboard.stopped');
      series2.dataFields.valueY = 'stopped';
      series2.dataFields.categoryX = 'type';
      series2.stacked = true;
      series2.columns.template.width = am4core.percent(60);
      this.chartDefaultSetting(series2, '#BEC6D3');
      this.tooltipSetting(series2);
      series2.tooltipText = tooltipText;
      series2.columns.template.tooltipText = '[bold][font-size:13px]{name}[/]\n[font-size:13px]{categoryX}: {valueY}';
      series2.columns.template.column.adapter.add('cornerRadiusTopLeft', (radius, item) => {
        return this.cornerRadius(chart, radius, item);
      });
      series2.columns.template.column.adapter.add('cornerRadiusTopRight', (radius, item) => {
        return this.cornerRadius(chart, radius, item);
      });

      const series3 = chart.series.push(new am4charts.ColumnSeries());
      series3.name = this.$t('dashboard.etc');
      series3.dataFields.valueY = 'etc';
      series3.dataFields.categoryX = 'type';
      series3.stacked = true;
      series3.columns.template.width = am4core.percent(60);
      this.chartDefaultSetting(series3, '#dedede');
      this.tooltipSetting(series3);
      series3.tooltipText = tooltipText;
      series3.columns.template.tooltipText = '[bold][font-size:13px]{name}[/]\n[font-size:13px]{categoryX}: {valueY}';
      series3.columns.template.column.cornerRadiusTopRight = 10;
      series3.columns.template.column.cornerRadiusTopLeft = 10;
      series3.columns.template.column.adapter.add('cornerRadiusTopLeft', (radius, item) => {
        return this.cornerRadius(chart, radius, item);
      });
      series3.columns.template.column.adapter.add('cornerRadiusTopRight', (radius, item) => {
        return this.cornerRadius(chart, radius, item);
      });
    },
    chartDefaultSetting(series, color) {
      series.strokeWidth = 0;
      series.sequencedInterpolation = true;

      series.fill = am4core.color(color);
      series.stroke = am4core.color(color);
    },
    cornerRadius(chart, radius, item) {
      let dataItem = item.dataItem;
      // Find the last series in this stack
      let lastSeries;
      chart.series.each(function (series) {
        if (
          dataItem.dataContext[series.dataFields.valueY] &&
          !series.isHiding &&
          dataItem.dataContext[series.dataFields.valueY] != 0
        ) {
          lastSeries = series;
        }
      });
      // If current series is the one, use rounded corner
      return dataItem.component == lastSeries ? 5 : radius;
    },
    tooltipSetting(series) {
      series.tooltip.fontSize = 12;
      series.tooltip.label.fontSize = 12;
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color('#44d7b6');
      series.tooltip.autoTextColor = false;
      series.tooltip.label.fill = am4core.color('#FFFFFF');
      series.tooltip.pointerOrientation = 'vertical';
    },
    routeDetail() {
      let value = {};
      value.ctrtId = this.filter.contract.ctrtId;
      value.cspTypCd = this.filter.cspTypCd;
      this.$router.push({
        name: '사용량',
        params: value,
        props: true,
      });
    },
  },
};
</script>

<style></style>
