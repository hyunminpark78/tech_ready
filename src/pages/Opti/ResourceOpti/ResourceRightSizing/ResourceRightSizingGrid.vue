<template>
  <!-- module -->
  <div v-if="category !== 's3'" class="box-wrap">
    <div class="title">
      <div class="tab">
        <button :class="buttonClass('rs')" :disabled="type === 'rs'" @click.prevent="updateType('rs')">
          Rightsizing
        </button>
        <button
          class="ml-1.5"
          :class="buttonClass('all')"
          :disabled="type === 'all'"
          @click.prevent="updateType('all')"
        >
          {{ $t('optimization.all') }}
        </button>
      </div>
      <!-- search -->
      <div class="search-wrap">
        <input
          v-model="param.searchText"
          type="text"
          :placeholder="$t('common.placeholder.enterSearchTerm')"
          class="keyword"
          @keydown.enter="setGridData"
        />
        <a href="#" class="btn" @click="setGridData">{{ $t('common.button.search') }}</a>
      </div>
      <!-- //search -->
      <div class="pos-right">
        <span v-if="optiTimeStmp != null" class="date">{{ $t('optimization.analysisTime') }} : {{ optiTimeStmp }}</span>
        <a href="#" class="download" @click="excelDownload">{{ $t('resource.downloadExcel') }}</a>
        <button class="fold jsFoldGrid" @click="setSideBarVisible">
          <span>{{ $t('resource.columnSetting') }}</span>
        </button>
      </div>
    </div>
    <div style="height: 100%" class="bl_none">
      <template v-if="!isLoading">
        <div class="example-wrapper">
          <ag-grid-vue
            id="rightsizingGrid"
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
    </div>
    <Paginate
      v-if="pageObj.totalCnt > 0"
      :page-size="pageObj.pageSize"
      :page-no="pageObj.currentPageNo"
      :total-cnt="pageObj.totalCnt"
      @changepage="pageChange"
    />
    <UsagPopup
      v-if="usagePopupVisible"
      :visible="usagePopupVisible"
      :detail-data="detailData"
      :screen-x="screenX"
      :screen-y="screenY"
      @close="popupClose"
    ></UsagPopup>
  </div>
  <!-- //module -->
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import Paginate from '@/components/Paginate.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import moment from 'moment';
import resourceOptiService from '@/services/resourceOptiService';
import { numberCutDecimal } from '@/pages/Opti/CostOpti/CmmtPsblTgt/CostOptiCommon';
import icoDown from '@/assets/images/ico-down.svg';
import _ from 'lodash';
import UsagPopup from '@/pages/Rsrc/Usag/UsagPopup.vue';
import resourceService from '@/services/resourceService';
import UtilizationTooltip from './UtilizationTooltip';
import performanceService from '@/services/performanceService';
import { setApiConfig } from '@/library/APICaller';
import axios from 'axios';

