<template>
  <div id="schedulingEstimatedSavings" class="dashboard-card mb-4">
    <div class="grid2-wrap scheduling-grid2-wrap">
      <div class="box-wrap list2-wrap type2" style="flex: 0.85;">
        <div class="col">
          <DataLoadingOverlay v-if="loading" :height="195"></DataLoadingOverlay>
          <div v-show="!loading">
            <div class="ti">
              <strong class="text-primary-400">
                {{ $t('advisor.schedulingRecommend.schedulingSummary.estimatedSaveScheduling') }}
              </strong>
              <div class="text-gray-500">
                {{ $t('advisor.schedulingRecommend.schedulingSummary.estimatedSaveSchedulingDes') }}
              </div>
            </div>
            <div class="pr">
              ￦<span id="jsCount5">{{ totalEstimatedSavings }}</span>
            </div>
            <br />
            <div class="ti">
              <strong class="text-primary-400">
                {{ $t('advisor.schedulingRecommend.schedulingSummary.estimatedSaveRateScheduling') }}
              </strong>
              <div class="text-gray-500">
                {{ $t('advisor.schedulingRecommend.schedulingSummary.estimatedSaveRateSchedulingDes') }}
              </div>
            </div>
            <div class="flex items-center text-primary-400">
              <strong class="mr-2" style="font-size: 26px">{{ estimatedSavingsRate }}%</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="box-wrap list2-wrap type2">
        <div class="col">
          <DataLoadingOverlay v-if="loading" :height="195"></DataLoadingOverlay>
          <div v-show="!loading">
            <div class="ti">
              <strong class="text-primary-400">
                추천 인스턴스 패밀리 (Top 3)
              </strong>
            </div>
            <!-- pie chart -->
            <div
              id="expectedOperationRateChart"
              style="
                  font-size: 24px;
                  letter-spacing: -0.03px;
                  text-align: center;
                  color: #fff;
                  line-height: 130px;
                  height: 180px;
                  width: 480px;
                "
            ></div>
          </div>
        </div>
      </div>

      <div class="box-wrap list2-wrap type2">
        <div class="col">
          <DataLoadingOverlay v-if="loading" :height="195"></DataLoadingOverlay>
          <div v-show="!loading">
            <div class="ti">
              <strong class="text-primary-400">
                {{ $t('advisor.schedulingRecommend.schedulingSummary.recommendScheduleSummary') }}
              </strong>
              <div class="text-gray-500">
                {{ $t('advisor.schedulingRecommend.schedulingSummary.totalRecommendScheduleCount') }}
                : {{ chartDataTotCnt }}
              </div>
            </div>
            <!-- horizontal bar chart -->
            <div v-show="existData" id="estimatedSavingChart" class="chart-wrap scheduling-chart-wrap"></div>
            <NoDataOverlay v-show="!existData" :icon-type="'chart'" :height="171"></NoDataOverlay>
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
import { numberProcess } from '@/pages/Opti/CostOpti/CmmtPsblTgt/CostOptiCommon';
import NoDataOverlay from '@/components/Overlays/NoDataOverlay.vue';

