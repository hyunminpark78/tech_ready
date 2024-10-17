<template>
  <div class="sort-wrap" style="display: flex">
    <div class="mr-3" style="width: 200px">
      <SelectCloud
        :current="filter.cspTypCd"
        :aws-ctrts-count="getAwsCtrts.length"
        :azure-ctrts-count="getAzureCtrts.length"
        :gcp-ctrts-count="getGcpCtrts.length"
        style="width: 200px"
        @cspTypeChanged="handleCspTypeChange"
      ></SelectCloud>
    </div>
    <div class="flex white-nowrap" style="flex-grow: 1">
      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('optimization.period') }}</div>
        <SelectDatepicker
          :default-select="3"
          :text-visiblity="false"
          :remote-start-date="remoteStrDate"
          :remote-end-date="remoteEndDate"
          :date-ranges="dateRanges"
          @change="handleFilterDateRangeChange"
        />
      </div>
      <div v-if="filter.cspTypCd === 'AWS'" class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('optimization.commitmentType') }}</div>
        <Select
          :data="cmmtTypOptions"
          :text-getter="(item) => item.name"
          :key-getter="(item) => item.name"
          select-class="flex items-center justify-between w-full text-primary-400"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="ml-4"
          option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
          option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
          :default-selected="0"
          @click="handleCmmtTypeChange"
        />
      </div>

      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('optimization.contractAnd') }} {{ getFilterTitle }}</div>
        <SelectCountDepth
          ref="ctrtSel"
          :data="ctrtList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.id"
          :filter-param-list="filterParamList"
          :child-key="'acntList'"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="ml-4"
          select-class="flex items-center justify-between w-full text-gray-700"
          @change="handleCtrtAcntChange"
        />
      </div>

      <div class="relative py-4 px-7 select-three">
        <div class="text-sm text-primary-600">{{ $t('optimization.service') }}</div>
        <SelectCount
          ref="prodSel"
          :data="prodList"
          :text-getter="(item) => item.nm"
          :key-getter="(item) => item.cd"
          :selected-prod-list="selectedProdList"
          select-class="flex items-center justify-between w-full text-gray-700"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="ml-4"
          @change="handleServiceChange"
        />
      </div>
      <!-- //col -->
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
  <!-- //sort -->
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Select from '@/components/Select';
import SelectCount from '@/components/Select/SelectCount.vue';
import SelectCountDepth from '@/components/Select/SelectCountDepth.vue';
import SelectDatepicker from '@/components/Select/SelectDatepicker.vue';
import moment from 'moment';
import cspSwitchMixin from './cspSwitchMixin';
import SelectCloud from '@/components/Select/SelectCloud.vue';
import commonMixin from '@/pages/Mixin/commonMixin';
import costOptiService from '@/services/costOptiService';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  comments: {},
  components: { SelectDatepicker, Select, SelectCount, SelectCountDepth, SelectCloud },
  mixins: [cspSwitchMixin, commonMixin],
  data() {
    return {
      cmmtTypOptions: {},
      cmmtTypList: ['SP', 'RI'], // default
      ctrtList: [],
      prodList: [],
      acntList: [],
      strDate: '',
      endDate: '',
      isSearch: true,
      filterParamList: [],
      selectedProdList: [],
      dateRanges: {},
      remoteStrDate: '',
      remoteEndDate: '',
      existRemoteParam: false,
      isFilterLoading: false,
    };
  },
  computed: {
    ...mapGetters('common', ['getAwsCtrts', 'getAzureCtrts', 'getGcpCtrts', 'getMyFirstCSP']),
    ...mapState('costOpti', ['filter', 'remoteParam']),
  },
  watch: {
    '$i18n.locale': ['setCmmtTypOptions', 'exchgRateSearch', 'setDateRanges'],
  },
  created() {
    this.setCmmtTypOptions();
    this.exchgRateSearch();
    this.setDateRanges();
    this.existRemoteParam = this.$route.query.remote === 'Y' && this.remoteParam.useYn;
    if (this.existRemoteParam) {
      this.remoteStrDate = this.remoteParam.strDate;
      this.remoteEndDate = this.remoteParam.endDate;
      this.strDate = this.remoteParam.strDate;
      this.endDate = this.remoteParam.endDate;
      this.filterParamList = this.remoteParam.acntIdList;

      const cspTypCd = this.remoteParam.cspTypCd;
      const cmmtTypList = [this.remoteParam.type];
      this.cmmtTypList = cmmtTypList;
      this.fetchParam({ state: { cmmtTypList, cspTypCd } });
    } else {
      const cmmtTypList = this.getCmmtList(this.filter.cspTypCd);
      this.cmmtTypList = cmmtTypList;
      this.fetchParam({ state: { cmmtTypList } });
    }
  },
  mounted() {
    const btnShows = document.querySelectorAll('.jsBtnShow1');
    btnShows.forEach((btnShow) => {
      btnShow.onclick = function () {
        if (this.parentNode.classList.contains('active')) {
          this.parentNode.classList.remove('active');
        } else {
          for (let i = 0; i < btnShows.length; i++) {
            btnShows[i].parentNode.classList.remove('active');
          }
          this.parentNode.classList.add('active');
        }
      };
    });
    const btn2Closes = document.querySelectorAll('.jsBtnClose2');
    btn2Closes.forEach((btn2Close) => {
      btn2Close.onclick = function () {
        this.parentNode.parentNode.classList.remove('active');
      };
    });
  },
  methods: {
    ...mapActions('costOpti', ['fetchFilter', 'fetchSearch', 'fetchParam', 'fetchRemoteParam']),
    setCmmtTypOptions() {
      if (i18n.locale === 'ko') {
        this.cmmtTypOptions = [
          { name: '전체', value: ['SP', 'RI'] },
          { name: 'SP', value: ['SP'] },
          { name: 'RI', value: ['RI'] },
        ];
      } else {
        this.cmmtTypOptions = [
          { name: 'All', value: ['SP', 'RI'] },
          { name: 'SP', value: ['SP'] },
          { name: 'RI', value: ['RI'] },
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
    // CSP 선택박스 변경
    handleCspTypeChange(cspTypCd) {
      this.fetchParam({ state: { cspTypCd } });
      this.handleCmmtTypeChange({ value: this.getCmmtList(cspTypCd) });
      this.isSearch = true;

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
    handleFilterDateRangeChange(dateRange) {
      if (this.existRemoteParam) {
        this.strDate = moment(this.remoteParam.strDate).format('YYYYMMDD');
        this.endDate = moment(this.remoteParam.endDate).format('YYYYMMDD');
        this.fetchParam({
          state: {
            strDate: this.strDate,
            endDate: this.endDate,
            cmmtTypList: this.cmmtTypList,
            acntIdList: this.filterParamList,
          },
        });
      } else {
        this.strDate = moment(dateRange.startDate).format('YYYYMMDD');
        this.endDate = moment(dateRange.endDate).format('YYYYMMDD');
        this.fetchParam({
          state: {
            strDate: this.strDate,
            endDate: this.endDate,
            cmmtTypList: this.cmmtTypList,
          },
        });
      }
      this.filterOption();
    },
    handleCmmtTypeChange(type) {
      this.cmmtTypList = type.value;
      this.fetchParam({ state: { cmmtTypList: this.cmmtTypList } });
      this.filterOption();
    },
    handleCtrtAcntChange(e) {
      // id만 모으기 -> list 가 있는지 없는지로 계정 - 계약 판단
      const acntIdList = e.filter((ctrt) => !ctrt.acntList).map((acnt) => acnt.id);
      this.fetchParam({ state: { acntIdList } });
      this.initSearch();
    },
    handleServiceChange(e) {
      const prodList = e;
      const prodCdList = e.map((prod) => prod.cd);
      this.fetchParam({ state: { prodCdList, prodList } });
      this.initSearch();
    },
    relocateProdList(prodList) {
      return this.moveToFirst(prodList, (prod) => prod.nm === 'VM', true);
    },
    setRemoteParamIfExists() {
      if (this.existRemoteParam) {
        const remoteProds = new Set(this.remoteParam.prodList.map((item) => item['cd']));
        const targetProds = this.prodList.filter((prod) => remoteProds.has(prod['cd'])).map((prod) => prod.cd);
        this.selectedProdList = targetProds.length > 0 ? targetProds : this.prodList.map((prod) => prod.cd);
        this.fetchParam({ state: { prodCdList: this.selectedProdList, acntIdList: this.filterParamList } });
      } else if (this.prod) {
        const targetProds = this.prodList
          .filter((prod) => prod.cd === this.prod || prod.nm === this.prod)
          .map((prod) => prod.cd);
        this.selectedProdList = targetProds.length > 0 ? targetProds : this.prodList.map((prod) => prod.cd);
        this.fetchParam({ state: { prodCdList: this.selectedProdList, acntIdList: this.filterParamList } });
      }
    },
    filterOption() {
      this.isFilterLoading = true;
      const param = { strDate: this.strDate, endDate: this.endDate, cmmtTypList: this.cmmtTypList };
      this.fetchFilter(param)
        .then((result) => {
          this.ctrtList = result.ctrtList;
          this.prodList = this.relocateProdList(result.prodList);
        })
        .then(() => {
          this.setRemoteParamIfExists();

          this.initSearch();
          this.remoteAllCheck();
        })
        .finally(() => (this.isFilterLoading = false));
    },
    onSearch() {
      this.isSearch = true;
      this.initSearch();
    },
    initSearch() {
      this.fetchSearch({ isSearch: { isSearch: this.isSearch } });

      if (this.existRemoteParam) {
        this.fetchParam({ state: { acntIdList: this.remoteParam.acntIdList } });
        this.existRemoteParam = false;
      }

      this.isSearch = false;

      // 다른 페이지로 상세보기 이동 시
      this.fetchRemoteParam({
        state: {
          cspTypCd: this.filter.cspTypCd,
          type: this.filter.cmmtTypList[0] || 'SP',
          acntIdList: this.filter.acntIdList,
          prodList: this.filter.prodList,
          endDate: this.filter.endDate,
          strDate: this.filter.strDate,
          useYn: true,
        },
      });
    },
    remoteAllCheck() {
      this.$refs.ctrtSel.reset();
      this.$refs.ctrtSel.handleCheckAllClick();
      this.$refs.ctrtSel.applyNotChangeListner();

      this.$refs.prodSel.reset();
      this.$refs.prodSel.handleCheckAllClick();
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
.ml-auto.font-normal {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.select-one .absolute,
.select-three .absolute,
.select-two .absolute {
  max-height: 385px;
}
.fixedSearch {
  bottom: 0;
  position: sticky;
}
.white-nowrap {
  white-space: nowrap;
}
</style>
