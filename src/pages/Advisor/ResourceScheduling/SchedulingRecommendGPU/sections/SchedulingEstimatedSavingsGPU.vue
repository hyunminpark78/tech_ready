<template>
  <div id="schedulingEstimatedSavingsGPU" class="dashboard-card mb-4">
    <div class="grid2-wrap scheduling-grid2-wrap">
      <div class="box-wrap list2-wrap type2">
        <div class="col">
          <DataLoadingOverlay v-if="loading" :height="195"></DataLoadingOverlay>
          <div v-show="!loading">
            <div class="ti">
              <strong class="text-primary-400">{{
                $t('advisor.schedulingRecommendGPU.schedulingSummary.estimatedSaveScheduling')
              }}</strong>
              <div class="text-gray-500">
                {{ $t('advisor.schedulingRecommendGPU.schedulingSummary.estimatedSaveSchedulingDes') }}
              </div>
            </div>
            <div class="pr">
              ￦<span id="jsCount5">{{ totalEstimatedSavings }}</span>
            </div>
            <br />
            <div class="ti">
              <strong class="text-primary-400">{{
                $t('advisor.schedulingRecommendGPU.schedulingSummary.estimatedSaveRateScheduling')
              }}</strong>
              <div class="text-gray-500">
                {{ $t('advisor.schedulingRecommendGPU.schedulingSummary.estimatedSaveRateSchedulingDes') }}
              </div>
            </div>
            <div class="flex items-center text-primary-400">
              <strong class="mr-2" style="font-size: 26px;">{{ estimatedSavingsRate }}%</strong>
            </div>
          </div>
        </div>

        <div class="col">
          <DataLoadingOverlay v-if="loading" :height="195"></DataLoadingOverlay>
          <div v-show="!loading">
            <div class="ti">
              <strong class="text-primary-400">{{
                $t('advisor.schedulingRecommendGPU.schedulingSummary.estimatedSavingsByInstanceFamily')
              }}</strong>
            </div>
            <!-- horizontal bar chart -->
            <div id="estimatedSavingChart" class="chart-wrap scheduling-chart-wrap"></div>
          </div>
        </div>
      </div>

      <div class="box-wrap list-wrap">
        <div class="con1">
          <br />
          <div class="col">
            <DataLoadingOverlay v-if="loading" :height="195"></DataLoadingOverlay>
            <div v-show="!loading">
              <div class="ti">
                <strong class="text-primary-400">{{
                  $t('advisor.schedulingRecommendGPU.schedulingSummary.recommendedInstanceFamilies')
                }}</strong>
              </div>
              <!-- pie chart -->
              <div
                id="rcmdInstFamiliesChart"
                style="
                  font-size: 24px;
                  letter-spacing: -0.03px;
                  text-align: center;
                  color: #fff;
                  line-height: 130px;
                  height: 160px;
                "
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay.vue';
import { mapState } from 'vuex';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import NoDataOverlay from '@/components/Overlays/NoDataOverlay.vue';

