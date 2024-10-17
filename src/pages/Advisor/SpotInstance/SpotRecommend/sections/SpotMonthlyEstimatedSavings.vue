<template>
  <div id="spotEstimatedSaving" class="contents-wrap border">
    <div class="savingChartBox box-wrap border">
      <Tooltip class="tootltip-title" :title="$t('advisor.estimatedTotalMonthly')">
        <div style="font-weight: 700" class="ti">
          {{ $t('advisor.estimatedTotalMonthly') }}
        </div>
        <div class="ls">
          <span class="primary"> {{ $t('advisor.estimatedMonthSaveSpot.fullSpotApp') }} :</span>
          <p>{{ $t('advisor.estimatedMonthSaveSpot.fullSpotAppDes') }}</p>
        </div>

        <div class="ls">
          <span class="primary">{{ $t('advisor.estimatedMonthSaveSpot.estimatedSaveRate') }} :</span>
          <p>{{ $t('advisor.estimatedMonthSaveSpot.estimatedSaveRateDes') }}</p>
        </div>

        <div class="ls">
          <span class="primary">{{ $t('advisor.estimatedMonthSaveSpot.estimatedSaveGPUApp') }} :</span>
          <p>{{ $t('advisor.estimatedMonthSaveSpot.estimatedSaveGPUAppDes') }}</p>
        </div>

        <div class="ls">
          <span class="primary">{{ $t('advisor.estimatedMonthSaveSpot.estimatedSaveGPU') }} :</span>
          <p>{{ $t('advisor.estimatedMonthSaveSpot.estimatedSaveGPUDes') }}</p>
        </div>

        <div class="ls">
          <span class="primary">{{ $t('advisor.estimatedMonthSaveSpot.demandCost') }} :</span>
          {{ $t('advisor.estimatedMonthSaveSpot.demandCostDes') }}
        </div>
      </Tooltip>
      <div class="estimated-saving">
        <div class="dashboard w-1/2">
          <h2 class="estMonthlyTitle">
            {{ $t('advisor.estimatedMonthSave.applyFullSpot') }}
          </h2>
          <div class="cards-section mb__20">
            <DataCard
              class="data-card-section"
              :title="$t('advisor.estimatedMonthSave.savings')"
              :value="`₩${numberCutDecimal(spotSavingData.savingsAmount)}`"
            />
            <DataCard
              class="data-card-section"
              :title="$t('advisor.estimatedMonthSave.savingRate')"
              :value="`${spotSavingData.savingsRate}%`"
            />
          </div>
          <h2 class="estMonthlyTitle">
            {{ $t('advisor.estimatedMonthSave.applyGPUSpot') }}
          </h2>
          <div class="cards-section">
            <DataCard
              class="data-card-section"
              :title="$t('advisor.estimatedMonthSave.savings')"
              :value="`₩${numberCutDecimal(gpuSavingData.savingsAmount)}`"
            />
            <DataCard
              class="data-card-section"
              :title="$t('advisor.estimatedMonthSave.savingRate')"
              :value="`${gpuSavingData.savingsRate}%`"
            />
          </div>
        </div>
        <div class="w-1/2">
          <div style="height: 50%; width: 100%">
            <div class="dashboard-title flex items-center justify-end -border-left">
              <a href="#detailTable">
                <button class="relative view-more">
                  {{ $t('common.button.viewDetails') }}
                </button>
              </a>
            </div>
            <div
              id="fullSpotChart"
              ref="fullSpotChart"
              :class="{ hidden: !displayCharts('spotSavingData') }"
              :style="chartStyleObject"
            ></div>
            <h2 :class="{ hidden: !displayCharts('spotSavingData'), onDemandAmount: true }">
              {{ $t('advisor.estimatedMonthSave.onDemandCosts') }} ₩{{
                `${numberCutDecimal(spotSavingData.onDemandAmount)}`
              }}
            </h2>
            <div class="relative" :class="!isLoading ? 'hidden' : ''" style="width: 100%; height: 100%">
              <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
                <div class="mb-4 loading_rotate">
                  <span class="loadingcolor"></span>
                </div>
                <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
              </div>
            </div>
            <div
              :class="{ hidden: !displayNoData('spotSavingData') }"
              class="flex items-center justify-center"
              style="height: 100%; width: 100%"
            >
              <div class="text-center" style="margin: auto">
                <img class="inline" src="@/assets/images/ico-nodata-chart.svg" alt="." />
                <p class="mt-3 text-gray-700">
                  {{ $t('common.paragraph.noDataDisplay') }}
                </p>
              </div>
            </div>
          </div>
          <div style="height: 50%; width: 100%">
            <div class="dashboard-title flex items-center justify-end">
              <button class="relative view-more" @click="moveToGpuSpotPage">
                {{ $t('common.button.viewDetails') }}
              </button>
            </div>
            <div
              id="GPUSpotChart"
              ref="GPUSpotChart"
              :class="{ hidden: !displayCharts('spotSavingData') }"
              :style="chartStyleObject"
            ></div>
            <h2 :class="{ hidden: !displayCharts('spotSavingData'), onDemandAmount: true }">
              {{ $t('advisor.estimatedMonthSave.onDemandCosts') }} ₩{{
                `${numberCutDecimal(gpuSavingData.onDemandAmount)}`
              }}
            </h2>
            <div class="relative" :class="!isLoading ? 'hidden' : ''" style="width: 100%; height: 100%">
              <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
                <div class="mb-4 loading_rotate">
                  <span class="loadingcolor"></span>
                </div>
                <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
              </div>
            </div>
            <div
              :class="{ hidden: !displayNoData('spotSavingData') }"
              class="flex items-center justify-center"
              style="height: 100%; width: 100%"
            >
              <div class="text-center" style="margin: auto">
                <img class="inline" src="@/assets/images/ico-nodata-chart.svg" alt="." />
                <p class="mt-3 text-gray-700">
                  {{ $t('common.paragraph.noDataDisplay') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { DataCard, Tooltip } from '../../../components';
import { mapState, mapActions, mapGetters } from 'vuex';
import spotUsageService from '@/services/spotUsageService';
import axios from 'axios';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import demoData from '../../../../../../public/locales/recommendation_demo.json';
import { RECOMMEND_TYPE } from '@/pages/Advisor/SpotInstance/SpotInstanceEnum';
import { numberCutDecimal } from '@/pages/Opti/CostOpti/CmmtPsblTgt/CostOptiCommon';
import { setApiConfig } from '@/library/APICaller';
import _ from 'lodash';

export default {
  components: {
    DataCard,
    Tooltip,
  },
  data() {
    return {
      fullSpotData: [],
      GPUSpotData: [],
      isLoading: true,
      spotSavingData: {
        useAmount: 0,
        savingsAmount: 0,
        savingsRate: 0,
        onDemandAmount: 0,
      },
      gpuSavingData: {
        useAmount: 0,
        savingsAmount: 0,
        savingsRate: 0,
        onDemandAmount: 0,
      },
      apiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
      numberCutDecimal: numberCutDecimal,
    };
  },
  computed: {
    ...mapState('spotAdvisor', {
      filter: 'filter',
      category: 'category',
      companyId: 'selectedCustCorpIds',
      setSpotRecommendSummary: 'setSpotRecommendSummary',
    }),
    ...mapGetters('spotAdvisor', ['cspTypCd', 'cspPrdtCdList', 'regionSepCdList', 'tag', 'exchgRate']),
    currentLocale() {
      return this.$i18n.locale;
    },
    chartStyleObject() {
      return {
        height: '127px',
        width: '100%',
      };
    },
  },
  watch: {
    currentLocale() {
      this.createChart('fullSpotChart');
      this.createChart('GPUSpotChart');
    },
    setSpotRecommendSummary: async function () {
      if (this.setSpotRecommendSummary) {
        this.fetchSpotRecommendSummary(false);
        await this.setData();
      }
    },
  },

  created() {
    // Apply theme
    am4core.useTheme(am4themes_animated);
  },

  destroyed() {
    this.createChart('fullSpotChart').dispose();
    this.createChart('GPUSpotChart').dispose();
  },

  methods: {
    ...mapActions('spotAdvisor', ['fetchSpotRecommendSummary']),
    async setData() {
      this.isLoading = true;

      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.apiConfig.cancelTokenSource) {
        this.apiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.apiConfig);

      try {
        const payload = {
          custCorpId: this.companyId[0].id,
          recmTypNm: this.category,
          acntIdList: this.filter.acntIdList,
          regionSepCdList: this.regionSepCdList,
          cspPrdtCdList: this.cspPrdtCdList,
          tagKey: this.tag.tagKey,
          tagValList: this.tag.tagValList,
        };

        const response = await spotUsageService.fetchSpotRecommendSummary({
          cspTypCd: this.cspTypCd,
          payload: payload,
          config: { cancelToken: this.apiConfig.cancelToken },
        });
        const savingData = response.data.data;

        this.spotSavingData = {
          useAmount: this.applyExchgRate(savingData.expctSpotUseAmt),
          savingsAmount: this.applyExchgRate(savingData.expctSpotSaveAmt),
          savingsRate: this.applyRate(savingData.expctSpotSaveRatio),
          onDemandAmount: this.applyExchgRate(savingData.ondmUseAmt),
        };
        this.gpuSavingData = {
          useAmount: this.applyExchgRate(savingData.gpuExpctSpotUseAmt),
          savingsAmount: this.applyExchgRate(savingData.gpuExpctSpotSaveAmt),
          savingsRate: this.applyRate(savingData.gpuExpctSpotSaveRatio),
          onDemandAmount: this.applyExchgRate(savingData.gpuOndmUseAmt),
        };
        this.createChart('fullSpotChart');
        this.createChart('GPUSpotChart');
        this.isLoading = false;
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching monthly saving:', e);
          this.initData();
          this.createChart('fullSpotChart');
          this.createChart('GPUSpotChart');
          this.isLoading = false;
        }
      }
    },
    createChart(idChart) {
      const chart = am4core.create(idChart, am4charts.XYChart);
      const fullSpotData = [
        {
          category: this.$t('advisor.estimatedMonthSave.applySpot'),
          useAmount: this.spotSavingData.useAmount, // Spot 사용액
          savingsAmount: this.spotSavingData.savingsAmount,
        },
      ];
      const GPUSpotData = [
        {
          category: this.$t('advisor.estimatedMonthSave.applyGPUSpot'),
          useAmount: this.gpuSavingData.useAmount,
          savingsAmount: this.gpuSavingData.savingsAmount,
        },
      ];
      chart.data = idChart === 'fullSpotChart' ? fullSpotData : GPUSpotData;
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.maxTooltipDistance = -1;
      chart.cursor.lineY.disabled = true;
      chart.cursor.lineX.disabled = true;
      chart.fontFamily = 'Noto Sans KR';
      chart.tooltip.label.fontSize = 13;
      chart.autoMargins = true;
      chart.paddingTop = 0;
      chart.paddingBottom = 0;
      chart.paddingLeft = 10;
      chart.paddingRight = 30;
      chart.seriesContainer.resizable = false;
      chart.responsive.enabled = true;

      // 범례 추가
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right'; // 범례 위치 설정 ('top', 'right', 'left' 등 사용 가능)
      chart.legend.labels.template.fontSize = 12; // 범례 텍스트 크기 조절
      chart.legend.labels.template.text = '{name}'; // 범례 항목의 텍스트 형식
      chart.legend.itemContainers.template.width = 180; // 범례 항목의 가로 크기

      //define y axes
      let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.gridAlpha = 0;
      categoryAxis.renderer.line.strokeOpacity = 1;
      categoryAxis.renderer.line.stroke = am4core.color('#E9EBED');
      categoryAxis.dataFields.category = 'category';
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 0;
      categoryAxis.renderer.labels.template.disabled = true;
      categoryAxis.tooltip.disabled = true;
      categoryAxis.fontSize = 15;

      //define x axes
      let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.max = Math.max(this.spotSavingData.onDemandAmount, this.spotSavingData.savingsAmount);
      valueAxis.gridAlpha = 0;
      valueAxis.strictMinMax = true;
      valueAxis.calculateTotals = true;
      valueAxis.renderer.labels.template.disabled = true;
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.baseGrid.disabled = true;
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.fontSize = 15;

      const createSeries = (field, category, name, color) => {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.name = name;
        series.dataFields.categoryY = category;
        series.strokeWidth = 0;
        series.fill = am4core.color(color);
        series.tooltip.autoTextColor = false;
        series.tooltip.label.fill = am4core.color('#FFFFFF');
        series.tooltipText = "{name}: ₩{valueX.formatNumber('#,###')}";
        series.clustered = false;
        series.columns.template.width = 117;
        series.columns.template.height = 65;
        series.tooltip.pointerOrientation = 'down';
      };

      const color = idChart === 'fullSpotChart' ? '#99F6E3' : '#FFB9DA';
      const name =
        idChart === 'fullSpotChart'
          ? this.$t('advisor.estimatedMonthSave.applySpot')
          : this.$t('advisor.estimatedMonthSave.applyGPUSpot');
      createSeries('savingsAmount', 'category', this.$t('advisor.estimatedMonthSave.savings'), '#DDDFE3');
      createSeries('useAmount', 'category', name, '#2CC2FD');

      return chart;
    },
    displayCharts(dataType) {
      return Number(this[dataType].savingsAmount) !== 0 && this[dataType].savingsRate !== 0 && !this.isLoading;
    },
    displayNoData(dataType) {
      return Number(this[dataType].savingsAmount) === 0 && this[dataType].savingsRate === 0 && !this.isLoading;
    },
    applyExchgRate(value) {
      return _.isFinite(value) ? Math.round(value * this.exchgRate) : 0;
    },
    applyRate(value) {
      return _.isFinite(value) ? parseFloat(value.toFixed(2)) : 0;
    },
    initData() {
      this.spotSavingData = {
        useAmount: 0,
        savingsAmount: 0,
        savingsRate: 0,
        onDemandAmount: 0,
      };
      this.gpuSavingData = {
        useAmount: 0,
        savingsAmount: 0,
        savingsRate: 0,
        onDemandAmount: 0,
      };
    },
    moveToGpuSpotPage() {
      this.$router.push({
        path: '/advisor/spot/gpuSpot',
        params: {},
      });
    },
  },
};
</script>

