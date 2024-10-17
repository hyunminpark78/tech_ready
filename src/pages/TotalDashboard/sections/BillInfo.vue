<template>
  <!-- 06월 청구 금액 -->
  <div class="box-wrap">
    <template v-if="existData">
      <div class="title">
        <!--        <h4 class="tit-wrap">{{ billData.chrgYm | toYearMonth }} 청구 금액</h4>-->
        <h4 class="tit-wrap">{{ $t('dashboard.monthBillingAmount', { value: chrgYm }) }}</h4>
        <button class="more single" @click="routeDetail(null)">{{ $t('common.button.viewDetails') }}</button>
      </div>
      <div class="list9-wrap h204">
        <!-- col -->
        <div class="col" style="padding: 0 24px 0 0; border-right: thin solid #e3ebf1">
          <div class="tit4-wrap">{{ $t('dashboard.billingSummary') }}</div>
          <div class="pr line-del">
            <span>￦</span><span id="jsCount10">{{ billData.billAmt | number }}</span>
            <span style="font-size: 15px; color: #6c9fb2">{{ $t('dashboard.includingVAT') }}</span>
          </div>
          <div class="pst-list-wrap">
            <span v-if="billData.dwnYn == 'Y'" style="font-size: 14px"
              >{{ $t('dashboard.billedAmountPrepaid') }} : &#8361;{{ billData.dwnBillAmt | number }}</span
            >
            <span v-else-if="billData.pstYn == 'Y' && billData.pstBillAmt == 0" style="font-size: 14px"
              >{{ $t('dashboard.billedAmountPostPayment') }} : &#8361;{{ billData.pstBillAmt | number }}</span
            >
            <span v-else-if="billData.pstYn == 'L' && billData.pstBillAmt > 0" style="font-size: 14px"
              >{{ $t('dashboard.billedAmountPostPayment') }} : &#8361;{{ billData.pstBillAmt | number }}</span
            >
          </div>
          <div class="ls" style="padding-top: 10px">
            <span class="t">{{ $t('dashboard.cloudUsageFee') }}</span>
            <span class="p">￦ {{ billData.krwUnblendCost | number }}</span>
          </div>
          <div class="ls">
            <span class="t">{{ $t('dashboard.salesDiscount') }}</span>
            <span class="p pink">
              <img src="@/assets/images/ico-pink-mini.svg" alt="." />
              ₩ {{ billData.dscntAmt | number }}
            </span>
          </div>
        </div>
        <!-- //col -->
        <!-- col -->
        <div class="col" style="margin-left: 24px !important">
          <div class="tit4-wrap">{{ $t('dashboard.comparisonOfPrevious') }}</div>
          <template v-if="Number(billData.rate) > 0">
            <div class="pr p46" style="color: #00a5ed; letter-spacing: -1px; font-size: 24px; margin: 0 0 12px">
              <img
                src="@/assets/images/ico-blue2.svg"
                alt="."
                style="float: left; vertical-align: top; margin: 8px 5px 0 0; transform: rotate(180deg)"
              />
              <span id="jsCount13">{{ billData.rate | numberToFixed }}%</span>
            </div>
          </template>
          <template v-else-if="Number(billData.rate) < 0">
            <div class="pr p46" style="color: #00a5ed; letter-spacing: -1px; font-size: 24px; margin: 0 0 12px">
              <img
                src="@/assets/images/ico-blue2.svg"
                alt="."
                style="float: left; vertical-align: top; margin: 8px 5px 0 0"
              />
              <span id="jsCount13">{{ billData.rate | numberToFixed }}%</span>
            </div>
          </template>
          <template v-else>
            <div class="pr p46" style="color: #00a5ed; letter-spacing: -1px; font-size: 24px; margin: 0 0 12px">
              <span id="jsCount13">{{ billData.rate }}%</span>
            </div>
          </template>
          <!-- <template v-if="loading">
            <div class="relative" style="height: 110px">
              <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
                <div class="mb-4 loading_rotate">
                  <span class="loadingcolor"></span>
                </div>
                <div class="loading_txt">Loading...</div>
              </div>
            </div>
          </template> -->
          <DataLoadingOverlay v-if="loading" :disabled-text="true" :height="100"></DataLoadingOverlay>
          <div
            v-show="!loading"
            id="billInfoChart"
            class="chart-wrap mt-15"
            style="font-size: 24px; letter-spacing: -0.03px; text-align: center; color: #fff; line-height: 110px"
          >
            Chart
          </div>
        </div>
        <!-- //col -->
      </div>
    </template>
    <template v-else>
      <div class="title">
        <h4 class="tit-wrap">{{ $t('dashboard.billingAmount') }}</h4>
      </div>
      <div class="flex flex-col items-center justify-center" style="height: 171px">
        <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
        <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
      </div>
    </template>
  </div>
  <!-- //약06월 청구 금액 -->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay.vue';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: { DataLoadingOverlay },
  data() {
    return {
      loading: true,
      existData: false,
      chrgYm: '',
      chartParam: {
        vndr: 'aws',
        cmpnId: '1',
        tz: '+09:00',
        accList: [],
        bzList: [],
        rgnList: [],
        rsrcType: '',
        gridType: 'rs',
        today: '',
      },
      billData: {
        chrgYm: '',
        billAmt: 0,
        dwnYn: '',
        dwnBillAmt: 0,
        pstYn: '',
        pstBillAmt: 0,
        krwUnblendCost: 0,
        dscntAmt: 0,
        rate: 0.0,
      },
    };
  },
  computed: {
    ...mapState('totalDashboard', ['filter', 'isSearch', 'billInfo']),
  },
  watch: {
    // 다국어 변경 시 차트를 재매핑
    '$i18n.locale': 'setChart',
    isSearch(newVal) {
      if (newVal.isSearch) {
        this.setData();
      }
    },
  },
  created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    am4core.options.autoDispose = true;
  },
  methods: {
    ...mapActions('totalDashboard', ['fetchBillSummary', 'fetchBillDetail', 'setBillDetailNull']),
    ...mapActions('common', ['waitGettingCtrts']),
    async setData() {
      this.loading = true;
      await this.waitGettingCtrts();
      try {
        const ctrtId = this.filter.contract.ctrtId;
        await this.fetchBillSummary({ ctrtId: ctrtId });
        if (this.billInfo != null) {
          this.billData = { ...this.billInfo };
          this.existData = true;
          await this.fetchBillDetail({ ctrtId: ctrtId, chrgYm: this.billInfo.chrgYm });
          this.setChart();
        } else {
          this.existData = false;
          this.setBillDetailNull();
        }
      } catch (err) {
        console.error('setData', err);
      }
      this.loading = false;
    },
    setChart() {
      let chart = am4core.create('billInfoChart', am4charts.XYChart);
      if (this.billInfo.beforeMonthChrgYm == null) {
        chart.data = [
          {
            category:
              i18n.locale === 'ko'
                ? moment(this.billInfo.chrgYm, 'YYYYMM').subtract(1, 'M').format('YYYYMM').substring(4) + '월'
                : moment(this.billInfo.chrgYm, 'YYYYMM').subtract(1, 'M').format('MMM'),
            value: 0,
            remaining: this.billInfo.billAmt,
          },
          {
            category:
              i18n.locale === 'ko'
                ? this.billInfo.chrgYm.substring(4) + '월'
                : moment(this.billInfo.chrgYm, 'YYYYMM').format('MMM'),
            value: this.billInfo.billAmt,
            remaining: this.billInfo.billAmt,
          },
        ];
      } else {
        chart.data = [
          {
            // category: this.billInfo.beforeMonthChrgYm.substring(4) + '월',
            category:
              i18n.locale === 'ko'
                ? this.billInfo.beforeMonthChrgYm.substring(4) + '월'
                : moment(this.billInfo.beforeMonthChrgYm, 'YYYYMM').format('MMM'),
            value: this.billInfo.beforeMonthBillAmt,
            remaining: this.billInfo.billAmt,
          },
          {
            category:
              i18n.locale === 'ko'
                ? this.billInfo.chrgYm.substring(4) + '월'
                : moment(this.billInfo.chrgYm, 'YYYYMM').format('MMM'),
            value: this.billInfo.billAmt,
            remaining: this.billInfo.billAmt,
          },
        ];
      }

      // 커서 십자선 숨기기
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.maxTooltipDistance = -1;
      chart.cursor.lineY.disabled = true;
      chart.cursor.lineX.disabled = true;
      chart.fontFamily = 'AppleSDGothicNeo';
      chart.tooltip.label.fontSize = 13;
      chart.autoMargins = true;
      chart.paddingTop = 0;
      chart.paddingBottom = 0;
      chart.paddingLeft = 0;
      chart.paddingRight = 0;

      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.gridAlpha = 0;
      categoryAxis.dataFields.category = 'category';
      categoryAxis.renderer.grid.template.disabled = true; // 축 제거
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 0;
      categoryAxis.renderer.labels.template.fill = am4core.color('#4a4a4a');
      categoryAxis.renderer.cellStartLocation = 0.3;
      categoryAxis.renderer.cellEndLocation = 0.7;
      categoryAxis.fontSize = 15;
      categoryAxis.tooltip.disabled = true;

      var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.gridAlpha = 0;
      valueAxis.min = 0;
      // valueAxis.max = this.billInfo.billAmt;
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.baseGrid.disabled = true; // value = 0 일때 선 삭제
      valueAxis.renderer.grid.template.disabled = true; // 축 제거
      valueAxis.renderer.labels.template.fontSize = 15;
      valueAxis.renderer.labels.template.adapter.add('text', function (text, target) {
        return '';
      }); // 라벨 삭제

      var series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.valueX = 'remaining';
      series2.dataFields.categoryY = 'category';
      series2.strokeWidth = 0;
      series2.fill = am4core.color('#c5c5c5');
      series2.columns.template.column.cornerRadiusTopLeft = 5;
      series2.columns.template.column.cornerRadiusTopRight = 5;
      series2.columns.template.column.cornerRadiusBottomLeft = 5;
      series2.columns.template.column.cornerRadiusBottomRight = 5;
      series2.clustered = false;

      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = 'value';
      series.dataFields.categoryY = 'category';
      series.strokeWidth = 0;
      let chrgYm =
        i18n.locale === 'ko'
          ? this.billInfo.chrgYm.substring(4) + '월'
          : moment(this.billInfo.chrgYm, 'YYYYMM').format('MMM');
      series.columns.template.adapter.add('fill', function (fill, target) {
        if (target.dataItem && target.dataItem.categories.categoryY === chrgYm) {
          return am4core.color('#00a5ed');
        } else {
          return fill;
        }
      });
      series.columns.template.column.cornerRadiusTopLeft = 5;
      series.columns.template.column.cornerRadiusTopRight = 5;
      series.columns.template.column.cornerRadiusBottomLeft = 5;
      series.columns.template.column.cornerRadiusBottomRight = 5;

      series.tooltipText = `{category} : ₩ {value.formatNumber('#,###.')}`;
      series.tooltip.fontSize = 13;
      series.tooltip.label.fontSize = 13;
      series.tooltip.autoTextColor = false;
      series.tooltip.label.fill = am4core.color('#FFFFFF');
      series.clustered = false;

      this.chrgYm =
        i18n.locale === 'ko'
          ? moment(this.billInfo.chrgYm, 'YYYYMM').format('YY년 MM월')
          : moment(this.billInfo.chrgYm, 'YYYYMM').format('MMM, YYYY');
    },
    routeDetail(value) {
      value = {};
      value.ctrtId = this.filter.contract.ctrtId;
      value.chrgYm = this.billInfo.chrgYm;
      value.detail = 'Y';
      this.$router.push({
        name: '청구정보',
        params: value,
        props: true,
      });
    },
  },
};
</script>

<style>
.pst-list-wrap {
  border-bottom: 1px solid #e3ebf1 !important;
  padding: 0 0 12px !important;
  height: 38px;
}
.line-del {
  border-bottom: none !important;
  margin: 0px !important;
  padding: 0px !important;
}
.h204 {
  height: 204px !important;
}
.p46 {
  padding: 0 0 46px !important;
}
.mt-15 {
  margin-top: -15px !important;
}
</style>
