<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainCost')"
        :title2="$t('menu.billingReport')"
        :main-icon="{ src: require('@/assets/images/ico-cost.svg') }"
      />
      <Section>
        <SectionMain></SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
  },
  created() {},
  methods: {},
};
</script>
