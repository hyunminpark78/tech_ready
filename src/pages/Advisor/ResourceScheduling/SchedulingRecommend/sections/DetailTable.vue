<template>
  <div id="detailTable" class="box-wrap">
    <div class="title">
      <div class="flex search-wrap">
        <Tooltip :title="$t('optimization.recommendedDetails')">
          <div class="ti font-bold">{{ $t('optimization.recommendedDetails') }}</div>
          <div>{{ $t('advisor.schedulingRecommend.detailTable.tooltip.recommendDetails.description.line1') }}</div>
          <div>{{ $t('advisor.schedulingRecommend.detailTable.tooltip.recommendDetails.description.line2') }}</div>
          <div class="mb-4">
            {{ $t('advisor.schedulingRecommend.detailTable.tooltip.recommendDetails.description.line3') }}
          </div>
          <div class="ti font-bold">
            {{ $t('advisor.schedulingRecommend.detailTable.tooltip.recommendCriteria.title') }}
          </div>
          <div>{{ $t('advisor.schedulingRecommend.detailTable.tooltip.recommendCriteria.description.line1') }}</div>
          <div>
            <span class="text-primary-400"> {{ $t('advisor.schedulingRecommend.detailTable.Day') }} </span>
            : {{ $t('advisor.schedulingRecommend.detailTable.tooltip.recommendCriteria.description.Day') }}
          </div>
          <div>
            <span class="text-primary-400"> {{ $t('advisor.schedulingRecommend.detailTable.Night') }} </span>
            : {{ $t('advisor.schedulingRecommend.detailTable.tooltip.recommendCriteria.description.Night') }}
          </div>
          <div>
            <span class="text-primary-400"> {{ $t('advisor.schedulingRecommend.detailTable.Weekday') }} </span>
            : {{ $t('advisor.schedulingRecommend.detailTable.tooltip.recommendCriteria.description.Weekday') }}
          </div>
          <div>
            <span class="text-primary-400"> {{ $t('advisor.schedulingRecommend.detailTable.Weekend') }} </span>
            : {{ $t('advisor.schedulingRecommend.detailTable.tooltip.recommendCriteria.description.Weekend') }}
          </div>
          <div>
            <span class="text-primary-400"> {{ $t('advisor.schedulingRecommend.detailTable.Everyday') }} </span>
            : {{ $t('advisor.schedulingRecommend.detailTable.tooltip.recommendCriteria.description.Everyday') }}
          </div>
        </Tooltip>
        <div class="duration" style="font-size: 12px; color: #999; font-weight: normal; margin-left: 10px;">{{ $t('optimization.analysisPeriod') }} : 2024-08-12 00:00 ~ 2024-09-08 23:59</div>
      </div>
      <!-- search -->
      <div class="search-wrap" style="padding: 0; margin-bottom: 12px">
        <input type="text" :placeholder="$t('common.placeholder.enterSearchTerm')" class="keyword" />
        <a href="#" class="btn">{{ $t('common.button.search') }}</a>
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
      <div class="example-wrapper">
        <ag-grid-vue
          id="schedulingRecommendGrid"
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
    <SchedulingRecommendPop :visible="isPopupVisible" @close="popupClose" />
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import Paginate from '@/components/Paginate.vue';
import moment from 'moment';
import { mapActions, mapState } from 'vuex';
import icoDown from '@/assets/images/ico-down.svg';
import {
  Tooltip,
  TagCell,
  RecommendScheduleCell,
  ScheduleDetailCell,
  CurrentScheduleCell,
} from '@/pages/Advisor/components';
import SchedulingRecommendPop from './SchedulingRecommendPop.vue';
import { i18n } from '../../../../../../public/locales/i18n';
import resourceScheduleService from '@/services/resourceScheduleService';
import axios from 'axios';
import resourceService from '@/services/resourceService';
import _ from 'lodash';

