<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <!-- header -->
      <SectionNewHeader
        title-class="flex items-center py-5"
        title2-class="font-bold"
        :main-icon="{ src: require('@/assets/images/chart.svg') }"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title2="$t('advisor.status')"
        :title="$t('advisor.status')"
        :display-exchg-rate="displayExchgRate"
      />
      <!-- header -->
      <Section>
        <SectionMain class="statusMainSection">
          <MainFilter @filterChanged="onFilterChanged" @onCloudChanged="onFilterChanged" />
          <SavingStatusBySpotUsage />
          <CostTrendGraph />
          <UsageDetailTable />
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import { MainFilter, SavingStatusBySpotUsage, CostTrendGraph, UsageDetailTable } from './sections';
import { i18n } from '../../../../../public/locales/i18n';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    SectionLnb,
    Section,
    SectionMain,
    SectionNewHeader,
    MainFilter,
    SavingStatusBySpotUsage,
    CostTrendGraph,
    UsageDetailTable,
  },
  data() {
    return {
      tooltip: false,
    };
  },
  computed: {
    ...mapGetters('spotAdvisor', ['displayExchgRate']),
  },
  watch: {
    '$i18n.locale': 'setAllItem',
  },
  methods: {
    ...mapActions('spotAdvisor', ['fetchSpotUsageSummary', 'fetchRequestGridData', 'fetchDailyRateData']),
    setAllItem() {
      if (i18n.locale === 'ko') {
        this.allItem = {
          id: 'checkAll',
          text: '전체',
        };
      } else {
        this.allItem = {
          id: 'checkAll',
          text: 'All',
        };
      }
    },
    onFilterChanged() {
      this.fetchSpotUsageSummary(true);
      this.fetchDailyRateData(true);
      this.fetchRequestGridData(true);
    },
  },
};
</script>

<style lang="scss">
.statusMainSection {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
