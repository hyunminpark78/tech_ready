<template>
  <!-- 미사용자원 -->
  <div class="box-wrap type3">
    <div class="title">
      <h4 class="tit-wrap">
        <span>{{ $t('optimization.unusedResources') }}</span>
        <!-- tooltip -->
        <div class="tooltip-wrap">
          <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
          <div class="tooltip-layer">
            <strong class="ti">{{ $t('optimization.unusedResources') }}</strong>
            {{ $t('optimization.unconnectedCloudResources') }}
            <button class="close jsTooltipClose1">툴팁 닫기</button>
          </div>
        </div>
        <!-- //tooltip -->
      </h4>
      <RouterLink ref="redirect" :to="$route.query.redirect ? $route.query.redirect : '/opti/resource/unused'">
        <a href="#" class="more" @click="navigateToUnusedRsrc(unusedResourceDataList[0].category.rsrcType)">{{
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
            <strong class="text-primary-400">{{ $t('optimization.estimatedSavingsResources') }}</strong>
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
      <div class="col mt0 flex-2" style="min-height: 168px">
        <div class="flex list3-wrap gCol2" style="height: 100%; min-height: 168px">
          <div
            v-for="unusedResourceData in unusedResourceDataList"
            :key="unusedResourceData.category.code"
            :class="['co', unusedResourceData.category.code]"
            @click.self="navigateToUnusedRsrc(unusedResourceData.category.rsrcType)"
          >
            <strong class="ti" style="color: #00a5ed"
              >{{ unusedResourceData.category.name }} {{ $t('optimization.savings') }}</strong
            >
            <div class="pr text-center">￦{{ numberCutDecimal(unusedResourceData.cost * exchangeRate) }}</div>
          </div>
        </div>
        <!--        <div class="flex list3-wrap gCol2">

        </div>-->
      </div>
      <!-- //col -->
    </div>
    <!--    <div v-else class="centered-content">
      <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
      <p class="mt-3 text-gray-700">표시할 데이터가 없습니다.</p>
    </div>-->
  </div>
  <!-- //미사용자원 -->
</template>
<script>
import { mapActions } from 'vuex';
import { numberCutDecimal } from '@/pages/Opti/ResourceOpti/ResourceOptiCommon';

export default {
  data() {
    return {
      totalCost: '',
      unusedResourceDataMap: new Map(),
      exchangeRate: 0,
      totalCnt: 0,
    };
  },
  computed: {
    isUnusedAllZero() {
      return this.unusedResourceDataList.every((data) => !data.count && !data.cost);
    },
    unusedResourceDataList() {
      return Array.from(this.unusedResourceDataMap.values());
    },
  },
  methods: {
    ...mapActions('resourceOpti', ['fetchCategory', 'fetchUnusedCost']),
    numberCutDecimal: numberCutDecimal,

    navigateToUnusedRsrc(category) {
      this.$emit('movePage');
      this.$router.push({
        name: '미사용자원',
        params: {
          category: category,
        },
      });
    },
    initData() {
      this.totalCost = '';
      this.unusedResourceDataMap = new Map();
      this.totalCnt = 0;
    },

    setData(exchangeRate, unusedResourceDataMap) {
      this.initData();

      this.exchangeRate = exchangeRate;
      this.unusedResourceDataMap = unusedResourceDataMap;

      this.totalCost = this.sumCosts() * this.exchangeRate;
      this.fetchUnusedCost(Math.trunc(this.totalCost));
      this.totalCnt = this.sumCounts();
    },

    sumCosts() {
      return this.unusedResourceDataList.reduce((sum, unusedResourceData) => sum + unusedResourceData.cost, 0);
    },

    sumCounts() {
      return this.unusedResourceDataList.reduce((sum, unusedResourceData) => sum + unusedResourceData.count, 0);
    },
  },
};
</script>

<style>
.pr {
  pointer-events: none;
}

.co {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center !important;
  align-items: stretch;
  min-height: 168px;
  background-size: 50px 50px !important;
  padding: 16px 0 12px 20px !important;
  position: relative;
  background-position: 16px 10% !important;
}

.centered-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.list3-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch; /* 자식 요소들의 높이를 동일하게 설정 */
  height: 100%;
}

.col {
  //height: 100%;
}

.list3-wrap .co .pr {
  font-size: 20px !important;
  flex-grow: 1; /* Takes up all available space, pushing .ti to the top */
  display: flex !important;
  align-items: center !important;
  color: black !important;
  padding-bottom: 30px !important;
}
.list3-wrap .co .ti {
  align-self: flex-start; /* Aligns this item to the top */
  color: #00a5ed !important;
  margin-left: 58px !important;
  margin-top: 8px !important;
}
.ti {
}
</style>
