<template>
  <Section>
    <SectionHeader
      title-class="flex items-center mb-5 text-xl"
      :icon="{ src: require('@/assets/images/ico-report.svg'), alt: '사용 현황' }"
      title="사용 현황"
    />

    <SectionMain>
      <!-- TODO: Filters -->
      <div class="mb-3 overflow-hidden bg-white rounded-lg">
        <FilterCategory
          :data="ctgry"
          :filter="filter.category"
          :available-items="availableCategories"
          @change="(category) => $emit('filter-category-change', category)"
        />
        <FilterProvider
          v-if="isPublicCloud"
          :data="providers"
          :filter="filter.providers"
          @change="(data) => $emit('filter-csp-change', data)"
        />
      </div>

      <!-- ##### Public Cloud ##### -->
      <template v-if="isPublicCloud">
        <!-- Card : 이번달 사용 비용 -->
        <CardCost />
        <div class="flex justify-between card-wrap-2 mb-12">
          <!-- Card : 리소스 -->
          <CardResource />
          <!-- Card : CardUsage -->
          <CardUsage />
        </div>
      </template>

      <!-- ##### Cloud Network ##### -->
      <template v-else-if="isCloudNetwork">
        <!-- Card : 이번달 사용 비용 -->
        <CardCloudNetwork />
      </template>

      <!-- ##### MEC ##### -->
      <template v-else-if="isMec">
        <CardMec />

        <CardMecUsage />
      </template>

      <!-- ##### Security ##### -->
      <template v-else-if="isSecurity">
        <div class="flex justify-between mb-8 card-wrap-2">
          <!-- Card : 계약 라이선스 사용현황 -->
          <CardContractLicense />
          <!-- Card : 일별 Asset Count 현황 -->
          <CardAssetCount />
        </div>

        <div class="flex justify-between mb-8 card-wrap-2">
          <!-- Card : Cloud 보안 Rule 점검 결과 -->
          <CardRuleCheckResult />
          <!-- Card : Security Group의 Any Open 현황 -->
          <CardAnyOpen />
        </div>

        <!-- Card : Cloud 보안 Rule 위반 리소스 (Top 10) -->
        <CardViolationResource />
      </template>
    </SectionMain>
  </Section>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Section, { SectionHeader, SectionMain } from '@/components/Section';
import { CardCost, CardResource, CardUsage, CardCloudNetwork, CardMec, CardMecUsage } from '@/pages/Dashboard/cards';
import FilterProvider from './FilterProvider.vue';
import FilterCategory from './FilterCategory.vue';
import CardContractLicense from '../../cards/CardContractLicense.vue';
import CardAssetCount from '../../cards/CardAssetCount.vue';
import CardRuleCheckResult from '../../cards/CardRuleCheckResult.vue';
import CardAnyOpen from '../../cards/CardAnyOpen.vue';
import CardViolationResource from '../../cards/CardViolationResource.vue';

export default {
  components: {
    CardCost,
    CardResource,
    Section,
    SectionHeader,
    SectionMain,
    CardUsage,
    FilterProvider,
    FilterCategory,
    CardContractLicense,
    CardAssetCount,
    CardAnyOpen,
    CardRuleCheckResult,
    CardViolationResource,
    CardCloudNetwork,
    CardMec,
    CardMecUsage,
  },
  props: {
    filter: {
      type: Object,
      default: () => ({
        category: {},
        providers: [],
        contract: {},
      }),
    },
  },
  computed: {
    ...mapState('dashboard', ['ctgry', 'providers', 'usageCost', 'usageFilter']),
    ...mapGetters('dashboard', ['availableCategories']),
    isPublicCloud() {
      return this.filter.category.name === 'Public Cloud';
    },
    isCloudNetwork() {
      return this.filter.category.name === 'Cloud Network';
    },
    isMec() {
      return this.filter.category.name === 'MEC';
    },
    isSecurity() {
      return this.filter.category.name === 'Security';
    },
  },
  watch: {
    // filter: function (newVal, oldVal) {
    //   console.log('watch filter', newVal);
    //   if (newVal.contract.ctrtId !== undefined && newVal.contract.ctrtId !== 'CTRT_ALL') {
    //     this.setCategories(newVal.contract.ctrtId);
    //     this.setCsp(newVal.contract.ctrtId);
    //     // this.setUsageCost(newVal.contract.ctrtId, 'ACNT');
    //   }
    // },
  },
  methods: {},
};
</script>
