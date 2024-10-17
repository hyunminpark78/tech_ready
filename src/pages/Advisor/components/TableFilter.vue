<template>
  <div>
    <div class="spot-tab-filter-container">
      <div class="left">
        <div class="required">
          <div class="flex-container column" style="display: flex; flex-direction: column">
            <div class="label-container" style="display: flex; flex-direction: row; align-items: center">
              <img src="@/assets/images/required-01.svg" alt="required" />
              <p class="table__search-title">인스턴스 수</p>
            </div>
            <div class="input-wrapper">
              <div class="input">
                <input
                  v-model="instanceCount"
                  type="number"
                  style="
                    font-size: 1rem;
                    color: #333;
                    width: 4rem;
                    text-align: center;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 0.25rem;
                  "
                />
                <span style="margin-left: 0.25rem">개</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="required" style="display: flex; flex-direction: column; align-items: flex-start">
          <div class="flex-container" style="display: flex; flex-direction: row; align-items: center">
            <img src="@/assets/images/required-01.svg" alt="required" />
            <p class="table__search-title">인스턴스 타입</p>
          </div>
          <div class="input-wrapper" style="width: 100%">
            <div class="input" style="width: 100%">
              <img src="@/assets/images/search-01.svg" alt="search-icon" style="position: absolute; left: 10px" />
              <input
                v-model="instanceType"
                type="text"
                style="
                  font-size: 1rem;
                  color: #333;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                  padding: 0.25rem 0.25rem 0.25rem 2rem;
                "
              />
            </div>
            <img
              src="@/assets/images/restart-icon.svg"
              alt="restart-icon"
              style="cursor: pointer; margin-left: 10px"
              @click="resetFilter"
            />
          </div>
        </div>
      </div>
    </div>
    <div id="detailTable" class="box-wrap filter-grid">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        :class="isLoading ? 'hidden' : 'ag-theme-alpine'"
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
      ></ag-grid-vue>

      <!--      <Paginate-->
      <!--        v-if="pageObj.totalCnt > 0"-->
      <!--        :page-size="pageObj.pageSize"-->
      <!--        :page-no="pageObj.currentPageNo"-->
      <!--        :total-cnt="pageObj.totalCnt"-->
      <!--        @changepage="pageChange"-->
      <!--      />-->
    </div>

    <div class="warning">
      <img src="@/assets/images/required-01.svg" alt="다음 페이지" />
      <p>가격 및 절감률 조회 시 인스턴스 타입은 한 가지만 조회 가능합니다.</p>
    </div>
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
import demoData from '../../../../public/locales/gpudemo.json';
// import CheckboxRenderer from '@/pages/Advisor/components/CheckboxRenderer.vue';

