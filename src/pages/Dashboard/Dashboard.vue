<template>
  <div>
    <div class="bg-white">
      <!-- Section : 요약 -->
      <transition name="slide-down">
        <SectionSummary />
      </transition>
    </div>
    <main class="pt-8 pb-12 main">
      <div class="container">
        <div class="relative mb-8 bg-white border rounded-lg border-primary-200 dashboard-card select-one">
          <!-- 계약 Select-->
          <Select
            :data="selectContractOptions"
            :key-getter="(item) => item.ctrtId"
            :text-getter="(item) => item.ctrtNm"
            :default-selected="setDefaultSelected"
            select-class="flex items-center justify-between w-full py-5 text-xl text-left px-7 text-primary-400"
            :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
            arrow-class="-mr-2"
            option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
            option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
            @click="handleFilterContractChange"
          />
        </div>

        <!-- Section : 맞춤분석 및 예측 -->
        <transition name="slide-up">
          <SectionAnalysisAndPrediction
            :senseSetVal="senseSetVal"
            :userArmIntvl="userArmIntvl"
            @change-user-sensitive="handleUserSensitive"
            @change-user-arm-intvl="handleUserArmIntvl"
            :hasAiPattern="hasAiPattern"
            :hasAiAnormal="hasAiAnormal"
          />
        </transition>

        <!-- Section : 사용내역 -->
        <transition name="slide-up">
          <SectionUsageHistory
            :filter="{
              category: filter.category,
              providers: filter.providers,
              contract: filter.contract,
            }"
            @filter-category-change="handleFilterCategoryChange"
            @filter-csp-change="handleFilterCspChange"
          />
        </transition>

        <!-- Section : 기타 서비스 -->
