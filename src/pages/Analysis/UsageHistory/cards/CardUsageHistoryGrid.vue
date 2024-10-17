<template>
  <div class="bg-white border rounded-lg border-primary-200 dashboard-card">
    <div class="px-8 border-b py-7 border-primary-200 border-bottom-none">
      <div class="flex items-center justify-between">
        <h3 class="font-bold">{{ type }}별 사용 내역</h3>
        <div class="flex">
          <!--  <button class="flex items-center ml-4 text-sm text-gray-500" @click="billDown">
            청구서 다운로드(html)<img src="@/assets/images/ico-download.svg" alt="." class="ml-1" />
          </button> -->
          <button class="flex items-center ml-4 text-sm text-gray-500" @click="excelDownload">
            다운로드(엑셀)<img src="@/assets/images/ico-download.svg" alt="." class="ml-1" />
          </button>
        </div>
      </div>
    </div>
    <!-- <div class="overflow-y-scroll rounded-bl-lg rounded-br-lg max-h-856-"> -->
    <div class="rounded-bl-lg rounded-br-lg max-h-856-">
      <!-- <div class="grid h-32 text-white bg-gray-700 place-content-center">grid</div>
      <div class="grid h-32 text-white bg-gray-500 place-content-center">grid</div> -->
      <div style="height: 100%">
        <div
          v-show="loading === false && usageCost.length > 0"
          class="top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center"
          style="height: 400px"
        >
          <div class="mb-4 loading_rotate">
            <span class="loadingcolor"></span>
          </div>
          <div class="loading_txt">Loading...</div>
        </div>

        <div v-show="loading === true || usageCost.length === 0" class="example-wrapper usage-history-grid">
          <ag-grid-vue
            id="UsageHistoryGrid"
            :style="{ width: '100%' }"
            class="ag-theme-alpine"
            dom-layout="autoHeight"
            :grid-options="gridOptions"
            :column-defs="columnDefs"
            :default-col-def="defaultColDef"
            :row-data="rowData"
            :animate-rows="true"
            :get-row-style="getRowStyle"
            :pinned-top-row-data="pinnedTopRowData"
            :pinned-bottom-row-data="pinnedBottomRowData"
            :framework-components="frameworkComponents"
            :loading-overlay-component="loadingOverlayComponent"
            :loading-overlay-component-params="loadingOverlayComponentParams"
            :no-rows-overlay-component="noRowsOverlayComponent"
            :no-rows-overlay-component-params="noRowsOverlayComponentParams"
            :suppress-context-menu="true"
            :popup-parent="popupParent"
            :pagination="true"
            :pagination-page-size="paginationPageSize"
            :paginate-child-rows="true"
            :suppress-pagination-panel="true"
            :suppress-scroll-on-new-data="true"
            :debug="true"
            :row-selection="rowSelection"
            :excel-styles="excelStyles"
            @pagination-changed="onPaginationChanged"
            @grid-ready="onGridReady"
          ></ag-grid-vue>
          <GridPagenate
            v-if="rowData.length > 0"
            :total-cnt="paging.totalPage"
            :total-page-cnt="5"
            :page-no="paging.currentPage"
            :page-size="1"
            @onBtnNext="onBtNext"
            @onBtPrevious="onBtPrevious"
            @clickPage="clickPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';
import { mapState, mapGetters } from 'vuex';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import CustomPinnedRowRenderer from './CustomPinnedRowRenderer.js';
import GridPagenate from '@/components/GridPagenate.vue';
import * as _ from 'lodash';

