<template>
  <div class="box-wrap" :class="gridToolPanelVisible ? 'close' : ''">
    <div class="title">
      <h4 class="tit-wrap">
        <span>{{ $t('optimization.detailsEligibleContract') }}</span>
        <!-- tooltip -->
        <div class="tooltip-wrap">
          <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
          <div class="tooltip-layer">
            <strong class="ti">{{ $t('optimization.detailsEligibleContract') }}</strong>
            {{ $t('optimization.providesDetailedInformation') }}
            <br />{{ $t('optimization.considerPurchasingContract') }}<br />{{
              $t('optimization.findPurchasingApplyingContract')
            }}
            <button class="close jsTooltipClose1">툴팁 닫기</button>
          </div>
        </div>
        <!-- //tooltip -->
      </h4>
      <div class="pos-right">
        <a href="javascript:void(0)" class="download" @click="excelDownload">{{ $t('common.button.downloadExcel') }}</a>
        <button class="fold jsFoldGrid" @click="setSideBarVisible">
          <span>{{ $t('common.button.columnSetting') }}</span>
        </button>
      </div>
    </div>
    <div style="height: 100%" class="bl_none">
      <div class="example-wrapper">
        <ag-grid-vue
          id="billOverViewGrid"
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :grid-options="gridOptions"
          :row-data="rowData"
          :column-defs="columnDefs"
          :default-col-def="defaultColDef"
          :dom-layout="domLayout"
          :get-data-path="getDataPath"
          :modules="modules"
          :framework-components="frameworkComponents"
          :loading-overlay-component="loadingOverlayComponent"
          :loading-overlay-component-params="loadingOverlayComponentParams"
          :no-rows-overlay-component="noRowsOverlayComponent"
          :no-rows-overlay-component-params="noRowsOverlayComponentParams"
          :popup-parent="popupParent"
          :suppress-context-menu="true"
          :pagination="true"
          :pagination-page-size="pageObj.pageSize"
          :suppress-pagination-panel="true"
          :suppress-scroll-on-new-data="true"
          :excel-styles="excelStyles"
          @first-data-rendered="autoSizeAll"
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
import { mapState } from 'vuex';
import costOptiService from '@/services/costOptiService';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import Paginate from '@/components/Paginate.vue';
import moment from 'moment';
import CspSwitchGridMixin from './cspSwitchGridMixin';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: { AgGridVue, Paginate },
  mixins: [AgGridMixin(), CspSwitchGridMixin],
  data() {
    return {
      gridOptions: null,
      gridToolPanelVisible: false,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      frameworkComponents: null,
      loading: false,
      parma: {},
      pageObj: {
        currentPageNo: 1,
        pageSize: 10,
        totalCnt: 0,
      },
      cmmtType: 'All',
    };
  },
  computed: {
    ...mapState('costOpti', ['filter', 'isSearch']),
  },
  watch: {
    '$i18n.locale': 'setGridData',
    loading(newVal) {
      if (newVal) this.gridApi.showLoadingOverlay();
    },
    filter(newVal) {
      this.param = newVal;
      if (this.param.cmmtTypList.length >= 2) {
        this.cmmtType = 'All';
      } else {
        this.cmmtType = this.param.cmmtTypList[0];
      }
    },
    isSearch(newVal) {
      if (newVal.isSearch) {
        this.setGridData();
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
    };
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  methods: {
    excelDownload() {
      this.gridApi.exportDataAsExcel({
        sheetName: `${this.filter.cspTypCd} ${this.$t('optimization.detailsEligibleTargets')}`,
        fileName: `${this.filter.cspTypCd} ${this.$t(
          'optimization.detailedInformationEligibleTargets'
        )}_${moment().format('YYYY-MM-DD')}.xlsx`,
      });
    },
    getDataPath: function (data) {
      return data.orgHierarchy;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      params.api.sizeColumnsToFit();
    },
    async setGridData() {
      this.loading = true;
      this.gridToolPanelVisible = false; // 컬럼필터 박스 닫기

      try {
        const result = await costOptiService.fetchList(this.param);
        this.rowData = result.data.data;
        this.pageObj.totalCnt = this.rowData.length;
        this.pageChange(1);
      } catch (err) {
        console.error('setGridData', err);
      }

      if (this.rowData.length > 0) {
        const totCmmtCvrgRt = this.accumCalcul('cmmtCvrgRt');
        const totCmmtOnDmndCostEqvlnt = this.accumCalcul('cmmtOnDmndCostEqvlnt');
        const totOnDmndCost = this.accumCalcul('onDmndCost');
        const AllTotOnDmndCostEqvlnt = this.accumCalcul('totOnDmndCostEqvlnt');
        const floatingTopRowData = [
          {
            lnkdAccNm: i18n.locale === 'ko' ? '전체' : 'All',
            lnkdAccId: '-',
            acntId: i18n.locale === 'ko' ? '전체' : 'All',
            acntNm: '-', // azure
            prodNm: '-', // azure
            cmmtTyp: '-',
            rgnNm: '-',
            instFmly: '-',
            instFlexGrp: '-', // azure
            instNm: '-', // azure
            cmmtCvrgRt: (100 * totCmmtOnDmndCostEqvlnt) / AllTotOnDmndCostEqvlnt,
            cmmtOnDmndCostEqvlnt: totCmmtOnDmndCostEqvlnt,
            onDmndCost: totOnDmndCost,
            totOnDmndCostEqvlnt: AllTotOnDmndCostEqvlnt,
          },
        ];
        this.gridApi.setPinnedTopRowData(floatingTopRowData);
        //cmmtCvrgRt cmmtOnDmndCostEqvlnt onDmndCost totOnDmndCostEqvlnt
      } else {
        this.gridApi.setPinnedTopRowData([]);
      }
      this.setColumn();
      this.loading = false;
    },
    setColumn() {
      this.columnDefs = [];
      this.gridApi.setColumnDefs([]);
      this.columnDefs = this.getColumns; // cpsSwitchGridMixin
      this.gridApi.setColumnDefs(this.columnDefs);
      this.defaultColDef = { flex: -1 };
    },
    autoSizeAll() {
      const allColumnIds = [];
      this.gridColumnApi.getAllColumns().forEach((column) => {
        allColumnIds.push(column.getId());
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, false);
    },
    pageChange(pageNo) {
      this.pageObj.currentPageNo = pageNo;
      this.gridApi.paginationGoToPage(pageNo - 1);
    },
    // API 서비스 데이터 중 특정 키에 대한 값을 모두 더하여 반환한다.
    accumCalcul(key) {
      return this.rowData.reduce((acc, val) => {
        acc += val[key];
        return acc;
      }, 0);
    },
    setSideBarVisible() {
      this.gridToolPanelVisible = !this.gridToolPanelVisible;
    },
    numberWithCurcyUnit(number) {
      if (typeof number !== 'number') return '-';
      const numProcessed = number ? Math.floor(Math.abs(number)).toLocaleString() : 0;
      return number >= 0 ? '₩' + numProcessed : '-₩' + numProcessed;
    },
  },
};
</script>

<style>
.outDivBox {
  height: 100%;
  width: 100%;
  display: flex; /* Flexbox 레이아웃 사용 */
  justify-content: space-between; /* 요소들 사이의 간격을 균등하게 배치 */
}
.outDivBox .percent-box {
  /* width: 100%; */
  width: 110px;
  height: 47%;
  margin: 10px 0 0 7px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: flex-start;
}
.outDivBox .fill {
  flex-grow: 1;
  background: linear-gradient(
    to right,
    var(--fill-color) 0%,
    var(--fill-color) var(--percent),
    transparent var(--percent)
  );
}
/* .percent-text {
} */
.ag-header-cell-label {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 그리드 컬럼 화살표 이벤트 */
.box-wrap.close .title .pos-right .fold:before {
  transform: rotate(180deg);
}
</style>
