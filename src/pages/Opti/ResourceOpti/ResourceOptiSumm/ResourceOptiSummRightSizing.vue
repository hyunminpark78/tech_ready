<template>
  <!-- Rightsizing -->
  <div class="box-wrap type3">
    <div class="title">
      <h4 class="tit-wrap">
        <span>Rightsizing</span>
        <!-- tooltip -->
        <div class="tooltip-wrap">
          <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
          <div class="tooltip-layer">
            <strong class="ti">Rightsizing</strong>
            {{ $t('optimization.processMatching') }}
            <button class="close jsTooltipClose1">툴팁 닫기</button>
          </div>
        </div>
        <!-- //tooltip -->
      </h4>
      <RouterLink ref="redirect" :to="$route.query.redirect ? $route.query.redirect : '/opti/resource/rightsizing'">
        <a href="#" class="more" @click="navigateToRightsizing(rightsizingDataList[0].category.rsrcType)">{{
          $t('common.button.viewDetails')
        }}</a>
      </RouterLink>
    </div>
    <div class="grid3-wrap mt10">
      <!-- col -->
      <div
        class="col"
        style="
          max-width: 380px !important;
          min-width: 380px !important;
          min-height: 168px;
          border-radius: 4px;
          border: solid 1px #00a5ed;
          padding-top: 16px;
        "
      >
        <div class="list2-wrap type2">
          <div class="ti" style="padding-left: 12px">
            <strong class="text-primary-400">{{ $t('optimization.totalEstimatedSavingsRightsizing') }}</strong>
          </div>
          <div class="pr text-center" style="margin-top: 20px">
            ￦<span id="jsCount8">{{ numberCutDecimal(totalCost) }}</span>
          </div>
          <div class="sc" style="padding-left: 12px">
            <div class="text-primary-800">
              <span style="color: #000000">{{ $t('optimization.targetResource') }}</span>
              <span class="text-secondary ml-1">{{ totalCnt }} {{ $t('optimization.unit') }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- //col -->
      <!-- col -->
      <div class="col mt0 flex-2">
        <div class="flex list3-wrap gCol2">
          <div
            v-for="rightsizingData in rightsizingDataList"
            :key="rightsizingData.category.code"
            :class="['co', rightsizingData.category.code]"
            style="min-height: 168px"
            @click.self="navigateToRightsizing(rightsizingData.category.rsrcType)"
          >
            <strong class="ti">{{ rightsizingData.category.name }} {{ $t('optimization.savings') }}</strong>
            <div class="pr">￦{{ numberCutDecimal(rightsizingData.cost * exchangeRate) }}</div>
          </div>
        </div>
      </div>
      <!-- //col -->
    </div>
    <!--    <div v-if="isRightSizingAllZero" class="centered-content">
      <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
      <p class="mt-3 text-gray-700">표시할 데이터가 없습니다.</p>
    </div>-->
  </div>
  <!-- //Rightsizing -->
</template>
<script>
import { mapActions } from 'vuex';
import { numberCutDecimal } from '@/pages/Opti/ResourceOpti/ResourceOptiCommon';

export default {
  data() {
    return {
      totalCost: '',
      rightsizingDataMap: new Map(),
      exchangeRate: 0,
      totalCnt: 0,
    };
  },
  computed: {
    isRightSizingAllZero() {
      return this.rightsizingDataList.every((data) => !data.count && !data.cost);
    },
    rightsizingDataList() {
      return Array.from(this.rightsizingDataMap.values());
    },
  },
  methods: {
    ...mapActions('resourceOpti', ['fetchCategory', 'fetchRsCost']),
    numberCutDecimal: numberCutDecimal,

    navigateToRightsizing(category) {
      this.$emit('movePage');
      this.$router.push({
        name: 'Rightsizing',
        params: {
          category: category,
        },
      });
    },

    initData() {
      this.totalCost = '';
      this.rightsizingDataMap = new Map();
      this.totalCnt = 0;
    },

    setData(exchangeRate, rightsizingDataMap) {
      this.initData();
      this.exchangeRate = exchangeRate;
      this.rightsizingDataMap = rightsizingDataMap;

      this.totalCost = this.sumCosts() * this.exchangeRate;
      this.fetchRsCost(Math.trunc(this.totalCost));
      this.totalCnt = this.sumCounts();
    },

    sumCosts() {
      return this.rightsizingDataList.reduce((sum, rightsizingData) => sum + rightsizingData.cost, 0);
    },

    sumCounts() {
      return this.rightsizingDataList.reduce((sum, rightsizingData) => sum + rightsizingData.count, 0);
    },
  },
};
</script>
<style>
.pr {
  pointer-events: none;
}
.co {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}
.centered-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
