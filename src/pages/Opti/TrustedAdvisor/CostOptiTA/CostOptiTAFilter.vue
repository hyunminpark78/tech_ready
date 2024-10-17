<template>
  <!-- sort -->
  <div class="sort-wrap mb-4">
    <div class="flex dashboard-card">
      <!-- Contract & Account Selection -->
      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">
          {{ $t('optimization.contractAnd') }} {{ $t('optimization.accounts') }}
        </div>
        <TrustedAdvisorAcntSelect
          ref="ctrtSel"
          :data="ctrtList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.id"
          child-key="acntList"
          :cust-corp-list="custCorpList"
          select-class="flex items-center justify-between w-full text-gray-700"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button w-96"
          :arrow-src="arrowSrc"
          arrow-class="ml-4"
          @invokeOnSearch="initFilter"
          @change="handleAcntParamChange"
        >
        </TrustedAdvisorAcntSelect>
      </div>

      <!-- Region Selection -->
      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('optimization.region') }}</div>
        <TrustedAdvisorSelectCount
          ref="regionSel"
          :data="regionList"
          :text-getter="(item) => item.name"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button w-96"
          :arrow-src="arrowSrc"
          arrow-class="ml-4"
          @change="(selectedItems) => handleFilterChange('regionList', selectedItems)"
        />
      </div>

      <!-- Service Group Selection -->
      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('optimization.serviceGroup') }}</div>
        <TrustedAdvisorSvcGrpSelect
          ref="svcGrpSel"
          :data="svcGrpList"
          child-key="svcCtgryList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.id"
          :cust-corp-list="svcGrpCustCorpList"
          select-class="flex items-center justify-between w-full text-gray-700"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button w-96"
          :arrow-src="arrowSrc"
          arrow-class="ml-4"
          @invokeOnSearch="initFilter"
          @change="handleSvcAcntParamChange"
        />
      </div>
    </div>

    <a href="javascript:void(0);" class="btn" @click="onSearch">{{ $t('common.button.apply') }}</a>
  </div>
  <!-- //sort -->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import TrustedAdvisorAcntSelect from '@/pages/Opti/TrustedAdvisor/TrustedAdvisorAcntSelect.vue';
