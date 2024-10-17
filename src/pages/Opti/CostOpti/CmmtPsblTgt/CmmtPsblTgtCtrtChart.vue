<template>
  <div class="grid2-wrap" style="height: 239px">
    <div class="box-wrap list-wrap" style="flex: unset; width: 60%">
      <div class="title" style="height: 53px">
        <h4 class="tit-wrap">
          <span>{{ $t('optimization.contractTarget') }}</span>
          <div class="tooltip-wrap">
            <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
            <div class="tooltip-layer">
              <strong class="ti">{{ $t('optimization.contractTarget') }}</strong>
              <div class="ls">
                <span class="text-primary-400">{{
                  $t('optimization.commitmentEligibleUsage', { value: getTitle })
                }}</span>
                : {{ $t('optimization.TotalAmountConverted', { value: getTitle }) }}
              </div>
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.serviceEligibleCoverage') }}</span>
                : {{ $t('optimization.showTotalAmount', { value: getTitle }) }}
              </div>
              <button class="close jsTooltipClose1">툴팁 닫기</button>
            </div>
          </div>
          <div v-if="!loading" class="con1" style="position: absolute; right: 28%">
            <div class="ti">{{ $t('optimization.commitmentEligibleServices') }}</div>
          </div>
        </h4>
      </div>
      <div class="con1" style="display: flex; justify-items: center">
        <DataLoadingOverlay v-if="loading" :height="150"></DataLoadingOverlay>
        <div v-else class="con1" style="display: flex; align-items: center; padding: 0; width: 65%">
          <div style="height: 100%">
            <div class="ti" style="margin: 14px 0 0 0">
              {{ $t('optimization.commitmentEligibleUsage', { value: getTitle }) }}
            </div>
            <!-- <div class="tx">약정 적용이가능한 비용</div> -->
            <div class="pr" style="margin: 30px 0 0 0">
              <span>￦</span><span id="jsCount4">{{ numberCutDecimal(summary.totOnDmndCostEqvlnt) }}</span>
            </div>
          </div>
        </div>
        <div v-if="!loading && !existDshbrdData" style="display: flex; position: absolute; right: 45%">
          <NoDataOverlay :icon-type="'chart'" :height="155"></NoDataOverlay>
        </div>
        <div
          id="ctrtChart"
          v-visible="!loading && existDshbrdData"
          style="width: 100%; height: 170px; overflow: hidden"
        ></div>
      </div>
    </div>
    <div class="box-wrap list-wrap">
      <div class="title" style="height: 53px">
        <h4 class="tit-wrap">
          <span>{{ $t('optimization.coverage') }}</span>
          <div class="tooltip-wrap">
            <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
            <div class="tooltip-layer">
              <strong class="ti">{{ $t('optimization.coverage') }}</strong>
              <div class="text-primary-400 font-bold">
                {{ $t('optimization.coverageContracted', { value: getTitle }) }} <br />{{
                  numberCutDecimal(summary.cmmtCvrgRt)
                }}
                = 100 × ({{ numberCutDecimal(summary.cmmtOnDmndCostEqvlnt) }} ÷
                {{ numberCutDecimal(summary.totOnDmndCostEqvlnt) }})
              </div>
              <div class="ls2">
                <span class="ic"><img src="@/assets/images/chart-high.svg" alt="" /></span>
                <span class="tx">
                  {{ $t('optimization.determineCauseLowCoverage') }}
                  <br />{{ $t('optimization.expirationAdditionIncreased') }}
                </span>
              </div>
              <div class="ls2">
                <span class="ic"><img src="@/assets/images/chart-middle.svg" alt="" /></span>
                <span class="tx">{{ $t('optimization.reviewRecommendationsMaximizeSavings') }}</span>
              </div>
              <div class="ls2">
                <span class="ic"><img src="@/assets/images/chart-low.svg" alt="" /></span>
                <span class="tx">{{ $t('optimization.commitmentsBeingApplied') }}</span>
              </div>
              <button class="close jsTooltipClose1">툴팁 닫기</button>
            </div>
          </div>
        </h4>
        <RouterLink class="more" to="/opti/cost/status?remote=Y">{{ $t('common.button.viewDetails') }}</RouterLink>
        <RouterLink class="more bottom" to="/opti/cost/recommend?remote=Y">{{
          $t('optimization.viewOurRecommendations')
        }}</RouterLink>
      </div>
      <div class="con1 noline" style="display: flex; justify-items: center">
        <DataLoadingOverlay v-if="loading" :height="150"></DataLoadingOverlay>
        <div v-show="!loading" id="currentCoverageChart" style="height: 155px; text-align: left; float: left"></div>
        <div></div>
        <div v-if="!loading" class="con1" style="padding: 0; width: 100%">
          <div style="margin: 27px 0 0 0">
            <div class="ti">{{ $t('optimization.commitmentAppliedEquivalentAmount', { value: getTitle }) }}</div>
            <div class="pr">
              <span>￦</span><span id="jsCount1">{{ numberCutDecimal(summary.cmmtOnDmndCostEqvlnt) }}</span>
            </div>
          </div>
          <div class="con2" style="margin: 24px 0 0 0; border-top: solid 1px #e9ebed">
            <div class="ls">
              <div class="t">{{ $t('optimization.expectedContractCoverageRecommendation') }}</div>
            </div>
            <div class="ls" style="margin: -12px 0 0 0">
              <div class="p">{{ predictCoverage }}%</div>
            </div>
          </div>
          <!-- <div style="margin: 24px 0 0 0; border-top: solid 1px #e9ebed">
            <div class="ti">추천 적용시 예상 약정 커버리지</div>
            <div class="pr">
              <span id="jsCount1">{{ predictCoverage }}</span>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <!-- //현재 약정 커버리지 -->
    <!-- 예상 약정 커버리지 -->
    <!-- <div class="box-wrap list-wrap">
      <div class="title">
        <h4 class="tit-wrap">
          <span>추천 적용시 예상 약정 커버리지</span>
          <div class="tooltip-wrap">
            <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
            <div class="tooltip-layer pos_r">
              <strong class="ti">추천 적용시 예상 약정 커버리지</strong>
              지난 30일 동안의 사용량을 분석하여 추천한 약정을 구매할 경우 예상되는 전체 커버리지입니다.
              <button class="close jsTooltipClose1">툴팁 닫기</button>
            </div>
          </div>
        </h4>
        <RouterLink class="more" to="/opti/cost/recommend">상세보기</RouterLink>
      </div>
      <div class="con3 noline">
        <template v-if="loading">
          <div class="relative border-t" style="height: 330px">
            <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
              <div class="mb-4 loading_rotate">
                <span class="loadingcolor"></span>
              </div>
              <div class="loading_txt">Loading...</div>
            </div>
          </div>
        </template>
        <div id="predictCoverageChart" style="width: 100%; height: 230px"></div>
      </div>
      <div v-if="!loading" class="con1" style="border-top: solid 1px #e9ebed">
        <div style="margin: 24px 0 0 0">
          <div class="ti">추천 적용시 {{ getTitle }} 환산 비용</div>
          <div class="pr">
            <span>￦</span><span id="jsCount1">{{ numberCutDecimal(summary.totalPredictAmount) }} / 월 </span>
          </div>
        </div>
      </div>
    </div> -->
    <!-- //예상 약정 커버리지 -->
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { chartColorByNumber, numberCutDecimal } from './CostOptiCommon';
import cspSwitchMixin from './cspSwitchMixin';
import costOptiService from '@/services/costOptiService';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay.vue';
import NoDataOverlay from '@/components/Overlays/NoDataOverlay.vue';

