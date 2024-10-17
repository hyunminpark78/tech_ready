<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>

    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainCost')"
        :title2="$t('menu.billingInvoice')"
        :main-icon="{ src: require('@/assets/images/ico-cost.svg') }"
      />
      <Section>
        <SectionMain>
          <CardBillChart />
          <CardFilter />
          <CardBillGrid />
          <CardOverview />
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import CardOverview from '@/pages/Bill/cards/CardOverview.vue';
import CardBillGrid from '@/pages/Bill/cards/CardBillGrid.vue';
import CardFilter from '@/pages/Bill/cards/CardFilter.vue';
import CardBillChart from '@/pages/Bill/cards/CardBillChart.vue';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    CardBillChart,
    CardFilter,
    CardBillGrid,
    CardOverview,
  },
  created() {
    this.fetchTrendYear();
    this.fetchChrgYm();
  },
  methods: {
    ...mapActions('bill', [
      // 'fetchTrend',
      'fetchTrendYear',
      'fetchChrgYm',
      // 'fetchSummary',
      // 'fetchBill',
      'fetchBillDetail',
      // 'fetchCtrt',
      'addFilter',
      'removeFilter',
      'setFilter',
    ]),
  },
};
</script>
