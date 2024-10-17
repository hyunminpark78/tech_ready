<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        title2-class="font-bold"
        :main-icon="{ src: require('@/assets/images/ico-resource-usage.svg') }"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainResource')"
        :title2="$t('menu.performance')"
      />
      <Section>
        <SectionMain>
          <PerformanceFilter @onCloudChanged="onCloudChanged" @onFilterChanged="onFilterChanged" />
          <PerformanceChart ref="performanceChartRef" @onCategoryChanged="onCategoryChanged" />
          <PerformanceGrid ref="performanceGridRef" />
        </SectionMain>
      </Section>
    </div>
  </div>
</template>
<script>
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import PerformanceChart from './PerformanceChart';
import PerformanceFilter from './PerformanceFilter';
import PerformanceGrid from './PerformanceGrid';
import { mapActions } from 'vuex';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    PerformanceFilter,
    PerformanceChart,
    PerformanceGrid,
  },
  beforeRouteLeave(to, from, next) {
    this.fetchCategory('');
    next();
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions('performance', ['fetchCategory', 'fetchUpdatePerformanceChart', 'fetchUpdatePerformanceGrid']),
    onCloudChanged() {
      this.fetchUpdatePerformanceChart(true);
      this.fetchUpdatePerformanceGrid(true);
    },
    onCategoryChanged() {
      this.fetchUpdatePerformanceChart(true);
      this.fetchUpdatePerformanceGrid(true);
    },
    onFilterChanged() {
      this.fetchUpdatePerformanceChart(true);
      this.fetchUpdatePerformanceGrid(true);
    },
  },
};
</script>
