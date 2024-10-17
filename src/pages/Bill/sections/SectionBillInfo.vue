<template>
  <Section>
    <SectionHeader
      title-class="flex items-center mt-4 mb-5 text-2xl--"
      :icon="{ src: require('@/assets/images/ico-billing.svg'), alt: 'ico-billing' }"
      title="청구정보"
    />
    <SectionMain>
      <CardBillChart />
      <CardFilter />
      <CardBillGrid />
      <CardOverview />
    </SectionMain>
  </Section>
</template>

<script>
import { mapActions } from 'vuex';
import Section, { SectionHeader, SectionMain } from '@/components/Section';
import CardBillChart from '../cards/CardBillChart.vue';
import CardFilter from '../cards/CardFilter.vue';
import CardBillGrid from '../cards/CardBillGrid.vue';
import CardOverview from '../cards/CardOverview.vue';
import moment from 'moment';

export default {
  components: {
    Section,
    SectionHeader,
    SectionMain,
    CardBillChart,
    CardFilter,
    CardBillGrid,
    CardOverview,
  },

  created() {
    // this.fetchTrend({ trendYear: moment().format('YYYY'), tabType: 'CTRT' });
    this.fetchTrendYear();
    this.fetchChrgYm();
    // this.fetchSummary();
    // this.fetchBill({ billYm: moment().format('YYYYMM'), ctrtId: 'total' });
    // this.fetchBillDetail({ ctrtId: 'CTRT0000000005', billYm: '202103', tapType: 'TOTAL' });
    // this.fetchCtrt();
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
