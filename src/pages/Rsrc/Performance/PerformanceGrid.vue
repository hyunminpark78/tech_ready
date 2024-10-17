<template>
  <div class="box-wrap">
    <div class="title">
      <!-- search -->
      <div class="search-wrap">
        <input
          id="searchText"
          v-model="param.searchText"
          type="text"
          :placeholder="$t('common.placeholder.enterSearchTerm')"
          class="keyword"
          @keydown.enter="searchGridData()"
        />
        <a href="#" class="btn" @click="searchGridData()">{{ $t('common.button.search') }}</a>
      </div>
      <!-- //search -->
      <div class="pos-right">
        <span class="date">{{ $t('resource.standardTime') }} : {{ currentTime }}</span>
        <a href="#" class="download" @click="excelDownload">{{ $t('resource.downloadExcel') }}</a>
        <button class="fold jsFoldGrid" @click="setSideBarVisible">
          <span>{{ $t('resource.columnSetting') }}</span>
        </button>
      </div>
    </div>
    <template v-if="!isLoading">
      <div class="example-wrapper">
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
</template>
<script>
import moment from 'moment';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import Paginate from '@/components/Paginate.vue';
import { numberCutDecimal } from '@/pages/Opti/CostOpti/CmmtPsblTgt/CostOptiCommon';
import { mapActions, mapGetters, mapState } from 'vuex';
import performanceService from '@/services/performanceService';
import UsagPopup from '@/pages/Rsrc/Usag/UsagPopup.vue';
import resourceService from '@/services/resourceService';
import { setApiConfig } from '@/library/APICaller';
import _ from 'lodash';
import axios from 'axios';

