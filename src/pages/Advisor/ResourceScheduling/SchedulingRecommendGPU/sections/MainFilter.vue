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
          {{ $t('resource.contractAnd') }} {{ cspTypCd === 'AZURE' ? 'Subscription' : $t('resource.accounts') }}
        </div>
        <DropDownMenuAccount
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
        <DropDownMenuRegion
          ref="regionSel"
          :data="regionList"
          :text-getter="(item) => item.name"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button w-96"
          :arrow-src="arrowSrc"
          arrow-class="ml-4"
          @change="(selectedItems) => handleFilterChange('regionList', selectedItems)"
        />
      </div>

      <!-- Service Selection -->
      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('optimization.service') }}</div>
        <SelectCount
          ref="serviceSel"
          :data="serviceList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.cd"
          select-class="flex items-center justify-between w-full"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button mh-385"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="ml-4"
          :is-has-search="true"
          @change="(selectedItems) => handleFilterChange('service', selectedItems)"
        />
      </div>

      <!-- Tag Selection -->
      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('common.select.tag') }}</div>
        <SelectCount
          ref="tagSel"
          :data="tagsList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.cd"
          select-class="flex items-center justify-between w-full"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button mh-385"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="ml-4"
          :is-has-search="true"
          @change="(selectedItems) => handleFilterChange('tagList', selectedItems)"
        />
      </div>

      <!-- Recommend schedule Selection -->
      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('common.select.recommendSchedule') }}</div>
        <SelectCount
          ref="recommendScheduleSel"
          :data="recommendScheduleList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.cd"
          select-class="flex items-center justify-between w-full"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button mh-385"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="ml-4"
          :is-has-search="true"
          @change="(selectedItems) => handleFilterChange('recommendScheduleList', selectedItems)"
        />
      </div>
    </div>

    <a href="#" class="btn" @click="onSearch">{{ $t('resource.apply') }}</a>
  </div>
  <!-- //sort -->
</template>

<script>
import { DropDownMenuAccount, DropDownMenuRegion, DropDownServiceGroup } from '../../../filterSelects';
import arrowImage from '@/assets/images/arrow-typ-02.svg';
import { mapActions, mapGetters, mapState } from 'vuex';
import SelectCloudFilter from '@/components/Select/SelectCloudFilter.vue';
import { i18n } from '../../../../../../public/locales/i18n';
import moment from 'moment';
import resourceOptiService from '@/services/resourceOptiService';
import { SelectCount } from '@/components/Select';
import { servicesList } from '@/pages/Advisor/SpotInstance/SpotInstanceEnum';
import resourceScheduleService from '@/services/resourceScheduleService';
import axios from 'axios';

