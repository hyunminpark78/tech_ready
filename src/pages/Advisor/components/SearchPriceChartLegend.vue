<template>
  <div class="legend-chart">
    <div class="flex items-center" style="gap: 5px; margin-bottom: 8px">
      <div
        :style="{
          width: '16px',
          height: '16px',
          backgroundColor: legendData.color,
        }"
      ></div>
      <p>{{ this.tab === 1 ? legendData.availableArea : legendData.instanceName }}</p>
    </div>
    <div class="flex items-center" style="gap: 5px">
      <p class="title-legend">{{ $t('advisor.detailTable.spotComparison.averageSavingsRate') }}</p>
      <p style="color: #00a5ed">{{ legendData.averageSavingRate ? legendData.averageSavingRate + '%' : '-' }}</p>
    </div>
    <div class="flex items-center" style="gap: 5px">
      <p class="title-legend">
        {{ $t('advisor.detailTable.spotComparison.estimateCost') }}
      </p>
      <p>{{ legendData.estimatedCost ? (usdCurrency ? '$' : '￦' + formatToPrice(legendData.estimatedCost)) : '-' }}</p>
    </div>
  </div>
</template>

<script>
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
export default {
  components: {},
  props: {
    tab: {
      type: Number,
      default: 1,
    },
    legendData: {
      type: Object,
      default: () => ({
        instanceName: 'g4dn.xlarge',
        averageSavingRate: 64.28,
        averageAmount: 20.04,
        color: '#2CC2FD',
      }),
    },
    usdCurrency: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    formatToPrice(value) {
      return numberWithCommas(parseFloat(value).toFixed(0));
    },
  },
};
</script>

<style>
.legend-chart {
  display: flex;
  flex-direction: column;
  border: 1px solid #e9ebed;
  width: fit-content;
  height: fit-content;
  padding: 18px 40px;
  border-radius: 4px;
  background-color: #fff;
}
.title-legend {
  color: #999999;
  padding-left: 0 !important;
}
</style>
