<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :main-icon="{ src: require('@/assets/images/ico-setting-aws.svg') }"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.setting')"
        :title2="$t('menu.cloudAccountSync')"
      />

      <RadioGroup
        ref="radioGroup"
        class="flex box-wrap overflow-hidden border-primary-200 tab-one"
        :default-active-index="cspIndex"
        :active-classes="['clicked']"
      >
        <button class="w-1/2 py-5 text-gray-600 border-r bg-white" @click="cspChange('AWS')">AWS</button>
        <button class="w-1/2 py-5 text-gray-600 border-r bg-white" @click="cspChange('AZURE')">AZURE</button>
      </RadioGroup>

      <div class="box-wrap">
        <Section>
          <SectionMain>
            <template v-if="cspTypCd === 'AWS'">
              <AwsAcctMgmtFilter></AwsAcctMgmtFilter>
              <AwsAcctMgmtGrid></AwsAcctMgmtGrid>
            </template>
            <template v-if="cspTypCd === 'AZURE'">
              <AzureAcctMgmtFilter></AzureAcctMgmtFilter>
              <AzureAcctMgmtGrid></AzureAcctMgmtGrid>
            </template>
          </SectionMain>
        </Section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import AwsAcctMgmtFilter from './AwsAcctMgmt/AwsAcctMgmtFilter';
import AwsAcctMgmtGrid from './AwsAcctMgmt/AwsAcctMgmtGrid';
import AzureAcctMgmtFilter from './AzureAcctMgmt/AzureAcctMgmtFilter.vue';
import AzureAcctMgmtGrid from './AzureAcctMgmt/AzureAcctMgmtGrid.vue';
import RadioGroup from '@/components/RadioGroup.vue';

export default {
  name: 'AwsAcctMgmt',
  components: {
    RadioGroup,
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    AwsAcctMgmtFilter,
    AwsAcctMgmtGrid,
    AzureAcctMgmtFilter,
    AzureAcctMgmtGrid,
  },

  computed: {
    ...mapState('azureAcctMgmt', ['cspTypCd']),
    cspIndex() {
      switch (this.cspTypCd) {
        case 'AWS':
          return 0;
        case 'AZURE':
          return 1;
        case 'GCP':
          return 2;
        default:
          return 0;
      }
    },
  },
  created() {},
  methods: {
    ...mapActions('azureAcctMgmt', ['setCSP']),
    cspChange(cloud) {
      this.setCSP(cloud);
    },
  },
};
</script>
