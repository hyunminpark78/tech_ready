<template>
  <div class="grid2-wrap mb-16">
    <div class="box-wrap list-wrap">
      <div class="title">
        <h4 class="tit-wrap">
          <span>{{ $t('optimization.contractTarget') }}</span>
          <div class="tooltip-wrap">
            <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
            <div class="tooltip-layer">
              <strong class="ti">{{ $t('optimization.contractTarget') }}</strong>
              <div class="ls">
                <span class="text-primary-400">{{
                  $t('optimization.contractableEquivalentAmount', { value: getCmmtTitle })
                }}</span>
                : {{ $t('optimization.TotalAmountConverted', { value: getCmmtTitle }) }}
              </div>
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.serviceEligibleCoverage') }}</span>
                : {{ $t('optimization.showTotalAmount', { value: getCmmtTitle }) }}
              </div>
              <button class="close jsTooltipClose1">툴팁 닫기</button>
            </div>
          </div>
        </h4>
        <RouterLink class="more" to="/opti/cost/tgt?remote=Y">{{ $t('common.button.viewDetails') }}</RouterLink>
      </div>
      <div class="con1">
        <div class="ti">{{ $t('optimization.contractableEquivalentAmount', { value: getCmmtTitle }) }}</div>
        <div class="pr">
          <span>￦</span><span id="jsCount1">{{ onDmndTotCostEqvlnt }}</span>
        </div>
      </div>
      <div v-if="showAwsOnly" class="con2">
        <div class="ls">
          <span class="t">Savings Plans</span>
          <span class="p">￦{{ numberCutDecimal(dashSummary.spTotOnDmndCostEqvlnt) }}</span>
        </div>
        <div class="ls">
          <span class="t">Reserved Instances</span>
          <span class="p">￦{{ numberCutDecimal(dashSummary.riTotOnDmndCostEqvlnt) }}</span>
        </div>
      </div>
      <div class="con3">
        <div class="ti">{{ $t('optimization.serviceEligibleCoverage') }}</div>
        <div class="table-wrap">
          <div class="thead">
            <span class="th w-130 text-left">{{ $t('optimization.service') }}</span>
            <span class="th w-62 text-center">{{ $t('optimization.contractType') }}</span>
            <span class="th flex-col text-right">{{
              $t('optimization.valueContractCost', { value: getCmmtTitle })
            }}</span>
          </div>
          <DataLoadingOverlay v-if="loading" :height="159"></DataLoadingOverlay>
          <NoDataOverlay v-else-if="!existData" :icon-type="'chart'" :height="159"></NoDataOverlay>
          <div v-if="existData && !loading" class="tbody scrollY" style="height: 159px">
            <div v-for="service in ctrtServicesList" :key="service.prodCd" class="tr">
              <div class="td w-130">
                <span style="background-color: #00a5ed; color: white" class="round-wrap gray">{{
                  service.prodGrpNm || service.prodNm
                }}</span>
              </div>
              <!-- orange = SP green = RI  -->
              <div class="td">
                <span class="round-wrap2 round gray">{{ getCmmtType(service) }}</span>
              </div>
              <div class="td flex-col text-right">₩{{ numberCutDecimal(service.totOnDmndCostEqvlnt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 약정 사용 현황 -->
    <div class="box-wrap list-wrap">
      <div class="title">
        <h4 class="tit-wrap">
          <span>{{ $t('optimization.contractUsageStatus') }}</span>
          <!-- tooltip -->
          <div class="tooltip-wrap">
            <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
            <div class="tooltip-layer">
              <strong class="ti">{{ $t('optimization.contractUsageStatus') }}</strong>
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.savingsContractApplication') }}</span> :
                {{ $t('optimization.contractedSavingsApplied') }}
              </div>
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.contractCoverage') }}</span> :
                {{ $t('optimization.displayRatio', { value: getCmmtTitle }) }}
              </div>
              <button class="close jsTooltipClose1">툴팁 닫기</button>
            </div>
          </div>
          <!-- //tooltip -->
        </h4>
        <RouterLink class="more" to="/opti/cost/status?remote=Y">{{ $t('common.button.viewDetails') }}</RouterLink>
      </div>
      <div class="con1">
        <div class="ti">{{ $t('optimization.savingsContractApplication') }}</div>
        <div class="pr">
          <span>￦</span>
          <span id="jsCount2">{{ netTotSaveCost }}</span>
        </div>
      </div>
      <div v-if="showAwsOnly" class="con2">
        <div class="ls">
          <span class="t">Savings Plans</span>
          <span class="p">￦{{ numberCutDecimal(dashSummary.spNetSaveCost) }}</span>
        </div>
        <div class="ls">
          <span class="t">Reserved Instances</span>
          <span class="p">￦{{ numberCutDecimal(dashSummary.riNetSaveCost) }}</span>
        </div>
      </div>
      <div class="con3">
        <div class="ti">{{ $t('optimization.contractCoverage') }}</div>
        <DataLoadingOverlay v-if="loading" :height="198"></DataLoadingOverlay>
        <NoDataOverlay v-else-if="!existData" :icon-type="'chart'" :height="198"></NoDataOverlay>
        <div v-show="existData && !loading" id="currentCoverageChart" style="width: 100%; height: 198px"></div>
      </div>
    </div>
    <!-- 약정 추천 -->
    <div class="box-wrap list-wrap">
      <div class="title">
        <h4 class="tit-wrap">
          <span>{{ $t('optimization.contractRecommendation') }}</span>
          <div class="tooltip-wrap">
            <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
            <div class="tooltip-layer pos_r">
              <strong class="ti">{{ $t('optimization.contractRecommendation') }}</strong>
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.estimatedSavingsApplying') }}</span>
                : {{ $t('optimization.estimatedSavingsPurchasing', { value: getAcctTitle }) }}
              </div>
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.expectedContractCoverage') }}</span>
                : {{ $t('optimization.coverageExpectedBased') }}
              </div>
              <div v-if="showAwsOnly" class="ls">
                {{ $t('optimization.computeSavingsPlans') }}
              </div>
              <button class="close jsTooltipClose1">툴팁 닫기</button>
            </div>
          </div>
          <span v-if="showAwsOnly" class="ts"
            >{{ $t('optimization.analysisPeriod') }} : {{ $t('optimization.thirtyDays') }}</span
          >
        </h4>
        <RouterLink class="more" to="/opti/cost/recommend?remote=Y">{{ $t('common.button.viewDetails') }}</RouterLink>
      </div>

      <div class="con1">
        <div class="ti">{{ $t('optimization.estimatedSavingsApplying') }}</div>
        <div class="pr">
          <span>￦</span><span id="jsCount3">{{ predictTotSaveCost }}</span
          ><span class="s">{{ $t('optimization.month') }}</span>
        </div>
      </div>
      <div v-if="showAwsOnly" class="con2">
        <div class="ls">
          <span class="t">Savings Plans</span>
          <span class="p">￦{{ numberCutDecimal(predictSaveCost.spTotSaveCost) }}</span>
        </div>
        <div class="ls">
          <span class="t">Reserved Instances</span>
          <span class="p">￦{{ numberCutDecimal(predictSaveCost.riTotSaveCost) }}</span>
        </div>
      </div>
      <div class="con3">
        <div class="ti">{{ $t('optimization.expectedContractCoverage') }}</div>
        <DataLoadingOverlay v-if="loading" :height="198"></DataLoadingOverlay>
        <NoDataOverlay v-else-if="!existData" :icon-type="'chart'" :height="198"></NoDataOverlay>
        <div v-show="existData && !loading" id="predictCoverageChart" style="width: 100%; height: 198px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { numberCutDecimal, chartColorByNumber, numberCutDecimalSum } from '../CmmtPsblTgt/CostOptiCommon';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay';
import NoDataOverlay from '@/components/Overlays/NoDataOverlay.vue';
import costOptiService from '@/services/costOptiService';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: {
    DataLoadingOverlay,
    NoDataOverlay,
  },
  data() {
    return {
      dashSummary: {},
      netSaveCost: {},
      predictSaveCost: {},
      ctrtServicesList: [],
      label: [],
      loading: true,
      existData: false,
      // titles: {
      //   AWS: { cmmt: '온디맨드', acct: '계정' },
      //   AZURE: { cmmt: '종량제', acct: 'Subscription' },
      //   GCP: { cmmt: '온디맨드', acct: '계정' }, // TODO: GCP 화면 추가 시 변경 필요!
      // },
      titles: {},
    };
  },
  computed: {
    ...mapState('costOpti', ['filter', 'isSearch']),
    showAwsOnly() {
      return this.filter.cspTypCd === 'AWS';
    },
    getCmmtTitle() {
      return this.titles[this.filter.cspTypCd].cmmt;
    },
    getAcctTitle() {
      return this.titles[this.filter.cspTypCd].acct;
    },
    onDmndTotCostEqvlnt() {
      // 소수점 절사와 합산 과정에서 totSaveCost 결과 값이 수치 1에 대한 오차가 발생.
      // AWS는 절사 처리된 RI와 SP의 합산으로 문제 해결.
      // AZURE는 SP가 제공되지 않아 전체 합산 값으로 제공.
      if (this.filter.cspTypCd === 'AWS')
        return numberCutDecimalSum(this.dashSummary.spTotOnDmndCostEqvlnt, this.dashSummary.riTotOnDmndCostEqvlnt);
      else return numberCutDecimal(this.dashSummary.totOnDmndCostEqvlnt);
    },
    netTotSaveCost() {
      // 소수점 절사와 합산 과정에서 totSaveCost 결과 값이 수치 1에 대한 오차가 발생.
      // AWS는 절사 처리된 RI와 SP의 합산으로 문제 해결.
      // AZURE는 SP가 제공되지 않아 전체 합산 값으로 제공.
      if (this.filter.cspTypCd === 'AWS')
        return numberCutDecimalSum(this.dashSummary.spNetSaveCost, this.dashSummary.riNetSaveCost);
      else return numberCutDecimal(this.dashSummary.totNetSaveCost);
    },
    predictTotSaveCost() {
      // 소수점 절사와 합산 과정에서 totSaveCost 결과 값이 수치 1에 대한 오차가 발생.
      // AWS는 절사 처리된 RI와 SP의 합산으로 문제 해결.
      // AZURE는 SP가 제공되지 않아 전체 합산 값으로 제공.
      if (this.filter.cspTypCd === 'AWS')
        return numberCutDecimalSum(this.predictSaveCost.spTotSaveCost, this.predictSaveCost.riTotSaveCost);
      else return numberCutDecimal(this.predictSaveCost.totSaveCost);
    },
  },
  watch: {
    '$i18n.locale': ['setTitles', 'createCoverageChart'],
    isSearch(newVal) {
      if (newVal.isSearch) {
        this.createCoverageChart();
      }
    },
  },
  created() {
    this.setTitles();
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    am4core.options.autoDispose = true; // 차트 인스턴스 자동 삭제
    window.addEventListener('resize', this.adjustFontSize);
  },
  methods: {
    i18n() {
      return i18n;
    },
    ...mapActions('costOpti', ['fetchPredictCoverage', 'fetchCurrentCoverage']),
    setTitles() {
      if (i18n.locale === 'ko') {
        this.titles = {
          AWS: { cmmt: '온디맨드', acct: '계정' },
          AZURE: { cmmt: '종량제', acct: 'Subscription' },
          GCP: { cmmt: '온디맨드', acct: '계정' }, // TODO: GCP 화면 추가 시 변경 필요!
        };
      } else {
        this.titles = {
          AWS: { cmmt: 'On-Demand', acct: 'accounts' },
          AZURE: { cmmt: 'PAYG system', acct: 'subscription' },
          GCP: { cmmt: 'On-Demand', acct: 'accounts' }, // TODO: GCP 화면 추가 시 변경 필요!
        };
      }
    },
    getCmmtType(service) {
      if (service.cmmtTyp && service.cmmtTyp.indexOf('SP') > -1) return 'SP';
      if (service.cmmtTyp && service.cmmtTyp.indexOf('RI') > -1) return 'RI';
      if (!service.cmmtTyp && this.filter.cspTypCd === 'AZURE') return 'Reservations';
      return '-';
    },
    async createCoverageChart() {
      this.loading = true;

      const data = await this.chartData();

      // CURRENT
      const currentCoverageChart = am4core.create('currentCoverageChart', am4charts.PieChart);

      this.chartEventDisabled(currentCoverageChart);
      this.createPieSeries('CURRENT', currentCoverageChart, data.current);
      currentCoverageChart.innerRadius = am4core.percent(65);

      // PREDICT
      const predictCoverageChart = am4core.create('predictCoverageChart', am4charts.PieChart);

      this.chartEventDisabled(predictCoverageChart);
      this.createPieSeries('PREDICT', predictCoverageChart, data.predict);
      predictCoverageChart.innerRadius = am4core.percent(65);

      this.loading = false;
    },
    async chartData() {
      const result = await costOptiService.fetchDashBoard(this.filter);
      const dashboardData = result.data.data || [];
      this.existData = dashboardData.length > 0;

      this.ctrtServices(dashboardData);
      this.calculPredictSaveCost(dashboardData);

      const currentCoverage = this.calculCurrentCoverage(dashboardData);
      const predictCoverage = this.calculPredictCoverage(dashboardData);

      const chartData = { current: currentCoverage, predict: predictCoverage };

      this.setChartDataAttibute(chartData);

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
      pieSeries.data = data;

      pieSeries.tooltip.fontSize = 12;
      pieSeries.tooltip.label.fontSize = 12;
      pieSeries.slices.template.propertyFields.fill = 'fill';

      pieSeries.slices.template.events.on('over', function (ev) {
        if (ev.target.dataItem.dataContext.fill === '#dedede') {
          pieSeries.slices.template.tooltipText = `[#000000]{category}: {value.formatNumber('##.00')}%`;
        } else {
          pieSeries.slices.template.tooltipText = `[#FFFFFF]{category}: {value.formatNumber('##.00')}%`;
        }
      });

      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      chart.legend.valign = 'middle';
      chart.legend.itemContainers.template.width = 180;
      chart.legend.fontSize = 12;
      chart.legend.labels.template.maxWidth = 150;
      chart.legend.labels.template.truncate = false;
      chart.legend.labels.template.wrap = false;
      chart.legend.labels.template.text = '{category}';
      chart.legend.valueLabels.template.text = '';
    },
    chartLabelDisabled(series) {
      series.labels.template.disabled = true;
    },
    chartMiddleLabel(type, series, data) {
      var label = series.createChild(am4core.Label);

      if (type === 'CURRENT') {
        label.text = `${data[0].cmmtCvrgRt.toFixed(2)}%`;
        label.fill = am4core.color(chartColorByNumber(data[0].cmmtCvrgRt));
      } else if (type === 'PREDICT') {
        label.text = `${(data[0].cmmtCvrgRt + data[1].cmmtCvrgRt).toFixed(2)}%`;
        label.fill = am4core.color(chartColorByNumber(data[0].cmmtCvrgRt + data[1].cmmtCvrgRt));
      }
      label.horizontalCenter = 'middle';
      label.verticalCenter = 'middle';
      label.fontSize = 30;

      this.label[this.label.length] = label;
      this.adjustFontSize();
    },
    ctrtServices(dashboardList) {
      dashboardList.sort((a, b) => b.totOnDmndCostEqvlnt - a.totOnDmndCostEqvlnt);

      // 약정가능 온디맨드 환산액 합계 및 약정 적용 절감액 합계
      this.dashSummary = dashboardList.reduce(
        (acc, cur) => {
          // 약정가능 온디맨드 환산액
          acc.totOnDmndCostEqvlnt += cur.totOnDmndCostEqvlnt;
          acc.spTotOnDmndCostEqvlnt += cur.spOnDmndCostEqvlnt;
          acc.riTotOnDmndCostEqvlnt += cur.riOnDmndCostEqvlnt;

          if (this.filter.cspTypCd === 'AZURE') {
            acc.riTotOnDmndCostEqvlnt += cur.onDmndCost;
          } else if (cur.cmmtTyp.indexOf('SP') > -1) {
            acc.spTotOnDmndCostEqvlnt += cur.onDmndCost;
          } else {
            acc.riTotOnDmndCostEqvlnt += cur.onDmndCost;
          }

          // 절감액
          acc.totNetSaveCost += cur.totNetSaveCost;
          acc.spNetSaveCost += cur.spNetSaveCost;
          acc.riNetSaveCost += cur.riNetSaveCost;

          return acc;
        },
        {
          totOnDmndCostEqvlnt: 0,
          spTotOnDmndCostEqvlnt: 0,
          riTotOnDmndCostEqvlnt: 0,
          totNetSaveCost: 0,
          spNetSaveCost: 0,
          riNetSaveCost: 0,
        }
      );

      this.ctrtServicesList = [];
      dashboardList.forEach((item) => {
        if (item.dtl && item.dtl.length > 0) {
          const ec2Items = item.dtl.filter((dtlItem) => dtlItem.prodCd === 'AmazonEC2');
          const nonEc2Items = item.dtl.filter((dtlItem) => dtlItem.prodCd !== 'AmazonEC2');

          ec2Items.forEach((ec2Item) => {
            this.ctrtServicesList.push(ec2Item);
            item.totOnDmndCostEqvlnt -= ec2Item.riOnDmndCostEqvlnt;
            ec2Item.totOnDmndCostEqvlnt = ec2Item.riOnDmndCostEqvlnt;
          });

          item.dtl = nonEc2Items;
        }
        this.ctrtServicesList.push(item);
      });
      this.ctrtServicesList = this.ctrtServicesList.filter((item) => item.totOnDmndCostEqvlnt !== 0);
      this.ctrtServicesList.sort((a, b) => b.totOnDmndCostEqvlnt - a.totOnDmndCostEqvlnt);
      // this.ctrtServicesList = dashboardList;
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

      // 약정 온디맨드(종량제) 커버리지율 = 현재 충당금액 / 총 온디맨드(종량제) 환산비용
      const cmmtCvrgRt = (onDmndCost.totCmmtOnDmndCostEqvlnt / onDmndCost.totOnDmndCostEqvlnt) * 100;

      result.cmmtCvrgRt = cmmtCvrgRt || 0;

      resultArr.push(result);
      this.fetchCurrentCoverage({ currentCoverage: result });

      return resultArr;
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
        // 현재 RI 정보만 제공되지만, 추후 SP 정보가 제공되면 AWS와
        // 동일한 방식으로 계산 필요
        acc.riTotSaveCost += cur.rcmdRslt.mnthExpctCmmtCost;
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
        { totSaveCost: 0, spTotSaveCost: 0, riTotSaveCost: 0 }
      );
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

      // 총 온디맨드(종량제) 환산 비용의 합
      const totalOnDemendEqvlnt = dashboardList.reduce((acc, cur) => {
        if (cur.rcmdRslt) {
          acc += this.totalOndemendEqvlnt(cur.rcmdRslt);
        } else {
          // 확인 필요
          acc += cur.totOnDmndCostEqvlnt;
        }
        return acc;
      }, 0);

      const OnDmndCostRt = totalOnDemendEqvlnt === 0 ? 0 : (totalFillCost.curFillCost / totalOnDemendEqvlnt) * 100;

      // 추천 비용?(절감률???) = (예상 충당금액 - 현재 충당금액) / 총 온디맨드(종량제) 환산비용
      const rcmdCostRt =
        totalOnDemendEqvlnt === 0
          ? 0
          : ((totalFillCost.predictFillCost - totalFillCost.curFillCost) / totalOnDemendEqvlnt) * 100;

      // 약정 미 적용 비용 = (총 온디맨드(종량제) 환산비용 - 예상충당금액) / 총 온디맨드(종량제) 환산비용
      const remainingRt =
        totalOnDemendEqvlnt === 0
          ? 0
          : ((totalOnDemendEqvlnt - totalFillCost.predictFillCost) / totalOnDemendEqvlnt) * 100;

      result.cmmtCvrgRt = OnDmndCostRt || 0;
      result.rcmdCostRt = rcmdCostRt || 0;
      result.remainingRt = remainingRt || 0;

      resultArr.push(result);
      this.fetchPredictCoverage({ predictCtrtCoverage: result });

      return resultArr;
    },
    // 현재 충당 금액, 예상 충당 금액 계산
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
    // 총 온디맨드(종량제) 환산 비용 계산
    totalOndemendEqvlnt(rcmdRslt) {
      return rcmdRslt.riOnDmndCost + rcmdRslt.spOnDmndCost + rcmdRslt.onDmndCost;
    },
    setChartDataAttibute(data) {
      const currentChartData = data.current[0];
      const predictChartData = data.predict[0];

      // CURRENT : 약정 커버리지
      currentChartData.category =
        i18n.locale === 'ko' ? `약정 ${this.getCmmtTitle} 환산 비용` : `${this.getCmmtTitle} conversion cost`;
      currentChartData.fill = '#2CC2FD';

      const currentRemainingRt = {
        category: i18n.locale === 'ko' ? '약정 미적용 비용' : 'Uncommitted cost',
        cmmtCvrgRt: 100 - currentChartData.cmmtCvrgRt,
        fill: '#dedede',
      };
      data.current.push(currentRemainingRt);

      // PREDICT : 예상 약정 커버리지
      predictChartData.category =
        i18n.locale === 'ko' ? `약정 ${this.getCmmtTitle} 환산 비용` : `${this.getCmmtTitle} conversion cost`;
      predictChartData.fill = '#2CC2FD';

      const rcmdCostRt = {
        category: i18n.locale === 'ko' ? '추천 비용' : 'Recommended cost',
        cmmtCvrgRt: predictChartData.rcmdCostRt,
        fill: '#1ae3bb',
      };
      data.predict.push(rcmdCostRt);

      const predictRemainingRt = {
        category: i18n.locale === 'ko' ? '약정 미적용 비용' : 'Uncommitted cost',
        cmmtCvrgRt: predictChartData.remainingRt,
        fill: '#dedede',
      };
      data.predict.push(predictRemainingRt);
    },
    numberCutDecimal(number) {
      return numberCutDecimal(number);
    },
    adjustFontSize() {
      const innerWith = window.innerWidth;
      if (innerWith <= 1500) {
        this.label.forEach(function (val) {
          val.fontSize = 13;
        });
      } else if (innerWith <= 1600) {
        this.label.forEach(function (val) {
          val.fontSize = 17;
        });
      } else if (innerWidth <= 1700) {
        this.label.forEach(function (val) {
          val.fontSize = 21;
        });
      } else {
        this.label.forEach(function (val) {
          val.fontSize = 27;
        });
      }
    },
  },
};
</script>