export default {
  components: { AgGridVue, GridPagenate },
  mixins: [AgGridMixin()],
  data() {
    return {
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      columnDefs: null,
      defaultColDef: null,
      getRowStyle: null,
      pinnedTopRowData: null,
      pinnedBottomRowData: null,
      frameworkComponents: null,
      rowSelection: null,
      rowData: null,
      fetchData: null,
      sum: null,
      gridColumnApi: null,
      paginationPageSize: null,
      type: '계약',
      height: '400px',
      paging: {
        pageSize: 0,
        totalPage: 0,
        currentPage: 1,
      },
      gridData: null,
      loading: false,
    };
  },
  watch: {
    usageCost(newVal) {
      this.loading = false;
      let noDataCheck = false;
      let allDay = new Map();
      // lodash 사용 grpNm별 groupby
      if (newVal.length !== 0) {
        let newData = _.chain(newVal)
          .groupBy('grpNm')
          .map(function (v, i) {
            let sum = 0;
            return {
              headerTyp: _.get(_.find(v, 'headerTyp'), 'headerTyp'),
              cspTypCd: _.get(_.find(v, 'cspTypCd'), 'cspTypCd'),
              grpNm: i,
              stdDtList: _.chain(v)
                .groupBy('stdDt')
                .map((v) => {
                  _.get(_.find(v, 'krwUnblendCost'), 'krwUnblendCost') !== undefined
                    ? (sum += _.get(_.find(v, 'krwUnblendCost'), 'krwUnblendCost'))
                    : (sum += 0);
                  if (i !== 'undefined') {
                    allDay.set(_.get(_.find(v, 'stdDt'), 'stdDt'));
                  } else {
                    noDataCheck = true;
                  }
                  return {
                    krwUnblendCost: _.get(_.find(v, 'krwUnblendCost'), 'krwUnblendCost'),
                    stdDt: _.get(_.find(v, 'stdDt'), 'stdDt'),
                  };
                })
                .value(),
              sum: sum,
              allDay: allDay,
              allDayArr: [],
            };
          })
          .orderBy(['headerTyp'])
          .value();
        // 금액별 순서정렬
        newData = _.sortBy(newData, 'sum').reverse();

        if (noDataCheck === true) {
          newData.pop();
        }

        newData.map((v) => {
          for (var [key, value] of newData[0].allDay) {
            v.allDayArr.push(key);
          }
        });
        this.columnDefs = [];
        this.rowData = [];
        this.gridData = newData;
        setTimeout(() => {
          this.setData(newData);
          this.loading = true;
        }, 100);
        // 데이터 크기에 따른 청구목록 height set
        if (newData.length <= 10) {
          //this.height = 134 + 42 * (newData.length - 1) + 'px';
          this.height = 134 + 42 * newData.length - 25.5 + 'px';
        } else {
          this.height = '538px';
        }
      } else if (newVal.length === 0) {
        this.loading = true;
        this.height = '400px';
        this.columnDefs = [
          {
            headerName: '클라우드',
            field: 'clouds',
            sortable: true,
            menuTabs: [],
            cellClass: ['ag-grid-font', 'pl-15'],
            headerComponentParams: {
              template:
                '<div style="padding-left:13px;" class="ag-cell-label-container" role="presentation">' +
                '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
                '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                '  </div>' +
                '</div>',
            },
          },
          {
            headerName: '계약',
            field: 'grpNm',
            sortable: true,
            menuTabs: [],
          },
          {
            headerName: '소계',
            field: 'krwUnblendCost',
            sortable: true,
            menuTabs: [],
            type: 'rightAligned',
            cellClass: ['ag-grid-font', 'text-right', 'numberType'],
          },
          //          { menuTabs: [] },
          //          { menuTabs: [] },
          { menuTabs: [] },
        ];
        this.rowData = [];
        this.gridOptions.api.setPinnedBottomRowData([]);
        const noDataHeight = document.getElementsByClassName('ag-center-cols-clipper')[0];
        noDataHeight.style.height = '200px';
      }
    },
  },
  computed: {
    ...mapState('analysis', ['usageCost', 'filter']),
  },
  beforeMount() {
    if (this.usageCost.length === 0) {
      this.columnDefs = [
        {
          headerName: '클라우드',
          field: 'clouds',
          menuTabs: [],
          cellClass: ['lock-pinned'],
          headerComponentParams: {
            template:
              '<div style="padding-left:13px;" class="ag-cell-label-container" role="presentation">' +
              '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
              '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
              '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
              '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
              '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
              '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
              '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
              '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
              '  </div>' +
              '</div>',
          },
        },
        {
          headerName: '계약',
          field: 'grpNm',
          menuTabs: [],
        },
        {
          headerName: '소계',
          field: 'krwUnblendCost',
          menuTabs: [],
          type: 'rightAligned',
          cellClass: ['ag-grid-font', 'text-right'],
        },
      ];
    } else {
      this.pinnedBottomRowData = [{ cloud: '합계' }];
    }
    this.gridOptions = {};
    this.rowData = [];
    // header
    this.frameworkComponents = {
      customPinnedRowRenderer: CustomPinnedRowRenderer,
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
    this.paginationPageSize = 10;

    this.getRowStyle = (params) => {
      if (params.node.rowPinned === 'bottom') {
        return { 'font-weight': 'bold' };
      }
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    if (this.usageCost.length === 0) {
      const noDataHeight = document.getElementsByClassName('ag-center-cols-clipper')[0];
      noDataHeight.style.height = '400px';
    }
  },
  updated() {
    if (this.gridData[0].allDayArr.length < 5) {
      this.onFirstDataRendered();
    } else {
      this.autoSizeAll();
    }
  },
  methods: {
    onBtNext() {
      this.gridApi.paginationGoToNextPage();
    },
    onBtPrevious() {
      this.gridApi.paginationGoToPreviousPage();
    },
    clickPage(page) {
      this.gridApi.paginationGoToPage(page);
    },
    onGridReady(params) {},
    pagingFn() {
      this.paging.pageSize = this.gridApi.paginationGetPageSize();
      this.paging.totalPage = this.gridApi.paginationGetTotalPages();
      this.paging.currentPage = this.gridApi.paginationGetCurrentPage() + 1;
    },
    onPaginationChanged() {
      if (this.gridApi) {
        this.pagingFn();
      }
    },
    setText(selector, text) {
      document.querySelector(selector).innerHTML = text;
    },
    setLastButtonDisabled(disabled) {
      document.querySelector('#btLast').disabled = disabled;
    },
    setData(newData) {
      let tempData = { krwUnblendCost: 0, grpNm: this.usageCost[0].headerTyp === 'CTRT' ? '합계' : '', cloud: '합계' };
      this.setColumn(newData);
      let days = [];
      for (var [key, value] of newData[0].allDay) {
        days.push(key);
      }
      newData.map((dataList, idx) => {
        this.rowData.push({
          cloud: dataList.cspTypCd !== undefined ? dataList.cspTypCd : '',
          grpNm: dataList.grpNm,
          krwUnblendCost: dataList.sum,
        });

        // 합계 초기값 설정
        if (idx === 0) {
          dataList.allDayArr.map((v) => {
            tempData[v] = 0;
          });
        }

        // 날짜별 dataSet
        dataList.stdDtList.map((stdDtListData, idx2) => {
          this.rowData[idx][stdDtListData.stdDt] =
            stdDtListData.krwUnblendCost === undefined ? '-' : stdDtListData.krwUnblendCost;

          // 합계 ++
          if (dataList.stdDtList[idx2].krwUnblendCost !== undefined) {
            tempData[dataList.stdDtList[idx2].stdDt] += dataList.stdDtList[idx2].krwUnblendCost;
          }
        });

        // 소계 합계
        tempData['krwUnblendCost'] += dataList.sum;
      });
      this.gridOptions.api.setPinnedBottomRowData([tempData]);
    },
    setColumn(newData) {
      let type = '';
      if (newData[0].headerTyp !== undefined) {
        type = newData[0].headerTyp;
      }
      this.columnDefs = [
        {
          headerName: '클라우드',
          field: 'cloud',
          resizable: true,
          sortable: true,
          pinned: 'left',
          width: 150,
          menuTabs: [],
          cellClass: 'lock-pinned',
          lockPinned: true,
          hide: type === 'CTRT' ? true : false,
        },
        {
          headerName: '계약',
          field: 'grpNm',
          resizable: true,
          sortable: true,
          pinned: 'left',
          width: 300,
          cellClass: ['lock-pinned'],
          menuTabs: [],
          lockPinned: true,
        },
        {
          headerName: '소계',
          field: 'krwUnblendCost',
          sortable: true,
          resizable: true,
          pinned: 'left',
          width: 200,
          menuTabs: [],
          type: 'rightAligned',
          cellClass: ['ag-grid-font', 'text-right', 'lock-pinned', 'numberType'],
          lockPinned: true,
          filter: 'agNumberColumnFilter',
          valueFormatter: this.customValueFormatter,
        },
      ];

      if (type === 'CTRT') {
        this.columnDefs[1].headerName = '계약';
        this.type = '계약';
      } else if (type === 'ACNT') {
        this.columnDefs[1].headerName = '계정';
        this.type = '계정';
      } else if (type === 'PRDT') {
        this.columnDefs[1].headerName = '서비스';
        this.type = '서비스';
      } else if (type === 'REGION') {
        this.columnDefs[1].headerName = '리전';
        this.type = '리전';
      }

      // 날짜별 columnDefs 추가
      for (var [key, value] of newData[0].allDay) {
        this.columnDefs.push({
          headerName: key.slice(4, 8).slice(0, 2) + '.' + key.slice(4, 8).slice(2, 4),
          field: key,
          resizable: true,
          cellClass: ['ag-grid-font', 'text-right', 'numberType'],
          type: 'rightAligned',
          menuTabs: [],
          filter: 'agNumberColumnFilter',
          valueFormatter: this.customValueFormatter,
          width: 145,
          suppressSizeToFit: true,
        });
      }

      // 데이터 적을시 공백 처리
      let dataLength = 1;
      if (newData[0].allDayArr.length < 4) {
        dataLength = newData[0].allDayArr.length;

        for (let i = 0; i < 4 - dataLength; i++) {
          this.columnDefs.push({ menuTabs: [] });
        }
      }
    },
    excelDownload() {
      const excelParams = {
        fileName: '사용내역',
        sheetName: '사용내역',
        rowHeight: 40,
        headerRowHeight: 60,
      };
      this.gridApi.exportDataAsExcel(excelParams);
    },
  },
};
</script>
<style>
.usage-history-grid .ag-pinned-left-header .ag-header-row-column {
  top: 0 !important;
  height: 48px !important;
}
</style>
