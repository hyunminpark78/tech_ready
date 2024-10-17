<template>
  <div class="box-wrap">
    <div class="title">
      <h4 class="tit-wrap">
        <span>{{ $t('optimization.summaryCommitmentByService') }}</span>
        <div class="tooltip-wrap">
          <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
          <div class="tooltip-layer active">
            <strong class="ti">{{ $t('optimization.summaryCommitmentByService') }}</strong>
            {{ $t('optimization.showsCostContractSavings') }}
            <br />{{ $t('optimization.theLowerTheMoreCost', { value: getCmmtTitle }) }}<br />
            {{ $t('optimization.contractPurchasingCost', { value: getCmmtTitle }) }}
            <button class="close jsTooltipClose1">툴팁 닫기</button>
          </div>
        </div>

        <span v-if="cspTypCd === 'AWS'" class="font-small">
          <div class="box-label" style="--fill-color: #2cc2fd"></div>
          Savings Plans(SP)
          <div class="box-label" style="--fill-color: #1ae3bb"></div>
          Reserved Instance(RI)
          <div class="box-label" style="--fill-color: lightgray"></div>
          {{ $t('optimization.onDemand') }}
        </span>
        <span v-else-if="cspTypCd === 'AZURE'" class="font-small">
          <div class="box-label" style="--fill-color: #1ae3bb"></div>
          Reservations
          <div class="box-label" style="--fill-color: lightgray"></div>
          {{ $t('optimization.payAsYouGoSystem') }}
        </span>
      </h4>
      <a href="javascript:void(0);" class="download" @click="excelDownload">{{ $t('common.button.downloadExcel') }}</a>
    </div>
    <div class="example-wrapper">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :auto-height="true"
        :grid-options="gridOptions"
        :row-data="rowData"
        :row-height="rowHeight"
        :column-defs="columnDefs"
        :default-col-def="defaultColDef"
        :dom-layout="domLayout"
        :enable-browser-tooltips="false"
        :modules="modules"
        :framework-components="frameworkComponents"
        :loading-overlay-component="loadingOverlayComponent"
        :loading-overlay-component-params="loadingOverlayComponentParams"
        :no-rows-overlay-component="noRowsOverlayComponent"
        :no-rows-overlay-component-params="noRowsOverlayComponentParams"
        :popup-parent="popupParent"
        :pinned-top-row-data="pinnedTopRowData"
        :suppress-context-menu="true"
        :suppress-span-header-height="false"
        :suppress-scroll-on-new-data="true"
        :excel-styles="excelStyles"
        :default-excel-export-params="defaultExcelExportParams"
        @first-data-rendered="autoSizeAll"
        @row-data-changed="autoSizeAll"
        @grid-ready="onGridReady"
      ></ag-grid-vue>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import CmmtSummaryGridMixin from './CmmtSummaryGridMixin.js';