<style lang="scss">
#spotEstimatedSaving {
  .estimated-saving {
    display: flex;
    justify-content: space-between;
    gap: 24px;
  }

  .primary {
    color: #00a5ed;
  }

  .savingChartBox {
    margin-top: 0px;
    padding: 24px 32px;

    & h3 {
      font-size: 24px;
      font-weight: 700;
      color: #000;

      & > span {
        color: #666;
        font-size: 18px;
        font-weight: 500;
      }
    }
  }

  .card-container {
    display: flex;
    justify-content: space-around;
    gap: 12px;
  }
  .tootltip-title {
    font-weight: 700;
    padding-bottom: 24px;
  }
  .cards-section {
    display: flex;
    gap: 8px;
  }
  .data-card-section {
    width: 45%;
    padding: 20px 24px;
  }
  .estMonthlyTitle {
    color: #6c9fb2;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }
  .onDemandAmount {
    position: relative;
    width: fit-content;
    left: 28%;
    top: -20px;
    color: #6c9fb2;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }

  .dashboard-title {
    & p {
      color: #999;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
    }

    .view-more {
      color: #999999;
      font-size: 14px;
      margin-right: 28px;
    }

    .view-more:after {
      content: '';
      position: absolute;
      bottom: -6px;
      background: url(../../../../../assets/images/arrow-more-01.svg) 50% 50% no-repeat;
      width: 32px;
      height: 32px;
      transform: rotate(-90deg);
    }
  }
}
</style>
