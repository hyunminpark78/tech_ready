<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainOptimization')"
        title2="자원비용최적화"
        :title3="$t('menu.unusedResource')"
      />

      <Section>
        <SectionMain>
          <UnusedResourceFilter
            ref="unusedFilterRef"
            @onCloudChanged="onCloudChanged"
            @onFilterChanged="onFilterChanged"
          />
          <UnusedResourceChart ref="unusedChartRef" @onCategoryChanged="onCategoryChanged"></UnusedResourceChart>
          <UnusedResourceGrid ref="unusedGridRef" @onTypeChanged="onTypeChanged"></UnusedResourceGrid>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import UnusedResourceFilter from './UnusedResourceFilter';
import UnusedResourceChart from './UnusedResourceChart';
import UnusedResourceGrid from './UnusedResourceGrid';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    UnusedResourceGrid,
    UnusedResourceFilter,
    UnusedResourceChart,
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
      'fetchUpdateUnusedResourceChart',
      'fetchUpdateUnusedResourceGrid',
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
      this.fetchUpdateUnusedResourceChart(true);
      this.fetchUpdateUnusedResourceGrid(true);
    },
    onFilterChanged() {
      this.fetchUpdateUnusedResourceChart(true);
      this.fetchUpdateUnusedResourceGrid(true);
    },
    onCategoryChanged() {
      this.fetchUpdateUnusedResourceChart(true);
      this.fetchUpdateUnusedResourceGrid(true);
    },
    onTypeChanged() {
      this.fetchUpdateUnusedResourceGrid(true);
    },
  },
};
</script>
