<template>
  <div class="sort-wrap" style="display: flex">
    <SelectCloud
      :current="cspTypCd"
      :aws-ctrts-count="getAwsCtrts.length"
      :azure-ctrts-count="getAzureCtrts.length"
      :gcp-ctrts-count="getGcpCtrts.length"
      style="width: 200px"
      @cspTypeChanged="handleCspTypeChange"
    ></SelectCloud>
    <div class="flex flex-grow-1 white-nowrap">
      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('optimization.period') }}</div>
        <SelectDatepicker
          :default-select="3"
          :text-visiblity="false"
          :date-ranges="dateRanges"
          @change="handleFilterDateRangeChange"
        />
      </div>

      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">
          {{ $t('optimization.contractAnd') }} {{ cspTypCd === 'AZURE' ? 'subscription' : $t('optimization.accounts') }}
        </div>
        <SelectCountDepth
          ref="ctrtSel"
          :data="ctrtList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.id"
          :filter-ctrt-id="contractId"
          select-class="flex items-center justify-between w-full"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="ml-4"
          @change="handleCtrtAcntChange"
        />
      </div>

      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('common.select.service') }}</div>
        <SelectCount
          ref="prodSel"
          :data="prodList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.cd"
          select-class="flex items-center justify-between w-full"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button mh-385"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="ml-4"
          @change="handleServiceChange"
        />
      </div>
    </div>
    <button
      class="btn"
      :disabled="isFilterLoading"
      :style="
        isFilterLoading
          ? {
              'background-color': '#e3ebf1 !important',
              'border-color': '#e3ebf1 !important',
            }
          : {}
      "
      @click="onSearch"
    >
      {{ $t('common.button.apply') }}
    </button>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState, mapActions, mapGetters } from 'vuex';
import { SelectDatepicker, SelectCount, SelectCountDepth } from '@/components/Select';
import SelectCloud from '@/components/Select/SelectCloud.vue';
import commonMixin from '@/pages/Mixin/commonMixin';
import costOptiService from '@/services/costOptiService';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: { SelectCloud, SelectDatepicker, SelectCount, SelectCountDepth },
  mixins: [commonMixin],
  data() {
    return {
      cspTypCd: 'AWS',
      contractId: this.$route.params.contractId || null,
      cmmtTyp: { AWS: ['SP', 'RI'], AZURE: ['AzureRI'] },
      ctrtList: [],
      prodList: [],
      acntList: [],
      strDate: '',
      endDate: '',
      isSearch: true,
      dateRanges: {},
      isFilterLoading: false,
    };
  },
  computed: {
    ...mapState('costOpti', ['filter']),
    ...mapState('common', ['myCmmts']),
    ...mapGetters('common', ['getAwsCtrts', 'getAzureCtrts', 'getGcpCtrts', 'getMyFirstCSP']),
    curCmmtTypList() {
      return this.cmmtTyp[this.cspTypCd];
    },
  },
  watch: {
    '$i18n.locale': ['exchgRateSearch', 'setDateRanges'],
    cspTypCd: {
      immediate: true,
      handler(newVal) {
        this.fetchParam({ state: { cspTypCd: newVal } });
        this.fetchCmmtTyp({ cmmtTyp: this.curCmmtTypList });
      },
    },
  },
  created() {
    this.cspTypCd = this.$route.params.cspTypCd || this.getMyFirstCSP;
    this.fetchFreshDesk();
    this.exchgRateSearch();
    this.setDateRanges();
  },
  methods: {
    ...mapActions('notice', ['fetchFreshDesk']),
    ...mapActions('costOpti', ['fetchDashFilter', 'fetchSearch', 'fetchRemoteParam', 'fetchParam', 'fetchCmmtTyp']),
    initParam() {
      // this.fetchCmmtTyp({ cmmtTyp: this.curCmmtTypList });
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
    handleCspTypeChange(cspTypCd) {
      this.fetchParam({ state: { cspTypCd } });
      this.cspTypCd = cspTypCd;
      this.isSearch = true;
      this.filterOption();

      const sel = document.querySelectorAll('.exchRate');
      const vis = document.querySelector('.exchVisYn');
      if (cspTypCd === 'AZURE') {
        sel[0].style.display = 'none';
        sel[1].style.display = 'none';
        vis.classList.add('flex-1');
        vis.classList.add('text-right');
      } else {
        sel[0].style.display = '';
        sel[1].style.display = '';
        vis.classList.remove('text-right');
        vis.classList.remove('flex-1');
      }
    },
    relocateProdList(prodList) {
      return this.moveToFirst(prodList, (prod) => prod.nm === 'VM', true);
    },
    filterOption() {
      this.isFilterLoading = true;
      const param = { strDate: this.strDate, endDate: this.endDate, cmmtTypList: this.curCmmtTypList };
      // TODO: 다른 컴포넌트에서 사용하는지 확인 필요!
      // this.fetchParam({ state: { strDate: this.strDate, endDate: this.endDate } });
      this.fetchDashFilter(param)
        .then((result) => {
          this.ctrtList = result.ctrtList;
          this.prodList = this.relocateProdList(result.prodList);
        })
        .then(() => {
          if (!this.contractId) {
            this.initSearch();
          }
          this.remoteAllCheck();
        })
        .finally(() => (this.isFilterLoading = false));
    },
    handleFilterDateRangeChange(dateRange) {
      this.strDate = moment(dateRange.startDate).format('YYYYMMDD');
      this.endDate = moment(dateRange.endDate).format('YYYYMMDD');
      this.filterOption();
    },
    handleCtrtAcntChange(e) {
      const acntIdList = e.filter((ctrt) => !ctrt.acntList).map((acnt) => acnt.id);
      this.fetchParam({ state: { acntIdList: acntIdList } });
      this.initSearch();
    },
    handleServiceChange(e) {
      this.fetchParam({
        state: {
          prodCdList: e.map((prod) => prod.cd),
          prodList: e,
        },
      });
      this.initSearch();
    },
    onSearch() {
      this.isSearch = true;
      this.initSearch();
    },
    initSearch() {
      this.fetchSearch({ isSearch: { isSearch: this.isSearch } });
      this.fetchRemoteParam({
        state: {
          cspTypCd: this.filter.cspTypCd || 'AWS', // csp
          type: this.curCmmtTypList[0] || 'SP', // commitment
          acntIdList: this.filter.acntIdList,
          prodList: this.filter.prodList,
          endDate: this.filter.endDate,
          strDate: this.filter.strDate,
          useYn: true,
        },
      });
      this.isSearch = false;
    },
    remoteAllCheck() {
      this.$refs.ctrtSel.reset();
      this.$refs.prodSel.reset();
      if (this.contractId) {
        this.$refs.ctrtSel.handleCheckCtrtClick();
      } else {
        this.$refs.ctrtSel.handleCheckAllClick();
      }
      this.$refs.prodSel.handleCheckAllClick();
      this.$refs.ctrtSel.applyNotChangeListner();
      this.$refs.prodSel.applyNotChangeListner();
    },
    async exchgRateSearch() {
      const result = await costOptiService.fetchExchRate(null, null, null);
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

<style>
.mh-385 {
  max-height: 385px !important;
}
.flex-grow-1 {
  flex-grow: 1;
}
.white-nowrap {
  white-space: nowrap;
}
</style>
