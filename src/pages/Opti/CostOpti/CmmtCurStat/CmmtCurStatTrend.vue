<template>
  <div ref="trend" class="box-wrap type2">
    <div class="title">
      <h4 class="tit-wrap">
        <div class="tab">
          <a :class="buttonClass('netSave')" @click="handleClickType('netSave')">{{
            $t('optimization.savingsRateTrend')
          }}</a>
          <a class="ml-1.5" :class="buttonClass('utl')" @click="handleClickType('utl')">{{
            $t('optimization.usageRateTrend')
          }}</a>
          <a class="ml-1.5" :class="buttonClass('cvrg')" @click="handleClickType('cvrg')">{{
            $t('optimization.coverageTrend')
          }}</a>
        </div>
      </h4>
      <div class="tooltip-wrap">
        <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
        <div class="tooltip-layer">
          <strong class="ti">{{ $t('optimization.trendChart') }}</strong>
          <div class="ls">
            <span class="text-primary-400">{{ $t('optimization.trendChart') }}</span>
            : {{ $t('optimization.valueByCommitting', { value: getCmmtTitle }) }}
          </div>
          <div class="ls">
            <span class="text-primary-400">{{ $t('optimization.usageRateTrend') }}</span> :
            {{ $t('optimization.percentageContractsDuring') }}
          </div>
          <div class="ls">
            <span class="text-primary-400">{{ $t('optimization.coverageTrend') }}</span> :
            {{ $t('optimization.percentageCommitmentIOverall') }}
          </div>
          <button class="close jsTooltipClose1">툴팁 닫기</button>
        </div>
      </div>
      <div class="pos-right">
        <Select
          :data="selectRangeOptions"
          :key-getter="(item) => item.range"
          :text-getter="(item) => item.text"
          div-class="relative inline-block z-index"
          select-class="flex items-center justify-between px-4 py-1.5 text-sm text-left
          bg-white border rounded border-gray-300 h-8"
          :arrow-src="require('@/assets/images/arrow-typ-03.svg')"
          arrow-class="ml-4 -mr-2"
          option-list-class="z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
          options-list-item-class="px-5 py-3 cursor-pointer hover:bg-primary-300"
          @click="handleClickDateType"
        />
        <span class="tab-wrap">
          <a class="bar" :class="chartType === 'bar' ? 'clicked' : ''" @click="handleClickChartType('bar')"
            >bar chart</a
          >
          <a class="line" :class="chartType === 'line' ? 'clicked' : ''" @click="handleClickChartType('line')"
            >line chart</a
          >
        </span>
        <a href="javascript:void(0);" class="download single" @click="excelDownload()">{{
          $t('common.button.download')
        }}</a>
      </div>
    </div>
    <!-- Chart -->
    <div
      id="chart"
      :class="hasChartData === 'D' ? '' : 'hidden'"
      style="
        font-size: 24px;
        letter-spacing: -0.03px;
        text-align: center;
        color: #fff;
        line-height: 380px;
        height: 380px;
      "
    ></div>

    <!-- Loading -->
    <template v-if="hasChartData === 'L'">
      <div class="relative" style="height: 380px">
        <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
          <div class="mb-4 loading_rotate">
            <span class="loadingcolor"></span>
          </div>
          <div class="loading_txt">Loading...</div>
        </div>
      </div>
    </template>

    <!-- No Data -->
    <template v-else-if="hasChartData === 'E'">
      <div id="chart" class="flex flex-col items-center justify-center" style="height: 380px">
        <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
        <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import Select from '@/components/Select';
