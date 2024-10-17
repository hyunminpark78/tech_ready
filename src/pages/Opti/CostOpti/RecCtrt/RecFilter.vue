<template>
  <div>
    <div class="dashboard-card mb-4">
      <div class="flex border-primary-200 tab-one">
        <button
          v-if="myCmmts.includes('SP')"
          :class="[cssBtnClicked('SP'), cssBtnRounded('SP'), cssBtnTab]"
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
          :class="[cssBtnClicked('RI'), cssBtnRounded('RI'), cssBtnTab]"
          @click="handleCmmtTypChange('RI')"
        >
          <img
            v-if="filter.cmmtTypList.includes('RI')"
            src="@/assets/images/ico-aws-on.svg"
            alt="."
            class="mr-3"
            style="width: 36px; height: 20px; margin-top: 8px"
          />
          <img v-else src="@/assets/images/logo_aws.svg" alt="." class="mr-3" style="margin-top: 8px" />
          Reserved Instances
        </button>
        <button
          v-if="myCmmts.includes('AzureRI')"
          :class="[cssBtnClicked('AzureRI'), cssBtnRounded('AzureRI'), cssBtnTab]"
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
    <div class="dashboard-card mb-4">
      <div class="sort-wrap type2">
        <div class="flex">
          <div class="relative py-4 px-7 select-three">
            <div class="text-sm text-primary-600">
              {{ $t('optimization.contractAnd') }} {{ getFilterTitle }} {{ type }}
            </div>
            <SelectCountDepth
              ref="ctrtSel"
              :data="ctrtList"
              :text-getter="(item) => item.nm"
              :key-getter="(item) => item.id"
              :child-key="'acntList'"
              :filter-param-list="filterParamList"
              :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
              arrow-class="ml-4"
              select-class="flex items-center justify-between w-full text-gray-700"
              @change="handleCtrtAcntChange"
            />
          </div>
          <div class="relative py-4 px-7 select-three flex-shrink-0">
            <div class="text-sm text-primary-600">
              {{ filter.cmmtTypList.includes('SP') ? $t('optimization.purchaseType') : $t('optimization.service') }}
            </div>
            <Select
              :data="prodList"
              :text-getter="(item) => item.nm"
              :key-getter="(item) => item.cd"
              select-class="flex items-center justify-between w-full text-primary-400 ellipsis"
              :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
              arrow-class="ml-4"
              option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
              option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
              :default-selected="currentProd ? (c) => c.cd === currentProd : 0"
              @click="handleServiceChange"
            />
          </div>
          <div class="relative py-4 px-7 select-three">
            <div class="text-sm text-primary-600">{{ $t('optimization.dataAnalysisPeriod') }}</div>
            <Select
              ref="dataRange"
              :data="periodList"
              :text-getter="(item) => item.text"
              :key-getter="(item) => item.val"
              select-class="flex items-center justify-between w-full text-primary-400"
              :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
              arrow-class="ml-4"
              option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
              option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
              :default-selected="1"
              @click="handlePeriodChange"
            />
          </div>
          <div class="relative py-4 px-7 select-three">
            <div class="text-sm text-primary-600">{{ $t('optimization.contractOption') }}</div>
            <Select
              ref="selRecOptionList"
              :data="selRecOptionList"
              :text-getter="(item) => item.text"
              :key-getter="(item) => item.val"
              select-class="flex items-center justify-between w-full text-primary-400"
              :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
              arrow-class="ml-4"
              option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
              option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
              :default-selected="0"
              @click="handleSelRecOptionChange"
            />
          </div>
        </div>
        <a
          href="javascript:void(0)"
          class="btn"
          style="height: -webkit-fill-available; display: flex; justify-content: center; align-items: center"
          @click="onSearch"
          >{{ $t('common.button.apply') }}</a
        >
      </div>
    </div>
    <div class="sort2-wrap flex justify-between mb-4">
      <template v-if="loading">
        <div class="flex ml-50per pt-3">
          <div class="justify-center">
            <DataLoadingOverlay style="flex" :disabled-text="true"></DataLoadingOverlay>
          </div>
        </div>
      </template>
      <div v-show="!loading" class="flex">
        <div class="text-primary-400">{{ title.name }}</div>
        <strong style="margin-left: 16px"> {{ title.subTitle }}</strong>
        <div class="tooltip-wrap mt5">
          <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
          <div class="tooltip-layer pos_r">
            <strong class="ti">{{ $t('optimization.commitmentPurchaseOption') }}</strong>
            <template v-if="filter.cmmtTypList.includes('SP') || filter.cmmtTypList.includes('RI')">
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.recommendation') }}</span> :
                {{ $t('optimization.recommendOptionNoUpfrontCost') }}
              </div>
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.lowestPrice') }}</span> :
                {{ $t('optimization.lowestPriceOption') }}
              </div>
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.mostUsed') }}</span> :
                {{ $t('optimization.optionHighestPurchases') }}
              </div>
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.userSelection') }}</span> :
                {{ $t('optimization.checkOutOptionsPrepay') }}
              </div>
            </template>
            <template v-if="filter.cmmtTypList.includes('AzureRI')">
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.recommendation') }}</span> :
                {{ $t('optimization.recommendOptionShortContract') }}
              </div>
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.lowestPrice') }}</span> :
                {{ $t('optimization.lowestPriceOption') }}
              </div>
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.mostUsed') }}</span> :
                {{ $t('optimization.optionHighestPurchases') }}
              </div>
              <div class="ls">
                <span class="text-primary-400">{{ $t('optimization.userSelection') }}</span> :
                {{ $t('optimization.checkOutOptionsScope') }}
              </div>
            </template>
            <button class="close jsTooltipClose1">툴팁 닫기</button>
          </div>
        </div>
      </div>

      <div>
        <div class="btn line cursor-pointer" @click="getPopup()">{{ $t('optimization.contractInquiry') }}</div>
      </div>
    </div>
    <RecOptionGrid
      v-if="isOpen"
      :param="param"
      :other-option-list="otherOptionList"
      @setCurrentOption="setCurrentOption"
      @setParam="setParam"
      @setRecOption="setRecOption"
      @openOptionPopUp="openOptionPopUp"
    />
    <Popup :visible="popup.visible" :content="popup.content" @closePopup="closePopup" />
  </div>
