<template>
  <!-- sort -->
  <div class="sort-wrap mb-4" style="display: flex">
    <SelectCloudFilter
      ref="cloud"
      :csp-typ-cd-from-parent="filter.cspTypCd"
      @onCspTypCdInitialized="onCspTypCdInitialized"
      @onCspTypCdChanged="handleCloudChange"
    ></SelectCloudFilter>
    <div class="flex dashboard-card" style="flex-grow: 1">
      <!-- Contract & Account Selection -->
      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">
          {{ $t('resource.contractAnd') }} {{ cspTypCd === 'AZURE' ? 'subscription' : $t('resource.accounts') }}
        </div>
        <PerformanceAcntSelect
          ref="ctrtSel"
          :data="ctrtList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.id"
          child-key="acntList"
          :cust-corp-list="custCorpList"
          :filter-ctrt-id="ctrtId"
          :filter-acnt-id="acntId"
          select-class="flex items-center justify-between w-full text-gray-700"
          :arrow-src="arrowSrc"
          arrow-class="ml-4"
          @invokeOnSearch="initFilter"
          @change="handleAcntParamChange"
        />
      </div>

      <!-- Region Selection -->
      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('resource.region') }}</div>
        <PerformanceSelectCount
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
        <div class="text-sm text-primary-600">{{ $t('resource.serviceGroup') }}</div>
        <RsrcSvcGrpSelect
          ref="svcGrpSel"
          :data="svcCtrtList"
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

    <a href="#" class="btn" @click="onSearch">{{ $t('resource.apply') }}</a>
  </div>
  <!-- //sort -->
</template>

<script>
import PerformanceAcntSelect from '@/pages/Rsrc/Performance/PerformanceAcntSelect';
import PerformanceSelectCount from '@/pages/Rsrc/Performance/PerformanceSelectCount';
import RsrcSvcGrpSelect from '@/pages/Rsrc/Performance/RsrcSvcGrpSelect';
import arrowImage from '@/assets/images/arrow-typ-02.svg';
import { mapActions, mapGetters, mapState } from 'vuex';
import SelectCloudFilter from '@/components/Select/SelectCloudFilter.vue';