export default {
  components: {
    AgGridVue,
    Paginate,
    Tooltip,
    TagCell,
    RecommendScheduleCell,
    ScheduleDetailCell,
    CurrentScheduleCell,
    SchedulingRecommendPop,
  },
  mixins: [AgGridMixin()],
  data() {
    return {
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      defaultExcelExportParams: null,
      frameworkComponents: null,
      loading: false,
      excelStyles: null,
      previousDay: moment().subtract(1, 'days').format('YYYY.M.D HH:mm'),
      previousMonth: moment().subtract(30, 'days').format('YYYY.M.D HH:mm'),
      pageObj: {
        currentPageNo: 1,
        pageSize: 10,
        totalCnt: 0,
      },
      detailData: {},
      screenX: 0,
      screenY: 0,
      gridToolPanelVisible: false,
      isLoading: false,
      isPopupVisible: false,
      styleMap: {
        Weekday: {
          textColor: 'text-primary-400',
          bgColor: 'bg-white',
        },
        Weekend: {
          textColor: 'text-secondary',
          bgColor: 'bg-white',
        },
        Everyday: {
          textColor: 'text-gray-500',
          bgColor: 'bg-white',
        },
        Day: {
          textColor: 'text-white',
          bgColor: 'bg-yellow',
        },
        Night: {
          textColor: 'text-yellow-600',
          bgColor: 'bg-black',
        },
      },
    };
  },
  computed: {
    ...mapState('resourceScheduling', {
      setRecommendDetailData: 'setRecommendDetailData',
      filter: 'filter',
      selectedCustCorpIds: 'selectedCustCorpIds',
    }),
  },

  watch: {
    '$i18n.locale': ['setColumn', 'rebindGridRows'],
    setRecommendDetailData: async function () {
      if (this.setRecommendDetailData) {
        await this.fetchRecommendDetailData(false);
        this.gridToolPanelVisible = false;
        this.setColumn();
        await this.setData();
      }
    },
    isPopupVisible() {
      if (!this.isPopupVisible) {
        this.rerenderGridRows();
      }
    },
  },

  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      enableAdvancedFilter: true,
      suppressCellSelection: true,
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
      onCellClicked: (params) => {
        this.onCellClicked(params);
      },
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
    };
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
      TagCell: TagCell,
      RecommendScheduleCell: RecommendScheduleCell,
      ScheduleDetailCell: ScheduleDetailCell,
      CurrentScheduleCell: CurrentScheduleCell,
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
    ...mapActions('resourceScheduling', ['fetchRecommendDetailData', 'fetchSchedulingChartData']),
    initPageObj() {
      this.pageObj.currentPageNo = 1;
      this.pageObj.pageSize = 10;
      this.pageObj.totalCnt = 0;
    },
    excelDownload() {
      const exportParams = {
        fileName: `스케줄링 추천 상세내역_${moment().format('YYYY-MM-DD')}.xlsx`,
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
    async setData() {
      const payload = {
        accountIds: this.filter.acntIdList,
        regions: this.filter.regionList.map((item) => (item.id ? item.id : item)),
        services: this.filter.service,
        tags: this.filter.tagList,
        recommendSchedules: this.filter.recommendScheduleList,
      };

      try {
        this.isLoading = true;
        const response = await resourceScheduleService.fetchSchedulingRecommendDetail(payload);
        const dataList = response.data;
        this.rowData = dataList || [];

        // Summary Component에서도 활용
        this.fetchSchedulingChartData(this.rowData);
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching recommended detail:', e);
          this.rowData = [];
        }
      } finally {
        this.pageObj.totalCnt = this.rowData.length;
        this.isLoading = false;
      }
    },
    rerenderGridRows() {
      this.gridOptions.api.redrawRows();
    },
    rebindGridRows() {
      const temp = _.cloneDeep(this.rowData);
      this.rowData = [];
      this.rowData = temp;
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
      let gridId = 'schedulingRecommendGrid';
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
      this.gridColumnApi.autoSizeColumns(this.gridColumnApi.getAllColumns());
    },
    onSaveGridColumnState(e) {
      if (!this.gridColumnApi) return;
      let gridId = 'schedulingRecommendGrid';
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
    setColumn() {
      this.columnDefs = [
        {
          headerName: this.$t('advisor.schedulingRecommend.detailTable.resourceID'),
          field: 'rsrcId',
          resizable: true,
          minWidth: 150,
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          valueFormatter: (params) => params.value || '-',
        },
        {
          headerName: this.$t('advisor.schedulingRecommend.detailTable.instanceType'),
          field: 'instsTypNm',
          resizable: true,
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          minWidth: 150,
          valueFormatter: (params) => params.value || '-',
        },
        {
          headerName: this.$t('advisor.schedulingRecommend.detailTable.tag'),
          field: 'tag',
          resizable: true,
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          minWidth: 150,
          valueFormatter: (params) =>
            params.value ? params.value.map((tag) => `${tag.key}/${tag.value}`).join(', ') : '-',
          cellRendererFramework: 'TagCell',
        },
        {
          headerName: this.$t('advisor.schedulingRecommend.detailTable.currentSchedule'),
          colId: 'currentSchedule',
          field: 'data',
          resizable: true,
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          minWidth: 150,
          valueFormatter: (params) =>
            params.data.curSchdDateNm && params.data.curSchdTimeNm
              ? `${params.data.curSchdDateNm} ${params.data.curSchdTimeNm}`
              : '-',
          cellRendererFramework: 'CurrentScheduleCell',
          cellRendererParams: {
            styleMap: this.styleMap,
          },
        },
        {
          headerName: this.$t('advisor.schedulingRecommend.detailTable.recommendSchedule'),
          field: 'data',
          resizable: true,
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          minWidth: 150,
          valueFormatter: (params) =>
            params.data.recmSchdDateNm && params.data.recmSchdTimeNm
              ? `${params.data.recmSchdDateNm} ${params.data.recmSchdTimeNm}`
              : '-',
          cellRendererFramework: 'RecommendScheduleCell',
          cellRendererParams: {
            styleMap: this.styleMap,
          },
        },
        {
          headerName: this.$t('advisor.schedulingRecommend.detailTable.scheduleDetail'),
          colId: 'scheduleDetail',
          field: 'data',
          resizable: true,
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          minWidth: 150,
          valueFormatter: (params) => this.$t(`advisor.schedulingRecommend.detailTable.check`),
          cellRendererFramework: 'ScheduleDetailCell',
          cellRendererParams: {
            isPopupVisible: this.isPopupVisible,
          },
        },
        {
          headerName: this.$t('advisor.schedulingRecommend.detailTable.estimatedMonthSavingsCost'),
          field: 'mnthExpctSaveAmt',
          resizable: true,
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          minWidth: 150,
          cellRenderer: this.savingCostCellRenderer,
          valueFormatter: (params) => params.value || '-',
        },
        {
          headerName: this.$t('advisor.schedulingRecommend.detailTable.estimatedMonthSavingsRate'),
          field: 'data',
          resizable: true,
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          minWidth: 150,
          valueFormatter: (params) =>
            params.data.mnthExpctSaveRate ? `${params.data.mnthExpctSaveRate.toFixed(2)}%` : '0%',
        },
        {
          headerName: this.$t('advisor.schedulingRecommend.detailTable.service'),
          field: 'cspPrdtNm',
          resizable: true,
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          minWidth: 100,
          valueFormatter: (params) => params.value || '-',
        },
        {
          headerName: this.$t('advisor.schedulingRecommend.detailTable.region'),
          field: 'regionSepNm',
          resizable: true,
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          minWidth: 150,
          valueFormatter: (params) => params.value || '-',
        },
        {
          headerName: this.$t('advisor.schedulingRecommend.detailTable.linkedAccount'),
          field: 'acntId',
          resizable: true,
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          minWidth: 150,
          valueFormatter: (params) => params.value || '-',
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
    },
    popupClose() {
      this.isPopupVisible = false;
    },
    async onCellClicked(params) {
      if (params.column.colId === 'scheduleDetail') {
        try {
          this.isPopupVisible = false;
        } finally {
          this.isPopupVisible = true;
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
    savingCostCellRenderer(params) {
      return params.value
        ? `<div class="flex justify-end" >
          <img src="${icoDown}" alt="." class="mr-1"/>` +
            this.customValueFormatter(params) +
            '</div>'
        : '-';
    },
    instanceTypeRenderer(params) {
      return params.value.title && params.value.detail
        ? `<div class="flex flex-col">
          <span>${params.value.title}</span>
          <span style='color: #A2A2A2'>${params.value.detail}</span>
          </div>`
        : '-';
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

.ag-body-viewport {
  min-height: 120px;
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

.ag-row .ag-cell {
  display: flex;
  justify-content: center; /* align horizontal */
  align-items: center;
  line-height: 24px;
}

.duration {
  height: 36px;
  width: 475px;
  display: flex;
  align-items: center;
  color: #b5b2b2;
  margin-left: 16px;
}

#detailTable {
  .title {
    white-space: wrap !important;
    overflow: visible !important;
  }
}
</style>
