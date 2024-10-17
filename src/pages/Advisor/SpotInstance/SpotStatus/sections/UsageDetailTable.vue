<template>
  <!-- module -->
  <div id="usageTable" class="box-wrap" style="margin-top: 0">
    <div class="title">
      <div class="flex search-wrap">
        <div class="flex">
          <button
            :class="buttonClass('usageHistory')"
            :disabled="type === 'usageHistory'"
            @click.prevent="changeType('usageHistory')"
          >
            {{ $t('advisor.usageDetailTable.usageHistory') }}
          </button>
          <button
            class="ml-1.5"
            :class="buttonClass('requestDetail')"
            :disabled="type === 'requestDetail'"
            @click.prevent="changeType('requestDetail')"
          >
            {{ $t('advisor.usageDetailTable.requestDetail') }}
          </button>
          <span class="flex items-center usageTableDuration"
            >{{ $t('advisor.usageDetailTable.standardTime') }} : {{ currentTime }}</span
          >
        </div>
      </div>
      <div class="pos-right">
        <a href="#" class="download" @click="excelDownload">{{ $t('common.button.downloadExcel') }}</a>
        <button class="fold jsFoldGrid" @click="setSideBarVisible">
          <span>{{ $t('common.button.columnSetting') }}</span>
        </button>
      </div>
    </div>

    <template v-if="!isLoading">
      <div ref="usageGrid" class="relative">
        <ag-grid-vue
          id="spotStatusGrid"
          ref="spotStatusGrid"
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

    <SpotStatusPopup
      v-if="tooltip"
      :visible="tooltip"
      :tooltip-content="tooltipContent"
      :screen-x="screenX"
      :screen-y="screenY"
      @close="closeTooltip"
    ></SpotStatusPopup>
    <Paginate
      v-if="pageObj.totalCnt > 0"
      :page-size="pageObj.pageSize"
      :page-no="pageObj.currentPageNo"
      :total-cnt="pageObj.totalCnt"
      @changepage="pageChange"
    />
  </div>
  <!-- //module -->
</template>
<script>
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import Paginate from '@/components/Paginate.vue';
import moment from 'moment';
import OcpButton from '@/components/shared/OcpButton.vue';
import arrowDown from '@/assets/images/arrow-typ-02-black.svg';
import { UsageStatusCell, SpotStatusPopup } from '@/pages/Advisor/components';
import { i18n } from '../../../../../../public/locales/i18n';
import { mapActions, mapGetters, mapState } from 'vuex';
import spotUsageService from '@/services/spotUsageService';
import { numberCutDecimal } from '@/pages/Opti/CostOpti/CmmtPsblTgt/CostOptiCommon';
import icoDown from '@/assets/images/ico-down.svg';
import { setApiConfig } from '@/library/APICaller';
import axios from 'axios';
import { requestStatus, usageStatus } from '../../SpotInstanceEnum';
import _ from 'lodash';
import resourceService from '@/services/resourceService';

