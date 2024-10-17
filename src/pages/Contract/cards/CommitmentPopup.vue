<template>
  <div v-if="visible">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <div class="z-30 p-8 text-sm text-gray-700 rounded policy-content modal-content">
      <h3 class="modal-title">{{ $t('cost.billingContractInformation') }}</h3>

      <button class="absolute top-0 right-0 close-policy-modal mt-7 mr-7">
        <img src="@/assets/images/ico-btn-search-close.svg" alt="." @click="$emit('close')" />
      </button>

      <div v-show="!loading" class="is-scroll">
        <div v-for="(pricingCmmt, i) in chartData" :key="i">
          <div>
            <div class="title-01">{{ pricingCmmt.prdtNm }} ({{ pricingCmmt.pricingNm }})</div>
            <div class="info-01">
              <span class="ti">{{ $t('cost.validityPeriod') }}</span>
              <strong class="tx">{{ pricingCmmt.cmmtStrDt | date }} ~ {{ pricingCmmt.cmmtEndDt | date }} </strong>
            </div>

            <div>
              <div class="px-20">
                <ul class="list-01">
                  <li>
                    <span class="ti">{{ $t('cost.periodOfUse') }}</span>
                    <strong class="tx">
                      {{ pricingCmmt.cmmtStrDt | date }} ~
                      <!--현재 날짜가 유효기간 내의 날짜라면 전날 날짜 표출-->
                      <template v-if="$options.filters.date(pricingCmmt.cmmtEndDt) >= today">
                        {{ yesterday }}
                      </template>
                      <template v-else
                        ><!--현재 날짜가 유효기간 내의 날짜가 아니라면 유효기간 종료일 표출-->
                        {{ pricingCmmt.cmmtEndDt | date }}
                      </template>
                    </strong>
                  </li>
                  <li>
                    <span class="ti">{{ $t('cost.contractCondition') }}</span>
                    <strong class="tx">
                      {{ pricingCmmt.cmmtVal | currency }}
                      {{ pricingCmmt.cmmtUnit }}
                      ({{ pricingCmmt.cmmtTermTypCd | cmmtTerm }})
                    </strong>
                  </li>
                  <li v-if="!popupParams.pricingId">
                    <span class="ti">{{ $t('cost.expectedPenalty') }}</span>
                    <strong class="tx">
                      {{ pricingCmmt.penltyUnit | unit }}
                      {{
                        (pricingCmmt.lastStat
                          ? pricingCmmt.penltyVal * (pricingCmmt.cmmtVal - pricingCmmt.lastStat.accumUsageQty)
                          : 0) | exponentialToNumber
                      }}
                      ( 약정조건 미충족시 1{{ pricingCmmt.cmmtUnit }}당
                      {{ pricingCmmt.penltyVal | exponentialToNumber }}
                      {{ pricingCmmt.penltyUnit | unit }}
                      )
                    </strong>
                  </li>
                  <li v-else>
                    <span class="ti">{{ $t('cost.penalty') }}</span>
                    <strong class="tx">
                      약정조건 미충족시 1{{ pricingCmmt.cmmtUnit }}당
                      {{ pricingCmmt.penltyVal | exponentialToNumber }}
                      {{ pricingCmmt.penltyUnit | unit }}
                    </strong>
                  </li>
                  <li v-if="popupParams.pricingId">
                    <span class="ti">{{ $t('cost.usage') }}</span>
                    <strong class="tx">
                      {{ (pricingCmmt.lastStat ? pricingCmmt.lastStat.accumUsageQty.toFixed(1) : 0) | currency }}
                      {{ pricingCmmt.cmmtUnit }}
                      (
                      {{
                        (pricingCmmt.lastStat
                          ? ((pricingCmmt.lastStat.accumUsageQty / pricingCmmt.cmmtVal) * 100).toFixed(1)
                          : 0.0)
                      }}
                      %)
                    </strong>
                  </li>
                </ul>
                <div class="chart__box type2">
                  <div style="display: none">{{ pricingCmmt }}</div>
                  <div v-if="pricingCmmt.cmmtTermTypCd !== 'YR'">
                    <div>
                      <div :ref="`${pricingCmmt.prdtId}-${pricingCmmt.pricingId}`" style="height: 400px"></div>
                    </div>
                  </div>
                  <div v-else-if="pricingCmmt.cmmtTermTypCd === 'YR' && pricingCmmt.groupByYear !== undefined">
                    <template v-for="year in Object.keys(pricingCmmt.groupByYear).reverse()">
                      <div
                        class="flex items-center justify-between font-bold text-4a mb-4-"
                        style="margin: 50px 0 30px"
                      >
                        <div class="ti">{{ $t('cost.periodOfUse') }} {{ year }}.01.01 ~ {{ year }}.12.31</div>
                      </div>
                      <div>
                        <div
                          :ref="`${pricingCmmt.prdtId}-${pricingCmmt.pricingId}-${year}`"
                          style="height: 400px"
                        ></div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataLoading from '@/pages/AgGrid/DataLoading';