export default {
  components: {
    SelectCloudFilter,
    RsrcSvcGrpSelect,
    PerformanceSelectCount,
    PerformanceAcntSelect,
  },

  data() {
    return {
      ctrtList: [],
      regionList: [],
      svcGrpList: [],
      svcCtrtList: [],
      custCorpList: [],
      svcGrpCustCorpList: [],
      acntId: this.$route.params.acntId || null,
      ctrtId: this.$route.params.ctrtId || null,
      arrowSrc: arrowImage,
    };
  },
  computed: {
    ...mapState('performance', {
      filter: 'filter',
      selectedFilter: 'selectedFilter',
      selectedCustCorpIds: 'selectedCustCorpIds',
    }),
    ...mapGetters('performance', ['cspTypCd']),
  },
  methods: {
    ...mapActions('performance', [
      'fetchFilter',
      'fetchSearch',
      'fetchParam',
      'setFilter',
      'fetchSelectedFilter',
      'fetchSelectedCorpCustIds',
      'fetchSvcGrpSelectedCorpCustIds',
    ]),
    async onCspTypCdInitialized({ cspTypCd }) {
      this.fetchParam({ state: { cspTypCd: cspTypCd } });
      await this.loadFilterOptions({});
      await this.setFilterToPrevPage();
      await this.onSearch();
    },
    async handleCloudChange({ cspTypCd }) {
      this.fetchParam({ state: { cspTypCd: cspTypCd } });
      await this.loadFilterOptions({ isCallByButtonClick: true });
      await this.fetchAllSelectedFilter();
      this.$emit('onCloudChanged');
    },

    async loadFilterOptions({ isCallByButtonClick = false }) {
      this.$refs.ctrtSel.isChangePage(true);
      this.$refs.svcGrpSel.isChangePage(true);
      const result = await this.fetchFilter({ cspTypCd: this.cspTypCd })
        .then((result) => {
          Object.assign(this, result);
          this.custCorpList = this.ctrtList.map((item) => {
            const nonNullCustCorpId = this.ctrtList.find(
              (ctrtItem) => ctrtItem.corpRegNo === item.corpRegNo && ctrtItem.custCorpId !== null
            );
            const custCorpId = nonNullCustCorpId ? nonNullCustCorpId.custCorpId : item.custCorpId;

            return {
              id: custCorpId,
              corpRegNo: item.corpRegNo,
              nm: item.custCorpNm,
            };
          });
          if (isCallByButtonClick) {
            this.fetchSelectedCorpCustIds({ state: [this.custCorpList[0]] });
          }
          this.svcGrpCustCorpList = this.svcCtrtList.map((item) => {
            const nonNullCustCorpId = this.ctrtList.find(
              (ctrtItem) => ctrtItem.corpRegNo === item.corpRegNo && ctrtItem.custCorpId !== null
            );
            const custCorpId = nonNullCustCorpId ? nonNullCustCorpId.custCorpId : item.custCorpId;

            return {
              id: custCorpId,
              corpRegNo: item.corpRegNo,
              nm: item.custCorpNm,
            };
          });
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
      const cspTypCd = this.$refs.cloud.cspTypCd;
      const selectedRegionIds = this.$refs.regionSel.checkedItems;
      const selectedSvcGrpIds = this.$refs.svcGrpSel.checkedItems;
      const selectedCtrtList = this.$refs.ctrtSel.checkedItems;
      const selectedCorp = this.$refs.ctrtSel.selectedCustCorpIds;
      const selectedSvcCorp = this.$refs.svcGrpSel.svcGrpSelectedCustCorpIds;

      const params = {
        cspTypCd: cspTypCd,
        regionList: selectedRegionIds,
        svcGrpList: selectedSvcGrpIds,
        ctrtList: selectedCtrtList,
      };

      await this.fetchSelectedFilter({ state: params });
      await this.fetchSelectedCorpCustIds({ state: selectedCorp });
      await this.fetchSvcGrpSelectedCorpCustIds({ state: selectedSvcCorp });
    },
    updateFetchParam(params) {
      for (let key in params) {
        if (Array.isArray(params[key])) {
          params[key] = this.getFullSelectionFromList(params[key]);
        }
      }
      this.fetchParam({ state: params });
    },

    onSearch() {
      this.$emit('onFilterChanged');
    },

    remoteAllCheck() {
      const ctrtSelRef = this.$refs.ctrtSel;
      const regionSelRef = this.$refs.regionSel;
      const svcGrpSelRef = this.$refs.svcGrpSel;

      ctrtSelRef.reset();
      svcGrpSelRef.reset();
      if (!this.ctrtId) {
        ctrtSelRef.handleCheckAllClick();
      } else {
        ctrtSelRef.handleCheckCtrtClick(this.ctrtId);
        this.fetchAllSelectedFilter();
        this.ctrtId = null;
      }
      ctrtSelRef.applyNotChangeListner();

      regionSelRef.reset();
      regionSelRef.handleCheckAllClick();
      regionSelRef.applyNotChangeListner();
    },

    getFullSelectionFromList(list) {
      return list.map((item) => item.id); // id를 기반으로 전체 선택된 상태의 값을 추출
    },
    setFilterToPrevPage() {
      if (this.selectedFilter && this.selectedFilter !== undefined && Object.keys(this.selectedFilter).length !== 0) {
        this.$refs.cloud.cspTypCd = this.selectedFilter.cspTypCd;
        this.$refs.ctrtSel.checkedItems = this.selectedFilter.ctrtList;
        this.$refs.regionSel.checkedItems = this.selectedFilter.regionList;
        this.$refs.svcGrpSel.checkedItems = this.selectedFilter.svcGrpList;
        this.$refs.ctrtSel.previousCheckedItems = this.selectedFilter.ctrtList;
        this.$refs.regionSel.previousCheckedItems = this.selectedFilter.regionList;
        this.$refs.svcGrpSel.previousCheckedItems = this.selectedFilter.svcGrpList;

        this.fetchParam({
          state: {
            cspTypCd: this.selectedFilter.cspTypCd,
          },
        });
        this.updateFetchParam({ regionList: this.selectedFilter.regionList });

        if (this.selectedFilter.ctrtList && this.selectedFilter.ctrtList.acntIdList !== undefined) {
          this.fetchParam({
            state: {
              acntIdList:
                this.selectedFilter.ctrtList.acntIdList.length > 0 ? this.selectedFilter.ctrtList.acntIdList : [],
            },
          });
          this.fetchParam({
            state: {
              svcGrpList: this.selectedFilter.svcGrpList.length > 0 ? this.this.selectedFilter.svcGrpList : [],
            },
          });

          this.fetchParam({ state: this.selectedFilter.ctrtList });
        } else {
          this.handleSvcAcntParamChange(this.selectedFilter.svcGrpList);
          this.handleAcntParamChange(this.selectedFilter.ctrtList);
        }
      }
    },
    async initFilter() {
      // 모든 리전 선택
      await this.updateFetchParam({ regionList: this.regionList });
      // this.onSearch();
    },
  },
};
</script>
