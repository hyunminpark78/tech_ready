<template>
  <div class="contents-wrap">

    이것은 상세 보기 페이지 입니다.
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