import moment from 'moment';
import _ from 'lodash';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import colorList from '../cards/colorConstants';
import contractService from '@/services/contractService';
import { mapState } from 'vuex';
am4core.useTheme(am4themes_animated);
am4core.addLicense('CH303240742');

export default {
  name: 'CommitmentPopup',
  components: { DataLoading },
  filters: {
    exponentialToNumber(value) {
      if (!Number.isInteger(value)) {
        const fixed = value.toFixed(20); // .replace(/(\.\d*?[1-9])0+$/g, "$1")
        const idx = fixed.search(/[^.|^0]/) + 1;
        return fixed.substring(0, idx);
      } else {
        return value.toLocaleString();
      }
    },
    unit(value) {
      return value === 'USD' ? '$' : '₩';
    },
    cmmtTerm(value) {
      if (value === 'YR') return '년간';
      else if (value === 'MTH') return '월간';
      else if (value === 'INVALI') return '유효기간 내';
      else return '';
    },
    currency(value, type) {
      var num = new Number(value);
      if (type === 'USD') {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
      } else {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
      }
    },
    date(value) {
      return moment(value).format('yy.MM');
    },
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    popupParams: {},
  },
  data() {
    return {
      chartData: [],
      today: moment().format('yy.MM.DD'),
      yesterday: moment().subtract(1, 'day').format('yy.MM.DD'),
      params: {},
      loading: true,
      alertPop: {
        visible: false,
        content: '',
        title: '',
        pushPath: '',
      },
      colors: [colorList.COLOR_LIST[13], colorList.COLOR_LIST[12]],
    };
  },
  computed: {
    ...mapState('contract', ['list', 'detail', 'ctrtId']),
  },
  async created() {
    await this.getChartData();
    this.processing();
    this.loading = false;
  },
  methods: {
    async getChartData() {
      this.loading = true;

      await contractService
        .fetchPricingCmmtStat({
          ctrtId: this.popupParams.ctrtId,
          ctrtVerVal: this.popupParams.ctrtVerVal,
          prdtId: this.popupParams.prdtId,
          pricingId: this.popupParams.pricingId,
        })
        .then((response) => {
          if (response.data.code === 'SUCCESS') {
            this.chartData = response.data.data;
          } else {
            console.log('fail response', response);
          }
        })
        .catch((error) => {
          this.alertPop.visible = true;
          this.alertPop.content = error.message;
        });
    },
    processing() {
      this.chartData.forEach((pricingCmmt, cmmtIdx) => {
        // 과금 ID, 약정기간타입코드, 약정시작일, 약정종료일, 월별통계목록
        const { pricingId, cmmtTermTypCd, cmmtStrDt, cmmtEndDt, statList, cmmtUnit } = pricingCmmt;

        pricingCmmt.cmmtUnit = this.meterUnitFilters(cmmtUnit);
        pricingCmmt.max = pricingCmmt.cmmtVal;

        if (!statList || !statList.length || !statList[0].statYm) return;
        pricingCmmt.lastStat = statList[statList.length - 1];

        /*
        const statYmList = _.chain(statList).map(({statYm}) => statYm).uniq().value();
        const cmmtStartDate = moment(cmmtStrDt);
        const cmmtEndDate = moment(cmmtEndDt);

        const monthDiff = cmmtEndDate.diff(cmmtStartDate, cmmtTermTypCd === 'MTH' ? "day" : "month");

        // 통계 데이터 없을 경우 빈 값으로 생성
        for (let i = 0; i < monthDiff; i++) {
          const next = cmmtStartDate.add(1, cmmtTermTypCd === 'MTH' ? "day" : "month");
          const nextYm = next.format(cmmtTermTypCd === 'MTH' ? 'YYYYMMDD' : 'YYYYMM');
          if (!statYmList.includes(nextYm)) {
            statList.push({statYm: nextYm, accumUsageQty: 0, usageQty: 0})
          }
        }
        */

        // 날짜순정렬
        pricingCmmt.statList = _.sortBy(statList, 'statYm');

        // 누적 사용량 빈 값일 경우 이전 월 값 대입
        statList.forEach((stat, i) => {
          stat.cmmtUnit = pricingCmmt.cmmtUnit;
          stat.statYear = stat.statYm.substring(0, 4);
          stat.statYm = moment(stat.statYm).format('YY.MM');

          if (i !== 0 && !stat.accumUsageQty) stat.accumUsageQty = statList[i - 1].accumUsageQty;

          stat.usageRate = ((stat.accumUsageQty / pricingCmmt.cmmtVal) * 100 || 0).toFixed(1);

          if (stat.accumUsageQty > pricingCmmt.max) pricingCmmt.max = stat.accumUsageQty;
        });

        // 연도별
        if (cmmtTermTypCd === 'YR') {
          pricingCmmt.groupByYear = _.groupBy(statList, 'statYear');
          setTimeout(() => {
            Object.keys(pricingCmmt.groupByYear)
              .reverse()
              .forEach((year) => {
                const stats = pricingCmmt.groupByYear[year];
                const yearPricingCmmt = { ...pricingCmmt, statList: stats };
                this.createChart(
                  this.$refs[`${pricingCmmt.prdtId}-${pricingCmmt.pricingId}-${year}`][0],
                  yearPricingCmmt
                );
              });
          }, 1000);
        } else {
          this.createChart(this.$refs[`${pricingCmmt.prdtId}-${pricingCmmt.pricingId}`][0], pricingCmmt);
        }
      });
    },
    createChart($ref, pricingCmmt) {
      console.log('CREATE', $ref, pricingCmmt);
      const chart = am4core.create($ref, am4charts.XYChart);

      pricingCmmt.cmmtUnit = this.meterUnitFilters(pricingCmmt.cmmtUnit);

      chart.fontFamily = 'AppleSDGothicNeo';
      chart.paddingTop = 30;
      chart.paddingBottom = 0;
      chart.paddingLeft = 0;
      chart.paddingRight = 0;
      chart.cursor = new am4charts.XYCursor();
      chart.colors.list = this.colors.map((color) => am4core.color(color));

      chart.data = pricingCmmt.statList;

      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

      categoryAxis.dataFields.category = 'statYm';
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.tooltip.disabled = true;
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.renderer.labels.template.disabled = false;
      categoryAxis.renderer.labels.template.fontSize = 12;

      const valueAxis = this.createValueAxis(chart, {
        unit: pricingCmmt.cmmtUnit,
        opposite: false,
        max: pricingCmmt.max,
        range: pricingCmmt.cmmtVal,
      });

      const columnSeries = this.createColumn(chart, valueAxis, { key: 'usageQty', title: '사용량' });

      if (pricingCmmt.cmmtTermTypCd !== 'MTH') {
        const lineSeries = this.createLine(chart, valueAxis, { key: 'accumUsageQty', title: '누적사용량' });
        lineSeries.tooltip.pointerOrientation = 'vertical';
        lineSeries.tooltipText = `[bold]{categoryX}[/]
          월 사용량: {usageQty} {cmmtUnit}
          누적 사용량: {accumUsageQty} {cmmtUnit}
          사용률: {usageRate} %
        `;
      } else {
        columnSeries.tooltip.pointerOrientation = 'vertical';
        columnSeries.tooltipText = `[bold]{categoryX}[/]
          월 사용량: {accumUsageQty} {cmmtUnit}
          사용률: {usageRate} %
        `;
      }
    },
    createValueAxis(chart, { unit, opposite, max, range }) {
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.calculateTotals = true;
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.renderer.labels.template.disabled = false;
      valueAxis.renderer.labels.template.fontSize = 12;
      valueAxis.layout = 'absolute';
      valueAxis.renderer.opposite = opposite;
      valueAxis.title.text = `(${unit})`;
      valueAxis.title.rotation = 0;
      valueAxis.title.fontSize = 13;
      valueAxis.title.dy = -25;
      valueAxis.title.align = 'center';
      valueAxis.title.valign = 'top';
      valueAxis.title.fill = am4core.color('#6c9fb2');
      valueAxis.max = max;

      const cmmtUsageQty = valueAxis.axisRanges.create();
      cmmtUsageQty.value = range;
      cmmtUsageQty.grid.strokeDasharray = '10,3';
      cmmtUsageQty.grid.strokeWidth = 2;
      cmmtUsageQty.grid.stroke = am4core.color('#396478');
      cmmtUsageQty.grid.strokeOpacity = 1;

      return valueAxis;
    },

    createLine(chart, valueAxis, { key, title }) {
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.categoryX = 'statYm';
      series.dataFields.valueY = key;
      series.yAxis = valueAxis;
      series.name = title;
      series.stacked = true;
      series.tooltip.getStrokeFromObject = true;
      series.tooltip.getFillFromObject = false;
      series.tooltip.strokeOpacity = 1;
      series.tooltip.background.fillOpacity = 1;
      series.tooltip.label.fill = '#000';
      series.tooltip.background.filters.clear();

      let bullet = series.bullets.push(new am4charts.Bullet());
      let interfaceColors = new am4core.InterfaceColorSet();
      let circle = bullet.createChild(am4core.Circle);
      circle.stroke = interfaceColors.getFor('background');
      circle.horizontalCenter = 'middle';
      circle.verticalCenter = 'middle';
      circle.width = 10;
      circle.height = 10;

      return series;
    },
    createColumn(chart, valueAxis, { key, title }) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'statYm';
      series.dataFields.valueY = key;
      series.name = title;
      series.stacked = false;
      series.tooltip.getStrokeFromObject = true;
      series.tooltip.getFillFromObject = false;
      series.tooltip.strokeOpacity = 1;
      series.tooltip.background.fillOpacity = 1;
      series.tooltip.label.fill = '#000';
      series.tooltip.background.filters.clear();

      return series;
    },
    meterUnitFilters(meterUnitCd) {
      if (meterUnitCd === 'KRW') {
        return '￦';
      } else if (meterUnitCd === 'USD') {
        return '$';
      } else if (meterUnitCd === 'REQ') {
        return 'Request';
      } else {
        return meterUnitCd;
      }
    },
  },
};
</script>