export default {
  components: { AgGridVue, Paginate },
  mixins: [AgGridMixin()],
  props: {
    selectedRegion: {
      type: Object,
      required: true,
    },
    currentTab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      gridOptions: null,
      rowData: demoData.filterTableData,
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
        pageSize: 1000,
        totalCnt: 0,
      },
      detailData: {},
      screenX: 0,
      screenY: 0,
      gridToolPanelVisible: false,
      isLoading: false,
      instanceCount: 0,
      instanceType: '',
    };
  },
  computed: {
    ...mapState('resourceOpti', {
      setRecommendDetailData: 'setRecommendDetailData',
      filter: 'filter',
    }),
  },

  watch: {
    '$i18n.locale': ['setAllItem', 'setColumn', 'setData'],
    setRecommendDetailData: async function () {
      if (this.setRecommendDetailData) {
        this.fetchRecommendDetailData(false);
        await this.setData();
      }
    },
    instanceType() {
      this.rowData = [...demoData.filterTableData].filter((e) =>
        e.instanceType.toLowerCase().includes(this.instanceType.toLowerCase())
      );
      this.pageObj.totalCnt = [...demoData.filterTableData].filter((e) =>
        e.instanceType.toLowerCase().includes(this.instanceType.toLowerCase())
      ).length;
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
      // checkboxRenderer: CheckboxRenderer,
    };
  },

  mounted() {
    this.setGridDataInit();
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.setColumn();

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
    ...mapActions('resourceOpti', ['fetchRecommendDetailData']),
    setAllItem() {
      this.allItem = {
        id: 'checkAll',
        text: '전체',
      };
    },
    initPageObj() {
      this.pageObj.currentPageNo = 1;
      this.pageObj.pageSize = 1000;
      this.pageObj.totalCnt = demoData.filterTableData.length;
    },
    async setGridDataInit() {
      this.initPageObj();
    },
    async setData() {
      // spotGPUService.getSpotGPUList({ regions: this.selectedRegion }).then((res) => {
      //   debugger;
      //   this.rowData = res.data;
      //   this.isLoading = false;
      // });
      this.rowData = demoData.filterTableData;
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
      this.gridColumnApi.autoSizeColumns(allColumnIds, false);
    },
    setColumn() {
      this.columnDefs = [
        {
          headerName: '',
          resizable: true,
          field: 'test',
          minWidth: 40,
          width: 40,
          headerClass: ['gpu-header-merge'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: this.testFunc,
        },
        {
          headerName: this.$t('advisor.detailTable.instanceSeparation'),
          field: 'instanceType',
          resizable: true,
          headerClass: ['gpu-header-merge'],
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          minWidth: 120,
          valueFormatter: (params) => params.value || '-',
        },
        {
          headerName: 'GPU',
          field: 'GPU',
          resizable: true,
          headerClass: ['gpu-header-merge'],
          cellClass: ['ag-grid-font', 'text-center', 'numberType'],
          sortable: true,
          menuTabs: [],
          minWidth: 110,
          valueFormatter: (params) => params.value || '-',
          tooltipValueGetter: (p) => `${p.value || '-'}`,
        },
        {
          headerName: this.$t('advisor.detailTable.GPUMemory'),
          field: 'GPUmemory',
          resizable: true,
          headerClass: ['gpu-header-merge'],
          cellClass: ['ag-grid-font', 'text-center', 'numberType'],
          sortable: true,
          menuTabs: [],
          minWidth: 110,
          // cellRenderer: this.savingCostCellRenderer,
          tooltipValueGetter: (p) => `${p.value || '-'}`,
        },
        {
          headerName: 'vCPU',
          field: 'vCPU',
          resizable: true,
          headerClass: ['gpu-header-merge'],
          cellClass: ['ag-grid-font', 'text-center', 'percentType'],
          sortable: true,
          menuTabs: [],
          minWidth: 110,
          valueFormatter: (params) => params.value || '-',
        },
        {
          headerName: this.$t('advisor.detailTable.memory'),
          field: 'memory',
          resizable: true,
          headerClass: ['gpu-header-merge'],
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          minWidth: 110,
          valueFormatter: (params) => `${params.value} GiB` || '-',
        },
        {
          headerName: this.$t('advisor.detailTable.CPUArchitecture'),
          field: 'architecture',
          resizable: true,
          headerClass: ['gpu-header-merge'],
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          menuTabs: [],
          wrapText: true,
          autoHeight: true,
          minWidth: 110,
          cellRenderer: this.architechureRenderer,
        },
        {
          headerName: this.$t('advisor.detailTable.acceleratorType'),
          field: 'acceleratorType',
          resizable: true,
          headerClass: ['gpu-header-merge'],
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          wrapText: true,
          autoHeight: true,
          menuTabs: [],
          minWidth: 110,
          cellRenderer: this.architechureRenderer,
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
    testFunc(params) {
      return `<div class="flex justify-end" onclick="asd(params)">
          <input onchange="asd(params)" type="checkbox"/></div>`;
    },
    architechureRenderer(params) {
      return params.value
        ? `<div class="flex flex-col">
            ${params.value.slice(0, 3).map((e) => `<div>${e}</div>`)}
          </div>`.replace(/,/g, '')
        : '-';
    },
    resetFilter() {
      this.instanceCount = 0;
      this.instanceType = '';
    },
    openComparisonPopup() {
      this.$emit('openPopup');
    },
  },
};
</script>
<style lang="scss">
.spot-tab-filter-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #5ba9ca;

  .left,
  .right {
    width: 50%;
  }

  .flex-container {
    display: flex;
    align-items: center;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
  }

  .input {
    display: flex;
    align-items: center;
    position: relative;
  }

  .input input {
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .input img {
    position: absolute;
    left: 0.5rem;
  }

  .input span {
    margin-left: 0.5rem;
    font-size: 1rem;
  }
}

.table__search .input-wrapper {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
}

.table__search .input-wrapper .input {
  display: flex;
  flex-direction: row;
  padding: 6px 16px 6px 32px;
  max-width: 262px;
  width: 100%;
  border-radius: 0.25rem;
  border: 1px solid #e9ebed;
  background: #fff;
  position: relative;

  img {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
}

.warning {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0.75rem;
  color: #999;
  font-size: 0.75rem;
  font-weight: 400;
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

.filter-grid .ag-body-viewport {
  min-height: 186px;
  text-align: center;
  height: 210px;
  overflow: auto !important;

  &::-webkit-scrollbar-thumb {
    background-color: #a8a8a8;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #a8a8a8;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }
  .ag-center-cols-viewport {
    overflow: auto !important;
  }
}

.ag-root-wrapper-body .no-display-in-grid {
  display: none !important;
}

.example-wrapper .gpu-header-merge {
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

.box-wrap .flex.items-center:last-child {
  padding-bottom: 0;
  margin: 10px 0;
}
</style>
