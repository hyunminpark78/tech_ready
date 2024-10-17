<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainOptimization')"
        title2="구매비용최적화"
        :title3="$t('menu.commitmentStatus')"
        :sub-title="isAutospContractSelected ? $t('optimization.autospExcludedDesc') : ''"
      />
      <Section>
        <SectionMain>
          <CmmtCurStatFilter :cmmt-typ="cmmtTyp" :acnt-id="acntId" :prod="prod"></CmmtCurStatFilter>
          <CmmtCurStatUtl :trend-offset-top="trendOffsetTop"></CmmtCurStatUtl>
          <CmmtCurStatInvn :grid-offset-top="gridOffsetTop"></CmmtCurStatInvn>
          <CmmtCurStatTrend ref="trend" :trend-offset-top="trendOffsetTop"></CmmtCurStatTrend>
          <CmmtCurStatGrid ref="grid" :grid-offset-top="gridOffsetTop"></CmmtCurStatGrid>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import CmmtCurStatFilter from './CmmtCurStatFilter';
import CmmtCurStatUtl from './CmmtCurStatUtl';
import CmmtCurStatInvn from './CmmtCurStatInvn';
import CmmtCurStatTrend from './CmmtCurStatTrend.vue';
import CmmtCurStatGrid from './CmmtCurStatGrid.vue';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    CmmtCurStatFilter,
    CmmtCurStatUtl,
    CmmtCurStatInvn,
    CmmtCurStatTrend,
    CmmtCurStatGrid,
  },
  data() {
    return {
      cmmtTyp: 'SP',
      acntId: '',
      prod: '',
      trendOffsetTop: 0,
      gridOffsetTop: 0,
    };
  },
  computed: {
    ...mapGetters('costOpti', ['isAutospContractSelected']),
  },
  created() {
    const { cmmtTyp, acntId, prod, chart, grid } = this.$route.query;
    this.cmmtTyp = cmmtTyp;
    this.acntId = acntId;
    this.prod = prod;

    if (chart || grid) {
      this.fetchActive({
        state: {
          chart: chart ? chart : '',
          grid: grid ? grid : '',
        },
      });
    }
  },
  mounted() {
    this.trendOffsetTop = this.$refs.trend.$el.offsetTop;
    this.gridOffsetTop = this.$refs.grid.$el.offsetTop;
  },
  methods: {
    ...mapActions('costOpti', ['fetchParam', 'fetchActive']),
  },
};
</script>
