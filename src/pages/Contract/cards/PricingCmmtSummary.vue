<template>
  <div class="rounded-bl-lg rounded-br-lg max-h-856-">
    <div style="height: 100%">
      <table class="w-full bg-white border-t border-primary-200 board-table">
        <thead class="font-bold text-xs- text-primary-600">
          <tr class="border-b border-primary-200 bg-primary-300">
            <th class="px-8 py-4 text-left">{{ $t('cost.turn') }}</th>
            <th class="w-3/12 px-8 py-4">{{ $t('cost.chargeName') }}</th>
            <th class="w-1/6 px-8 py-4">{{ $t('cost.contractCondition') }}</th>
            <th class="w-1/6 px-8 py-4">{{ $t('cost.usage') }}</th>
            <th class="w-1/6 px-8 py-4">{{ $t('cost.achievementRate') }}</th>
            <th class="w-1/6 px-8 py-4">{{ $t('cost.achievementTrend') }}</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr
            v-for="(pricingCmmt, index) in pricingCmmtList"
            v-if="pricingCmmtList.length > 0"
            class="border-b border-primary-200 hover:bg-primary-300"
          >
            <td class="px-5 py-4 text-center">{{ index + 1 }}</td>
            <td class="px-3 py-4 text-left">{{ pricingCmmt.pricingNm }}</td>
            <td class="px-2 py-4 text-right">
              {{ pricingCmmt.cmmtVal.toLocaleString() }}{{ pricingCmmt.cmmtUnit }}({{
                setCmmtTermType(pricingCmmt.cmmtTermTypCd)
              }})
            </td>
            <td class="px-8 py-4 text-right">
              {{ pricingCmmt.accumUsageQty.toLocaleString() }}{{ pricingCmmt.cmmtUnit }}
            </td>
            <td class="px-8 py-4 text-right">{{ pricingCmmt.useRate.toFixed(1) }}%</td>
            <td class="px-8 py-4 text-center">
              <button
                class="px-1 py-1.5 text-sm text-white border rounded-sm bg-primary-400 border-primary-400 w-28"
                style="height: 100%"
                @click="openCommitmentPop(pricingCmmt)"
              >
                {{ $t('common.button.view') }}
              </button>
            </td>
          </tr>
          <tr v-else>
            <td colspan="7">
              <div class="flex flex-col items-center justify-center" style="height: 293px">
                <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
                <p class="text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <CommitmentPopup
      v-if="pricingCommitmentPopupVisible"
      :visible="pricingCommitmentPopupVisible"
      :popup-params="popupTargetParams"
      @close="pricingCommitmentPopupClose"
    />
  </div>
</template>

<script>
import CommitmentPopup from '@/pages/Contract/cards/CommitmentPopup';
import { mapState } from 'vuex';

export default {
  name: 'PricingCmmtSummary',
  components: { CommitmentPopup },
  props: {
    pricingCmmtList: {
      type: Array,
    },
  },
  data() {
    return {
      pricingCommitmentPopupVisible: false,
      popupTargetParams: {},
    };
  },
  computed: {
    ...mapState('contract', ['list', 'detail', 'ctrtId']),
  },
  methods: {
    setCmmtTermType(value) {
      if (value === 'INVALI') return '유효기간 내';
      if (value === 'MTH') return '월간';
      if (value === 'YR') return '년 간';
    },
    openCommitmentPop(params) {
      this.popupTargetParams = {
        ctrtId: this.ctrtId,
        ctrtVerVal: params.ctrtVerVal,
        prdtId: params.prdtId,
        pricingId: params.pricingId,
      };
      this.pricingCommitmentPopupVisible = true;
    },
    pricingCommitmentPopupClose() {
      this.pricingCommitmentPopupVisible = false;
    },
  },
};
</script>

<style scoped></style>
