<template>
  <div id="stat-grid" class="box-wrap" :class="gridToolPanelVisible ? 'close' : ''">
    <div class="title">
      <h4 class="tit-wrap">
        <div class="tab">
          <a :class="buttonClass('cvrg')" @click="handleClickType('cvrg')"
            >{{ titles['cvrg'] }} {{ $t('optimization.history') }}</a
          >
          <a class="ml-1.5" :class="buttonClass('prch')" @click="handleClickType('prch')"
            >{{ titles['prch'] }} {{ $t('optimization.history') }}</a
          >
          <a class="ml-1.5" :class="buttonClass('utl')" @click="handleClickType('utl')"
            >{{ titles['utl'] }} {{ $t('optimization.history') }}</a
          >
        </div>
      </h4>
      <div class="pos-right">
        <a href="javascript:void(0);" class="download" @click="excelDownload()">{{
          $t('common.button.downloadExcel')
        }}</a>
        <button class="fold jsFoldGrid" @click="setSideBarVisible">
          <span>{{ $t('common.button.columnSetting') }}</span>
        </button>
      </div>
    </div>
    <div class="example-wrapper">
      <div>
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
          :pagination-page-size="pageObj.pageSize"
          :suppress-pagination-panel="true"
          :suppress-scroll-on-new-data="true"
          :default-excel-export-params="defaultExcelExportParams"
          :excel-styles="excelStyles"
          :auto-height="true"
          @rowDataChanged="autoSizeAll"
          @grid-ready="onGridReady"
        ></ag-grid-vue>
      </div>
    </div>
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
import { mapActions, mapState } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import Paginate from '@/components/Paginate.vue';
import moment from 'moment';
import CmmtCurStatGridMixin from './CmmtCurStatGridMixin';
import costOptiService from '@/services/costOptiService';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: { AgGridVue, Paginate },
  mixins: [AgGridMixin(), CmmtCurStatGridMixin],
  props: {
    gridOffsetTop: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // param: {},
      type: 'prch', // 구매(prch), 사용(utl), 커버리지(cvrg)
      titles: {},
      gridApi: null,
      gridColumnApi: null,
      gridOptions: null,
      rowData: [],
      columnDefs: [],
      defaultColDef: null,
      defaultExcelExportParams: null,
      frameworkComponents: null,
      loading: false,
      firstRendered: true,
      gridToolPanelVisible: false,
      pageObj: {
        currentPageNo: 1,
        pageSize: 10,
        totalCnt: 0,
      },
    };
  },
  computed: {
    ...mapState('costOpti', ['filter', 'isSearch', 'active']),
  },
  watch: {
    '$i18n.locale': ['setTitles', 'setGridData'],
    loading(newVal) {
      if (newVal) this.gridApi.showLoadingOverlay();
    },
    isSearch(newVal) {
      if (newVal.isSearch) {
        this.setGridData();
      }
    },
    // cvrg, prch, utl
    type() {
      this.setGridData();
    },
    active(newVal) {
      if (newVal.grid) {
        this.handleClickType(newVal.grid);
      }
    },
    gridToolPanelVisible(newVal) {
      this.gridOptions.api.setSideBarVisible(newVal);
      this.gridOptions.api.openToolPanel('columns');
    },
  },
  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      tooltipShowDelay: 0, // 툴팁 표시 지연 시간
      tooltipHideDelay: 2000, // 툴팁 숨김 지연 시간
      enableAdvancedFilter: true,
      suppressCellSelection: true,
      sideBar: {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: i18n.locale === 'ko' ? '컬럼설정' : 'Column Setting',
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
    };
  },
  created() {
    this.setTitles();
    if (this.active.grid) {
      this.handleClickType(this.active.grid);
    }
  },
  mounted() {
    this.defaultExcelExportParams = {
      autoConvertFormulas: true,
    };
    /* 약정대시보드 - 약정현황 > 약정구매현황으로 상세보기 이동 */
    const urlParams = new URLSearchParams(window.location.search);
    const grid = urlParams.get('grid');
    if (grid === 'prch') {
      setTimeout(function () {
        window.location = '#stat-grid';
      }, 1000);
    }
  },
  methods: {
    ...mapActions('costOpti', [
      'fetchInvnListRi',
      'fetchInvnListSp',
      'fetchUtlListRi',
      'fetchUtlListSp',
      'fetchCvrgListRi',
      'fetchCvrgListSp',
    ]),
    setTitles() {
      if (i18n.locale === 'ko') {
        this.titles = {
          cvrg: '커버리지',
          prch: '구매',
          utl: '사용',
        };
      } else {
        this.titles = {
          cvrg: 'Coverage',
          prch: 'Purchase',
          utl: 'Usage',
        };
      }
    },
    autoSizeAll() {
      // Overloading (default: AgGridMinin/autoSizeAll())
      const targetAutoSizeColumns = this.columnDefs.filter((column) => !column.width);
      this.gridColumnApi.autoSizeColumns(targetAutoSizeColumns.map((column) => column.field));
    },
    setSideBarVisible() {
      this.gridToolPanelVisible = !this.gridToolPanelVisible;
    },
    async getPrchRiData() {
      try {
        const result = await costOptiService.fetchInvnListRi(this.filter);
        this.rowData = result.data.data || [];
        this.pageObj.totalCnt = this.rowData.length;
      } catch (err) {
        console.error('getPrchRiData', err);
      }

      this.gridApi.setPinnedTopRowData(null);
      this.focusControl();
    },
    async getPrchSpData() {
      try {
        const result = await costOptiService.fetchInvnListSp(this.filter);
        this.rowData = result.data.data || [];
        this.pageObj.totalCnt = this.rowData.length;
      } catch (err) {
        console.error('getPrchSpData', err);
      }

      this.gridApi.setPinnedTopRowData(null);
      this.focusControl();
    },
    async getUtlRiData() {
      try {
        const result = await costOptiService.fetchUtlListRi(this.filter);
        this.rowData = result.data.data || [];
        this.pageObj.totalCnt = this.rowData.length;
      } catch (err) {
        console.error('getUtlRiData', err);
      }

      const sumCmmtCost = this.accumCalcul('cmmtCost');
      const sumUsedCmmtCost = this.accumCalcul('usedCmmtCost');
      const sumUsedCmmtCostOnDmndEqvlnt = this.accumCalcul('usedCmmtCostOnDmndEqvlnt');
      const sumNetSaveCost = this.accumCalcul('netSaveCost');
      const sumPrchCnt = this.accumCalcul('prchCnt');

      // 실제 데이터 필드
      const floatingTopRowData = [
        {
          id: i18n.locale === 'ko' ? '전체' : 'All',
          lnkdAccNm: i18n.locale === 'ko' ? '전체' : 'All',
          lnkdAccId: '-',
          prodNm: '-',
          rgnNm: '-',
          instTyp: '-',
          platform: '-',
          prchCnt: sumPrchCnt,
          utlRt: (sumUsedCmmtCost / sumCmmtCost) * 100,
          cmmtCost: sumCmmtCost,
          usedCmmtCost: sumUsedCmmtCost,
          usedCmmtCostOnDmndEqvlnt: sumUsedCmmtCostOnDmndEqvlnt,
          netSaveCost: sumNetSaveCost,
        },
      ];

      if (this.rowData.length > 0) {
        this.gridApi.setPinnedTopRowData(floatingTopRowData);
      }
    },
    async getUtlSpData() {
      try {
        const result = await costOptiService.fetchUtlListSp(this.filter);
        this.rowData = result.data.data || [];
        this.pageObj.totalCnt = this.rowData.length;
      } catch (err) {
        console.error('getUtlSpData', err);
      }

      const sumCmmtCost = this.accumCalcul('cmmtCost');
      const sumUsedCmmtCost = this.accumCalcul('usedCmmtCost');
      const sumUsedCmmtCostOnDmndEqvlnt = this.accumCalcul('usedCmmtCostOnDmndEqvlnt');
      const sumNetSaveCost = this.accumCalcul('netSaveCost');

      const floatingTopRowData = [
        {
          id: i18n.locale === 'ko' ? '전체' : 'All',
          lnkdAccNm: i18n.locale === 'ko' ? '전체' : 'All',
          lnkdAccId: '-',
          prodNm: '-',
          rgnNm: '-',
          instFmly: '-',
          utlRt: (sumUsedCmmtCost / sumCmmtCost) * 100,
          cmmtCost: sumCmmtCost,
          usedCmmtCost: sumUsedCmmtCost,
          usedCmmtCostOnDmndEqvlnt: sumUsedCmmtCostOnDmndEqvlnt,
          netSaveCost: sumNetSaveCost,
        },
      ];

      if (this.rowData.length > 0) {
        this.gridApi.setPinnedTopRowData(floatingTopRowData);
      }
    },
    async getCvrgRiData() {
      try {
        const result = await costOptiService.fetchCvrgListRi(this.filter);
        this.rowData = result.data.data || [];
        this.pageObj.totalCnt = this.rowData.length;
      } catch (err) {
        console.error('getCvrgRiData', err);
      }

      const sumCmmtOnDmndCostEqvlnt = this.accumCalcul('cmmtOnDmndCostEqvlnt');
      const sumOnDmndCost = this.accumCalcul('onDmndCost');
      const sumTotOnDmndCostEqvlnt = this.accumCalcul('totOnDmndCostEqvlnt');

      const floatingTopRowData = [
        {
          lnkdAccNm: i18n.locale === 'ko' ? '전체' : 'All',
          lnkdAccId: '-',
          prodNm: '-',
          rgnNm: '-',
          instTyp: '-',
          platform: '-',
          tenancy: '-',
          cmmtCvrgRt: (sumCmmtOnDmndCostEqvlnt / sumTotOnDmndCostEqvlnt) * 100,
          cmmtOnDmndCostEqvlnt: sumCmmtOnDmndCostEqvlnt,
          onDmndCost: sumOnDmndCost,
          totOnDmndCostEqvlnt: sumTotOnDmndCostEqvlnt,
        },
      ];

      if (this.rowData.length > 0) {
        this.gridApi.setPinnedTopRowData(floatingTopRowData);
      }
    },
    async getCvrgSpData() {
      try {
        const result = await costOptiService.fetchCvrgListSp(this.filter);
        this.rowData = result.data.data || [];
        this.pageObj.totalCnt = this.rowData.length;
      } catch (err) {
        console.error('getCvrgSpData', err);
      }

      const sumCmmtOnDmndCostEqvlnt = this.accumCalcul('cmmtOnDmndCostEqvlnt');
      const sumOnDmndCost = this.accumCalcul('onDmndCost');
      const sumTotOnDmndCostEqvlnt = this.accumCalcul('totOnDmndCostEqvlnt');

      const floatingTopRowData = [
        {
          lnkdAccNm: i18n.locale === 'ko' ? '전체' : 'All',
          lnkdAccId: '-',
          prodNm: '-',
          rgnNm: '-',
          instFmly: '-',
          cmmtCvrgRt: (sumCmmtOnDmndCostEqvlnt / sumTotOnDmndCostEqvlnt) * 100,
          cmmtOnDmndCostEqvlnt: sumCmmtOnDmndCostEqvlnt,
          onDmndCost: sumOnDmndCost,
          totOnDmndCostEqvlnt: sumTotOnDmndCostEqvlnt,
        },
      ];
      if (this.rowData.length > 0) {
        this.gridApi.setPinnedTopRowData(floatingTopRowData);
      }
    },
    // Azure RI 커버리지
    async getCvrgAzureRiData() {
      try {
        const result = await costOptiService.fetchCvrgListAzure(this.filter);
        this.rowData = result.data.data || [];
        this.pageObj.totalCnt = this.rowData.length;
      } catch (err) {
        console.error('getCvrgAzureRiData', err);
      }

      const sumCmmtOnDmndCostEqvlnt = this.accumCalcul('cmmtOnDmndCostEqvlnt');
      const sumOnDmndCost = this.accumCalcul('onDmndCost');
      const sumTotOnDmndCostEqvlnt = this.accumCalcul('totOnDmndCostEqvlnt');

      const floatingTopRowData = [
        {
          acntId: i18n.locale === 'ko' ? '전체' : 'All',
          acntNm: '-',
          prodNm: '-',
          rgnNm: '-',
          instFlexGrp: '-',
          instNm: '-',
          cmmtCvrgRt: (sumCmmtOnDmndCostEqvlnt / sumTotOnDmndCostEqvlnt) * 100,
          cmmtOnDmndCostEqvlnt: sumCmmtOnDmndCostEqvlnt,
          onDmndCost: sumOnDmndCost,
          totOnDmndCostEqvlnt: sumTotOnDmndCostEqvlnt,
        },
      ];

      if (this.rowData.length > 0) {
        this.gridApi.setPinnedTopRowData(floatingTopRowData);
      }
    },
    // Azure RI 구매내역
    async getPrchAzureRiData() {
      try {
        const result = await costOptiService.fetchInvnListAzure(this.filter);
        this.rowData = result.data.data || [];
        this.pageObj.totalCnt = this.rowData.length;
      } catch (err) {
        console.error('getPrchAzureRiData', err);
      }

      this.gridApi.setPinnedTopRowData(null);
      this.focusControl();
    },
    // Azure RI 사용내역
    async getUtlAzureRiData() {
      try {
        const result = await costOptiService.fetchUtlListAzure(this.filter);
        this.rowData = result.data.data || [];
        this.pageObj.totalCnt = this.rowData.length;
      } catch (err) {
        console.error('getUtlAzureRiData', err);
      }

      const sumCmmtCost = this.accumCalcul('cmmtCost');
      const sumUsedCmmtCost = this.accumCalcul('usedCmmtCost');
      const sumUsedCmmtCostOnDmndEqvlnt = this.accumCalcul('usedCmmtCostOnDmndEqvlnt');
      const sumNetSaveCost = this.accumCalcul('netSaveCost');
      const sumRsrvQty = this.accumCalcul('rsrvQty');

      const floatingTopRowData = [
        {
          rsrvNm: i18n.locale === 'ko' ? '전체' : 'All',
          rsrvId: '-',
          rsrvOrdId: '-',
          prodNm: '-',
          rgnNm: '-',
          instFlexGrp: '-',
          instNm: '-',
          rsrvQty: sumRsrvQty,
          utlRt: (sumUsedCmmtCost / sumCmmtCost) * 100,
          cmmtCost: sumCmmtCost,
          usedCmmtCost: sumUsedCmmtCost,
          usedCmmtCostOnDmndEqvlnt: sumUsedCmmtCostOnDmndEqvlnt,
          netSaveCost: sumNetSaveCost,
          acntId: i18n.locale === 'ko' ? '전체' : 'All',
          acntNm: i18n.locale === 'ko' ? '전체' : 'All',
        },
      ];

      if (this.rowData.length > 0) {
        this.gridApi.setPinnedTopRowData(floatingTopRowData);
      }
    },
    async setGridData() {
      this.loading = true;

      this.gridApi.setPinnedTopRowData(null);
      this.gridToolPanelVisible = false;

      const type = this.type;
      const cmmtTypList = this.filter.cmmtTypList;

      if (cmmtTypList.includes('SP')) {
        switch (type) {
          case 'cvrg': // 커버리지(AWS SP)
            await this.getCvrgSpData();
            break;
          case 'prch': // 구매내역(AWS SP)
            await this.getPrchSpData();
            break;
          case 'utl': // 사용내역(AWS SP)
            await this.getUtlSpData();
            break;
        }
      } else if (cmmtTypList.includes('RI')) {
        switch (type) {
          case 'cvrg': // 커버리지(AWS RI)
            await this.getCvrgRiData();
            break;
          case 'prch': // 구매내역(AWS RI)
            await this.getPrchRiData();
            break;
          case 'utl': // 사용내역(AWS RI)
            await this.getUtlRiData();
            break;
        }
      } else if (cmmtTypList.includes('AzureRI')) {
        switch (type) {
          case 'cvrg': // 커버리지(Azure RI)
            await this.getCvrgAzureRiData();
            break;
          case 'prch': // 구매내역(Azure RI)
            await this.getPrchAzureRiData();
            break;
          case 'utl': // 사용내역(Azure RI)
            await this.getUtlAzureRiData();
            break;
        }
      }
      this.setColumnVisible();
      this.pageChange(1);
      this.loading = false;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    },
    setColumnVisible() {
      const type = this.type;
      const cmmtTyp = this.filter.cmmtTypList[0];
      const visibleList = this.columnObj[type][cmmtTyp];
      this.setCurCmmtTyp(cmmtTyp); // Mixin내 정의된 컬럼 헤더명을 CSP별로 정의하기 위해 약정종류 설정

      // Grid 컬럼 전체 항목을 정의하고 이중에 선택(커버리지내역/구매내역/사용내역)에 따라 필수 컬럼만
      // 추출하여 바인딩
      this.columnDefs = [];
      // 주의! 바인딩된 컬럼을 비워도 실제로 헤더 정보가 남아 있어 순서가 어긋날 수 있다.
      // 아래 API호출하여 헤더 정보를 비워야 함.
      this.gridApi.setColumnDefs([]);
      // visibileList의 순서에 맞춰 항목 정렬된 상태로 가져옴.
      visibleList.forEach((target) => {
        const col = this.allColumns.find((col) => col.field === target);
        if (col) {
          switch (col.field) {
            case 'rsrvId': // Reservation ID
            case 'rsrvOrdId': // Reservation 주문 ID
              col.suppressToolPanel = true;
              col.hide = true;
              break;
            default:
              break;
          }
          this.columnDefs.push(col);
        }
      });
    },
    accumCalcul(key) {
      return this.rowData.reduce((accm, val) => {
        accm += val[key];
        return accm;
      }, 0);
    },
    numberWithCurcyUnit(number) {
      if (typeof number !== 'number') return '-';
      const numProcessed = number ? Math.floor(Math.abs(number)).toLocaleString() : 0;
      return number >= 0 ? '₩' + numProcessed : '-₩' + numProcessed;
    },
    handleClickType(type) {
      this.type = type;
    },
    buttonClass(type) {
      const button = 'inline-block rounded px-2 py-1.5 font-bold border border-primary-400 text-sm ';
      return this.type === type ? button + 'text-white bg-primary-400' : button + 'text-primary-400 bg-white';
    },
    pageChange(pageNo) {
      this.pageObj.currentPageNo = pageNo;
      this.gridApi.paginationGoToPage(pageNo - 1);
    },
    excelDownload() {
      const cmmtTyp = this.filter.cmmtTypList.join(' ');
      this.gridApi.exportDataAsExcel({
        sheetName: `${cmmtTyp} (${this.titles[this.type]}) ${this.$t('optimization.contractStatusDetails')}`,
        fileName: `${cmmtTyp} (${this.titles[this.type]}) ${this.$t(
          'optimization.contractStatusDetails'
        )}_${moment().format('YYYY-MM-DD')}.xlsx`,
      });
    },
    scrollTo() {
      if (this.firstRendered && this.gridOffsetTop > 0) {
        window.scrollTo({ left: 0, top: this.gridOffsetTop });
        this.firstRendered = false;
      }
    },
    focusControl() {
      const focusOnGrid = this.$route.query.focus === 'grid' && this.active.grid;
      if (focusOnGrid && this.firstRendered && this.gridOffsetTop > 0) {
        window.scrollTo({ left: 0, top: this.gridOffsetTop });
        this.firstRendered = false;
      }
    },
  },
};
</script>

<style>
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
.right-aligned-cell {
  text-align: right;
}
.cell-bg-blue {
  background-color: #f1f9ff;
}
.box-wrap.close .title .pos-right .fold:before {
  transform: rotate(180deg);
}

div[row-index='t-0'] {
  background: #f8f8f8 !important;
}

div[row-index='t-0'] > * {
  font-weight: bold !important;
}
</style>