<style scoped>
.modal.wid-1000 .modal-content {
  max-width: none;
  min-width: auto;
  width: 1000px;
}

.modal.wid-800 .modal-content {
  max-width: none;
  min-width: auto;
  width: 800px;
}

.flex .type-01 {
  font-size: 13px;
}

.flex .pos-rt {
  position: absolute;
  top: 0;
  right: 0;
}

.flex .type-01 > .input,
.flex .type-01 > .button,
.flex .type-01 > span {
  vertical-align: middle;
}

.px-14 {
  padding-left: 14px !important;
  padding-right: 14px !important;
}

.info-02 {
  font-size: 12px;
  line-height: 1.5;
  color: #666;
}

.is-scroll {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}

.flex .type-01 > span + .input {
  margin-left: 8px;
}

.flex .pos-rt .unit {
  display: inline-block;
  margin-top: 8px;
}

.flex .type-01 > span + .input {
  margin-left: 8px;
}

.table-2.lt-gray {
  border-top-color: #ececec;
}

.scroll-table .g_left {
  float: left;
  border-right: 1px solid #ececec;
  width: 110px;
}

.scroll-table .g_left thead th {
  height: 113px;
}

.scroll-table .g_left .table-2 th:last-child,
.scroll-table .g_left .table-2 td:last-child {
  border-right: 0;
}

