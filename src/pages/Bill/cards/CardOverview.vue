<template>
  <Card wrapper-class="bg-white border rounded-lg border-primary-200 dashboard-card">
    <div v-show="chrgYm.length > 0" class="p-8">
      <div class="flex items-center justify-between mb-7">
        <span v-if="billDetailList.ocpBillCtrtVo" class="text-2xl">{{ billDetailList.ocpBillCtrtVo.ctrtNm }}</span>
        <div class="flex">
          <!-- 이번 범위 제거 -->
          <!-- <button class="flex items-center ml-4 text-sm text-gray-500"> -->
          <button class="flex items-center ml-4 text-sm text-gray-500" @click="detailExcelDownload">
            {{ $t('common.button.downloadDetailInfo')
            }}<img src="@/assets/images/ico-download.svg" alt="." class="ml-1" />
          </button>
          <!-- <button class="flex items-center ml-4 text-sm text-gray-500" @click="excelDownload">-->
          <!--   엑셀 다운로드<img src="@/assets/images/ico-download.svg" alt="." class="ml-1" />-->
          <!-- </button>-->
          <button class="flex items-center ml-4 text-sm text-gray-500" @click="billDown">
            {{ $t('common.button.downloadInvHtml') }}<img src="@/assets/images/ico-download.svg" alt="." class="ml-1" />
          </button>
        </div>
      </div>
      <div class="flex">
        <div class="flex flex-col w-4/12">
          <span v-if="i18n().locale === 'ko' && billDetailList.ocpBillCtrtVo" class="mb-2 text-xl text-primary-400"
            >{{ billDetailList.ocpBillCtrtVo.billDt | toMonthKo }} 청구 금액</span
          >
          <span v-if="i18n().locale === 'en' && billDetailList.ocpBillCtrtVo" class="mb-2 text-xl text-primary-400"
            >Billing amount in {{ billDetailList.ocpBillCtrtVo.billDt | toMonthEn }}</span
          >
          <span v-if="billDetailList.billAprvl" class="text-4xl" style="font-size: 35px !important">
            <span class="text-3xl">{{ totalList.pricingCurcyCd | unit }}</span
            >{{ billDetailList.billAprvl.thisMonthUsageTotalPrice }}
          </span>

          <span v-if="billDetailList.ocpBillCtrtVo" class="text-4xl">
            <span v-if="billDetailList.billAprvl.dwnYn == 'Y'" style="color: #fb5aa5 !important" class="text-sm"
              >{{ $t('dashboard.billedAmountPrepaid') }} : &#8361;{{
                billDetailList.billAprvl.dwnRealAmt | number
              }}</span
            >
            <span v-else-if="billDetailList.billAprvl.pstYn == 'Y'" style="color: #fb5aa5 !important" class="text-sm"
              >{{ $t('dashboard.billedAmountPostPayment') }} : &#8361;0</span
            >
          </span>
          <!--<template v-if="totalList.discntCost < 0">
            <span class="mb-2 text-xl text-primary-400 my-7">총 할인 금액</span>
            <span class="text-4xl" style="font-size: 35px !important">
              -<span class="text-3xl">{{ totalList.pricingCurcyCd | unit }}</span
              >{{ Math.abs(totalList.discntCost).toLocaleString() }}
            </span>
          </template>-->
        </div>

        <div class="w-5/12">
          <strong class="title-01">{{ $t('cost.billingSummary') }}</strong>
          <div class="flex my-3">
            <span class="w-2/12 mr-4 text-sm text-primary-600">{{ $t('cost.billingSummaryPeriod') }}</span>
            <span v-if="billDetailList.ocpBillCtrtVo" class="text-sm text-gray-700"
              >{{ billDetailList.ocpBillCtrtVo.useStrDt | toDateDot }}~
              {{ billDetailList.ocpBillCtrtVo.useEndDt | toDateDot }}
            </span>
          </div>
          <div class="flex my-3">
            <span class="w-2/12 mr-4 text-sm text-primary-600">{{ $t('cost.exchangeRate') }}</span>
            <span v-if="billDetailList.ocpBillCtrtVo" class="text-sm text-gray-700">{{
              billDetailList.ocpBillCtrtVo.billDt | toDateDot
            }}</span>
          </div>
          <div class="flex my-3">
            <span class="w-2/12 mr-4 text-sm text-primary-600">{{ $t('cost.exchangeRate') }}</span>
            <template v-for="(item, idx) in billDetailList.dayExchgRateList">
              <span v-if="item.exchgRateSrcCd === 'FIX'" :key="idx" class="text-sm text-gray-700">
                {{ totalList.pricingCurcyCd | unit }}{{ item.exchgRateAmt }} {{ $t('cost.fixedExchangeRate') }}
              </span>
              <span v-if="item.exchgRateSrcCd === 'AWS'" :key="idx" class="text-sm text-gray-700">
                {{ totalList.pricingCurcyCd | unit }}{{ item.exchgRateAmt }} {{ $t('cost.awsInvoiceDate') }}
                {{ item.exchgRateStdDt | toDateDot }})
              </span>
            </template>
          </div>
        </div>

        <div class="w-3/12">
          <strong class="title-01">&nbsp;</strong>
          <div class="flex justify-between my-3">
            <span class="text-sm text-primary-600">{{ $t('cost.amountUsed') }}</span>
            <span v-if="billDetailList.billAprvl" class="text-sm text-gray-700"
              >{{ totalList.pricingCurcyCd | unit }}{{ billDetailList.billAprvl.thisMonthUsagePrice }}</span
            >
          </div>
          <!-- 후불청구합산내역 -->
          <div v-if="billDetailList.billAprvl.pstYn == 'L'" class="flex justify-between my-3">
            <span class="text-sm text-primary-600" style="color: #fb5aa5 !important"
              >$t('cost.postpaidBillAmount')</span
            >
            <span v-if="billDetailList.billAprvl" class="text-sm text-gray-700"
              >{{ totalList.pricingCurcyCd | unit }}{{ billDetailList.billAprvl.pstBillAmt | number }}</span
            >
          </div>
          <div class="flex justify-between my-3">
            <span class="text-sm text-primary-600">{{ $t('cost.vatTen') }}</span>
            <span v-if="billDetailList.billAprvl" class="text-sm text-gray-700"
              >{{ totalList.pricingCurcyCd | unit }}{{ billDetailList.billAprvl.thisMonthVat }}</span
            >
          </div>
          <!-- 선납입금 -->
          <div v-if="billDetailList.billAprvl.dwnYn == 'Y'" class="flex justify-between my-3">
            <span class="text-sm text-primary-600" style="color: #fb5aa5 !important"
              >$t('cost.amountDeductedPrepayment')</span
            >
            <span v-if="billDetailList.billAprvl" class="text-sm text-gray-700"
              >-{{ totalList.pricingCurcyCd | unit }}{{ billDetailList.billAprvl.dwnBillAmt | number }}</span
            >
          </div>
          <!-- 후불청구 -->
          <div v-if="billDetailList.billAprvl.pstYn == 'Y'" class="flex justify-between my-3">
            <span v-if="$i18n.locale === 'ko'" class="text-sm text-primary-600" style="color: #fb5aa5 !important"
              >{{ billDetailList.billAprvl.pstBillYm.slice(0, 4) }}년
              {{ billDetailList.billAprvl.pstBillYm.slice(4, 6) }}월로 후불 청구</span
            >
            <span v-if="$i18n.locale === 'en'" class="text-sm text-primary-600" style="color: #fb5aa5 !important"
              >Post-billing for {{ billDetailList.billAprvl.pstBillYm.slice(4, 6) | toMonthEn }},
              {{ billDetailList.billAprvl.pstBillYm.slice(0, 4) }}</span
            >
            <span v-if="billDetailList.billAprvl" class="text-sm text-gray-700"
              >-{{ totalList.pricingCurcyCd | unit }}{{ billDetailList.billAprvl.pstBillAmt | number }}</span
            >
          </div>
        </div>
      </div>

      <div
        v-if="billDetailList.billAprvl.pstYn == 'Y' || billDetailList.billAprvl.pstYn == 'L'"
        style="float: right; text-align: right !important; border-top: 1px solid #e3ebf1 !important; width: 66.666667%"
      >
        <button class="button pst-button" @click="onHistoryPop">{{ $t('cost.viewPostpaidDetails') }}</button>
      </div>

      <template v-if="isDimmd">
        <div class="relative border-t" style="z-index: 10">
          <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
            <div class="mb-4 loading_rotate">
              <span class="loadingcolor"></span>
            </div>
            <div class="loading_txt">Loading...</div>
          </div>
        </div>
      </template>

      <div class="w-full">
        <div class="flex flex-col w-3\/12">
          <template v-if="totalList.discntCost < 0">
            <span class="mb-2 text-xl text-primary-400 my-7">{{ $t('cost.totalDiscountAmount') }}</span>
            <span class="text-4xl" style="font-size: 35px !important">
              -<span class="text-3xl">{{ totalList.pricingCurcyCd | unit }}</span
              >{{ Math.abs(totalList.discntCost).toLocaleString() }}
            </span>
          </template>
        </div>
        <div v-if="totalList.discntCost < 0" class="detail-wrap w-8\/12" :class="{ closed: !summaryDropdown }">
          <button class="btn-close" @click="summaryDropdown = false"><span>{{ $t('cost.collapse') }}</span></button>
          <button class="btn-open" @click="summaryDropdown = true"><span>{{ $t('cost.expand') }}</span></button>
          <div class="list">
            <strong class="title-01">{{ $t('cost.discountSummary') }}</strong>
            <div class="flex my-3">
              <span class="w-2/3 mr-4 text-sm"><strong>{{ $t('cost.productClassification') }}</strong></span>
              <span class="w-1/3 text-sm text-gray-700 tar"><strong>{{ $t('cost.amountUsedDiscount') }}</strong></span>
              <span class="w-1/3 text-sm text-gray-700 tar"><strong>{{ $t('cost.discountAmount') }}</strong></span>
            </div>
            <template v-for="(prdt, prdtKey) in prdtList">
              <div :key="`prdt-${prdtKey}`" class="flex my-3">
                <span class="w-2/3 mr-4 text-sm text-primary-600">{{ prdt.ctgry3Nm }}</span>
                <span class="w-1/3 text-sm text-gray-700 tar">{{ prdt.cspUnblendCost }}</span>
                <span class="w-1/3 text-sm text-gray-700 tar"
                  >-{{ prdt.pricingCurcyCd | unit }}{{ prdt.dscntCost.toLocaleString() }}</span
                >
              </div>
            </template>
            <div class="flex my-3">
              <span class="w-2/3 mr-4 text-sm text-primary-600"><strong>{{ $t('cost.total') }}</strong></span>
              <span class="w-1/3 text-sm text-gray-700 tar"
                ><strong
                  >{{ totalList.pricingCurcyCd | unit }}{{ totalList.unblendCost.toLocaleString() }}</strong
                ></span
              >
              <span class="w-1/3 text-sm text-gray-700 tar"
                ><strong
                  >-{{ totalList.pricingCurcyCd | unit }}{{ Math.abs(totalList.discntCost).toLocaleString() }}</strong
                ></span
              >
            </div>

            <!--          <strong class="title-01">계약약정 요약</strong>-->
            <!--          <div class="flex">-->
            <!--            <div class="w-1/2">-->
            <!--              <div class="flex my-3">-->
            <!--                <span class="w-1/3 text-sm text-primary-600">총 약정 기간</span>-->
            <!--                <span class="text-sm text-gray-700">2020.01.01 ~ 2022.12.31</span>-->
            <!--              </div>-->
            <!--              <div class="flex my-3">-->
            <!--                <span class="w-1/3 text-sm text-primary-600">사용액</span>-->
            <!--                <span class="text-sm text-gray-700">￦199,200,000(66.4%)</span>-->
            <!--              </div>-->
            <!--              <div class="flex my-3">-->
            <!--                <span class="w-1/3 text-sm text-primary-600">약정기간</span>-->
            <!--                <span class="text-sm text-gray-700">2021.01.01 ~ 2021.12.31</span>-->
            <!--              </div>-->
            <!--              <div class="flex my-3">-->
            <!--                <span class="w-1/3 text-sm text-primary-600">사용액</span>-->
            <!--                <span class="text-sm text-gray-700">￦99,200,000(99.2%)</span>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--            <div class="w-1/2">-->
            <!--              <div class="flex justify-between my-3">-->
            <!--                <span class="w-1/3 text-sm text-primary-600">약정 금액</span>-->
            <!--                <span class="text-sm text-gray-700">￦300,000,000</span>-->
            <!--              </div>-->
            <!--              <div class="flex justify-between my-3">-->
            <!--                <span class="w-1/3 text-sm text-primary-600">위약금</span>-->
            <!--                <span class="text-sm text-gray-700">￦0</span>-->
            <!--              </div>-->
            <!--              <div class="flex justify-between my-3">-->
            <!--                <span class="w-1/3 text-sm text-primary-600">약정금액</span>-->
            <!--                <span class="text-sm text-gray-700">￦100,000,000</span>-->
            <!--              </div>-->
            <!--              <div class="flex justify-between my-3">-->
            <!--                <span class="w-1/3 text-sm text-primary-600">위약금</span>-->
            <!--                <span class="text-sm text-gray-700">￦800,000</span>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--          </div>-->

            <!--          <div class="relative mt-18">-->
            <!--            <strong class="title-01">과금약정 요약</strong>-->
            <!--            <div class="pos-rt">-->
            <!--              <a href="#" class="btn-01">상세보기 +</a>-->
            <!--            </div>-->
            <!--          </div>-->
            <!--          <div class="flex">-->
            <!--            <div class="w-1/2">-->
            <!--              <div class="flex my-3">-->
            <!--                <span class="w-1/3 text-sm text-primary-600">상품영</span>-->
            <!--                <span class="text-sm text-gray-700">AWS CloudFront(Data Transfer)</span>-->
            <!--              </div>-->
            <!--              <div class="flex my-3">-->
            <!--                <span class="w-1/3 text-sm text-primary-600">사용량</span>-->
            <!--                <span class="text-sm text-gray-700">700,000 GB(70.0%)</span>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--            <div class="w-1/2">-->
            <!--              <div class="flex justify-between my-3">-->
            <!--                <span class="w-1/3 text-sm text-primary-600">약정조건</span>-->
            <!--                <span class="text-sm text-gray-700">1,000,000 GB(유효기간 내)</span>-->
            <!--              </div>-->
            <!--              <div class="flex justify-between my-3">-->
            <!--                <span class="w-1/3 text-sm text-primary-600">위약금</span>-->
            <!--                <span class="text-sm text-gray-700">￦239,480</span>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--          </div>-->
          </div>
        </div>
      </div>
    </div>
    <RadioGroup
      v-show="chrgYm.length > 0"
      ref="radioGroup"
      class="flex border-t border-b border-primary-200 tab-one border-bottom-none w-full mt5"
      :active-classes="['clicked']"
      @change="$console.log"
    >
      <button
        v-show="billFilter.allYn === 'Y'"
        class="w-1/5 py-5 text-gray-600 border-r bg-white"
        @click="setData('TOTAL')"
      >
        {{ $t('cost.all') }}
      </button>
      <button
        v-show="billFilter.prdtYn === 'Y'"
        class="w-1/5 py-5 text-gray-600 border-r bg-white"
        @click="setData('PRDT')"
      >
        {{ $t('cost.byProduct') }}
      </button>
      <button
        v-show="billFilter.acntYn === 'Y'"
        class="w-1/5 py-5 text-gray-600 border-r bg-white"
        @click="setData('ACNT')"
      >
        {{ $t('cost.byCloudAccount') }}
      </button>
      <button
        v-show="billFilter.resouceGroupYn === 'Y'"
        class="w-1/5 py-5 text-gray-600 border-r bg-white"
        @click="setData('RESOURCEGROUP')"
      >
        {{ $t('cost.byResourceGroup') }}
      </button>
      <button
        v-show="billFilter.cspPrdtYn === 'Y'"
        class="w-1/5 py-5 text-gray-600 border-r bg-white"
        @click="setData('SERVICE')"
      >
        {{ $t('cost.byService') }}
      </button>
      <button
        v-show="billFilter.regionYn === 'Y'"
        class="w-1/5 py-5 text-gray-600 border-r bg-white"
        @click="setData('REGION')"
      >
        {{ $t('cost.byRegion') }}
      </button>
      <button
        v-show="billFilter.tagYn === 'Y'"
        class="w-1/5 py-5 text-gray-600 border-r bg-white"
        @click="setTag('TAG')"
      >
        {{ $t('cost.byTag') }}
      </button>
      <button v-show="billFilter.svcGrpYn === 'Y'" class="w-1/5 py-5 text-gray-600 bg-white" @click="setTag('SVCGRP')">
        {{ $t('cost.byServiceGroup') }}
      </button>
    </RadioGroup>

    <!--  <div class="overflow-y-scroll max-h-856-"> -->
    <div>
      <!-- <div class="bg-gray-700 h-96"></div>
      <div class="bg-gray-500 h-96"></div>
      <div class="bg-gray-700 h-96"></div>
      <div class="bg-gray-500 h-96"></div>
      <div class="mb-4 bg-gray-700 h-96"></div> -->
      <div style="height: 100%" class="bl_none">
        <template v-if="loading !== false">
          <div class="example-wrapper" :style="`${type === 'TAG' ? 'height: 1000px' : ''}`">
            <ag-grid-vue
              id="billOverViewGrid"
              style="width: 100%; height: 100%"
              class="ag-theme-alpine"
              :grid-options="gridOptions"
              :row-data="rowData"
              :column-defs="columnDefs"
              :default-col-def="defaultColDef"
              :auto-group-column-def="autoGroupColumnDef"
              :dom-layout="`${type === 'TAG' ? 'fixedHeight' : 'autoHeight'}`"
              :tree-data="true"
              :animate-rows="true"
              :group-default-expanded="groupDefaultExpanded"
              :get-data-path="getDataPath"
              :modules="modules"
              :framework-components="frameworkComponents"
              :loading-overlay-component="loadingOverlayComponent"
              :loading-overlay-component-params="loadingOverlayComponentParams"
              :no-rows-overlay-component="noRowsOverlayComponent"
              :no-rows-overlay-component-params="noRowsOverlayComponentParams"
              :popup-parent="popupParent"
              :suppress-context-menu="true"
              @first-data-rendered="onFirstDataRendered"
              @grid-ready="onGridReady"
            ></ag-grid-vue>
          </div>
        </template>
        <template v-if="loading !== true && chrgYm.length > 0">
          <div class="relative border-t" style="height: 195px">
            <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
              <div class="mb-4 loading_rotate">
                <span class="loadingcolor"></span>
              </div>
              <div class="loading_txt">Loading...</div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-show="chrgYm.length === 0">
      <div class="flex flex-col items-center justify-center" style="height: 195px">
        <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
        <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
      </div>
    </div>
    <div ref="dimmed" class="dimmed" style="display: none"></div>
    <PstHistoryPop
      ref="deferredHistory"
      :visible="pstHistoryPopVisible"
      :bill-id="billInfo.billId"
      :ctrt-id="billDetailList.billAprvl.ctrtId"
      :bill-dt="billDetailList.billAprvl.chrgYm"
      :pst-bill-ym-last="billDetailList.billAprvl.pstBillYm"
      @closePopup="onCloseHistoryPop"
    ></PstHistoryPop>
  </Card>
