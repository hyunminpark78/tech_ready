<template>
  <div class="box-wrap">
    <div class="title">
      <!-- search -->
      <div class="search-wrap">
        <input
          v-model="keyword"
          type="text"
          :placeholder="$t('common.placeholder.enterSearchTerm')"
          class="keyword"
          @keyup.enter="search"
        />
        <a href="javascript:void(0);" class="btn" @click="search">{{ $t('common.button.search') }}</a>
      </div>
      <!-- //search -->
      <div class="pos-right">
        <a class="download" @click="excelDownload">{{ $t('common.button.downloadExcel') }}</a>
        <button class="fold jsFold1" @click="chartView = !chartView">
          <span>{{ chartView ? $t('cost.collapse') : $t('cost.expand') }}</span>
        </button>
      </div>
    </div>
    <div style="height: 100%">
      <div v-if="!loading" class="example-wrapper" style="width: 100%; height: 100%">
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
          @grid-ready="onGridReady"
        ></ag-grid-vue>
      </div>
      <template v-else>
        <div class="relative border-t" style="height: 350px">
          <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
            <div class="mb-4 loading_rotate">
              <span class="loadingcolor"></span>
            </div>
            <div class="loading_txt">Loading...</div>
          </div>
        </div>
      </template>
      <div ref="dimmed" class="dimmed" style="display: none"></div>
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
import { mapActions, mapGetters, mapState } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import Paginate from '@/components/Paginate.vue';
import APICaller, { getZuulHost } from '@/library/APICaller';
import { getLocal } from '@/library/Common';
import costExService from '@/services/costExService';
import * as _ from 'lodash';
import moment from 'moment';

