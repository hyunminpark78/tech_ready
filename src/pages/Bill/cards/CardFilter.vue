<template>
  <Card wrapper-class="flex mb-5 bg-white border rounded-lg border-primary-200 dashboard-card">
    <div class="relative w-2/12 py-4 px-7 select-four">
      <div class="mb-1 text-sm text-primary-600">{{ $t('cost.billingMonth') }}</div>
      <Select
        :data="selectMonthOptions"
        :key-getter="(item) => item.unixTimestamp"
        select-class="flex items-center justify-between w-full font-bold text-gray-700"
        :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
        arrow-class="ml-4"
        option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
        options-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
        :default-selected="contractChrgYm ? (c) => c.unixTimestamp === contractChrgYm : 1"
        @change="handleMonthChange"
      />
    </div>

    <div class="flex w-5/12 py-4 border-l border-r px-7 border-primary-200">
      <div :class="$i18n.locale === 'ko' ? 'w-3/12' : 'w-4/12'">
        <div class="mb-1 text-sm text-primary-600">{{ $t('cost.totalNumberBills') }}</div>
        <div class="text-xl font-bold text-gray-700">{{ summary.billCnt }}</div>
      </div>
      <div :class="$i18n.locale === 'ko' ? 'w-6/12' : 'w-5/12'">
        <div class="mb-1 text-sm text-primary-600">{{ $t('cost.totalBillAmount') }}</div>
        <div class="text-xl font-bold text-gray-700">￦{{ summary.billAmt | number }}</div>
      </div>
      <div v-if="filter.chrgYm !== 'ALL'" class="w-3/12">
        <div class="mb-1 text-sm text-primary-600">{{ $t('cost.comparisonOfPrevious') }}</div>
        <template v-if="Number(summary.rate) > 0">
          <div class="flex items-center text-xl font-bold text-primary-400">
            <span class="mr-2 text-chart1">{{ summary.rate | numberToFixed }}%</span>
            <img src="@/assets/images/ico-up.svg" alt="." class="ml-4" />
          </div>
        </template>
        <template v-else-if="Number(summary.rate) < 0">
          <div class="flex items-center text-xl font-bold text-primary-400">
            <span class="mr-2">{{ summary.rate | numberToFixed }}%</span>
            <img src="@/assets/images/ico-down.svg" alt="." class="ml-4" />
          </div>
        </template>
        <template v-else>
          <div class="flex items-center text-xl font-bold text-primary-400">
            <span class="mr-2">{{ summary.rate }}%</span>
          </div>
        </template>
      </div>
    </div>

    <div class="relative w-5/12 py-4 px-7 select-four">
      <div class="mb-1 text-sm text-primary-600">{{ $t('cost.contract') }}</div>
      <Select
        :data="selectContractOptions"
        :key-getter="(item) => item.id"
        :text-getter="(item) => item.title"
        select-class="flex items-center justify-between w-full font-bold text-gray-700"
        :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
        arrow-class="ml-4"
        option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
        option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
        :default-selected="contractId ? (c) => c.ctrtId === contractId : (c) => c.ctrtId === 'total'"
        @change="handleContractChange"
      />
    </div>
  </Card>
</template>

<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import Card from '@/components/Card';
import Select from '@/components/Select';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: {
    Card,
    Select,
  },
  data() {
    return {
      selectMonthOptions: [],
      selectContractOptions: [],
      contractId: this.$route.params.ctrtId || null,
      contractChrgYm: this.$route.params.chrgYm || null,
    };
  },
  computed: {
    ...mapState('bill', ['summary', 'chrgYm', 'ctrt', 'filter', 'bill']),
  },
  watch: {
    '$i18n.locale': function () {
      this.fetchCtrt({ chrgYm: this.filter.chrgYm });
      this.fetchChrgYm();
    },
    chrgYm: function (newVal, oldVal) {
      this.setMonth(newVal);
    },
    ctrt: function (newVal, oldVal) {
      this.setCtrt(newVal);
    },
  },
  created() {},
  methods: {
    ...mapActions('bill', ['setFilter', 'fetchChrgYm', 'fetchBill', 'fetchSummary', 'fetchCtrt']),
    setMonth(data) {
      if (data.length) {
        this.selectMonthOptions = [];
        let obj = { unixTimestamp: '', text: '' };
        this.selectMonthOptions.push({
          unixTimestamp: 'ALL',
          text: i18n.locale === 'ko' ? '전체' : 'All',
        });
        data.map((elem) => {
          obj = {
            unixTimestamp: elem.chrgYm,
            text:
              i18n.locale === 'ko'
                ? moment(elem.chrgYm).format('YYYY년 M월')
                : moment(elem.chrgYm).format('MMMM, YYYY'),
          };
          this.selectMonthOptions.push(obj);
        });
        if (!this.contractChrgYm) {
          this.setFilter({ name: 'chrgYm', payload: this.selectMonthOptions[1].unixTimestamp });
          this.fetchCtrt({ chrgYm: this.selectMonthOptions[1].unixTimestamp });
        }
      }
    },
    setCtrt(data) {
      this.selectContractOptions.splice(0);
      const options = data.map(function (el) {
        return {
          id: el.ctrtId + el.ctrtNm,
          ctrtId: el.ctrtId,
          title: el.ctrtNm,
        };
      });
      // this.setFilter({ name: 'ctrt', payload: 'total' });
      this.selectContractOptions = [
        {
          id: 'total',
          ctrtId: 'total',
          title:
            i18n.locale === 'ko'
              ? `전체 계약 (총 ${options.length}건)`
              : `All contracts (Total ${options.length} case(s))`,
        },
        ...options,
      ];
      if (!this.selectContractOptions.some((option) => option.ctrtId === this.contractId)) {
        this.contractId = 'total';
        this.setFilter({ name: 'ctrt', payload: 'total' });
      }
    },
    handleMonthChange(item) {
      this.contractChrgYm = item.unixTimestamp;
      this.setFilter({ name: 'chrgYm', payload: item.unixTimestamp });
      if (!this.filter.ctrt) {
        this.setFilter({ name: 'ctrt', payload: 'total' });
      }
      this.fetchSummary({ chrgYm: this.filter.chrgYm });
      this.fetchBill({ chrgYm: this.filter.chrgYm, ctrtId: this.filter.ctrt });
      this.fetchCtrt({ chrgYm: this.filter.chrgYm }).then(() => {
        const selectedContract = this.selectContractOptions.find((option) => option.ctrtId === this.contractId);
        if (!selectedContract) {
          this.contractId = 'total'; // 두번째 필터 아이디
          this.setFilter({ name: 'ctrt', payload: 'total' });

          this.$nextTick(() => {
            const totalOption = this.selectContractOptions.find((option) => option.ctrtId === 'total');
            if (totalOption) {
              this.$refs.contractSelect.selectedItem = totalOption;
            }
          });
        }
      });
    },
    handleContractChange(item) {
      this.contractId = item.ctrtId;
      this.setFilter({ name: 'ctrt', payload: item.ctrtId });
      if (!this.filter.ctrt) {
        this.setFilter({ name: 'ctrt', payload: 'total' });
      }
      this.fetchBill({ chrgYm: this.filter.chrgYm, ctrtId: this.filter.ctrt });
    },
  },
};
</script>
