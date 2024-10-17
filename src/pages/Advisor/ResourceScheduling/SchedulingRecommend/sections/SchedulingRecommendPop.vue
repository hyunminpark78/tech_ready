<template>
  <div v-show="visible" class="notify-pop">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <section class="flex-col z-30 p-8 rounded policy-content" style="width: fit-content; height: 80%; overflow-y: auto">
      <!-- Popup Header -->
      <div>
        <h2 class="mb-4 text-2xl text-primary-400 relative">
          스케줄 상세
          <span class="header__infotxt ml__20">분석기간 : 2024-08-12 00:00 ~ 2024-09-08 23:59</span>
        </h2>
      </div>
      <!--// Popup Header -->

      <!--// Content Header  -->
      <div class="inner__wrap">
        <div class="flex items-center">
          <h3 class="mr-3 font-bold">주간 CPU 사용률</h3>
        </div>

        <div class="header__infotxt ml__20">
          스케쥴 대상 인스턴스의 CPU 사용률 그래프입니다. 분석시간 동안의 CPU 사용 패턴을 주간으로 비교하여 확인 할 수
          있습니다. 4주간 평균 사용율이 0%인 부분은 인스턴스 미사용 구간으로 표시합니다.
        </div>

        <!--그래프 이미지  -->
        <div class="chart_box" style="">
          <div style="overflow: hidden !important; height: 200px">
            <div id="lineChart" ref="lineChart" style="width: 100%; height: 100%">
              <!--              <img :src="useRateUrl" />-->
            </div>
          </div>
        </div>

        <br /><br />
        <div class="flex items-center">
          <h3 class="mr-3 font-bold">사용률 요약</h3>
        </div>
        <div class="header__infotxt ml__20">분석기간 동안의 주간 CPU 사용률 평균값의 그래프 입니다.</div>

        <!-- 사용률 요약 그래프 -->
        <div class="chart_box" style="">
          <div style="overflow: hidden !important; height: 200px">
            <div id="lineChart2" ref="lineChart2" style="width: 100%; height: 100%">
              <!--              <img :src="useRateGpuUrl" />-->
            </div>
          </div>
        </div>
        <br />
        <!-- Bottom Button -->
        <div class="text-center">
          <button
            class="inline-block px-6 h-32 text-sm text-white border rounded-sm bg-primary-400 border-primary-400 font-bold ml-1.5 w-1/5"
            type="button"
            @click="closePopup()"
          >
            닫기
          </button>
        </div>
        <!--// Bottom Button -->
      </div>
    </section>
  </div>
  <!-- 알림 -->
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
// 애니메이션 테마 적용
am4core.useTheme(am4themes_animated);
am4core.addLicense('CH303240742');

