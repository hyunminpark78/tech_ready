<template>
  <!-- sort -->
  <div class="sort-wrap" style="display: flex">
    <SelectCloudFilter
      ref="cloud"
      :csp-typ-cd-from-parent="defaultCspTypCd"
      @onCspTypCdInitialized="onCspTypCdInitialized"
      @onCspTypCdChanged="handleCloudChange"
    ></SelectCloudFilter>
    <div class="flex dashboard-card" style="flex-grow: 1">
      <!-- Duration Selection -->
      <div class="relative field-section select-three" style="width: 20%">
        <div class="text-sm text-primary-600">
          {{ $t('resource.period') }}
        </div>
        <DurationSelect @handleSelectRangeDate="handleSelectRangeDate"></DurationSelect>
      </div>

      <!-- Contract & Account Selection -->
      <div class="relative field-section select-three" style="width: 25%">
        <div class="text-sm text-primary-600 contract-title">
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
      <div class="relative field-section select-three" style="width: 20%">
        <div class="text-sm text-primary-600">{{ $t('resource.region') }}</div>
        <DropDownMenuRegion
          ref="regionSel"
          :data="regionSepList"
          :key-getter="(item) => item.regionSepCd"
          :text-getter="(item) => item.regionSepNm"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button w-96"
          :arrow-src="arrowSrc"
          arrow-class="ml-4"
          @change="(selectedItems) => handleFilterChange('regionSepList', selectedItems)"
        />
      </div>

      <!-- Service Selection -->
      <div class="relative field-section select-three" style="width: 15%">
        <div class="text-sm text-primary-600">{{ $t('optimization.service') }}</div>
        <SelectCount
          ref="serviceSel"
          :data="cspPrdtList"
          :key-getter="(item) => item.cspPrdtCd"
          :text-getter="(item) => item.cspPrdtNm"
          select-class="flex items-center justify-between w-full"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button mh-385"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="ml-4"
          :is-has-search="true"
          @change="(selectedItems) => handleFilterChange('cspPrdtList', selectedItems)"
        />
      </div>

      <!-- Tag Selection -->
      <div class="relative field-section select-three" style="width: 20%">
        <div class="text-sm text-primary-600">{{ $t('common.select.tag') }}</div>
        <DropdownMenuTagUnit
          ref="tagsSel"
          :data="tagsData"
          :key-getter="(item) => item.id"
          :text-getter="(item) => item.nm"
          childkey="tagValList"
          :cust-corp-list="tagsData"
          select-class="flex items-center justify-between w-full text-gray-700"
          :arrow-src="arrowSrc"
          arrow-class="ml-4"
          @change="handleChangeTags"
        />
      </div>
    </div>

    <a href="#" class="btn" @click="onSearch">{{ $t('common.button.apply') }}</a>
  </div>
  <!-- //sort -->
</template>

<script>
import { DropDownMenuAccount, DropDownMenuRegion, DurationSelect, DropdownMenuTagUnit } from '../../../filterSelects';
import arrowImage from '@/assets/images/arrow-typ-02.svg';
import { mapActions, mapGetters, mapState } from 'vuex';
import { SelectCount } from '@/components/Select';
import SelectCloudFilter from '@/components/Select/SelectCloudFilter.vue';
import { i18n } from '../../../../../../public/locales/i18n';
import moment from 'moment';
import resourceOptiService from '@/services/resourceOptiService';
import spotUsageService from '@/services/spotUsageService';
import axios from 'axios';
import _ from 'lodash';