</template>

<script>
// saving plane > SP || Reserved instances > RI
import Select from '@/components/Select';
import SelectCountDepth from '@/components/Select/SelectCountDepth.vue';
import RecOptionGrid from './RecOptionGrid.vue';
import costOptiService from '@/services/costOptiService';
import { mapActions, mapGetters, mapState } from 'vuex';
import { yearToString, prePaymentToString, scopeToString } from './GridHeaderEnum.js';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay.vue';
import commonMixin from '@/pages/Mixin/commonMixin';
import Popup from '@/components/Popup';
import { i18n } from '../../../../../public/locales/i18n';
import moment from 'moment/moment';

export default {
  components: { Select, SelectCountDepth, RecOptionGrid, DataLoadingOverlay, Popup },
  mixins: [commonMixin],
  data() {
    return {
      type: '',
      ctrtList: [],
      prodList: [],
      periodListByCmmt: {},
      selRecOptionList: [],
      otherOptionList: [],
      isOpen: false,
      loading: false,
      currentOption: { option: 'rcmdYn' },
      recOptionList: [],
      filterParamList: [],
      currentProd: null,
      param: {
        type: '', // cmmtTyp
        cmmtTypList: [], //[cmmtTyp]
        acntIdList: [],
        rcmdProd: { nm: '', cd: '' },
        analTerm: undefined,
        paymentOpt: undefined,
        termLen: undefined,
        analTypCd: undefined,
        analTypNm: undefined,
        offrClss: undefined,
        scopeTyp: undefined,
        cmmtTerm: undefined,
      },
      existRemoteParam: false,
      recOption: {},
      existOption: true,
      title: {
        name: '',
        subTitle: '',
      },
      titles: {},
      popup: {
        visible: false,
        content: '',
      },
      cssBtnTab:
        'flex items-center justify-center w-1/2 py-3.5 text-gray-600 bg-white border border-primary-200 text-sm font-medium',
    };
  },
  computed: {
    ...mapState('common', ['myCmmts']),
    ...mapState('costOpti', ['filter', 'recommendOption', 'remoteParam']),

    prchLink() {
      let link = '';
      if (this.filter.cmmtTypList.includes('SP')) {
        link =
          this.param.rcmdProd.cd === 'AmazonSageMaker'
            ? 'https://us-east-1.console.aws.amazon.com/cost-management/home?region=ap-northeast-2#/savings-plans/purchase'
            : 'https://us-east-1.console.aws.amazon.com/cost-management/home?region=ap-northeast-2#/savings-plans/purchase';
      } else {
        switch (this.param.rcmdProd.cd) {
          case 'AmazonEC2':
            link = 'https://ap-northeast-2.console.aws.amazon.com/ec2/v2/home?region=ap-northeast-2#ReservedInstances:';
            break;
          case 'AmazonRDS':
            link =
              'https://ap-northeast-2.console.aws.amazon.com/rds/home?region=ap-northeast-2#reserved-instances-purchase:';
            break;
          case 'AmazonElastiCache':
            link =
              'https://ap-northeast-2.console.aws.amazon.com/elasticache/home?region=ap-northeast-2#purchase-reserved-cache-node:';
            break;
          case 'AmazonES':
            link =
              'https://ap-northeast-2.console.aws.amazon.com/esv3/home?region=ap-northeast-2#opensearch/reserved-instances/purchase-instance';
            break;
          case 'AmazonRedshift':
            link =
              'https://ap-northeast-2.console.aws.amazon.com/redshiftv2/home?region=ap-northeast-2#purchase-reserved-nodes';
            break;
        }
      }
      return link;
    },
    periodList() {
      console.log('cmmTypList', this.filter.cmmtTypList);
      return this.periodListByCmmt[this.filter.cmmtTypList[0]];
    },
    getFilterTitle() {
      return this.titles[this.filter.cmmtTypList[0]].filter;
    },
    getCmmtTitle() {
      return this.titles[this.filter.cmmtTypList[0]].commitment;
    },
  },
  watch: {
    '$i18n.locale': [
      'exchgRateSearch',
      'setPeriodListByCmmt',
      'setTitles',
      'serviceContainRecOptionForMultiLang',
      'onSearch',
    ],
    loading(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchLoading({ loading: newVal });
      }
    },
  },
  created() {
    this.exchgRateSearch();
    this.setTitles();
    this.setPeriodListByCmmt();
    let curCmmtTyp;
    this.existRemoteParam = this.$route.query.remote === 'Y' && this.remoteParam.useYn;
    if (this.existRemoteParam) {
      const remoteType = this.remoteParam.type;
      this.filterParamList = this.remoteParam.acntIdList;
      this.param.type = remoteType;
      curCmmtTyp = remoteType;
    } else if (this.$route.query.cmmtTyp && this.$route.query.acntId) {
      this.filterParamList = [this.$route.query.acntId];
      this.currentProd = this.$route.query.prod;
      curCmmtTyp = this.myCmmts.find((item) => item === this.$route.query.cmmtTyp);
    } else {
      curCmmtTyp = this.myCmmts[0];
    }

    this.param.type = curCmmtTyp;
    this.param.cmmtTypList = [curCmmtTyp];
    this.fetchParam({ state: { cmmtTypList: this.param.cmmtTypList } });
    this.filterOption(this.param.type);
  },
  methods: {
    ...mapActions('costOpti', ['fetchRecFilter', 'fetchParam', 'fetchRecommend', 'fetchLoading', 'fetchSearch']),
    setPeriodListByCmmt() {
      if (i18n.locale === 'ko') {
        this.periodListByCmmt = {
          SP: [
            { text: '14일', val: 14 },
            { text: '30일', val: 30 },
            { text: '60일', val: 60 },
          ],
          RI: [
            { text: '14일', val: 14 },
            { text: '30일', val: 30 },
            { text: '60일', val: 60 },
          ],
          AzureRI: [
            { text: '7일', val: 7 },
            { text: '30일', val: 30 },
            { text: '60일', val: 60 },
          ],
        };
      } else {
        this.periodListByCmmt = {
          SP: [
            { text: '14 days', val: 14 },
            { text: '30 days', val: 30 },
            { text: '60 days', val: 60 },
          ],
          RI: [
            { text: '14 days', val: 14 },
            { text: '30 days', val: 30 },
            { text: '60 days', val: 60 },
          ],
          AzureRI: [
            { text: '7 days', val: 7 },
            { text: '30 days', val: 30 },
            { text: '60 days', val: 60 },
          ],
        };
      }
    },
    setTitles() {
      if (i18n.locale === 'ko') {
        this.titles = {
          SP: {
            filter: '계정',
            commitment: 'Savings Plans 옵션',
          },
          RI: {
            filter: '계정',
            commitment: 'Reserved Instances 옵션',
          },
          AzureRI: {
            filter: 'subscriptions',
            commitment: 'Reservations 옵션',
          },
        };
      } else {
        this.titles = {
          SP: {
            filter: 'accounts',
            commitment: 'Savings Plans options',
          },
          RI: {
            filter: 'accounts',
            commitment: 'Reserved Instances options',
          },
          AzureRI: {
            filter: 'subscriptions',
            commitment: 'Reservations options',
          },
        };
      }
    },
    serviceContainRecOptionForMultiLang() {
      this.serviceContainRecOption(this.recOptionList);
    },
    // 약정 유형 변경
    handleCmmtTypChange(cmmtTyp) {
      this.param.type = cmmtTyp;
      this.param.cmmtTypList = [cmmtTyp];
      this.setCurrentOption('rcmdYn'); // 약정 유형 변경 시 기본(추천)값으로 초기화. - 선택목록에 '추천'이 우선순위이기 때문
      this.fetchParam({ state: { cmmtTypList: [cmmtTyp], cspTypCd: this.getCspTypCd(cmmtTyp) } });
      this.filterOption(cmmtTyp);

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
    // 계약 및 계정(or subscription for Azure) 선택변경
    handleCtrtAcntChange(ctrts) {
      const acntIdList = ctrts.filter((acnt) => !acnt.acntList).map((acnt) => acnt.id);
      this.fetchParam({ state: { acntIdList } });
      this.setParam({ acntIdList: acntIdList });
      this.serviceContainRecOption();
    },
    // 구매(서비스)유형 선택변경
    handleServiceChange(prodCd) {
      this.setCurrentOption('rcmdYn'); // 구매유형(서비스) 변경 시 기본(추천)값으로 초기화.- 선택목록에 '추천'이 우선순위이기 때문
      this.setParam({ rcmdProd: prodCd });
      this.serviceContainRecOption();
    },
    // 분석기간 선택변경
    handlePeriodChange(period) {
      this.setCurrentOption('rcmdYn'); // 구매유형(서비스) 변경 시 기본(추천)값으로 초기화.- 선택목록에 '추천'이 우선순위이기 때문
      this.setParam({ analTerm: period.val });
      this.serviceContainRecOption();
    },
    // 추천옵션 선택변경
    handleSelRecOptionChange(recOpt) {
      if (recOpt.val !== 'etc') {
        this.setCurrentOption(recOpt.val);
      } else {
        this.openOptionPopUp(true);
      }
    },
    getPopup() {
      this.popup.content = `${this.$t('optimization.hello')}\n${this.$t(
        'optimization.inquiryFunctionPrepared'
      )}\n${this.$t('optimization.anyQuestionsEmail')}\n${this.$t('optimization.thankYou')}`;
      this.popup.visible = true;
    },
    closePopup() {
      this.popup.visible = false;
    },
    relocateProdList(prodList) {
      return this.moveToFirst(prodList, (prod) => prod.nm === 'VM', true);
    },
    async filterOption(type) {
      const result = await this.fetchRecFilter({ cmmtTypList: [type] });
      this.ctrtList = result.ctrtList || [];
      this.prodList = this.relocateProdList(result.prodList || []);
      this.initParam();
      this.fetchSearch({ isSearch: { isSearch: true } });
    },
    async initParam() {
      this.setParam({
        acntIdList: this.filterAcntList(),
        rcmdProd: this.prodList.find((p) => p.cd === this.currentProd) || this.prodList[0],
        analTerm: '30',
        type: this.param.type,
      });
      this.$refs.dataRange.selectedItem =
        i18n.locale === 'ko' ? { text: '30일', val: 30 } : { text: '30 days', val: 30 };
      await this.onSearch();
      this.serviceContainRecOption(this.recOptionList);
      this.remoteAllCheck();
    },
    remoteAllCheck() {
      this.$refs.ctrtSel.reset();
      this.$refs.ctrtSel.handleCheckAllClick();
      this.$refs.ctrtSel.applyNotChangeListner();

      this.existRemoteParam = null;
      this.$route.query.cmmtTyp = null;
      this.$route.query.acntId = null;
    },
    filterAcntList() {
      let acntIdList = [];
      this.ctrtList.forEach((ctrt) => {
        const acnts = ctrt.acntList.map((acnt) => acnt.id);
        acntIdList = acntIdList.concat(acnts);
      });
      if (this.existRemoteParam) {
        return this.remoteParam.acntIdList;
      } else if (this.$route.query.cmmtTyp && this.$route.query.acntId) {
        return [this.$route.query.acntId];
      } else {
        return acntIdList;
      }
    },
    async onSearch() {
      this.loading = true;

      try {
        const result = await costOptiService.fetchRecOption(this.param);
        this.recOptionList = result.data.data || [];
        this.otherOptionList = result.data.data || [];
      } catch (error) {
        console.log('onSearch', error);
      }
      const existCurrentOption = this.currentOption.option ? true : false;
      // 추천이 없을 때 -> 없음으로 예외
      if (existCurrentOption) {
        // this.currentOption.option = 'rcmdYn' | 'minCostYn' | 'mostUseYn'
        this.recOption = this.recOptionList.find((item) => item[this.currentOption.option] === 'Y');
      }

      if (this.recOption) {
        await this.fetchRcmdInvn();
      } else {
        this.fetchRecommendUpdate({
          allList: [],
          checkObj: {},
          rcmdProd: this.param.rcmdProd,
          type: this.param.type,
          recInvnList: [],
        });
      }
      this.setRecTitle();

      this.loading = false;
    },
    async fetchRcmdInvn() {
      const { termLen, paymentOpt, analTypCd, analTypNm, offrClss, scopeTyp, cmmtTerm } = this.recOption;
      this.setParam({
        paymentOpt,
        termLen,
        analTypCd,
        analTypNm,
        offrClss,
        scopeTyp,
        cmmtTerm,
      });

      try {
        const result = await costOptiService.fetchRecRcmdInvn(this.param);
        const recInvnList = result.data.data || [];
        // this.fetchRecommend({ recommendOption: { ...this.recommendOption, recInvnList: recInvnList } }); // 변경 필요
        this.fetchRecommendUpdate({
          allList: this.recOptionList,
          checkObj: this.recOption,
          rcmdProd: this.param.rcmdProd,
          type: this.param.type,
          recInvnList: recInvnList,
        });
      } catch (err) {
        console.error('fetchRcmdInvn', err);
      }
    },
    async serviceContainRecOption(existsRecOptionList) {
      let selRecOptionList = [];
      this.selRecOptionList = [];
      if (!existsRecOptionList) {
        try {
          const result = await costOptiService.fetchRecOption(this.param);
          const recOptions = result.data.data || [];
          this.otherOptionList = recOptions;
          selRecOptionList = recOptions;
          // 구매유형(서비스) 변경 시 초기 추천 아이템 설정
          const recOption = recOptions.find((item) => item[this.currentOption.option] === 'Y');
          this.setRecOption(recOption);
        } catch (err) {
          console.error('serviceContainRecOption', err);
        }
      } else {
        selRecOptionList = existsRecOptionList;
      }
      if (i18n.locale === 'ko') {
        selRecOptionList.forEach((val) => {
          if (val.rcmdYn === 'Y') {
            this.selRecOptionList.unshift({ text: '추천', val: 'rcmdYn' });
          } else if (val.mostUseYn === 'Y') {
            this.selRecOptionList.splice(1, 0, { text: '최다사용', val: 'mostUseYn' });
          } else if (val.minCostYn === 'Y') {
            this.selRecOptionList.splice(2, 0, { text: '최저가격', val: 'minCostYn' });
          }
        });
      } else {
        selRecOptionList.forEach((val) => {
          if (val.rcmdYn === 'Y') {
            this.selRecOptionList.unshift({ text: 'Recommendation', val: 'rcmdYn' });
          } else if (val.mostUseYn === 'Y') {
            this.selRecOptionList.splice(1, 0, { text: 'Most used', val: 'mostUseYn' });
          } else if (val.minCostYn === 'Y') {
            this.selRecOptionList.splice(2, 0, { text: 'Lowest price', val: 'minCostYn' });
          }
        });
      }
      if (i18n.locale === 'ko') {
        if (this.selRecOptionList.length > 0) {
          this.selRecOptionList.push({ text: '사용자 선택', val: 'etc' });
        } else {
          this.selRecOptionList.push({ text: '없음', val: 'none' });
        }
      } else {
        if (this.selRecOptionList.length > 0) {
          this.selRecOptionList.push({ text: 'User selection', val: 'etc' });
        } else {
          this.selRecOptionList.push({ text: 'None', val: 'none' });
        }
      }
    },
    // Shared RecOptionGrid Callback
    openOptionPopUp(yn) {
      this.isOpen = yn;
    },
    // Shared RecOptionGrid Callback
    setParam(param) {
      this.param = { ...this.param, ...param };
    },
    // RecOptionGrid Callback
    setRecOption(option) {
      if (option == null || option == undefined) return;
      const { termLen, paymentOpt, analTypCd, analTypNm, offrClss, scopeTyp, cmmtTerm } = option;
      this.setParam({ termLen, paymentOpt, analTypCd, analTypNm, offrClss, scopeTyp, cmmtTerm });
      this.fetchRecommendUpdate({ checkObj: option });
      this.recOption = option;
    },
    // Shared RecOptionGrid Callback
    setCurrentOption(option) {
      this.currentOption = { option: option };
    },
    setRecTitle() {
      if (!this.recOption) {
        this.title.subTitle = this.$t('optimization.noRecommendedOptions');
        return;
      }

      this.title.name = this.getCmmtTitle;

      switch (this.param.rcmdProd.nm) {
        case 'SageMaker':
        case 'RI':
        case 'AzureRI':
          this.title.name = `${this.param.rcmdProd.nm} ${this.title.name}`;
          break;
      }

      const awsSpRiExpr = () => {
        const { paymentOpt, analTypNm, offrClss, termLen } = this.recOption;

        const year = `${yearToString[termLen][i18n.locale]}`;
        const type = analTypNm ? analTypNm : offrClss;
        const typeStr = type ? `, ${type.charAt(0).toUpperCase() + type.slice(1)}` : '';
        const payment = `, ${prePaymentToString[paymentOpt][i18n.locale]}`;
        if (prePaymentToString[paymentOpt][i18n.locale]) {
          return year + typeStr + payment;
        } else {
          return this.$t('optimization.noRecommendedOptions');
        }
      };

      const azureRiExpr = () => {
        const { scopeTyp, cmmtTerm } = this.recOption;
        const year = `${yearToString[cmmtTerm][i18n.locale]}`;
        const scope = `${scopeToString[scopeTyp][i18n.locale]}`;
        return `${year}, ${scope}`;
      };

      if (this.filter.cmmtTypList.includes('RI') || this.filter.cmmtTypList.includes('SP')) {
        this.title.subTitle = awsSpRiExpr();
      } else if (this.filter.cmmtTypList.includes('AzureRI')) {
        this.title.subTitle = azureRiExpr();
      }
    },
    fetchRecommendUpdate(param) {
      this.fetchRecommend({ recommendOption: { ...this.recommendOption, ...param } });
      // this.recOption = this.recommendOption;
    },
    cssBtnClicked(type) {
      return this.filter.cmmtTypList.includes(type) ? 'clicked' : '';
    },
    cssBtnRounded(type) {
      const length = this.myCmmts.length;
      if (length === 1) {
        return 'rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg flex-grow-1';
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

<style>
a.clicked {
  font-weight: 700;
  --text-opacity: 1;
  color: #fff;
  color: rgba(255, 255, 255, var(--text-opacity)) !important;
  --bg-opacity: 1;
  background-color: #00a5ed;
  background-color: rgba(0, 165, 237, var(--bg-opacity));
}
.fixedSearch {
  bottom: 0;
  position: sticky;
}
.img-btn-size {
  width: 36px;
  height: 20px;
}
.img-btn-size2 {
  width: 68px;
  height: 20px;
}
</style>
