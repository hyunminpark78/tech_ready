<template>
  <div class="grid2-wrap mb-4">
    <!-- 절감현황 -->
    <div class="box-wrap w2 list-wrap">
      <div class="title">
        <h4 class="tit-wrap">
          <span>{{ $t('optimization.savingsStatus') }}</span>
          <div class="tooltip-wrap">
            <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
            <div class="tooltip-layer">
              <strong class="ti">{{ $t('optimization.savingsStatus') }}</strong>
              {{ $t('optimization.valueSavingsContracted', { value: getCmmtTitle }) }}
              <br />
              &emsp;&emsp;&emsp;{{ $t('optimization.valueSavingsFormulaOne', { value: getCmmtTitle }) }}
              <br />
              {{ $t('optimization.valueSavingsRate', { value: getCmmtTitle }) }}
              <br />
              &emsp;&emsp;&emsp;{{ $t('optimization.valueSavingsRateFormular', { value: getCmmtTitle }) }}
              <button class="close jsTooltipClose1">툴팁 닫기</button>
            </div>
          </div>
        </h4>
        <a class="more" @click="scrollTo('netSave', 'utl', 'chart')">{{ $t('common.button.viewDetails') }}</a>
      </div>
      <div class="list2-wrap">
        <div class="col">
          <div class="ti">
            <strong class="text-primary-400">{{ $t('optimization.simpleSavings') }}</strong>
            <!-- <div class="text-gray-500">온디맨드 대비 비용 절감 비용</div> -->
          </div>
          <div class="pr">
            ￦<span>{{ numberCutDecimal(netSaveCost) }}</span>
          </div>
        </div>
        <div class="col">
          <div class="ti">
            <strong class="text-primary-400">{{ $t('optimization.savingsRate') }}</strong>
            <!-- <div class="text-gray-500">온디맨드 대비 비용 절감률</div> -->
          </div>
          <div class="pr">{{ numberProcess(utlSummary.netSaveRt) }}%</div>
        </div>
      </div>
    </div>
    <!-- 사용률 -->
    <div class="box-wrap type2 list-wrap" style="padding: 0 32px 0 32px">
      <div class="title" style="margin: 0">
        <h4 class="tit-wrap" style="padding-bottom: 10px">
          <span>{{ $t('optimization.utilization') }}</span>
          <div class="tooltip-wrap">
            <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
            <div class="tooltip-layer">
              <strong class="ti">{{ $t('optimization.utilization') }}</strong>
              <div class="text-primary-400 font-bold">
                {{ $t('optimization.utilizationFormular') }}
                <br />{{ numberProcess(utlSummary.utlRt) }} = 100 x ({{ numberCutDecimal(utlSummary.usedCmmtCost) }} ÷
                {{ numberCutDecimal(utlSummary.cmmtCost) }})
              </div>
              <div class="ls2">
                <span class="ic"><img src="@/assets/images/chart-high.svg" alt="" /></span>
                <span class="tx">
                  {{ $t('optimization.findOutWhatCausing') }}
                  <br />{{ $t('optimization.reduceChangeInstanceType') }}
                </span>
              </div>
              <div class="ls2">
                <span class="ic"><img src="@/assets/images/chart-middle.svg" alt="" /></span>
                <span class="tx">{{ $t('optimization.necessaryCheckContractUsage') }}</span>
              </div>
              <div class="ls2">
                <span class="ic"><img src="@/assets/images/chart-low.svg" alt="" /></span>
                <span class="tx">{{ $t('optimization.usingContractsEfficiently') }}</span>
              </div>
              <button class="close jsTooltipClose1">툴팁 닫기</button>
            </div>
          </div>
        </h4>
        <a class="more" @click="scrollTo('utl', 'utl', 'chart')">{{ $t('common.button.viewDetails') }}</a>
      </div>
      <div class="con3 noline">
        <div id="utlChart" :class="hasUtlChartData === 'D' ? '' : 'hidden'" style="width: 100%"></div>
        <template v-if="hasUtlChartData === 'L'">
          <div class="relative" style="height: 150px">
            <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
              <div class="mb-4 loading_rotate">
                <span class="loadingcolor"></span>
              </div>
              <div class="loading_txt">Loading...</div>
            </div>
          </div>
        </template>
        <template v-else-if="hasUtlChartData === 'E'">
          <div id="chart" class="flex flex-col items-center justify-center" style="width: 100%">
            <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
            <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
          </div>
        </template>
      </div>
    </div>

    <div class="box-wrap type2 list-wrap" style="padding: 0 32px 0 32px">
      <div class="title" style="margin: 0">
        <h4 class="tit-wrap" style="padding-bottom: 10px">
          <span>{{ $t('optimization.coverage') }}</span>
          <div class="tooltip-wrap">
            <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
            <div class="tooltip-layer pos_r">
              <strong class="ti">{{ $t('optimization.coverage') }}</strong>
              <div class="text-primary-400 font-bold">
                {{
                  $t('optimization.valueCoverageContractedCommStatus', {
                    valueName: getCmmtName,
                    valueTitle: getCmmtTitle,
                  })
                }}<br />
                {{ numberProcess(cvrgSummary.cmmtCvrgRt) }} = 100 x ({{
                  numberCutDecimal(cvrgSummary.cmmtOnDmndCostEqvlnt)
                }}
                ÷ {{ numberCutDecimal(cvrgSummary.totOnDmndCostEqvlnt) }})
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
        <a class="more" @click="scrollTo('cvrg', 'cvrg', 'chart')">{{ $t('common.button.viewDetails') }}</a>
        <!-- <a href="/opti/cost/recommend" class="more bottom">추천보기</a> -->
      </div>
      <div class="con3 noline">
        <div id="cvrgChart" :class="hasCvrgChartData === 'D' ? '' : 'hidden'" style="width: 100%"></div>
        <template v-if="hasCvrgChartData === 'L'">
          <div class="relative" style="height: 150px">
            <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
              <div class="mb-4 loading_rotate">
                <span class="loadingcolor"></span>
              </div>
              <div class="loading_txt">Loading...</div>
            </div>
          </div>
        </template>
        <template v-else-if="hasCvrgChartData === 'E'">
          <div id="chart" class="flex flex-col items-center justify-center" style="width: 100%">
            <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
            <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import costOptiService from '@/services/costOptiService';
