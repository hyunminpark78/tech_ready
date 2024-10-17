<template>
  <div class="box-wrap">
    <div class="title">
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
          :excel-styles="excelStyles"
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
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import Paginate from '@/components/Paginate.vue';
import moment from 'moment';
// import { numberCutDecimal } from '@/pages/Opti/CostOpti/CmmtPsblTgt/CostOptiCommon';
import { mapActions, mapGetters, mapState } from 'vuex';
import resourceService from '@/services/resourceService';
import UsagPopup from '@/pages/Rsrc/Usag/UsagPopup.vue';
// import performanceService from '@/services/performanceService';
import { setApiConfig } from '@/library/APICaller';
import _ from 'lodash';
import axios from 'axios';
import { i18n } from '../../../../public/locales/i18n';

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
      excelStyles: null,
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
        excelYn: 'N',
        pageNum: 1,
        limitCnt: 2147483647, // java의 integer max value 값
        sortColId: 'instId',
        sortDirection: 'ASC',
        searchText: '',
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
      updateUsageGrid: 'updateUsageGrid',
      isSearch: 'isSearch',
      chartData: 'chartData',
      selectedCustCorpIds: 'selectedCustCorpIds',
      svcGrpSelectedCustCorpIds: 'svcGrpSelectedCustCorpIds',
      cspReference: 'cspReference',
    }),
    ...mapGetters('performance', ['cspTypCd']),
    usageCategoryMap() {
      const usageCategoryMap = new Map();
      this.cspReference[this.cspTypCd].categoryList
        .filter((category) => category.isInUsage)
        .forEach((category) => usageCategoryMap.set(category.rsrcType, _.pick(category, ['code', 'name', 'rsrcType'])));
      return usageCategoryMap;
    },
  },
  watch: {
    '$i18n.locale': ['setColumn', 'setGridData'],
    updateUsageGrid: async function () {
      if (this.updateUsageGrid) {
        this.fetchUpdateUsageGrid(false);
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
    this.excelStyles = [
      {
        id: 'stringType',
        dataType: 'String',
      },
    ];
    this.setColumn();
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.defaultExcelExportParams = {
      autoConvertFormulas: true,
      processCellCallback: (params) => {
        return params.value;
      },
    };

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
    ...mapActions('performance', ['fetchUpdateUsageGrid']),
    initPageObj() {
      this.pageObj.currentPageNo = 1;
      this.pageObj.pageSize = 10;
      this.pageObj.totalCnt = 0;
    },
    excelDownload() {
      const exportParams = {
        fileName: `자원_사용량_${this.usageCategoryMap.get(this.category).name}_${moment().format('YYYY-MM-DD')}.xlsx`,
        forceTextOnNumericalColumn: true, // 추가
        processCellCallback: (params) => {
          // 그리드 표기와 동일하게 엑셀 데이터 표기
          if (params.column.colDef.valueFormatter) {
            return params.column.colDef.valueFormatter(params);
          }
          return params.value || '-';
        },
        processCellForExportCallback: (params) => {
          return {
            data: params.value,
            type: 'string',
          };
        },
      };
      this.gridApi.exportDataAsExcel(exportParams);
    },
    async setGridData() {
      this.isLoading = true;
      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.gridApiConfig.cancelTokenSource) {
        this.gridApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.gridApiConfig);

      this.initPageObj();
      this.param.cmpnId = this.selectedCustCorpIds[0].id;
      this.param.prvrCd = this.cspReference[this.cspTypCd].prvrCd;
      this.param.rsrcType = this.category;
      this.param.searchText = this.param.searchText.trim();
      this.param.accounts = this.filter.acntIdList ? this.filter.acntIdList : [];
      this.param.regions = this.filter.regionList ? this.filter.regionList : [];
      this.param.ocpSvcGrps = [];
      this.param.sortColId = this.getColumnInfo({ cspTypCd: this.cspTypCd, category: this.category }).sortColId;

      if (this.filter.svcGrpList.length > 0) {
        this.filter.svcGrpList.forEach((item) => {
          this.param.ocpSvcGrps.push(item.id);
        });
      }

      try {
        const result = await resourceService.fetchUsagGrid(this.param, { cancelToken: this.gridApiConfig.cancelToken });

        if ('ok' === result.data.data.status) {
          this.rowData = result.data.data.result.list;
          this.pageObj.totalCnt = result.data.data.result.totalCnt;
        } else {
          this.rowData = [];
          this.pageObj.totalCnt = 0;
        }
        this.isLoading = false;
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching usage grid data:', e);
          this.pageObj.totalCnt = 0;
          this.rowData = [];
          this.isLoading = false;
        }
      } finally {
        this.currentTime = moment().format('YYYY.M.D HH:mm');
      }
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
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
      let gridId = 'usageGrid_' + this.category;
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
      let resizableColumns = this.gridColumnApi.getAllColumns().filter((column) => column.getColId() !== 'rsrcId');
      this.gridColumnApi.autoSizeColumns(resizableColumns);
    },
    onSaveGridColumnState(e) {
      if (!this.gridColumnApi) return;
      let gridId = 'usageGrid_' + this.category;
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
    dateFormat(params) {
      if (params.value && typeof params.value === 'string') {
        let formattedDate = params.value.replace('T', ' ');
        formattedDate = formattedDate.replace(/-/g, '/');

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
    popupClose() {
      this.usagePopupVisible = false;
    },
    async onCellClicked(params) {
      if (params.column.colId === 'instId') {
        this.screenX = params.event.pageX + 300;
        this.screenY = params.event.pageY - 275;

        let param = {};
        param.prvrCd = this.cspReference[this.cspTypCd].prvrCd;
        param.cmpnId = params.data.cmpnId; // company ID
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
    getColumnInfo({ cspTypCd, category }) {
      const serviceGroupValueFormatter = (params) => (params.value ? params.value.toString().replace(',', ', ') : '-');
      const resourceGroupValueFormatter = (params) =>
        params.value ? params.value.toString().toUpperCase().replace(',', ', ') : '-';

      const columnInfo = {
        AWS: {
          ec2: {
            sortColId: 'instId',
            columnDefs: [
              {
                field: 'instId',
                headerName: this.$t('resource.resourceID'),
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
                field: 'nameVal',
                headerName: this.$t('resource.resourceName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'stateName',
                headerName: this.$t('resource.status'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center', 'stringType'],
                sortable: true,
                valueFormatter: (params) => {
                  let value = params.value || '-';
                  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                },
              },
              {
                field: 'instType',
                headerName: this.$t('resource.instanceType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instLifeCycl',
                headerName: this.$t('resource.lifecycle'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'vCpu',
                headerName: 'vCPU',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                comparator: this.numberComparator,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'pf',
                headerName: 'OS',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'pblIpAddr',
                headerName: 'Public IP',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'prvIpAddr',
                headerName: 'Private IP',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'lnchTime',
                headerName: this.$t('resource.launchTime'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => this.dateFormat(params) || '-',
              },
              {
                field: 'pblDnsNm',
                headerName: 'Public DNS',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'keyName',
                headerName: this.$t('resource.keyName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'size',
                headerName: this.$t('resource.rootVolume'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'clusterType',
                headerName: this.$t('resource.clusterType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'availZone',
                headerName: this.$t('resource.availabilityZone'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.linkedAccount'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
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
            sortColId: 'instId',
            columnDefs: [
              {
                field: 'instId',
                headerName: this.$t('resource.dbInstanceID'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'dbNm',
                headerName: this.$t('resource.dbName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'stateName',
                headerName: this.$t('resource.status'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => {
                  let value = params.value || '-';
                  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                },
              },
              {
                field: 'dbInstClss',
                headerName: this.$t('resource.dbInstanceType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'vCpu',
                headerName: 'vCPU',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                comparator: this.numberComparator,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'strgType',
                headerName: this.$t('resource.storageType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'engn',
                headerName: this.$t('resource.engineType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'eptPort',
                headerName: this.$t('resource.portNumber'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'mstrUserNm',
                headerName: this.$t('resource.masterUsername'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'lcnsMdl',
                headerName: this.$t('resource.licenseType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'pblcAcsb',
                headerName: this.$t('resource.accessType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'multiAz',
                headerName: this.$t('resource.multiAZ'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instCreaTime',
                headerName: this.$t('resource.creationTime(UTC)'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => this.dateFormat(params) || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'availZone',
                headerName: this.$t('resource.availabilityZone'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.linkedAccount'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
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
          vpcs: {
            sortColId: 'instId',
            columnDefs: [
              {
                field: 'instId',
                headerName: this.$t('resource.resourceID'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'nameVal',
                headerName: this.$t('resource.resourceName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'cidrBlck',
                headerName: 'IPv4 CIDR',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              /*{
                field: 'cidrBlck',
                headerName: 'IPv6 CIDR',
                resizable: true,
    menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },*/
              {
                field: 'state',
                headerName: this.$t('resource.status'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => {
                  let value = params.value || '-';
                  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                },
              },
              {
                field: 'asgnInst',
                headerName: this.$t('resource.allocatedResources'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'dhcpOptnId',
                headerName: this.$t('resource.dHCPOptionSet'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instTncy',
                headerName: this.$t('resource.tenancy'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'dfltVpc',
                headerName: this.$t('resource.defaultVPC'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.linkedAccount'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
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
            sortColId: 'instId',
            columnDefs: [
              {
                field: 'instId',
                headerName: this.$t('resource.resourceID'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'nameVal',
                headerName: this.$t('resource.resourceName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'volType',
                headerName: this.$t('resource.volumeType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'size',
                headerName: this.$t('resource.volumeSize'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'stateName',
                headerName: this.$t('resource.status'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => {
                  let value = params.value || '-';
                  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                },
              },
              {
                field: 'atmtId',
                headerName: this.$t('resource.connectedInstance'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'creaDt',
                headerName: this.$t('resource.creationTime(UTC)'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => this.dateFormat(params) || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.linkedAccount'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
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
            sortColId: 'instId',
            columnDefs: [
              {
                field: 'instId',
                headerName: this.$t('resource.resourceID'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'nameVal',
                headerName: this.$t('resource.resourceName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'type',
                headerName: this.$t('resource.loadbalancerType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detailStateContent',
                headerName: this.$t('resource.status'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => {
                  let value = params.value || '-';
                  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                },
              },
              {
                field: 'scheme',
                headerName: this.$t('resource.system'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'dnsNm',
                headerName: this.$t('resource.dNSName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'vpcId',
                headerName: 'VPC ID',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'availZones',
                headerName: this.$t('resource.availabilityZone'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'creaTime',
                headerName: this.$t('resource.creationTime(UTC)'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => this.dateFormat(params) || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.linkedAccount'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
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
            sortColId: 'instId',
            columnDefs: [
              {
                field: 'accAlias',
                headerName: this.$t('resource.resourceName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instId',
                headerName: this.$t('resource.assignedIPv4address'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'rsrcOptiYn',
                headerName: this.$t('resource.connectionStatus'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => {
                  if (params.value === 'N') {
                    return 'Associated';
                  } else if (params.value === 'Y') {
                    return 'Dissociated';
                  } else if (params.value === 'EC2 is not running') {
                    return i18n.locale === 'ko' ? '연결된 EC2가 미기동 상태' : 'EC2 is not running';
                  } else {
                    return params.value || '-';
                  }
                },
              },
              {
                field: 'dmn',
                headerName: this.$t('resource.range'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'addrInstId',
                headerName: this.$t('resource.associatedInstanceID'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'asctnId',
                headerName: this.$t('resource.connectionID'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'alcnId',
                headerName: this.$t('resource.assignmentID'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'nwIfId',
                headerName: this.$t('resource.networkInterfaceID'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'nwIfOwnerId',
                headerName: this.$t('resource.eNIOwnerAccountID'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'prvIpAddr',
                headerName: 'Private IP',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'updtDt',
                headerName: this.$t('resource.updateTime(UTC)'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => this.dateFormat(params) || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'accId',
                headerName: this.$t('resource.linkedAccount'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => {
                  if (params.node.data.accId) {
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
            sortColId: 'detail.id',
            columnDefs: [
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
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'statNm',
                headerName: this.$t('resource.connectionStatus'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center', 'stringType'],
                sortable: true,
                valueFormatter: (params) => {
                  let value = params.value || '-';
                  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                },
              },
              {
                field: 'detail.properties.instanceView.osName',
                headerName: 'OS',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => {
                  let value = params.value || '-';
                  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                },
              },
              {
                field: 'instType',
                headerName: this.$t('resource.instanceType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.subscriptionName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('resource.resourceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: resourceGroupValueFormatter,
              },
            ],
          },
          'Microsoft.Sql/servers': {
            sortColId: 'detail.id',
            columnDefs: [
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
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'detailStateContent',
                headerName: this.$t('resource.status'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center', 'stringType'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detailTypeContent',
                headerName: this.$t('resource.instanceType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.administratorLogin',
                headerName: 'Administrator login',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.publicNetworkAccess',
                headerName: 'Public network access',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.fullyQualifiedDomainName',
                headerName: this.$t('resource.domain'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.minimalTlsVersion',
                headerName: 'Min. TLS version',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.subscriptionName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('resource.resourceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: resourceGroupValueFormatter,
              },
            ],
          },
          'Microsoft.DBforPostgreSQL/flexibleServers': {
            sortColId: 'detail.id',
            columnDefs: [
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
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'statNm',
                headerName: this.$t('resource.status'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center', 'stringType'],
                sortable: true,
                valueFormatter: (params) => {
                  let value = params.value || '-';
                  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                },
              },
              {
                field: 'instType',
                headerName: this.$t('resource.instanceType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.fullyQualifiedDomainName',
                headerName: this.$t('resource.domain'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.version',
                headerName: this.$t('resource.engineVersion'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.storage.storageSizeGB',
                headerName: this.$t('resource.storage'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.backup.backupRetentionDays',
                headerName: this.$t('resource.backupRetentionDays'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.subscriptionName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('resource.resourceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: resourceGroupValueFormatter,
              },
            ],
          },
          'Microsoft.DBforMySQL/flexibleServers': {
            sortColId: 'detail.id',
            columnDefs: [
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
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'statNm',
                headerName: this.$t('resource.status'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center', 'stringType'],
                sortable: true,
                valueFormatter: (params) => {
                  let value = params.value || '-';
                  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                },
              },
              {
                field: 'instType',
                headerName: this.$t('resource.instanceType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.fullyQualifiedDomainName',
                headerName: this.$t('resource.domain'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.version',
                headerName: this.$t('resource.engineVersion'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.storage.storageSizeGB',
                headerName: this.$t('resource.storage'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.backup.backupRetentionDays',
                headerName: this.$t('resource.backupRetentionDays'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.subscriptionName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('resource.resourceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: resourceGroupValueFormatter,
              },
            ],
          },
          'Microsoft.DBforMariaDB/servers': {
            sortColId: 'detail.id',
            columnDefs: [
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
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'statNm',
                headerName: this.$t('resource.status'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center', 'stringType'],
                sortable: true,
                valueFormatter: (params) => {
                  let value = params.value || '-';
                  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                },
              },
              {
                field: 'instType',
                headerName: this.$t('resource.instanceType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.fullyQualifiedDomainName',
                headerName: this.$t('resource.domain'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.version',
                headerName: this.$t('resource.engineVersion'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.storageProfile.storageMB',
                headerName: this.$t('resource.storage'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) =>
                  isNaN(Number(params.value)) ? '-' : Math.trunc(Number(params.value) / 1000),
              },
              {
                field: 'detail.properties.storageProfile.backupRetentionDays',
                headerName: this.$t('resource.backupRetentionDays'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.subscriptionName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('resource.resourceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: resourceGroupValueFormatter,
              },
            ],
          },
          'Microsoft.Network/virtualNetworks': {
            sortColId: 'detail.id',
            columnDefs: [
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
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'detail.properties.provisioningState',
                headerName: this.$t('resource.provisioningStatus'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.resourceGuid',
                headerName: this.$t('resource.resourceGuid'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.enableDdosProtection',
                headerName: this.$t('resource.dDoSProtectionActive'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => (!_.isNil(params.value) ? params.value.toString() : '-'),
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.subscriptionName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('resource.resourceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: resourceGroupValueFormatter,
              },
            ],
          },
          'Microsoft.Compute/disks': {
            sortColId: 'detail.id',
            columnDefs: [
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
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'detail.properties.diskState',
                headerName: this.$t('resource.status'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instType',
                headerName: this.$t('resource.diskType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.diskSizeGB',
                headerName: this.$t('resource.diskSizeGB'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.diskMBpsReadWrite',
                headerName: this.$t('resource.diskMBpsReadWrite'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.diskIOPSReadWrite',
                headerName: this.$t('resource.diskIOPSReadWrite'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.timeCreated',
                headerName: this.$t('resource.creationTime(UTC)'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.subscriptionName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: resourceGroupValueFormatter,
              },
            ],
          },
          'Microsoft.Network/loadBalancers': {
            sortColId: 'detail.id',
            columnDefs: [
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
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'detail.properties.provisioningState',
                headerName: this.$t('resource.provisioningStatus'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instType',
                headerName: this.$t('resource.loadbalancerType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.subscriptionName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('resource.resourceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: resourceGroupValueFormatter,
              },
            ],
          },
          'Microsoft.Network/publicIPAddresses': {
            sortColId: 'detail.id',
            columnDefs: [
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
                valueFormatter: (params) => params.value || '-',
                cellStyle: (params) => {
                  return { color: '#00a5ed' };
                },
                cellRenderer: (params) => {
                  return `<a href="#" onclick="return false;">` + params.value + `</a>`;
                },
              },
              {
                field: 'detailStateContent',
                headerName: this.$t('resource.connectionStatus'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'instType',
                headerName: this.$t('resource.resourceType'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.resourceGuid',
                headerName: this.$t('resource.resourceGuid'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.publicIPAddressVersion',
                headerName: this.$t('resource.publicIPAddressVersion'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.ipAddress',
                headerName: this.$t('resource.ipAddress'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.idleTimeoutInMinutes',
                headerName: this.$t('resource.idleTimeoutInMinutes'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'detail.properties.publicIPAllocationMethod',
                headerName: this.$t('resource.publicIPAllocationMethod'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accId',
                headerName: 'Subscription ID',
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'accAlias',
                headerName: this.$t('resource.subscriptionName'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'rgnNm',
                headerName: this.$t('resource.region'),
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: (params) => params.value || '-',
              },
              {
                field: 'svcGrpNm',
                headerName: this.$t('resource.serviceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
                valueFormatter: serviceGroupValueFormatter,
              },
              {
                field: 'rsrcGrp',
                headerName: this.$t('resource.resourceGroup'),
                minWidth: 131,
                resizable: true,
                menuTabs: [],
                cellClass: ['ag-grid-font', 'text-center'],
                sortable: true,
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
.ag-header-cell-text {
  text-align: center !important;
}
.box-wrap.close .title .pos-right .fold:before {
  transform: rotate(180deg);
}
.ag-root-wrapper-body .no-display-in-grid {
  display: none !important;
}
</style>
