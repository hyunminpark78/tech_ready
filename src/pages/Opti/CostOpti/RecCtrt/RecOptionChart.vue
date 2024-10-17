<template>
  <div class="dashboard-card mb-4">
    <div class="box-wrap list2-wrap type2" style="height: 212px">
      <div class="col">
        <DataLoadingOverlay v-if="loading" :height="195"></DataLoadingOverlay>
        <div v-show="!loading">
          <div class="ti">
            <strong class="text-primary-400">{{ $t('optimization.estimatedSavingsApplying') }}</strong>
            <div class="text-gray-500">{{ $t('optimization.additionalMonthlySavingsExpected') }}</div>
          </div>
          <div class="pr">
            ￦<span id="jsCount5">{{ mnthSaveCost }}</span>
          </div>
          <div class="sc">
            <div class="text-primary-800">{{ $t('optimization.expectedSavingsRecommendationsApplied') }}</div>
            <div class="flex items-center text-primary-400">
              <strong class="mr-2">{{ afterPurchaseSaveRt }}%</strong>
              <img src="@/assets/images/ico-red.svg" alt="." class="rotate-180-" />
            </div>
          </div>
          <div
            id="saveChart"
            class="chart-wrap"
            :style="{
              fontSize: '24px',
              letterSpacing: '-0.03px',
              textAlign: 'center',
              color: '#fff',
              lineHeight: '156px',
              height: 'auto',
              display: allList.length > 0 ? 'block' : 'none',
              width: '70% !important',
              top: '30px',
            }"
          ></div>
        </div>
      </div>
      <div class="col">
        <DataLoadingOverlay v-if="loading" :height="195"></DataLoadingOverlay>
        <div v-show="!loading">
          <div class="ti">
            <strong class="text-primary-400">{{ $t('optimization.expectedContractCoverage') }}</strong>
            <div class="text-gray-500">{{ $t('optimization.expectedTotalCoverage') }}</div>
          </div>
          <div class="pr">{{ exptCvrgRt }}%</div>
          <div class="sc">
            <div class="text-primary-800">{{ $t('optimization.additionalCoverageRecommended') }}</div>
            <div class="flex items-center text-primary-400">
              <strong class="mr-2">{{ afterPurchaseCvrgRt }}%</strong>
              <img src="@/assets/images/ico-red.svg" alt="." class="rotate-180-" />
            </div>
          </div>
          <div
            id="predictCoverageChart"
            class="chart-wrap"
            :style="{
              fontSize: '24px',
              letterSpacing: '-0.03px',
              textAlign: 'center',
              color: '#fff',
              lineHeight: '156px',
              height: 'auto',
              display: allList.length > 0 ? 'block' : 'none',
              width: '65% !important',
              top: '30px',
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { mapState } from 'vuex';
import { numberCutDecimal, numberProcess } from '../CmmtPsblTgt/CostOptiCommon';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay.vue';
import commonMixin from '@/pages/Mixin/commonMixin';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: { DataLoadingOverlay },
  mixins: [commonMixin],
  props: {
    type: {
      type: String,
      default: 'saving',
    },
  },
  data() {
    return {
      afterPurchaseSaveRt: 0,
      afterPurchaseCvrgRt: 0,
      mnthSaveCost: 0,
      exptCvrgRt: 0,
      title: '',
      subTitle: '',
      allList: [],
      titles: {},
    };
  },
  computed: {
    ...mapState('costOpti', ['recommendOption', 'loading']),
    getCmmtTitle() {
      const cmmtTyp = this.recommendOption.type;
      return this.titles[this.getCspTypCd(cmmtTyp)].cmmt;
    },
  },
  watch: {
    '$i18n.locale': 'setTitle',
    loading() {
      this.createSaveChart();
      this.createPredictCoverageChart();
    },
    recommendOption(newVal) {
      this.allList = newVal.allList;
    },
  },
  created() {
    this.setTitle();
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
  },
  methods: {
    setTitle() {
      if (i18n.locale === 'ko') {
        this.titles = {
          AWS: { cmmt: '온디맨드', acct: '계정' },
          AZURE: { cmmt: '종량제', acct: 'Subscription' },
          GCP: { cmmt: '온디맨드', acct: '계정' }, // TODO: GCP 화면 추가 시 변경 필요!
        };
      } else {
        this.titles = {
          AWS: { cmmt: 'On-Demand', acct: 'Accounts' },
          AZURE: { cmmt: 'PAYG', acct: 'Subscription' },
          GCP: { cmmt: 'On-Demand', acct: 'Accounts' }, // TODO: GCP 화면 추가 시 변경 필요!
        };
      }
    },
    createSaveChart() {
      const chart = am4core.create('saveChart', am4charts.XYChart);
      chart.data = this.predictSave();
      this.createXaxis(chart);
      this.createYaxis(chart, 'saving');
      this.createSeries(chart, 'saving');
    },
    createPredictCoverageChart() {
      const chart = am4core.create('predictCoverageChart', am4charts.XYChart);
      chart.data = this.cvrgRtData();
      this.createXaxis(chart);
      this.createYaxis(chart, 'reserve');
      this.createSeries(chart, 'reserve');
    },

    createXaxis(chart) {
      const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      xAxis.dataFields.category = 'title';
      xAxis.renderer.grid.template.disabled = true;
      xAxis.fontSize = 13;
      xAxis.renderer.minGridDistance = 0;
    },
    createYaxis(chart, name) {
      const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.grid.template.disabled = true;

      chart.plotContainer.paddingTop = 15;
      yAxis.paddingTop = 15;

      if (name === 'saving') {
        yAxis.title.text = '(₩)'; // Y축 범례 추가

        yAxis.title.dy = -30;
        yAxis.title.dx = 95;
        yAxis.numberFormatter.numberFormat = '#,###.';
      } else {
        yAxis.title.text = '(%)'; // Y축 범례 추가

        yAxis.numberFormatter.numberFormat = '#,###.##';
        yAxis.title.dy = -30;
        yAxis.title.dx = 35;
      }
      yAxis.title.rotation = 0;
      yAxis.title.align = 'center';
      yAxis.title.valign = 'top';
      yAxis.title.fill = am4core.color('#6c9fb2');

      yAxis.min = 0;
      yAxis.fontSize = 15;
    },

    createSeries(chart, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());

      series.dataFields.valueY = 'value';
      series.dataFields.openValueY = 'startValue';
      series.dataFields.categoryX = 'title';

      series.name = name;
      series.columns.template.adapter.add('fill', function (fill, target) {
        return am4core.color(target.dataItem.dataContext.color);
      });
      if (name === 'saving') {
        series.columns.template.tooltipText = '[#FFFFFF]{name} : ₩{resultData}';
      } else {
        series.columns.template.tooltipText = '[#FFFFFF]{name} : {resultData}%';
      }
      series.tooltip.fontSize = 12;
      series.columns.template.tooltipY = 0;
      series.columns.template.strokeOpacity = 0;
    },
    // 추천 적용 예상 절감액
    predictSave() {
      //예상절감액(차트): 현재절감금액 + 월별절감금액
      const mnthOnDmndCost = this.recommendOption.checkObj.mnthOnDmndCost;
      const mnthSaveCost = (() => {
        switch (this.recommendOption.type) {
          case 'SP':
          case 'RI':
            return this.recommendOption.checkObj.mnthSaveCost;
          case 'AzureRI':
            return this.recommendOption.checkObj.mnthExpctCmmtSaveCost;
          default:
            return 0;
        }
      })();
      const predictSave = mnthOnDmndCost - mnthSaveCost;

      // start : predictSave ~ end : mnthOnDmndCost
      this.afterPurchaseSaveRt = numberProcess((mnthSaveCost / mnthOnDmndCost) * 100);
      this.mnthSaveCost = numberCutDecimal(mnthSaveCost);
      return [
        {
          startValue: 0,
          value: mnthOnDmndCost,
          title: `${this.getCmmtTitle} ${this.$t('optimization.cost')}`,
          name: `${this.getCmmtTitle} ${this.$t('optimization.cost')}`,
          color: '#1ae3bb',
          resultData: mnthOnDmndCost - 0,
        },
        {
          startValue: 0,
          value: predictSave,
          title: this.$t('optimization.monthlyCostAfterPurchase'),
          name: this.$t('optimization.monthlyCostAfterPurchase'),
          color: '#1ae3bb',
          resultData: predictSave - 0,
        },
        {
          startValue: predictSave,
          value: mnthOnDmndCost,
          title: this.$t('optimization.monthlyCostAfterPurchase'),
          name: this.$t('optimization.estimatedSavingsApplying'),
          color: '#2cc2fd',
          resultData: numberCutDecimal(mnthOnDmndCost - predictSave),
        },
      ];
    },

    cvrgRtData() {
      const exptCvrgRt = this.recommendOption.checkObj.exptCvrgRt;
      const cvrgRt = this.recommendOption.checkObj.cvrgRt;
      this.afterPurchaseCvrgRt = numberProcess(exptCvrgRt - cvrgRt);
      this.exptCvrgRt = numberProcess(exptCvrgRt);
      return [
        {
          startValue: 0,
          value: cvrgRt,
          title: this.$t('optimization.currentContractCoverage'),
          name: this.$t('optimization.currentContractCoverage'),
          color: '#1ae3bb',
          resultData: cvrgRt - 0,
        },
        {
          startValue: 0,
          value: exptCvrgRt,
          title: this.$t('optimization.expectedContractCoverageRate'),
          name: this.$t('optimization.expectedContractCoverageRate'),
          color: '#2cc2fd',
          resultData: exptCvrgRt - 0,
        },
      ];
    },
  },
};
</script>
