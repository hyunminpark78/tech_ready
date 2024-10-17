<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainResource')"
        :title2="$t('menu.usage')"
        :main-icon="{ src: require('@/assets/images/ico-resource-usage.svg') }"
      />
      <Section>
        <SectionMain>
          <UsagFilter @onCloudChanged="onCloudChanged" @onFilterChanged="onFilterChanged" />
          <UsagChart ref="usagChartRef" @onCategoryChanged="onCategoryChanged" />
          <UsagGrid ref="usagGridRef" />
        </SectionMain>
      </Section>
    </div>
  </div>
</template>
<script>
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import UsagChart from './UsagChart';
import UsagGrid from './UsagGrid';
import UsagFilter from './UsagFilter';
import { mapActions } from 'vuex';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    UsagFilter,
    UsagChart,
    UsagGrid,
  },
  beforeRouteLeave(to, from, next) {
    this.fetchCategory('');
    next();
  },
  data() {
    return {
      cspTypCdFromRoute: this.$route.params.cspTypCd || null,
    };
  },
  created() {
    this.initCspTypCd();
  },
  methods: {
    ...mapActions('performance', ['fetchParam', 'fetchCategory', 'fetchUpdateUsageChart', 'fetchUpdateUsageGrid']),
    initCspTypCd() {
      if (this.cspTypCdFromRoute) {
        this.fetchParam({ state: { cspTypCd: this.cspTypCdFromRoute } });
      }
    },
    onCloudChanged() {
      this.fetchUpdateUsageChart(true);
      this.fetchUpdateUsageGrid(true);
    },
    onFilterChanged() {
      this.fetchUpdateUsageChart(true);
      this.fetchUpdateUsageGrid(true);
    },
    onCategoryChanged() {
      this.fetchUpdateUsageChart(true);
      this.fetchUpdateUsageGrid(true);
    },
  },
};
</script>
