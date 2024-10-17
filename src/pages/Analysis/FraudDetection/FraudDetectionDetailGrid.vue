<template>
  <div class="alarmlist__wrap">
    <div class="list_header">
      <div class="title flex items-center">
        {{ $t('cost.anomalyDetectionFactor') }}
        <button class="btn_info" @click="viewToolTip('gridToolTip')">
          <img src="@/assets/images/ico-info.svg" alt="." />
        </button>
        <div
          v-show="onToolTip.gridToolTip"
          class="absolute z-10 p-4 pr-12 font-normal text-gray-700 bg-white border rounded border-primary-400 text-xs- popup-comment left__80"
        >
          {{ $t('cost.anomalyDetectionDisplayed') }}
          <img src="@/assets/images/arrow.jpg" alt="." />
          <button class="absolute top-0 right-0 mt-2.5 mr-2" @click="viewToolTip('gridToolTip')">
            <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
          </button>
        </div>
      </div>
      <div class="btn_wrap">
        <button type="button" class="btn_down" @click="excelDownload()">
          {{ $t('common.button.download') }} <i class="ico_down"></i>
        </button>
      </div>
    </div>

    <div class="grid__list" style="height: 200px">
      <div class="bg-white border rounded-lg border-primary-200 dashboard-card">
        <div class="rounded-bl-lg rounded-br-lg max-h-856-">
          <ag-grid-vue
            id="FraudDetectionDetailGrid"
            style="width: 100%; height: 200px"
            class="ag-theme-alpine"
            :grid-options="gridOptions"
            :row-data="rowData"
            :column-defs="columnDefs"
            :default-col-def="defaultColDef"
            col-resize-default="shift"
            :animate-rows="true"
            :framework-components="frameworkComponents"
            :loading-overlay-component="loadingOverlayComponent"
            :loading-overlay-component-params="loadingOverlayComponentParams"
            :no-rows-overlay-component="noRowsOverlayComponent"
            :no-rows-overlay-component-params="noRowsOverlayComponentParams"
            :popup-parent="popupParent"
            :suppress-context-menu="true"
            @first-data-rendered="(params) => params.api.sizeColumnsToFit()"
            @grid-size-changed="(params) => params.api.sizeColumnsToFit()"
          ></ag-grid-vue>
        </div>
      </div>
      <!--
        - 그리드 내 업, 다운 이미지
        <img src="@/assets/images/ico_gridarrow_down.svg" alt="" />
        <img src="@/assets/images/ico_gridarrow_up.svg" alt="" />
        - 그리드 높이값은 인라인 으로 조절
      -->
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';
import { mapState } from 'vuex';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import * as _ from 'lodash';

export default {
  components: { AgGridVue },
  mixins: [AgGridMixin()],
  props: {
    contractId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: {
        suppressSizeToFit: true,
      },
      frameworkComponents: null,
      standardMsg: {
        A: '',
        B: 'AI 예측 비용 VS 실제비용',
      },
      msgData: null,
      msgShow: false,

      onToolTip: {
        gridToolTip: false,
      },
    };
  },
  computed: {
    ...mapState('analysis', ['fraudDetectionDetailGrid']),
  },
  watch: {
    '$i18n.locale': 'setColumn',
    fraudDetectionDetailGrid: function () {
      this.setData();
    },
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  beforeMount() {
    this.gridOptions = {};
  },
  methods: {
    setColumn() {
      this.columnDefs = [
        {
          headerName: 'No.',
          field: 'no',
          menuTabs: [],
          width: 70,
          headerComponentParams: {
            template:
              '<div style="padding-left:13px;" class="ag-cell-label-container" role="presentation">' +
              '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
              '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
              '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
              '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
              '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
              '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
              '    <span ref="eText" class="ag-header-cell-text w-full text-center" role="columnheader"></span>' +
              '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
              '  </div>' +
              '</div>',
          },
          cellClass: ['ag-grid-font', 'text-center', 'pl-32'],
        },
        {
          headerName: this.$t('cost.influence'),
          field: 'anomlRate',
          menuTabs: [],
          width: 90,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          headerName: this.$t('cost.service'),
          field: 'cspPrdtCd',
          menuTabs: [],
          suppressSizeToFit: false,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          headerName: this.$t('cost.account'),
          field: 'acntId',
          menuTabs: [],
          suppressSizeToFit: false,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          headerName: this.$t('cost.region'),
          field: 'regionCd',
          menuTabs: [],
          suppressSizeToFit: false,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          headerName: this.$t('cost.aiPredictionCost'),
          field: 'forcstCost',
          menuTabs: [],
          // width: 120,
          suppressSizeToFit: false,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          headerName: this.$t('cost.actualCosts'),
          field: 'realCost',
          menuTabs: [],
          width: 120,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          headerName: this.$t('cost.rateOfChange'),
          field: 'diffRate',
          menuTabs: [],
          // width: 90,
          suppressSizeToFit: true,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          headerName: this.$t('cost.typeOfUse'),
          field: 'usageTypNm',
          menuTabs: [],
          suppressSizeToFit: false,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          headerName: this.$t('cost.work'),
          field: 'optrNm',
          menuTabs: [],
          suppressSizeToFit: false,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
          resizable: false,
        },
      ];
    },
    setData() {
      this.rowData = [];
      this.setColumn();
      const data = _.cloneDeep(this.fraudDetectionDetailGrid);
      data.forEach((v, i) => {
        this.rowData.push({
          no: i + 1,
          // 영향도?
          cspPrdtCd: v.cspPrdtCd,
          anomlRate: v.anomlRate,
          acntId: v.acntId,
          regionCd: v.regionCd,
          forcstCost: v.forcstCost,
          realCost: v.realCost,
          diffRate: v.diffRate,
          usageTypNm: v.usageTypNm,
          optrNm: v.optrNm,
          ctrtId: v.ctrtId,
          forcstDt: v.forcstDt.slice(0, 4) + '.' + v.forcstDt.slice(4, 6) + '.' + v.forcstDt.slice(6, 8),
          cspTypCd: v.cspTypCd,
          pricingCurcyCd: v.pricingCurcyCd,
        });
      });
    },
    excelDownload() {
      let fileName = this.$t('cost.anomalyDetectionFactor');
      // 엑셀다운로드시 계정별 컬럼 빼기
      let columnKeys = [];
      this.columnDefs.filter((v) => {
        // 화면에 보이는 컬럼만 excel export
        if (v.headerName !== '' && v.hide !== true) {
          columnKeys.push(v.field);
        }
      });
      const excelParams = {
        fileName,
        sheetName: fileName,
        rowHeight: 40,
        headerRowHeight: 60,
        columnKeys: columnKeys,
      };

      this.gridApi.exportDataAsExcel(excelParams);
    },
    viewToolTip(toolTip) {
      this.onToolTip[toolTip] = !this.onToolTip[toolTip];
    },
  },
};
</script>

<style></style>