import { numberProcess, numberCutDecimal, chartColorByNumber } from '../CmmtPsblTgt/CostOptiCommon';
// import {handle} from "nightwatch/lib/runner/cli/errorhandler";
import { i18n } from '../../../../../public/locales/i18n';

export default {
  props: {},
  data() {
    return {
      param: {},
      utlSummary: {},
      utlChartData: [],
      cvrgSummary: {},
      cvrgChartData: [],
      netSaveCost: 0,
      intervalHandle: null,
      loading: {
        utl: true,
        cvrg: true,
      },
      titles: {},
    };
  },
  computed: {
    ...mapState('costOpti', ['filter', 'isSearch', 'myCmmt']),
    hasUtlChartData() {
      /** E(Empty) / L(lodaing) / D(data) */
      let lState = '';
      if (this.loading.utl) {
        lState = 'L';
      } else if (this.utlChartData.length === 0) {
        lState = 'E';
      } else {
        lState = 'D';
      }
      return lState;
    },
    hasCvrgChartData() {
      /** E(Empty) / L(lodaing) / D(data) */
      let lState = '';
      if (this.loading.cvrg) {
        lState = 'L';
      } else if (this.cvrgChartData.length === 0) {
        lState = 'E';
      } else {
        lState = 'D';
      }
      return lState;
    },
    getCmmtName() {
      if (this.filter.cmmtTypList.some((item) => ['SP', 'RI'].includes(item))) return 'SP, RI';
      if (this.filter.cmmtTypList.includes('AzureRI')) return i18n.locale === 'ko' ? '약정' : 'Contract';
      if (this.filter.cmmtTypList.includes('GcpRI')) return 'GCP RI'; // TODO: GCP 화면 추가 시 변경 필요!
      return '{{ }}';
    },
    getCmmtTitle() {
      if (this.filter.cmmtTypList.some((item) => ['SP', 'RI'].includes(item)))
        return i18n.locale === 'ko' ? '온디맨드' : 'On-Demand';
      if (this.filter.cmmtTypList.includes('AzureRI')) return i18n.locale === 'ko' ? '종량제' : 'PAYG';
      if (this.filter.cmmtTypList.includes('GcpRI')) return i18n.locale === 'ko' ? '온디맨드' : 'On-Demand'; // TODO: GCP 화면 추가 시 변경 필요!
      return '{{ }}';
    },
  },
  watch: {
    '$i18n.locale': ['setTitles', 'createUtlChart', 'createCoverageChart'],
    filter(newVal) {
      this.param = newVal;
    },
    isSearch(newVal) {
      if (newVal.isSearch) {
        this.getUtlSummary();
        this.getCvrgSummary();
      }
    },
  },
  created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    this.setTitles();
  },
  methods: {
    ...mapActions('costOpti', ['fetchUtlSummary', 'fetchActive']),
    setTitles() {
      if (i18n.locale === 'ko') {
        this.titles = {
          AWS: '온디맨드',
          AZURE: '종량제',
          GCP: '온디맨드', // TODO: GCP 화면 추가 시 변경 필요!
        };
      } else {
        this.titles = {
          AWS: 'On-Demand',
          AZURE: 'pay as you go',
          GCP: 'On-Demand', // TODO: GCP 화면 추가 시 변경 필요!
        };
      }
    },
    async getUtlSummary() {
      this.loading.utl = true;

      if (this.intervalHandle) {
        clearInterval(this.intervalHandle);
      }

      this.utlChartData = [];
      this.utlSummary = {};

      try {
        const result = await costOptiService.fetchUtlSummary(this.param);
        const utlData = result.data.data || [];
        this.utlSummary = utlData[0];
        this.utlChartData = utlData;
        this.counter();
        this.createUtlChart('UTL');
      } catch (err) {
        console.error('getUtlSummary', err);
      }
      this.loading.utl = false;
    },
    async getCvrgSummary() {
      this.loading.cvrg = true;
      this.cvrgChartData = [];
      this.cvrgSummary = {};

      const cvrgData = await costOptiService.fetchCvrgSummary(this.param).then((result) => {
        return result.data.data;
      });

      this.cvrgSummary = cvrgData[0];
      this.cvrgChartData = cvrgData;

      this.createCoverageChart('CVRG');
      this.loading.cvrg = false;
    },
    async createUtlChart() {
      const utlChart = am4core.create('utlChart', am4charts.PieChart);
      const data = await this.chartData('UTL');
      this.chartEventDisabled(utlChart);
      this.createPieSeries(utlChart, data, 'utlRt');
      utlChart.innerRadius = am4core.percent(65);
    },
    async createCoverageChart() {
      const cvrgChart = am4core.create('cvrgChart', am4charts.PieChart);
      const data = await this.chartData('CVRG');
      this.chartEventDisabled(cvrgChart);
      this.createPieSeries(cvrgChart, data, 'cmmtCvrgRt');
      cvrgChart.innerRadius = am4core.percent(65);
    },
    async chartData(type) {
      let chartData = [];
      if (type === 'UTL') {
        chartData = this.utlChartData;
        this.setChartDataAttibute(chartData, this.$t('optimization.utilization'), 'utlRt');
      } else if (type === 'CVRG') {
        chartData = this.cvrgChartData;
        this.setChartDataAttibute(chartData, this.$t('optimization.contractCoverage'), 'cmmtCvrgRt');
      }
      return chartData;
    },
    chartEventDisabled(chart) {
      chart.seriesContainer.events.on('click', (event) => {
        event.target.interactionsEnabled = false;
      });
    },
    createPieSeries(chart, data, key) {
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      this.chartLabelDisabled(pieSeries);
      this.chartMiddleLabel(pieSeries, data, key);
      pieSeries.dataFields.value = key;
      pieSeries.dataFields.category = 'category';
      pieSeries.slices.template.propertyFields.fill = 'fill';
      pieSeries.data = data;

      pieSeries.tooltip.fontSize = 12;
      pieSeries.tooltip.label.fontSize = 12;

      pieSeries.slices.template.events.on('over', function (ev) {
        if (ev.target.dataItem.dataContext.fill === '#dedede') {
          pieSeries.slices.template.tooltipText = `[#000000]{category}: {value.percent.formatNumber('#.##')}% ({value.formatNumber('#.##')})`;
        } else {
          pieSeries.slices.template.tooltipText = `[#FFFFFF]{category}: {value.percent.formatNumber('#.##')}% ({value.formatNumber('#.##')})`;
        }
      });
    },
    chartLabelDisabled(series) {
      series.labels.template.disabled = true;
    },
    chartMiddleLabel(series, data, key) {
      var label = series.createChild(am4core.Label);
      label.text = `${data[0][key].toFixed(2)}%`; // 중앙 라벨
      label.horizontalCenter = 'middle'; // 가로 중앙에 배치
      label.verticalCenter = 'middle'; // 세로 중앙에 배치
      label.fontSize = 22; // 라벨 텍스트 크기 설정
      label.fill = am4core.color(chartColorByNumber(data[0][key]));
    },
    setChartDataAttibute(data, msg, key) {
      const chartData = data[0];
      chartData.category = msg;
      chartData.fill = chartColorByNumber(chartData[key]);
      data.push(this.calculRemainingPercent(chartData[key], key));
    },
    calculRemainingPercent(value, key) {
      const remaining = {
        category: 'Remaining',
        fill: '#dedede',
      };
      remaining[key] = 100 - (value ? value : 0);
      return remaining;
    },
    numberProcess(number) {
      return numberProcess(number);
    },
    numberCutDecimal(number) {
      return numberCutDecimal(number);
    },
    counter() {
      let max = this.utlSummary.netSaveCost,
        now = max;
      this.intervalHandle = setInterval(() => {
        this.netSaveCost = Math.ceil(max - now);
        // 목표수치에 도달하면 정지
        if (now < 1) {
          clearInterval(this.intervalHandle);
          this.intervalHandle = null;
        }
        // 증가되는 값이 계속하여 작아짐
        const step = now / 10;
        // 값을 적용시키면서 다음 차례에 영향을 끼침
        now -= step;
      }, 15);
    },
    scrollTo(chart, grid, refName) {
      this.fetchActive({
        state: {
          chart: chart,
          grid: grid,
          refName: refName,
        },
      });
      const location = document.querySelector('#' + refName).offsetTop;
      window.scrollTo({ left: 0, top: location - 100 });
    },
  },
};
</script>
