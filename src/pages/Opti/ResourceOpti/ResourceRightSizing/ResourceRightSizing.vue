<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainOptimization')"
        title2="자원비용최적화"
        title3="Rightsizing"
      />

      <Section>
        <SectionMain>
          <ResourceRightSizingFilter
            ref="rightSizingFilterRef"
            @onCloudChanged="onCloudChanged"
            @onFilterChanged="onFilterChanged"
          ></ResourceRightSizingFilter>
          <ResourceRightSizingChart
            ref="rightSizingChartRef"
            @onCategoryChanged="onCategoryChanged"
          ></ResourceRightSizingChart>
          <ResourceRightSizingGrid ref="rightSizingGridRef" @onTypeChanged="onTypeChanged"></ResourceRightSizingGrid>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import ResourceRightSizingFilter from './ResourceRightSizingFilter';
import ResourceRightSizingChart from './ResourceRightSizingChart';
import ResourceRightSizingGrid from './ResourceRightSizingGrid';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    ResourceRightSizingGrid,
    ResourceRightSizingChart,
    ResourceRightSizingFilter,
  },
  beforeRouteLeave(to, from, next) {
    this.fetchCategory('');
    next();
  },
  data() {
    return {
      cspTypCdFromRoute: this.$route.params.cspTypCd || null,
      categoryFromRoute: this.$route.params.category || null,
    };
  },
  computed: {
    ...mapState('resourceOpti', {
      filter: 'filter',
      cspReference: 'cspReference',
    }),
  },
  created() {
    this.initCspTypCd();
    this.initCategory();
  },
  mounted() {},
  methods: {
    ...mapActions('resourceOpti', [
      'fetchParam',
      'fetchCategory',
      'fetchUpdateRightsizingChart',
      'fetchUpdateRightsizingGrid',
    ]),
    initCspTypCd() {
      if (this.cspTypCdFromRoute) {
        this.fetchParam({ state: { cspTypCd: this.cspTypCdFromRoute } });
      }
    },
    initCategory() {
      if (this.categoryFromRoute) {
        this.fetchCategory(this.categoryFromRoute);
      }
    },
    onCloudChanged() {
      this.fetchUpdateRightsizingChart(true);
      this.fetchUpdateRightsizingGrid(true);
    },
    onFilterChanged() {
      this.fetchUpdateRightsizingChart(true);
      this.fetchUpdateRightsizingGrid(true);
    },
    onCategoryChanged() {
      this.fetchUpdateRightsizingChart(true);
      this.fetchUpdateRightsizingGrid(true);
    },
    onTypeChanged() {
      this.fetchUpdateRightsizingGrid(true);
    },
  },
};
</script>
