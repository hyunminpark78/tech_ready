<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :main-icon="{ src: require('@/assets/images/ico-setting-aws.svg') }"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.setting')"
        :title2="$t('menu.serviceGroupSetting')"
      />
      <Section>
        <SectionMain>
          <SvcGrpMgmtCtrt></SvcGrpMgmtCtrt>
          <SvcGrpMgmtGrid></SvcGrpMgmtGrid>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import SvcGrpMgmtCtrt from './SvcGrpMgmtCtrt';
import SvcGrpMgmtGrid from './SvcGrpMgmtGrid';

export default {
  name: 'SvcGrpMgmt',
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    SvcGrpMgmtCtrt,
    SvcGrpMgmtGrid,
  },

  created() {},
  methods: {},
};
</script>