</template>

<script>
import Card from '@/components/Card/Card.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import billService from '@/services/billService';
import RadioGroup from '@/components/RadioGroup.vue';
import APICaller, { APISetting, getZuulHost } from '@/library/APICaller';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import PstHistoryPop from '@/pages/Bill/cards/PstHistoryPop.vue';
import { i18n } from '../../../../public/locales/i18n';

export default {
  name: 'BillDetailGrid',
  components: { AgGridVue, Card, RadioGroup, PstHistoryPop },
  mixins: [AgGridMixin()],
  data() {
    return {
      gridOptions: null,
      gridApi: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      autoGroupColumnDef: null,
      groupDefaultExpanded: null,
      frameworkComponents: null,
      type: null,
      total: false,
      prdt: false,
      acnt: false,
      service: false,
      region: false,
      tag: false,
      tagId: '',
      svcCtgryId: '',
      billDetailList: {
        billAprvl: {},
      },
      billFilterList: {},
      overlayLoadingTemplate: null,
      loading: false,
      typeForExcel: 'TOTAL',
      summaryDropdown: true,
      prdtList: [],
      totalList: [],
      isDimmd: false,
      pstHistoryPopVisible: false,
      cspTypCd: 'AWS',
    };
  },
  computed: {
    ...mapState('bill', [
      'filter',
      'summary',
      'bill',
      'billInfo',
      'billFilter',
      'billDetail',
      'chrgYm',
      'billTag',
      'svcCtgryList',
    ]),
    ...mapGetters('bill', ['getBillInfo', 'billDetail']),
    billInfoWatch() {
      return this.getBillInfo;
    },
  },
  watch: {
    // 다국어 변경 시 차트를 재매핑
    '$i18n.locale': ['setColumn', 'setDataForMultiLang'],
    bill: function (newVal, oldVal) {
      if (newVal.length === 0) {
        this.setColumn();
        this.rowData = [];
        //this.billDetailList = [];
        this.loading = false;
      }
    },
    billInfo: function (newVal, oldVal) {
      //console.log("billInfo newVal", newVal)
      //console.log("billInfo oldVal", oldVal)

      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.fetchBillFilter({
          ctrtId: this.billInfo.ctrtId,
          billYm: this.billInfo.billYm,
          cspTypCd: this.billInfo.cspTypCd,
        });

        this.setData('TOTAL');
        this.setPrdtList(this.billInfo.cspTypCd);

        this.$refs.radioGroup.initialize();
        this.cspTypCd = this.billInfo.cspTypCd;
      }
      //console.log("billInfo", this.cspTypCd)
      if (this.cspTypCd === 'AWS') {
        this.fetchBillTag({ ctrtId: this.billInfo.ctrtId, billId: this.getBillInfo.billId });
      } else if (this.cspTypCd === 'AZURE') {
        this.fetchAzureBillTag({ ctrtId: this.billInfo.ctrtId, billYm: this.billInfo.billYm });
      }
    },
    // billDetail(newVal, oldVal) {
    //   this.loading = true;
    // },
  },
  filters: {
    unit(value) {
      return value === 'USD' ? '$' : '₩';
    },
    currency(value, type) {
      let num = Number(value);
      if (type === 'USD') {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
      } else {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
      }
    },
  },
  updated() {
    const tagList = document.getElementById('tagList');
    const svcGrpList = document.getElementById('svcGrpList');
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = this.$t('common.select.select');

    if (tagList) {
      document.getElementById('tagList').forEach((val, index) => {
        val.remove(index);
      });

      tagList.append(defaultOption);
      this.billTag.forEach((tag) => {
        const optionElement = document.createElement('option');
        optionElement.value = tag.tagKeyVal;
        optionElement.text = tag.tagKeyText;
        tagList.appendChild(optionElement);
      });
      tagList.addEventListener('change', (e) => {
        this.tagId = e.target.value;
        this.setData('TAG');
      });
      document.getElementById('tagList').forEach((val, index) => {
        if (val.value === this.tagId) {
          tagList.selectedIndex = index;
        }
      });
    }

    if (svcGrpList) {
      document.getElementById('svcGrpList').forEach((val, index) => {
        val.remove(index);
      });

      svcGrpList.append(defaultOption);
      this.svcCtgryList.forEach((tag) => {
        const optionElement = document.createElement('option');
        optionElement.value = tag.ctgryId;
        optionElement.text = tag.ctgryNm;
        svcGrpList.appendChild(optionElement);
      });
      svcGrpList.addEventListener('change', (e) => {
        this.svcCtgryId = e.target.value;
        this.setData('SVCGRP');
      });
      document.getElementById('svcGrpList').forEach((val, index) => {
        if (val.value === this.svcCtgryId) {
          svcGrpList.selectedIndex = index;
        }
      });
    }
  },
  beforeMount() {
    this.getBillDetail();
    this.gridOptions = {
      rowStyle: { background: 'white' },
    };
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {
    i18n() {
      return i18n;
    },
    ...mapActions('bill', ['fetchBillDetail', 'fetchBillFilter', 'fetchBillTag', 'fetchAzureBillTag']),
    setDataForMultiLang() {
      this.$refs.radioGroup.initialize();
      this.setData('TOTAL');
    },
    getDataPath: function (data) {
      return data.orgHierarchy;
    },
    getBillDetail() {
      //console.log("getBillDetail",this.billInfo);
      if (this.billInfo.ctrtId != '' && this.billInfo.billYm != '') {
        this.setData('TOTAL');
        this.setPrdtList(this.billInfo.cspTypCd);
      }
    },
    billDown() {
      const billId = this.billInfo.billId;
      const ctrtId = this.billInfo.ctrtId;
      const billYm = this.billInfo.billYm;
      const chrgYm = this.billInfo.chrgYm.replace('.', '');
      // 청구서 파일네임 작성
      const ctrtNm = this.billDetailList.ocpBillCtrtVo.ctrtNm;
      const fileName = `청구서_${ctrtNm}_${billYm.slice(0, 4)}년_${billYm.slice(4, 6)}월.html`;
      console.log(`${getZuulHost()}`);
      const downUrl = `${getZuulHost()}/cap/v1/bill/mail/${billId}/${ctrtId}/${billYm}/${chrgYm}`;
      //const downUrl = `http://127.0.0.1:8104/cap/v1/bill/mail/${billId}/${ctrtId}/${billYm}/${chrgYm}`;
      this.createDimmd();
      APICaller.download(downUrl, fileName)
        .then(() => {
          this.removeDimmed();
        })
        .catch(() => {
          this.removeDimmed();
        });
    },
    onGridReady(params) {
      this.gridApi = params.api;
    },
    setPrdtList(cspTypCd) {
      //console.log("setPrdtList",cspTypCd)
      /* 할인 요약 표출 - 상품별 */
      billService
        .fetchBillDetail({
          billId: this.billInfo.billId,
          ctrtId: this.billInfo.ctrtId,
          billYm: this.billInfo.billYm,
          tabType: 'PRDT',
          chrgYm: this.billInfo.chrgYm.replaceAll('.', ''),
          cspTypCd: cspTypCd,
        })
        .then((res) => {
          const fetchData = res.data.data;
          /* 청구 조정액 있는 경우 할인금액에서 제외 */
          const data = [...fetchData];
          data.forEach((prdt) => {
            let num;
            if (prdt.adjList !== undefined) {
              num = this.toNumber(prdt.dscntCost) + prdt.adjList[0].adjBillAmt;
            } else {
              num = this.toNumber(prdt.dscntCost);
            }
            prdt.dscntCost = num;
          });
          this.prdtList = data;
        });
    },
    setData(type) {
      this.typeForExcel = type;
      this.loading = false;
      let tempData = [];

      billService
        .fetchBillDetail({
          billId: this.billInfo.billId,
          ctrtId: this.billInfo.ctrtId,
          billYm: this.billInfo.billYm,
          tabType: type,
          chrgYm: this.billInfo.chrgYm.replaceAll('.', ''),
          tagId: this.tagId,
          svcCtgryId: this.svcCtgryId,
          cspTypCd: this.cspTypCd,
        })
        .then((res) => {
          const fetchData = res.data.data;
          if (fetchData.length !== 0) {
            this.billDetailList = fetchData[0];
          }
          if (type === 'TOTAL') {
            this.totalTab(fetchData, tempData);
            this.totalList = fetchData[0];
            this.total = true;
          } else if (type === 'PRDT') {
            this.productTab(fetchData, tempData);
            this.prdt = true;
            this.autoGroupColumnDef.headerName = this.$t('cost.productClassification');
          } else if (type === 'ACNT') {
            this.acntTab(fetchData, tempData);
            this.acnt = true;
            this.autoGroupColumnDef.headerName = this.$t('cost.cloudAccountClassification');
          } else if (type === 'RESOURCEGROUP') {
            this.resourceGroupTab(fetchData, tempData);
            this.resourceGroup = true;
            this.autoGroupColumnDef.headerName = this.$t('cost.byResourceGroup');
          } else if (type === 'SERVICE') {
            this.serviceTab(fetchData, tempData);
            this.service = true;
            this.autoGroupColumnDef.headerName = this.$t('cost.serviceClassification');
          } else if (type === 'REGION') {
            this.regionTab(fetchData, tempData);
            this.region = true;
            this.autoGroupColumnDef.headerName = this.$t('cost.regionClassification');
          } else if (type === 'TAG') {
            this.tagTab(fetchData, tempData);
            this.autoGroupColumnDef.headerName = this.$t('cost.tagKey');
          } else if (type === 'SVCGRP') {
            this.svcGrpTab(fetchData, tempData);
            this.autoGroupColumnDef.headerName = this.$t('cost.serviceCategory');
          } else if (type === 'FIRST') {
            return;
          }
          this.type = type;
          this.loading = true;
        })
        .catch(() => {
          this.loading = true;
        });
      // this.fetchBillDetail({
      //   ctrtId: this.billInfo.ctrtId,
      //   billYm: this.billInfo.billYm,
      //   tabType: type,
      //   chrgYm: this.billInfo.chrgYm.replaceAll('.', ''),
      //   tagId: this.tagId,
      // });
      /// 공통
      this.setColumn(type);
      this.rowData = tempData;
      // if (type === 'TAG') {
      //   this.groupDefaultExpanded = false;
      // } else {
      this.groupDefaultExpanded = -1;
      // }
    },

    setTag(type) {
      this.tag = true;
      if (this.billTag.length > 0) {
        this.tagId = this.billTag[0].tagKeyVal;
      }
      if (this.svcCtgryList.length > 0) {
        this.svcCtgryId = this.svcCtgryList[0].ctgryId;
      }
      this.setData(type);
    },
    totalTab(fetchData, tempData) {
      fetchData.forEach((fetchDataList) => {
        tempData.push({
          orgHierarchy: [fetchDataList.ctgry1Nm],
          cspUnblendCostCol: fetchDataList.cspUnblendCost,
          dscntCostCol: fetchDataList.dscntCost,
          cspBlendCostCol: fetchDataList.cspBlendCost,
        });

        fetchDataList.lv2List.forEach((lv2ListData) => {
          tempData.push({
            orgHierarchy: [lv2ListData.ctgry1Nm, lv2ListData.ctgry2Nm],
            cspUnblendCostCol: lv2ListData.cspUnblendCost,
            dscntCostCol: lv2ListData.dscntCost,
            cspBlendCostCol: lv2ListData.cspBlendCost,
          });
          lv2ListData.lv3List.forEach((lv3ListData) => {
            tempData.push({
              orgHierarchy: [lv3ListData.ctgry1Nm, lv3ListData.ctgry2Nm, lv3ListData.ctgry3Nm],
              cspUnblendCostCol: lv3ListData.cspUnblendCost,
              dscntCostCol: lv3ListData.dscntCost,
              cspBlendCostCol: lv3ListData.cspBlendCost,
            });

            //////////// NEXT, ADJ, ACNT /////////////

            // -- nextList map -- //
            if (lv3ListData.nextList !== undefined) {
              lv3ListData.nextList.forEach((nextListData) => {
                tempData.push({
                  orgHierarchy: [
                    nextListData.ctgry1Nm,
                    nextListData.ctgry2Nm,
                    nextListData.ctgry3Nm,
                    `이월 청구액 (${nextListData.adjResnDesc.split('|')[1]})`,
                  ],
                  cspUnblendCostCol: '-',
                  dscntCostCol: '-',
                  cspBlendCostCol:
                    nextListData.pricingCurcyCd === 'KRW'
                      ? '₩' + nextListData.adjBillAmt.toLocaleString()
                      : '$' + nextListData.adjBillAmt.toLocaleString(),
                });
                // 이월 청구액 ++ map
              });
            }
            // -- nextList map End-- //

            // -- adjList map -- //
            if (lv3ListData.adjList !== undefined) {
              lv3ListData.adjList.forEach((adListData) => {
                tempData.push({
                  orgHierarchy: [
                    adListData.ctgry1Nm,
                    adListData.ctgry2Nm,
                    adListData.ctgry3Nm,
                    `청구 조정액 (${adListData.adjResnDesc.split('|')[1]})`,
                  ],
                  cspUnblendCostCol: '-',
                  dscntCostCol: '-',
                  cspBlendCostCol:
                    adListData.pricingCurcyCd === 'KRW'
                      ? '₩' + adListData.adjBillAmt.toLocaleString()
                      : '$' + adListData.adjBillAmt.toLocaleString(),
                });
                // 청구 조정액 ++ map
              });
            }
            // adjList map End -- //

            // -- acntList map  -- //
            if (lv3ListData.acntList !== undefined) {
              lv3ListData.acntList.forEach((acntListData) => {
                tempData.push({
                  orgHierarchy: [
                    acntListData.ctgry1Nm,
                    acntListData.ctgry2Nm,
                    acntListData.ctgry3Nm,
                    acntListData.acntId,
                  ],
                  cspUnblendCostCol: acntListData.cspUnblendCost,
                  dscntCostCol: acntListData.dscntCost,
                  cspBlendCostCol: acntListData.cspBlendCost,
                  pricingNm: acntListData.pricingNm,
                  pricingDscnt: acntListData.pricingDscnt,
                });
                if (acntListData.cspItemList !== undefined) {
                  acntListData.cspItemList.forEach((data) => {
                    tempData.push({
                      orgHierarchy: [data.ctgry1Nm, data.ctgry2Nm, data.ctgry3Nm, data.acntId, data.cspPrdtNm],
                      cspUnblendCostCol: data.cspUnblendCost,
                      dscntCostCol: data.dscntCost,
                      cspBlendCostCol: data.cspBlendCost,
                    });
                  });
                }
              });
            }
            // -- acntList map End -- //
          });
        });
      });
    },
    productTab(fetchData, tempData) {
      fetchData.forEach((lv3ListData) => {
        tempData.push({
          orgHierarchy: [lv3ListData.ctgry3Nm],
          cspUnblendCostCol: lv3ListData.cspUnblendCost,
          dscntCostCol: lv3ListData.dscntCost,
          cspBlendCostCol: lv3ListData.cspBlendCost,
        });

        ////////////ACNT , NEXT ,ADJ /////////////

        // -- nextList map -- //
        if (lv3ListData.nextList !== undefined) {
          lv3ListData.nextList.forEach((nextListData) => {
            tempData.push({
              orgHierarchy: [nextListData.ctgry3Nm, `이월 청구액 (${nextListData.adjResnDesc.split('|')[1]})`],
              cspUnblendCostCol: '-',
              dscntCostCol: '-',
              cspBlendCostCol:
                nextListData.pricingCurcyCd === 'KRW'
                  ? '₩' + nextListData.adjBillAmt.toLocaleString()
                  : '$' + nextListData.adjBillAmt.toLocaleString(),
            });
            // 이월 청구액 ++ map
          });
        }
        // -- nextList map End-- //

        // -- adjList map -- //
        if (lv3ListData.adjList !== undefined) {
          lv3ListData.adjList.forEach((adListData) => {
            tempData.push({
              orgHierarchy: [adListData.ctgry3Nm, `청구 조정액 (${adListData.adjResnDesc.split('|')[1]})`],
              cspUnblendCostCol: '-',
              dscntCostCol: '-',
              cspBlendCostCol:
                adListData.pricingCurcyCd === 'KRW'
                  ? '₩' + adListData.adjBillAmt.toLocaleString()
                  : '$' + adListData.adjBillAmt.toLocaleString(),
            });
            // 청구 조정액 ++ map
          });
        }
        // adjList map End -- //

        // -- acntList map  -- //
        if (lv3ListData.acntList !== undefined) {
          lv3ListData.acntList.forEach((acntListData) => {
            tempData.push({
              orgHierarchy: [acntListData.ctgry3Nm, acntListData.acntId],
              cspUnblendCostCol: acntListData.cspUnblendCost,
              dscntCostCol: acntListData.dscntCost,
              cspBlendCostCol: acntListData.cspBlendCost,
              pricingNm: acntListData.pricingNm,
              pricingDscnt: acntListData.pricingDscnt,
            });
            if (acntListData.cspItemList !== undefined) {
              acntListData.cspItemList.forEach((data) => {
                tempData.push({
                  orgHierarchy: [data.ctgry3Nm, data.acntId, data.cspPrdtNm],
                  cspUnblendCostCol: data.cspUnblendCost,
                  dscntCostCol: data.dscntCost,
                  cspBlendCostCol: data.cspBlendCost,
                });
              });
            }
          });
        }
        // -- acntList map End -- //
      });
    },
    acntTab(fetchData, tempData) {
      fetchData.forEach((lv3ListData) => {
        tempData.push({
          orgHierarchy: [lv3ListData.cspTypCd],
          cspUnblendCostCol: lv3ListData.cspUnblendCost,
          dscntCostCol: lv3ListData.dscntCost,
          cspBlendCostCol: lv3ListData.cspBlendCost,
        });

        //////////// NEXT, ADJ, ACNT /////////////

        // -- nextList map -- //
        if (lv3ListData.nextList !== undefined) {
          lv3ListData.nextList.forEach((nextListData) => {
            tempData.push({
              orgHierarchy: [
                nextListData.ctgry1Nm,
                nextListData.ctgry2Nm,
                nextListData.ctgry3Nm,
                `이월 청구액 (${nextListData.adjResnDesc.split('|')[1]})`,
              ],
              cspUnblendCostCol: '-',
              dscntCostCol: '-',
              cspBlendCostCol:
                nextListData.pricingCurcyCd === 'KRW'
                  ? '₩' + nextListData.adjBillAmt.toLocaleString()
                  : '$' + nextListData.adjBillAmt.toLocaleString(),
            });
            // 이월 청구액 ++ map
          });
        }
        // -- nextList map End-- //

        // -- adjList map -- //
        if (lv3ListData.adjList !== undefined) {
          lv3ListData.adjList.forEach((adListData) => {
            tempData.push({
              orgHierarchy: [
                adListData.ctgry1Nm,
                adListData.ctgry2Nm,
                adListData.ctgry3Nm,
                `청구 조정액 (${adListData.adjResnDesc.split('|')[1]})`,
              ],
              cspUnblendCostCol: '-',
              dscntCostCol: '-',
              cspBlendCostCol:
                adListData.pricingCurcyCd === 'KRW'
                  ? '₩' + adListData.adjBillAmt.toLocaleString()
                  : '$' + adListData.adjBillAmt.toLocaleString(),
            });
            // 청구 조정액 ++ map
          });
        }
        // adjList map End -- //

        // -- acntList map  -- //
        if (lv3ListData.acntList !== undefined) {
          lv3ListData.acntList.forEach((acntListData) => {
            tempData.push({
              orgHierarchy: [acntListData.cspTypCd, acntListData.acntId],
              cspUnblendCostCol: acntListData.cspUnblendCost,
              dscntCostCol: acntListData.dscntCost,
              cspBlendCostCol: acntListData.cspBlendCost,
            });
            if (acntListData.cspItemList !== undefined) {
              acntListData.cspItemList.forEach((data) => {
                tempData.push({
                  orgHierarchy: [data.cspTypCd, data.acntId, data.cspPrdtNm],
                  cspUnblendCostCol: data.cspUnblendCost,
                  dscntCostCol: data.dscntCost,
                  cspBlendCostCol: data.cspBlendCost,
                });
              });
            }
          });
        }
        // -- acntList map End -- //
      });
    },
    resourceGroupTab(fetchData, tempData) {
      fetchData.forEach((lv1ListData) => {
        tempData.push({
          orgHierarchy: [lv1ListData.ctgry1Nm],
          cspUnblendCostCol: lv1ListData.cspUnblendCost,
          dscntCostCol: lv1ListData.dscntCost,
          cspBlendCostCol: lv1ListData.cspBlendCost,
        });

        // -- acntList map  -- //
        if (lv1ListData.acntList !== undefined) {
          lv1ListData.acntList.forEach((acntListData) => {
            tempData.push({
              orgHierarchy: [lv1ListData.ctgry1Nm, acntListData.acntNm],
              cspUnblendCostCol: acntListData.cspUnblendCost,
              dscntCostCol: acntListData.dscntCost,
              cspBlendCostCol: acntListData.cspBlendCost,
            });

            if (acntListData.cspItemList !== undefined) {
              acntListData.cspItemList.forEach((cspItemData) => {
                tempData.push({
                  orgHierarchy: [lv1ListData.ctgry1Nm, acntListData.acntNm, cspItemData.cspPrdtNm],
                  cspUnblendCostCol: cspItemData.cspUnblendCost,
                  dscntCostCol: cspItemData.dscntCost,
                  cspBlendCostCol: cspItemData.cspBlendCost,
                });
              });
            }
          });
        }
        // -- acntList map End -- //
      });
    },
    serviceTab(fetchData, tempData) {
      fetchData.forEach((dataList) => {
        tempData.push({
          orgHierarchy: [dataList.cspPrdtNm],
          cspUnblendCostCol: dataList.cspUnblendCost,
          dscntCostCol: dataList.dscntCost,
          cspBlendCostCol: dataList.cspBlendCost,
        });
      });
    },
    regionTab(fetchData, tempData) {
      if (fetchData[0].regionSepCd !== undefined) {
        fetchData.forEach((dataList) => {
          tempData.push({
            orgHierarchy: [dataList.regionSepCd],
            cspUnblendCostCol: dataList.cspUnblendCost,
            dscntCostCol: dataList.dscntCost,
            cspBlendCostCol: dataList.cspBlendCost,
          });
        });
      }
    },
    svcGrpTab(fetchData, tempData) {
      fetchData.forEach((lv1ListData) => {
        if (i18n.locale === 'en' && lv1ListData.svcGrpNm === '소계') {
          lv1ListData.svcGrpNm = 'Subtotal';
        }
        tempData.push({
          orgHierarchy: [lv1ListData.svcGrpNm],
          cspUnblendCostCol: lv1ListData.cspUnblendCost,
          dscntCostCol: lv1ListData.dscntCost,
          cspBlendCostCol: lv1ListData.cspBlendCost,
        });

        // -- acntList map  -- //
        if (lv1ListData.acntList !== undefined) {
          lv1ListData.acntList.forEach((acntListData) => {
            tempData.push({
              orgHierarchy: [lv1ListData.svcGrpNm, acntListData.acntId],
              cspUnblendCostCol: acntListData.cspUnblendCost,
              dscntCostCol: acntListData.dscntCost,
              cspBlendCostCol: acntListData.cspBlendCost,
            });

            if (acntListData.cspItemList !== undefined) {
              acntListData.cspItemList.forEach((cspItemData) => {
                tempData.push({
                  orgHierarchy: [lv1ListData.svcGrpNm, acntListData.acntId, cspItemData.cspPrdtNm],
                  cspUnblendCostCol: cspItemData.cspUnblendCost,
                  dscntCostCol: cspItemData.dscntCost,
                  cspBlendCostCol: cspItemData.cspBlendCost,
                });
              });
            }
          });
        }
        // -- acntList map End -- //
      });
    },
    tagTab(fetchData, tempData) {
      fetchData.map((lv1ListData) => {
        if (i18n.locale === 'en' && lv1ListData.ctgry1Nm === '소계') {
          lv1ListData.ctgry1Nm = 'Subtotal';
        }
        tempData.push({
          orgHierarchy: [lv1ListData.ctgry1Nm],
          cspUnblendCostCol: lv1ListData.cspUnblendCost,
          dscntCostCol: lv1ListData.dscntCost,
          cspBlendCostCol: lv1ListData.cspBlendCost,
        });

        // -- acntList map  -- //
        if (lv1ListData.acntList !== undefined) {
          lv1ListData.acntList.forEach((acntListData) => {
            tempData.push({
              orgHierarchy: [lv1ListData.ctgry1Nm, acntListData.acntNm],
              cspUnblendCostCol: acntListData.cspUnblendCost,
              dscntCostCol: acntListData.dscntCost,
              cspBlendCostCol: acntListData.cspBlendCost,
            });

            if (acntListData.cspItemList !== undefined) {
              acntListData.cspItemList.forEach((cspItemData) => {
                tempData.push({
                  orgHierarchy: [lv1ListData.ctgry1Nm, acntListData.acntNm, cspItemData.cspPrdtNm],
                  cspUnblendCostCol: cspItemData.cspUnblendCost,
                  dscntCostCol: cspItemData.dscntCost,
                  cspBlendCostCol: cspItemData.cspBlendCost,
                });
              });
            }
          });
        }
        // -- acntList map End -- //
      });
    },
    gridExpandAll() {
      this.gridApi.expandAll();
    },
    detailExcelDownload() {
      const ctrtNm = this.billDetailList.ocpBillCtrtVo.ctrtNm;
      const billYm = this.billInfo.billYm;
      const ctrtId = this.billInfo.ctrtId;
      const chrgYm = this.billInfo.chrgYm;
      const cspTypCd = this.cspTypCd;

      const fileNm = `청구서_${ctrtNm}_${billYm.slice(0, 4)}년_${billYm.slice(4, 6)}월_세부내역`;

      const data = { ctrtId, billYm, chrgYm, ctrtNm, cspTypCd };
      this.createDimmd();
      APICaller.postDownloadBlob(
        //bill/billmng/export
        `${getZuulHost()}/cap/v1/bill/billmng/export`,
        fileNm,
        data
      )
        .then(() => {
          this.removeDimmed();
        })
        .catch(() => {
          this.removeDimmed();
        });
    },
    excelDownload() {
      const ctrtNm = this.billDetailList.ocpBillCtrtVo.ctrtNm;
      const billYm = this.billInfo.billYm;

      const fileNm = `청구서_${ctrtNm}_${billYm.slice(0, 4)}년_${billYm.slice(4, 6)}월_내역`;
      this.createDimmd();
      APICaller.downloadBlob(
        `${getZuulHost()}/cap/v1/ocp/bill/billDetail/export?ctrtId=${this.billInfo.ctrtId}&billYm=${
          this.billInfo.billYm
        }&tabType=${this.typeForExcel}&chrgYm=${this.billInfo.chrgYm.replaceAll('.', '')}&sheetNm=${fileNm}`,
        fileNm
      )
        .then(() => {
          this.removeDimmed();
        })
        .catch(() => {
          this.removeDimmed();
        });
    },
    setColumn(type) {
      this.columnDefs = [
        {
          field: 'cspUnblendCostCol',
          headerName: this.$t('cost.amountUsedDiscount'),
          resizable: true,
          width: i18n.locale === 'ko' ? 140 : 240,
          menuTabs: [],
          cellClass: ['ag-grid-font', 'text-right'],
          type: 'rightAligned',
        },
        {
          field: 'dscntCostCol',
          headerName: this.$t('cost.discountAmount'),
          resizable: true,
          cellStyle: { color: '#00a5ed' },
          menuTabs: [],
          cellClass: ['ag-grid-color-font', 'text-right'],
          type: 'rightAligned',
        },
        {
          field: 'cspBlendCostCol',
          headerName: this.$t('cost.amountUsed'),
          resizable: false,
          menuTabs: [],
          cellClass: ['ag-grid-font', 'text-right', 'pr-28'],
          type: 'rightAligned',
          headerComponentParams: {
            template:
              '<div style="padding-right:10px;" class="ag-cell-label-container" role="presentation">' +
              '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
              '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
              '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
              '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
              '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
              '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
              '    <span ref="eText" class="ag-header-cell-text role="columnheader"></span>' +
              '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
              '  </div>' +
              '</div>',
          },
        },
      ];

      /*if (type === 'TOTAL' || type === 'PRDT') {
        this.columnDefs.unshift(
          {
            field: 'pricingNm',
            headerName: '과금 항목',
            resizable: true,
            width: '240%',
            menuTabs: [],
            cellClass: ['ag-grid-font', 'text-left'],
          },
          {
            field: 'pricingDscnt',
            headerName: '할인율(%)',
            resizable: true,
            width: '90%',
            menuTabs: [],
            cellClass: ['ag-grid-font', 'text-right'],
            type: 'rightAligned',
            cellRenderer: function (params) {
              if (params.value) {
                const discount = parseFloat(params.value) * 100;
                return discount.toFixed(2) + '%';
              } else {
                return '';
              }
            },
          }
        );
      }*/

      this.defaultColDef = { flex: -1 };
      this.autoGroupColumnDef = {
        headerName: this.$t('cost.byResourceGroup'),
        resizable: true,
        minWidth: 600,
        suppressSizeToFit: true,
        cellRendererParams: { suppressCount: true },
        cellClass: ['ag-grid-font', 'text-right', type === 'SERVICE' || type === 'REGION' ? 'pl-0' : 'pl-27'],
        menuTabs: [],
        headerComponentParams: {
          template:
            '<div style="padding-left:10px;" class="ag-cell-label-container" role="presentation">' +
            '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
            '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
            '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
            '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
            '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
            '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
            '    <span ref="eText" class="ag-header-cell-text role="columnheader"></span>' +
            '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
            `${
              type === 'TAG' ? '<select id="tagList" style="margin: 0 0 0 34px;height: 71%;width: 24%;"></select>' : ''
            }` +
            `${
              type === 'SVCGRP'
                ? '<select id="svcGrpList" style="margin: 0 0 0 34px;height: 71%;width: 24%;"></select>'
                : ''
            }` +
            '  </div>' +
            '</div>',
        },
      };
      if (type === 'PRDT') {
        this.autoGroupColumnDef.headerName = this.$t('cost.productClassification');
      } else if (type === 'ACNT') {
        this.autoGroupColumnDef.headerName = this.$t('cost.cloudAccountClassification');
      } else if (type === 'SERVICE') {
        this.autoGroupColumnDef.headerName = this.$t('cost.serviceClassification');
      } else if (type === 'REGION') {
        this.autoGroupColumnDef.headerName = this.$t('cost.regionClassification');
      } else if (type === 'TAG') {
        this.autoGroupColumnDef.headerName = this.$t('cost.tagKey');
      } else if (type === 'SVCGRP') {
        this.autoGroupColumnDef.headerName = this.$t('cost.serviceCategory');
      }
    },
    // changeMoney(money) {
    //   let word = '';
    //   if (money.indexOf('$') !== -1 && money.indexOf('-') !== -1) {
    //     word = money.substr(2);
    //     return `-$${Number(word).toFixed(2).toLocaleString()}`;
    //   } else if (money.indexOf('$') !== -1 && money.indexOf('-') === -1) {
    //     word = money.substr(1);
    //     return `$${Number(word).toFixed(2).toLocaleString()}`;
    //   }
    // },
    toNumber(value) {
      return Number(value.replace(/[-₩,]/g, ''));
    },
    createDimmd() {
      this.$refs.dimmed.style.display = 'block';
      this.isDimmd = true;
    },
    removeDimmed() {
      this.$refs.dimmed.style.display = 'none';
      this.isDimmd = false;
    },
    onHistoryPop() {
      this.$refs.deferredHistory.pstHistoryList();
      this.pstHistoryPopVisible = !this.pstHistoryPopVisible;
    },
    onCloseHistoryPop() {
      this.pstHistoryPopVisible = !this.pstHistoryPopVisible;
    },
  },
};
</script>

<style scoped>
.dimmed {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
  opacity: 0.5;
  background-color: rgb(37 35 35);
}
.pst-button {
  color: #01a5ed !important;
  height: 28px;
  font-size: 12px;
  border: 1px solid #01a5ed !important;
  border-radius: 15px;
  font-weight: 400 !important;
  padding: 0 10px;
  line-height: 1;
  margin-top: 10px;
}
.mt20 {
  margin: 20px 0 0 0 !important;
}
</style>
