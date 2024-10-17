<template>
  <div class="box-wrap type3" style="padding-top: 11px; padding-bottom: 18px">
    <div class="title">
      <p class="info">
        {{ $t('optimization.estimatedSavings') }}
      </p>
    </div>
    <div class="grid3-wrap" style="margin-top: 25px">
      <!-- col -->
      <div
        class="col"
        style="
          max-width: 380px !important;
          min-width: 380px !important;
          height: 161px;
          border-radius: 4px;
          border: solid 1px #00a5ed;
          padding-top: 16px;
          margin-top: -12px;
        "
      >
        <div class="list2-wrap type2">
          <div class="ti" style="margin-left: 16px">
            <strong class="text-primary-400">{{ $t('optimization.estimatedTotalMonthly') }}</strong>
            <div class="text-gray-500">{{ $t('optimization.expectedMonthlySavings') }}</div>
          </div>
          <div class="pr text-center" style="color: #00a5ed; margin-top: 20px">
            ￦<span id="jsCount9">{{ numberCutDecimal(rsCost + unusedCost) }}</span>
          </div>

          <div class="sc text-center">
            <!--            <div class="text-primary-800" style="color: #000">
              최적화 후 예상 절감률
              <div class="flex items-center text-primary-400 justify-center">
                <strong class="mr-2">{{ expctDisRate }}%</strong>
                <img src="@/assets/images/ico-up.svg" alt="." class="" />
              </div>
            </div>-->
          </div>
        </div>
        <!--        <div class="centered-content" v-else>
          <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
          <p class="mt-3 text-gray-700">표시할 데이터가 없습니다.</p>
        </div>-->
      </div>
      <!-- //col -->
      <!-- col -->
      <div class="col">
        <div class="title">
          <h4 class="tit-wrap" style="font-size: 14px; color: #00a5ed">{{ $t('optimization.forUnusedResources') }}</h4>
        </div>
        <div v-show="!isUnusedAllZero" style="margin-top: -17px">
          <div
            id="unusedChart"
            style="
              font-size: 24px;
              letter-spacing: -0.03px;
              text-align: center;
              color: #fff;
              line-height: 130px;
              height: 160px;
            "
          >
            Chart
          </div>
        </div>
        <div v-if="isUnusedAllZero" class="centered-content">
          <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
          <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
        </div>
      </div>
      <!-- //col -->
      <!-- col -->
      <div class="col">
        <div class="title">
          <h4 class="tit-wrap" style="font-size: 14px; color: #00a5ed">{{ $t('optimization.rightSizingAll') }}</h4>
        </div>
        <div v-show="!isRightSizingAllZero" style="margin-top: -17px">
          <div
            id="rightsizingChart"
            style="
              font-size: 24px;
              letter-spacing: -0.03px;
              text-align: center;
              color: #fff;
              line-height: 130px;
              height: 160px;
            "
          >
            Chart
          </div>
        </div>
        <div v-if="isRightSizingAllZero" class="centered-content">
          <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
          <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
        </div>
      </div>
      <!-- //col -->
    </div>
  </div>
  <!-- //grid -->
</template>

