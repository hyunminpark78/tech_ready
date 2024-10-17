<template>
  <div class="searchPriceGrid">
    <p v-if="tab === 1" class="flex justify-end text-message">
      {{ timeDisplay }}
      {{ $t('advisor.spotRateCheck.searchPriceGrid.gridNote') }}
    </p>
    <ag-grid-vue
      style="width: 100%; height: 100%"
      class="ag-theme-alpine"
      :grid-options="gridOptions"
      :row-data="rowData"
      :column-defs="columnDefs"
      :default-col-def="defaultColDef"
      :dom-layout="domLayout"
      :modules="modules"
      :framework-components="frameworkComponents"
      :loading-overlay-component="loadingOverlayComponent"
      :loading-overlay-component-params="loadingOverlayComponentParams"
      :no-rows-overlay-component="noRowsOverlayComponent"
      :no-rows-overlay-component-params="noRowsOverlayComponentParams"
      :suppress-context-menu="true"
      :pagination="true"
      :auto-height="true"
      :suppress-pagination-panel="true"
      :suppress-scroll-on-new-data="true"
      :suppress-row-transform="true"
      :row-class-rules="rowClassRules"
      @first-data-rendered="autoSizeAll"
      @row-data-changed="autoSizeAll"
      @grid-ready="onGridReady"
    ></ag-grid-vue>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import demoData from '../../../../../../public/locales/comparison_demo.json';