export default {
  components: {
    SelectCloudFilter,
    DropDownMenuAccount,
    DropDownMenuRegion,
    DurationSelect,
    SelectCount,
    DropdownMenuTagUnit,
  },

  data() {
    return {
      ctrtList: [],
      cspPrdtList: [],
      regionSepList: [],
      tagList: [],
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
    ...mapState('spotAdvisor', {
      filter: 'filter',
      selectedFilter: 'selectedFilter',
      selectedCustCorpIds: 'selectedCustCorpIds',
      defaultCspTypCd: 'defaultCspTypCd',
    }),
    ...mapGetters('spotAdvisor', ['cspTypCd']),
    tagsData() {
      return this.tagList.map((item) => ({
        id: item.tagKey,
        nm: item.tagKey,
        tagValList: item.tagValList.map((child, idx) => ({
          id: `tagValue${item.tagKey}${idx}`,
          nm: child,
          lowerNm: child,
          tagKey: item.tagKey,
        })),
      }));
      // const tagKeyList = [...new Set(tagData.map((item) => item.tagKey))];
      // return tagKeyList.map((item) => ({
      //   id: item,
      //   nm: item,
      //   childKey: tagData
      //     .filter((x) => x.tagKey === item)
      //     .map((child, idx) => ({
      //       id: `tagValue${item}${idx}`,
      //       nm: child.tagValue,
      //       lowerNm: child.tagValue,
      //       ctrtId: item,
      //     })),
      // }));
    },
  },
  watch: {
    '$i18n.locale': 'exchgRateSearch',
  },
  created() {
    this.exchgRateSearch();
  },
  methods: {
    ...mapActions('spotAdvisor', [
      'fetchFilter',
      'fetchParam',
      'fetchSelectedFilter',
      'fetchSelectedCorpCustIds',
      'fetchKrwExchgRate',
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
      await this.fetchFilter({
        cspTypCd: this.cspTypCd,
        strDate: this.filter.spotUsageRange.startDate,
        endDate: this.filter.spotUsageRange.endDate,
      })
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
      // this.fetchTagsData();
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
      const cspPrdtList = this.$refs.serviceSel.checkedItems;
      const regionSepList = this.$refs.regionSel.checkedItems;
      const tagList = this.$refs.tagsSel.checkedItems;
      const selectedCtrtList = this.$refs.ctrtSel.checkedItems;
      const selectedCorp = this.$refs.ctrtSel.selectedCustCorpIds;

      const params = {
        cspTypCd: cspTypCd,
        cspPrdtList: cspPrdtList,
        regionSepList: regionSepList,
        tagList: tagList,
        ctrtList: selectedCtrtList,
      };
      await this.fetchSelectedFilter({ state: params });
      await this.fetchSelectedCorpCustIds({ state: selectedCorp });
    },
    updateFetchParam(params) {
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
      this.fetchParam({ state: { cspPrdtList: [] } });
      this.fetchParam({ state: { tagList: [] } });
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
        this.$refs.regionSel.checkedItems = this.selectedFilter.regionSepList;
        this.$refs.serviceSel.checkedItems = this.selectedFilter.cspPrdtList;
        this.$refs.ctrtSel.previousCheckedItems = this.selectedFilter.ctrtList;
        this.$refs.regionSel.previousCheckedItems = this.selectedFilter.regionSepList;
        this.$refs.serviceSel.previousCheckedItems = this.selectedFilter.cspPrdtList;

        this.fetchParam({
          state: {
            cspTypCd: this.selectedFilter.cspTypCd,
          },
        });
        this.updateFetchParam({ regionSepList: this.selectedFilter.regionSepList });
        this.fetchParam({
          state: {
            cspPrdtList: this.selectedFilter.cspPrdtList,
          },
        });

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
        this.fetchParam({ state: { tagList: [] } });
      }
    },
    async initFilter() {
      // 모든 리전 선택
      await this.updateFetchParam({ cspPrdtList: this.cspPrdtList });
      await this.updateFetchParam({ regionSepList: this.regionSepList });
      await this.updateFetchParam({ tagList: [] });
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
      this.fetchKrwExchgRate(krwExchgRate);
    },
    handleSelectRangeDate(data) {
      this.fetchParam({
        state: {
          spotUsageRange: {
            startDate: data.strDate,
            endDate: data.endDate,
          },
        },
      });
    },
    handleChangeTags(selectedItems) {
      const formatSelectedItem = selectedItems
        .filter((item) => {
          return !Object.prototype.hasOwnProperty.call(item, 'tagValList');
        })
        .reduce((tagObject, item) => {
          tagObject.tagKey = item.tagKey;
          tagObject.tagValList.push(item.nm);
          return tagObject;
        }, _.cloneDeep(this.filter.defaultTag));
      this.fetchParam({
        state: {
          tagList: [formatSelectedItem],
        },
      });
    },
    async fetchTagsData() {
      try {
        const response = await spotUsageService.fetchTagsByAccountId({
          accountIds: this.filter.acntIdList,
        });
        this.tagList = response.data.slice(0, 30);
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching tags:', e);
        }
      }
    },
  },
};
</script>

<style scoped>
.contract-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.field-section {
  padding: 4px 7px;
}

@media (min-width: 1440px) {
  .field-section {
    padding: 16px 28px;
  }
}
</style>
