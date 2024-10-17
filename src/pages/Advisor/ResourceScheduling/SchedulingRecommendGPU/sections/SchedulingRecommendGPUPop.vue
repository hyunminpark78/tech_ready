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
          <h3 class="mr-3 font-bold">주간 사용률</h3>
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
          <h3 class="mr-3 font-bold">CPU 사용률 요약</h3>
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
      let value1 = [4.71, 1.08, 1.01, 1.10, 1.12, 1.04, 4.37, 0.98, 0.98, 1.04, 2.72, 1.02, 1.04, 1.10, 1.04, 0.97, 1.00, 1.02, 1.00, 0.98, 0.98, 1.04, 1.00, 1.05, 4.71, 0.98, 1.06, 1.09, 1.09, 1.24, 4.42, 1.04, 1.06, 0.98, 2.53, 1.03, 1.12, 1.03, 0.98, 0.98, 1.02, 0.98, 1.03, 1.02, 0.98, 1.03, 1.34, 1.03, 4.72, 1.03, 1.03, 1.10, 1.13, 1.03, 2.96, 1.06, 0.98, 1.03, 2.44, 1.09, 0.98, 1.07, 0.99, 0.98, 1.01, 0.98, 1.05, 0.98, 1.35, 1.04, 1.02, 1.03, 4.68, 0.98, 0.98, 1.06, 1.12, 1.22, 4.56, 1.06, 0.98, 1.04, 2.56, 1.03, 1.04, 0.98, 1.04, 0.98, 1.03, 1.04, 1.01, 1.03, 1.04, 1.29, 1.03, 1.06, 4.67, 1.04, 1.01, 1.09, 1.10, 1.04, 4.42, 1.04, 1.09, 1.03, 2.74, 0.98, 0.98, 1.04, 1.03, 1.05, 1.04, 0.98, 1.09, 0.98, 0.98, 1.04, 0.99, 1.04, 4.66, 1.08, 2.68, 1.37, 1.08, 1.23, 4.38, 1.13, 0.99, 1.06, 2.56, 1.04, 1.01, 0.98, 1.06, 1.05, 1.03, 0.98, 0.98, 0.98, 1.06, 1.04, 0.98, 1.33, 4.65, 1.03, 0.98, 1.08, 1.11, 1.08, 3.18, 1.04, 1.04, 1.00, 2.14, 1.06, 0.98, 1.03, 0.98, 1.04, 1.08, 0.98, 1.04, 1.03, 0.98, 0.98, 1.05, 1.06];
      let value2 = [4.61, 1.02, 0.98, 1.10, 1.36, 1.23, 2.91, 0.99, 1.09, 1.04, 2.83, 0.98, 1.03, 1.04, 0.99, 0.98, 1.01, 1.06, 1.05, 1.03, 0.98, 1.10, 0.99, 1.03, 4.70, 1.05, 0.98, 1.08, 1.15, 1.08, 4.36, 1.05, 1.04, 1.03, 2.55, 0.98, 1.04, 1.00, 1.35, 0.98, 1.01, 1.05, 1.03, 1.04, 1.11, 1.03, 1.06, 1.04, 4.65, 0.98, 1.03, 3.54, 1.14, 1.23, 4.48, 0.98, 0.99, 0.98, 2.59, 1.05, 0.98, 1.07, 0.99, 0.98, 1.06, 1.05, 1.04, 1.11, 8.22, 1.05, 0.98, 10.23, 4.63, 5.05, 1.10, 1.09, 1.09, 1.03, 4.64, 1.04, 0.98, 1.05, 2.47, 0.98, 1.04, 0.98, 0.98, 1.03, 1.00, 1.12, 1.05, 1.03, 0.97, 1.03, 1.04, 1.06, 4.70, 0.98, 1.39, 1.08, 1.11, 1.22, 2.86, 0.98, 1.05, 0.99, 2.48, 1.02, 0.98, 1.06, 1.04, 0.97, 1.10, 0.98, 0.98, 1.03, 0.98, 1.07, 1.04, 3.28, 4.74, 0.98, 1.04, 1.06, 1.09, 0.98, 4.38, 1.05, 0.98, 1.05, 2.46, 0.98, 1.05, 0.98, 1.08, 1.10, 1.04, 0.98, 0.98, 1.00, 1.04, 0.98, 1.04, 0.98, 4.71, 1.04, 1.03, 1.08, 1.34, 1.23, 4.34, 0.98, 1.04, 0.97, 2.46, 0.97, 0.98, 1.03, 1.10, 1.04, 1.34, 1.04, 0.97, 0.97, 1.00, 0.99, 1.09, 1.05];
      let value3 = [4.66, 0.99, 1.03, 1.08, 1.16, 0.99, 4.38, 0.98, 1.10, 1.03, 2.92, 0.98, 0.99, 1.05, 0.99, 1.03, 1.12, 0.98, 0.99, 1.04, 1.04, 1.03, 4.63, 1.08, 1.06, 1.10, 1.15, 1.25, 4.43, 1.07, 1.07, 1.04, 2.66, 0.98, 0.99, 1.35, 1.05, 0.99, 1.02, 1.05, 1.05, 1.03, 1.04, 0.99, 1.04, 1.05, 4.64, 1.03, 0.99, 1.09, 1.13, 0.99, 4.40, 0.98, 0.99, 0.99, 2.58, 1.05, 0.99, 1.05, 1.04, 0.99, 1.03, 1.33, 0.99, 1.05, 0.99, 1.06, 1.03, 1.04, 4.60, 1.06, 1.01, 1.09, 1.11, 1.24, 4.39, 1.00, 0.99, 1.36, 2.55, 0.98, 1.05, 1.06, 1.04, 1.00, 1.08, 1.05, 1.03, 1.04, 1.04, 1.05, 1.02, 0.99, 4.66, 1.11, 1.04, 1.10, 1.10, 1.05, 2.83, 1.03, 1.33, 1.06, 2.54, 0.99, 1.03, 1.06, 0.99, 0.99, 1.07, 1.03, 0.99, 2.88, 1.07, 0.99, 1.04, 0.99, 4.64, 1.06, 1.04, 1.10, 1.13, 1.25, 4.36, 1.05, 1.06, 1.06, 2.58, 0.99, 0.99, 1.05, 1.06, 1.00, 1.05, 1.34, 0.99, 0.99, 1.05, 0.99, 1.07, 1.13, 4.65, 0.99, 1.01, 1.09, 1.10, 0.98, 4.37, 0.99, 1.07, 0.99, 2.58, 1.04, 1.00, 1.08, 1.07, 1.33, 1.01, 0.98, 1.05, 0.98, 0.98, 1.04, 1.05, 0.98];
      let value4 = [3.11, 1.02, 1.00, 1.10, 1.12, 1.25, 4.38, 1.01, 1.00, 1.40, 2.45, 1.06, 1.00, 1.06, 1.12, 1.04, 1.06, 1.00, 1.05, 1.01, 1.01, 1.08, 1.14, 1.05, 3.17, 1.35, 3.36, 1.11, 1.12, 1.08, 2.86, 1.06, 1.05, 1.07, 2.36, 1.00, 1.00, 1.12, 1.06, 1.00, 1.05, 1.01, 1.08, 1.00, 1.01, 1.01, 1.06, 1.08, 3.13, 1.00, 1.00, 1.11, 1.16, 1.24, 4.24, 1.00, 1.10, 1.01, 2.26, 1.06, 1.35, 1.08, 1.01, 0.99, 1.07, 0.99, 1.07, 1.00, 1.06, 1.00, 1.01, 1.08, 3.17, 0.99, 1.04, 7.15, 6.99, 0.99, 4.38, 1.06, 1.04, 1.04, 2.59, 1.08, 0.98, 1.04, 0.99, 1.03, 1.07, 1.05, 1.08, 0.99, 1.04, 1.34, 1.04, 1.05, 4.67, 1.05, 1.06, 1.10, 1.10, 1.26, 2.62, 0.98, 1.05, 1.10, 2.60, 1.05, 1.03, 0.98, 1.03, 1.07, 1.02, 1.34, 0.99, 1.06, 0.99, 0.99, 1.05, 1.01, 4.63, 3.06, 0.98, 1.06, 1.10, 1.06, 4.36, 0.98, 1.10, 0.99, 2.60, 1.04, 0.99, 1.07, 1.04, 0.98, 1.05, 0.99, 0.98, 1.04, 0.99, 1.33, 1.03, 1.02, 4.60, 1.06, 1.04, 1.08, 1.12, 1.25, 2.67, 1.10, 1.05, 0.98, 2.69, 0.98, 1.01, 0.98, 1.05, 1.02, 1.02, 1.04, 1.05, 0.98, 1.00, 1.06, 1.06, 1.00];
      let value5 = [4.272500, 1.027500, 1.005000, 1.095000, 1.190000, 1.127500, 4.010000, 0.990000, 1.042500, 1.127500, 2.730000, 1.010000, 1.015000, 1.062500, 1.035000, 1.005000, 1.047500, 1.026667, 1.033333, 1.000000, 0.990000, 1.065000, 1.042500, 1.040000, 4.302500, 1.115000, 1.615000, 1.095000, 1.127500, 1.162500, 4.017500, 1.055000, 1.055000, 1.030000, 2.525000, 0.997500, 1.037500, 1.125000, 1.110000, 0.987500, 1.025000, 1.022500, 1.047500, 1.022500, 1.035000, 1.015000, 1.125000, 1.050000, 4.285000, 1.010000, 1.012500, 1.710000, 1.140000, 1.122500, 4.020000, 1.005000, 1.015000, 1.002500, 2.467500, 1.062500, 1.075000, 1.067500, 1.007500, 0.985000, 1.042500, 1.087500, 1.037500, 1.035000, 2.905000, 1.037500, 1.010000, 3.345000, 4.270000, 2.020000, 1.032500, 2.597500, 2.577500, 1.120000, 4.492500, 1.040000, 0.997500, 1.122500, 2.542500, 1.017500, 1.027500, 1.015000, 1.012500, 1.010000, 1.045000, 1.065000, 1.042500, 1.022500, 1.022500, 1.177500, 1.032500, 1.040000, 4.675000, 1.045000, 1.125000, 1.092500, 1.102500, 1.142500, 3.182500, 1.007500, 1.130000, 1.045000, 2.590000, 1.010000, 1.005000, 1.035000, 1.022500, 1.020000, 1.057500, 1.082500, 1.012500, 1.487500, 1.005000, 1.022500, 1.030000, 1.580000, 4.667500, 1.545000, 1.435000, 1.147500, 1.100000, 1.130000, 4.370000, 1.052500, 1.032500, 1.040000, 2.550000, 1.012500, 1.010000, 1.020000, 1.060000, 1.032500, 1.042500, 1.072500, 0.982500, 1.002500, 1.035000, 1.085000, 1.030000, 1.115000, 4.652500, 1.030000, 1.015000, 1.082500, 1.167500, 1.135000, 3.640000, 1.027500, 1.050000, 0.985000, 2.467500, 1.012500, 0.992500, 1.030000, 1.050000, 1.110000, 1.102000, 1.010000, 1.038000, 1.012000, 0.990000, 1.017500, 1.062500, 1.022500];


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