<!--        <transition name="slide-up">-->
<!--          <SectionOtherService />-->
<!--        </transition>-->
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import Select from '@/components/Select';
import moment from 'moment';
import dashboardService from '@/services/dashboardService';
export default {
  components: {
    Select,
    SectionSummary: () => import('@/pages/Dashboard/sections/SectionSummary.vue'),
    SectionAnalysisAndPrediction: () => import('@/pages/Dashboard/sections/SectionAnalysisAndPrediction.vue'),
    SectionUsageHistory: () => import('@/pages/Dashboard/sections/SectionUsageHistory'),
    SectionOtherService: () => import('@/pages/Dashboard/sections/SectionOtherService'),
  },
  data() {
    return {
      billYm: moment().subtract(3, 'days').format('YYYYMM'),
      // billYm: '202107',
      stdDt: moment().subtract(3, 'days').format('YYYYMMDD'),
      nowStdDt: moment().format('YYYYMM'),
      senseSetVal: 'M',
      userArmIntvl: {
        intvlStrAmt: 0,
        intvlEndAmt: 0,
      },
    };
  },
  computed: {
    ...mapState('dashboard', ['filter', 'aiPattern', 'abNormalDetect']),
    ...mapGetters('dashboard', [
      'selectContractOptions',
      'availableCategories',
      'selectUsageStateOptions',
      'availableProviders',
      'selectUserSensitive',
      'selectUserArmIntvl',
    ]),
    hasAiPattern() {
      // return true;
      return this.aiPattern.length > 0 ? true : false;
    },
    hasAiAnormal() {
      // return true;
      return this.abNormalDetect.length > 0 ? true : false;
    },
    setDefaultSelected() {
      return this.selectContractOptions.length > 1 ? 1 : 0;
    },
  },
  created() {
    // 초기설정 (기본 데이터로 바인딩)
    dashboardService.fetchCtrt().then((res) => {
      const result = res.data.data;
      if (result.length > 0) {
        this.fetchCtrt(result);
        this.setFilter({
          name: 'contract',
          payload: result[0],
        });
        const ctrtId = result[0].ctrtId;
        this.fetchCtgry({ ctrtId: ctrtId }).then(() => {
          this.setFilter({
            name: 'category',
            payload: this.availableCategories.find((e, i) => i === 0),
          });
        });
        this.fetchCsp({ ctrtId: ctrtId, billYm: this.billYm }).then(() => {
          this.setFilter({
            name: 'providers',
            payload: this.availableProviders.map((e) => e.provider),
          });
        });
        this.fetchPeriod({ ctrtId: ctrtId, billYm: this.billYm });
        this.fetchUsageFilter({ ctrtId: ctrtId, billYm: this.billYm });
        this.fetchUsageCost({
          ctrtId: ctrtId,
          billYm: this.billYm,
          usageType: 'CTRT',
          scrType: 'public',
        });
        this.fetchResourceState({
          ctrtId: ctrtId,
          billYm: this.billYm,
          stdDt: this.stdDt,
        });
        this.fetchServerUsage({ ctrtId: ctrtId, billYm: this.billYm });
        this.fetchUserSensitive().then(() => {
          this.senseSetVal = this.selectUserSensitive;
        });
        this.fetchUserArmIntvl({ ctrtId: ctrtId }).then(() => {
          this.userArmIntvl = this.selectUserArmIntvl;
        });
        this.fetchAbNormalDetect({ ctrtId: ctrtId });
        this.fetchAiPatternAnalysis({ ctrtId: ctrtId });
        this.fetchFraudDetection({ ctrtId: ctrtId, headerType: 'TOTAL' });
        //mec 추가부분
        this.fetchMecAccumCost({ billYm: this.billYm });
        this.fetchMecDataTraffic({ billYm: this.billYm });
        this.fetchMecNetwork({ billYm: this.billYm });
        this.fetchMecApp({ billYm: this.billYm });
        this.fetchMecStat({ billYm: this.billYm });
      }
    });
  },
  methods: {
    ...mapActions('dashboard', [
      'fetchExpect',
      'fetchCtrt',
      'fetchCtgry',
      'fetchCsp',
      'fetchPeriod',
      'fetchUsageCost',
      'fetchUsageFilter',
      'fetchServerUsage',
      'fetchResourceState',
      'fetchAbNormalDetect',
      'fetchAiPatternAnalysis',
      'fetchUserSensitive',
      'fetchUserArmIntvl',
      'updateUserSensitive',
      'updateUserArmIntvl',
      'addFilter',
      'removeFilter',
      'setFilter',
      'fetchLicenseUsage',
      'fetchDayAsetCnt',
      'fetchRuleCheck',
      'fetchAnyOpen',
      'fetchRuleViolate',
      'fetchMecAccumCost',
      'fetchMecDataTraffic',
      'fetchMecNetwork',
      'fetchMecApp',
      'fetchMecStat',
    ]),
    ...mapActions('analysis', ['fetchFraudDetection']),
    handleFilterContractChange(contract) {
      this.setFilter({ name: 'contract', payload: contract });
      //계약 목록 선택시 하위 api 호출
      this.fetchCtgry({ ctrtId: contract.ctrtId }).then(() => {
        this.setFilter({
          name: 'category',
          payload: this.availableCategories.find((e, i) => i === 0),
        });
      });
      this.fetchCsp({ ctrtId: contract.ctrtId, billYm: this.billYm }).then(() => {
        this.setFilter({
          name: 'providers',
          payload: this.availableProviders.map((e) => e.provider),
        });
      });
      this.fetchUsageCost({
        ctrtId: contract.ctrtId,
        billYm: this.billYm,
        usageType: 'CTRT',
      });
      this.fetchUsageFilter({ ctrtId: contract.ctrtId, billYm: this.billYm });
      this.fetchResourceState({
        ctrtId: contract.ctrtId,
        billYm: this.billYm,
        stdDt: this.stdDt,
      });
      this.fetchServerUsage({ ctrtId: contract.ctrtId, billYm: this.billYm });
      this.fetchAbNormalDetect({ ctrtId: contract.ctrtId }).then(() => {
        // 알람구간 호출
        this.fetchUserArmIntvl({ ctrtId: contract.ctrtId }).then(() => {
          this.userArmIntvl = this.selectUserArmIntvl;
        });
      });
      this.fetchFraudDetection({ ctrtId: contract.ctrtId, headerType: 'TOTAL' });
      this.fetchAiPatternAnalysis({
        ctrtId: contract.ctrtId,
      });

      // security 호출
      this.fetchLicenseUsage({ ctrtId: contract.ctrtId });
      this.fetchDayAsetCnt({
        ctrtId: contract.ctrtId,
        stdDt: this.nowStdDt,
      });
      this.fetchRuleCheck({ ctrtId: contract.ctrtId });
      this.fetchAnyOpen({ ctrtId: contract.ctrtId });
      this.fetchRuleViolate({ ctrtId: contract.ctrtId });
    },
    handleFilterCategoryChange(category) {
      this.setFilter({ name: 'category', payload: category });
      if (category.name === 'Security') {
        this.fetchLicenseUsage({ ctrtId: this.filter.contract.ctrtId });
        this.fetchDayAsetCnt({
          ctrtId: this.filter.contract.ctrtId,
          stdDt: this.nowStdDt,
        });
        this.fetchRuleCheck({ ctrtId: this.filter.contract.ctrtId });
        this.fetchAnyOpen({ ctrtId: this.filter.contract.ctrtId });
        this.fetchRuleViolate({ ctrtId: this.filter.contract.ctrtId });
      } else if (category.name === 'Cloud Network') {
        this.fetchUsageCost({
          ctrtId: this.filter.contract.ctrtId,
          billYm: this.billYm,
          usageType: 'CTRT',
          scrType: 'network',
        });
      } else if (category.name === 'Public Cloud') {
        this.fetchUsageCost({
          ctrtId: this.filter.contract.ctrtId,
          billYm: this.billYm,
          usageType: 'CTRT',
          scrType: 'public',
        });
      } else {
        this.fetchMecAccumCost({ billYm: this.billYm });
        this.fetchMecDataTraffic({ billYm: this.billYm });
        this.fetchMecNetwork({ billYm: this.billYm });
        this.fetchMecApp({ billYm: this.billYm });
        this.fetchMecStat({ billYm: this.billYm });
      }
    },
    handleFilterCspChange({ provider, checked }) {
      if (checked) {
        this.addFilter({ name: 'providers', payload: [provider] });
      } else {
        this.removeFilter({ name: 'providers', payload: [provider] });
      }

      this.fetchUsageCost({
        ctrtId: this.filter.contract.ctrtId,
        billYm: this.billYm,
        usageType: 'CTRT',
        scrType: 'public',
        providers: this.filter.providers,
      });
      this.fetchUsageFilter({
        ctrtId: this.filter.contract.ctrtId,
        billYm: this.billYm,
        providers: this.filter.providers,
      });
      this.fetchPeriod({
        ctrtId: this.filter.contract.ctrtId,
        billYm: this.billYm,
        providers: this.filter.providers,
      });
      this.fetchResourceState({
        ctrtId: this.filter.contract.ctrtId,
        billYm: this.billYm,
        stdDt: this.stdDt,
        providers: this.filter.providers,
      });
      this.fetchServerUsage({
        ctrtId: this.filter.contract.ctrtId,
        billYm: this.billYm,
        providers: this.filter.providers,
      });
      // if (this.availableProviders.includes(provider))
    },
    handleUserSensitive(userSensitive) {
      this.updateUserSensitive(userSensitive).then((res) => {
        if (res.data.data === 1) {
          this.fetchUserSensitive().then(() => {
            this.senseSetVal = this.selectUserSensitive;
          });
          this.fetchAbNormalDetect({
            ctrtId: this.filter.contract.ctrtId,
          });
        }
      });
    },
    handleUserArmIntvl(userArmIntvl) {
      this.updateUserArmIntvl(userArmIntvl).then((res) => {
        if (res.data.data >= 1) {
          this.fetchUserArmIntvl(userArmIntvl).then(() => {
            this.userArmIntvl = this.selectUserArmIntvl;
          });
          this.fetchAbNormalDetect({
            ctrtId: this.filter.contract.ctrtId,
          });
        }
      });
    },
  },
};
</script>
<style>
.slide-up-enter-active {
  transition: all 1s ease;
}
.slide-up-leave-active {
  transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-up-enter,
.slide-up-leave-active {
  opacity: 0;
  transform: translateY(80%);
}
.slide-down-leave-active,
.slide-down-enter-active {
  transition: opacity 1.5s;
}
.slide-down-enter {
  opacity: 0;
}
</style>
