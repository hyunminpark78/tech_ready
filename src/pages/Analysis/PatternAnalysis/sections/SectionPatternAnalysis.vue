<template>
  <div class="container">
    <BreadCrumb />
    <CardPatternAnalysisOptions :contract-id="contractId" @change="({ ctrtId }) => (contractId = ctrtId)" />
    <CardPatternChart :contract-id="contractId" />
    <CardPatternGrid :contract-id="contractId" />
  </div>
</template>

<script>
import BreadCrumb from '@/components/BreadCrumb.vue';
import { mapState } from 'vuex';
import CardPatternGrid from '@/pages/Analysis/PatternAnalysis/cards/CardPatternGrid.vue';
import CardPatternAnalysisOptions from '@/pages/Analysis/PatternAnalysis/cards/CardPatternAnalysisOptions.vue';
import CardPatternChart from '@/pages/Analysis/PatternAnalysis/cards/CardPatternChart.vue';

export default {
  components: { BreadCrumb, CardPatternAnalysisOptions, CardPatternChart, CardPatternGrid },
  data() {
    return {
      propsInfo: {
        keyProp: 'cspPrdtCd',
        insProp: ['curCost', 'bfCost', 'maxCost', 'avgCost'],
        isFormat: true,
      },
      contractId: this.$route.params.ctrtId || null,
    };
  },
  computed: {
    ...mapState('dashboard', ['aiPattern']),
    hasPatternAnalysisData() {
      return this.aiPattern.length > 0 ? true : false;
    },
  },
};
</script>
