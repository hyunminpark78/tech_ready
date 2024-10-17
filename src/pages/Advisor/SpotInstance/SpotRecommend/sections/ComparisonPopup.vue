<template>
  <section v-if="visible" class="filter-setting-wrap">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <section v-if="visible" class="flex flex-col justify-between z-30 p-5 rounded policy-content" style="width: 77%">
      <div class="flex justify-between items-center mb-2">
        <p style="font-size: 24px; font-weight: 700; color: #00a8f4">
          {{ $t('advisor.detailTable.spotComparison.title') }}
        </p>
        <div class="flex" style="gap: 20px">
          <!--          <span class="tab-wrap-currency">-->
          <!--            <a :class="currency === 'won' ? 'clicked' : ''" style="width: 40px" @click="currency = 'won'">KRW</a>-->
          <!--            <a :class="currency === 'usd' ? 'clicked' : ''" style="width: 40px" @click="currency = 'usd'">USD</a>-->
          <!--          </span>-->
          <span>
            <a :class="currency === 'won' ? `${btnStyle} ${btnActiveStyle}` : btnStyle" @click="currency = 'won'"
              >KRW</a
            >
            <a :class="currency === 'usd' ? `${btnStyle} ${btnActiveStyle}` : btnStyle" @click="currency = 'usd'"
              >USD</a
            >
          </span>
          <div class="flex items-center gap-4">
            <Select
              :data="selectTimeData"
              :key-getter="(item) => item.value"
              :default-selected="3"
              :placeholder="$t('3개월')"
              select-class="flex items-center justify-between w-full px-4 py-1.5 text-sm text-left bg-white border rounded h-8"
              :arrow-src="require('@/assets/images/arrow-typ-03-up.svg')"
              arrow-class="ml-4 -mr-2"
              option-list-class="absolute z-20 px-1 text-sm text-gray-700 bg-white border rounded border-primary-200"
              option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
              @change="selectTypeRange"
            />
            <p>{{ $t('advisor.detailTable.spotComparison.periodTimeMessage') }}</p>
          </div>
        </div>
      </div>
      <div style="max-height: 80vh; overflow-y: auto">
        <SpotComparisonTable :range-type="rangeType" />
        <CostHistoryChart :range-type="rangeType" />
      </div>
      <div class="text-center mt-2">
        <button
          class="
            inline-block
            px-6
            h-32
            text-sm text-white
            border
            rounded-sm
            bg-primary-400
            border-primary-400
            font-bold
            mt-3
          "
          type="button"
          @click="close()"
        >
          {{ $t('common.button.close') }}
        </button>
      </div>
    </section>
  </section>
</template>

<script>
import SpotComparisonTable from './SpotComparisonTable.vue';
import CostHistoryChart from './CostHistoryChart.vue';
import Select from '@/components/Select';

export default {
  name: 'ComparisonPopup',
  components: { SpotComparisonTable, CostHistoryChart, Select },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currency: 'won',
      rangeType: 90,
      selectTimeData: [],
      btnStyle: `inline-block rounded mw60 py-1 text-center font-bold border border-primary-400 text-sm`,
      btnActiveStyle: 'bg-primary-400 text-white',
    };
  },
  computed: {},
  watch: {
    '$i18n.locale': ['setSelectTimeData'],
  },
  mounted() {
    this.setSelectTimeData();
  },
  methods: {
    close() {
      this.$emit('closePopup');
    },
    setSelectTimeData() {
      this.selectTimeData = [
        {
          text: this.$t('advisor.detailTable.spotComparison.oneWeek'),
          value: 7,
        },
        {
          text: this.$t('advisor.detailTable.spotComparison.oneMonth'),
          value: 30,
        },
        {
          text: this.$t('advisor.detailTable.spotComparison.threeMonths'),
          value: 90,
        },
      ];
    },
    selectTypeRange(typeRange) {
      this.rangeType = typeRange.value;
    },
  },
};
</script>

<style lang="scss">
.spot-pop-up-currency {
  padding: 2px;
}
</style>