export default {
  components: { DataLoadingOverlay, NoDataOverlay },
  mixins: [cspSwitchMixin],
  data() {
    return {
      option: {},
      param: {},
      onDmndCost: 0,
      summary: { onDmndCost: 0 },
      ctrtServicesList: [],
      loading: false,
      existSummaryData: false,
      existData: false,
      existDshbrdData: false,
      cmmtType: 'All',
      predictCoverage: 0.0,
    };
  },
  computed: {
    ...mapState('costOpti', ['filter', 'isSearch']),
  },
  watch: {
    '$i18n.locale': 'setCharts',
    filter() {
      if (this.filter.cmmtTypList.length >= 2) {
        this.cmmtType = 'All';
      } else {
        this.cmmtType = this.filter.cmmtTypList[0];
      }
    },
    isSearch(newVal) {
      if (newVal.isSearch) {
        this.setCharts();
      }
    },
  },
  created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
  },
  mounted() {
    // this.createCurrentCoverageChart();
    // this.createPredictCoverageChart();
  },
  methods: {
    ...mapActions('costOpti', ['fetchPredictCoverage', 'fetchCurrentCoverage']),

    async setCharts() {
      this.loading = true;
      await this.createCtrtTargetChart();
      await this.createCurrentCoverageChart();
      // await this.createPredictCoverageChart();
      this.loading = false;
    },
    async createCtrtTargetChart() {
      const data = await this.getChartData('CTRT');

      const ctrtTargetChart = am4core.create('ctrtChart', am4charts.PieChart);
      this.chartEventDisabled(ctrtTargetChart);
      this.createPieChartSeries(ctrtTargetChart, data);
      ctrtTargetChart.innerRadius = am4core.percent(40);
    },
    async createCurrentCoverageChart() {
      const data = await this.getChartData('CURRENT');

      const currentCoverageChart = am4core.create('currentCoverageChart', am4charts.PieChart);
      this.chartEventDisabled(currentCoverageChart);
      this.createDonutChartSeries(currentCoverageChart, data);
      currentCoverageChart.innerRadius = am4core.percent(65);
    },
    async createPredictCoverageChart() {
      const data = await this.getChartData('PREDICT');

      const predictCoverageChart = am4core.create('predictCoverageChart', am4charts.PieChart);
      this.chartEventDisabled(predictCoverageChart);
      this.createDonutChartSeries(predictCoverageChart, data);
      predictCoverageChart.innerRadius = am4core.percent(65);
    },

    async getChartData(type) {
      let chartData = [];
      if (type === 'CURRENT') {
        chartData = await costOptiService.fetchSummary(this.filter).then((result) => {
          const summaryData = result.data.data || [];
          this.existData = summaryData.length > 0;
          return summaryData;
        });
        this.summary = chartData[0];
        this.setChartDataAttibute(chartData, this.$t('optimization.currentContractCoverage'));
        this.fetchCurrentCoverage({ currentCoverage: this.summary });
      } else if (type === 'PREDICT' || type === 'CTRT') {
        chartData = await costOptiService.fetchDashBoard(this.filter).then((result) => {
          const dashboardData = result.data.data || [];
          this.existDshbrdData = dashboardData.length > 0;
          const ctrtServices = this.ctrtServices(dashboardData);
          const predictCtrtCoverage = this.calculPredictCtrtCoverage(dashboardData);
          this.predictCoverage = predictCtrtCoverage[0].cmmtCvrgRt.toFixed(2);
          if (type === 'PREDICT') {
            return predictCtrtCoverage;
          } else if (type === 'CTRT') {
            return ctrtServices;
          }
        });
        // this.setChartDataAttibute(chartData, '예상 약정 커버리지');
      }
      return chartData;
    },
    calculPredictCtrtCoverage(dashboardData) {
      const resultArr = [];
      const result = {};
      const totalPredictAmount = dashboardData.reduce((acc, val) => {
        if (val.rcmdRslt) {
          acc += this.predictAmount(val.rcmdRslt);
        } else {
          acc += val.cmmtOnDmndCostEqvlnt;
        }
        return acc;
      }, 0);
      this.summary.totalPredictAmount = totalPredictAmount; // 임시

      const totalOnDemendEqvlnt = dashboardData.reduce((acc, val) => {
        if (val.rcmdRslt) {
          acc += this.totalOndemendEqvlnt(val.rcmdRslt);
        } else {
          acc += val.totOnDmndCostEqvlnt;
        }
        return acc;
      }, 0);

      const predictCtrtCoverage = (totalPredictAmount / totalOnDemendEqvlnt) * 100;
      result.cmmtCvrgRt = predictCtrtCoverage ? predictCtrtCoverage : 0;
      resultArr.push(result);
      this.fetchPredictCoverage({ predictCtrtCoverage: result });
      return resultArr;
    },
    setChartDataAttibute(data, msg) {
      const chartData = data[0];
      chartData.category = msg;
      chartData.fill = chartColorByNumber(chartData.cmmtCvrgRt);
      data.push(this.calculRemainingPercent(chartData.cmmtCvrgRt));
    },
    ctrtServices(dashboardList) {
      dashboardList.sort((a, b) => b.totOnDmndCostEqvlnt - a.totOnDmndCostEqvlnt);
      // this.ctrtServicesList = dashboardList;
      return dashboardList;
    },
    // 예상 충당 금액
    predictAmount(rcmdRslt) {
      let predictAmount = 0;

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
          predictAmount = awsSpRiExpr();
          break;
        case 'AZURE':
          predictAmount = azureRiExpr();
          break;
        case 'GCP':
          predictAmount = gcpExpr();
          break;
      }
      return predictAmount;
    },
    // 총 온디맨드(종량제) 환산 비용 계산
    totalOndemendEqvlnt(rcmdRslt) {
      return rcmdRslt.riOnDmndCost + rcmdRslt.spOnDmndCost + rcmdRslt.onDmndCost;
    },
    chartEventDisabled(chart) {
      chart.seriesContainer.events.on('click', (event) => {
        event.target.interactionsEnabled = false;
      });
    },
    // 약정 가능 대상 서비스 차트
    createPieChartSeries(chart, data) {
      const currentCmmtType = this.cmmtType;
      chart.numberFormatter.numberFormat = '#,###.';

      chart.legend = new am4charts.Legend();
      chart.legend.labels.template.text = '[[{cmmtTyp}]]{category}'; //;
      chart.legend.labels.template.adapter.add('text', function (text, target) {
        // AzureRI 응답 데이터에서는 'cmmtTyp'이 포함 되어있지 않음. (2024-03-06)
        const type = target.dataItem.dataContext.cmmtTyp || currentCmmtType;
        if (type) {
          if (type.indexOf('AzureRI') > -1) {
            return '{category}';
          } else if (type.indexOf('SP') > -1 && (currentCmmtType === 'SP' || currentCmmtType === 'All')) {
            return '[[SP]] {category}';
          } else {
            return '[[RI]] {category}';
          }
        }
      });
      chart.legend.valueLabels.template.text = '';
      chart.legend.scrollable = true;
      chart.legend.position = 'right';
      chart.legend.align = 'right';
      chart.legend.valign = 'middle';
      chart.legend.fontSize = 12;
      chart.legend.minWidth = 250;

      const pieSeries = chart.series.push(new am4charts.PieSeries());
      this.chartLabelDisabled(pieSeries);
      pieSeries.dataFields.value = 'totOnDmndCostEqvlnt';
      pieSeries.dataFields.category = currentCmmtType.indexOf('AzureRI') > -1 ? 'prodNm' : 'prodGrpNm';
      pieSeries.data = data;

      pieSeries.tooltip.fontSize = 12;
      pieSeries.tooltip.label.fontSize = 12;
      pieSeries.slices.template.tooltipText = `[#FFFFFF]{category}: {value.percent.formatNumber('#.##')}% (₩{value})`;
    },
    createDonutChartSeries(chart, data) {
      const donutSeries = chart.series.push(new am4charts.PieSeries());
      this.chartLabelDisabled(donutSeries);
      this.chartMiddleLabel(donutSeries, data);

      donutSeries.dataFields.value = 'cmmtCvrgRt';
      donutSeries.dataFields.category = 'category';
      donutSeries.data = data;

      donutSeries.tooltip.fontSize = 12;
      donutSeries.tooltip.label.fontSize = 12;
      donutSeries.slices.template.propertyFields.fill = 'fill';

      donutSeries.slices.template.events.on('over', function (ev) {
        if (ev.target.dataItem.dataContext.fill === '#dedede') {
          donutSeries.slices.template.tooltipText = `[#000000]{category}: {value.percent.formatNumber('#.##')}%`;
        } else {
          donutSeries.slices.template.tooltipText = `[#FFFFFF]{category}: {value.percent.formatNumber('#.##')}%`;
        }
      });
    },
    calculRemainingPercent(value) {
      return {
        category: this.$t('optimization.contractNotApplied'),
        cmmtCvrgRt: 100 - (value ? value : 0),
        fill: '#dedede',
      };
    },
    chartLabelDisabled(series) {
      series.labels.template.disabled = true;
    },
    chartMiddleLabel(series, data) {
      var label = series.createChild(am4core.Label);
      label.text = `${data[0].cmmtCvrgRt.toFixed(2)}%`; //'중앙 라벨'; // 원하는 라벨 텍스트로 변경하세요
      label.horizontalCenter = 'middle'; // 가로 중앙에 배치
      label.verticalCenter = 'middle'; // 세로 중앙에 배치
      label.fontSize = 20; // 라벨 텍스트 크기 설정 (옵션)
      label.fill = am4core.color(chartColorByNumber(data[0].cmmtCvrgRt));
    },
    chartSize(series) {
      series.adapter.add('innerRadius', function (innerRadius, target) {
        return am4core.percent(60);
      });
      series.adapter.add('radius', function (innerRadius, target) {
        return am4core.percent(80);
      });
    },
    numberCutDecimal(number) {
      return numberCutDecimal(number);
    },
  },
};
</script>
