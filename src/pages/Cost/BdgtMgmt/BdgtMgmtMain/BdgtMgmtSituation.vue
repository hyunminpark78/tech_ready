<template>
  <div class="el_box box-wrap">
    <div class="el_box_title">
      예산현황
      <div class="popup_info" @click="popup_info_open">
        !
        <div class="popup_info_detail">
          <b>예산 현황</b>
          <div class="popup_info_detail_x" @click="popup_info_close">x</div>
          예산 현황은 로딩 시 대표 예산 또는 목록 중 선택한 예산들을 기준으로 제공됩니다.<br />
          목록 중 선택한 예산들을 동일한 주기로 환산 후 합산하여 제공합니다.<br />
          각 항목별 활용 데이터 기간은 툴팁으로 제공됩니다. <br />
          목록 중 예산들을 선택 후 대표예산 지정을 클릭하여 대표 예산으로 등록/변경 할 수 있습니다.
        </div>
      </div>
    </div>
    <div class="el_box_select_cell_wrap">
      <div class="el_box_select_cell">
        <h5>연간예산</h5>
        <div id="annualBudgetChart"></div>
      </div>
      <div class="el_box_select_cell high">
        <h5>월간예산</h5>
        <div id="monthlyBudgetChart"></div>
      </div>
      <div class="el_box_select_cell">
        <h5>일간예산</h5>
        <div id="dailyBudgetChart"></div>
      </div>
      <div class="el_box_select_cell">
        <h5>알림</h5>
        <div class="ari">
          <div>
            <div class="al_cell_top">
              등록된 알림 수: <b>15<em>개</em></b>
            </div>
            <div class="al_cell_top">
              임계초과 수:
              <b>
                <span @click="popup_info_open">
                  4
                  <div class="popup_info_detail">
                    <b>임계 초과</b>
                    <div class="popup_info_detail_x" @click="popup_info_close">x</div>
                    <div class="ovf_table" style="height: 100%; width: 100%">
                      <ag-grid-vue
                        id="bdgtAlarmGrid"
                        :style="{ width: '100%', height }"
                        class="ag-theme-alpine"
                        :row-data="rowData"
                        :column-defs="columnDefs"
                        :suppress-context-menu="true"
                        :pagination="true"
                        :suppress-pagination-panel="true"
                        :suppress-scroll-on-new-data="true"
                        @grid-ready="onGridReady"
                      ></ag-grid-vue>
                      <GridPagenate
                        :total-cnt="pageObj.totalCnt"
                        :total-page-cnt="5"
                        :page-no="pageObj.currentPageNo"
                        :page-size="1"
                        @onBtnNext="onBtnNext"
                        @onBtPrevious="onBtPrevious"
                        @clickPage="clickPage"
                      />
                    </div>
                    <!--                    <div class="ovf_table">-->
                    <!--                      <table>-->
                    <!--                        <thead>-->
                    <!--                          <tr>-->
                    <!--                            <th>예산명</th>-->
                    <!--                            <th>알림 내용</th>-->
                    <!--                            <th>알림 발생일</th>-->
                    <!--                          </tr>-->
                    <!--                        </thead>-->
                    <!--                        <tbody>-->
                    <!--                          <tr>-->
                    <!--                            <td>Default Budget</td>-->
                    <!--                            <td>-->
                    <!--                              <span class="b">예측 비용</span>이 예산의 <span class="r">100%</span> (약 ₩150,042,513)을-->
                    <!--                              초과하였습니다.-->
                    <!--                            </td>-->
                    <!--                            <td>2024.09.07 15:30</td>-->
                    <!--                          </tr>-->
                    <!--                          <tr>-->
                    <!--                            <td>AI 예산</td>-->
                    <!--                            <td>-->
                    <!--                              <span class="b">예측 비용</span>이 예산의 <span class="r">100%</span> (약 ₩150,863,232)을-->
                    <!--                              초과하였습니다.-->
                    <!--                            </td>-->
                    <!--                            <td>2024.09.07 15:30</td>-->
                    <!--                          </tr>-->
                    <!--                          <tr>-->
                    <!--                            <td>Cloud Infra 전체_월별예산</td>-->
                    <!--                            <td>-->
                    <!--                              <span class="b">예측 비용</span>이 예산의 <span class="r">100%</span> (약 ₩242,728,025)을-->
                    <!--                              초과하였습니다.-->
                    <!--                            </td>-->
                    <!--                            <td>2024.09.07 15:30</td>-->
                    <!--                          </tr>-->
                    <!--                          <tr>-->
                    <!--                            <td>월별 예산</td>-->
                    <!--                            <td>-->
                    <!--                              <span class="b">실제 비용</span>이 예산의 <span class="r">₩200,000,000</span> (약 92%)을-->
                    <!--                              초과하였습니다.-->
                    <!--                            </td>-->
                    <!--                            <td>2024.09.25 14:54</td>-->
                    <!--                          </tr>-->
                    <!--                        </tbody>-->
                    <!--                      </table>-->
                    <!--                    </div>-->
                    <!--                    <div class="flex items-center justify-center my-7 pagination">-->
                    <!--                      <button style="visibility: hidden">-->
                    <!--                        <img src="@/assets/images/btn-first.svg" alt="처음 페이지" />-->
                    <!--                      </button>-->
                    <!--                      <button style="visibility: hidden">-->
                    <!--                        <img src="@/assets/images/btn-pre.svg" alt="이전 페이지" />-->
                    <!--                      </button>-->
                    <!--                      <button-->
                    <!--                        class="-->
                    <!--                          flex-->
                    <!--                          items-center-->
                    <!--                          justify-center-->
                    <!--                          border-->
                    <!--                          rounded-sm-->
                    <!--                          w-9-->
                    <!--                          h-9-->
                    <!--                          text-xs- text-white-->
                    <!--                          border-primary-400-->
                    <!--                          bg-primary-400-->
                    <!--                        "-->
                    <!--                      >-->
                    <!--                        1</button-->
                    <!--                      ><button-->
                    <!--                        class="-->
                    <!--                          flex-->
                    <!--                          items-center-->
                    <!--                          justify-center-->
                    <!--                          border-->
                    <!--                          rounded-sm-->
                    <!--                          w-9-->
                    <!--                          h-9-->
                    <!--                          text-xs- text-gray-600-->
                    <!--                          border-gray-300-->
                    <!--                        "-->
                    <!--                      >-->
                    <!--                        2</button-->
                    <!--                      ><button-->
                    <!--                        class="-->
                    <!--                          flex-->
                    <!--                          items-center-->
                    <!--                          justify-center-->
                    <!--                          border-->
                    <!--                          rounded-sm-->
                    <!--                          w-9-->
                    <!--                          h-9-->
                    <!--                          text-xs- text-gray-600-->
                    <!--                          border-gray-300-->
                    <!--                        "-->
                    <!--                      >-->
                    <!--                        3</button-->
                    <!--                      ><button-->
                    <!--                        class="-->
                    <!--                          flex-->
                    <!--                          items-center-->
                    <!--                          justify-center-->
                    <!--                          border-->
                    <!--                          rounded-sm-->
                    <!--                          w-9-->
                    <!--                          h-9-->
                    <!--                          text-xs- text-gray-600-->
                    <!--                          border-gray-300-->
                    <!--                        "-->
                    <!--                      >-->
                    <!--                        4</button-->
                    <!--                      ><button-->
                    <!--                        class="-->
                    <!--                          flex-->
                    <!--                          items-center-->
                    <!--                          justify-center-->
                    <!--                          border-->
                    <!--                          rounded-sm-->
                    <!--                          w-9-->
                    <!--                          h-9-->
                    <!--                          text-xs- text-gray-600-->
                    <!--                          border-gray-300-->
                    <!--                        "-->
                    <!--                      >-->
                    <!--                        5-->
                    <!--                      </button>-->
                    <!--                      <button>-->
                    <!--                        <img src="@/assets/images/btn-pre.svg" alt="다음 페이지" class="rotate-180-" />-->
                    <!--                      </button>-->
                    <!--                      <button>-->
                    <!--                        <img src="@/assets/images/btn-first.svg" alt="마지막 페이지" class="rotate-180-" />-->
                    <!--                      </button>-->
                    <!--                    </div>-->
                  </div>
                </span>
                <em>개</em>
              </b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Section, { SectionNewHeader, SectionMain, SectionLnb } from '@/components/Section';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AgGridVue } from 'ag-grid-vue';