export default {
  components: { NoDataOverlay, DataLoadingOverlay },
  computed: {
    ...mapState('resourceScheduling', {
      schedulingChartData: 'schedulingChartData',
    }),
  },
  watch: {
    '$i18n.locale': ['initChart'],
    schedulingChartData: function () {
      this.loading = true;
      console.log(
        '%c ############################# [ schedulingChartData ] #############################',
        'background:red; color:white'
      );
      console.log('this.schedulingChartData: ' + '\n', this.schedulingChartData);
      this.existData = this.schedulingChartData.length == 0 ? false : true;

      if(this.existData) {
        this.initChart();
      } else {
        this.totalEstimatedSavings = 0;
        this.estimatedSavingsRate = 0;
        this.loading = false;
      }
    },
  },
  data() {
    return {
      loading: true,
      existData: false,
      chartDataTotCnt: 0,
      totalEstimatedSavings: 0, // 월 예상 절감액
      estimatedSavingsRate: 0, // 월 예상 절감률
    };
  },
  methods: {
    initChart() {
      this.calculateTotalEstimatedSavings(); // (좌측) 월 예상 절감액
      this.calculateEstimatedSavingsRate(); // (좌측) 월 예상 절감률
      this.createExpectedOperationRateChart(); // (중앙) Pie Chart: 추천 적용 시 예상 가동 비율
      this.createSummaryScheduling(); // (우측) Horizontal Bar Chart: 추천 스케줄 요약
      this.loading = false;
    },
    // ################ (중앙) Pie Chart: 추천 적용 시 예상 가동 비율 ################
    createExpectedOperationRateChart() {
      am4core.useTheme(am4themes_animated);
      const expectedOperationRateChart = am4core.create('expectedOperationRateChart', am4charts.PieChart);
      expectedOperationRateChart.innerRadius = am4core.percent(35);

      expectedOperationRateChart.data = this.groupAndCalculate2(this.schedulingChartData);

      const pieSeries = expectedOperationRateChart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'totalMnthExpctSaveAmt';
      pieSeries.dataFields.category = 'instsFamNm';
      pieSeries.dataFields.value2 = 'totalMnthExpctSaveRatio';

      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;

      pieSeries.slices.template.tooltipText = '{category}: ₩{value}';
      pieSeries.tooltip.label.fontSize = 10;

      pieSeries.slices.template.adapter.add('fill', function (fill, target) {
        if (target.dataItem.category === 'etc') {
          return am4core.color('#e9ebed');
        }
        return expectedOperationRateChart.colors.getIndex(target.dataItem.index);
      });

      expectedOperationRateChart.legend = new am4charts.Legend();
      expectedOperationRateChart.legend.position = 'right';
      expectedOperationRateChart.legend.scrollable = true;
      expectedOperationRateChart.legend.valign = 'middle';
      expectedOperationRateChart.legend.labels.template.text = '{name}';
      expectedOperationRateChart.legend.labels.template.align = 'left';
      expectedOperationRateChart.legend.labels.template.maxWidth = 150;
      expectedOperationRateChart.legend.labels.template.fontSize = 12;
      expectedOperationRateChart.legend.valueLabels.template.text = '[#808080] ₩{value} ({value2}%)';
      expectedOperationRateChart.legend.valueLabels.template.align = 'right';
      expectedOperationRateChart.legend.valueLabels.template.width = 120;
      expectedOperationRateChart.legend.valueLabels.template.fontSize = 12;
      expectedOperationRateChart.legend.itemContainers.template.paddingBottom = 1;
      expectedOperationRateChart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      expectedOperationRateChart.legend.itemContainers.template.width = 330; // 전체 폭 조정
      expectedOperationRateChart.legend.labels.template.truncate = false;
      expectedOperationRateChart.legend.labels.template.wrap = false;
      expectedOperationRateChart.legend.marginLeft = 50; // 픽셀 단위로 조정

    },
    expectedOperationRateChartData(rate) {
      return [
        {
          category: this.$t('advisor.schedulingRecommend.schedulingSummary.estimatedOperationRateScheduling'),
          expectedOperationRate: rate,
          fill: '#9c64e8',
        },
        {
          category: 'Remaining',
          expectedOperationRate: 100 - rate,
          fill: '#dedede',
        },
      ];
    },

    // ################ (우측) Horizontal Bar Chart: 추천 스케줄 요약 ################
    createSummaryScheduling() {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create('estimatedSavingChart', am4charts.XYChart);

      chart.data = this.groupAndCalculate(this.schedulingChartData);

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

      this.chartDataTotCnt = this.schedulingChartData.length;
      let chartDataTotCnt = this.chartDataTotCnt;
      categoryAxis.renderer.labels.template.adapter.add('text', function (text, target) {
        if (target.dataItem && target.dataItem.dataContext) {
          let targetCnt = target.dataItem.dataContext.count;
          let targetRate = numberProcess((targetCnt / chartDataTotCnt) * 100, 2);
          return `${text} [#808080]${targetCnt}개 (${targetRate}%)[/]`;
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
      series.columns.template.tooltipText = '{categoryY} 절감액: ₩{valueX}';
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
        const key = `${item.recmSchdDateNm}-${item.recmSchdTimeNm}`;
        if (!groupedData[key]) {
          groupedData[key] = {
            count: 0,
            totalSaveAmt: 0,
          };
        }
        groupedData[key].count++;
        groupedData[key].totalSaveAmt += item.mnthExpctSaveAmt;
      });

      // 결과 형식화
      const detailTable = this.$t('advisor.schedulingRecommend.detailTable'); //[recmSchdDateNm]
      // const sortOrder = {
      //   'Weekday Day': 1,
      //   'Weekday Night': 2,
      //   'Weekend Day': 3,
      //   'Weekend Night': 4,
      //   'Everyday Day': 5,
      //   'Everyday Night': 6,
      // };

      const result = Object.entries(groupedData)
        .map(([key, value]) => {
          const [recmSchdDateNm, recmSchdTimeNm] = key.split('-');
          return {
            schedulingNm: detailTable[recmSchdDateNm] + ' ' + detailTable[recmSchdTimeNm],
            count: value.count,
            totalMnthExpctSaveAmt: value.totalSaveAmt,
            // sortKey: `${recmSchdDateNm} ${recmSchdTimeNm}`,
          };
        })
        .sort((a, b) => b.totalMnthExpctSaveAmt - a.totalMnthExpctSaveAmt);
      // .sort((a, b) => sortOrder[a.sortKey] - sortOrder[b.sortKey]);

      return result;
    },
    groupAndCalculate2(data) {
      // 그룹화를 위한 객체 생성
      const groupedData = {};

      // 데이터 그룹화
      data.forEach((item) => {
        const key = item.instsFamNm;
        if (!groupedData[key]) {
          groupedData[key] = {
            totalSaveAmt: 0,
          };
        }
        groupedData[key].totalSaveAmt += item.mnthExpctSaveAmt;
      });

      const result = Object.entries(groupedData)
        .map(([key, value]) => {
          return {
            instsFamNm: key,
            totalMnthExpctSaveAmt: value.totalSaveAmt,
            // sortKey: `${recmSchdDateNm} ${recmSchdTimeNm}`,
          };
        })
        .sort((a, b) => b.totalMnthExpctSaveAmt - a.totalMnthExpctSaveAmt);
      // 비율값 추가
      const total = result.reduce((acc, item) => acc + item.totalMnthExpctSaveAmt, 0);
      result.forEach((item) => {
        item.totalMnthExpctSaveRatio = Math.round((item.totalMnthExpctSaveAmt / total) * 100);
      });
      // Top4 외에는 ETC로 통합
      if (result.length > 3) {
        const top4 = result.slice(0, 3);
        const etc = result.slice(3);
        const etcTotal = etc.reduce((acc, item) => acc + item.totalMnthExpctSaveAmt, 0);
        const etcRatio = Math.round((etcTotal / total) * 100);``
        top4.push({
          instsFamNm: 'etc',
          totalMnthExpctSaveAmt: etcTotal,
          totalMnthExpctSaveRatio: etcRatio,
        });
        return top4;
      }
      return result;
    },

    // 총 월 예상 절감액 계산
    calculateTotalEstimatedSavings() {
      const totalSavings = this.schedulingChartData.reduce((acc, item) => {
        return acc + item.mnthExpctSaveAmt;
      }, 0);

      this.totalEstimatedSavings = Math.floor(totalSavings).toLocaleString();
    },
    // 총 월 예상 절감액 계산(기획 기준 로직)
    // Day 추천: 14시간 가동 기준으로 계산
    // Night 추천: 12시간 가동 기준으로 계산
    // calculateOperationHours(timeString) {
    //   const [startTime, endTime] = timeString.split('~');
    //   const [startHour, startMinute] = startTime.split(':').map(Number);
    //   const [endHour, endMinute] = endTime.split(':').map(Number);
    //
    //   let startMinutes = startHour * 60 + startMinute;
    //   let endMinutes = endHour * 60 + endMinute;
    //
    //   if (endMinutes < startMinutes) {
    //     endMinutes += 24 * 60; // 자정을 넘어가는 경우 처리
    //   }
    //
    //   return (endMinutes - startMinutes) / 60; // 시간 단위로 반환
    // },
    //
    // calculateTotalEstimatedSavings() {
    //   const totalSavings = this.schedulingChartData.reduce((acc, item) => {
    //     const currentOperationHours = this.calculateOperationHours(item.curSchdTimeNm);
    //     let adjustedSavings = item.mnthExpctSaveAmt;
    //
    //     // 현재 운영 시간을 기준으로 24시간 운영 시의 절감액으로 조정
    //     const fullDaySavings = (adjustedSavings / currentOperationHours) * 24;
    //
    //     // 추천 스케줄링에 따라 조정
    //     if (item.recmSchdTimeNm === 'Day') {
    //       adjustedSavings = (fullDaySavings / 24) * 14; // 14시간 기준
    //     } else if (item.recmSchdTimeNm === 'Night') {
    //       adjustedSavings = (fullDaySavings / 24) * 12; // 12시간 기준
    //     } else {
    //       adjustedSavings = fullDaySavings; // 기본값: 24시간
    //     }
    //
    //     return acc + adjustedSavings;
    //   }, 0);
    //
    //   this.totalEstimatedSavings = Math.floor(totalSavings).toLocaleString();
    // },

    // 월 예상 절감률
    calculateEstimatedSavingsRate() {
      const totMnthUseAmt = this.schedulingChartData.reduce((acc, item) => acc + item.mnthUseAmt, 0);
      const totMnthExpctUseAmt = this.schedulingChartData.reduce((acc, item) => acc + item.mnthExpctUseAmt, 0);

      if (totMnthUseAmt == 0) {
        this.estimatedSavingsRate = 0;
      } else {
        let estimatedSavingsRate = (100 * (totMnthUseAmt - totMnthExpctUseAmt)) / totMnthUseAmt;
        this.estimatedSavingsRate = Math.round(estimatedSavingsRate * 100) / 100; // 소수점 두 자리까지 반올림
      }
    },
  },
};
</script>

<style>
#schedulingEstimatedSavings .scheduling-grid2-wrap {
  height: 245px;
}

#schedulingEstimatedSavings .scheduling-chart-wrap {
  height: 180px;
  top: 26px;
  width: 100%;
}
</style>