export default {
  components: { AgGridVue },
  mixins: [AgGridMixin()],
  props: {
    rangeType: {
      type: Number,
      default: 90,
    },
    tab: {
      type: Number,
      default: 1,
    },
    gridData: {
      type: Array,
      default: () => [],
    },
    currency: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      duration: '3개월',
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      frameworkComponents: null,
      loading: false,
      gridToolPanelVisible: false,
      rowClassRules: {
        customFirstRow: (params) =>
          params.data.sortation === this.$t('advisor.detailTable.spotComparison.currentInformation'),
      },
      timeData: [
        {
          text: this.$t('advisor.detailTable.spotComparison.oneWeek'),
          value: 7,
        },
        {
          text: this.$t('advisor.detailTable.spotComparison.oneMonth'),
          value: 30,
        },
        {
          text: this.$t('advisor.detailTable.spotComparison.threeMonths'),
          value: 90,
        },
      ],
    };
  },
  computed: {
    currencySymbol() {
      return this.currency === 'usd' ? '$' : '₩';
    },
    timeDisplay() {
      const selectedTime = this.timeData.find((item) => item.value === this.rangeType);
      return selectedTime ? this.timeData.find((item) => item.value === this.rangeType).text : '';
    },
  },
  watch: {
    '$i18n.locale': ['setGridData', 'setColumn'],
    tab() {
      this.setColumn();
      this.setGridData();
    },
    currency() {
      this.setColumn();
      this.setGridData();
    },
    rangeType() {
      this.setGridData();
      this.setColumn();
    },
  },

  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      enableAdvancedFilter: true,
      suppressCellSelection: true,
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
      sideBar: {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: '컬럼설정',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
              suppressRowGroups: true,
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true,
              suppressColumnFilter: true,
              suppressColumnSelectAll: true,
              suppressColumnExpandAll: true,
            },
          },
        ],
        defaultToolPanel: 'columns',
        hiddenByDefault: true,
      },
      rowHeight: 50,
    };
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  mounted() {
    this.setGridDataInit();
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.setColumn();

    if (document.querySelector('.jsFoldGrid')) {
      const btnFolds = document.querySelectorAll('.jsFoldGrid');
      btnFolds.forEach((btnFold) => {
        btnFold.onclick = function () {
          if (this.parentNode.parentNode.parentNode.classList.contains('close')) {
            this.parentNode.parentNode.parentNode.classList.remove('close');
          } else {
            this.parentNode.parentNode.parentNode.classList.add('close');
          }
        };
      });
    }
  },

  methods: {
    async setGridDataInit() {
      this.setGridData();
    },
    customValueCurrency(params) {
      const formatted = this.numberWithCommas(params.value);
      if (formatted.indexOf('-') === 0) {
        return '-';
      }
      return this.currencySymbol + formatted;
    },
    async setGridData() {
      if (this.rangeType === 7) {
        this.duration = '1주';
        this.rowData = this.gridData.map((item) => {
          return {
            ...item,
            estimatedCost: ((item.estimatedCost / 90) * 7).toFixed(0),
            onDemandCost: ((item.onDemandCost / 90) * 7).toFixed(0),
            averageSavingsRate: (item.averageSavingsRate - 2.3).toFixed(2),
          };
        });
      } else if (this.rangeType === 30) {
        this.duration = '1개월';
        this.rowData = this.gridData.map((item) => {
          return {
            ...item,
            estimatedCost: (item.estimatedCost / 3).toFixed(0),
            onDemandCost: (item.onDemandCost / 3).toFixed(0),
            averageSavingsRate: (item.averageSavingsRate + 1.1).toFixed(2),
          };
        });
      } else {
        this.duration = '3개월';
        this.rowData = this.gridData;
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.autoSizeAll();
      this.gridApi.sizeColumnsToFit();
    },
    autoSizeAll() {
      let gridId = 'usageGrid_';
      let columnState = localStorage.getItem(gridId + '_columnState');
      let columnGroupState = localStorage.getItem(gridId + '_columnGroupState');
      if (!this.gridColumnApi.getAllColumns()) return;
      var allColumnIds = [];
      if (columnState && columnState !== 'undefined') {
        this.gridColumnApi.applyColumnState({
          state: JSON.parse(columnState),
          applyOrder: true,
        });
        allColumnIds = JSON.parse(columnState).map((row) => row.colId);
      } else {
        this.gridColumnApi.getAllColumns().forEach(function (column) {
          allColumnIds.push(column.colId);
        });
      }
      if (columnGroupState && columnGroupState !== 'undefined') {
        this.gridColumnApi.setColumnGroupState(JSON.parse(columnGroupState));
      }
    },
    setColumn() {
      this.columnDefs =
        this.tab === 1
          ? [
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.instanceType'),
                field: 'instanceType',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.region'),
                field: 'region',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.availableArea'),
                field: 'availableArea',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.operateSys'),
                field: 'operateSys',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.vCPU'),
                field: 'vCPU',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                width: 120,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.memory'),
                field: 'memory',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                width: 120,
                valueFormatter: (params) => params.value + ' GiB' || '-',
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.interruptionFrequency'),
                field: 'interruptionFrequency',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                width: 120,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.latestSpotRates'),
                field: 'currentRate',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                width: 180,
                valueFormatter: this.customValueCurrency,
              },
              {
                headerName:
                  this.$t('advisor.spotRateCheck.searchPriceGrid.estimatedSpotCost') + '(' + this.duration + ')',
                field: 'estimatedCost',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                valueFormatter: this.customValueCurrency,
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.onDemandCost') + '(' + this.duration + ')',
                field: 'onDemandCost',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                width: 180,
                valueFormatter: this.customValueCurrency,
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.averageSavingsRate'),
                field: 'averageSavingsRate',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => `${params.value > 0 ? params.value + '%' : '-'}`,
              },
            ]
          : [
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.instanceType'),
                field: 'instanceType',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.region'),
                field: 'region',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.availableArea'),
                field: 'availableArea',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.operateSys'),
                field: 'operateSys',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.vCPU'),
                field: 'vCPU',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                width: 120,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.memory'),
                field: 'memory',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                width: 120,
                valueFormatter: (params) => params.value + ' GiB' || '-',
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.interruptionFrequency'),
                field: 'interruptionFrequency',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                width: 120,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.currentRate'),
                field: 'currentRate',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                width: 180,
                valueFormatter: this.customValueCurrency,
              },
              {
                headerName:
                  this.$t('advisor.spotRateCheck.searchPriceGrid.estimatedCostOneMonth') + '(' + this.duration + ')',
                field: 'estimatedCost',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                valueFormatter: this.customValueCurrency,
              },
              {
                headerName:
                  this.$t('advisor.spotRateCheck.searchPriceGrid.onDemandCostOneMonth') + '(' + this.duration + ')',
                field: 'onDemandCost',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                valueFormatter: this.customValueCurrency,
              },
              {
                headerName: this.$t('advisor.spotRateCheck.searchPriceGrid.averageSavingsRate'),
                field: 'averageSavingsRate',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'cell-padding'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => `${params.value > 0 ? params.value + '%' : '-'}`,
              },
            ];
      this.defaultColDef = {
        flex: 1,
        filter: true,
        // allow every column to be aggregated
        enableValue: false,
        // allow every column to be grouped
        enableRowGroup: false,
        // allow every column to be pivoted
        enablePivot: false,
      };
      this.enabledTooltips(this.columnDefs);
      const gridApi = this.gridOptions.api;
      gridApi.redrawRows();
    },
  },
};
</script>
<style lang="scss">
.searchPriceGrid {
  margin-bottom: 30px;

  .ag-header-group-text {
    text-align: center !important;
    font-size: 13px;
    font-style: normal;
    line-height: 18px;
    font-weight: bold !important;
    color: #5ba9ca;
    font-family: 'Noto Sans KR';
  }

  .ag-header-group-cell-label {
    align-items: center !important;
    justify-content: center !important;
  }

  .ag-header-cell-label {
    justify-content: center;
  }

  .ag-body-viewport {
    min-height: 120px;
  }

  .ag-root-wrapper-body .no-display-in-grid {
    display: none !important;
  }

  .ag-row .ag-cell {
    display: flex;
    justify-content: center; /* align horizontal */
    align-items: center;
    line-height: 24px;
  }

  .cell-padding {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 24px !important;
    padding-right: 24px !important;
  }

  .text-message {
    color: #999999;
    font-weight: 400;
    padding: 0 10px 10px 0;
  }
}
</style>
