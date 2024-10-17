<template>
  <div>
    <div class="dashboard-card rounded-lg mb-4">
      <div class="flex border-primary-200 tab-one">
        <button
          v-if="myCmmts.includes('SP')"
          :class="[buttonClickedCss('SP'), buttonRoundedCss('SP'), buttonClass]"
          @click="handleCmmtTypChange('SP')"
        >
          <img
            v-if="filter.cmmtTypList.includes('SP')"
            src="@/assets/images/ico-aws-on.svg"
            alt="."
            class="mr-3"
            style="width: 36px; height: 20px; margin-top: 8px"
          />
          <img v-else src="@/assets/images/logo_aws.svg" alt="." class="mr-3" style="margin-top: 8px" />
          Savings Plans
        </button>
        <button
          v-if="myCmmts.includes('RI')"
          :class="[buttonClickedCss('RI'), buttonRoundedCss('RI'), buttonClass]"
          @click="handleCmmtTypChange('RI')"
        >
          <img
            v-if="filter.cmmtTypList.includes('RI')"
            src="@/assets/images/ico-aws-on.svg"
            alt="."
            class="mr-3"
            style="width: 36px; height: 20px; margin-top: 8px"
          />
          <img v-else src="@/assets/images/logo_aws.svg" alt="." class="mr-3 mt-3" style="margin-top: 8px" />
          Reserved Instances
        </button>
        <button
          v-if="myCmmts.includes('AzureRI')"
          :class="[buttonClickedCss('AzureRI'), buttonRoundedCss('AzureRI'), buttonClass]"
          @click="handleCmmtTypChange('AzureRI')"
        >
          <img
            v-if="filter.cmmtTypList.includes('AzureRI')"
            src="@/assets/images/ico-azure-on.svg"
            alt="."
            class="mr-3"
            style="width: 68px; height: 20px"
          />
          <img v-else src="@/assets/images/logo_typ_azure.svg" alt="." class="mr-3" />
          Reservations
        </button>
      </div>
    </div>

    <div class="dashboard-card rounded-lg mb-4">
      <div class="sort-wrap type2">
        <div class="flex mr-10 br-10">
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
          <div class="relative py-4 px-7 select-three">
            <div class="text-sm text-primary-600">
              {{ $t('optimization.contractAnd') }}
              {{ filter.cmmtTypList.includes('AzureRI') ? 'subscription' : $t('optimization.accounts') }}
            </div>
            <SelectCountDepth
              ref="ctrtSel"
              :data="ctrtList"
              :text-getter="(item) => item.nm"
              :key-getter="(item) => item.id"
              :filter-param-list="filterParamList"
              :filter-ctrt-id="contractId"
              select-class="flex items-center justify-between w-full"
              :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
              arrow-class="ml-4"
              @change="handleCtrtAcntChange"
            />
          </div>
          <div class="relative py-4 px-7 select-three">
            <div class="text-sm text-primary-600">
              {{ filter.cmmtTypList.includes('SP') ? $t('optimization.purchaseType') : $t('optimization.service') }}
            </div>
            <SelectCount
              ref="prodSel"
              :data="prodList"
              :text-getter="(item) => item.nm"
              :key-getter="(item) => item.cd"
              :selected-prod-list="selectedProdList"
              select-class="flex items-center justify-between w-full"
              :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
              arrow-class="ml-4"
              @change="handleServiceChange"
            />
          </div>
        </div>
        <button
          class="btn br-10"
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
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { SelectDatepicker, SelectCount, SelectCountDepth } from '@/components/Select';
import moment from 'moment';
import commonMixin from '@/pages/Mixin/commonMixin';
import costOptiService from '@/services/costOptiService';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: { SelectDatepicker, SelectCount, SelectCountDepth },
  mixins: [commonMixin],
  props: {
    buttonClass: {
      type: String,
      default:
        'flex items-center justify-center w-full py-3.5 text-gray-600 bg-white border border-primary-200 text-sm font-medium',
    },
    cmmtTyp: {
      type: String,
      default: '',
    },
    acntId: {
      type: String,
      default: '',
    },
    prod: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      internalChanged: false, // 내부 이벤트인 경우
      hasCmmts: [],
      ctrtList: [],
      prodList: [],
      acntList: [],
      strDate: undefined,
      endDate: undefined,
      isSearch: true,
      selectedProdList: [],
      filterParamList: [],
      dateRanges: {},
      remoteStrDate: undefined,
      remoteEndDate: undefined,
      existRemoteParam: false,
      isFilterLoading: false,
      contractId: this.$route.params.contractId || undefined,
      cspTypCd: this.$route.params.cspTypCd || undefined,
    };
  },
  computed: {
    ...mapState('common', ['myCmmts']),
    ...mapState('costOpti', ['filter', 'remoteParam']),
  },
  watch: {
    '$i18n.locale': ['exchgRateSearch', 'setDateRanges'],
  },
  created() {
    this.existRemoteParam = this.$route.query.remote === 'Y' && this.remoteParam.useYn;
    this.exchgRateSearch();
    this.setDateRanges();
    let cmmtTypList;
    if (this.existRemoteParam) {
      // from 약정대시보드, 약정가능대상
      this.remoteStrDate = this.remoteParam.strDate;
      this.remoteEndDate = this.remoteParam.endDate;
      this.strDate = this.remoteParam.strDate;
      this.endDate = this.remoteParam.endDate;
      this.filterParamList = this.remoteParam.acntIdList;
      cmmtTypList = [this.remoteParam.type];
    } else if (this.acntId && this.prod) {
      // from 알림 팝업 링크
      this.filterParamList = [this.acntId];
      cmmtTypList = [this.cmmtTyp];
    } else if (this.contractId) {
      // from 메인대시보드
      const cmmtTyp = this.cspTypCd === 'AZURE' ? 'AzureRI' : 'SP'; // AWS default
      cmmtTypList = [cmmtTyp];
    } else {
      cmmtTypList = [this.myCmmts[0]];
    }
    this.fetchParam({ state: { cmmtTypList } });
  },
  methods: {
    ...mapActions('costOpti', ['fetchStatFilter', 'fetchSearch', 'fetchParam']),
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
    relocateProdList(prodList) {
      return this.moveToFirst(prodList, (prod) => prod.nm === 'VM', true);
    },
    async filterOption(isSearch) {
      this.isFilterLoading = true;
      const param = { strDate: this.strDate, endDate: this.endDate, cmmtTypList: this.filter.cmmtTypList };
      this.fetchStatFilter(param)
        .then((result) => {
          this.ctrtList = result.ctrtList;
          this.prodList = this.relocateProdList(result.prodList);
        })
        .then(() => {
          if (!this.internalChanged) this.setRemoteParamIfExists();
          if (!this.contractId) {
            if (isSearch) {
              this.onSearch();
            } else {
              this.initSearch();
            }
          }
          this.remoteAllCheck();
        })
        .finally(() => (this.isFilterLoading = false));
    },
    handleCmmtTypChange(cmmtTyp) {
      this.internalChanged = true;
      this.fetchParam({ state: { acntIdList: [] } });
      this.cspTypCd = this.getCspTypCd(cmmtTyp);
      this.fetchParam({ state: { cmmtTypList: [cmmtTyp], cspTypCd: this.cspTypCd } });
      this.filterOption(true);
      const sel = document.querySelectorAll('.exchRate');
      const vis = document.querySelector('.exchVisYn');
      if (cmmtTyp === 'AzureRI') {
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
      } else {
        this.strDate = moment(dateRange.startDate).format('YYYYMMDD');
        this.endDate = moment(dateRange.endDate).format('YYYYMMDD');
      }
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
      this.fetchParam({ state: { prodList, prodCdList } });
      this.initSearch();
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
    },
    remoteAllCheck() {
      this.$refs.ctrtSel.reset();
      if (this.contractId) {
        this.$refs.ctrtSel.handleCheckCtrtClick();
      } else {
        this.$refs.ctrtSel.handleCheckAllClick();
      }
      this.$refs.ctrtSel.applyNotChangeListner();

      this.$refs.prodSel.reset();
      this.$refs.prodSel.handleCheckAllClick();
      this.$refs.prodSel.applyNotChangeListner();
    },
    buttonClickedCss(type) {
      if (this.filter.cmmtTypList.includes(type)) return 'clicked';
      return '';
    },
    buttonRoundedCss(type) {
      const length = this.myCmmts.length;
      if (length === 1) {
        return 'rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg';
      }
      if (length === 2) {
        if ((type === 'SP' && this.myCmmts.includes('SP')) || (type === 'RI' && !this.myCmmts.includes('SP'))) {
          return 'rounded-tl-lg rounded-bl-lg ';
        }
        return 'rounded-tr-lg rounded-br-lg ';
      }
      if (length === 3) {
        if (type === 'SP') {
          return 'rounded-tl-lg rounded-bl-lg ';
        }
        if (type === 'AzureRI') {
          return 'rounded-tr-lg rounded-br-lg ';
        }
      }
      return '';
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
