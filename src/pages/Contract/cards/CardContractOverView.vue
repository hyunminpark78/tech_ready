<template>
  <div class="bg-white border rounded-lg border-primary-200 dashboard-card">
    <div class="p-8">
      <div class="flex items-center justify-between mb-7">
        <span class="text-2xl font-bold">{{ ctrtNm }}</span>
      </div>

      <div class="flex">
        <div class="flex flex-col w-4/12">
          <span class="mb-2 text-xl text-primary-400">{{ $t('cost.contractAmount') }}</span>
          <span class="text-4xl"><span class="text-3xl">￦</span>{{ ctrtTotAmt }}</span>
        </div>

        <div class="w-3/12">
          <div class="flex my-3">
            <span class="w-4/12 text-sm text-primary-600">{{ $t('cost.term') }}</span>
            <span class="text-sm text-gray-700">{{ ctrtStrDt }}~{{ ctrtEndDt }}</span>
          </div>
          <div class="flex my-3">
            <span class="w-4/12 text-sm text-primary-600">{{ $t('cost.billingStartDate') }}</span>
            <span class="text-sm text-gray-700">{{ pricingStrDt }}</span>
          </div>
        </div>

        <div class="w-5/12">
          <div class="flex my-3">
            <span class="w-3/12 text-sm text-primary-600">{{ $t('cost.contactInformation') }}</span>
            <div class="flex flex-1 text-sm">
              <span class="w-5/12">{{ mmngUserNm }}</span>
              <span class="w-7/12">{{ mmngUserMail }}</span>
            </div>
          </div>
          <!-- <div v-if="!equalData" class="flex my-3">
            <span class="w-3/12 text-sm text-primary-600">&nbsp;</span>
            <div class="flex w-9/12 text-sm">
              <span class="w-5/12 font-bold">{{ smngUserNm }}</span>
              <span class="w-7/12">{{ smngUserMail }}</span>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <RadioGroup
      ref="radioGroup"
      class="flex border-t border-b border-primary-200 tab-one border-bottom-none"
      :active-classes="['clicked']"
      @change="$console.log"
    >
      <button class="w-1/5 py-5 text-gray-600 bg-white clicked" @click="setData('TOTAL')">{{ $t('cost.all') }}</button>
      <button class="w-1/5 py-5 border-r text-gray-600 bg-white" @click="setData('PRDT')">
        {{ $t('cost.byProduct') }}
      </button>
    </RadioGroup>

    <CommitmentPopup
      v-if="pricingCommitmentPopupVisible"
      :visible="pricingCommitmentPopupVisible"
      :selected-data="popupTargetParams"
      @close="pricingCommitmentPopupClose"
    />
    <!-- <div class="overflow-y-scroll rounded-bl-lg rounded-br-lg max-h-856-"> -->
    <div class="rounded-bl-lg rounded-br-lg">
      <!-- <div class="grid h-32 text-white bg-gray-700 place-content-center">grid</div>
          <div class="grid h-32 text-white bg-gray-500 place-content-center">grid</div>
          <div class="grid h-32 text-white bg-gray-700 place-content-center">grid</div>
          <div class="grid h-32 text-white bg-gray-500 place-content-center">grid</div>
          <div class="grid h-32 text-white bg-gray-700 place-content-center">grid</div>
          <div class="grid h-32 text-white bg-gray-500 place-content-center">grid</div>
          <div class="grid h-32 text-white bg-gray-700 place-content-center">grid</div>
          <div class="grid h-32 text-white bg-gray-500 place-content-center">grid</div>
          <div class="grid h-32 text-white bg-gray-700 place-content-center">grid</div>
          <div class="grid h-32 text-white bg-gray-500 place-content-center">grid</div>
          <div class="grid h-32 text-white bg-gray-700 place-content-center">grid</div>
          <div class="grid h-32 text-white bg-gray-500 place-content-center">grid</div> -->
      <div style="height: 100%" class="bl_none">
        <div class="example-wrapper">
          <ag-grid-vue
            id="contractOverviewGrid"
            style="width: 100%; height: 100%"
            :dom-layout="domLayout"
            class="ag-theme-alpine"
            :grid-options="gridOptions"
            :row-data="rowData"
            :column-defs="columnDefs"
            :default-col-def="defaultColDef"
            :auto-group-column-def="autoGroupColumnDef"
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
            :suppress-context-menu="true"
            :popup-parent="popupParent"
            @grid-ready="onGridReady"
          ></ag-grid-vue>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import { AgGridVue } from 'ag-grid-vue';
