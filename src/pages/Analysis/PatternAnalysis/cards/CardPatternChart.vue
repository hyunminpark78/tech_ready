<template>
  <div class="p-8 mb-8 bg-white border rounded-lg border-primary-200 dashboard-card">
    <!-- <template v-if="hasPatternAnalysisData"> -->
    <template v-if="hasPatternAnalysisData">
      <div class="flex items-center justify-between">
        <h3 class="mb-1 font-bold">{{ $t('cost.costPatternAnalysis') }}</h3>
      </div>

      <p class="text-sm mb-7 text-primary-600">
        {{ $t('cost.costLearnsAndAnalyzeMessage1') }}
        <span class="text-secondary">{{ $t('cost.costLearnsAndAnalyzeMessage2') }}</span
        ><br />
        {{ $t('cost.costLearnsAndAnalyzeMessage3', { value: nextMonth }) }}
      </p>
      <GStackBillChart chart-height="227" chart-theme="dash_aiPattern" :data="convertData" :props-info="propsInfo" />
    </template>

    <!-- No Data -->
    <template v-else>
      <div class="flex items-center justify-between">
        <h3 class="mb-1 font-bold">{{ $t('cost.costPatternAnalysis') }}</h3>
      </div>
      <div class="flex flex-col items-center justify-center" style="height: 293px">
        <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
        <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
      </div>
    </template>
    <!-- // No Data -->
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import { i18n } from '../../../../../public/locales/i18n';
import GStackBillChart from '@/pages/Bill/cards/GStackBillChart.vue';
export default {
  components: { GStackBillChart },
  props: {
    contractId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      propsInfo: {
        keyProp: 'cspPrdtCd',
        insProp: ['curCost', 'bfCost', 'maxCost', 'avgCost'],
        isFormat: true,
      },
    };
  },
  computed: {
    ...mapState('dashboard', ['aiPattern', 'aictrt']),
    ...mapState('analysis', ['aictrt']),
    hasPatternAnalysisData() {
      return this.aiPattern.length > 0 ? true : false;
    },
    nextMonth() {
      if (this.aiPattern.length > 0) {
        if (i18n.locale === 'ko') {
          return moment(this.aiPattern[0].billYm).add(1, 'month').format('YY년 MM월');
        } else {
          return moment(this.aiPattern[0].billYm).add(1, 'month').format('MMMM, YYYY');
        }
      } else {
        return '';
      }
    },
    convertData() {
      let cData = _.cloneDeep(this.aiPattern);
      let tList = [];
      _.map(cData, (item) => {
        let newMap = {};
        if (item.bfCost === undefined || item.bfCost === '') {
          newMap['cspPrdtCd'] = item.cspPrdtCd;
          newMap['billYm'] = item.billYm;
          newMap['curCost'] = item.curCost;
          newMap['bfCost'] = '0';
          newMap['maxCost'] = item.maxCost;
          newMap['avgCost'] = item.avgCost;
          // moment(this.aiPattern[0].billYm).add(1, 'month').format('YY년 MM월') : '';
          tList.push(newMap);
        }
        if (item.curCost === undefined || item.curCost === '') {
          newMap['cspPrdtCd'] = item.cspPrdtCd;
          newMap['billYm'] = item.billYm;
          newMap['curCost'] = '0';
          newMap['bfCost'] = item.bfCost;
          newMap['maxCost'] = item.maxCost;
          newMap['avgCost'] = item.avgCost;
          tList.push(newMap);
        }
      });

      if (tList.length > 0) {
        cData = tList;
      }
      return cData;
    },
  },
  watch: {
    aictrt: function (newVal) {
      if (this.contractId !== null) {
        this.fetchAiPatternAnalysis({ ctrtId: this.contractId });
      } else {
        this.fetchAiPatternAnalysis({ ctrtId: newVal[0].ctrtId });
      }
    },
  },
  methods: {
    ...mapActions('dashboard', ['fetchAiPatternAnalysis']),
  },
};
</script>

<style></style>
