<template>
  <div id="detailTable" class="box-wrap">
    <div class="title">
      <div class="flex search-wrap title-grid">
        <Tooltip :title="$t('optimization.recommendedDetails')">
          <div style="font-weight: 700" class="ti">{{ $t('optimization.recommendedDetails') }}</div>
          <span>{{ $t('common.tooltip.recommendedSpot') }}</span>
        </Tooltip>
        <div class="detailTableDuration">
          {{ $t('optimization.analysisPeriod') }} : {{ previousMonth }} ~ {{ previousDay }}
        </div>
      </div>
      <!-- search -->
      <div class="search-wrap search-btn">
        <input
          id="searchText"
          v-model="searchText"
          type="text"
          :placeholder="$t('common.placeholder.enterSearchTerm')"
          class="keyword"
          @keydown.enter="searchGridData"
        />
        <a href="#searchText" class="btn" @click="searchGridData">{{ $t('common.button.search') }}</a>
      </div>
      <!-- //search -->
      <div class="pos-right">
        <a href="#" class="download" @click="excelDownload">{{ $t('common.button.downloadExcel') }}</a>
        <button class="fold jsFoldGrid" @click="setSideBarVisible">
          <span>{{ $t('common.select.columnSetting') }}</span>
        </button>
      </div>
    </div>

    <template v-if="!isLoading">
      <div ref="usageGrid" class="relative">
        <ag-grid-vue
          id="spotRecommendGrid"
          ref="spotRecommendGrid"
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
          :popup-parent="popupParent"
          :suppress-context-menu="true"
          :pagination="true"
          :auto-height="true"
          :pagination-page-size="pageObj.pageSize"
          :suppress-pagination-panel="true"
          :suppress-scroll-on-new-data="true"
          :default-excel-export-params="defaultExcelExportParams"
          @first-data-rendered="autoSizeAll"
          @row-data-changed="autoSizeAll"
          @grid-ready="onGridReady"
          @filter-changed="onFilterChanged"
          @column-moved="onColumnMoved"
          @column-pinned="onColumnPinned"
          @column-visible="onColumnVisible"
        ></ag-grid-vue>
      </div>
    </template>
    <template v-else>
      <div class="relative border-t" style="height: 195px">
        <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
          <div class="mb-4 loading_rotate">
            <span class="loadingcolor"></span>
          </div>
          <div class="loading_txt">Loading...</div>
        </div>
      </div>
    </template>

    <Paginate
      v-if="pageObj.totalCnt > 0"
      :page-size="pageObj.pageSize"
      :page-no="pageObj.currentPageNo"
      :total-cnt="pageObj.totalCnt"
      @changepage="pageChange"
    />
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import Paginate from '@/components/Paginate.vue';
import moment from 'moment';
import { Tooltip, SpotComparisonCell, OptimizationCell } from '@/pages/Advisor/components';
import { i18n } from '../../../../../../public/locales/i18n';
import { mapActions, mapGetters, mapState } from 'vuex';
import spotUsageService from '@/services/spotUsageService';
import { numberCutDecimal } from '@/pages/Opti/CostOpti/CmmtPsblTgt/CostOptiCommon';
import icoDown from '@/assets/images/ico-down.svg';
import { setApiConfig } from '@/library/APICaller';
import axios from 'axios';
import demoData from '../../../../../../public/locales/recommendation_demo.json';
import _ from 'lodash';