export default {
  components: { AgGridVue, Paginate, UsagPopup },
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
      currentTime: '',
      pageObj: {
        currentPageNo: 1,
        pageSize: 10,
        totalCnt: 0,
      },
      param: {
        cmpnId: '',
        prvrCd: '',
        rsrcType: '',
        type: 'day',
        viewType: 'day',
        to: '',
        from: '',
        searchText: '',
        sortColId: 'no',
        sortDirection: 'ASC',
        accounts: [],
        regions: [],
        ocpSvcGrps: [],
      },
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
    ...mapState('performance', {
      filter: 'filter',
      category: 'category',
      updatePerformanceGrid: 'updatePerformanceGrid',
      isSearch: 'isSearch',
      chartData: 'chartData',
      companyId: 'selectedCustCorpIds',
      svcGrpSelectedCustCorpIds: 'svcGrpSelectedCustCorpIds',
      dateType: 'dateType',
      dateRange: 'dateRange',
      cspReference: 'cspReference',
    }),
    ...mapGetters('performance', ['cspTypCd']),
    performanceCategoryMap() {
      const performanceCategoryMap = new Map();
      this.cspReference[this.cspTypCd].categoryList
        .filter((category) => category.isInPerformance)
        .forEach((category) =>
          performanceCategoryMap.set(category.rsrcType, _.pick(category, ['code', 'name', 'rsrcType']))
        );
      return performanceCategoryMap;
    },
  },
  watch: {
    '$i18n.locale': ['setColumn', 'setGridData'],
    updatePerformanceGrid: async function () {
      if (this.updatePerformanceGrid) {
        this.fetchUpdatePerformanceGrid(false);
        this.gridToolPanelVisible = false;
        this.usagePopupVisible = false;
        this.setColumn();
        await this.setGridData();
      }
    },
    category: function () {
      this.initPageObj();
      this.param.searchText = '';
    },
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
            labelDefault: 'Column Setting',
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
  created() {
    this.setColumn();
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
    ...mapActions('performance', ['fetchUpdatePerformanceGrid']),
    initPageObj() {
      this.pageObj.currentPageNo = 1;
      this.pageObj.pageSize = 10;
      this.pageObj.totalCnt = 0;
    },

    excelDownload() {
      const exportParams = {
        fileName: `${this.$t('resource.resourcePerformance')}${
          this.performanceCategoryMap.get(this.category).name
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

    pageChange(pageNo) {
      this.pageObj.currentPageNo = pageNo;
      this.gridApi.paginationGoToPage(pageNo - 1);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.autoSizeAll();
      this.gridApi.sizeColumnsToFit();
    },
    autoSizeAll() {
      let gridId = 'performanceGrid_' + this.category;
      let columnState = localStorage.getItem(gridId + '_columnState');
      let columnGroupState = localStorage.getItem(gridId + '_columnGroupState');

      if (columnState && columnState !== 'undefined') {
        this.gridColumnApi.applyColumnState({
          state: JSON.parse(columnState),
          applyOrder: true,
        });
      }
      if (columnGroupState && columnGroupState !== 'undefined') {
        this.gridColumnApi.setColumnGroupState(JSON.parse(columnGroupState));
      }
      this.gridColumnApi.autoSizeAllColumns();
    },
    onSaveGridColumnState(e) {
      if (!this.gridColumnApi) return;
      let gridId = 'performanceGrid_' + this.category;
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
    numberWithCurcyUnit(number) {
      const numProcessed = number ? Math.abs(number).toLocaleString() : 0;
      return numProcessed.toString();
    },
    dateFormat(params) {
      if (params.value && typeof params.value === 'string') {
        let formattedDate = params.value.replace(/-/g, '/');

        const parts = formattedDate.split(' ');
        if (parts.length === 2) {
          const timeParts = parts[1].split(':');
          if (timeParts.length === 3) {
            formattedDate = `${parts[0]} ${timeParts[0]}:${timeParts[1]}`;
          }
        }

        return formattedDate;
      }

      return params.value;
    },
    setColumn() {
      this.columnDefs = this.getColumnInfo({ cspTypCd: this.cspTypCd, category: this.category }).columnDefs;
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
    },
    async setGridData() {
      this.isLoading = true;
      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.gridApiConfig.cancelTokenSource) {
        this.gridApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.gridApiConfig);

      this.initPageObj();

      this.param.cmpnId = this.companyId[0].id;
      this.param.prvrCd = this.cspReference[this.cspTypCd].prvrCd;
      this.param.rsrcType = this.category;
      this.param.from = this.dateRange.startDate;
      this.param.to = this.dateRange.endDate;
      this.param.type = this.dateType === 'DALY' ? 'day' : 'month';
      this.param.viewType = this.dateType === 'DALY' ? 'day' : 'month';
      this.param.searchText = '';
      this.param.accounts = this.filter.acntIdList ? this.filter.acntIdList : [];
      this.param.regions = this.filter.regionList ? this.filter.regionList : [];
      this.param.ocpSvcGrps = [];

      if (this.filter.svcGrpList.length > 0) {
        this.filter.svcGrpList.forEach((item) => {
          this.param.ocpSvcGrps.push(item.id);
        });
      }

      try {
        const result = await performanceService.fetchGridData(this.param, {
          cancelToken: this.gridApiConfig.cancelToken,
        });

        if ('ok' === result.data.data.status) {
          this.rowData = result.data.data.result.list;
          this.pageObj.totalCnt = this.rowData.length;
        } else {
          this.rowData = [];
          this.pageObj.totalCnt = 0;
        }
        this.originRowdata = _.cloneDeep(this.rowData);
        this.isLoading = false;
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('fetch grid data' + e);
          this.pageObj.totalCnt = 0;
          this.rowData = [];
          this.originRowdata = _.cloneDeep(this.rowData);
          this.isLoading = false;
        }
      } finally {
        this.currentTime = moment().format('YYYY.M.D HH:mm');
      }
    },
    searchGridData() {
      this.gridApi.showLoadingOverlay();
      setTimeout(() => {
        this.gridApi.hideOverlay();
        this.param.searchText = this.param.searchText.trim();
        if (this.param.searchText) {
          const searchText = this.param.searchText.toLowerCase();
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
    setSideBarVisible() {
      this.gridToolPanelVisible = !this.gridToolPanelVisible;
      this.gridOptions.api.setSideBarVisible(this.gridToolPanelVisible);
      this.gridOptions.api.openToolPanel('columns');
    },
    popupClose() {
      this.usagePopupVisible = false;
    },
    async onCellClicked(params) {
      if (params.column.colId === 'instId') {
        this.screenX = params.event.pageX + 300;
        this.screenY = params.event.pageY - 275;

        let param = {};
        param.prvrCd = this.cspReference[this.cspTypCd].prvrCd;
        param.cmpnId = this.companyId[0].id; // company ID
        param.rsrcType = this.category;
        param.instId = params.data.instId; // resource ID (AWS)
        param.rsrcId = params.data.rsrcId; // resource ID (Azure)
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
    getColumnInfo({ cspTypCd, category }) {
      const percentValueFormatter = (params) => (params.value ? params.value + '%' : '-');
      const mbValueFormatter = (params) => (params.value ? params.value + 'MB' : '-');
      const serviceGroupValueFormatter = (params) => (params.value ? params.value.toString().replace(',', ', ') : '-');
      const resourceGroupValueFormatter = (params) =>
        params.value ? params.value.toString().toUpperCase().replace(',', ', ') : '-';

      const columnInfo = {
        AWS: {
          ec2: {
            columnDefs: [
              {
                headerName: this.$t('resource.resourceInformation'),
                children: [
                  {
                    field: 'instId',
                    headerName: this.$t('resource.instanceID'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    minWidth: 134,
                    valueFormatter: (params) => params.value || '-',
                    cellStyle: (params) => {
                      return { color: '#00a5ed' };
                    },
                    cellRenderer: (params) => {
                      return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                    },
                  },
                  /*{
                    field: 'instNm',
                    headerName: '인스턴스명',
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },*/
                  {
                    field: 'instType',
                    headerName: this.$t('resource.instanceType'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                  {
                    field: 'osType',
                    headerName: this.$t('resource.osType'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                ],
              },
              {
                headerName: this.$t('resource.cpuUtilization'),
                children: [
                  {
                    field: 'cpuUtilMin',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 'cpuUtilMax',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 'cpuUtilAvg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                ],
              },
              {
                headerName: this.$t('resource.memoryUtilization'),
                children: [
                  {
                    field: 'memoryUtilMin',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 'memoryUtilMax',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 'memoryUtilAvg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                ],
              },
              {
                headerName: this.$t('resource.diskspaceUtilization'),
                children: [
                  {
                    field: 'diskUtilMin',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 'diskUtilMax',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 'diskUtilAvg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                ],
              },
              {
                field: 'timeStmp',
                headerName: this.$t('resource.collectionDate'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => this.dateFormat(params) || '-',
              },
              {
                headerName: this.$t('resource.accountInformation'),
                children: [
                  {
                    field: 'rgnNm',
                    headerName: this.$t('resource.region'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                  {
                    field: 'svcGrpNm',
                    headerName: this.$t('resource.serviceGroup'),
                    minWidth: 131,
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: serviceGroupValueFormatter,
                  },
                  {
                    field: 'accAls',
                    headerName: this.$t('resource.linkedAccount'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => {
                      if (params.value) {
                        return `${params.node.data.accAls}(${params.node.data.accId})`;
                      } else {
                        return '-';
                      }
                    },
                  },
                ],
              },
            ],
          },
          rds: {
            columnDefs: [
              {
                headerName: this.$t('resource.resourceInformation'),
                children: [
                  {
                    field: 'instId',
                    headerName: this.$t('resource.instanceID'),
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
                ],
              },
              {
                headerName: this.$t('resource.cpuUtilization'),
                children: [
                  {
                    field: 'cpuUtilMin',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 'cpuUtilMax',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 'cpuUtilAvg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                ],
              },
              {
                headerName: this.$t('resource.availableMemory(MB)'),
                children: [
                  {
                    field: 'freeableMemMin',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'freeableMemMax',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'freeableMemAvg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                ],
              },
              {
                headerName: this.$t('resource.availableStorageSpace'),
                children: [
                  {
                    field: 'freeStgSpaceMin',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'freeStgSpaceMax',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'freeStgSpaceAvg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                ],
              },
              {
                headerName: this.$t('resource.readIOPSEA'),
                children: [
                  {
                    field: 'readiopsMin',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'readiopsMax',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'readiopsAvg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                ],
              },
              {
                headerName: this.$t('resource.writeIOPSEA'),
                children: [
                  {
                    field: 'writeiopsMin',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'writeiopsMax',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'writeiopsAvg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                ],
              },
              {
                field: 'timeStmp',
                headerName: this.$t('resource.collectionDate'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => this.dateFormat(params) || '-',
              },
              {
                headerName: this.$t('resource.accountInformation'),
                children: [
                  {
                    field: 'rgnNm',
                    headerName: this.$t('resource.region'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                  {
                    field: 'svcGrpNm',
                    headerName: this.$t('resource.serviceGroup'),
                    minWidth: 131,
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: serviceGroupValueFormatter,
                  },
                  {
                    field: 'accAls',
                    headerName: this.$t('resource.linkedAccount'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => {
                      if (params.value) {
                        return `${params.node.data.accAls}(${params.node.data.accId})`;
                      } else {
                        return '-';
                      }
                    },
                  },
                ],
              },
            ],
          },
          ebs: {
            columnDefs: [
              {
                headerName: this.$t('resource.resourceInformation'),
                children: [
                  {
                    field: 'instId',
                    headerName: this.$t('resource.instanceID'),
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
                ],
              },
              {
                headerName: 'VolumeQueue Length(EA)',
                children: [
                  {
                    field: 'vqlMin',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'vqlMax',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'vqlAvg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                ],
              },
              {
                headerName: 'VolumeRead IOPS(EA)',
                children: [
                  {
                    field: 'vrIopsMin',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'vrIopsMax',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'vrIopsAvg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                ],
              },
              {
                headerName: 'VolumeWrite Bytes (MB)',
                children: [
                  {
                    field: 'vwBytesMin',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'vwBytesMax',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'vwBytesAvg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                ],
              },
              {
                headerName: 'VolumeWrite IOPS(EA)',
                children: [
                  {
                    field: 'vwIopsMin',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'vwIopsMax',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                  {
                    field: 'vwIopsAvg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: (params) => this.numberWithCurcyUnit(params.value) || '-',
                  },
                ],
              },
              {
                field: 'timeStmp',
                headerName: this.$t('resource.collectionDate'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => this.dateFormat(params) || '-',
              },
              {
                headerName: this.$t('resource.accountInformation'),
                children: [
                  {
                    field: 'rgnNm',
                    headerName: this.$t('resource.region'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                  {
                    field: 'svcGrpNm',
                    headerName: this.$t('resource.serviceGroup'),
                    minWidth: 131,
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: serviceGroupValueFormatter,
                  },
                  {
                    field: 'accAls',
                    headerName: this.$t('resource.linkedAccount'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => {
                      if (params.value) {
                        return `${params.node.data.accAls}(${params.node.data.accId})`;
                      } else {
                        return '-';
                      }
                    },
                  },
                ],
              },
            ],
          },
        },
        AZURE: {
          'Microsoft.Compute/virtualMachines': {
            columnDefs: [
              {
                headerName: this.$t('resource.resourceInformation'),
                children: [
                  {
                    field: 'rsrcId',
                    headerName: this.$t('resource.resourceID'),
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
                    headerName: this.$t('resource.resourceName'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    minWidth: 134,
                    valueFormatter: (params) => params.value || '-',
                    cellStyle: (params) => {
                      return { color: '#00a5ed' };
                    },
                    cellRenderer: (params) => {
                      return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                    },
                  },
                  {
                    field: 'instType',
                    headerName: this.$t('resource.instanceType'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                ],
              },
              {
                headerName: this.$t('resource.cpuUtilization'),
                children: [
                  {
                    field: 't1Min',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 't1Max',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 't1Avg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                ],
              },
              {
                headerName: this.$t('resource.memoryUtilization'),
                children: [
                  {
                    field: 't2Min',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 't2Max',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 't2Avg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                ],
              },
              {
                headerName: this.$t('resource.diskspaceUtilization'),
                children: [
                  {
                    field: 't3Min',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 't3Max',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 't3Avg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                ],
              },
              {
                headerName: this.$t('resource.networkInput'),
                children: [
                  {
                    field: 't4Min',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: mbValueFormatter,
                  },
                  {
                    field: 't4Max',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: mbValueFormatter,
                  },
                  {
                    field: 't4Avg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: mbValueFormatter,
                  },
                ],
              },
              {
                headerName: this.$t('resource.networkOutput'),
                children: [
                  {
                    field: 't5Min',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: mbValueFormatter,
                  },
                  {
                    field: 't5Max',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: mbValueFormatter,
                  },
                  {
                    field: 't5Avg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: mbValueFormatter,
                  },
                ],
              },
              {
                field: 'timeStmp',
                headerName: this.$t('resource.collectionDate'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => this.dateFormat(params) || '-',
              },
              {
                headerName: this.$t('resource.subscriptionInfo'),
                children: [
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
                    field: 'accAls',
                    headerName: this.$t('resource.subscriptionName'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                  {
                    field: 'rgnNm',
                    headerName: this.$t('resource.region'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                  {
                    field: 'svcGrpNm',
                    headerName: this.$t('resource.serviceGroup'),
                    minWidth: 131,
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: serviceGroupValueFormatter,
                  },
                  {
                    field: 'rsrcGrp',
                    headerName: this.$t('resource.resourceGroup'),
                    minWidth: 131,
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: resourceGroupValueFormatter,
                  },
                ],
              },
            ],
          },
          'Microsoft.DBforMySQL/flexibleServers': {
            columnDefs: [
              {
                headerName: this.$t('resource.resourceInformation'),
                children: [
                  {
                    field: 'rsrcId',
                    headerName: this.$t('resource.resourceID'),
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
                    headerName: this.$t('resource.resourceName'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    minWidth: 134,
                    valueFormatter: (params) => params.value || '-',
                    cellStyle: (params) => {
                      return { color: '#00a5ed' };
                    },
                    cellRenderer: (params) => {
                      return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                    },
                  },
                  {
                    field: 'instType',
                    headerName: this.$t('resource.instanceType'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                ],
              },
              {
                headerName: this.$t('resource.cpuUtilization'),
                children: [
                  {
                    field: 't1Min',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 't1Max',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 't1Avg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                ],
              },
              {
                headerName: this.$t('resource.memoryUtilization'),
                children: [
                  {
                    field: 't2Min',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 't2Max',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 't2Avg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                ],
              },
              {
                headerName: this.$t('resource.storageUtilization'),
                children: [
                  {
                    field: 't3Min',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 't3Max',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                  {
                    field: 't3Avg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: percentValueFormatter,
                  },
                ],
              },
              {
                field: 'timeStmp',
                headerName: this.$t('resource.collectionDate'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => this.dateFormat(params) || '-',
              },
              {
                headerName: this.$t('resource.subscriptionInfo'),
                children: [
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
                    field: 'accAls',
                    headerName: this.$t('resource.subscriptionName'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                  {
                    field: 'rgnNm',
                    headerName: this.$t('resource.region'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                  {
                    field: 'svcGrpNm',
                    headerName: this.$t('resource.serviceGroup'),
                    minWidth: 131,
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: serviceGroupValueFormatter,
                  },
                  {
                    field: 'rsrcGrp',
                    headerName: this.$t('resource.resourceGroup'),
                    minWidth: 131,
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: resourceGroupValueFormatter,
                  },
                ],
              },
            ],
          },
          'Microsoft.Storage/storageAccounts': {
            columnDefs: [
              {
                headerName: this.$t('resource.resourceInformation'),
                children: [
                  {
                    field: 'rsrcId',
                    headerName: this.$t('resource.resourceID'),
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
                    headerName: this.$t('resource.resourceName'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    minWidth: 134,
                    valueFormatter: (params) => params.value || '-',
                    cellStyle: (params) => {
                      return { color: '#00a5ed' };
                    },
                    cellRenderer: (params) => {
                      return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                    },
                  },
                  {
                    field: 'instType',
                    headerName: this.$t('resource.instanceType'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                ],
              },
              {
                headerName: this.$t('resource.storageUsage'),
                children: [
                  {
                    field: 't1Min',
                    headerName: this.$t('resource.least'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: mbValueFormatter,
                  },
                  {
                    field: 't1Max',
                    headerName: this.$t('resource.maximum'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: mbValueFormatter,
                  },
                  {
                    field: 't1Avg',
                    headerName: this.$t('resource.average'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    comparator: this.numberComparator,
                    valueFormatter: mbValueFormatter,
                  },
                ],
              },
              {
                field: 'timeStmp',
                headerName: this.$t('resource.collectionDate'),
                resizable: true,
                headerClass: ['header-merge'],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => this.dateFormat(params) || '-',
              },
              {
                headerName: this.$t('resource.subscriptionInfo'),
                children: [
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
                    field: 'accAls',
                    headerName: this.$t('resource.subscriptionName'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                  {
                    field: 'rgnNm',
                    headerName: this.$t('resource.region'),
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: (params) => params.value || '-',
                  },
                  {
                    field: 'svcGrpNm',
                    headerName: this.$t('resource.serviceGroup'),
                    minWidth: 131,
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: serviceGroupValueFormatter,
                  },
                  {
                    field: 'rsrcGrp',
                    headerName: this.$t('resource.resourceGroup'),
                    minWidth: 131,
                    resizable: true,
                    cellClass: ['ag-grid-font', 'text-center'],
                    sortable: true,
                    menuTabs: [],
                    valueFormatter: resourceGroupValueFormatter,
                  },
                ],
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

.ag-root-wrapper-body .no-display-in-grid {
  display: none !important;
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
.box-wrap.close .title .pos-right .fold:before {
  transform: rotate(180deg);
}
</style>
