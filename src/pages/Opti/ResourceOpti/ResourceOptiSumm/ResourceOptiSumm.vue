<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainOptimization')"
        title2="자원비용최적화"
        :title3="$t('menu.resourceDashboard')"
      />

      <Section>
        <SectionMain>
          <ResourceOptiSummFilter ref="summFilter" @onFilterChanged="onFilterChanged"></ResourceOptiSummFilter>
          <ResourceOptiSummExpctDis ref="summExpctDis"></ResourceOptiSummExpctDis>
          <ResourceOptiSummUnuseRsrc ref="summUnuseRsrc" @movePage="onMovePage"></ResourceOptiSummUnuseRsrc>
          <ResourceOptiSummRightSizing ref="summRightSizing" @movePage="onMovePage"></ResourceOptiSummRightSizing>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import ResourceOptiSummFilter from './ResourceOptiSummFilter';
import ResourceOptiSummExpctDis from './ResourceOptiSummExpctDis';
import ResourceOptiSummUnuseRsrc from './ResourceOptiSummUnuseRsrc';
import ResourceOptiSummRightSizing from './ResourceOptiSummRightSizing';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    ResourceOptiSummFilter,
    ResourceOptiSummExpctDis,
    ResourceOptiSummUnuseRsrc,
    ResourceOptiSummRightSizing,
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
    ...mapActions('resourceOpti', ['fetchParam']),
    onFilterChanged(exchangeRate, totalCost, unusedResourceDataMap, rightsizingDataMap, expctDisRate) {
      this.$refs.summExpctDis.setData(exchangeRate, totalCost, unusedResourceDataMap, rightsizingDataMap, expctDisRate);
      this.$refs.summUnuseRsrc.setData(exchangeRate, unusedResourceDataMap);
      this.$refs.summRightSizing.setData(exchangeRate, rightsizingDataMap);
    },
    onMovePage() {
      this.$refs.summFilter.fetchAllSelectedFilter();
    },
    initCspTypCd() {
      if (this.cspTypCdFromRoute) {
        this.fetchParam({ state: { cspTypCd: this.cspTypCdFromRoute } });
      }
    },
  },
};
</script>
