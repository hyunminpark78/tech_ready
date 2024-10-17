<template>
  <main class="pb-12 main">
    <div>
      <div class="flex mb-8 bg-white border rounded-lg border-primary-200 dashboard-card">
        <div class="w-2/12 p-4 text-center border-r border-primary-200">
          <div class="text-sm mb-2 text-primary-600">{{ $t('cost.totalNumberBillings') }}</div>
          <div class="text-xl font-bold">{{ contractSummary.ctrtCnt }}</div>
        </div>

        <div class="w-5/12 p-4 text-center border-r border-primary-200">
          <div class="text-sm mb-2 text-primary-600">{{ $t('cost.contractStatus') }}</div>
          <div class="flex font-bold">
            <div class="w-1/2">
              {{ $t('cost.proceeding') }} <span class="text-primary-400">{{ contractSummary.ctrtIngCnt }}</span>
              {{ $t('cost.case') }}
            </div>
            <div class="w-1/2">
              {{ $t('cost.contractExpiration') }} <span class="text-primary-400">{{ contractSummary.expireCnt }}</span>
              {{ $t('cost.case') }}
            </div>
          </div>
        </div>

        <div class="w-3/12 p-4 text-center border-r border-primary-200">
          <div class="text-sm mb-2 text-primary-600">{{ $t('cost.totalContractAmount') }}</div>
          <div class="text-xl font-bold">￦{{ contractSummary.ctrtTotAmt | number }}</div>
        </div>

        <div class="w-2/12 p-4 text-center">
          <div class="text-sm mb-2 text-primary-600">{{ $t('cost.usageRatePrevious') }}</div>
          <div class="text-xl font-bold text-primary-400">{{ contractSummary.useAmtRate }}%</div>
        </div>
      </div>
      <CardContractGrid />
      <template v-if="ctrtCmmtListCnt > 0 || pricingCmmtListCnt > 0">
        <CardCommitmentGrid
          :ctrt-cmmt-list="ctrtCmmtList"
          :pricing-cmmt-list="pricingCmmtList"
          :ctrt-cmmt-list-cnt="ctrtCmmtListCnt"
          :pricing-cmmt-list-cnt="pricingCmmtListCnt"
        />
      </template>
      <CardContractOverView />
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CardContractGrid from '@/pages/Contract/cards/CardContractGrid.vue';
import CardContractOverView from '@/pages/Contract/cards/CardContractOverView.vue';
import CardCommitmentGrid from '@/pages/Contract/cards/CardCommitmentGrid';
import contractService from '@/services/contractService';
export default {
  components: { CardCommitmentGrid, CardContractGrid, CardContractOverView },
  data() {
    return {
      contractSummary: {
        ctrtCnt: '',
        ctrtIngCnt: '',
        ctrtTotAmt: '',
        expireCnt: '',
        useAmtRate: '',
      },
      ctrtCmmtList: [],
      pricingCmmtList: [],
      ctrtCmmtListCnt: 0,
      pricingCmmtListCnt: 0,
    };
  },
  computed: {
    ...mapState('contract', ['summary', 'ctrtId']),
  },
  watch: {
    '$i18n.locale': 'fetchList',
    summary: function (newVal, oldVal) {
      console.log('newVal', newVal);
      if (newVal !== undefined) {
        this.setData(newVal);
      }
    },
    ctrtId: function (newVal, oldVal) {
      if (newVal !== undefined) {
        this.getCtrtCmmtList();
        this.getPricingCmmtList();
      }
    },
  },
  created() {
    this.fetchList();
    // this.fetchDetail({ ctrtId: 'CTRT0000000001' });
    this.fetchSummary();
    this.fetchStat();
    this.fetchPrdtStat();
    this.getCtrtCmmtList();
    this.getPricingCmmtList();
  },
  methods: {
    ...mapActions('contract', ['fetchList', 'fetchDetail', 'fetchSummary', 'fetchStat', 'fetchPrdtStat']),
    setData(summaryData) {
      console.log('setData', summaryData);
      this.contractSummary.ctrtCnt = summaryData.ctrtCnt;
      this.contractSummary.ctrtIngCnt = summaryData.ctrtCnt - summaryData.expireCnt;
      this.contractSummary.ctrtTotAmt = summaryData.ctrtTotAmt;
      this.contractSummary.expireCnt = summaryData.expireCnt;
      this.contractSummary.useAmtRate = summaryData.useAmtRate;
    },
    async getCtrtCmmtList() {
      if (this.ctrtId !== null || this.ctrtId !== '') {
        await contractService
          .fetchCtrtCmmt({
            ctrtId: this.ctrtId,
          })
          .then((response) => {
            if (response.data.code === 'SUCCESS') {
              this.ctrtCmmtList = response.data.data;
              this.ctrtCmmtListCnt = this.ctrtCmmtList.length;
            } else {
              console.log('fail response', response);
            }
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    },
    async getPricingCmmtList() {
      if (this.ctrtId !== null || this.ctrtId !== '') {
        await contractService
          .fetchPricingCmmt({
            ctrtId: this.ctrtId,
          })
          .then((response) => {
            if (response.data.code === 'SUCCESS') {
              this.pricingCmmtList = response.data.data;
              this.pricingCmmtListCnt = this.pricingCmmtList.length;
            } else {
              console.log('fail response', response);
            }
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    },
  },
};
</script>