import { numberProcess } from '../CmmtPsblTgt/CostOptiCommon';
import costOptiService from '@/services/costOptiService';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: {
    Select,
  },
  props: {
    trendOffsetTop: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      type: 'utl', // 절감률(netSave), 사용률(utl), 커버리지(cvrg)
      dateTyp: 'DAILY', // DAILY, WEEKLY, MONTHLY
      chartType: 'bar', // 막대(bar), 꺾은선(line)
      chartData: [],
      selectRangeOptions: {},
      firstRendered: true,
      convertedExportingData: false,
      loading: true,
    };
  },
  computed: {
    ...mapState('costOpti', ['filter', 'isSearch', 'active']),
    hasChartData() {
      /** E(Empty) / L(lodaing) / D(data) */
      let lState = '';
      if (this.loading) {
        lState = 'L';
      } else if (this.chartData.length === 0) {
        lState = 'E';
      } else {
        lState = 'D';
      }
      return lState;
    },
    getCmmtTitle() {
      if (this.filter.cmmtTypList.some((item) => ['SP', 'RI'].includes(item)))
        return i18n.locale === 'ko' ? '온디맨드' : 'On-Demand';
      if (this.filter.cmmtTypList.includes('AzureRI')) return i18n.locale === 'ko' ? '종량제' : 'pay as you go';
      if (this.filter.cmmtTypList.includes('GcpRI')) return i18n.locale === 'ko' ? '온디맨드' : 'On-Demand'; // TODO: GCP 화면 추가 시 변경 필요!
      return '{{ }}';
    },
  },
  watch: {
    '$i18n.locale': ['setSelectRangeOptions', 'createChart'],
    isSearch(newVal) {
      if (newVal.isSearch) {
        this.getChartData();
      }
    },
    type() {
      this.getChartData();
    },
    chartType() {
      this.getChartData();
    },
    active(newVal) {
      if (newVal.chart) {
        this.handleClickType(newVal.chart);
      }
    },
    dateTyp() {
      this.getChartData();
    },
  },
  created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    am4core.options.autoDispose = true; // 차트 인스턴스 자동 삭제

    this.setSelectRangeOptions();
    if (this.active.chart) {
      this.handleClickType(this.active.chart);
    }
  },
  methods: {
    ...mapActions('costOpti', ['fetchParam', 'fetchUtlTransition', 'fetchCvrgTransition']),
    setSelectRangeOptions() {
      if (i18n.locale === 'ko') {
        this.selectRangeOptions = [
          { range: 'DAILY', text: '일별' },
          { range: 'WEEKLY', text: '주별' },
          { range: 'MONTHLY', text: '월별' },
        ];
      } else {
        this.selectRangeOptions = [
          { range: 'DAILY', text: 'Daily' },
          { range: 'WEEKLY', text: 'Weekly' },
          { range: 'MONTHLY', text: 'Monthly' },
        ];
      }
    },
    getChartData() {
      this.convertedExportingData = false;
      this.type === 'cvrg' ? this.getCvrgTransition() : this.getUtlTransition();
    },
    async getUtlTransition() {
      this.loading = true;
      this.chartData = [];

      let utlData = [];
      try {
        const result = await costOptiService.fetchUtlTransition(this.filter);
        utlData = result.data.data || [];
      } catch (error) {
        console.error('getUtlTransition', error);
      }

      if (this.dateTyp === 'WEEKLY') {
        utlData = utlData.map((item) => {
          let parts = item.usagDate.split('-');
          let year = parseInt(parts[0]);
          let week = parseInt(parts[1]);
          // let startOfWeek = new Date(year, 0, (week - 1) * 7 + 1);
          let startOfWeek = this.getStartDateFromWeek(year, week);
          return {
            ...item,
            usagDate: startOfWeek,
          };
        });
      }
      this.chartData = utlData;
      this.createChart();
      this.loading = false;
      this.focusControl();
    },
    async getCvrgTransition() {
      this.loading = true;

      this.chartData = [];
      let cvrgData = [];
      try {
        const result = await costOptiService.fetchCvrgTransition(this.filter);
        cvrgData = result.data.data || [];
      } catch (error) {
        console.error('getCvrgTransition', error);
      }

      if (this.dateTyp === 'WEEKLY') {
        cvrgData = cvrgData.map((item) => {
          let parts = item.usagDate.split('-');
          let year = parseInt(parts[0]);
          let week = parseInt(parts[1]);
          // let startOfWeek = new Date(year, 0, (week - 1) * 7 + 1);
          let startOfWeek = this.getStartDateFromWeek(year, week);

          return {
            ...item,
            usagDate: startOfWeek,
          };
        });
      }
      this.chartData = cvrgData;
      this.createChart();
      this.focusControl();
      this.loading = false;
    },
    createChart() {
      const chart = am4core.create('chart', am4charts.XYChart);
      chart.cursor = new am4charts.XYCursor();
      chart.data = this.chartData;
      this.createXaxis(chart);
      this.createYaxis(chart);
      this.createSeries(chart);
      this.chart = chart;
    },
    createXaxis(chart) {
      const xAxis = chart.xAxes.push(new am4charts.DateAxis());
      xAxis.dataFields.category = 'usagDate';

      const dateAxis = chart.xAxes.getIndex(0);
      switch (this.dateTyp) {
        case 'DAILY':
          dateAxis.dateFormats.setKey('year', 'yyyy/MM/dd');
          dateAxis.dateFormats.setKey('month', 'yyyy/MM/dd');
          dateAxis.dateFormats.setKey('week', 'yyyy/MM/dd');
          dateAxis.dateFormats.setKey('day', 'yyyy/MM/dd');
          dateAxis.periodChangeDateFormats.setKey('year', 'yyyy/MM/dd');
          dateAxis.periodChangeDateFormats.setKey('month', 'yyyy/MM/dd');
          dateAxis.periodChangeDateFormats.setKey('week', 'yyyy/MM/dd');
          dateAxis.periodChangeDateFormats.setKey('day', 'yyyy/MM/dd');
          break;
        case 'WEEKLY':
          dateAxis.dateFormats.setKey('year', 'yyyy');
          dateAxis.dateFormats.setKey('month', 'yyyy/MM');
          dateAxis.dateFormats.setKey('week', "yyyy/MM(ww'W')");
          dateAxis.dateFormats.setKey('day', "yyyy/MM(ww'W')");
          dateAxis.periodChangeDateFormats.setKey('year', 'yyyy');
          dateAxis.periodChangeDateFormats.setKey('month', 'yyyy/MM');
          dateAxis.periodChangeDateFormats.setKey('week', "yyyy/MM(ww'W')");
          dateAxis.periodChangeDateFormats.setKey('day', "yyyy/MM(ww'W')");
          break;
        case 'MONTHLY':
          dateAxis.dateFormats.setKey('year', 'yyyy/MM');
          dateAxis.dateFormats.setKey('month', 'yyyy/MM');
          dateAxis.dateFormats.setKey('week', 'yyyy/MM');
          dateAxis.dateFormats.setKey('day', 'yyyy/MM');
          dateAxis.periodChangeDateFormats.setKey('year', 'yyyy/MM');
          dateAxis.periodChangeDateFormats.setKey('month', 'yyyy/MM');
          dateAxis.periodChangeDateFormats.setKey('week', 'yyyy/MM');
          dateAxis.periodChangeDateFormats.setKey('day', 'yyyy/MM');
          break;
        default:
          break;
      }

      chart.invalidateData(); // 차트 데이터 갱신

      xAxis.fontSize = 15;
      xAxis.tooltip.fontSize = 15;
      xAxis.renderer.grid.template.disabled = true;
      xAxis.renderer.labels.template.fontSize = 15;
      xAxis.renderer.labels.template.location = 0.5; // 레이블 표시위치

      xAxis.renderer.minGridDistance = 100; // 최소 그리드 간격 설정
      xAxis.groupData = true; // 데이터 그룹화 (띄엄띄엄 표출)
      // xAxis.groupCount = 5; // 그룹화된 데이터 개수 설정
    },
    createYaxis(chart) {
      const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.grid.template.disabled = true;
      yAxis.renderer.labels.template.fontSize = 15;

      yAxis.layout = 'absolute';

      chart.plotContainer.paddingTop = 20;
      yAxis.paddingTop = 20;

      yAxis.title.text = '(%)';
      yAxis.title.rotation = 0;
      yAxis.title.align = 'right';
      yAxis.title.valign = 'top';
      yAxis.title.dy = -35;
      yAxis.title.dx = -5;
      yAxis.title.fill = am4core.color('#6c9fb2');

      yAxis.min = 0;
      yAxis.max = 100;
      yAxis.fontSize = 15;
      yAxis.tooltip.fontSize = 15;
    },
    createSeries(chart) {
      const series =
        this.chartType === 'bar'
          ? chart.series.push(new am4charts.ColumnSeries())
          : chart.series.push(new am4charts.LineSeries());

      let valueY = 'utlRt';
      let valueNm = '';
      switch (this.type) {
        case 'netSave':
          valueY = 'netSaveRt';
          valueNm = this.$t('dashboard.savingsRate');
          break;
        case 'utl':
          valueY = 'utlRt';
          valueNm = this.$t('optimization.utilization');
          break;
        case 'cvrg':
          valueY = 'cmmtCvrgRt';
          valueNm = this.$t('optimization.coverageRate');
          break;
      }

      series.dataFields.dateX = 'usagDate';
      series.dataFields.valueY = valueY;
      series.fill = am4core.color('#2CC2FD');

      this.tooltipColorSetting(series, '#2CC2FD');
      series.tooltipText =
        `[bold]{dateX.formatDate('yyyy/MM/dd')}[/]
      ` +
        valueNm +
        `: {valueY.formatNumber('#.##')}%`;

      if (this.chartType === 'line') {
        let bullet = series.bullets.push(new am4charts.Bullet());
        let interfaceColors = new am4core.InterfaceColorSet();
        let circle = bullet.createChild(am4core.Circle);
        circle.stroke = interfaceColors.getFor('background');
        circle.horizontalCenter = 'middle';
        circle.verticalCenter = 'middle';
        circle.width = 10;
        circle.height = 10;
      }
      this.series = series;
    },
    tooltipColorSetting(series, color) {
      series.tooltip.fontSize = 12;
      series.tooltip.label.fontSize = 12;
      series.tooltip.label.fill = am4core.color(color);
      series.tooltip.getFillFromObject = false;
      series.tooltip.pointerOrientation = 'vertical';
      series.tooltip.background.fill = am4core.color('white');
      series.tooltip.background.stroke = am4core.color('#2cc2fd');
    },
    handleClickType(type) {
      this.type = type;
    },
    handleClickChartType(type) {
      this.chartType = type;
    },
    handleClickDateType(type) {
      this.dateTyp = type.range;
      this.fetchParam({ state: { dateTyp: type.range } });
    },
    buttonClass(type) {
      const button = 'inline-block rounded px-2 py-1.5 font-bold border border-primary-400 text-sm ';
      return this.type === type ? button + 'text-white bg-primary-400' : button + 'text-primary-400 bg-white';
    },
    excelDownload() {
      let usagDateTitle = this.$t('optimization.dateOfUse');
      if (this.dateTyp === 'WEEKLY') usagDateTitle = this.$t('optimization.dateOfUseStartDate');

      let typeName = '';
      switch (this.type) {
        case 'netSave':
          typeName = this.$t('optimization.savingsRateTrend');
          this.chart.exporting.dataFields = {
            usagDate: usagDateTitle,
            utlRt: this.$t('optimization.utilization'),
            cmmtCost: this.$t('optimization.contractCost'),
            usedCmmtCost: this.$t('optimization.commitmentCostsUsed'),
            usedCmmtCostOnDmndEqvlnt: this.$t('optimization.valueCommitmentConversionCost', {
              value: this.getCmmtTitle,
            }),
            netSaveCost: this.$t('optimization.reducedCost'),
            netSaveRt: this.$t('dashboard.savingsRate'),
          };
          break;
        case 'utl':
          typeName = this.$t('optimization.usageRateTrend');
          this.chart.exporting.dataFields = {
            usagDate: usagDateTitle,
            utlRt: this.$t('optimization.utilization'),
            cmmtCost: this.$t('optimization.contractCost'),
            usedCmmtCost: this.$t('optimization.commitmentCostsUsed'),
            usedCmmtCostOnDmndEqvlnt: this.$t('optimization.valueCommitmentConversionCost', {
              value: this.getCmmtTitle,
            }),
            netSaveCost: this.$t('optimization.reducedCost'),
            netSaveRt: this.$t('dashboard.savingsRate'),
          };
          break;
        case 'cvrg':
          typeName = this.$t('optimization.coverageTrend');
          this.chart.exporting.dataFields = {
            usagDate: usagDateTitle,
            onDmndCost: this.$t('optimization.valueAmount', { value: this.getCmmtTitle }),
            riOnDmndCostEqvlnt: `RI ${this.$t('optimization.valueConversionCost', { value: this.getCmmtTitle })}`,
            cmmtOnDmndCostEqvlnt: this.$t('optimization.valueCommittedEquivalentAmount', { value: this.getCmmtTitle }),
            totOnDmndCostEqvlnt: this.$t('optimization.totalCost'),
            onDmndCvrgRt: `${this.getCmmtTitle} ${this.$t('optimization.coverageRate')}`,
            riCvrgRt: `RI ${this.$t('optimization.contractCoverageRate')} `,
          };
          if (!this.filter.cmmtTypList.includes('AzureRI'))
            this.chart.exporting.dataFields['spCvrgRt'] = `SP ${this.$t('optimization.contractCoverageRate')}`; // 2024-03-12 현재는 AWS만 표현
          this.chart.exporting.dataFields['cmmtCvrgRt'] = this.$t('optimization.contractCoverageRate');
          break;
      }

      // 비율 및 원화 기호 표기 및 소수점 처리
      // > 매개변수로 전달되는 함수는 레코드 갯수만큼 반복 호출되므로
      // > 최초 1회만 변환 처리하기 위한 조건 설정
      this.chart.exporting.adapter.add('data', (data) => {
        if (!this.convertedExportingData) {
          data.data.forEach((item) => {
            for (const key in item) {
              if (key.endsWith('Rt')) {
                item[key] = numberProcess(item[key]) + '%';
              } else if (key.endsWith('Cost') || key.endsWith('Eqvlnt')) {
                item[key] = this.numberWithCurcyUnit(item[key]);
              }
            }
          });
          this.convertedExportingData = true;
        }
        return data;
      });

      // Sheet 이름 설정
      this.chart.exporting.adapter.add('xlsxWorkbook', (wb) => {
        wb.workbook.SheetNames[0] = typeName;
        wb.workbook.Sheets[typeName] = wb.workbook.Sheets['Data'];
        return wb;
      });

      this.chart.exporting.filePrefix = `${this.$t('optimization.contractStatusChart')}_${typeName}_${moment().format(
        'YYYY-MM-DD'
      )}`;
      this.chart.exporting.export('xlsx');
    },
    numberWithCurcyUnit(number) {
      if (typeof number !== 'number') return '-';
      const numProcessed = number ? Math.floor(Math.abs(number)).toLocaleString() : 0;
      return number >= 0 ? '₩' + numProcessed : '-₩' + numProcessed;
    },
    focusControl() {
      const focusOnChart = this.$route.query.focus === 'chart' && this.active.chart;
      if (focusOnChart && this.firstRendered && this.trendOffsetTop > 0) {
        window.scrollTo({ left: 0, top: this.trendOffsetTop + 80 });
        this.firstRendered = false;
      }
    },
    getStartDateFromWeek(year, week) {
      // 해당 연도의 1월 1일
      var januaryFirst = new Date(year, 0, 1);
      // 1월 1일의 요일(0: 일요일, 1: 월요일, ..., 6: 토요일)
      var januaryFirstDay = januaryFirst.getDay();
      // 주의 시작일 계산
      // 1월 1일이 포함된 주의 시작일을 구하고, 그로부터 7일씩 주차를 더한 후, 주의 시작일을 반환.
      var weekStart = new Date(year, 0, 1 + (week - 1) * 7 - januaryFirstDay + 1);
      return weekStart;
    },
  },
};
</script>

<style scoped>
.title a {
  cursor: pointer;
}
.z-index {
  z-index: 10;
}
defs {
  display: none;
}
.title {
  display: flex;
  align-items: baseline;
}
.tooltip-wrap {
  margin-left: 10px;
}
</style>
