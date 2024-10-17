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
          {{ $t('optimization.contractAnd') }} {{ cspTypCd === 'AZURE' ? 'subscription' : $t('optimization.accounts') }}
        </div>
        <RsrcOptiAcntSelect
          ref="ctrtSel"
          :data="ctrtList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.id"
          child-key="acntList"
          :cust-corp-list="custCorpList"
          :filter-ctrt-id="contractId"
          select-class="flex items-center justify-between w-full text-gray-700"
          :arrow-src="arrowSrc"
          arrow-class="ml-4"
          @invokeOnSearch="initFilter"
          @change="handleAcntParamChange"
        />
      </div>

      <!-- Region Selection -->
      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('optimization.region') }}</div>
        <RsrcOptiSelectCount
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
        <RsrcOptiSvcGrpSelect
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

    <a href="#" class="btn" @click="onSearch">{{ $t('common.button.apply') }}</a>
  </div>
  <!-- //sort -->
</template>

<script>
import RsrcOptiAcntSelect from '@/pages/Opti/ResourceOpti/RsrcOptiAcntSelect';
import RsrcOptiSelectCount from '@/pages/Opti/ResourceOpti/RsrcOptiSelectCount';
import RsrcOptiSvcGrpSelect from '@/pages/Opti/ResourceOpti/RsrcOptiSvcGrpSelect';
import resourceOptiService from '@/services/resourceOptiService';
import arrowImage from '@/assets/images/arrow-typ-02.svg';
import { mapActions, mapGetters, mapState } from 'vuex';
import moment from 'moment';
import { numberCutDecimal } from '@/pages/Opti/ResourceOpti/ResourceOptiCommon';
import SelectCloudFilter from '@/components/Select/SelectCloudFilter.vue';
import _ from 'lodash';
import {i18n} from "../../../../../public/locales/i18n";