export default {
  components: { UsagPopup, AgGridVue, Paginate, UtilizationTooltip },
  mixins: [AgGridMixin()],
  data() {
    return {
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      defaultExcelExportParams: null,
      frameworkComponents: null,
      rowSpanClass: null,
      type: 'rs',
      param: {
        vndr: '',
        cmpnId: '',
        rsrcType: '',
        gridType: 'rs',
        accList: [],
        rgnList: [],
        ocpSvcGrps: [],
        sortId: 'savgCostDesc',
        sortOrder: 'desc',
        searchText: '',
      },
      pageObj: {
        currentPageNo: 1,
        pageSize: 10,
        totalCnt: 0,
      },
      optiTimeStmp: null,
      exchangeRate: 0,
      usagePopupVisible: false,
      detailData: {},
      screenX: 0,
      screenY: 0,
      tooltipMsg: '사용률은 30일 동안 실제 인스턴스의 기동 시간에 대한 비율입니다.',
      isSetGridDataCalled: false,
      gridToolPanelVisible: false,
      isLoading: false,
      gridApiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
    };
  },
  computed: {
    ...mapState('resourceOpti', {
      filter: 'filter',
      category: 'category',
      updateRightsizingGrid: 'updateRightsizingGrid',
      isSearch: 'isSearch',
      chartData: 'chartData',
      selectedCustCorpIds: 'selectedCustCorpIds',
      svcGrpSelectedCustCorpIds: 'svcGrpSelectedCustCorpIds',
      cspReference: 'cspReference',
    }),
    ...mapGetters('resourceOpti', ['cspTypCd']),
    rightsizingCategoryMap() {
      const rightsizingCategoryMap = new Map();
      this.cspReference[this.cspTypCd].categoryList
        .filter((category) => category.isInRightSizing)
        .forEach((category) =>
          rightsizingCategoryMap.set(category.rsrcType, _.pick(category, ['code', 'name', 'rsrcType']))
        );
      return rightsizingCategoryMap;
    },
  },
  watch: {
    '$i18n.locale': ['setColumn', 'setGridData'],
    updateRightsizingGrid: async function () {
      if (this.updateRightsizingGrid) {
        this.fetchUpdateRightsizingGrid(false);
        if (this.category !== 's3') {
          this.gridToolPanelVisible = false;
          this.usagePopupVisible = false;
          this.setColumn();
          await this.setGridData(true);
        }
      }
    },
    category: function () {
      this.type = 'rs';
      this.param.searchText = '';
    },
  },
  created() {
    this.getExchangeRate();
  },
  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      enableAdvancedFilter: true,
      suppressCellSelection: true,
      tooltipShowDelay: 0, // 툴팁 표시 지연 시간
      tooltipHideDelay: 2000, // 툴팁 숨김 지연 시간
      onCellClicked: (params) => {
        this.onCellClicked(params);
      },
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
      columnTypes: {
        azureResourceId: {
          maxWidth: 0,
        },
      },
    };
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
      UtilizationTooltip: UtilizationTooltip,
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
    ...mapActions('resourceOpti', ['fetchUpdateRightsizingGrid']),
    initPageObj() {
      this.pageObj.currentPageNo = 1;
      this.pageObj.pageSize = 10;
      this.pageObj.totalCnt = 0;
    },
    setColumnDebounced: _.debounce(function () {
      this.setColumn();
    }, 200),
    setGridDataDebounced: _.debounce(function () {
      this.setGridData(true);
    }, 200),
    getExchangeRate() {
      resourceOptiService.getExchangeRate().then((result) => {
        this.exchangeRate = result.data.data;
      });
    },
    excelDownload() {
      const exportParams = {
        fileName: `Rightsizing_${this.rightsizingCategoryMap.get(this.category).name}_${moment().format(
          'YYYY-MM-DD'
        )}.xlsx`,
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
    getDataPath: function (data) {
      return data.orgHierarchy;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.autoSizeAll();
      this.gridApi.sizeColumnsToFit();
    },
    autoSizeAll() {
      let gridId = 'rightSizingGrid_' + this.category;
      let columnState = localStorage.getItem(gridId + '_columnState');
      let columnGroupState = localStorage.getItem(gridId + '_columnGroupState');

      if (columnState) {
        this.gridColumnApi.applyColumnState({
          state: JSON.parse(columnState),
          applyOrder: true,
        });
      }
      if (columnGroupState) {
        this.gridColumnApi.setColumnGroupState(JSON.parse(columnGroupState));
      }
      // this.gridColumnApi.autoSizeAllColumns();
      // Azure 리소스 '자원 ID' 컬럼 제외하고 autoSize 적용
      let resizableColumns = this.gridColumnApi.getAllColumns().filter((column) => column.getColId() !== 'id');
      this.gridColumnApi.autoSizeColumns(resizableColumns);
    },
    onSaveGridColumnState(e) {
      if (!this.gridColumnApi) return;
      let gridId = 'rightSizingGrid_' + this.category;
      let columnState = this.gridColumnApi.getColumnState();
      let columnGroupState = this.gridColumnApi.getColumnGroupState();
      localStorage.setItem(gridId + '_columnState', JSON.stringify(columnState));
      localStorage.setItem(gridId + '_columnGroupState', JSON.stringify(columnGroupState));
    },
    extractAcntIdsFromSvcGrpList(svcGrpList) {
      if (svcGrpList && svcGrpList.length > 0) {
        let acntIds = svcGrpList.flatMap((svcGrpItem) => svcGrpItem.acntList.map((acntItem) => acntItem.id));

        return [...new Set(acntIds)];
      } else {
        return [];
      }
    },
    async setGridData(pageFlag) {
      this.isLoading = true;
      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.gridApiConfig.cancelTokenSource) {
        this.gridApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.gridApiConfig);

      this.rowData = [];
      this.optiTimeStmp = null;
      this.param.vndr = this.cspReference[this.cspTypCd].vndr;
      this.param.rsrcType = this.category;
      this.param.cmpnId = this.selectedCustCorpIds[0].id;
      this.param.accList = this.filter.acntIdList ? this.filter.acntIdList : [];
      this.param.rgnList = this.filter.regionList ? this.filter.regionList : [];
      this.param.gridType = this.type;
      this.param.ocpSvcGrps = [];

      if (this.filter.svcGrpList.length > 0) {
        this.filter.svcGrpList.forEach((item) => {
          this.param.ocpSvcGrps.push(item.id);
        });
      }

      try {
        const result = await resourceOptiService.fetchGrid(this.param, { cancelToken: this.gridApiConfig.cancelToken });
        const responseData = result.data.data;

        this.optiTimeStmp = responseData.optiTimeStmp;
        this.rowData = responseData.result.list;

        if (
          this.type === 'rs' &&
          (this.category === 'ec2' || this.category === 'rds' || this.category === 'Microsoft.Compute/virtualMachines')
        ) {
          this.rowData = this.rowData.filter((item) => item.rcmd !== 'Idle');
        }
        this.pageObj.totalCnt = this.rowData.length;

        this.isLoading = false;
        pageFlag ? this.pageChange(1) : '';
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('fetch grid data', e);
          this.pageObj.totalCnt = 0;
          this.rowData = [];
          this.isLoading = false;
        }
      }
    },

    setColumn() {
      this.columnDefs = this.getColumnInfo({ cspTypCd: this.cspTypCd, category: this.category }).columnDefs;
      this.defaultColDef = {
        flex: 1,
        suppressRowTransform: true,
        filter: true,
        // allow every column to be aggregated
        enableValue: false,
        // allow every column to be grouped
        enableRowGroup: false,
        // allow every column to be pivoted
        enablePivot: false,
      };
      this.enabledTooltips(this.columnDefs);
    },
    pageChange(pageNo) {
      this.pageObj.currentPageNo = pageNo;
      this.gridApi.paginationGoToPage(pageNo - 1);
    },
    updateType(type) {
      this.type = type;
      this.pageObj.currentPageNo = 1;
      this.$emit('onTypeChanged');
    },
    buttonClass(type) {
      const button = 'inline-block rounded px-2 py-1.5 font-bold border border-primary-400 text-sm ';
      return this.type === type ? button + 'text-white bg-primary-400' : button + 'text-primary-400 bg-white';
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
    popupClose() {
      this.usagePopupVisible = false;
    },
    async onCellClicked(params) {
      if (params.column.colId === 'instId') {
        this.screenX = params.event.pageX + 300;
        this.screenY = params.event.pageY - 275;

        let param = {};
        param.prvrCd = this.cspReference[this.cspTypCd].vndr;
        param.cmpnId = params.data.cmpnId; // company ID
        param.rsrcType = this.category;
        param.instId = params.data.instId; // resource ID (AWS)
        param.rsrcId = params.data.id; // resource ID (Azure)
        param.rgnId = params.data.rgnId; // region ID
        param.accId = params.data.accId; // account ID

        try {
          this.usagePopupVisible = false;
          this.detailData = {};
          await resourceService.fetchDetailTag(param).then((res) => {
            if (res.data.data.status === 'ok') {
              this.detailData.tags = res.data.data.data;
            } else {
              this.detailData.tags = [];
            }
          });
        } finally {
          this.detailData.id = this.cspTypCd === 'AZURE' ? param.rsrcId : param.instId;
          this.usagePopupVisible = true;
        }
      }
    },
    setSideBarVisible() {
      this.gridToolPanelVisible = !this.gridToolPanelVisible;
      this.gridOptions.api.setSideBarVisible(this.gridToolPanelVisible);
      this.gridOptions.api.openToolPanel('columns');
    },
    getColumnInfo({ cspTypCd, category }) {
      const koreanWonValueFormatter = (params) => {
        return params.value ? `￦${numberCutDecimal(params.value * this.exchangeRate)}` : '￦0';
      };
      const savingCostCellRenderer = (params) => {
        return params.value
          ? `<div class="flex items-center justify-end" style="margin-right: 0px;"><img src="${icoDown}" alt="." style="margin-right: 3px;"/>￦` +
              numberCutDecimal(params.value * this.exchangeRate) +
              '</div>'
          : '￦0';
      };
      const serviceGroupValueFormatter = (params) => (params.value ? params.value.toString().replace(',', ', ') : '-');
      const resourceGroupValueFormatter = (params) =>
        params.value ? params.value.toString().toUpperCase().replace(',', ', ') : '-';

      const columnInfo = {
        AWS: {
          ec2: {
            columnDefs: [
              {
                field: 'instId',
                headerName: this.$t('optimization.resourceId'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'nmVal',
                headerName: this.$t('optimization.resourceName'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rcmd',
                headerName: this.$t('optimization.optimizationRecommendations'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                cellRenderer: (params) => {
                  if (params.value === 'Modernize') {
                    return (
                      `
                <div style="width: 100%; height: 100%">
                  <div style="background-color: #2CC2FD;">` +
                      params.value +
                      `</div>
                </div>
              `
                    );
                  } else if (params.value === 'Downsize') {
                    return (
                      `
                <div style="width: 100%; height: 100%">
                  <div style="background-color: #1AE3BB;">` +
                      params.value +
                      `</div>
                </div>
              `
                    );
                  } else {
                    return (
                      `
                <div style="width: 100%; height: 100%">
                  <div style="background-color: #DEDEDE;">` +
                      params.value +
                      `</div>
                </div>
              `
                    );
                  }
                },
              },
              {
                field: 'savgCostDesc',
                headerName: this.$t('optimization.estimatedCostSavings'),
                minWidth: 200,
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-right'],
                sortable: true,
                menuTabs: [],
                cellRenderer: savingCostCellRenderer,
                valueFormatter: koreanWonValueFormatter,
              },
              {
                headerName: this.$t('optimization.instanceType'),
                children: [
                  {
                    field: 'instType',
                    headerName: this.$t('optimization.current'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                    tooltipValueGetter: (params) => params.valueFormatted || params.value,
                  },
                  {
                    field: 'rcmdType',
                    headerName: this.$t('optimization.recommendation'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                    tooltipValueGetter: (params) => params.valueFormatted || params.value,
                  },
                ],
              },
              {
                headerName: this.$t('optimization.calculationCost'),
                cellClass: ['ag-grid-font', 'text-center', 'estimated-cost-header-group'],
                children: [
                  {
                    field: 'prevCost',
                    headerName: this.$t('optimization.current'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-right'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: koreanWonValueFormatter,
                    tooltipValueGetter: (params) => params.valueFormatted || params.value,
                  },
                  {
                    field: 'rcmdCost',
                    headerName: this.$t('optimization.recommendation'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-right'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: koreanWonValueFormatter,
                    tooltipValueGetter: (params) => params.valueFormatted || params.value,
                  },
                ],
              },
              {
                field: 'os',
                headerName: this.$t('optimization.operatingSystem'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('optimization.region'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('optimization.serviceGroup'),
                resizable: true,
                minWidth: 131,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'accAlias',
                headerName: this.$t('optimization.linkedAccount'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => {
                  if (params.value) {
                    return `${params.node.data.accAlias}(${params.node.data.accId})`;
                  } else {
                    return '-';
                  }
                },
              },
            ],
          },
          rds: {
            columnDefs: [
              {
                field: 'instId',
                headerName: this.$t('optimization.resourceId'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'nmVal',
                headerName: this.$t('optimization.resourceName'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rcmd',
                headerName: this.$t('optimization.optimizationRecommendations'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                cellRenderer: (params) => {
                  if (params.value === 'Modernize' && params.node.data.rcmdType !== 'Terminate') {
                    return (
                      `
                <div style="width: 100%; height: 100%">
                  <div style="background-color: #2CC2FD;">` +
                      params.value +
                      `</div>
                </div>
              `
                    );
                  } else if (
                    (params.value === 'Downsize' || params.value === 'Idle') &&
                    params.node.data.rcmdType !== 'Terminate'
                  ) {
                    return (
                      `
                <div style="width: 100%; height: 100%">
                  <div style="background-color: #1AE3BB;">` +
                      'Downsize' +
                      `</div>
                </div>
              `
                    );
                  } else {
                    return (
                      `
                <div style="width: 100%; height: 100%">
                  <div style="background-color: #DEDEDE;">` +
                      params.value +
                      `</div>
                </div>
              `
                    );
                  }
                },
              },
              {
                field: 'savgCostDesc',
                headerName: this.$t('optimization.estimatedCostSavings'),
                minWidth: 200,
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-right'],
                sortable: true,
                menuTabs: [],
                cellRenderer: savingCostCellRenderer,
                valueFormatter: koreanWonValueFormatter,
              },
              {
                headerName: this.$t('optimization.instanceType'),
                children: [
                  {
                    field: 'instType',
                    headerName: this.$t('optimization.current'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                    tooltipValueGetter: (params) => params.valueFormatted || params.value,
                  },
                  {
                    field: 'rcmdType',
                    headerName: this.$t('optimization.recommendation'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                    tooltipValueGetter: (params) => params.valueFormatted || params.value,
                  },
                ],
              },
              {
                headerName: this.$t('optimization.calculationCost'),
                cellClass: ['ag-grid-font', 'text-center', 'estimated-cost-header-group'],
                children: [
                  {
                    field: 'prevCost',
                    headerName: this.$t('optimization.current'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-right'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: koreanWonValueFormatter,
                    tooltipValueGetter: (params) => params.valueFormatted || params.value,
                  },
                  {
                    field: 'rcmdCost',
                    headerName: this.$t('optimization.recommendation'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-right'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: koreanWonValueFormatter,
                    tooltipValueGetter: (params) => params.valueFormatted || params.value,
                  },
                ],
              },
              {
                field: 'offInstType',
                headerName: this.$t('optimization.engine'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'engnVer',
                headerName: this.$t('optimization.engineVersion'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('optimization.region'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('optimization.serviceGroup'),
                resizable: true,
                minWidth: 131,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'accAlias',
                headerName: this.$t('optimization.linkedAccount'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => {
                  if (params.value) {
                    return `${params.node.data.accAlias}(${params.node.data.accId})`;
                  } else {
                    return '-';
                  }
                },
              },
            ],
          },
        },
        AZURE: {
          'Microsoft.Compute/virtualMachines': {
            columnDefs: [
              {
                field: 'id',
                headerName: this.$t('optimization.resourceID'),
                type: 'azureResourceId',
                suppressColumnsToolPanel: true,
                resizable: false,
                menuTabs: [],
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center', 'no-display-in-grid'],
                sortable: false,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instId',
                headerName: this.$t('optimization.resourceName'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'rcmd',
                headerName: this.$t('optimization.optimizationRecommendations'),
                resizable: true,
                minWidth: 250,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                cellRenderer: (params) => {
                  if (params.value === 'Modernize') {
                    return (
                      `
                <div style="width: 100%; height: 100%">
                  <div style="background-color: #2CC2FD;">` +
                      params.value +
                      `</div>
                </div>
              `
                    );
                  } else if (params.value === 'Downsize') {
                    return (
                      `
                <div style="width: 100%; height: 100%">
                  <div style="background-color: #1AE3BB;">` +
                      params.value +
                      `</div>
                </div>
              `
                    );
                  } else {
                    return (
                      `
                <div style="width: 100%; height: 100%">
                  <div style="background-color: #DEDEDE;">` +
                      params.value +
                      `</div>
                </div>
              `
                    );
                  }
                },
              },
              {
                field: 'savgCostDesc',
                headerName: this.$t('optimization.estimatedCostSavings'),
                minWidth: 200,
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-right'],
                sortable: true,
                menuTabs: [],
                cellRenderer: savingCostCellRenderer,
                valueFormatter: koreanWonValueFormatter,
              },
              {
                headerName: this.$t('resource.instanceType'),
                children: [
                  {
                    field: 'instType',
                    headerName: this.$t('optimization.current'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                    tooltipValueGetter: (params) => params.valueFormatted || params.value,
                  },
                  {
                    field: 'rcmdType',
                    headerName: this.$t('optimization.recommendation'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                    tooltipValueGetter: (params) => params.valueFormatted || params.value,
                  },
                ],
              },
              {
                headerName: this.$t('optimization.calculationCost'),
                cellClass: ['ag-grid-font', 'text-center', 'estimated-cost-header-group'],
                children: [
                  {
                    field: 'prevCost',
                    headerName: this.$t('optimization.current'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-right'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: koreanWonValueFormatter,
                    tooltipValueGetter: (params) => params.valueFormatted || params.value,
                  },
                  {
                    field: 'rcmdCost',
                    headerName: this.$t('optimization.recommendation'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-right'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: koreanWonValueFormatter,
                    tooltipValueGetter: (params) => params.valueFormatted || params.value,
                  },
                ],
              },
              {
                field: 'os',
                headerName: 'OS',
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('optimization.subscriptionName'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('optimization.region'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('optimization.serviceGroup'),
                resizable: true,
                minWidth: 131,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('optimization.resourceGroup'),
                resizable: true,
                minWidth: 131,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: resourceGroupValueFormatter,
              },
            ],
          },
        },
      };

      return columnInfo[cspTypCd][category];
    },
  },
};
</script>
<style>
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

#rightsizingGrid .ag-header-cell-text {
  white-space: pre !important;
  text-align: center !important;
}

.ag-root-wrapper-body .no-display-in-grid {
  display: none !important;
}

.percent-box {
  /* width: 100%; */
  width: 110px;
  height: 47%;
  margin: 10px 0 0 7px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: flex-start;
}
.fill {
  flex-grow: 1;
  background: linear-gradient(
    to right,
    var(--fill-color) 0%,
    var(--fill-color) var(--percent),
    transparent var(--percent)
  );
}
.outDiv {
  height: 100%;
  width: 109%;
  display: flex; /* Flexbox 레이아웃 사용 */
  justify-content: space-between; /* 요소들 사이의 간격을 균등하게 배치 */
}
.ag-body-viewport {
  min-height: 120px;
}
.rowSpanClass {
  row-span: 2;
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
.ag-pinned-left-header .ag-header-row-column {
  top: 0 !important;
  height: 96px !important;
}
.ag-pinned-left-header .header-merge {
  position: inherit !important;
}
</style>
