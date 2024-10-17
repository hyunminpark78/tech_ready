<template>
  <div class="legend-chart-comp">
    <div class="flex items-center legendTitle">
      <p class="header-text">{{ legendData.headerText }}</p>
      <div
        :style="{
          width: '16px',
          height: '16px',
          marginLeft: '10px',
          backgroundColor: legendData.color,
        }"
      ></div>
      <p>{{ legendData.instanceName }}</p>
    </div>
    <div class="flex" style="gap: 5px; width: 100%">
      <div class="legend-item-left">
        <p class="title">{{ $t('advisor.detailTable.spotComparison.averageSavingsRate') }}</p>
        <p style="color: #00a5ed">{{ legendData.averageSavingRate ? legendData.averageSavingRate + '%' : '-' }}</p>
      </div>
      <div class="legend-item-right">
        <p class="title">{{ $t('advisor.detailTable.spotComparison.interruptionFrequency') }}</p>
        <p>{{ legendData.interruptionFrequency ? legendData.interruptionFrequency : '-' }}</p>
      </div>
    </div>
    <div class="flex" style="gap: 5px">
      <div class="legend-item-left">
        <p class="title">{{ $t('advisor.detailTable.spotComparison.currentRate') }}</p>
        <p>{{ legendData.currentRate ? '₩' + formatToPrice(legendData.currentRate) : '-' }}</p>
      </div>
      <div class="legend-item-right">
        <p class="title">{{ $t('advisor.detailTable.spotComparison.averageAmount') }}</p>
        <p>₩{{ formatToPrice(legendData.averageAmount) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
export default {
  components: {},
  props: {
    legendData: {
      type: Object,
      default: () => ({
        headerText: '동일 타입',
        instanceName: 'g4dn.xlarge',
        averageSavingRate: '64.28%',
        averageAmount: '$20.04',
        currentRate: '$204',
        irruptionRate: '<5%',
        color: '#2CC2FD',
      }),
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
.legend-chart-comp {
  display: flex;
  flex-direction: column;
  gap: 1px;
  border: 1px solid #e9ebed;
  width: 26%;
  padding: 12px 20px;
  border-radius: 4px;

  .title {
    color: #999999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .legend-item-left {
    display: flex;
    height: fit-content;
    width: 50%;
    gap: 3px;
  }
  .legend-item-right {
    display: flex;
    height: fit-content;
    width: 50%;
    gap: 3px;
  }

  .header-text {
    color: #4a4a4a;
    font-weight: 700;
  }
  .legendTitle {
    gap: 8px;
    margin-bottom: 10px;
  }
}
</style>