export default {
  components: {
    SelectCloudFilter,
    DropDownMenuAccount,
    DropDownMenuRegion,
    SelectCount,
  },

  data() {
    return {
      ctrtList: [],
      regionList: [],
      svcCtrtList: [],
      custCorpList: [],
      svcGrpCustCorpList: [],
      acntId: this.$route.params.acntId || null,
      ctrtId: this.$route.params.ctrtId || null,
      arrowSrc: arrowImage,
      serviceList: [],
      tagsList: [],
      recommendScheduleList: [],
    };
  },
  computed: {
    ...mapState('resourceScheduling', {
      filter: 'filter',
      selectedFilter: 'selectedFilter',
    }),
    ...mapGetters('resourceScheduling', ['cspTypCd']),
  },
  watch: {
    '$i18n.locale': 'exchgRateSearch',
  },
  created() {
    this.exchgRateSearch();
  },
  methods: {
    ...mapActions('resourceScheduling', [
      'fetchFilter',
      'fetchParam',
      'fetchSelectedFilter',
      'fetchSelectedCorpCustIds',
      'fetchSvcGrpSelectedCorpCustIds',
    ]),
    async onCspTypCdInitialized({ cspTypCd }) {
      this.fetchParam({ state: { cspTypCd: cspTypCd } });
      await this.loadFilterOptions({});
      await this.setFilterToPrevPage();
      // await this.initStoreFilter();
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
      await this.fetchFilter({ cspTypCd: this.cspTypCd })
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
          this.serviceList = servicesList;
          this.fetchParam({
            state: {
              service: servicesList.map((item) => item.cd),
            },
          });
        })
        .then(() => {
          this.remoteAllCheck();
        });
      // await this.fetchTagsData();
      await this.fetchRecommendScheduleList();
    },

    handleAcntParamChange(e) {
      const acntIdList = e.filter((ctrt) => !ctrt.acntList).map((acnt) => acnt.id);
      this.fetchParam({ state: { acntIdList: acntIdList } });
      this.fetchAllSelectedFilter();
      // this.fetchTagsData();
    },

    handleFilterChange(name, selectedItems) {
      this.updateFetchParam({ [name]: selectedItems });
      this.fetchAllSelectedFilter();
    },
    fetchAllSelectedFilter: async function () {
      const cspTypCd = this.$refs.cloud.cspTypCd;
      const selectedRegionIds = this.$refs.regionSel.checkedItems;
      const selectedCtrtList = this.$refs.ctrtSel.checkedItems;
      const selectedCorp = this.$refs.ctrtSel.selectedCustCorpIds;
      const selectedService = this.$refs.serviceSel.checkedItems;
      const selectedTagList = this.$refs.tagSel.checkedItems;
      const selectedRecommendScheduleList = this.$refs.recommendScheduleSel.checkedItems;

      const params = {
        cspTypCd: cspTypCd,
        regionList: selectedRegionIds,
        ctrtList: selectedCtrtList,
        service: selectedService,
        tagList: selectedTagList,
        recommendScheduleList: selectedRecommendScheduleList,
      };

      await this.fetchSelectedFilter({ state: params });
      await this.fetchSelectedCorpCustIds({ state: selectedCorp });
    },
    updateFetchParam(params) {
      for (let key in params) {
        if (Array.isArray(params[key])) {
          params[key] =
            key === 'regionList'
              ? this.getFullSelectionFromList(params[key])
              : this.getServiceSelectionFromList(params[key]);
        }
      }
      this.fetchParam({ state: params });
    },

    onSearch() {
      this.$emit('filterChanged');
    },

    remoteAllCheck() {
      const ctrtSelRef = this.$refs.ctrtSel;
      const regionSelRef = this.$refs.regionSel;
      const serviceSelRef = this.$refs.serviceSel;

      ctrtSelRef.reset();
      if (!this.ctrtId) {
        ctrtSelRef.handleCheckAllClick();
      } else {
        if (this.acntId) {
          ctrtSelRef.handleCheckAcntClick(this.ctrtId, this.acntId);
          this.fetchAllSelectedFilter();
          this.acntId = null;
        } else {
          ctrtSelRef.handleCheckCtrtClick(this.ctrtId);
          this.fetchAllSelectedFilter();
        }
        this.ctrtId = null;
      }
      ctrtSelRef.applyNotChangeListner();

      regionSelRef.reset();
      regionSelRef.handleCheckAllClick();
      regionSelRef.applyNotChangeListner();

      serviceSelRef.reset();
      serviceSelRef.handleCheckAllClick();
      serviceSelRef.applyNotChangeListner();
    },

    getFullSelectionFromList(list) {
      return list.map((item) => item.id); // id를 기반으로 전체 선택된 상태의 값을 추출
    },
    getServiceSelectionFromList(list) {
      return list.map((item) => item.cd);
    },
    setFilterToPrevPage() {
      if (this.selectedFilter && this.selectedFilter !== undefined && Object.keys(this.selectedFilter).length !== 0) {
        this.$refs.cloud.cspTypCd = this.selectedFilter.cspTypCd;
        this.$refs.ctrtSel.checkedItems = this.selectedFilter.ctrtList;
        this.$refs.regionSel.checkedItems = this.selectedFilter.regionList;
        this.$refs.serviceSel.checkedItems = this.selectedFilter.service;

        this.$refs.ctrtSel.previousCheckedItems = this.selectedFilter.ctrtList;
        this.$refs.regionSel.previousCheckedItems = this.selectedFilter.regionList;
        this.$refs.serviceSel.previousCheckedItems = this.selectedFilter.service;

        this.fetchParam({
          state: {
            cspTypCd: this.selectedFilter.cspTypCd,
          },
        });
        this.updateFetchParam({ regionList: this.selectedFilter.regionList });
        this.fetchParam({
          state: {
            service: this.selectedFilter.service.map((item) => item.cd),
          },
        });

        if (this.selectedFilter.ctrtList && this.selectedFilter.ctrtList.acntIdList !== undefined) {
          this.fetchParam({
            state: {
              acntIdList:
                this.selectedFilter.ctrtList.acntIdList.length > 0 ? this.selectedFilter.ctrtList.acntIdList : [],
            },
          });

          this.fetchParam({ state: this.selectedFilter.ctrtList });
        } else {
          this.handleAcntParamChange(this.selectedFilter.ctrtList);
        }
      }
    },
    async initFilter() {
      // 모든 리전 선택
      await this.updateFetchParam({ regionList: this.regionList });
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
        textNode.nodeValue = 'Upbit 환율 ' + formattedDate;
      } else {
        textNode.nodeValue = moment().format('MMM.DD.YYYY') + ' (Upbit)';
      }
    },
    async fetchTagsData() {
      try {
        const response = await resourceScheduleService.fetchTagsByAccountId({
          accountIds: ['882241623684'],
        });
        this.tagsList = response.data.slice(0, 2).map((item) => ({
          cd: item.tagValue,
          nm: item.tagKey,
        }));
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching tags:', e);
        }
      }
    },
    async fetchRecommendScheduleList() {
      this.recommendScheduleList = [
        {
          cd: 'Weekday Day',
          nm: '평일 주간',
        },
        {
          cd: 'Weekday Night',
          nm: '평일 야간',
        },
        {
          cd: 'Weekend Day',
          nm: '주말 주간',
        },
        {
          cd: 'Weekend Night',
          nm: '주말 야간',
        },
        {
          cd: 'Everyday Day',
          nm: '매일 주간',
        },
        {
          cd: 'Everyday Night',
          nm: '매일 야간',
        },
      ];
    },
  },
};
</script>