.scroll-table .g_right {
  overflow-y: auto;
}

.scroll-table .g_right .table-2 th:first-child,
.scroll-table .g_right .table-2 td:first-child {
  border-left: 0;
}

.scroll-table .g_right .table-2 th,
.scroll-table .g_right .table-2 td {
  white-space: nowrap;
  border-left: 1px solid #ececec;
  width: 107px;
}

.scroll-table .g_left td,
.scroll-table .g_right td {
  height: 63px;
}

.select.is-w-100per {
  width: 100%;
}

.select.is-hint {
  border-color: #ddd;
  color: #ccc;
}
/*.ico-delete-01 {*/
/*  display: block;*/
/*  background: url('~@assets/img/ico-delete-off.svg') 50% 50% no-repeat;*/
/*  margin: 0 auto;*/
/*  width: 16px;*/
/*  height: 26px;*/
/*  text-indent: -9999px;*/
/*  font-size: 0;*/
/*}*/
.table-2.line-lt th,
.table-2.line-lt td {
  border-left: 1px solid #e3ebf1;
}
.is-w-66 {
  width: 66px !important;
}
.is-w-66 .ico-delete-01 {
  width: 56px;
}

.scroll-table .g_left table {
  /*width: 110px;*/
  width: 100%;
  min-width: 0;
}
.scroll-table .g_right .table-2 th:first-child,
.scroll-table .g_right .table-2 td:first-child {
  border-left: 0;
}

