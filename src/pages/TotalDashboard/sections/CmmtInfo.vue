<template>
  <div class="grid2-wrap col2">
    <div class="box-wrap pb24 list-wrap">
      <div class="title">
        <h4 class="tit-wrap">{{ $t('dashboard.commitmentStatus') }}</h4>
        <button v-if="isAuth" class="more single" @click="routeDetail">{{ $t('common.button.viewDetails') }}</button>
      </div>
      <div v-if="!isAuth" class="flex flex-col items-center justify-center" style="height: 180px">
        <img src="@/assets/images/ico-nodata-chart.svg" alt="." style="width: 30%; height: 30%" />
        <p class="mt-3 text-gray-700 text-center" style="font-size: 15px">
          약정 현황 정보를 제공하는 서비스입니다.<br />
          사용 등록을 원하실 경우 관리자<br />
          <span style="color: #00a5ed; font-size: 15px">(cmp-help@sktelecom.com)</span>에 문의하시길 바랍니다.
        </p>
      </div>
      <div v-else class="list7-wrap">
        <div class="col">
          <div class="tit4-wrap">{{ $t('dashboard.coverage') }}</div>
          <DataLoadingOverlay v-if="loading" :height="171"></DataLoadingOverlay>
          <NoDataOverlay v-else-if="!existData" :icon-type="'chart'" :height="150"></NoDataOverlay>
          <div v-show="!loading && existData" id="currentCoverageChart" class="chart-wrap" style="height: 171px"></div>
        </div>
        <div class="col">
          <div class="tit4-wrap">{{ $t('dashboard.totalSavings') }}</div>
          <div class="pr">
            <img src="@/assets/images/ico-blue2.svg" alt="." />
            <span>￦</span><span id="jsCount13">{{ costSavings }}</span>
          </div>
          <div v-if="filter.cspTypCd === 'AWS'" class="con2">
            <div class="ls block">
              <span class="t">Savings Plans</span>
              <span class="p">￦{{ numberCutDecimal(netSaveCost.sp.netSaveCost) }}</span>
            </div>
            <div class="ls block">
              <span class="t">Reserved Instances</span>
              <span class="p">￦{{ numberCutDecimal(netSaveCost.ri.netSaveCost) }}</span>
            </div>
          </div>
          <div v-if="filter.cspTypCd === 'AZURE'" class="con2">
            <div class="tit4-wrap mt-2">{{ $t('dashboard.savingsRate') }}</div>
            <div class="pr last">
              <span id="jsCount13">{{ costSavingsRate }}</span
              >%
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-wrap pb24 list-wrap">
      <div class="title">
        <h4 class="tit-wrap">{{ $t('dashboard.commitmentRecommendation') }}</h4>
        <button v-if="isAuth" class="more single" @click="routeDetail">{{ $t('common.button.viewDetails') }}</button>
      </div>
      <div v-if="!isAuth" class="flex flex-col items-center justify-center" style="height: 180px">
        <img src="@/assets/images/ico-nodata-chart.svg" alt="." style="width: 30%; height: 30%" />
        <p class="mt-3 text-gray-700 text-center" style="font-size: 15px">
          약정 추천 정보를 제공하는 서비스입니다.<br />
          사용 등록을 원하실 경우 관리자<br />
          <span style="color: #00a5ed; font-size: 15px">(cmp-help@sktelecom.com)</span>에 문의하시길 바랍니다.
        </p>
      </div>
      <div v-else class="list7-wrap">
        <!-- col -->
        <div class="col">
          <div class="tit4-wrap">{{ $t('dashboard.estimatedTotalCoverage') }}</div>
          <DataLoadingOverlay v-if="loading" :height="171"></DataLoadingOverlay>
          <NoDataOverlay v-else-if="!existData" :icon-type="'chart'" :height="150"></NoDataOverlay>
          <div v-show="!loading && existData" id="predictCoverageChart" class="chart-wrap" style="height: 171px"></div>
        </div>
        <div class="col pink">
          <div class="tit4-wrap">{{ $t('dashboard.estimatedMonthlySavings') }}</div>
          <div class="pr">
            <img src="@/assets/images/ico-pink.svg" alt="." />
            <span>￦</span><span id="jsCount14">{{ numberCutDecimal(predictSaveCost.totSaveCost) }}</span>
          </div>
          <div v-if="filter.cspTypCd === 'AWS'" class="con2">
            <div class="ls block">
              <span class="t">Savings Plans</span>
              <span class="p">
                <img
                  src="@/assets/images/ico-pink.svg"
                  alt="."
                  style="float: left; vertical-align: top; margin: 8px 5px 0 0; width: 10px; height: auto"
                />
                <span>￦{{ numberCutDecimal(predictSaveCost.spTotSaveCost) }}</span>
              </span>
            </div>
            <div class="ls block">
              <span class="t">Reserved Instances</span>
              <span class="p">
                <img
                  src="@/assets/images/ico-pink.svg"
                  alt="."
                  style="float: left; vertical-align: top; margin: 8px 5px 0 0; width: 10px; height: auto"
                />
                <span>￦{{ numberCutDecimal(predictSaveCost.riTotSaveCost) }}</span>
              </span>
            </div>
          </div>
          <div v-if="filter.cspTypCd === 'AZURE'" class="con2">
            <div class="tit4-wrap mt-2">{{ $t('dashboard.additionalSavings') }}</div>
            <div class="pr last">
              <span id="jsCount13">{{ predictCostSavingRate }}</span
              >%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as _ from 'lodash';