export default {
  components: {
    SelectCloudFilter,
    RsrcOptiSelectCount,
    RsrcOptiAcntSelect,
    RsrcOptiSvcGrpSelect,
  },

  data() {
    return {
      ctrtList: [],
      regionList: [],
      svcGrpList: [],
      svcCtrtList: [],
      custCorpList: [],
      svcGrpCustCorpList: [],
      arrowSrc: arrowImage,
      totalCost: 0,
      exchangeRate: 0,

      param: {
        vndr: '',
        cmpnId: '',
        accList: [],
        rgnList: [],
        ocpSvcGrps: [],
      },
      chartParam: {},

      unusedResourceDataMap: new Map(),
      rightsizingDataMap: new Map(),

      expctDisRate: 0,
      contractId: this.$route.params.contractId || null,
    };
  },
  computed: {
    ...mapState('resourceOpti', {
      filter: 'filter',
      storeCategory: 'category',
      companyId: 'selectedCustCorpIds',
      svcGrpSelectedCustCorpIds: 'svcGrpSelectedCustCorpIds',
      selectedFilter: 'selectedFilter',
      cspReference: 'cspReference',
    }),
    ...mapGetters('resourceOpti', ['cspTypCd']),
  },
  watch: {
    '$i18n.locale': 'exchgRateSearch',
  },
  created() {
    this.exchgRateSearch();
  },
  methods: {
    ...mapActions('resourceOpti', [
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
      await this.getExchangeRate();
      await this.onSearch();
    },
    async handleCloudChange({ cspTypCd }) {
      this.fetchParam({ state: { cspTypCd: cspTypCd } });
      await this.loadFilterOptions({ isCallByButtonClick: true });
      await this.fetchAllSelectedFilter();
      await this.getExchangeRate();
      await this.onSearch();
    },
    initializeParam() {
      this.param = {
        vndr: '',
        cmpnId: '',
        accList: [],
        rgnList: [],
        ocpSvcGrps: [],
      };

      this.chartParam = {
        ...this.param,
        type: 'total',
      };

      this.resetAllCnt();
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
          // this.initSearch();
          this.remoteAllCheck();
        });
    },

    handleSvcAcntParamChange(e) {
      this.fetchParam({ state: { svcGrpList: e } });
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

    handleAcntParamChange(e) {
      const acntIdList = e.filter((ctrt) => !ctrt.acntList).map((acnt) => acnt.id);
      this.fetchParam({ state: { acntIdList: acntIdList } });
      this.fetchAllSelectedFilter();
    },

    handleFilterChange(name, selectedItems) {
      this.updateFetchParam({ [name]: selectedItems });
      this.fetchAllSelectedFilter();
    },

    updateFetchParam(params) {
      for (let key in params) {
        if (Array.isArray(params[key])) {
          params[key] = this.getFullSelectionFromList(params[key]);
        }
      }
      this.fetchParam({ state: params });
    },

    onSearch: async function () {
      await this.fetchRsOptiSummary();
      await this.fetchRsOptiSummaryTable();
      await this.$emit(
        'onFilterChanged',
        this.exchangeRate,
        this.totalCost,
        this.unusedResourceDataMap,
        this.rightsizingDataMap,
        this.expctDisRate
      );
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
    fetchRsOptiSummary: async function () {
      this.initializeParam();
      if (this.companyId.length === 0 || this.companyId[0].id === null) {
        this.totalCost = 0;
        return;
      }
      this.param.vndr = this.cspReference[this.cspTypCd].vndr;
      this.param.cmpnId = this.companyId[0].id;
      this.param.accList = this.filter.acntIdList ? this.filter.acntIdList : [];
      this.param.rgnList = this.filter.regionList ? this.filter.regionList : [];
      this.param.ocpSvcGrps = [];

      if (this.filter.svcGrpList.length > 0) {
        this.filter.svcGrpList.forEach((item) => {
          this.param.ocpSvcGrps.push(item.id);
        });
      }

      try {
        const response = await resourceOptiService.fetchRsOptiSummary(this.param).then((result) => {
          this.totalCost = result.data.data.result.summaryTotalCost.totalCost;
        });
      } catch (e) {
        this.totalCost = 0;
        console.error('Error fetching chart data:', e);
      }
    },

    fetchRsOptiSummaryTable: async function () {
      this.initializeParam();
      if (this.companyId.length === 0 || this.companyId[0].id === null) {
        return;
      }

      this.chartParam.vndr = this.cspReference[this.cspTypCd].vndr;
      this.chartParam.cmpnId = this.companyId[0].id;
      this.chartParam.accList = this.filter.acntIdList ? this.filter.acntIdList : [];
      this.chartParam.rgnList = this.filter.regionList ? this.filter.regionList : [];
      this.chartParam.ocpSvcGrps = [];

      if (this.filter.svcGrpList.length > 0) {
        this.filter.svcGrpList.forEach((item) => {
          this.chartParam.ocpSvcGrps.push(item.id);
        });
      }

      try {
        const response = await resourceOptiService.fetchRsOptiSummaryTable(this.chartParam).then((result) => {
          if ('ok' === result.data.data.status) {
            const summaryTable = result.data.data.result.summaryTable;
            if (summaryTable && summaryTable.length !== 0) {
              summaryTable.forEach((item) => {
                if (item.rcmd === 'Unused' && this.unusedResourceDataMap.has(item.rsrcType)) {
                  this.unusedResourceDataMap.get(item.rsrcType).count += item.unusedCnt;
                  this.unusedResourceDataMap.get(item.rsrcType).cost += item.cost;
                } else if (item.rcmd === 'Idle' && this.unusedResourceDataMap.has(item.rsrcType)) {
                  this.unusedResourceDataMap.get(item.rsrcType).count += item.rightSizingCnt;
                  this.unusedResourceDataMap.get(item.rsrcType).cost += item.cost;
                } else if (item.rcmd !== 'Idle' && this.rightsizingDataMap.has(item.rsrcType)) {
                  this.rightsizingDataMap.get(item.rsrcType).count += item.rightSizingCnt;
                  this.rightsizingDataMap.get(item.rsrcType).cost += item.cost;
                }
              });
            } else if (summaryTable && summaryTable.length === 0) {
              this.resetAllCnt();
            }
          } else {
            this.resetAllCnt();
          }
        });
      } catch (e) {
        console.error('Error fetching chart data:', e);
      }
    },

    resetAllCnt() {
      this.unusedResourceDataMap.clear();
      this.cspReference[this.cspTypCd].categoryList
        .filter((category) => category.isInUnusedResource)
        .forEach((category) =>
          this.unusedResourceDataMap.set(category.rsrcType, {
            category: _.pick(category, ['code', 'name', 'rsrcType']),
            count: 0,
            cost: 0,
          })
        );

      this.rightsizingDataMap.clear();
      this.cspReference[this.cspTypCd].categoryList
        .filter((category) => category.isInRightSizing && category.code !== 's3')
        .forEach((category) =>
          this.rightsizingDataMap.set(category.rsrcType, {
            category: _.pick(category, ['code', 'name', 'rsrcType']),
            count: 0,
            cost: 0,
          })
        );
    },

    remoteAllCheck() {
      const ctrtSelRef = this.$refs.ctrtSel;
      const regionSelRef = this.$refs.regionSel;
      const svcGrpSelRef = this.$refs.svcGrpSel;

      ctrtSelRef.reset();
      svcGrpSelRef.reset();
      if (!this.contractId) {
        ctrtSelRef.handleCheckAllClick();
        // svcGrpSelRef.handleCheckAllClick();
      } else {
        ctrtSelRef.handleCheckCtrtClick(this.contractId);
        // svcGrpSelRef.handleCheckCtrtClick();
        this.fetchAllSelectedFilter();
        this.contractId = null;
      }
      ctrtSelRef.applyNotChangeListner();

      regionSelRef.reset();
      regionSelRef.handleCheckAllClick();
      regionSelRef.applyNotChangeListner();
    },

    getFullSelectionFromList(list) {
      return list.map((item) => item.id); // id를 기반으로 전체 선택된 상태의 값을 추출
    },

    getExchangeRate() {
      resourceOptiService.getExchangeRate().then((result) => {
        this.exchangeRate = result.data.data;
      });
    },

    async initFilter() {
      // 모든 리전 선택
      await this.updateFetchParam({ regionList: this.regionList });
      // 모든 서비스그룹 선택
      // await this.updateFetchParam({ svcGrpList: this.svcGrpList });
      await this.onSearch();
    },
    async exchgRateSearch() {
      const result = await resourceOptiService.fetchExchRate(this.exchgRateSrcCd, this.curcyNm, this.exchgRateStdDt);
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
        textNode.nodeValue = '한국수출입은행 환율 ' + formattedDate;
      } else {
        textNode.nodeValue = moment().format('MMM.DD.YYYY') + ' (KEXIM)';
      }
    },
  },
};
</script>
