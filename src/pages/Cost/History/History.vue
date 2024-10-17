<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        title="비용"
        title2="사용내역분석"
        :main-icon="{ src: require('@/assets/images/ico-cost.svg') }"
      />
      <Section>
        <SectionMain>
          <UsageHistory></UsageHistory>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import UsageHistory from '@/pages/Analysis/UsageHistory/UsageHistory.vue';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    UsageHistory,
  },
  created() {},
  methods: {
    ...mapActions('analysis', ['fetchCtrt', 'fetchFilter', 'fetchUsage']),
  },
};
</script>
