<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainCost')"
        :title2="$t('menu.costPatternAnalytics')"
        :main-icon="{ src: require('@/assets/images/ico-cost.svg') }"
      />
      <Section>
        <SectionMain>
          <CardPatternAnalysisOptions :contract-id="contractId" @change="({ ctrtId }) => (contractId = ctrtId)" />
          <CardPatternChart :contract-id="contractId" />
          <CardPatternGrid :contract-id="contractId" />
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import CardPatternGrid from '@/pages/Analysis/PatternAnalysis/cards/CardPatternGrid.vue';
import CardPatternAnalysisOptions from '@/pages/Analysis/PatternAnalysis/cards/CardPatternAnalysisOptions.vue';
import CardPatternChart from '@/pages/Analysis/PatternAnalysis/cards/CardPatternChart.vue';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    CardPatternGrid,
    CardPatternAnalysisOptions,
    CardPatternChart,
  },
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
  created() {},
  methods: {},
};
</script>