export default {
  components: { AgGridVue, Paginate, SpotStatusPopup, OcpButton, UsageStatusCell },
  mixins: [AgGridMixin()],
  data() {
    return {
      currentTime: moment().format('YYYY-MM-DD HH:mm'),
      defaultType: 'usageHistory',
      type: 'usageHistory',
      gridOptions: null,
      rowData: null,
      usageData: [],
      requestData: [],
      columnDefs: null,
      defaultColDef: null,
      defaultExcelExportParams: null,
      frameworkComponents: null,
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
      gridApiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
    };
  },
  computed: {
    ...mapState('spotAdvisor', {
      filter: 'filter',
      setRequestGridData: 'setRequestGridData',
    }),
    ...mapGetters('spotAdvisor', ['cspTypCd', 'cspPrdtCdList', 'regionSepCdList', 'tag', 'exchgRate']),
    isDefaultType() {
      return this.type === this.defaultType;
    },
  },
  watch: {
    '$i18n.locale': function () {
      this.changeType(this.type);
    },
    setRequestGridData: async function () {
      if (this.setRequestGridData) {
        this.fetchRequestGridData(false);
        this.initType();
        this.setColumn();
        await this.fetchGridData();
        this.setGridData();
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
    ...mapActions('spotAdvisor', ['fetchRequestGridData']),
    initPageObj() {
      this.pageObj.currentPageNo = 1;
      this.pageObj.pageSize = 10;
      this.pageObj.totalCnt = 0;
    },
    excelDownload() {
      const exportParams = {
        fileName: `Spot_${this.$t(`advisor.usageDetailTable.${this.type}`)}_${moment().format('YYYY-MM-DD')}.xlsx`,
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
    async fetchGridData() {
      this.closeTooltip();
      this.isLoading = true;
      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.gridApiConfig.cancelTokenSource) {
        this.gridApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.gridApiConfig);
      this.initRowDatas();
      await this.fetchUsageData();
      await this.fetchRequestData();

      // usageData의 상태 정보를 requestData에서 찾아 매핑
      const statusMap = this.requestData.reduce((map, item) => {
        map[item.rsrcId] = { statCd: item.statCd, reqStatCd: item.reqStatCd, reqStatDesc: item.reqStatDesc };
        return map;
      }, {});
      this.usageData.forEach((item) => {
        const status = statusMap[item.rsrcId] || { statCd: '', reqStatCd: '', reqStatDesc: '' };
        item.statCd = status.statCd;
        item.reqStatCd = status.reqStatCd;
        item.reqStatDesc = status.reqStatDesc;
      });

      this.isLoading = false;
    },
    async fetchUsageData() {
      const payload = {
        strDate: this.filter.spotUsageRange.startDate,
        endDate: this.filter.spotUsageRange.endDate,
        acntIdList: this.filter.acntIdList,
        regionSepCdList: this.regionSepCdList,
        cspPrdtCdList: this.cspPrdtCdList,
        tagKey: this.tag.tagKey,
        tagValList: this.tag.tagValList,
      };

      try {
        const usageResponse = await spotUsageService.fetchSpotUsageHistory({
          cspTypCd: this.cspTypCd,
          payload: payload,
          config: { cancelToken: this.gridApiConfig.cancelToken },
        });
        this.usageData = usageResponse.data.data;
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching grid data:', e);
          this.usageData = [];
        }
      }
    },
    async fetchRequestData() {
      const payload = {
        strDate: this.filter.spotUsageRange.startDate,
        endDate: this.filter.spotUsageRange.endDate,
        acntIdList: this.filter.acntIdList,
        regionSepCdList: this.regionSepCdList,
        cspPrdtCdList: this.cspPrdtCdList,
        tagKey: this.tag.tagKey,
        tagValList: this.tag.tagValList,
      };

      try {
        const requestResponse = await spotUsageService.fetchSpotRequestHistory({
          cspTypCd: this.cspTypCd,
          payload: payload,
          config: { cancelToken: this.gridApiConfig.cancelToken },
        });

        this.requestData = requestResponse.data.data;
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching grid data:', e);
          this.requestData = [];
        }
      }
    },
    setGridData() {
      this.rowData = [];
      if (this.type === 'usageHistory') {
        this.setRowData(this.usageData);
      } else {
        this.setRowData(this.requestData);
      }
      this.pageObj.totalCnt = this.rowData.length;
    },
    setColumn() {
      this.columnDefs = this.getColumnInfo({ cspTypCd: this.cspTypCd, type: this.type }).columnDefs;
      this.defaultColDef = { flex: -1, filter: true };
      this.enabledTooltips(this.columnDefs);
    },
    pageChange(pageNo) {
      this.pageObj.currentPageNo = pageNo;
      this.gridApi.paginationGoToPage(pageNo - 1);
      this.closeTooltip();
    },
    async changeType(type) {
      this.isLoading = true;
      this.type = type;
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.pageChange(1);
      this.setColumn();
      this.setGridData();
      this.isLoading = false;
    },
    setRowData(rowData) {
      this.rowData = rowData;
    },
    initType() {
      this.type = this.defaultType;
    },
    initRowDatas() {
      this.rowData = [];
      this.usageData = [];
      this.requestData = [];
    },
    buttonClass(type) {
      const button = 'inline-block rounded px-2 py-1.5 font-bold border border-primary-400 text-sm ';
      return this.type === type ? button + 'text-white bg-primary-400' : button + 'text-primary-400 bg-white';
    },
    autoSizeAll() {
      let gridId = 'spotGrid_' + this.type;
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
      let gridId = 'spotGrid_' + this.type;
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
    accountValueFormatter(params) {
      return params.node.data.acntNm && params.node.data.acntId
        ? `${params.node.data.acntNm}(${params.node.data.acntId})`
        : '-';
    },
    statusUsageRenderer(params) {
      return params.value
        ? `<div style= 'padding: 0; gap: 5px' class="flex items-center justify-center">` +
            params.value +
            `<div style="border-radius: 50%; width: 19px; height: 19px; background-color: #D9D9D9">
                  <img style="transform: rotate(270deg);" src="${arrowDown}" alt="."/>
                  </div></div>`
        : '-';
    },
    krwValueFormatter(params) {
      return _.isFinite(params.value) ? `￦${numberCutDecimal(params.value * this.exchgRate)}` : '￦0';
    },
    onCellClicked(params) {
      if (
        (params.column.colId === 'statCd' && params.data.statCd) ||
        (params.column.colId === 'reqStatCd' && params.data.reqStatCd)
      ) {
        this.tooltipContent = {
          headerTitle: '',
          code: this.$t('advisor.usageDetailTable.requestCode'),
          des: this.$t('advisor.usageDetailTable.requestDes'),
          codeContent: '',
          desContent: '',
        };

        if (params.column.colId === 'statCd') {
          this.tooltipContent.headerTitle = this.$t('advisor.usageDetailTable.usageStatus');
          this.tooltipContent.codeContent = params.data.statCd;
          this.tooltipContent.desContent = params.data.statCd;
        } else if (params.column.colId === 'reqStatCd') {
          this.tooltipContent.headerTitle = this.$t('advisor.usageDetailTable.requestStatus');
          this.tooltipContent.codeContent = params.data.reqStatCd;
          this.tooltipContent.desContent = params.data.reqStatDesc;
        }

        this.screenX = params.event.pageX;
        this.screenY = params.event.pageY - 200;

        this.tooltip = true;
      }
    },
    closeTooltip() {
      this.tooltip = false;
    },
    getColumnInfo({ cspTypCd, type }) {
      const columnInfo = {
        AWS: {
          usageHistory: {
            columnDefs: [
              {
                headerName: this.$t('advisor.usageDetailTable.resourceId'),
                field: 'rsrcId',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.usageDetailTable.usageStatus'),
                field: 'statCd',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => params.value || '-',
                cellRendererFramework: 'UsageStatusCell',
              },
              {
                headerName: this.$t('advisor.usageDetailTable.spotUsage'),
                field: 'spotUseAmt',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: this.krwValueFormatter,
                tooltipValueGetter: this.krwValueFormatter,
              },
              {
                headerName: this.$t('advisor.usageDetailTable.onDemandConversion'),
                field: 'spotUseOndmConvAmt',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: this.krwValueFormatter,
                tooltipValueGetter: this.krwValueFormatter,
              },
              {
                headerName: this.$t('advisor.usageDetailTable.savings'),
                field: 'spotSaveAmt',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                cellRenderer: this.savingCostCellRenderer,
                valueFormatter: this.krwValueFormatter,
                tooltipValueGetter: this.krwValueFormatter,
              },
              {
                headerName: this.$t('advisor.usageDetailTable.reductionRate'),
                field: 'spotSaveRatio',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell', 'percentType'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => (params.value ? params.value.toFixed(2) + '%' : '-'),
                tooltipValueGetter: (params) => (params.value ? params.value.toFixed(2) + '%' : '-'),
              },
              {
                headerName: this.$t('advisor.usageDetailTable.service'),
                field: 'cspPrdtNm',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.usageDetailTable.instanceType'),
                colId: 'instanceType',
                field: 'data',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: this.instanceTypeValueFormatter,
                tooltipValueGetter: this.instanceTypeValueFormatter,
                cellRenderer: this.instanceTypeRenderer,
              },
              {
                headerName: this.$t('advisor.usageDetailTable.region'),
                field: 'regionSepNm',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.usageDetailTable.availableArea'),
                field: 'azSepCd',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.usageDetailTable.operatingSystem'),
                field: 'osNm',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.usageDetailTable.linkedAccount'),
                colId: 'linkedAccount',
                field: 'data',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                valueFormatter: this.accountValueFormatter,
                tooltipValueGetter: this.accountValueFormatter,
              },
            ],
          },
          requestDetail: {
            columnDefs: [
              {
                headerName: this.$t('advisor.usageDetailTable.requestId'),
                field: 'reqId',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.usageDetailTable.resourceId'),
                field: 'rsrcId',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.usageDetailTable.requestStatus'),
                field: 'reqStatCd',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => params.value || '-',
                cellRendererFramework: 'UsageStatusCell',
              },
              {
                headerName: this.$t('advisor.usageDetailTable.startDate'),
                field: 'strDtm',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => {
                  return params.value ? params.value : '-';
                },
              },
              {
                headerName: this.$t('advisor.usageDetailTable.endDate'),
                field: 'endDtm',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => {
                  return params.value ? params.value : '-';
                },
              },
              {
                headerName: this.$t('advisor.usageDetailTable.instanceType'),
                colId: 'instanceType',
                field: 'data',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: this.instanceTypeValueFormatter,
                tooltipValueGetter: this.instanceTypeValueFormatter,
                cellRenderer: this.instanceTypeRenderer,
              },
              {
                headerName: this.$t('advisor.usageDetailTable.region'),
                field: 'regionSepNm',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.usageDetailTable.availableArea'),
                field: 'azSepCd',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.usageDetailTable.operatingSystem'),
                field: 'osNm',
                resizable: true,
                headerClass: ['custom-grid-header'],
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                minWidth: 150,
                valueFormatter: (params) => params.value || '-',
              },
              {
                headerName: this.$t('advisor.usageDetailTable.linkedAccount'),
                colId: 'linkedAccount',
                field: 'data',
                resizable: true,
                cellClass: ['ag-grid-font', 'text-center', 'custom-cell'],
                sortable: true,
                menuTabs: [],
                valueFormatter: this.accountValueFormatter,
                tooltipValueGetter: this.accountValueFormatter,
              },
            ],
          },
        },
        AZURE: {
          usageHistory: {
            columnDefs: [],
          },
          requestDetail: {
            columnDefs: [],
          },
        },
      };
      return columnInfo[cspTypCd][type];
    },
  },
};
</script>
<style lang="scss">
#usageTable {
  margin-top: 0;

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
    justify-content: center;
    align-items: center;
    line-height: 24px !important;
  }

  .usageTableDuration {
    font-size: 12px;
    color: #b5b2b2;
    margin-left: 16px;
    padding-bottom: 0;
  }

  .custom-cell {
    padding: 0px 24px;
  }
  .custom-grid-header {
    padding: 0px 24px;
  }
}
</style>
