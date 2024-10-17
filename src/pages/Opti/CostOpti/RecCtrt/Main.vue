<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainOptimization')"
        title2="구매비용최적화"
        :title3="$t('menu.recommendations')"
        :sub-title="isAutospContractSelected ? $t('optimization.autospExcludedDesc') : ''"
      />
      <Section>
        <SectionMain>
          <RecFilter />
          <RecOptionChart />
          <RecDetailGrid />
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import RecFilter from './RecFilter.vue';
import RecOptionChart from './RecOptionChart.vue';
import RecDetailGrid from './RecDetailGrid.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    RecFilter,
    RecOptionChart,
    RecDetailGrid,
  },
  computed: {
    ...mapGetters('costOpti', ['isAutospContractSelected']),
  },
};
</script>