import GridPagenate from '@/components/GridPagenate.vue';

export default {
  components: {
    GridPagenate,
    AgGridVue,
    SectionNewHeader,
    Section,
    SectionMain,
    SectionLnb,
  },
  props: {
    bdgtListData: {
      type: [Object, Array],
    },
  },
  data() {
    return {
      toggle: false,
      height: '174px',
      // gridOptions: null,
      columnDefs: null,
      rowData: null,
      pageObj: {
        currentPageNo: 1,
        pageSize: 10,
        totalCnt: 0,
      },
      annualBudgetChart: {},
      monthlyBudgetChart: {},
      dailyBudgetChart: {},
      annualBudgetChartData: {},
      monthlyBudgetChartData: {},
      dailyBudgetChartData: {},
      chartNameArray: ['annualBudgetChart', 'monthlyBudgetChart'],
    };
  },
  created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    am4core.options.autoDispose = true; // 차트 인스턴스 자동 삭제
  },
  mounted() {
    // this.gridApi = this.gridOptions.api;
    this.setColumn();
    this.setData();
    this.createChart(this.chartNameArray);
    this.createDailyChart();
  },
  beforeDestroy() {
    if (this.annualBudgetChart) {
      this.annualBudgetChart.dispose();
    }
    if (this.monthlyBudgetChart) {
      this.monthlyBudgetChart.dispose();
    }
    if (this.dailyBudgetChart) {
      this.dailyBudgetChart.dispose();
    }
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
    },
    onBtnNext() {
      this.gridApi.paginationGoToNextPage();
    },
    onBtPrevious() {
      this.gridApi.paginationGoToPreviousPage();
    },
    clickPage(page) {
      this.gridApi.paginationGoToPage(page);
    },
    setColumn() {
      this.columnDefs = [
        {
          headerName: '예산명',
          field: 'bdgtProp.bdgtNm',
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center'],
        },
        {
          headerName: '알림 내용',
          field: 'bdgtAlarm',
          minWidth: 300,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center', 'font-black'],
          cellRenderer: (params) => {
            // 예산 금액
            let bdgtAmt = params.data.bdgtProp.bdgtAmt;
            // 실제 비용
            let actualCost = params.data.bdgtInfo.unblendCost;
            // 예측 비용
            let fcstCost = params.data.bdgtInfo.fcstCost;
            let value = 0;
            let bdgtThrs = params.data.bdgtThrs;
            let bdgtThrsUnitTypNm = '';
            let bdgtThrsAmtTypNm = '';
            bdgtThrs.forEach((budget) => {
              if (budget.thrsStatNm === 'Exceeded') {
                bdgtThrsUnitTypNm = budget.bdgtThrsUnitTypNm;
                bdgtThrsAmtTypNm = budget.bdgtThrsAmtTypNm;
                if (budget.bdgtThrsUnitTypNm === 'Relative') {
                  // 예산 * ( thrsVal  / 100 )
                  if (budget.bdgtThrsAmtTypNm === 'Actual') {
                    value = actualCost * (budget.htrsVal / 100);
                    // 실제 비용이 예산보다 얼마를 초과하였다.
                    // return `실제 비용이 예산의 ${actualCost - bdgtAmt}(${value})을 초과하였습니다.`;
                  }
                  // (thrsVal / 예산) * 100
                  if (budget.bdgtThrsAmtTypNm === 'Forecasted') {
                    value = fcstCost * (budget.htrsVal / 100);
                    // 예측 비용이 예산보다 얼마를 초과하였다.
                    // return `예측 비용이 예산의 ${fcstCost - bdgtAmt}(${value})을 초과하였습니다.`;
                  }
                }
                if (budget.bdgtThrsUnitTypNm === 'Absolute') {
                  // (thrsVal / 예산) * 100
                  if (budget.bdgtThrsAmtTypNm === 'Actual') {
                    value = (budget.htrsVal / actualCost) * 100;
                    // 실제 비용이 예산보다 얼마를 초과하였다.
                    // return `실제 비용이 예산의 ${actualCost - bdgtAmt}(${value})을 초과하였습니다.`;
                  }
                  if (budget.bdgtThrsAmtTypNm === 'Forecasted') {
                    // 예측 비용이 예산보다 얼마를 초과하였다.
                    value = (budget.htrsVal / fcstCost) * 100;
                    // return `예측 비용이 예산의 ${fcstCost - bdgtAmt}(${value})을 초과하였습니다.`;
                  }
                }
              }
            });

            if (bdgtThrsUnitTypNm === 'Relative') {
              // 예산 * ( thrsVal  / 100 )
              if (bdgtThrsAmtTypNm === 'Actual') {
                // 실제 비용이 예산보다 얼마를 초과하였다.
                return (
                  `<span style="color: #00A6ED;">실제 비용</span>이 예산의 ` +
                  `<span style="color: #FD65A7;">${actualCost - bdgtAmt}</span>(${value})을 초과하였습니다.`
                );
              }
              // (thrsVal / 예산) * 100
              if (bdgtThrsAmtTypNm === 'Forecasted') {
                // 예측 비용이 예산보다 얼마를 초과하였다.
                return (
                  `<span style="color: #00A6ED;">예측 비용</span>이 예산의 ` +
                  `<span style="color: #FD65A7;">${fcstCost - bdgtAmt}</span>(${value})을 초과하였습니다.`
                );
              }
            }
            if (bdgtThrsUnitTypNm === 'Absolute') {
              // (thrsVal / 예산) * 100
              if (bdgtThrsAmtTypNm === 'Actual') {
                // 실제 비용이 예산보다 얼마를 초과하였다.
                return `<span style="color: black; margin-right: 1px;">테스트</span>`;
                // return (
                //   `<span style="color: #00A6ED; margin-right: 1px;">실제 비용</span>` +
                //   `<span style="color: black; margin-right: 1px;">이 예산의</span>` +
                //   `<span style="color: #FD65A7; margin-right: 1px;">${actualCost - bdgtAmt}</span>` +
                //   `<span style="color: black; margin-right: 1px;">(${value})을 초과하였습니다.</span>`
                // );
              }
              if (bdgtThrsAmtTypNm === 'Forecasted') {
                // 예측 비용이 예산보다 얼마를 초과하였다.
                return (
                  `<span style="color: #00A6ED;">예측 비용</span>이 예산의 ` +
                  `<span style="color: #FD65A7;">${fcstCost - bdgtAmt}</span>(${value})을 초과하였습니다.`
                );
              }
            }
          },
        },
        {
          headerName: '알림 발생일',
          field: 'bdgtAlarmDate',
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center'],
          valueGetter: (params) => {
            let bdgtThrs = params.data.bdgtThrs;
            let thrsExcsDt = '';
            bdgtThrs.forEach((budget) => {
              if (budget.thrsStatNm === 'Exceeded') {
                thrsExcsDt = budget.thrsExcsDt;
              }
            });
            return thrsExcsDt;
          },
        },
      ];
    },
    setData() {
      this.annualBudgetChartData = [
        { category: '예산', value: 55, color: am4core.color('#FD65A7') },
        { category: '사용 비용', value: 40, color: am4core.color('#00A6ED') },
        { category: '예측 비용', value: 70, color: am4core.color('#FCC427') },
      ];
      this.monthlyBudgetChartData = [
        { category: '예산', value: 40, color: am4core.color('#FD65A7') },
        { category: '사용 비용', value: 55, color: am4core.color('#00A6ED') },
        { category: '예측 비용', value: 70, color: am4core.color('#FCC427') },
      ];
      this.dailyBudgetChartData = [
        { category: '08.20', value: 55, budgetValue: 42, color: am4core.color('#00A6ED') },
        { category: '08.21', value: 70, budgetValue: 42, color: am4core.color('#00A6ED') },
        { category: '08.22', value: 40, budgetValue: 42, color: am4core.color('#00A6ED') },
        { category: '08.23', value: 25, budgetValue: 42, color: am4core.color('#00A6ED') },
        { category: '08.24', value: 30, budgetValue: 42, color: am4core.color('#00A6ED') },
        { category: '08.25', value: 70, budgetValue: 42, color: am4core.color('#00A6ED') },
        { category: '08.26', value: 55, budgetValue: 42, color: am4core.color('#00A6ED') },
      ];
      this.rowData = this.bdgtListData;
      // this.rowData = [
      //   {
      //     bdgtNm: 'Default Budget',
      //     bdgtAlarm: '예측 비용이 예산의 100% (약 ₩150,042,513)을 초과하였습니다.',
      //     bdgtAlarmDate: '2024.09.07 15:30',
      //   },
      //   {
      //     bdgtNm: 'AI 예산',
      //     bdgtAlarm: '예측 비용이 예산의 100% (약 ₩150,863,232)을 초과하였습니다.',
      //     bdgtAlarmDate: '2024.09.07 15:30',
      //   },
      //   {
      //     bdgtNm: 'Cloud Infra 전체_월별예산',
      //     bdgtAlarm: '예측 비용이 예산의 100% (약 ₩242,728,025)을 초과하였습니다.',
      //     bdgtAlarmDate: '2024.09.07 15:30',
      //   },
      //   {
      //     bdgtNm: '월별 예산',
      //     bdgtAlarm: '실제 비용이 예산의 ₩200,000,000 (약 100%)을 초과하였습니다.',
      //     bdgtAlarmDate: '2024.09.25 14:54',
      //   },
      // ];
    },
    createChart(chartName) {
      chartName.forEach((budgetChart) => {
        // 차트 생성
        let chart = am4core.create(budgetChart, am4charts.XYChart);
        // 데이터 설정
        if (budgetChart === 'annualBudgetChart') {
          chart.data = this.annualBudgetChartData;
        } else if (budgetChart === 'monthlyBudgetChart') {
          chart.data = this.monthlyBudgetChartData;
        }
        // X축 설정 (CategoryAxis)
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'category';
        categoryAxis.renderer.grid.template.strokeOpacity = 0; // Hide grid lines
        categoryAxis.renderer.axisFills.template.fillOpacity = 0; // Hide axis fills;
        categoryAxis.renderer.labels.template.fontSize = 11; // 원하는 글꼴 크기 설정
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20; // 최소 그리드 거리 설정

        // Y축 설정 (ValueAxis)
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.numberFormatter.numberFormat = '#a'; // 단위 자동화
        valueAxis.numberFormatter.bigNumberPrefixes = [
          { number: 1e3, suffix: 'K' },
          { number: 1e6, suffix: 'M' },
          { number: 1e9, suffix: 'B' },
        ];
        // 최하단 수평선 추가
        const baseline = valueAxis.axisRanges.create();
        baseline.value = valueAxis.min; // Y축의 최하단 값으로 설정
        baseline.grid.stroke = am4core.color('#000000'); // 수평선 색상 설정
        baseline.grid.strokeWidth = 0.2; // 수평선 두께 설정
        baseline.grid.strokeOpacity = 1;

        // 시리즈 추가 (세로 막대)
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = 'value';
        series.dataFields.categoryX = 'category';
        series.name = 'Value';
        series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
        series.columns.template.fillOpacity = 0.8;
        // 막대 폭 조절
        series.columns.template.width = am4core.percent(50); // 기본값보다 좁은 폭 설정
        // 각 막대에 색상 설정
        series.columns.template.propertyFields.fill = 'color'; // 각 항목의 색상 사용
        series.columns.template.propertyFields.stroke = 'color'; // 동일한 색상으로 테두리 설정

        let columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;

        if (budgetChart === 'annualBudgetChart') {
          this.annualBudgetChart = chart;
        } else if (budgetChart === 'monthlyBudgetChart') {
          this.monthlyBudgetChart = chart;
        }
      });
    },
    createDailyChart() {
      // 차트 인스턴스 생성
      let chart = am4core.create('dailyBudgetChart', am4charts.XYChart);

      // 데이터 설정
      chart.data = this.dailyBudgetChartData;

      // X축 (카테고리)
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'category';
      categoryAxis.renderer.grid.template.disabled = true; // X축 그리드 제거

      // Y축 (수치 없음, 그리드 비활성화)
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.labels.template.disabled = true; // Y축 레이블 제거
      valueAxis.renderer.grid.template.disabled = true; // Y축 그리드 제거

      // 세로 막대 그래프 (ColumnSeries)
      let columnSeries = chart.series.push(new am4charts.ColumnSeries());
      columnSeries.dataFields.valueY = 'value';
      columnSeries.dataFields.categoryX = 'category';
      columnSeries.name = '사용비용';
      columnSeries.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';

      // 가로 점선 (LineSeries)
      let lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.dataFields.valueY = 'budgetValue';
      lineSeries.dataFields.categoryX = 'category';
      lineSeries.name = '예산';
      lineSeries.stroke = am4core.color('#FF0000'); // 선 색상
      lineSeries.strokeWidth = 4;
      lineSeries.strokeDasharray = '18,15'; // 점선 스타일

      // LineSeries의 선을 전체 폭으로 연장
      lineSeries.startLocation = 0; // 좌측 끝
      lineSeries.endLocation = 1; // 우측 끝

      // 범례 설정 (차트 상단에 위치)
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'top';

      // 차트 메모리 해제
      this.dailyBudgetChart = chart;
    },
    popup_info_open(e) {
      if (e.target.classList.contains('with_detail')) {
        e.target.classList.remove('with_detail');
      } else {
        e.target.classList.add('with_detail');
      }
    },
    popup_info_close(e) {
      e.target.parentNode.parentNode.classList.remove('with_detail');
    },
  },
};
</script>
<style src="@/assets/jhstyle.css"></style>
<style scoped>
.ovf_table .font-black span {
  color: black !important;
}
#annualBudgetChart {
  width: 100%;
  height: 100%;
}
#monthlyBudgetChart {
  width: 100%;
  height: 100%;
}
#dailyBudgetChart {
  width: 100%;
  height: 100%;
}
</style>