<script>
import { numberCutDecimal } from '@/pages/Opti/ResourceOpti/ResourceOptiCommon';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { mapState } from 'vuex';
export default {
  components: {},
  data() {
    return {
      totalCost: 0,
      unusedResourceDataMap: new Map(),
      rightsizingDataMap: new Map(),
      exchangeRate: 0,
      expctDisRate: 0,
    };
  },
  watch: {
    '$i18n.locale': ['drawUnusedChart', 'drawRightsizingChart'],
  },
  computed: {
    ...mapState('resourceOpti', {
      filter: 'filter',
      rsCost: 'rsCost',
      unusedCost: 'unusedCost',
    }),
    isUnusedAllZero() {
      return Array.from(this.unusedResourceDataMap.values()).every((data) => !data.count && !data.cost);
    },

    isRightSizingAllZero() {
      return Array.from(this.rightsizingDataMap.values()).every((data) => !data.count && !data.cost);
    },
  },
  created() {},
  methods: {
    numberCutDecimal: numberCutDecimal,

    initData() {
      this.totalCost = 0;
      this.unusedResourceDataMap = new Map();
      this.rightsizingDataMap = new Map();
      this.expctDisRate = 0;
    },

    setData(exchangeRate, totalCost, unusedResourceDataMap, rightsizingDataMap, expctDisRate) {
      this.initData();
      this.exchangeRate = exchangeRate;
      this.totalCost = totalCost;
      this.unusedResourceDataMap = unusedResourceDataMap;
      this.rightsizingDataMap = rightsizingDataMap;

      this.expctDisRate = expctDisRate;

      !this.isUnusedAllZero ? this.drawUnusedChart() : '';
      !this.isRightSizingAllZero ? this.drawRightsizingChart() : '';
    },

    drawUnusedChart() {
      let chart = am4core.create('unusedChart', am4charts.PieChart);
      chart.innerRadius = am4core.percent(65);

      // 차트의 series 설정
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      chart.data = Array.from(this.unusedResourceDataMap.values()).map((unusedResourceData) => ({
        category: `${unusedResourceData.category.name} `,
        value: unusedResourceData.count,
      }));
      let unusedDataCountSum = Array.from(this.unusedResourceDataMap.values()).reduce(
        (sum, unusedResourceData) => sum + unusedResourceData.count,
        0
      );

      this.createChartLabel(pieSeries, unusedDataCountSum);
      this.createChartLegend(chart);

      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'category';
      pieSeries.labels.template.disabled = true;
      // pieSeries.labels.template.fontSize = 10;
      pieSeries.ticks.template.disabled = true;

      pieSeries.slices.template.tooltipText = '{category}: {value}';
      pieSeries.tooltip.label.fontSize = 10;

      pieSeries.slices.template.propertyFields.fill = 'color';
      pieSeries.colors.list = [
        am4core.color('#2CC2FD'), // EBS 색상
        am4core.color('#1AE3BB'), // EIP 색상
        am4core.color('#FC5AA1'), // ELB 색상
        am4core.color('#A166F1'), // EC2 색상
      ];
    },
    drawRightsizingChart() {
      let chart = am4core.create('rightsizingChart', am4charts.PieChart);
      chart.innerRadius = am4core.percent(65);

      // 차트의 series 설정
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      chart.data = Array.from(this.rightsizingDataMap.values()).map((rightsizingData) => ({
        category: `${rightsizingData.category.name} `,
        value: rightsizingData.count,
      }));
      let rightsizingDataSum = Array.from(this.rightsizingDataMap.values()).reduce(
        (sum, rightsizingData) => sum + rightsizingData.count,
        0
      );

      this.createChartLabel(pieSeries, rightsizingDataSum);
      this.createChartLegend(chart);

      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'category';
      pieSeries.labels.template.disabled = true;
      // pieSeries.labels.template.fontSize = 10;
      pieSeries.ticks.template.disabled = true;

      pieSeries.slices.template.tooltipText = '{category}: {value}';
      pieSeries.tooltip.label.fontSize = 10;

      pieSeries.slices.template.propertyFields.fill = 'color';
      pieSeries.colors.list = [
        am4core.color('#2CC2FD'), // EC2 색상
        am4core.color('#1AE3BB'), // RDS 색상
      ];
    },
    createChartLabel(pieSeries, value) {
      let label = pieSeries.createChild(am4core.Label);
      label.text = value.toString();
      label.horizontalCenter = 'middle';
      label.verticalCenter = 'middle';
      label.fontSize = 30;
    },
    createChartLegend(chart) {
      /*chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      chart.legend.marginTop = 20;
      chart.legend.labels.template.text = '[{color}]{name} {value}' + '개';
      chart.legend.valueLabels.template.text = '';
      chart.legend.itemContainers.template.paddingTop = 1;
      /!*chart.legend.itemContainers.template.paddingBottom = 1;*!/
      chart.legend.labels.template.fontSize = 12;
      chart.legend.labels.template.maxWidth = 150;
      chart.legend.itemContainers.template.width = 180;
      chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 10;
      markerTemplate.height = 10;*/
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      chart.legend.scrollable = true;
      chart.legend.valign = 'middle';
      chart.legend.labels.template.text = '[{color}]{name} {value} ' + this.$t('optimization.unit');
      chart.legend.valueLabels.template.text = '';
      chart.legend.labels.template.maxWidth = 150;
      chart.legend.itemContainers.template.paddingBottom = 1;
      chart.legend.labels.template.fontSize = 12;
      chart.legend.itemContainers.template.width = 180;
      chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      chart.legend.labels.template.truncate = false;
      chart.legend.labels.template.wrap = false;
    },
  },
};
</script>
<style>
.centered-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