export default {
  components: { NoDataOverlay, DataLoadingOverlay },
  computed: {
    ...mapState('resourceScheduling', {
      schedulingGPUChartData: 'schedulingGPUChartData',
    }),
  },
  watch: {
    schedulingGPUChartData: function () {
      console.log(
        '%c ############################# [ schedulingGPUChartData ] #############################',
        'background:red; color:white'
      );
      console.log('this.schedulingGPUChartData: ' + '\n', this.schedulingGPUChartData);
      this.groupAndCalculate(this.schedulingGPUChartData); // Summary 데이터로 가공
      this.initChart();
    },
  },
  data() {
    return {
      loading: true,
      chartData: [
        { category: 'P3', value: 8 },
        { category: 'P4d', value: 4 },
        { category: 'G6', value: 3 },
        { category: 'G4d', value: 3 },
        { category: 'G3', value: 2 },
      ],

      totalEstimatedSavings: 0, // 월 예상 절감액
      estimatedSavingsRate: 0, // 월 예상 절감률
      groupedChartData: [],
    };
  },
  methods: {
    initChart() {
      this.calculateTotalEstimatedSavings(); // (좌측) 월 예상 절감액
      this.calculateEstimatedSavingsRate(); // (좌측) 월 예상 절감률
      this.createEstimatedSavingChart(); // (중앙) Horizontal Bar Chart
      this.createRcmdInstFamiliesChart(); // (우측) Pie Chart
      this.loading = false;
    },

    // ############################ 인스턴스 패밀리별 예상 절감액 ############################
    createEstimatedSavingChart() {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create('estimatedSavingChart', am4charts.XYChart);

      // 하드코딩된 데이터
      // chart.data = [
      //   {
      //     schedulingNm: 'P3',
      //     totalMnthExpctSaveAmt: 1000000,
      //     rate: 100,
      //   },
      //   {
      //     schedulingNm: 'P4d',
      //     totalMnthExpctSaveAmt: 800000,
      //     rate: 60,
      //   },
      //   {
      //     schedulingNm: 'G6',
      //     totalMnthExpctSaveAmt: 600000,
      //     rate: 40,
      //   },
      //   {
      //     schedulingNm: 'G4d',
      //     totalMnthExpctSaveAmt: 400000,
      //     rate: 20,
      //   },
      //   {
      //     schedulingNm: 'G3',
      //     totalMnthExpctSaveAmt: 200000,
      //     rate: 10,
      //   },
      // ];

      chart.data = this.groupedChartData;

      let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'schedulingNm';
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.renderer.labels.template.fontSize = 12;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.inversed = true;
      categoryAxis.tooltip.label.fontSize = 13;
      categoryAxis.tooltipText = '';
      categoryAxis.cursorTooltipEnabled = false; // 중복 툴팁 제거

      this.chartDataTotCnt = this.schedulingGPUChartData.length;
      categoryAxis.renderer.labels.template.adapter.add('text', function (text, target) {
        if (target.dataItem && target.dataItem.dataContext) {
          let totalMnthExpctSaveAmt = target.dataItem.dataContext.totalMnthExpctSaveAmt;
          totalMnthExpctSaveAmt = Math.floor(totalMnthExpctSaveAmt).toLocaleString();
          return `${text} [#808080](₩${totalMnthExpctSaveAmt})[/]`;
        }
        return text;
      });

      let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.disabled = true;
      valueAxis.renderer.opposite = true;
      valueAxis.renderer.baseGrid.disabled = true;
      valueAxis.tooltip.disabled = true;

      // 카테고리 별 크게 차이나지 않는 값임에도 막대의 길이가 크게 차이나는 현상에 대한 조치
      valueAxis.min = 0;
      valueAxis.max = Math.max(...chart.data.map((item) => item.totalMnthExpctSaveAmt)) * 1.1;

      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = 'totalMnthExpctSaveAmt';
      series.dataFields.categoryY = 'schedulingNm';
      series.columns.template.tooltipText = '{categoryY}: ₩{valueX}';
      series.columns.template.adapter.add('fill', function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });
      series.columns.template.strokeWidth = 0;
      series.columns.template.height = 25; // 막대 두께 고정. 픽셀 단위
      series.columns.template.column.cornerRadiusTopRight = 5;
      series.columns.template.column.cornerRadiusTopLeft = 5;
      series.columns.template.column.cornerRadiusBottomRight = 5;
      series.columns.template.column.cornerRadiusBottomLeft = 5;

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.disabled = true;
      chart.cursor.lineY.disabled = true;

      // 차트 여백 조정
      chart.paddingRight = 0;
      chart.paddingLeft = 0;

      // 툴팁
      series.tooltip.label.fill = am4core.color('#FFFFFF');
      series.tooltip.fontSize = 13;
      series.tooltip.label.fontSize = 13;
      series.tooltip.autoTextColor = false;
      series.tooltip.pointerOrientation = 'vertical';
      return chart;
    },

    groupAndCalculate(data) {
      // 그룹화를 위한 객체 생성
      const groupedData = {};

      // 데이터 그룹화
      data.forEach((item) => {
        const key = item.instsFamNm;
        if (!groupedData[key]) {
          groupedData[key] = {
            count: 0,
            totalSaveAmt: 0,
          };
        }
        groupedData[key].count++;
        groupedData[key].totalSaveAmt += item.mnthExpctSaveAmt;
      });

      const result = Object.entries(groupedData)
        .map(([key, value]) => {
          return {
            schedulingNm: key,
            count: value.count,
            totalMnthExpctSaveAmt: value.totalSaveAmt,
          };
        })
        .sort((a, b) => b.totalMnthExpctSaveAmt - a.totalMnthExpctSaveAmt);

      this.groupedChartData = result;
    },

    // ############################ GPU 스케줄 추천 대상 인스턴스 패밀리 ############################
    createRcmdInstFamiliesChart() {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create('rcmdInstFamiliesChart', am4charts.PieChart);
      chart.innerRadius = am4core.percent(65);

      chart.data = this.groupedChartData;

      // 하드코딩된 데이터
      // chart.data = [
      //   { schedulingNm: 'P3', count: 8 },
      //   { schedulingNm: 'P4d', count: 4 },
      //   { schedulingNm: 'G6', count: 3 },
      //   { schedulingNm: 'G4d', count: 3 },
      //   { schedulingNm: 'G3', count: 2 },
      // ];

      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'count';
      pieSeries.dataFields.category = 'schedulingNm';

      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;

      pieSeries.slices.template.tooltipText = '{schedulingNm}: {count}개';
      pieSeries.tooltip.label.fontSize = 10;

      pieSeries.slices.template.adapter.add('fill', function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });

      this.createChartLabel(
        pieSeries,
        chart.data.reduce((sum, item) => sum + item.count, 0)
      );
      this.createChartLegend(chart);

      return chart;
    },

    createChartLabel(pieSeries, count) {
      let label = pieSeries.createChild(am4core.Label);
      label.text = count.toString();
      label.horizontalCenter = 'middle';
      label.verticalCenter = 'middle';
      label.fontSize = 30;
    },

    createChartLegend(chart) {
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      chart.legend.scrollable = true;
      chart.legend.valign = 'middle';
      chart.legend.labels.template.text = '[{color}]{name} ({count}개)';
      chart.legend.valueLabels.template.text = '';
      chart.legend.labels.template.maxWidth = 150;
      chart.legend.itemContainers.template.paddingBottom = 1;
      chart.legend.labels.template.fontSize = 14;
      chart.legend.itemContainers.template.width = 180;
      chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      chart.legend.labels.template.truncate = false;
      chart.legend.labels.template.wrap = false;
    },

    // 총 월 예상 절감액 계산
    calculateTotalEstimatedSavings() {
      const totalSavings = this.schedulingGPUChartData.reduce((acc, item) => {
        return acc + item.mnthExpctSaveAmt;
      }, 0);

      this.totalEstimatedSavings = Math.floor(totalSavings).toLocaleString();
    },
    // 월 예상 절감률
    calculateEstimatedSavingsRate() {
      const totalMnsthUseAmt = this.schedulingGPUChartData.reduce((acc, item) => acc + item.mnthUseAmt, 0);
      const totalMnthExpctUseAmt = this.schedulingGPUChartData.reduce((acc, item) => acc + item.mnthExpctUseAmt, 0);

      if (totalMnsthUseAmt === 0) {
        this.estimatedSavingsRate = 0;
      } else {
        const estimatedSavingsRate = 100 * (totalMnsthUseAmt - totalMnthExpctUseAmt) / totalMnsthUseAmt;
        this.estimatedSavingsRate = Math.round(estimatedSavingsRate * 100) / 100; // 소수점 두 자리까지 반올림
      }
    },
  },
};
</script>
<style>
#schedulingEstimatedSavingsGPU .scheduling-grid2-wrap {
  height: 245px;
}

#schedulingEstimatedSavingsGPU .scheduling-chart-wrap {
  height: 180px;
  top: 26px;
  width: 100%;
}
</style>
