<template>
  <div class="box-wrap">
    <div class="title">
      <h4 class="tit-wrap">
        <span>{{ $t('optimization.recommendedDetails') }}</span>
        <div class="tooltip-wrap">
          <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
          <div class="tooltip-layer">
            <strong class="ti">{{ $t('optimization.recommendedDetails') }}</strong>
            {{ $t('optimization.provideDetailedInformation') }}
            <button class="close jsTooltipClose1">툴팁 닫기</button>
          </div>
        </div>
        <span v-if="!!rowData.length" class="info">{{ $t('optimization.analysisPeriod') }} : {{ dataRange }}</span>
      </h4>
      <a href="javascript:void(0)" class="download" @click="excelDownload">{{ $t('common.button.downloadExcel') }}</a>
    </div>
    <div style="min-height: 200px" class="bl_none">
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
          :default-excel-export-params="defaultExcelExportParams"
          :excel-styles="excelStyles"
          @first-data-rendered="onFirstDataRendered"
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
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import Paginate from '@/components/Paginate.vue';
import { DETAIL_HEADER } from './GridHeaderEnum';
import * as _ from 'lodash';
import moment from 'moment';
import { numberCutDecimal, numberProcess } from '../CmmtPsblTgt/CostOptiCommon';

export default {
  components: { AgGridVue, Paginate },
  mixins: [AgGridMixin()],

  data() {
    return {
      // gridApi: null,
      // gridOptions: null,
      rowData: [],
      columnDefs: null,
      defaultColDef: null,
      frameworkComponents: null,
      defaultExcelExportParams: null,
      pageObj: {
        currentPageNo: 1,
        pageSize: 10,
        totalCnt: 0,
      },
      dataRange: '',
    };
  },
  computed: {
    ...mapState('costOpti', ['filter', 'recommendOption', 'loading']),
  },
  watch: {
    loading(newVal) {
      if (newVal) {
        this.gridApi.showLoadingOverlay();
      }
    },
    async recommendOption(newVal) {
      const enrollment = await this.setGridData();
      this.setColumn({ ...newVal, ...enrollment });
    },
  },
  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      tooltipShowDelay: 0, // 툴팁 표시 지연 시간
      tooltipHideDelay: 2000, // 툴팁 숨김 지연 시간
    };
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  mounted() {
    this.defaultExcelExportParams = {
      autoConvertFormulas: true,
      processCellCallback: this.getDefaultIsNullOrEmpty,
    };
  },
  methods: {
    getDefaultIsNullOrEmpty(params) {
      if (params.value === undefined || params.value === null || params.value === '') {
        return '-';
      }
      return params.value;
    },
    getDataPath(data) {
      return data.orgHierarchy;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
    pageChange(pageNo) {
      this.pageObj.currentPageNo = pageNo;
      this.gridApi.paginationGoToPage(pageNo - 1);
    },
    setColumn(params) {
      if (!params.rcmdProd) return;

      const { rcmdProd } = params;
      const rcmdProdUpper = rcmdProd.nm.toUpperCase().replace(/\s+/g, '');
      const header = `${rcmdProdUpper}_HEADER`;
      const headerNames = this.headerSort(params);

      const targetColumns = [];
      headerNames.forEach((item) => {
        const name = item[header] || item.headerName;
        const columnAttribute = {};
        if (name) {
          columnAttribute.field = item.field;
          columnAttribute.headerName = name;
          columnAttribute.menuTabs = [];
          columnAttribute.headerClass = ['text-center'];
          columnAttribute.cellClass = ['ag-grid-color-font', 'text-center'];

          // SageMaker의 구매 유형: SageMaker
          if (header === 'SAGEMAKER_HEADER' && columnAttribute.field === 'spTyp') {
            columnAttribute.cellRenderer = () => 'SageMaker';
          }

          if (
            name.indexOf('금액') > -1 ||
            name.indexOf('절감액') > -1 ||
            name.indexOf('비용') > -1 ||
            name.indexOf('Hourly') > -1 ||
            name.indexOf('savings') > -1 ||
            name.indexOf('cost') > -1
          ) {
            columnAttribute.cellClass = ['ag-grid-color-font', 'text-right', 'numberType'];
            columnAttribute.type = 'rightAligned';
            columnAttribute.valueFormatter = (params) => `${this.numberWithCurcyUnit(params.value)}`;
            columnAttribute.cellRenderer = (params) => {
              return `₩${numberCutDecimal(params.value)}`;
            };
          }
          if (name.indexOf('절감률') > -1 || name.indexOf('Savings rate') > -1) {
            columnAttribute.cellClass = ['ag-grid-color-font', 'text-right', 'percentType'];
            columnAttribute.type = 'rightAligned';
            if (params.type === 'AzureRI')
              // '월 예상 총 비용' / '월 종량제(온디맨드) 비용'
              columnAttribute.valueGetter = (params) => params.data.mnthExpctCmmtSaveCost / params.data.mnthOnDmndCost;
            columnAttribute.valueFormatter = (params) => `${numberProcess(params.value * 100)}%`;
          }
          if (name.indexOf('수량') > -1 || name.indexOf('quantity') > -1) {
            columnAttribute.cellClass = ['ag-grid-color-font', 'text-right', 'defaultNumberType'];
            columnAttribute.type = 'rightAligned';
            columnAttribute.valueFormatter = (params) => `${numberCutDecimal(params.value)}`;
            columnAttribute.cellRenderer = (params) => {
              return `${numberCutDecimal(params.value)}`;
            };
          }

          // 값이 없는 경우 일괄 '-'로 치환
          if (!('valueFormatter' in columnAttribute)) {
            columnAttribute.valueFormatter = this.getDefaultIsNullOrEmpty;
          }

          columnAttribute.sortable = true;
          columnAttribute.resizable = true;
          columnAttribute.hide = item.hide ? item.hide : false;

          targetColumns.push(columnAttribute);
        }
      });

      this.gridApi.setColumnDefs([]);
      this.columnDefs = targetColumns;
      this.defaultColDef = { flex: -1 };
      // 항목 툴팁 활성화
      this.enabledTooltips(this.columnDefs);
    },
    async setGridData() {
      if (this.recommendOption.recInvnList.length > 0) {
        const cloneList = _.cloneDeep(this.recommendOption.recInvnList);
        cloneList.map((val) => {
          switch (this.recommendOption.type) {
            case 'SP':
            case 'RI':
              val.accId = `${val.lnkdAccNm}(${val.lnkdAccId})`;
              val.savingsRate = val.mnthSaveCost / val.mnthOnDmndCost;
              break;
            case 'AzureRI':
              val.accId = `${val.acntNm}(${val.acntId})`;
              val.savingsRate = val.mnthExpctCmmtSaveCost / val.mnthOnDmndCost;
              break;
            default:
              break;
          }
        });
        const minDate = this.minDate(cloneList.map((val) => val.analStrDate));
        const maxDate = this.maxDate(cloneList.map((val) => val.analEndDate));
        this.dataRange = `${minDate} ~ ${maxDate}`;
        this.rowData = cloneList;
      } else {
        this.rowData = [];
      }
      this.pageObj.totalCnt = this.recommendOption.recInvnList.length;
      this.pageChange(1);

      const showEnroll = this.rowData.some((item) => item.enrollShowYn === 'Y');
      const showSubsc = this.rowData.some((item) => item.subscShowYn === 'Y');

      return { showEnroll, showSubsc };
    },
    excelDownload() {
      const xlsPrefix = `${this.recommendOption.type} (${this.recommendOption.rcmdProd.nm})`;
      this.gridApi.exportDataAsExcel({
        sheetName: `${xlsPrefix} ${this.$t('optimization.commitmentRecommendationDetails')}`,
        fileName: `${xlsPrefix} ${this.$t('optimization.commitmentRecommendationDetails')}_${moment().format(
          'YYYY-MM-DD'
        )}.xlsx`,
      });
    },
    autoSizeAll() {
      const allColumnIds = [];
      this.gridColumnApi.getAllColumns().forEach((column) => {
        allColumnIds.push(column.getId());
      });
      this.gridColumnApi.sizeColumnsToFit(200);
      this.gridColumnApi.autoSizeColumns(allColumnIds, false);
    },
    headerSort(params) {
      const headerName = DETAIL_HEADER(params);
      return Object.keys(headerName)
        .map((key) => headerName[key])
        .sort((a, b) => a.order - b.order);
    },
    maxDate(totalDateList) {
      return totalDateList.reduce((maxDate, date) => {
        if (maxDate <= date) {
          maxDate = date;
          return maxDate;
        } else {
          return maxDate;
        }
      }, '1999-01-01');
    },
    minDate(totalDateList) {
      return totalDateList.reduce((minDate, date) => {
        if (minDate <= date) {
          return minDate;
        } else {
          minDate = date;
          return minDate;
        }
      }, '2100-01-01');
    },
    numberWithCurcyUnit(number) {
      if (typeof number !== 'number') return '-';
      const numProcessed = number ? Math.floor(Math.abs(number)).toLocaleString() : 0;
      return number >= 0 ? '₩' + numProcessed : '-₩' + numProcessed;
    },
  },
};
</script>

<style scoped>
.flex.items-center.justify-between.w-full.font-bold.text-gray-700.ellipsis span {
  max-width: 113px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
