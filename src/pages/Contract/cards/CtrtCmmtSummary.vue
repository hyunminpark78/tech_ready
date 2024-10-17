<template>
  <div class="rounded-bl-lg rounded-br-lg max-h-856-">
    <div style="height: 100%">
      <table class="w-full bg-white border-t border-primary-200 board-table">
        <thead class="font-bold text-xs- text-primary-600">
          <tr class="border-b border-primary-200 bg-primary-300">
            <th class="px-8 py-4 text-left">{{ $t('cost.turn') }}</th>
            <th class="px-8 py-4">{{ $t('cost.classification') }}</th>
            <th class="w-1/6 px-8 py-4">{{ $t('cost.contractPeriod') }}</th>
            <th class="w-1/6 px-8 py-4">{{ $t('cost.contractAmount') }}</th>
            <th class="w-1/6 px-8 py-4">{{ $t('cost.amountUsed') }}</th>
            <th class="w-1/6 px-8 py-4">{{ $t('cost.achievementRate') }}</th>
            <th class="w-1/6 px-8 py-4">{{ $t('cost.achievementTrend') }}</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr
            v-for="(ctrtCmmt, index) in ctrtCmmtList"
            v-if="ctrtCmmtList.length > 0"
            class="border-b border-primary-200 hover:bg-primary-300"
          >
            <td class="px-5 py-4 text-center">{{ index + 1 }}</td>
            <td class="px-3 py-4 text-center">{{ setCmmtType(ctrtCmmt.cmmtUnitTypCd) }}</td>
            <td class="px-2 py-4 text-center">{{ ctrtCmmt.cmmtStrDt }} ~ {{ ctrtCmmt.cmmtEndDt }}</td>
            <td class="px-8 py-4 text-right">₩{{ ctrtCmmt.cmmtAmt.toLocaleString() }}</td>
            <td class="px-8 py-4 text-right">₩{{ ctrtCmmt.accumUseAmt.toLocaleString() }}</td>
            <td class="px-8 py-4 text-right">{{ ctrtCmmt.useRate.toFixed(1) }}%</td>
            <template v-if="ctrtCmmt.yearSepCd == 1 && ctrtCmmt.yearUseYn === 'Y'">
              <td v-if="ctrtCmmt.yearSepCd == 1" class="px-8 py-4 text-center" :rowspan="setRowSpan(ctrtCmmt.cmmtId)">
                <button
                  class="px-1 py-1.5 text-sm text-white border rounded-sm bg-primary-400 border-primary-400 w-28"
                  style="height: 100%"
                  @click="openCommitmentPop(ctrtCmmt.ctrtId, ctrtCmmt.cmmtUnitTypCd)"
                >
                  {{ $t('common.button.view') }}
                </button>
              </td>
            </template>
            <template v-else-if="ctrtCmmt.yearUseYn === 'N'">
              <td class="px-8 py-4 text-center">
                <button
                  class="px-1 py-1.5 text-sm text-white border rounded-sm bg-primary-400 border-primary-400 w-28"
                  style="height: 100%"
                  @click="openCommitmentPop(ctrtCmmt.ctrtId, ctrtCmmt.cmmtUnitTypCd)"
                >
                  {{ $t('common.button.view') }}
                </button>
              </td>
            </template>
            <template v-else>
              <td></td>
            </template>
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
    <CtrtCommitmentPopup
      v-if="ctrtCommitmentPopupVisible"
      :visible="ctrtCommitmentPopupVisible"
      :popup-params="popupTargetParams"
      @close="ctrtCommitmentPopupClose"
    />
  </div>
</template>

<script>
import CtrtCommitmentPopup from '@/pages/Contract/cards/CtrtCommitmentPopup';
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
  name: 'CtrtCmmtSummary',
  components: { CtrtCommitmentPopup },
  props: {
    ctrtCmmtList: {
      type: Array,
    },
  },
  data() {
    return {
      ctrtCommitmentPopupVisible: false,
      popupTargetParams: {},
    };
  },
  computed: {
    ...mapState('contract', ['list', 'detail', 'ctrtId']),
  },
  methods: {
    setRowSpan(cmmtId) {
      const groupingList = _.groupBy(this.ctrtCmmtList, 'cmmtId');
      return groupingList[cmmtId].length;
    },
    setCmmtType(value) {
      if (value === 'CORP') return '회사단위';
      if (value === 'CTRT') return '계약단위';
    },
    openCommitmentPop(ctrtId, cmmtUnitTypCd) {
      this.popupTargetParams = {
        ctrtId: ctrtId,
        usageType: cmmtUnitTypCd,
        //lastBillYm: lastBillYm,
      };
      this.ctrtCommitmentPopupVisible = true;
    },
    ctrtCommitmentPopupClose() {
      this.ctrtCommitmentPopupVisible = false;
    },
  },
};
</script>

<style scoped></style>
