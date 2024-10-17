<template>
  <!-- module -->
  <div class="box-wrap">
    <div class="title">
      <div class="tab">
        <button :class="buttonClass('unused')" :disabled="type === 'unused'" @click.prevent="changeType('unused')">
          {{ $t('optimization.unusedResources') }}
        </button>
        <button
          class="ml-1.5"
          :class="buttonClass('all')"
          :disabled="type === 'all'"
          @click.prevent="changeType('all')"
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
        <a href="#" class="download" @click="excelDownload">{{ $t('common.button.downloadExcel') }}</a>
        <button class="fold jsFoldGrid" @click="setSideBarVisible"><span>{{ $t('common.button.columnSetting') }}</span></button>
      </div>
    </div>

    <template v-if="!isLoading">
      <div class="example-wrapper">
        <ag-grid-vue
          id="unusedGrid"
          ref="unusedGrid"
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
import { setApiConfig } from '@/library/APICaller';
import _ from 'lodash';
import UsagPopup from '@/pages/Rsrc/Usag/UsagPopup.vue';
import resourceService from '@/services/resourceService';
import axios from 'axios';

export default {
  components: { UsagPopup, AgGridVue, Paginate },
  mixins: [AgGridMixin()],
  data() {
    return {
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      defaultExcelExportParams: null,
      frameworkComponents: null,
      type: 'unused',
      param: {
        vndr: '',
        cmpnId: '',
        rsrcType: '',
        gridType: 'unused',
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
      updateUnusedResourceGrid: 'updateUnusedResourceGrid',
      isSearch: 'isSearch',
      chartData: 'chartData',
      selectedCustCorpIds: 'selectedCustCorpIds',
      svcGrpSelectedCustCorpIds: 'svcGrpSelectedCustCorpIds',
      cspReference: 'cspReference',
    }),
    ...mapGetters('resourceOpti', ['cspTypCd']),
    unusedResourceCategoryMap() {
      const unusedResourceCategoryMap = new Map();
      this.cspReference[this.cspTypCd].categoryList
        .filter((category) => category.isInUnusedResource)
        .forEach((category) =>
          unusedResourceCategoryMap.set(category.rsrcType, _.pick(category, ['code', 'name', 'rsrcType']))
        );
      return unusedResourceCategoryMap;
    },
  },
  watch: {
    '$i18n.locale': ['setColumn', 'setGridData'],
    updateUnusedResourceGrid: async function () {
      if (this.updateUnusedResourceGrid) {
        this.fetchUpdateUnusedResourceGrid(false);
        this.gridToolPanelVisible = false;
        this.usagePopupVisible = false;
        this.setColumn();
        await this.setGridData(true);
      }
    },
    category: function () {
      this.type = 'unused';
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
    ...mapActions('resourceOpti', ['fetchUpdateUnusedResourceGrid']),
    initPageObj() {
      this.pageObj.currentPageNo = 1;
      this.pageObj.pageSize = 10;
      this.pageObj.totalCnt = 0;
    },
    excelDownload() {
      const exportParams = {
        fileName: `${this.$t('optimization.unusedResources')}_${
          this.unusedResourceCategoryMap.get(this.category).name
        }_${moment().format('YYYY-MM-DD')}.xlsx`,
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
    getExchangeRate() {
      resourceOptiService.getExchangeRate().then((result) => {
        this.exchangeRate = result.data.data;
      });
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
      this.param.sortId = this.getColumnInfo({ cspTypCd: this.cspTypCd, category: this.category }).sortId;
      this.param.ocpSvcGrps = [];

      if (this.filter.svcGrpList.length > 0) {
        this.filter.svcGrpList.forEach((item) => {
          this.param.ocpSvcGrps.push(item.id);
        });
      }

      try {
        const result = await resourceOptiService.fetchList(this.param, { cancelToken: this.gridApiConfig.cancelToken });
        const responseData = result.data.data;

        if ('ok' === responseData.status) {
          this.optiTimeStmp = responseData.optiTimeStmp;
          if (
            this.type === 'unused' &&
            (this.category === 'ec2' ||
              this.category === 'rds' ||
              this.category === 'Microsoft.Compute/virtualMachines')
          ) {
            const filteredList = responseData.result.list.filter((item) => item.rcmd === 'Idle');

            this.pageObj.totalCnt = filteredList.length;
            this.rowData = filteredList;
          } else {
            this.pageObj.totalCnt = responseData.result.totalCnt;
            this.rowData = responseData.result.list;
          }
        } else {
          this.pageObj.totalCnt = 0;
          this.rowData = [];
        }
        this.isLoading = false;
        pageFlag ? this.pageChange(1) : '';
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching grid data:', e);
          this.pageObj.totalCnt = 0;
          this.rowData = [];
          this.isLoading = false;
        }
      }
    },
    setColumn() {
      this.columnDefs = this.getColumnInfo({ cspTypCd: this.cspTypCd, category: this.category }).columnDefs;
      this.defaultColDef = { flex: -1, filter: true };
      this.enabledTooltips(this.columnDefs);
    },
    pageChange(pageNo) {
      this.pageObj.currentPageNo = pageNo;
      this.gridApi.paginationGoToPage(pageNo - 1);
    },
    changeType(type) {
      this.type = type;
      this.pageObj.currentPageNo = 1;
      this.$emit('onTypeChanged');
    },
    buttonClass(type) {
      const button = 'inline-block rounded px-2 py-1.5 font-bold border border-primary-400 text-sm ';
      return this.type === type ? button + 'text-white bg-primary-400' : button + 'text-primary-400 bg-white';
    },
    autoSizeAll() {
      let gridId = 'unusedGrid_' + this.category;
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
      // Azure 리소스 '자원 ID' 컬럼 제외하고 autoSize 적용
      let resizableColumns = this.gridColumnApi.getAllColumns().filter((column) => column.getColId() !== 'id');
      this.gridColumnApi.autoSizeColumns(resizableColumns);
    },
    onSaveGridColumnState(e) {
      if (!this.gridColumnApi) return;
      let gridId = 'unusedGrid_' + this.category;
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
      const savingCostCellRenderer = (params) => {
        return params.value && params.value !== '-'
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
            sortId: 'savgCostDesc',
            columnDefs: [
              {
                field: 'instId',
                headerName: this.$t('optimization.resourceID'),
                resizable: true,
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
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rcmd',
                headerName: this.$t('optimization.unusedType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instType',
                headerName: this.$t('optimization.instanceType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'os',
                headerName: this.$t('optimization.operatingSystem'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'savgCostDesc',
                headerName: this.$t('optimization.estimatedCostSavings'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-right', 'number-cell'],
                sortable: true,
                menuTabs: [],
                cellRenderer: savingCostCellRenderer,
                valueFormatter: (params) =>
                  params.value ? `￦${numberCutDecimal(params.value * this.exchangeRate)}` : '￦0',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('optimization.serviceGroup'),
                minWidth: 131,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rgnNm',
                headerName: this.$t('optimization.region'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('optimization.linkedAccount'),
                resizable: true,
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
            sortId: 'savgCostDesc',
            columnDefs: [
              {
                field: 'instId',
                headerName: this.$t('optimization.resourceID'),
                resizable: true,
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
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rcmd',
                headerName: this.$t('optimization.unusedType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'savgCostDesc',
                headerName: this.$t('optimization.estimatedCostSavings'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-right'],
                sortable: true,
                menuTabs: [],
                cellRenderer: savingCostCellRenderer,
                valueFormatter: (params) =>
                  params.value ? `￦${numberCutDecimal(params.value * this.exchangeRate)}` : '￦0',
              },
              {
                field: 'offInstType',
                headerName: this.$t('optimization.engine'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'engnVer',
                headerName: this.$t('optimization.engineVersion'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('optimization.region'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('optimization.serviceGroup'),
                minWidth: 131,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'accAlias',
                headerName: this.$t('optimization.linkedAccount'),
                resizable: true,
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
          ebs: {
            sortId: 'cost',
            columnDefs: [
              {
                field: 'instId',
                headerName: this.$t('optimization.resourceID'),
                resizable: true,
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
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'unusedType',
                headerName: this.$t('optimization.unusedType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instType',
                headerName: this.$t('optimization.instanceType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'stateName',
                headerName: this.$t('optimization.resourceStatus'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'cost',
                headerName: this.$t('optimization.estimatedCostSavings'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-right'],
                sortable: true,
                menuTabs: [],
                cellRenderer: savingCostCellRenderer,
                valueFormatter: (params) =>
                  params.value ? `￦${numberCutDecimal(params.value * this.exchangeRate)}` : '￦0',
              },
              {
                field: 'instType',
                headerName: this.$t('optimization.instanceType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'size',
                headerName: this.$t('optimization.storageSize'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'iops',
                headerName: this.$t('optimization.operationsPerSecond'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('optimization.serviceGroup'),
                minWidth: 131,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rgnNm',
                headerName: this.$t('optimization.region'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('optimization.linkedAccount'),
                resizable: true,
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
          'load-balancers': {
            sortId: 'costDirection',
            columnDefs: [
              {
                field: 'instId',
                headerName: this.$t('optimization.resourceID'),
                resizable: true,
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
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'unusedType',
                headerName: this.$t('optimization.unusedType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'costDirection',
                headerName: this.$t('optimization.estimatedCostSavings'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-right'],
                sortable: true,
                menuTabs: [],
                cellRenderer: savingCostCellRenderer,
                valueFormatter: (params) =>
                  params.value ? `￦${numberCutDecimal(params.value * this.exchangeRate)}` : '￦0',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('optimization.region'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('optimization.serviceGroup'),
                minWidth: 131,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'accAlias',
                headerName: this.$t('optimization.linkedAccount'),
                resizable: true,
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
          eip: {
            sortId: 'cost',
            columnDefs: [
              {
                field: 'instId',
                headerName: this.$t('optimization.resourceID'),
                resizable: true,
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
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'unusedType',
                headerName: this.$t('optimization.unusedType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'cost',
                headerName: this.$t('optimization.estimatedCostSavings'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-right'],
                sortable: true,
                menuTabs: [],
                cellRenderer: savingCostCellRenderer,
                valueFormatter: (params) =>
                  params.value ? `￦${numberCutDecimal(params.value * this.exchangeRate)}` : '￦0',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('optimization.region'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('optimization.serviceGroup'),
                minWidth: 131,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'accAlias',
                headerName: this.$t('optimization.linkedAccount'),
                resizable: true,
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
            sortId: 'savgCostDesc',
            columnDefs: [
              {
                field: 'id',
                headerName: this.$t('optimization.resourceID'),
                type: 'azureResourceId',
                suppressColumnsToolPanel: true,
                resizable: false,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center', 'no-display-in-grid'],
                sortable: false,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instId',
                headerName: this.$t('optimization.resourceName'),
                resizable: true,
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
                headerName: this.$t('optimization.unusedType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instType',
                headerName: this.$t('optimization.instanceType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'savgCostDesc',
                headerName: this.$t('optimization.estimatedCostSavings'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-right', 'number-cell'],
                sortable: true,
                menuTabs: [],
                cellRenderer: savingCostCellRenderer,
                valueFormatter: (params) =>
                  params.value ? `￦${numberCutDecimal(params.value * this.exchangeRate)}` : '￦0',
              },
              {
                field: 'os',
                headerName: 'OS',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('optimization.subscriptionName'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('optimization.region'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('optimization.serviceGroup'),
                minWidth: 131,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('optimization.resourceGroup'),
                minWidth: 131,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: resourceGroupValueFormatter,
              },
            ],
          },
          'Microsoft.Compute/disks': {
            sortId: 'cost',
            columnDefs: [
              {
                field: 'id',
                headerName: this.$t('optimization.resourceID'),
                type: 'azureResourceId',
                suppressColumnsToolPanel: true,
                resizable: false,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center', 'no-display-in-grid'],
                sortable: false,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instId',
                headerName: this.$t('optimization.resourceName'),
                resizable: true,
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
                field: 'unusedType',
                headerName: this.$t('optimization.unusedType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instType',
                headerName: this.$t('optimization.instanceType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'stateName',
                headerName: this.$t('optimization.resourceStatus'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'cost',
                headerName: this.$t('optimization.estimatedCostSavings'),
                minWidth: 186,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-right'],
                sortable: true,
                menuTabs: [],
                cellRenderer: savingCostCellRenderer,
                valueFormatter: (params) =>
                  params.value ? `￦${numberCutDecimal(params.value * this.exchangeRate)}` : '￦0',
              },
              {
                field: 'size',
                headerName: this.$t('optimization.diskSizeGB'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'iops',
                headerName: 'IOPS',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                minWidth: 170,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('optimization.subscriptionName'),
                minWidth: 170,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('optimization.region'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('optimization.serviceGroup'),
                minWidth: 131,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('optimization.resourceGroup'),
                minWidth: 131,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: resourceGroupValueFormatter,
              },
            ],
          },
          'Microsoft.Network/loadBalancers': {
            sortId: 'costDirection',
            columnDefs: [
              {
                field: 'id',
                headerName: this.$t('optimization.resourceID'),
                type: 'azureResourceId',
                suppressColumnsToolPanel: true,
                resizable: false,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center', 'no-display-in-grid'],
                sortable: false,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instId',
                headerName: this.$t('optimization.resourceName'),
                resizable: true,
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
                field: 'unusedType',
                headerName: this.$t('optimization.unusedType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'costDirection',
                headerName: this.$t('optimization.estimatedCostSavings'),
                minWidth: 186,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-right'],
                sortable: true,
                menuTabs: [],
                cellRenderer: savingCostCellRenderer,
                valueFormatter: (params) =>
                  params.value ? `￦${numberCutDecimal(params.value * this.exchangeRate)}` : '￦0',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                minWidth: 170,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('optimization.subscriptionName'),
                minWidth: 170,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('optimization.region'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('optimization.serviceGroup'),
                minWidth: 131,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('optimization.resourceGroup'),
                minWidth: 131,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: resourceGroupValueFormatter,
              },
            ],
          },
          'Microsoft.Network/publicIPAddresses': {
            sortId: 'cost',
            columnDefs: [
              {
                field: 'id',
                headerName: this.$t('optimization.resourceID'),
                type: 'azureResourceId',
                suppressColumnsToolPanel: true,
                resizable: false,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center', 'no-display-in-grid'],
                sortable: false,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instId',
                headerName: this.$t('optimization.resourceName'),
                resizable: true,
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
                field: 'unusedType',
                headerName: this.$t('optimization.unusedType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instType',
                headerName: this.$t('optimization.instanceType'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'cost',
                headerName: this.$t('optimization.estimatedCostSavings'),
                minWidth: 186,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-right'],
                sortable: true,
                menuTabs: [],
                cellRenderer: savingCostCellRenderer,
                valueFormatter: (params) =>
                  params.value ? `￦${numberCutDecimal(params.value * this.exchangeRate)}` : '￦0',
              },
              {
                field: 'ipAddr',
                headerName: this.$t('optimization.ipAddress'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                minWidth: 170,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('optimization.subscriptionName'),
                minWidth: 170,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('optimization.region'),
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('optimization.serviceGroup'),
                minWidth: 131,
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('optimization.resourceGroup'),
                minWidth: 131,
                resizable: true,
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
.ag-header-cell-label {
  justify-content: center;
}

#unusedGrid .ag-header-cell-text {
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
</style>