import costOptiService from '@/services/costOptiService';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: { AgGridVue },
  mixins: [AgGridMixin(), CmmtSummaryGridMixin],
  data() {
    return {
      cspTypCd: '',
      // param: {},
      gridApi: null,
      gridOptions: null,
      rowData: null,
      rowHeight: null,
      columnDefs: null,
      defaultColDef: null,
      defaultExcelExportParams: null,
      excelStyles: null,
      frameworkComponents: null,
      pinnedTopRowData: null,
      loading: false,
      titles: {},
    };
  },
  computed: {
    ...mapState('costOpti', ['filter', 'isSearch']),
    getCmmtTitle() {
      return this.titles[this.cspTypCd];
    },
  },
  watch: {
    '$i18n.locale': ['setTitles', 'setGridData'],
    loading(newVal) {
      if (newVal) this.gridApi.showLoadingOverlay();
    },
    // filter(newVal) {
    //   this.param = newVal;
    // },
    isSearch(newVal) {
      if (newVal.isSearch) {
        // this.param = this.filter;
        this.cspTypCd = this.filter.cspTypCd;
        this.setGridData();
      }
    },
  },
  created() {
    // this.param = this.filter;
    this.setTitles();
    this.cspTypCd = this.filter.cspTypCd;
  },
  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      tooltipShowDelay: 0,
    };
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  mounted() {
    this.rowHeight = 60;
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;

    this.defaultExcelExportParams = {
      autoConvertFormulas: true,
      processCellCallback: (params) => {
        if (typeof params.value === 'number') {
          return Math.floor(params.value);
        }
        return params.value;
      },
    };

    // this.excelStyles = [
    //   {
    //     id: 'costType',
    //     numberFormat: {
    //       format: '₩#,##0',
    //     },
    //   },
    //   {
    //     id: 'rateType',
    //     numberFormat: {
    //       format: '#0.00%',
    //     },
    //   },
    // ];
  },
  methods: {
    ...mapActions('costOpti', ['fetchDashBoard']),
    setTitles() {
      if (i18n.locale === 'ko') {
        this.titles = {
          AWS: '온디맨드',
          AZURE: '종량제',
          GCP: '온디맨드', // TODO: GCP 화면 추가 시 변경 필요!
        };
      } else {
        this.titles = {
          AWS: 'On-Demand',
          AZURE: 'PAYG',
          GCP: 'On-Demand', // TODO: GCP 화면 추가 시 변경 필요!
        };
      }
    },
    async setGridData() {
      this.loading = true;
      try {
        const result = await costOptiService.fetchDashBoard(this.filter);
        this.rowData = result.data.data || [];
        this.setColumn();
      } catch (err) {
        console.error('costOptiService.fetchDashBoard()', err);
      }

      if (this.rowData.length > 0) {
        this.pinnedTopRowData = [
          {
            // cmmtTyp: 'SP/RI', // AWS/AZURE 통합
            prodNm: this.$t('optimization.all'),
            rate: '-', //
            spOnDmndCostEqvlnt: this.accumCalcul('spOnDmndCostEqvlnt'),
            riOnDmndCostEqvlnt: this.accumCalcul('riOnDmndCostEqvlnt'),
            onDmndCost: this.accumCalcul('onDmndCost'),
            totOnDmndCostEqvlnt: this.accumCalcul('totOnDmndCostEqvlnt'),
            spNetSaveCost: this.accumCalcul('spNetSaveCost'),
            riNetSaveCost: this.accumCalcul('riNetSaveCost'),
            totNetSaveCost: this.accumCalcul('totNetSaveCost'),
            spCvrgRt: (100 * this.accumCalcul('spOnDmndCostEqvlnt')) / this.accumCalcul('totOnDmndCostEqvlnt'),
            riCvrgRt: (100 * this.accumCalcul('riOnDmndCostEqvlnt')) / this.accumCalcul('totOnDmndCostEqvlnt'),
            onDmndCvrgRt: (100 * this.accumCalcul('onDmndCost')) / this.accumCalcul('totOnDmndCostEqvlnt'),
            spNetSaveRt: (100 * this.accumCalcul('spNetSaveCost')) / this.accumCalcul('spUsedOnDmndCostEqvlnt'),
            riNetSaveRt: (100 * this.accumCalcul('riNetSaveCost')) / this.accumCalcul('riUsedOnDmndCostEqvlnt'),
            totNetSaveRt: (100 * this.accumCalcul('totNetSaveCost')) / this.accumCalcul('totUsedOnDmndCostEqvlnt'),
          },
        ];
      } else {
        this.pinnedTopRowData = [];
      }
      this.loading = false;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.autoSizeAll(params);
      params.api.sizeColumnsToFit();
    },
    autoSizeAll(params) {
      const allColumnIds = [];
      params.columnApi.getAllColumns().forEach((column) => {
        allColumnIds.push(column.getId());
      });
      params.columnApi.autoSizeColumns(allColumnIds);
    },
    setColumn() {
      this.gridApi.setColumnDefs([]);
      this.columnDefs = this.gridColumns[this.cspTypCd];
      this.gridApi.setColumnDefs(this.columnDefs);
    },
    accumCalcul(key) {
      return this.rowData.reduce((accm, val) => {
        accm += val[key];
        return accm;
      }, 0);
    },
    numberWithPercent(params) {
      const column = params.column.getColId();
      let percentCol;

      switch (column) {
        case 'spOnDmndCostEqvlnt':
          percentCol = 'spCvrgRt';
          break;
        case 'riOnDmndCostEqvlnt':
          percentCol = 'riCvrgRt';
          break;
        case 'onDmndCost':
          percentCol = 'onDmndCvrgRt';
          break;
        case 'spNetSaveCost':
          percentCol = 'spNetSaveRt';
          break;
        case 'riNetSaveCost':
          percentCol = 'riNetSaveRt';
          break;
        case 'totNetSaveCost':
          percentCol = 'totNetSaveRt';
          break;
      }

      const number = this.numberWithCurcyUnit(params.value);
      const percent = this.numberProcess(params.data[percentCol]);
      return `${number} (${percent}%)`;
    },
    excelDownload() {
      this.gridApi.exportDataAsExcel({
        fileName: `${this.cspTypCd} ${this.$t('optimization.summaryCommitmentByService')}_${moment().format(
          'YYYY-MM-DD'
        )}.xlsx`,
        sheetName: `${this.cspTypCd} ${this.$t('optimization.summaryCommitmentByService')}`,
        skipHeader: false, // 헤더 포함
        columnKeys: [
          'prodNm',
          'spOnDmndCostEqvlnt',
          'spCvrgRt',
          'riOnDmndCostEqvlnt',
          'riCvrgRt',
          'onDmndCost',
          'onDmndCvrgRt',
          'totOnDmndCostEqvlnt',
          'spNetSaveCost',
          'spNetSaveRt',
          'riNetSaveCost',
          'riNetSaveRt',
          'totNetSaveCost',
        ],
      });
    },
  },
};
</script>