export default {
  name: 'SchedulingRecommendPop',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      useRateUrl: '../../assets/images/cpu_use_rate_sample.png',
      useRateGpuUrl: '../../assets/images/cpu_use_rate_sumry_sample.png',
      chart: {},
      chart2: {},
    };
  },
  mounted() {
    this.creatChart();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
    if (this.chart2) {
      this.chart2.dispose();
    }
  },
  methods: {
    closePopup() {
      this.$emit('close');
    },
    creatChart() {
      // 애니메이션 테마 적용
      am4core.useTheme(am4themes_animated);

      // 차트 생성
      // let chart = am4core.create("lineChart", am4charts.XYChart);
      let chart = am4core.create(this.$refs.lineChart, am4charts.XYChart);
      let chart2 = am4core.create(this.$refs.lineChart2, am4charts.XYChart);

      // 데이터 100건 생성 (1시간 간격)
      let data = [];
      let data2 = [];
      let value1 = [0.36,0.36,0.37,0.36,0.44,0.43,0.39,1.95,0.42,0.39,0.55,0.93,0.95,0.83,0.83,4.62,4.56,4.37,0.6,0.6,0.6,0.49,0.44,0.45,0.42,0.4,0.41,0.42,0.44,0.48,2.6,0.61,0.84,4.61,1.27,10.78,4.87,1.14,1.12,8.75,0.74,0.58,0.58,0.58,0.58,0.58,0.57,0.6,0.56,0.55,0.51,0.56,0.47,0.51,0.83,1.02,1.31,1.11,0.92,15.9,0.91,10.53,16.66,4.92,7.26,8,0.88,0.52,2.79,0.42,0.42,0.41,0.4,0.45,0.46,0.5,0.57,0.46,0.74,0.8,7.47,7.65,0.53,8.71,8.88,1.38,7.73,0.67,0.57,0.57,0.42,0.42,0.44,0.42,0.45,2.5,0.41,0.42,0.42,0.42,0.48,0.43,0.67,0.42,0.42,2.3,0.44,0.47,3.21,0.42,0.42,0.45,0.42,0.52,0.44,0.41,0.41,0.41,0.41,0.45,0.4,0.5,0.47,0.48,0.41,0.46,0.5,0.41,0.43,0.42,0.42,0.42,0.83,0.37,0.37,0.38,2.05,0.37,0.49,0.41,0.38,0.39,0.37,0.36,0.36,0.4,0.36,0.36,0.37,0.43,0.38,0.37,0.41,2.07,0.38,0.37,0.78,0.41,0.41,0.38,0.37,0.37,0.37,0.37,0.37,0.42,0.48,0.36];
      let value2 = [0.34,0.38,0.34,0.35,0.35,0.39,0.49,0.61,11.26,0.5,0.74,7.83,0.88,0.61,0.55,6.21,0.46,0.45,0.45,0.44,0.44,0.44,2.15,0.46,0.51,0.45,0.46,0.45,0.45,0.44,0.54,0.95,2.19,7.87,0.72,0.88,9.14,0.99,0.94,9.07,0.68,0.53,6.82,0.71,0.45,0.45,0.45,0.58,0.44,0.45,0.4,0.37,0.38,0.38,1.91,2.57,3.94,10.45,0.75,16.53,4.16,0.8,10.99,16.37,16.46,0.57,0.52,0.57,0.57,0.58,0.57,0.51,0.48,0.54,0.48,0.55,0.48,0.53,0.57,0.48,6.85,1.01,5.41,0.9,3.36,0.72,0.6,0.82,0.86,2.25,0.69,0.61,0.61,0.6,0.58,0.53,0.63,0.58,0.56,0.57,0.54,0.54,0.64,0.65,0.67,1.86,10.66,0.98,4.11,3.48,0.72,0.53,0.5,0.49,0.59,0.49,0.48,0.51,0.46,0.5,0.46,0.46,0.47,0.46,0.49,0.47,0.67,0.48,0.48,1.94,0.48,0.43,0.75,0.43,0.33,0.37,0.36,0.33,0.33,0.32,0.33,0.33,0.32,0.37,0.33,0.36,0.33,0.32,0.33,0.35,0.46,1.93,0.34,0.35,0.35,0.35,0.77,0.39,0.36,0.41,0.38,0.38,0.35,0.4,0.36,0.35,0.35,0.34];
      let value3 = [0.34,0.36,0.35,0.36,0.4,0.36,0.55,0.36,0.49,1.21,1.94,0.67,5.1,0.66,8.45,0.56,0.52,0.49,0.59,0.56,0.48,0.48,0.48,0.48,0.48,0.48,0.47,0.53,0.52,0.64,0.99,0.8,10.44,0.74,11.65,7,2.62,1.15,0.77,0.77,0.83,0.78,0.78,0.78,0.69,0.71,0.68,0.61,0.54,0.58,0.55,0.54,0.56,3.55,2.14,2.41,3.11,7.74,3.38,6.43,1.02,1.17,2.85,0.6,0.6,0.97,0.59,0.47,0.46,0.6,0.54,0.55,0.55,0.5,0.55,0.51,0.66,1.33,16.64,17.1,16.76,6.06,8.54,0.87,0.96,0.71,0.61,0.59,0.48,0.6,0.55,0.61,0.68,2.75,0.61,0.61,0.61,0.61,0.61,0.6,0.67,9.72,9.74,0.83,0.71,2.62,13.15,13.96,3.93,0.68,0.62,0.76,0.66,0.64,0.63,0.63,0.74,0.63,0.63,0.63,0.62,0.61,0.63,0.61,0.69,0.61,0.58,0.55,0.56,0.5,0.89,0.5,0.5,0.46,1.95,0.46,0.35,0.36,0.4,0.36,0.36,0.51,0.36,0.36,0.43,0.36,0.36,0.4,0.52,0.36,0.36,0.4,0.35,0.35,0.72,0.39,0.47,0.39,0.51,0.35,0.35,1.84,0.37,0.35,0.43,0.35];
      let value4 = [0.45,0.43,0.43,0.44,0.46,0.44,0.52,1.84,0.55,0.39,0.39,1.03,1.05,16.57,0.72,10.98,0.46,0.39,0.39,0.39,0.41,0.43,0.43,0.38,0.4,0.38,0.38,0.4,0.43,0.39,0.41,0.57,0.68,0.8,0.78,1.38,1.34,1.26,1.89,1.86,1.15,0.7,0.77,0.73,0.68,2.9,0.68,0.67,1.04,0.71,0.71,0.71,0.73,0.68,0.72,2.21,1.3,9.19,0.99,15.95,6.33,15.7,10.59,10.01,5.74,0.63,0.63,0.72,0.63,0.69,0.7,0.62,0.62,0.64,0.62,0.61,0.62,0.62,2.46,0.52,0.51,0.51,0.51,0.58,4.31,0.51,0.41,0.45,0.41,0.42,0.4,0.41,0.43,0.38,0.38,0.3,0.3,0.3,0.34,0.3,0.38,0.3,0.59,14.16,10.44,8.32,7.52,0.83,5.35,0.68,5.44,9.4,0.74,0.7,0.77,0.7,0.71,0.7,0.71,0.68,0.72,0.68,0.69,0.73,0.7,0.72,0.75,2.06,0.73,0.7,0.71,0.77,0.96,0.64,0.64,0.63,0.64,0.63,0.63,0.7,0.62,0.62,0.54,0.53,0.53,0.61,0.53,0.74,0.75,0.53,0.6,0.44,0.48,0.43,0.43,0.43,0.78,0.43,0.47,0.43,0.43,0.43,0.44,0.44,0.43,0.48,1.81,0.43];
      let value5 = [0.3725,0.3825,0.3725,0.3775,0.4125,0.405,0.4875,1.19,3.18,0.6225,0.905,2.615,1.995,4.6675,2.6375,5.5925,1.5,1.425,0.5075,0.4975,0.4825,0.46,0.875,0.4425,0.4525,0.4275,0.43,0.4233333333,0.44,0.46,1.0175,0.6925,1.175,3.52,3.3025,3.445,6.75,2.5975,1.6425,5.2075,0.835,0.645,2.25,0.7,0.6225,1.1775,0.5975,0.64,0.68,0.58,0.54,0.555,0.5325,0.5275,1.005,2.3375,2.1725,5.79,1.4425,14.03,3.695,8.365,9.815,8.1175,8.0775,2.45,0.6575,0.695,1.145,0.54,0.5375,0.535,0.51,0.545,0.5275,0.54,0.555,0.53,1.1075,0.7825,7.8675,6.5675,5.8025,4.0625,6.2725,0.87,2.425,0.6625,0.6125,0.9575,0.4975,0.51,0.5075,0.5025,0.5225,1.52,0.4875,0.4775,0.4825,0.475,0.5025,0.4675,0.6425,6.2375,5.3175,3.3275,4.8325,1.225,6.455,4.635,2.6275,2.765,0.57,0.6175,0.615,0.56,0.5575,0.5625,0.58,0.565,0.5525,0.5675,0.5625,0.57,0.5575,0.565,0.6525,0.89,0.555,0.9025,0.5425,0.53,0.8575,0.485,0.46,0.46,1.25,0.4475,0.45,0.4475,0.4325,0.425,0.3975,0.4425,0.395,0.4325,0.4125,0.445,0.4525,0.4275,0.49,0.775,0.3975,0.8125,0.3775,0.375,0.7625,0.405,0.4275,0.4025,0.4225,0.3825,0.3775,0.7625,0.3825,0.4,0.7675,0.37];


      let firstDate = new Date(2024, 8, 30, 0); // 시작 날짜
      for (let i = 0; i < 168; i++) {
        let newDate = new Date(firstDate);
        newDate.setHours(firstDate.getHours() + i); // 1시간씩 추가
        // let a = Math.random() * 80;
        // let b = Math.random() * 60;
        // let c = Math.random() * 40;
        // let d = Math.random() * 50;
        data.push({
          date: newDate,
          value1: value1[i], // 0~100 사이 랜덤 값
          value2: value2[i],
          value3: value3[i],
          value4: value4[i],
        });
        // let avg = (a + b + c + d) / 4;
        // if (i % 24 === 0) {
        data2.push({
          date: newDate,
          value1: value5[i],
        });
        // }
      }

      chart.data = data;
      chart2.data = data2;

      // X축 생성 (요일과 시간 단위로 설정)
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.baseInterval = { timeUnit: 'hour', count: 1 }; // 1시간 간격
      dateAxis.dateFormats.setKey('hour', 'EEE HH:mm'); // 요일과 시간 표시 (월, 화 등)
      dateAxis.periodChangeDateFormats.setKey('hour', 'EEE HH:mm');
      dateAxis.renderer.labels.template.fontSize = 11; // X축 폰트 크기 설정
      dateAxis.tooltip.fontSize = 10; // X축 툴팁 폰트 크기 설정
      dateAxis.renderer.minGridDistance = 60;

      // X축 생성 (요일과 시간 단위로 설정)
      let dateAxis2 = chart2.xAxes.push(new am4charts.DateAxis());
      dateAxis2.baseInterval = { timeUnit: 'hour', count: 1 }; // 1시간 간격
      dateAxis2.dateFormats.setKey('hour', 'EEE HH:mm'); // 요일과 시간 표시 (월, 화 등)
      dateAxis2.periodChangeDateFormats.setKey('hour', 'EEE HH:mm');
      dateAxis2.renderer.labels.template.fontSize = 11; // X축 폰트 크기 설정
      dateAxis2.tooltip.fontSize = 10; // X축 툴팁 폰트 크기 설정
      dateAxis2.renderer.minGridDistance = 60;

      dateAxis.renderer.labels.template.adapter.add("text", function(text, target) {
        let dataItem = target.dataItem;
        if (dataItem) {
          let date = dataItem.dates.date;
          let dateFormatter = new am4core.DateFormatter();
          // 날짜를 원하는 형식으로 포맷된 날짜를 반환하여 라벨에 적용
          return dateFormatter.format(date, "EEE");
        }
      });
      dateAxis2.renderer.labels.template.adapter.add("text", function(text, target) {
        let dataItem = target.dataItem;
        if (dataItem) {
          let date = dataItem.dates.date;
          let dateFormatter = new am4core.DateFormatter();
          // 날짜를 원하는 형식으로 포맷된 날짜를 반환하여 라벨에 적용
          return dateFormatter.format(date, "EEE");
        }
      });


      // Y축 생성 (값 축)
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.labels.template.fontSize = 11; // Y축 폰트 크기 설정
      valueAxis.renderer.labels.template.adapter.add('text', function (text) {
        return text + '(%)';
      });
      let valueAxis2 = chart2.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.renderer.labels.template.fontSize = 11; // Y축 폰트 크기 설정
      valueAxis2.renderer.labels.template.adapter.add('text', function (text) {
        return text + '(%)';
      });

      // Y축 최대값을 100으로 설정
      // valueAxis.max = 100;
      // valueAxis2.max = 100;

      // 첫 번째 시리즈 생성
      let series1 = chart.series.push(new am4charts.LineSeries());
      series1.dataFields.valueY = 'value1';
      series1.dataFields.dateX = 'date';
      series1.tooltipText = '2024-08-12~2024-08-18: {valueY}';
      series1.strokeWidth = 2;
      series1.name = '2024-08-12~2024-08-18'; // 시리즈 이름 설정
      series1.stroke = am4core.color('#95E0FE'); // 시리즈 색상 (빨강)
      series1.tooltip.fontSize = 11; // 툴팁 폰트 크기 설정

      // 두 번째 시리즈 생성
      let series2 = chart.series.push(new am4charts.LineSeries());
      series2.dataFields.valueY = 'value2';
      series2.dataFields.dateX = 'date';
      series2.tooltipText = '2024-08-19~2024-08-25: {valueY}';
      series2.strokeWidth = 2;
      series2.name = '2024-08-19~2024-08-25'; // 시리즈 이름 설정
      series2.stroke = am4core.color('#8CF1DD'); // 시리즈 색상 (파랑)
      series2.tooltip.fontSize = 11; // 툴팁 폰트 크기 설정

      // 세 번째 시리즈 생성
      let series3 = chart.series.push(new am4charts.LineSeries());
      series3.dataFields.valueY = 'value3';
      series3.dataFields.dateX = 'date';
      series3.tooltipText = '2024-08-26~2024-09-01: {valueY}';
      series3.strokeWidth = 2;
      series3.name = '2024-08-26~2024-09-01'; // 시리즈 이름 설정
      series3.stroke = am4core.color('#FDACD0'); // 시리즈 색상 (초록)
      series3.tooltip.fontSize = 11; // 툴팁 폰트 크기 설정

      // 네 번째 시리즈 생성
      let series4 = chart.series.push(new am4charts.LineSeries());
      series4.dataFields.valueY = 'value4';
      series4.dataFields.dateX = 'date';
      series4.tooltipText = '2024-09-02~2024-09-08: {valueY}';
      series4.strokeWidth = 2;
      series4.name = '2024-09-02~2024-09-08'; // 시리즈 이름 설정
      series4.stroke = am4core.color('#D0B2F8'); // 시리즈 색상 (초록)
      series4.tooltip.fontSize = 11; // 툴팁 폰트 크기 설정

      // 아래차트 시리즈 생성
      let series5 = chart2.series.push(new am4charts.LineSeries());
      series5.dataFields.valueY = 'value1';
      series5.dataFields.dateX = 'date';
      series5.tooltipText = '주간 CPU 사용률 평균: {valueY}';
      series5.strokeWidth = 2;
      series5.name = '주간 CPU 사용률 평균'; // 시리즈 이름 설정
      series5.stroke = am4core.color('#808080'); // 시리즈 색상 (초록)
      series5.tooltip.fontSize = 11; // 툴팁 폰트 크기 설정

      // 차트 커서 추가 (마우스 오버 시 상호작용)
      chart.cursor = new am4charts.XYCursor();
      chart2.cursor = new am4charts.XYCursor();

      // 범례 추가 (시리즈 구분을 위한 범례)
      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 11; // 범례 폰트 크기 설정
      chart.legend.itemContainers.template.height = 15; // 범례 항목 높이 축소
      chart.legend.itemContainers.template.dy = -10; // 항목 사이의 간격 축소
      chart.legend.marginTop = 5; // 차트와 범례 사이의 여백 축소

      // 범례 추가 (시리즈 구분을 위한 범례)
      chart2.legend = new am4charts.Legend();
      chart2.legend.fontSize = 11; // 범례 폰트 크기 설정
      chart2.legend.itemContainers.template.height = 15; // 범례 항목 높이 축소
      chart2.legend.itemContainers.template.dy = -10; // 항목 사이의 간격 축소
      chart2.legend.marginTop = 5; // 차트와 범례 사이의 여백 축소

      // 메모리 누수 방지를 위한 언마운트 시 차트 해제
      this.chart = chart;
      this.chart2 = chart2;
    },
  },
};
</script>

<style>
.notify-pop .total-dashboard .ag-grid-font {
  font-style: normal;
  font-size: 13px;
  line-height: 70px;
  color: #515151;
  width: 120px;
  line-height: 2 !important;
  padding: 10px 0 !important;
  word-break: break-all !important;
}
.notify-pop .total-dashboard .ag-header {
  width: calc(100% - 12px) !important;
}
.notify-pop .total-dashboard .ag-body-viewport {
  max-height: 420px;
  box-shadow: 0 0 0 0 rgba(0, 165, 237, 0.22);
  overflow-y: auto;
}
.notify-pop .ag-body-horizontal-scroll-viewport {
  overflow-x: hidden;
}
</style>