export default {
  components: {
    AgGridVue,
    Paginate,
  },
  mixins: [AgGridMixin()],
  props: {
    groupName: { type: String, default: '' },
    periodType: { type: String, default: '' },
    curcyCode: { type: String, default: 'USD' },
  },
  data() {
    return {
      chartView: true,
      gridApi: null,
      rowData: [],
      columnDefs: null,
      defaultColDef: {
        resizable: true,
        flex: 1,
      },
      autoGroupColumnDef: null,
      groupDefaultExpanded: null,
      frameworkComponents: null,
      defaultExcelExportParams: null,
      excelStyles: null,
      gridOptions: null,
      loading: true,
      keyword: '',
      pageObj: {
        currentPageNo: 1,
        pageSize: 10,
        totalCnt: 0,
      },
    };
  },
  computed: {
    ...mapState('costEx', ['costExplorerList', 'searchParam']),
    ...mapGetters('costEx', ['cspTypCd']),
    sumKey() {
      return this.curcyCode === 'USD' ? 'sum' : 'krwSum';
    },
  },
  watch: {
    // 다국어 변경 시 차트를 재매핑
    '$i18n.locale': ['setColumn'],
    costExplorerList(list) {
      this.columnDefs = [];
      this.keyword = '';
      this.setGridData(list);
    },
    curcyCode() {
      this.search();
    },
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.setColumn();
    this.defaultExcelExportParams = {
      autoConvertFormulas: true,
      processCellCallback: (params) => {
        const column = params.column.getColId();
        if (column !== 'grpname' && column.indexOf('acnt') === -1) {
          if (params.value) {
            const type = this.curcyCode === 'USD' ? '$' : '₩';
            const fixed = this.curcyCode === 'USD' ? 2 : 0;
            const val = this.roundToNumber(params.value, fixed).toFixed(fixed);
            const formatted = this.numberWithCommas(val);
            if (formatted.indexOf(0) === '-') {
              return `-${type}${formatted}`;
            } else {
              return `${type}${formatted}`;
            }
          }

          return '-';
        }
        return params.value;
      },
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
    this.paginationPageSize = 10;
  },
  methods: {
    ...mapActions('costEx', [
      'fetchDefaultFilterOptions',
      'fetchUserFilterSetting',
      'fetchSearchParam',
      'downloadCostExplorerExcel',
    ]),
    search() {
      if (!this.keyword) this.setGridData(this.costExplorerList);
      this.columnDefs = [];
      const keyword = this.keyword.toUpperCase();
      const filterList = this.costExplorerList.filter(
        ({ grptype, grpname }) => grptype.toUpperCase().includes(keyword) || grpname.toUpperCase().includes(keyword)
      );
      this.setGridData(filterList);
    },
    pagingInitialize() {
      this.pageObj.currentPage = 1;
    },
    pageChange(pageNo) {
      this.pageObj.currentPageNo = pageNo;
      this.gridApi.paginationGoToPage(pageNo - 1);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
    setColumn: function () {
      if (this.searchParam.grpType === 'usage_account_id') {
        this.columnDefs = [
          {
            field: 'acntname',
            headerName: this.$t('cost.accountName'),
            hide: true,
            valueGetter: (params) => params.data.grpname.slice(0, params.data.grpname.indexOf('(')),
          },
          {
            field: 'acntid',
            headerName: this.$t('cost.accountId'),
            hide: true,
            valueGetter: (params) =>
              "'" +
              params.data.grpname.slice(params.data.grpname.lastIndexOf('(') + 1, params.data.grpname.lastIndexOf(')')),
          },
        ];
      } else {
        this.columnDefs = [];
      }

      this.columnDefs = Array.concat(this.columnDefs, [
        {
          // field: 'grptype'
          field: 'grpname',
          headerName: this.groupName,
          resizable: true,
          menuTabs: [],
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          valueFormatter: (params) => params.value || '-rm',
        },
        {
          field: 'total',
          headerName: this.$t('cost.subtotal'),
          resizable: true,
          menuTabs: [],
          cellClass: this.curcyCode === 'USD' ? ['text-right', 'dollarType'] : ['text-right', 'numberType'],
          sortable: true,
          valueFormatter: this.costFormatter,
        },
      ]);

      if (this.rowData == null && _.isEmpty(this.rowData)) return;

      const headerList = _.chain(this.costExplorerList)
        .groupBy('datestd')
        .map((i, v) => {
          const headerName =
            this.periodType === 'MNTH'
              ? v.slice(0, 4) + '/' + v.slice(4, 6)
              : v.slice(0, 4) + '/' + v.slice(4, 6) + '/' + v.slice(6, 8);
          return { headerName, field: v };
        })
        .value();

      headerList.forEach(({ headerName, field }) => {
        // 월별 컬럼 추가
        this.columnDefs.push({
          headerName,
          field,
          menuTabs: [],
          resizable: true,
          suppressSizeToFit: true,
          width: 91,
          sortable: true,
          valueFormatter: this.costFormatter,
          type: 'rightAligned',
          cellClass: this.curcyCode === 'USD' ? ['text-right', 'dollarType'] : ['text-right', 'numberType'],
        });
      });
    },
    setGridData(data) {
      this.rowData = _.chain(_.cloneDeep(data))
        .groupBy('grptype')
        .map((group, grptype) => {
          const { grpname } = _.head(group);
          group.forEach((d) => (d.sum = parseFloat(d.sum)));
          const total = _.sumBy(group, this.sumKey);
          const procObj = { grptype, grpname, total };
          _.chain(group)
            .groupBy('datestd')
            .map((dateGroup, date) => {
              const sum = _.sumBy(dateGroup, this.sumKey);
              return { key: date, sum };
            })
            .value()
            .forEach(({ key, sum }) => {
              procObj[key] = sum;
            });
          return procObj;
        })
        .orderBy(['total'], ['desc'])
        .value();
      this.pageObj.totalCnt = this.rowData.length;
      this.pageObj.currentPageNo = 1;
      this.setColumn();
      this.loading = false;
    },
    roundToNumber(num, point) {
      if (/[e|E]/.test(`${num}`)) num = parseFloat(num).toLocaleString();
      return +(Math.round(num + `e+${point}`) + `e-${point}`);
    },
    costFormatter(params) {
      if (params.value !== undefined) {
        const type = this.curcyCode === 'USD' ? '$' : '₩';
        const fixed = this.curcyCode === 'USD' ? 2 : 0;
        const val = this.roundToNumber(params.value, fixed).toFixed(fixed);
        const formatted = this.numberWithCommas(val);
        if (formatted.indexOf('-') !== -1) {
          return `-${type}${formatted.slice(1)}`;
        } else {
          return `${type}${formatted}`;
        }
      } else {
        return '-';
      }
    },
    excelDownload() {
      if (this.rowData.length <= 0) {
        alert('데이터가 존재하지 않습니다.');
        return;
      }

      this.createDimmd();

      const fileNm = `Cost_Explorer_${moment().format('YYYY-MM-DD')}`;
      let data = {
        groupName: this.groupName,
        curcyCode: this.curcyCode,
        custUserId: getLocal('userInfo').userId,
        ...this.searchParam,
      };
      if (this.searchParam.serviceGroupId.length > 0) {
        data.ctgryId = this.searchParam.serviceGroupId[0].ctgryId;
      }
      if (this.cspTypCd === 'AWS') {
        APICaller.postDownloadBlob(`${getZuulHost()}/cap/v1/stat/costExplorer/ocp/aws/export`, fileNm, data)
          .then(() => {
            this.removeDimmed();
          })
          .catch(() => {
            this.removeDimmed();
          });
      } else if (this.cspTypCd === 'AZURE') {
        APICaller.postDownloadBlob(`${getZuulHost()}/cap/v1/stat/costExplorer/ocp/azure/export`, fileNm, data)
          .then(() => {
            this.removeDimmed();
          })
          .catch(() => {
            this.removeDimmed();
          });
      }
    },
    createDimmd() {
      this.$refs.dimmed.style.display = 'block';
      this.isDimmd = true;
    },
    removeDimmed() {
      this.$refs.dimmed.style.display = 'none';
      this.isDimmd = false;
    },
  },
};
</script>

<style scoped>
.dimmed {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
  opacity: 0.5;
  background-color: rgb(37 35 35);
}
</style>
<style>
.ag-body-viewport {
  min-height: 200px !important;
}
</style>