import RadioGroup from '@/components/RadioGroup.vue';
import CommitmentPopup from '@/pages/Contract/cards/CommitmentPopup.vue';
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';

export default {
  name: 'CardContractOverView',
  components: { AgGridVue, RadioGroup, CommitmentPopup },
  mixins: [AgGridMixin()],
  data() {
    return {
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      autoGroupColumnDef: null,
      groupDefaultExpanded: null,
      type: null,
      //계약정보
      ctrtNm: '',
      ctrtTotAmt: '',
      smngUserNm: '',
      mmngUserNm: '',
      smngUserMail: '',
      mmngUserMail: '',
      ctrtStrDt: '',
      ctrtEndDt: '',
      pricingStrDt: '',
      pricingCommitmentPopupVisible: false,
      popupTargetParams: {},
    };
  },
  computed: {
    ...mapState('contract', ['list', 'detail', 'ctrtId']),
    equalData() {
      return this.mmngUserNm === this.smngUserNm;
    },
  },
  watch: {
    list: function (newVal, oldVal) {
      this.setDetailData(newVal, 0);
      this.fetchCtrtId({ ctrtId: newVal[0].ctrtId });
      this.setData('TOTAL');
    },
    detail(newVal) {
      const listIdx = this.list.findIndex((selectDetail) => selectDetail.ctrtId === this.ctrtId);
      this.setData('TOTAL');
      this.setDetailData(this.list, listIdx);
      this.$refs.radioGroup.setActiveIndex(0);
    },
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
    };
  },
  created() {
    /* this.setData('TOTAL'); */
  },
  methods: {
    ...mapActions('contract', ['fetchCtrtId']),
    getDataPath: function (data) {
      return data.orgHierarchy;
    },
    setDetailData(detailData, ctrtId) {
      if (detailData.length > 0) {
        let ctrtData = detailData[ctrtId];
        if (ctrtData) {
          this.ctrtNm = ctrtData.ctrtNm;
          this.ctrtTotAmt = ctrtData.ctrtTotAmt ? numberWithCommas(ctrtData.ctrtTotAmt.replace('₩', '')) : 0
          this.smngUserNm = ctrtData.smngUserNm;
          this.mmngUserNm = ctrtData.mmngUserNm;
          this.mmngUserMail = ctrtData.mmngUserMail;
          this.smngUserMail = ctrtData.smngUserMail;
          this.ctrtStrDt = moment(ctrtData.ctrtStrDt).format('YYYY.MM.DD');
          this.ctrtEndDt = moment(ctrtData.ctrtEndDt).format('YYYY.MM.DD');
          this.pricingStrDt = moment(ctrtData.pricingStrDt).format('YYYY.MM.DD');
        }
      }
    },
    onGridReady(params) {
      const allColumnIds = [];
      this.gridOptions.columnApi.getColumns().forEach((column) => {
        allColumnIds.push(column.getId());
      });

      this.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
    },
    openCommitmentPop(params) {
      const value = params.value;
      if (value === undefined || value === '') return;
      this.popupTargetParams = {
        ctrtVerVal: value.ctrtVerVal,
        prdtId: value.prdtId,
        pricingId: value.pricingId,
      };
      this.pricingCommitmentPopupVisible = true;
    },
    pricingCommitmentPopupClose() {
      this.pricingCommitmentPopupVisible = false;
    },
    cmmtTerm(value) {
      if (value === 'YR') return '(년간)';
      else if (value === 'MTH') return '(월간)';
      else if (value === 'INVALI') return '(유효기간 내)';
      else return '';
    },
    setData(type) {
      this.setColumn(type);
      let tempData = [];
      const fetchData = this.detail;
      if (type === 'TOTAL') {
        this.totalTab(fetchData, tempData);
        this.total = true;
      } else if (type === 'PRDT') {
        this.prdtTab(fetchData, tempData);
        this.prdt = true;
      }
      this.rowData = tempData;
      this.groupDefaultExpanded = -1;
    },
    setColumn(type) {
      this.columnDefs = [
        {
          field: 'pricingUnitAmt',
          headerName: this.$t('cost.contractAmount'),
          resizable: true,
          minWidth: 300,
          menuTabs: [],
          cellClass: ['ag-grid-color-font', 'text-right'],
          type: 'rightAligned',
        },
        {
          field: 'pricingUnitCntQtyVal',
          headerName: this.$t('cost.quantity'),
          resizable: true,
          menuTabs: [],
          headerComponentParams: {
            template: this.template,
          },
          cellClass: ['ag-grid-color-font', 'text-center'],
        },
        {
          field: 'pricingUnitDscntRatio',
          headerName: this.$t('cost.discountRate'),
          resizable: true,
          menuTabs: [],
          sortable: true,
          cellClass: ['ag-grid-color-font', 'text-right', 'pr-28'],
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
        // {
        //   field: 'pricingCommitment',
        //   headerName: '약정',
        //   resizable: true,
        //   minWidth: 180,
        //   menuTabs: [],
        //   sortable: false,
        //   autoHeight: true,
        //   cellClass: (params) => {
        //     return params.value !== undefined
        //       ? ['ag-grid-color-font', 'text-center', 'commitment']
        //       : ['ag-grid-color-font', 'text-center'];
        //   },
        //   cellRenderer: (params) => {
        //     if (params.value !== undefined) {
        //       if (params.value.cmmtVal !== undefined) {
        //         return (
        //           numberWithCommas(params.value.cmmtVal) + params.value.cmmtUnit + '<br>' + params.value.cmmtTermTypCd
        //         );
        //       } else {
        //         return '';
        //       }
        //     }
        //   },
        //   onCellClicked: this.openCommitmentPop,
        //   headerComponentParams: {
        //     template:
        //       '<div style="padding: inherit" class="ag-cell-label-container" role="presentation">' +
        //       '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
        //       '  <div style="justify-content: center" ref="eLabel" class="ag-header-cell-label" role="presentation">' +
        //       '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
        //       '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
        //       '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
        //       '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
        //       '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
        //       '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
        //       '  </div>' +
        //       '</div>',
        //   },
        // },
      ];
      this.defaultColDef = { flex: -1 };
      this.autoGroupColumnDef = {
        headerName: this.$t('cost.contractClassification'),
        resizable: true,
        minWidth: 750,
        cellRendererParams: { suppressCount: true },
        cellClass: ['ag-grid-font', type === 'TOTAL' ? 'pl-27' : 'pl-0'],
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
            '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
            '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
            '  </div>' +
            '</div>',
        },
      };
    },
    totalTab(fetchData, tempData) {
      fetchData.map((fetchDataList) => {
        fetchDataList.ctgry2List.map((ctgry2ListData) => {
          ctgry2ListData.prdtList.map((prdtListData) => {
            prdtListData.pricingList.map((pricingListData) => {
              tempData.push({
                orgHierarchy: [
                  pricingListData.ctgry1Nm,
                  pricingListData.ctgry2Nm,
                  pricingListData.prdtNm,
                  pricingListData.pricingNm,
                ],
                pricingUnitAmt: pricingListData.pricingUnitAmt,
                pricingUnitCntQtyVal: pricingListData.pricingUnitCntQtyVal,
                pricingUnitDscntRatio: pricingListData.pricingUnitDscntRatio,
                // pricingCommitment: {
                //   ctrtVerVal: pricingListData.ctrtVerVal,
                //   prdtId: pricingListData.prdtId,
                //   pricingId: pricingListData.pricingId,
                //   cmmtVal: pricingListData.cmmtVal,
                //   cmmtUnit: pricingListData.cmmtUnit,
                //   cmmtTermTypCd: this.cmmtTerm(pricingListData.cmmtTermTypCd),
                // },
              });
            });
          });
        });
      });
    },
    prdtTab(fetchData, tempData) {
      fetchData.map((fetchDataList) => {
        fetchDataList.ctgry2List.map((ctgry2ListData) => {
          ctgry2ListData.prdtList.map((prdtListData) => {
            prdtListData.pricingList.map((pricingListData) => {
              tempData.push({
                orgHierarchy: [pricingListData.pricingNm],
                pricingUnitAmt: pricingListData.pricingUnitAmt,
                pricingUnitCntQtyVal: pricingListData.pricingUnitCntQtyVal,
                pricingUnitDscntRatio: pricingListData.pricingUnitDscntRatio,
                // pricingCommitment: {
                //   ctrtVerVal: pricingListData.ctrtVerVal,
                //   prdtId: pricingListData.prdtId,
                //   pricingId: pricingListData.pricingId,
                //   cmmtVal: pricingListData.cmmtVal,
                //   cmmtUnit: pricingListData.cmmtUnit,
                //   cmmtTermTypCd: this.cmmtTerm(pricingListData.cmmtTermTypCd),
                // },
              });
            });
          });
        });
      });
    },
  },
};
</script>

<style>
/*.commitment {*/
/*  text-decoration: underline;*/
/*  cursor: pointer;*/
/*  line-height: 20px !important;*/
/*  padding: 0px 10px !important;*/
/*}*/
.cell-pd {
  padding: 0px 4px !important;
}
</style>