.pos-01 {
  line-height: 110%;
}
.pos-01 .ti {
  display: block;
  float: left;
}
.pos-01 .tx {
  display: block;
  padding: 0 0 0 90px;
}

.modal.wid-1000 .modal-content {
  max-width: none;
  min-width: auto;
  width: 1000px;
}
.info-01 {
  font-size: 16px;
  color: #333;
  margin: 20px 0 0;
  background-color: #f8f8f8;
  padding: 21px 20px;
}
.info-01 .ti {
  padding-right: 15px;
}
.title-01 {
  font-size: 18px;
  font-weight: bold;
  color: #4a4a4a;
  line-height: 21px;
}
.table-2.line-lt th:first-child,
.table-2.line-lt td:first-child {
  border-left: 0;
}
.table-2.line-lt th,
.table-2.line-lt td {
  border-left: 1px solid #e3ebf1;
}

.modal.wid-1200 .modal-content {
  max-width: none;
  min-width: auto;
  width: 1200px;
}
.modal-title {
  padding-right: 40px;
  font-size: 24px;
  margin-bottom: 22px;
  padding-bottom: 22px;
  border-bottom: 1px solid #d4d4d4;
  font-weight: 400 !important;
  color: #333;
}
.is-scroll {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
.title-01 {
  font-size: 18px;
  font-weight: bold;
  color: #4a4a4a;
  line-height: 21px;
}
.info-01 {
  font-size: 16px;
  color: #333;
  margin: 20px 0 0;
  background-color: #f8f8f8;
  padding: 21px 20px;
}
.info-01 .ti {
  padding-right: 15px;
}
.px-20,
.detail-item-header {
  padding-left: 20px !important;
  padding-right: 20px !important;
}
.list-01 {
  margin-top: 25px;
}
.list-01 li {
  position: relative;
  font-size: 13px;
  padding: 0 0 0 14px;
}
.list-01 li:before {
  content: '';
  position: absolute;
  top: 5px;
  left: 0;
  border-radius: 50%;
  width: 4px;
  height: 4px;
  background-color: #333;
}
.list-01 li .ti {
  display: inline-block;
  float: left;
  width: 90px;
}
.list-01 li .tx {
  display: block;
  padding: 0 0 0 90px;
}
.list-01 li + li {
  margin-top: 10px;
}
.chart__box.type2 {
  margin: 30px 0 0;
}

.modal-content {
  background-color: #fff;
  border-radius: 4px;
  display: -ms-flexbox !important;
  display: flex !important;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-flow: column;
  flex-flow: column;
  overflow-y: auto;
  padding: 30px;
  min-height: 300px;
  min-width: 600px;
  max-width: 60vw;
  width: 100%;
  max-height: 85vh;
}
</style>