import { numberCutDecimal, numberProcess } from '@/pages/Opti/CostOpti/CmmtPsblTgt/CostOptiCommon';
import { hasOptiRole } from './role-permission';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay.vue';
import NoDataOverlay from '@/components/Overlays/NoDataOverlay.vue';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: { DataLoadingOverlay, NoDataOverlay },
  data() {
    return {
      loading: true,
      existData: false,
      tgtSummary: {},
      ctrtServicesList: [],
      predictSaveCost: {},
      label: [],
      titles: {
        // AWS: { cmmt: '온디맨드' },
        // AZURE: { cmmt: '종량제' },
        // GCP: { cmmt: '온디맨드' }, // TODO: GCP 화면 추가 시 변경 필요!
      },
      isAuth: hasOptiRole(),
    };
  },
  computed: {
    ...mapState('totalDashboard', ['filter', 'netSaveCost', 'dashboard', 'isSearch']),
    getCmmtTitle() {
      return this.titles[this.filter.cspTypCd].cmmt;
    },
    //절감액
    costSavings() {
      let number = 0;
      if (this.netSaveCost.sp && this.netSaveCost.sp.netSaveCost) number += this.netSaveCost.sp.netSaveCost;
      if (this.netSaveCost.ri && this.netSaveCost.ri.netSaveCost) number += this.netSaveCost.ri.netSaveCost;
      return numberCutDecimal(number);
    },
    // 절감률
    costSavingsRate() {
      // 필요 시 계산식 추가 (AWS용 참조)
      return numberProcess(this.netSaveCost.ri.netSaveRt);
    },
    // 추가 절감액
    predictCostSavings() {
      return numberCutDecimal(this.predictSaveCost.totSaveCost);
    },
    // 추가 절감률
    predictCostSavingRate() {
      if (this.predictSaveCost.totOnDmndCost > 0)
        return numberProcess((this.predictSaveCost.totSaveCost / this.predictSaveCost.totOnDmndCost) * 100);
      else return 0;
    },
  },
  watch: {
    // 다국어 변경 시 차트를 재매핑
    '$i18n.locale': 'setData',
    isSearch(newVal) {
      if (newVal.isSearch) {
        this.setData();
      }
    },
  },
  created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    // am4core.options.autoDispose = true;

    // INIT
    this.setData();
  },
  methods: {
    ...mapActions('totalDashboard', ['fetchPredictCoverage', 'fetchCurrentCoverage', 'fetchCostOptiSummary']),
    ...mapActions('common', ['waitGettingCtrts']),
    numberCutDecimal(number) {
      // function wrapper for vue
      return numberCutDecimal(number);
    },
    numberProcess(number) {
      // function wrapper for vue
      return numberProcess(number);
    },
    async setData() {
      this.loading = true;
      if (i18n.locale === 'ko') {
        this.titles = {
          AWS: { cmmt: '온디맨드' },
          AZURE: { cmmt: '종량제' },
          GCP: { cmmt: '온디맨드' }, // TODO: GCP 화면 추가 시 변경 필요!
        };
      } else {
        this.titles = {
          AWS: { cmmt: 'On-Demand' },
          AZURE: { cmmt: 'pay as you go' },
          GCP: { cmmt: 'On-Demand' }, // TODO: GCP 화면 추가 시 변경 필요!
        };
      }

      let strDate = moment().subtract(1, 'M').format('YYYYMMDD');
      let endDate = moment().format('YYYYMMDD');
      await this.waitGettingCtrts();
      await this.fetchCostOptiSummary({ ctrtId: this.filter.contract.ctrtId, strDate: strDate, endDate: endDate });
      this.createCoverageChart();
      this.loading = false;
    },
    createCoverageChart() {
      const data = this.chartData();
      // CURRENT
      const currentCoverageChart = am4core.create('currentCoverageChart', am4charts.PieChart);
      this.chartEventDisabled(currentCoverageChart);
      this.createPieSeries('CURRENT', currentCoverageChart, data.current);
      currentCoverageChart.fontFamily = 'AppleSDGothicNeo';
      currentCoverageChart.innerRadius = am4core.percent(65);

      // PREDICT
      const predictCoverageChart = am4core.create('predictCoverageChart', am4charts.PieChart);
      this.chartEventDisabled(predictCoverageChart);
      this.createPieSeries('PREDICT', predictCoverageChart, data.predict);
      predictCoverageChart.fontFamily = 'AppleSDGothicNeo';
      predictCoverageChart.innerRadius = am4core.percent(65);
    },
    chartData() {
      let chartData = [];
      const dashboardData = _.cloneDeep(this.dashboard);
      this.existData = dashboardData.length > 0;
      this.ctrtServices(dashboardData);
      this.calculPredictSaveCost(dashboardData);

      const currentCoverage = this.calculCurrentCoverage(dashboardData);
      const predictCoverage = this.calculPredictCoverage(dashboardData);
      chartData = { current: currentCoverage, predict: predictCoverage };
      this.setChartDataAttibute(chartData);

      // this.loading = false;
      return chartData;
    },
    chartEventDisabled(chart) {
      chart.seriesContainer.events.on('click', (event) => {
        event.target.interactionsEnabled = false;
      });
    },
    createPieSeries(type, chart, data) {
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      this.chartLabelDisabled(pieSeries);
      this.chartMiddleLabel(type, pieSeries, data);

      pieSeries.dataFields.value = 'cmmtCvrgRt';
      pieSeries.dataFields.category = 'category';
      pieSeries.slices.template.propertyFields.fill = 'fill';
      pieSeries.data = data;
      pieSeries.slices.template.events.on('over', function (ev) {
        if (ev.target.dataItem.dataContext.fill === '#dedede') {
          pieSeries.tooltip.label.fill = am4core.color('#000000');
        } else {
          pieSeries.tooltip.label.fill = am4core.color('#FFFFFF');
        }
        pieSeries.slices.template.tooltipText = `{category}: {value.formatNumber('##.00')}%`;
      });
      pieSeries.tooltip.fontSize = 13;
      pieSeries.tooltip.label.fontSize = 13;
      pieSeries.tooltip.autoTextColor = false;
      // pieSeries.tooltip.label.fill = am4core.color('#FFFFFF');
    },
    chartLabelDisabled(series) {
      series.labels.template.disabled = true;
    },
    chartMiddleLabel(type, series, data) {
      var label = series.createChild(am4core.Label);

      if (type === 'CURRENT') {
        label.text = `${data[0].cmmtCvrgRt.toFixed(2)}%`;
        label.fill = am4core.color('#00a5ed');
      } else if (type === 'PREDICT') {
        label.text = `${(data[0].cmmtCvrgRt + data[1].cmmtCvrgRt).toFixed(2)}%`;
        label.fill = am4core.color('#fc5aa1');
      }
      label.horizontalCenter = 'middle';
      label.verticalCenter = 'middle';
      label.fontSize = 20;

      this.label[this.label.length] = label;
      // this.adjustFontSize();
    },
    adjustFontSize() {
      const innerWith = window.innerWidth;
      if (innerWith <= 1500) {
        this.label.forEach(function (val) {
          val.fontSize = 15;
        });
      } else if (innerWidth <= 1650) {
        this.label.forEach(function (val) {
          val.fontSize = 20;
        });
      } else {
        this.label.forEach(function (val) {
          val.fontSize = 30;
        });
      }
    },
    ctrtServices(dashboardList) {
      dashboardList.sort((a, b) => b.totOnDmndCostEqvlnt - a.totOnDmndCostEqvlnt);

      // 약정 가능 온디맨드(종량제) 총비용 합계
      this.tgtSummary = dashboardList.reduce(
        (acc, cur) => {
          acc.totOnDmndCostEqvlnt += cur.totOnDmndCostEqvlnt;
          if (cur.cmmtTyp && cur.cmmtTyp.indexOf('SP') > -1) {
            acc.spTotOnDmndCostEqvlnt += cur.totOnDmndCostEqvlnt;
          } else {
            acc.riTotOnDmndCostEqvlnt += cur.totOnDmndCostEqvlnt;
          }
          return acc;
        },
        { totOnDmndCostEqvlnt: 0, spTotOnDmndCostEqvlnt: 0, riTotOnDmndCostEqvlnt: 0 }
      );

      this.ctrtServicesList = dashboardList;
    },
    calculPredictSaveCost(dashboardList) {
      const awsSpRiReduceExpr = (acc, cur) => {
        acc.totSaveCost += cur.rcmdRslt.mnthSaveCost;
        if (cur.cmmtTyp && cur.cmmtTyp.indexOf('SP') > -1) {
          acc.spTotSaveCost += cur.rcmdRslt.mnthSaveCost;
        } else {
          acc.riTotSaveCost += cur.rcmdRslt.mnthSaveCost;
        }
      };
      const azureRiReduceExpr = (acc, cur) => {
        acc.totSaveCost += cur.rcmdRslt.mnthExpctCmmtSaveCost;
        acc.riTotSaveCost += cur.rcmdRslt.mnthExpctCmmtCost;
        acc.totOnDmndCost += cur.rcmdRslt.mnthOnDmndCost;
      };
      const gcpReduceExpr = (acc, cur) => {
        // TODO: gcp 항목 추가시 구현
      };
      this.predictSaveCost = dashboardList.reduce(
        (acc, cur) => {
          if (cur.rcmdRslt) {
            switch (this.filter.cspTypCd) {
              case 'AWS':
                awsSpRiReduceExpr(acc, cur);
                break;
              case 'AZURE':
                azureRiReduceExpr(acc, cur);
                break;
              case 'GCP':
                gcpReduceExpr(acc, cur);
                break;
            }
          }
          return acc;
        },
        { totSaveCost: 0, spTotSaveCost: 0, riTotSaveCost: 0, totOnDmndCost: 0 }
      );
    },
    calculCurrentCoverage(dashboardList) {
      const resultArr = [];
      const result = {};
      // 총 약정 온디맨드(종량제) 환산 비용의 합
      const onDmndCost = dashboardList.reduce(
        (acc, cur) => {
          acc.totCmmtOnDmndCostEqvlnt += cur.cmmtOnDmndCostEqvlnt;
          acc.totOnDmndCostEqvlnt += cur.cmmtOnDmndCostEqvlnt + cur.onDmndCost;
          return acc;
        },
        //  약정 온디맨드(종량제) 환산 비용의 합, 온디맨드(종량제) 환산 비용의 합
        { totCmmtOnDmndCostEqvlnt: 0, totOnDmndCostEqvlnt: 0 }
      );

      // 약정 온디맨드(종량제) 커버리지률 = 현재 충당 금액 / 총 온디맨드 환산 비용
      const cmmtCvrgRt = (onDmndCost.totCmmtOnDmndCostEqvlnt / onDmndCost.totOnDmndCostEqvlnt) * 100;
      result.cmmtCvrgRt = cmmtCvrgRt || 0;

      resultArr.push(result);
      this.fetchCurrentCoverage({ currentCoverage: result });

      return resultArr;
    },
    calculPredictCoverage(dashboardList) {
      const resultArr = [];
      const result = {};
      // 충당 금액의 합
      const totalFillCost = dashboardList.reduce(
        (acc, cur) => {
          if (cur.rcmdRslt) {
            const fillCost = this.getFillCost(cur.rcmdRslt);
            acc.curFillCost += fillCost.curFillCost;
            acc.predictFillCost += fillCost.predictFillCost;
          }
          return acc;
        },
        { curFillCost: 0, predictFillCost: 0 }
      );

      // 총 온디맨드 환산 비용의 합
      const totalOnDemendEqvlnt = dashboardList.reduce((acc, cur) => {
        if (cur.rcmdRslt) {
          acc += this.totalOndemendEqvlnt(cur.rcmdRslt);
        } else {
          // 확인 필요
          acc += cur.totOnDmndCostEqvlnt;
        }
        return acc;
      }, 0);

      // 약정 온디맨드(종량제) 환산 비용 = 현재 충당 금액 / 총 온디맨드 환산 비용
      const OnDmndCostRt = (totalFillCost.curFillCost / totalOnDemendEqvlnt) * 100;
      // 추천 비용 = (예상 충당금액 - 현재 충당금액) / 총 온디맨드 환산비용
      const rcmdCostRt = ((totalFillCost.predictFillCost - totalFillCost.curFillCost) / totalOnDemendEqvlnt) * 100;
      // 약정 미적용 비용 = (총 온디맨드(종량제) 환산비용 - 예상 충당금액) / 총 온디맨드(종량제) 환산비용
      const remainingRt = ((totalOnDemendEqvlnt - totalFillCost.predictFillCost) / totalOnDemendEqvlnt) * 100;

      result.cmmtCvrgRt = OnDmndCostRt || 0;
      result.rcmdCostRt = rcmdCostRt || 0;
      result.remainingRt = remainingRt || 0;

      resultArr.push(result);
      this.fetchPredictCoverage({ predictCtrtCoverage: result });

      return resultArr;
    },
    // 현재 충당 금액, 예상 충당 금액
    getFillCost(rcmdRslt) {
      let curFillCost = 0;
      let predictFillCost = 0;

      curFillCost = rcmdRslt.riOnDmndCost + rcmdRslt.spOnDmndCost;

      const awsSpRiExpr = () => {
        if (rcmdRslt.mnthCmmt <= 0 && rcmdRslt.mnthSaveCost <= 0) {
          return rcmdRslt.riOnDmndCost + rcmdRslt.spOnDmndCost;
        } else {
          return rcmdRslt.riOnDmndCost + rcmdRslt.spOnDmndCost + rcmdRslt.onDmndCost - rcmdRslt.rsdlOnDmndCost;
        }
      };
      const azureRiExpr = () => {
        if (rcmdRslt.cmmt <= 0 && rcmdRslt.mnthExpctCmmtSaveCost <= 0) {
          return rcmdRslt.riOnDmndCost + rcmdRslt.spOnDmndCost;
        } else {
          return rcmdRslt.riOnDmndCost + rcmdRslt.spOnDmndCost + rcmdRslt.onDmndCost - rcmdRslt.mnthExpctRsdlOnDmndCost;
        }
      };
      const gcpExpr = () => {
        // TODO: gcp 추가 시 구현 필요!!
      };

      switch (this.filter.cspTypCd) {
        case 'AWS':
          predictFillCost = awsSpRiExpr();
          break;
        case 'AZURE':
          predictFillCost = azureRiExpr();
          break;
        case 'GCP':
          predictFillCost = gcpExpr();
          break;
      }

      return { curFillCost, predictFillCost };
    },
    // 총 온디맨드 환산 비용
    totalOndemendEqvlnt(rcmdRslt) {
      return rcmdRslt.riOnDmndCost + rcmdRslt.spOnDmndCost + rcmdRslt.onDmndCost;
    },
    setChartDataAttibute(data) {
      const currentChartData = data.current[0];
      const predictChartData = data.predict[0];

      // CURRENT : 약정 커버리지
      currentChartData.category =
        i18n.locale === 'ko' ? `약정 ${this.getCmmtTitle} 환산 비용` : `Contract ${this.getCmmtTitle} conversion cost`;
      currentChartData.fill = '#2CC2FD';

      const currentRemainingRt = {
        category: i18n.locale === 'ko' ? '약정 미적용 비용' : 'Cost without contract',
        cmmtCvrgRt: 100 - currentChartData.cmmtCvrgRt,
        fill: '#dedede',
      };
      data.current.push(currentRemainingRt);

      // PREDICT : 예상 약정 커버리지
      predictChartData.category =
        i18n.locale === 'ko' ? `약정 ${this.getCmmtTitle} 환산 비용` : `Contract ${this.getCmmtTitle} conversion cost`;
      predictChartData.fill = '#ffb4d1';

      const rcmdCostRt = {
        category: i18n.locale === 'ko' ? '추천 비용' : 'Recommended cost',
        cmmtCvrgRt: predictChartData.rcmdCostRt,
        fill: '#fc5aa1',
      };
      data.predict.push(rcmdCostRt);

      const predictRemainingRt = {
        category: i18n.locale === 'ko' ? '약정 미적용 비용' : 'Cost without contract',
        cmmtCvrgRt: predictChartData.remainingRt,
        fill: '#dedede',
      };
      data.predict.push(predictRemainingRt);
    },
    routeDetail() {
      let value = {};
      value.contractId = this.filter.contract.ctrtId;
      value.cspTypCd = this.filter.cspTypCd;
      this.$router.push({
        name: '약정대시보드',
        params: value,
        props: true,
      });
    },
  },
};
</script>

<style></style>
