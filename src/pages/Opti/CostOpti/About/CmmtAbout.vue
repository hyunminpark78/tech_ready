<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <Section>
        <SectionMain>
          <CmmtAboutContents></CmmtAboutContents>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import Section, { SectionLnb, SectionMain } from '@/components/Section';
import CmmtAboutContents from './CmmtAboutContents.vue';

export default {
  components: {
    Section,
    SectionLnb,
    SectionMain,
    CmmtAboutContents,
  },
};
</script>