<style>
.ag-header-group-cell-label {
  justify-content: center;
}
.ag-header-group-cell {
  font-size: 13px;
  color: #5ba9ca;
}
.ag-header-group-text {
  font-weight: bold !important;
}
.ag-header-cell-label {
  justify-content: center;
}
.ag-cell-focus {
  border: none;
}
.percent-bar {
  height: 50%;
  width: 100%;
  margin: 9% 0 0 0;
  border: 1px solid #ccc;
  display: flex;
  justify-content: flex-start;
}
.param-text {
  width: 95%;
  line-height: normal;
}
.percent-fill {
  flex-grow: 1;
  width: var(--percent);
  background: linear-gradient(to right, var(--fill-color) 0% 100%);
}
.outDiv {
  height: 100%;
  width: 100%;
  display: flex; /* Flexbox 레이아웃 사용 */
  justify-content: space-between; /* 요소들 사이의 간격을 균등하게 배치 */
}
.rcmdBtn {
  width: 30%;
  height: 50%;
  font-style: normal;
  color: lightgrey;
  line-height: initial;
  background-color: white;
  border: 1px solid lightgray;
  border-radius: 5px;
  margin-left: 10px;
  padding: 2px 10px;
}

.ag-body-viewport {
  min-height: 120px;
}
.vetical-align {
  margin-top: 8px;
}
.header-rowspan {
  position: fixed;
  top: 0;
  left: 0;
  height: 94px;
  width: 200px;
  background: #00a5ed;
}

.font-small {
  font-size: 13px;
  font-weight: 400;
  margin-left: 10px;
  display: flex;
  align-items: center;
}
.box-label {
  width: 15px;
  height: 15px;
  background-color: var(--fill-color);
  margin: 0px 3px;
  margin-left: 15px;
}
.example-wrapper .header-merge {
  height: 100px !important;
  position: fixed !important;
  top: 0px;
  border-top: none !important;
}
.example-wrapper .ag-header-group-cell-no-group {
  height: 0px !important;
}
.no-btn {
  text-align: right;
  margin-right: 37%;
}

div[row-index='t-0'] {
  background: #f8f8f8 !important;
}

div[row-index='t-0'] > * {
  font-weight: bold !important;
}
</style>