import TrustedAdvisorSelectCount from '@/pages/Opti/TrustedAdvisor/TrustedAdvisorSelectCount.vue';
import arrowImage from '@/assets/images/arrow-typ-02.svg';
import TrustedAdvisorSvcGrpSelect from '@/pages/Opti/TrustedAdvisor/TrustedAdvisorSvcGrpSelect.vue';
import trustedAdvisorService from '@/services/trustedAdvisorService';
import { i18n } from '../../../../../public/locales/i18n';
export default {
  components: {
    TrustedAdvisorAcntSelect,
    TrustedAdvisorSelectCount,
    TrustedAdvisorSvcGrpSelect,
  },
  data() {
    return {
      ctrtList: [],
      regionList: [],
      svcGrpList: [],
      tempSvcGrpList: [],
      custCorpList: [],
      svcGrpCustCorpList: [],
      arrowSrc: arrowImage,
      isSearch: true,
    };
  },
  computed: {
    ...mapState('trustedAdvisor', {
      filter: 'filter',
      selectedFilter: 'selectedFilter',
      storeCategory: 'category',
      selectedCustCorpIds: 'selectedCustCorpIds',
    }),
  },
  watch: {
    '$i18n.locale': 'exchgRateSearch',
  },
  async mounted() {
    await this.loadFilterOptions();
    // 모든 리전 선택
    await this.updateFetchParam({ regionList: this.regionList });
    await this.setFilterToPrevPage();
    this.onSearch();
  },
  async created() {
    this.exchgRateSearch();
  },
  methods: {
    ...mapActions('trustedAdvisor', [
      'fetchFilter',
      'fetchSearch',
      'fetchParam',
      'fetchSelectedFilter',
      'fetchSelectedCorpCustIds',
      'fetchSvcGrpSelectedCorpCustIds',
    ]),
    onSearch() {
      this.isSearch = true;
      this.initSearch();
    },
    initSearch() {
      this.fetchSearch({ isSearch: { isSearch: this.isSearch } });
      this.isSearch = false;
    },
    async loadFilterOptions() {
      this.$refs.ctrtSel.isChangePage(true);
      this.$refs.svcGrpSel.isChangePage(true);
      const result = await this.fetchFilter()
        .then((result) => {
          Object.assign(this, result);
          this.custCorpList = this.ctrtList.map((item, index) => ({
            id: item.custCorpId,
            corpRegNo: item.corpRegNo,
            nm: item.custCorpNm,
          }));
          this.svcGrpCustCorpList = this.svcGrpList.map((item, index) => ({
            id: item.custCorpId,
            corpRegNo: item.corpRegNo,
            nm: item.custCorpNm,
          }));
        })
        .then(() => {
          this.remoteAllCheck();
        });
    },
    handleAcntParamChange(e) {
      const acntIdList = e.filter((ctrt) => !ctrt.acntList).map((acnt) => acnt.id);
      this.fetchParam({ state: { acntIdList: acntIdList } });
      this.fetchAllSelectedFilter();
    },
    handleSvcAcntParamChange(e) {
      this.fetchParam({ state: { svcGrpList: e } });
      this.fetchAllSelectedFilter();
    },
    handleFilterChange(name, selectedItems) {
      this.updateFetchParam({ [name]: selectedItems });
      this.fetchAllSelectedFilter();
    },
    fetchAllSelectedFilter: async function () {
      const selectedRegionIds = this.$refs.regionSel.checkedItems;
      const selectedSvcGrpIds = this.$refs.svcGrpSel.checkedItems;
      const selectedCtrtList = this.$refs.ctrtSel.checkedItems;
      const selectedCorp = this.$refs.ctrtSel.selectedCustCorpIds;
      const selectedSvcCorp = this.$refs.svcGrpSel.svcGrpSelectedCustCorpIds;

      const params = {
        regionList: selectedRegionIds,
        svcGrpList: selectedSvcGrpIds,
        ctrtList: selectedCtrtList,
      };

      await this.fetchSelectedFilter({ state: params });
      await this.fetchSelectedCorpCustIds({ state: selectedCorp });
      await this.fetchSvcGrpSelectedCorpCustIds({ state: selectedSvcCorp });
    },
    remoteAllCheck() {
      const ctrtSelRef = this.$refs.ctrtSel;
      const rigionSelRef = this.$refs.regionSel;
      const svcGrpSelRef = this.$refs.svcGrpSel;

      ctrtSelRef.reset();
      ctrtSelRef.handleCheckAllClick();
      ctrtSelRef.applyNotChangeListner();

      svcGrpSelRef.reset();
      // svcGrpSelRef.handleCheckAllClick();

      rigionSelRef.reset();
      rigionSelRef.handleCheckAllClick();
      rigionSelRef.applyNotChangeListner();
    },
    updateFetchParam(params) {
      for (let key in params) {
        if (Array.isArray(params[key])) {
          params[key] = this.getFullSelectionFromList(params[key]);
        }
      }
      if (Object.keys(params)[0] === 'regionList') {
        this.fetchParam({ state: { regionAllCheckYn: this.$refs.regionSel.allItemChecked } });
      }
      this.fetchParam({ state: params });
    },
    getFullSelectionFromList(list) {
      return list.map((item) => item.id); // id를 기반으로 전체 선택된 상태의 값을 추출
    },
    async initFilter() {
      // 모든 리전 선택
      await this.updateFetchParam({ regionList: this.regionList });
    },
    setFilterToPrevPage() {
      if (this.selectedFilter && this.selectedFilter !== undefined && Object.keys(this.selectedFilter).length !== 0) {
        this.$refs.ctrtSel.checkedItems = this.selectedFilter.ctrtList;
        this.$refs.regionSel.checkedItems = this.selectedFilter.regionList;
        this.$refs.svcGrpSel.checkedItems = this.selectedFilter.svcGrpList;
        this.$refs.ctrtSel.previousCheckedItems = this.selectedFilter.ctrtList;
        this.$refs.regionSel.previousCheckedItems = this.selectedFilter.regionList;
        this.$refs.svcGrpSel.previousCheckedItems = this.selectedFilter.svcGrpList;

        if (this.selectedFilter.ctrtList && this.selectedFilter.ctrtList.acntIdList !== undefined) {
          this.fetchParam({
            state: {
              svcGrpList: this.selectedFilter.svcGrpList.length > 0 ? this.selectedFilter.svcGrpList : [],
              acntIdList:
                this.selectedFilter.ctrtList.acntIdList.length > 0 ? this.selectedFilter.ctrtList.acntIdList : [],
            },
          });
          this.fetchParam({ state: this.selectedFilter.ctrtList });
        } else {
          this.handleSvcAcntParamChange(this.selectedFilter.svcGrpList);
          this.handleAcntParamChange(this.selectedFilter.ctrtList);
        }
      }
    },
    custCorpChanged() {
      this.$refs.svcGrpSel.custCorpChanged(this.selectedCustCorpIds[0]);
    },
    async exchgRateSearch() {
      const result = await trustedAdvisorService.fetchExchRate(this.exchgRateSrcCd, this.curcyNm, this.exchgRateStdDt);
      const exchgRateStdDt = result.data.data.exchgRateStdDt;
      const krwExchgRate = result.data.data.krwExchgRate;
      const year = exchgRateStdDt.slice(0, 4);
      const month = exchgRateStdDt.slice(4, 6);
      const day = exchgRateStdDt.slice(6, 8);
      const formattedDate = year + '년 ' + month + '월 ' + day + '일';
      const viewKrwExchgRate = document.querySelectorAll('.exchRate');
      const viewExchgRateStdDt = document.querySelector('.excRateTip');
      const textNode = viewExchgRateStdDt.firstChild;
      viewKrwExchgRate[0].textContent = `${this.$t('optimization.appliedExchangeRate')}: ￦` + krwExchgRate;
      if (i18n.locale === 'ko') {
        textNode.nodeValue = 'Upbit 환율 ' + formattedDate;
      } else {
        textNode.nodeValue = moment().format('MMM.DD.YYYY') + ' (Upbit)';
      }
    },
  },
};
</script>
<style>
.fixedSearch {
  bottom: 0;
  position: sticky;
}
</style>
