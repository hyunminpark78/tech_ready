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
      <div class="relative py-4 px-7 select-three" style="width: 37%">
        <div class="text-sm text-primary-600">{{ $t('resource.period') }}</div>
        <button class="flex items-center justify-between text-gray-700" style="min-width: 90px; max-width: 110px">
          <Select
            :data="periodTypeList"
            :value="periodType"
            :text-getter="(item) => item.name"
            :key-getter="(item) => item.name"
            select-class="flex items-center justify-between w-full font-bold text-gray-700"
            :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
            arrow-class="ml-4"
            option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200 w-44"
            option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
            :default-selected="0"
            @change="selectPeriod"
          />
        </button>
        <button
          class="flex items-center justify-between w-full text-gray-700"
          style="min-width: 230px; max-width: 230px"
        >
          <SelectDatepicker
            :default-select="3"
            :text-visiblity="false"
            :date-ranges="dateRanges"
            @change="handleFilterDateRangeChange"
          />
        </button>
      </div>

      <div class="relative py-4 px-7 select-three" style="width: 30%">
        <div class="text-sm text-primary-600">
          {{ $t('resource.contractAnd') }} {{ cspTypCd === 'AZURE' ? 'subscription' : $t('resource.accounts') }}
        </div>
        <PerformanceAcntSelect
          ref="ctrtSel"
          :data="ctrtList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.id"
          :filter-ctrt-id="ctrtId"
          :filter-acnt-id="acntId"
          child-key="acntList"
          :cust-corp-list="custCorpList"
          select-class="flex items-center justify-between w-full text-gray-700"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button w-96"
          :arrow-src="arrowSrc"
          arrow-class="ml-4"
          @invokeOnSearch="initFilter"
          @change="handleAcntParamChange"
        />
      </div>

      <!-- Region Selection -->
      <div class="relative py-4 px-7 select-three" style="width: 20%">
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
      <div class="relative py-4 px-7 select-three" style="width: 30%">
        <div class="text-sm text-primary-600">{{ $t('resource.serviceGroup') }}</div>
        <RsrcSvcGrpSelect
          ref="svcGrpSel"
          :data="svcCtrtList"
          child-key="svcCtgryList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.id"
          :cust-corp-list="svcGrpCustCorpList"
          select-class="flex items-center justify-between w-full text-gray-700"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button w-96 left-auto"
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
import moment from 'moment';
import { mapActions, mapGetters, mapState } from 'vuex';
import Select, { SelectDatepicker } from '@/components/Select';
import arrowImage from '@/assets/images/arrow-typ-02.svg';
import PerformanceAcntSelect from '@/pages/Rsrc/Performance/PerformanceAcntSelect.vue';
import PerformanceSelectCount from '@/pages/Rsrc/Performance/PerformanceSelectCount.vue';
import RsrcSvcGrpSelect from '@/pages/Rsrc/Performance/RsrcSvcGrpSelect';
import SelectCloudFilter from '@/components/Select/SelectCloudFilter.vue';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: {
    SelectCloudFilter,
    RsrcSvcGrpSelect,
    Select,
    PerformanceSelectCount,
    PerformanceAcntSelect,
    SelectDatepicker,
  },
  data() {
    return {
      ctrtList: [],
      regionList: [],
      svcGrpList: [],
      svcCtrtList: [],
      custCorpList: [],
      svcGrpCustCorpList: [],
      dateRanges: {},
      // periodTypeList: [
      //   { name: '일별', value: 'DALY' },
      //   { name: '월별', value: 'MNTH' },
      // ],
      periodTypeList: {},
      periodType: 'DALY',
      arrowSrc: arrowImage,
      dateRangesList: {
        DALY: {
          이번달: [moment().startOf('month').toDate(), moment().toDate()],
          지난달: [
            moment().subtract(1, 'month').startOf('month').toDate(),
            moment().subtract(1, 'month').endOf('month').toDate(),
          ],
          '최근 14일': [moment().subtract(14, 'days').toDate(), moment().toDate()],
          '최근 1개월': [moment().subtract(1, 'month').toDate(), moment().toDate()],
        },
        MNTH: {
          이번달: [moment().startOf('month').toDate(), moment().toDate()],
          '최근 3개월': [moment().subtract(3, 'month').startOf('month').toDate(), moment().toDate()],
          '최근 6개월': [moment().subtract(6, 'month').toDate(), moment().toDate()],
          '최근 1년': [moment().subtract(1, 'year').toDate(), moment().toDate()],
        },
      },
      dateRangesListParam: {
        DALY: {
          startDate: moment().subtract(1, 'month').toDate(),
          endDate: moment().toDate(),
        },
        MNTH: {
          startDate: moment().subtract(1, 'year').toDate(),
          endDate: moment().toDate(),
        },
      },
      acntId: this.$route.params.acntId || null,
      ctrtId: this.$route.params.ctrtId || null,
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
  watch: {
    '$i18n.locale': ['setDateRanges', 'setDateRangesList', 'setPeriodTypeList'],
  },
  created() {
    // this.setFilter();
    this.setPeriodTypeList();
    this.setDateRanges();
    this.setDateRangesList();
  },
  methods: {
    ...mapActions('performance', [
      'fetchFilter',
      'fetchSearch',
      'fetchParam',
      'setFilter',
      'fetchSelectedFilter',
      'fetchDateType',
      'fetchDateRange',
      'fetchSelectedCorpCustIds',
      'fetchSvcGrpSelectedCorpCustIds',
    ]),
    setPeriodTypeList() {
      if (i18n.locale === 'ko') {
        this.periodTypeList = [
          { name: '일별', value: 'DALY' },
          { name: '월별', value: 'MNTH' },
        ];
      } else {
        this.periodTypeList = [
          { name: 'Daily', value: 'DALY' },
          { name: 'Monthly', value: 'MNTH' },
        ];
      }
    },
    setDateRanges() {
      if (i18n.locale === 'ko') {
        this.dateRanges = {
          이번달: [moment().startOf('month').toDate(), moment().toDate()],
          지난달: [
            moment().subtract(1, 'month').startOf('month').toDate(),
            moment().subtract(1, 'month').endOf('month').toDate(),
          ],
          '최근 14일': [moment().subtract(14, 'days').toDate(), moment().toDate()],
          '최근 1개월': [moment().subtract(1, 'month').toDate(), moment().toDate()],
        };
      } else {
        this.dateRanges = {
          'This month': [moment().startOf('month').toDate(), moment().toDate()],
          'Last month': [
            moment().subtract(1, 'month').startOf('month').toDate(),
            moment().subtract(1, 'month').endOf('month').toDate(),
          ],
          'Recent 14 days': [moment().subtract(14, 'days').toDate(), moment().toDate()],
          'Recent 1 month': [moment().subtract(1, 'month').toDate(), moment().toDate()],
        };
      }
    },
    setDateRangesList() {
      if (i18n.locale === 'ko') {
        this.dateRangesList = {
          DALY: {
            이번달: [moment().startOf('month').toDate(), moment().toDate()],
            지난달: [
              moment().subtract(1, 'month').startOf('month').toDate(),
              moment().subtract(1, 'month').endOf('month').toDate(),
            ],
            '최근 14일': [moment().subtract(14, 'days').toDate(), moment().toDate()],
            '최근 1개월': [moment().subtract(1, 'month').toDate(), moment().toDate()],
          },
          MNTH: {
            이번달: [moment().startOf('month').toDate(), moment().toDate()],
            '최근 3개월': [moment().subtract(3, 'month').startOf('month').toDate(), moment().toDate()],
            '최근 6개월': [moment().subtract(6, 'month').toDate(), moment().toDate()],
            '최근 1년': [moment().subtract(1, 'year').toDate(), moment().toDate()],
          },
        };
      } else {
        this.dateRangesList = {
          DALY: {
            'This month': [moment().startOf('month').toDate(), moment().toDate()],
            'Last month': [
              moment().subtract(1, 'month').startOf('month').toDate(),
              moment().subtract(1, 'month').endOf('month').toDate(),
            ],
            'Recent 14 days': [moment().subtract(14, 'days').toDate(), moment().toDate()],
            'Recent 1 month': [moment().subtract(1, 'month').toDate(), moment().toDate()],
          },
          MNTH: {
            'This month': [moment().startOf('month').toDate(), moment().toDate()],
            'Recent 3 months': [moment().subtract(3, 'month').startOf('month').toDate(), moment().toDate()],
            'Recent 6 months': [moment().subtract(6, 'month').toDate(), moment().toDate()],
            'Recent 1 year': [moment().subtract(1, 'year').toDate(), moment().toDate()],
          },
        };
      }
    },
    async onCspTypCdInitialized({ cspTypCd }) {
      this.fetchParam({ state: { cspTypCd: cspTypCd } });
      await this.loadFilterOptions({});
      await this.selectPeriod(this.periodTypeList[0]);
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

    handleFilterDateRangeChange(dateRange) {
      this.strDate = moment(dateRange.startDate).format('YYYY-MM-DD');
      this.endDate = moment(dateRange.endDate).format('YYYY-MM-DD');
      // this.fetchParam({ state: { dateRange: { startDate: this.strDate, endDate: this.endDate } } });
      this.fetchDateRange({ state: { startDate: this.strDate, endDate: this.endDate } });
      // this.filterOption();
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
      if (this.selectedFilter && Object.keys(this.selectedFilter).length !== 0) {
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
    },
    selectPeriod(type) {
      this.periodType = type.value;
      this.dateRanges = this.dateRangesList[type.value];
      this.fetchDateType(type.value);
      this.handleFilterDateRangeChange(this.dateRangesListParam[type.value]);
    },
  },
};
</script>
