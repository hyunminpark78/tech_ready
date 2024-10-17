<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainOptimization')"
        title2="Trusted Advisor"
        :title3="$t('menu.costOptimization')"
      />
      <Section>
        <SectionMain>
          <CostOptiTAFilter></CostOptiTAFilter>
          <CostOptiTAStatus @changeData="changeData"></CostOptiTAStatus>
          <CostOptiTaGrid ref="taGridRef"></CostOptiTaGrid>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import Section, { SectionLnb, SectionMain, SectionNewHeader } from '@/components/Section';
import CostOptiTAFilter from './CostOptiTAFilter';
import CostOptiTAStatus from './CostOptiTAStatus';
import CostOptiTaGrid from './CostOptiTaGrid';
import { i18n } from '../../../../../public/locales/i18n';
export default {
  components: {
    CostOptiTaGrid,
    CostOptiTAStatus,
    SectionNewHeader,
    Section,
    SectionLnb,
    SectionMain,
    CostOptiTAFilter,
  },
  data() {
    return {
      checkTypeList: {},
    };
  },
  watch: {
    '$i18n.locale': 'setCheckTypeList',
  },
  created() {
    this.setCheckTypeList();
  },
  methods: {
    setCheckTypeList() {
      if (i18n.locale === 'ko') {
        this.checkTypeList = [
          { name: '조치권고', value: 'error' },
          { name: '검토권고', value: 'warning' },
          { name: '정상', value: 'ok' },
          { name: '제외항목', value: 'suppressed' },
        ];
      } else {
        this.checkTypeList = [
          { name: 'Recommendation for action', value: 'error' },
          { name: 'Review recommendation', value: 'warning' },
          { name: 'Normal', value: 'ok' },
          { name: 'Excluded items', value: 'suppressed' },
        ];
      }
    },
    changeData(chkStatCd) {
      let param = {};
      this.checkTypeList.forEach((item) => {
        if (chkStatCd === item.value) {
          param = item;
        }
      });
      this.$refs.taGridRef.handleCheckTypeChange(param, true);
    },
  },
};
</script>
