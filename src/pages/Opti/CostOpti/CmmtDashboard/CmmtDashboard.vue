<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainOptimization')"
        title2="구매비용최적화"
        :title3="$t('menu.commitmentDashboard')"
        :sub-title="isAutospContractSelected ? $t('optimization.autospExcludedDesc') : ''"
      />
      <Section>
        <SectionMain>
          <CmmtDashboardFilter></CmmtDashboardFilter>
          <CmmtOverview></CmmtOverview>
          <CmmtCurStatInvn></CmmtCurStatInvn>
          <CmmtTrendChart></CmmtTrendChart>
          <CmmtSummaryGrid></CmmtSummaryGrid>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import CmmtDashboardFilter from './CmmtDashboardFilter';
import CmmtOverview from './CmmtOverview.vue';
import CmmtCurStatInvn from '../CmmtCurStat/CmmtCurStatInvn.vue';
import CmmtTrendChart from './CmmtTrendChart.vue';
import CmmtSummaryGrid from './CmmtSummaryGrid.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    CmmtDashboardFilter,
    CmmtOverview,
    CmmtCurStatInvn,
    CmmtTrendChart,
    CmmtSummaryGrid,
  },
  computed: {
    ...mapGetters('costOpti', ['isAutospContractSelected']),
  },
};
</script>
