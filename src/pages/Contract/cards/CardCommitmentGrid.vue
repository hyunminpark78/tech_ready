<template>
  <div class="mb-8 bg-white border rounded-lg border-primary-200 dashboard-card">
    <template v-if="ctrtCmmtListCnt > 0">
      <h3 class="px-8 font-bold border-b py-7 border-primary-200 border-bottom-none">
        {{ $t('cost.contractAgreementSummary') }}
      </h3>
      <CtrtCmmtSummary :ctrt-cmmt-list="ctrtCmmtList" />
    </template>
    <template v-if="pricingCmmtListCnt > 0">
      <h3 class="px-8 font-bold border-b py-7 border-primary-200 border-bottom-none" style="display: inline-block">
        {{ $t('cost.billingContractSummary') }}
      </h3>
      <span>* {{ $t('cost.usageAchievementView') }}</span>
      <PricingCmmtSummary :pricing-cmmt-list="pricingCmmtList" />
    </template>
    <p v-if="ctrtCmmtListCnt > 0 || pricingCmmtListCnt > 0" class="text-gray-500 p-3 text-sm text-right">
      ※ {{ $t('cost.commitmentAchivementRateDescription') }}
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CtrtCmmtSummary from '@/pages/Contract/cards/CtrtCmmtSummary';
import PricingCmmtSummary from '@/pages/Contract/cards/PricingCmmtSummary';

export default {
  name: 'CardCommitmentGrid',
  components: { PricingCmmtSummary, CtrtCmmtSummary },
  mixins: [],
  props: {
    ctrtCmmtList: {
      type: Array,
    },
    pricingCmmtList: {
      type: Array,
    },
    ctrtCmmtListCnt: {
      type: Number,
    },
    pricingCmmtListCnt: {
      type: Number,
    },
  },
  computed: {
    ...mapState('contract', ['list', 'detail', 'ctrtId']),
  },
};
</script>

<style scoped></style>
