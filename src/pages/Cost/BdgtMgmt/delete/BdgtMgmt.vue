<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <main class="main">
      <div class="contents">
        <Section>
          <SectionNewHeader
            title-class="flex items-center py-5"
            :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
            :title="'예산관리'"
            :title2="'예산관리'"
            :main-icon="{ src: require('@/assets/images/ico-cost.svg') }"
          />
        </Section>
        <SectionMain>
          <!-- 예산 현황 -->
          <BdgtMgmtSituation />
          <!-- 예산 목록 -->
          <BdgtMgmtList />
        </SectionMain>
      </div>
    </main>
  </div>
</template>

<script>
import Section, { SectionNewHeader, SectionMain, SectionLnb } from '@/components/Section';
import BdgtMgmtSituation from '@/pages/Cost/BdgtMgmt/BdgtMgmtSituation.vue';
import BdgtMgmtList from '@/pages/Cost/BdgtMgmt/BdgtMgmtList.vue';

export default {
  components: {
    SectionNewHeader,
    Section,
    SectionMain,
    SectionLnb,
    BdgtMgmtSituation,
    BdgtMgmtList,
  },
  data() {
    return {
      toggle: false,
    };
  },
  created() {},
  methods: {},
};
</script>
<style src="@/assets/jhstyle.css"></style>