export default {
  components: { AgGridVue, Paginate, Tooltip, SpotComparisonCell, OptimizationCell },
  mixins: [AgGridMixin()],
  data() {
    return {
      gridOptions: null,
      rowData: null,
      originRowdata: null,
      columnDefs: null,
      defaultColDef: null,
      defaultExcelExportParams: null,
      frameworkComponents: null,
      previousDay: moment().subtract(1, 'days').format('YYYY.M.D 00:00'),
      previousMonth: moment().subtract(30, 'days').format('YYYY.M.D 00:00'),
      pageObj: {
        currentPageNo: 1,
        pageSize: 10,
        totalCnt: 0,
      },
      gridToolPanelVisible: false,
      tooltip: false,
      tooltipContent: {},
      screenX: 0,
      screenY: 0,
      isLoading: false,
      searchText: '',
      gridApiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
    };
  },
  computed: {
    ...mapState('spotAdvisor', {
      filter: 'filter',
      category: 'category',
      companyId: 'selectedCustCorpIds',
      setRecommendDetailData: 'setRecommendDetailData',
    }),
    ...mapGetters('spotAdvisor', ['cspTypCd', 'cspPrdtCdList', 'regionSepCdList', 'tag', 'exchgRate']),
  },

  watch: {
    '$i18n.locale': ['setColumn', 'setData'],
    setRecommendDetailData: async function () {
      if (this.setRecommendDetailData) {
        this.fetchRecommendDetailData(false);
        this.initSearchText();
        await this.setData();
      }
    },
  },

  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      enableAdvancedFilter: true,
      suppressCellSelection: true,
      tooltipShowDelay: 0, // 툴팁 표시 지연 시간
      tooltipHideDelay: 2000, // 툴팁 숨김 지연 시간
      sideBar: {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Column settings',
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
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.setColumn();
    this.defaultExcelExportParams = {
      autoConvertFormulas: true,
      processCellCallback: (params) => {
        return params.value;
      },
    };
  },

  methods: {
    ...mapActions('spotAdvisor', ['fetchRecommendDetailData']),
    initPageObj() {
      this.pageObj.currentPageNo = 1;
      this.pageObj.pageSize = 10;
      this.pageObj.totalCnt = 0;
    },
    initSearchText() {
      this.searchText = '';
    },
    excelDownload() {
      const exportParams = {
        fileName: `${this.$t('advisor.detailTable.excelTitle')}_${moment().format('YYYY-MM-DD')}.xlsx`,
        forceTextOnNumericalColumn: true,
        processCellCallback: (params) => {
          // 그리드 표기와 동일하게 엑셀 데이터 표기
          if (params.column.colDef.valueFormatter) {
            return params.column.colDef.valueFormatter(params);
          }
          return params.value || '-';
        },
      };
      this.gridApi.exportDataAsExcel(exportParams);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.autoSizeAll();
      this.gridApi.sizeColumnsToFit();
    },
    async setData() {
      this.isLoading = true;
      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.gridApiConfig.cancelTokenSource) {
        this.gridApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.gridApiConfig);

      try {
        const payload = {
          custCorpId: this.companyId[0].id,
          recmTypNm: this.category,
          acntIdList: this.filter.acntIdList,
          regionSepCdList: this.regionSepCdList,
          cspPrdtCdList: this.cspPrdtCdList,
          tagKey: this.tag.tagKey,
          tagValList: this.tag.tagValList,
        };

        const response = await spotUsageService.fetchRecommendDetailData({
          cspTypCd: this.cspTypCd,
          payload: payload,
          config: { cancelToken: this.gridApiConfig.cancelToken },
        });
        this.rowData = response.data.data;
        this.pageObj.totalCnt = this.rowData.length;
        this.originRowdata = _.cloneDeep(this.rowData);
        this.isLoading = false;
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching grid data:', e);
          this.rowData = [];
          this.pageObj.totalCnt = this.rowData.length;
          this.originRowdata = _.cloneDeep(this.rowData);
          this.isLoading = false;
        }
      }
    },
    searchGridData() {
      this.gridApi.showLoadingOverlay();
      setTimeout(() => {
        this.gridApi.hideOverlay();
        this.searchText = this.searchText.trim();
        if (this.searchText) {
          const searchText = this.searchText.toLowerCase();
          this.rowData = this.originRowdata.filter((item) => {
            return Object.values(item).some(
              (value) => value != null && value.toString().toLowerCase().includes(searchText)
            );
          });
        } else {
          this.rowData = _.cloneDeep(this.originRowdata);
        }
      }, 200);
    },
    setColumn() {
      this.columnDefs = this.getColumnInfo({ cspTypCd: this.cspTypCd }).columnDefs;
      this.defaultColDef = { flex: -1, filter: true };
      this.enabledTooltips(this.columnDefs);
    },
    pageChange(pageNo) {
      this.pageObj.currentPageNo = pageNo;
      this.gridApi.paginationGoToPage(pageNo - 1);
      this.closeTooltip();
    },
    autoSizeAll() {
      let gridId = 'spotRecommendGrid';
      let columnState = localStorage.getItem(gridId + '_columnState');
      let columnGroupState = localStorage.getItem(gridId + '_columnGroupState');

      if (!this.gridColumnApi.getAllColumns()) return;

      if (columnState && columnState !== 'undefined') {
        this.gridColumnApi.applyColumnState({
          state: JSON.parse(columnState),
          applyOrder: true,
        });
      }
      if (columnGroupState && columnGroupState !== 'undefined') {
        this.gridColumnApi.setColumnGroupState(JSON.parse(columnGroupState));
      }

      let resizableColumns = this.gridColumnApi.getAllColumns();
      this.gridColumnApi.autoSizeColumns(resizableColumns);
    },
    onSaveGridColumnState(e) {
      if (!this.gridColumnApi) return;
      let gridId = 'spotRecommendGrid';
      let columnState = this.gridColumnApi.getColumnState();
      let columnGroupState = this.gridColumnApi.getColumnGroupState();
      localStorage.setItem(gridId + '_columnState', JSON.stringify(columnState));
      localStorage.setItem(gridId + '_columnGroupState', JSON.stringify(columnGroupState));
    },
    onFilterChanged() {
      // 특정 컬럼의 필터에 대해서만 적용됨, 가운데 아이콘
      this.onSaveGridColumnState();
    },
    onColumnMoved() {
      this.onSaveGridColumnState();
    },
    onColumnPinned() {
      this.onSaveGridColumnState();
    },
    onColumnVisible() {
      this.onSaveGridColumnState();
    },
    setSideBarVisible() {
      this.gridToolPanelVisible = !this.gridToolPanelVisible;
      this.gridOptions.api.setSideBarVisible(this.gridToolPanelVisible);
      this.gridOptions.api.openToolPanel('columns');
    },
    numberComparator(num1, num2) {
      if (num1 === null && num2 === null) {
        return 0;
      }
      if (num1 === null) {
        return -1;
      }
      if (num2 === null) {
        return 1;
      }
      return num1 - num2;
    },
    savingCostCellRenderer(params) {
      return params.value && params.value !== '-'
        ? `<div class="flex items-center justify-end" style="margin-right: 0; padding-bottom: 0"><img src="${icoDown}" alt="." style="margin-right: 3px;"/>￦` +
            numberCutDecimal(params.value * this.exchgRate) +
            '</div>'
        : '￦0';
    },
    instanceTypeRenderer(params) {
      let formattedValue = '';
      if (params.data.instsTypNm) {
        formattedValue += `<div class="flex flex-col">
                                <span>${params.data.instsTypNm}</span>`;
        if (params.data.vcpuCnt && params.data.memSizeGib) {
          formattedValue += `<span style='color: #A2A2A2'>(vCPU: ${params.data.vcpuCnt} GiB: ${params.data.memSizeGib})</span>`;
        }
        formattedValue += `</div>`;
      }

      return formattedValue ? formattedValue : '-';
    },
    instanceTypeValueFormatter(params) {
      let formattedValue = '';
      if (params.node.data.instsTypNm) {
        formattedValue += params.node.data.instsTypNm;
        if (params.node.data.vcpuCnt && params.node.data.memSizeGib) {
          formattedValue += ` (vCPU: ${params.node.data.vcpuCnt} GiB: ${params.node.data.memSizeGib})`;
        }
      }
      return formattedValue ? formattedValue : '-';
    },
    recmInstanceTypeRenderer(params) {
      let formattedValue = '';
      if (params.data.recmInstsTypNm) {
        formattedValue += `<div class="flex flex-col">
                                    <span>${params.data.recmInstsTypNm}</span>`;
        if (params.data.recmVcpuCnt && params.data.recmMemSizeGib) {
          formattedValue += `<span style='color: #A2A2A2'>(vCPU: ${params.data.recmVcpuCnt} GiB: ${params.data.recmMemSizeGib})</span>`;
        }
        formattedValue += `</div>`;
      }

      return formattedValue ? formattedValue : '-';
    },
    recmInstanceTypeValueFormatter(params) {
      let formattedValue = '';
      if (params.node.data.recmInstsTypNm) {
        formattedValue += params.node.data.recmInstsTypNm;
        if (params.node.data.recmVcpuCnt && params.node.data.recmMemSizeGib) {
          formattedValue += ` (vCPU: ${params.node.data.recmVcpuCnt} GiB: ${params.node.data.recmMemSizeGib})`;
        }
      }
      return formattedValue ? formattedValue : '-';
    },
    accountValueFormatter(params) {
      return params.node.data.acntNm && params.node.data.acntId
        ? `${params.node.data.acntNm}(${params.node.data.acntId})`
        : '-';
    },
    krwValueFormatter(params) {
      return _.isFinite(params.value) ? `￦${numberCutDecimal(params.value * this.exchgRate)}` : '￦0';
    },
    openComparisonPopup() {
      this.$emit('openPopup');
    },
    closeTooltip() {
      this.tooltip = false;
    },
    getColumnInfo({ cspTypCd }) {
      const columnInfo = {
        AWS: {
          columnDefs: [
            {
              headerName: this.$t('advisor.detailTable.resourceID'),
              field: 'rsrcId',
              resizable: true,
              minWidth: 150,
              headerClass: ['header-merge', 'custom-grid-header'],
              cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
              sortable: true,
              menuTabs: [],
              valueFormatter: (params) => params.value || '-',
            },
            {
              headerName: this.$t('advisor.detailTable.instanceSeparation'),
              field: 'acclMdlTypNm',
              resizable: true,
              headerClass: ['header-merge', 'custom-grid-header'],
              cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
              sortable: true,
              menuTabs: [],
              minWidth: 150,
              valueFormatter: (params) => params.value || '-',
            },
            {
              headerName: this.$t('advisor.detailTable.present'),
              children: [
                {
                  headerName: this.$t('advisor.detailTable.instanceType'),
                  colId: 'instanceType',
                  field: 'data',
                  resizable: true,
                  cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
                  sortable: true,
                  menuTabs: [],
                  valueFormatter: this.instanceTypeValueFormatter,
                  cellRenderer: this.instanceTypeRenderer,
                  tooltipValueGetter: this.instanceTypeValueFormatter,
                },
                {
                  headerName: this.$t('advisor.detailTable.region'),
                  field: 'regionSepNm',
                  resizable: true,
                  cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
                  sortable: true,
                  menuTabs: [],
                  valueFormatter: (params) => params.value || '-',
                },
                {
                  headerName: this.$t('advisor.detailTable.availableArea'),
                  field: 'azSepCd',
                  resizable: true,
                  cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
                  sortable: true,
                  menuTabs: [],
                  valueFormatter: (params) => params.value || '-',
                },
              ],
            },
            {
              headerName: this.$t('advisor.detailTable.recommendation'),
              children: [
                {
                  headerName: this.$t('advisor.detailTable.instanceType'),
                  colId: 'recmInstanceType',
                  field: 'data',
                  resizable: true,
                  cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
                  sortable: true,
                  menuTabs: [],
                  valueFormatter: this.recmInstanceTypeValueFormatter,
                  cellRenderer: this.recmInstanceTypeRenderer,
                  tooltipValueGetter: this.recmInstanceTypeValueFormatter,
                },
                {
                  headerName: this.$t('advisor.detailTable.region'),
                  field: 'recmRegionSepNm',
                  resizable: true,
                  cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
                  sortable: true,
                  menuTabs: [],
                  valueFormatter: (params) => params.value || '-',
                },
                {
                  headerName: this.$t('advisor.detailTable.availableArea'),
                  field: 'recmAzSepCd',
                  resizable: true,
                  cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
                  sortable: true,
                  menuTabs: [],
                  valueFormatter: (params) => params.value || '-',
                },
              ],
            },
            {
              headerName: this.$t('advisor.detailTable.onDemandCost'),
              field: 'ondmUseAmt',
              resizable: true,
              headerClass: ['header-merge', 'custom-grid-header'],
              cellClass: ['ag-grid-font', 'text-center', 'numberType'],
              sortable: true,
              menuTabs: [],
              minWidth: 150,
              valueFormatter: this.krwValueFormatter,
              tooltipValueGetter: this.krwValueFormatter,
            },
            {
              headerName: this.$t('advisor.detailTable.estimatedSavings'),
              field: 'expctSpotSaveAmt',
              resizable: true,
              headerClass: ['header-merge', 'custom-grid-header'],
              cellClass: ['ag-grid-font', 'text-center', 'numberType'],
              sortable: true,
              menuTabs: [],
              minWidth: 150,
              cellRenderer: this.savingCostCellRenderer,
              valueFormatter: this.krwValueFormatter,
              tooltipValueGetter: this.krwValueFormatter,
            },
            {
              headerName: this.$t('advisor.detailTable.estimatedSavingsRate'),
              field: 'expctSpotSaveRatio',
              resizable: true,
              headerClass: ['header-merge', 'custom-grid-header'],
              cellClass: ['ag-grid-font', 'text-center', 'percentType'],
              sortable: true,
              menuTabs: [],
              minWidth: 150,
              valueFormatter: (params) => (params.value ? params.value.toFixed(2) + '%' : '-'),
              tooltipValueGetter: (params) => (params.value ? params.value.toFixed(2) + '%' : '-'),
            },
            {
              headerName: this.$t('advisor.detailTable.spotComparison.title'),
              field: 'spotComparison',
              resizable: true,
              headerClass: ['header-merge', 'custom-grid-header'],
              cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
              sortable: true,
              menuTabs: [],
              minWidth: 150,
              cellRendererFramework: 'SpotComparisonCell',
              cellRendererParams: {
                onClick: this.openComparisonPopup,
              },
              tooltipValueGetter: (params) => this.$t('advisor.detailTable.spotComparison.title'),
            },
            {
              headerName: this.$t('advisor.detailTable.typeOfService'),
              field: 'cspPrdtNm',
              resizable: true,
              headerClass: ['header-merge', 'custom-grid-header'],
              cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
              sortable: true,
              menuTabs: [],
              minWidth: 150,
              valueFormatter: (params) => params.value || '-',
            },
            {
              headerName: this.$t('advisor.detailTable.operatingSystem'),
              field: 'osNm',
              resizable: true,
              headerClass: ['header-merge', 'custom-grid-header'],
              cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
              sortable: true,
              menuTabs: [],
              minWidth: 150,
              valueFormatter: (params) => params.value || '-',
            },
            {
              headerName: this.$t('advisor.detailTable.moreOptimization'),
              field: 'optiTypNm',
              resizable: true,
              headerClass: ['header-merge', 'custom-grid-header'],
              cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
              sortable: true,
              menuTabs: [],
              minWidth: 150,
              cellRendererFramework: 'OptimizationCell',
              tooltipValueGetter: (params) => params.value || '-',
            },
            {
              headerName: this.$t('advisor.detailTable.consolidatedAccount'),
              colId: 'linkedAccount',
              field: 'data',
              resizable: true,
              headerClass: ['header-merge', 'custom-grid-header'],
              cellClass: ['ag-grid-font', 'text-center', 'custom-grid-cell'],
              sortable: true,
              menuTabs: [],
              minWidth: 150,
              valueFormatter: this.accountValueFormatter,
              tooltipValueGetter: this.accountValueFormatter,
            },
          ],
        },
        AZURE: {
          columnDefs: [],
        },
      };
      return columnInfo[cspTypCd];
    },
  },
};
</script>
<style lang="scss">
#detailTable {
  .title-grid {
    line-height: 24px;
    padding: 23px 0px;
  }
  .custom-grid-cell {
    padding: 0 24px;
  }
  .custom-grid-header {
    padding: 0 24px;
  }
  .search-btn {
    padding: 0;
    margin-bottom: 12px;
    .btn {
      padding: 1px 16px;
    }
  }
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

  .header-merge {
    height: 100px !important;
    position: fixed !important;
    top: 0px;
    border-top: none !important;
  }

  .ag-header-group-cell-no-group {
    height: 0px !important;
  }

  .numberType {
    justify-content: right !important;
  }
  .percentType {
    justify-content: right !important;
  }
  .ag-row .ag-cell {
    display: flex;
    justify-content: center !important; /* align horizontal */
    align-items: center !important;
    line-height: 24px !important;
  }
  .detailTableDuration {
    font-size: 12px;
    height: 36px;
    width: 475px;
    display: flex;
    align-items: center;
    color: #b5b2b2;
    margin-left: 10px;
  }
}
</style>
