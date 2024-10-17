<template>
  <div v-if="visible">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <div class="z-30 p-8 text-sm text-gray-700 rounded policy-content modal-content">
      <h3 class="modal-title">{{ $t('cost.contractInformation') }}</h3>

      <button class="absolute top-0 right-0 close-policy-modal mt-7 mr-7">
        <img src="@/assets/images/ico-btn-search-close.svg" alt="." @click="$emit('close')" />
      </button>

      <div v-show="!loading" class="is-scroll">
        <div v-for="(ctrtCmmt, i) in chartData" :key="i">
          <div>
            <div v-if="ctrtCmmt.yearUseYn === 'Y'" class="title-01">
              {{ ctrtCmmt.ctrtNm }} {{ ctrtCmmt.yearSepCd }}차년도
            </div>
            <div v-else class="title-01">{{ ctrtCmmt.ctrtNm }}</div>
            <div class="info-01">
              <span class="ti">{{ $t('cost.contractPeriod') }}</span>
              <strong class="tx">{{ ctrtCmmt.cmmtStrDt | date }} ~ {{ ctrtCmmt.cmmtEndDt | date }} </strong>
            </div>

            <div>
              <div class="px-20">
                <ul class="list-01">
                  <!--                  <li>-->
                  <!--                    <span class="ti">사용기간</span>-->
                  <!--                    <strong class="tx">-->
                  <!--                      {{ ctrtCmmt.cmmtStrDt | date }} ~-->
                  <!--                      &lt;!&ndash;현재 날짜가 유효기간 내의 날짜라면 전날 날짜 표출&ndash;&gt;-->
                  <!--                      <template v-if="$options.filters.date(ctrtCmmt.cmmtEndDt) >= today">-->
                  <!--                        {{ yesterday }}-->
                  <!--                      </template>-->
                  <!--                      <template v-else-->
                  <!--                        >&lt;!&ndash;현재 날짜가 유효기간 내의 날짜가 아니라면 유효기간 종료일 표출&ndash;&gt;-->
                  <!--                        {{ ctrtCmmt.cmmtEndDt | date }}-->
                  <!--                      </template>-->
                  <!--                    </strong>-->
                  <!--                  </li>-->
                  <li>
                    <span v-if="$i18n.locale === 'en'" class="tien" >{{ $t('cost.contractAmount') }}</span>
                    <span v-else class="ti" >{{ $t('cost.contractAmount') }}</span>
                    <strong class="tx"> ₩{{ ctrtCmmt.cmmtAmt.toLocaleString() }} </strong>
                  </li>
                  <li>
                    <span v-if="$i18n.locale === 'en'" class="tien" >{{ $t('cost.amountUsed') }}</span>
                    <span v-else class="ti">{{ $t('cost.amountUsed') }}</span>
                    <strong class="tx"> ₩{{ ctrtCmmt.accumUseAmt.toLocaleString() }} </strong>
                  </li>
                  <li>
                    <span v-if="$i18n.locale === 'en'" class="tien" >{{ $t('cost.achievementRate') }}</span>
                    <span v-else class="ti">{{ $t('cost.achievementRate') }}</span>
                    <strong class="tx"> {{ ctrtCmmt.useRate.toFixed(1) }}% </strong>
                  </li>
                </ul>
                <div class="chart__box type2">
                  <div style="display: none">{{ ctrtCmmt }}</div>
                  <div>
                    <div :ref="`${ctrtCmmt.ctrtId}-${ctrtCmmt.cmmtStrDt}`"></div>
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
import { i18n } from '../../../../public/locales/i18n';
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
  name: 'CtrtCommitmentPopup',
  components: { DataLoading },
  filters: {
    date(value) {
      return moment(value).format('yy.MM.DD');
    },
  },
  props: {
    visible: {
      type: Boolean,
    },
    popupParams: {
      type: Object,
    },
  },
  data() {
    return {
      chartData: [],
      groupByYear: [],
      today: moment().format('yy.MM.DD'),
      yesterday: moment().subtract(1, 'day').format('yy.MM.DD'),
      loading: true,
      params: {},
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
        .fetchCtrtCmmtStat({
          ctrtId: this.popupParams.ctrtId,
          usageType: this.popupParams.usageType,
        })
        .then((response) => {
          if (response.data.code === 'SUCCESS') {
            const result = response.data.data;
            const chartData = result.filter((item) => this.$options.filters.date(item.cmmtStrDt) < this.today);
            this.chartData = chartData.reverse();
          } else {
            console.log('fail response', response);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    processing() {
      this.chartData.forEach((ctrtCmmt, cmmtIdx) => {
        // 과금 ID, 약정기간타입코드, 약정시작일, 약정종료일, 월별통계목록
        const { cmmtId, yearUseYn, cmmtStrDt, cmmtEndDt, statList } = ctrtCmmt;

        ctrtCmmt.max = ctrtCmmt.cmmtAmt;

        if (!statList || !statList.length || !statList[0].statYm) return;
        ctrtCmmt.lastStat = statList[statList.length - 1];
        //if (this.popupParams.lastBillYm) {
          //마지막 청구서 발행 년월 이후에 생성된 사용량 데이터는 제외
          // statList.forEach((item, index) => {
          //   if (moment(this.popupParams.lastBillYm).format('YYYYMM') < moment(item.statYm).format('YYYYMM')) {
          //     statList.splice(index, 1);
          //   }
          // });

          // const statYmList = _.chain(statList)
          //   .map(({ statYm }) => statYm)
          //   .uniq()
          //   .value();
          // const cmmtStartDate = moment(cmmtStrDt);
          // let cmmtEndDate = moment(cmmtEndDt);
          // if (moment(cmmtEndDt).format('yy.MM') >= moment(this.popupParams.lastBillYm).format('yy.MM')) {
          //   cmmtEndDate = moment(this.popupParams.lastBillYm);
          // }
          //
          // const monthDiff = cmmtEndDate.diff(cmmtStartDate, 'month');
          //
          // // 통계 데이터 없을 경우 빈 값으로 생성
          // for (let i = 0; i <= monthDiff; i++) {
          //   let next;
          //   if (i === 0) next = cmmtStartDate;
          //   else next = cmmtStartDate.add(1, 'month');
          //   const nextYm = next.format('YYYYMM');
          //   if (!statYmList.includes(nextYm)) {
          //     statList.push({ statYm: nextYm, accumUseAmt: 0, useAmt: 0 });
          //   }
          // }

          // 날짜순정렬
          ctrtCmmt.statList = _.sortBy(statList, 'statYm');

          // 누적 사용량 빈 값일 경우 이전 월 값 대입
          statList.forEach((stat, i) => {
            //stat.cmmtUnit = pricingCmmt.cmmtUnit;
            stat.statYear = stat.statYm.substring(0, 4);
            stat.statYm = moment(stat.statYm).format('YY.MM');

            if (i !== 0 && !stat.accumUseAmt) stat.accumUseAmt = statList[i - 1].accumUseAmt;
            //if (i !== 0 && !stat.useRate) stat.useRate = statList[i - 1].useRate;

            stat.useRate = ((stat.accumUseAmt / ctrtCmmt.cmmtAmt) * 100 || 0).toFixed(1);

            if (stat.accumUseAmt > ctrtCmmt.max) ctrtCmmt.max = stat.accumUseAmt;
          });

          this.createChart(this.$refs[`${ctrtCmmt.ctrtId}-${ctrtCmmt.cmmtStrDt}`][0], ctrtCmmt);
          this.$refs[`${ctrtCmmt.ctrtId}-${ctrtCmmt.cmmtStrDt}`][0].style.height = '400px';
        //}
      });
    },
    createChart($ref, ctrtCmmt) {
      console.log('CREATE', $ref, ctrtCmmt);
      const chart = am4core.create($ref, am4charts.XYChart);

      chart.fontFamily = 'AppleSDGothicNeo';
      chart.paddingTop = 30;
      chart.paddingBottom = 0;
      chart.paddingLeft = 0;
      chart.paddingRight = 0;
      chart.cursor = new am4charts.XYCursor();
      chart.colors.list = this.colors.map((color) => am4core.color(color));

      chart.data = ctrtCmmt.statList;

      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

      categoryAxis.dataFields.category = 'statYm';
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.tooltip.disabled = true;
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.renderer.labels.template.disabled = false;
      categoryAxis.renderer.labels.template.fontSize = 12;

      const valueAxis = this.createValueAxis(chart, {
        unit: '₩',
        opposite: false,
        max: ctrtCmmt.max,
        range: ctrtCmmt.cmmtAmt,
      });

      const columnSeries = this.createColumn(chart, valueAxis, { key: 'useAmt', title: '사용량' });

      const lineSeries = this.createLine(chart, valueAxis, { key: 'accumUseAmt', title: '누적사용량' });
      lineSeries.tooltip.pointerOrientation = 'vertical';

      if (i18n.locale === 'en'){
        columnSeries.tooltipText = `[bold]{categoryX}[/]
            Monthly usage: ₩{useAmt}
            Cumulative usage: ₩{accumUseAmt}
            Achievement rate: {useRate}%
          `;
      }else{
        columnSeries.tooltipText = `[bold]{categoryX}[/]
            월 사용 금액: ₩{useAmt}
            누적 사용금액: ₩{accumUseAmt}
            달성률: {useRate}%
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

      const cmmtUseAmt = valueAxis.axisRanges.create();
      cmmtUseAmt.value = range;
      cmmtUseAmt.grid.strokeDasharray = '10,3';
      cmmtUseAmt.grid.strokeWidth = 2;
      cmmtUseAmt.grid.stroke = am4core.color('#396478');
      cmmtUseAmt.grid.strokeOpacity = 1;

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
.list-01 li .tien {
  display: inline-block;
  float: left;
  width: 120px;
}.list-01 li .ti {
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
