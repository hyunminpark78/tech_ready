<template>
  <div class="board-wrap">
    <div style="height: 100%; width: 100%">
      <ag-grid-vue
        id="awsAcctGird"
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
        :debug="true"
        :tooltip-show-delay="tooltipShowDelay"
        :tooltip-hide-delay="tooltipHideDelay"
        @first-data-rendered="onFirstDataRendered"
        @grid-ready="onGridReady"
      ></ag-grid-vue>
      <Paginate
        v-if="pageObj.totalCnt > 0"
        :page-size="pageObj.pageSize"
        :page-no="pageObj.currentPageNo"
        :total-cnt="pageObj.totalCnt"
        @changepage="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import Paginate from '@/components/Paginate.vue';
import awsAcctMgmtService from '@/services/awsAcctMgmtService';
import AwsAcctCreateBtn from './AwsAcctCreateBtn.js';

export default {
  components: { AgGridVue, Paginate },
  mixins: [AgGridMixin()],
  data() {
    return {
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      frameworkComponents: null,
      modules: null,
      param: {},
      pageObj: {
        currentPageNo: 1,
        pageSize: 10,
        totalCnt: 0,
      },
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
    };
  },
  computed: {
    ...mapState('awsAcctMgmt', ['filter', 'isSearch']),
  },
  watch: {
    '$i18n.locale': ['setColumn', 'setGridData'],
    filter: function (newVal, oldVal) {
      this.param = newVal;
    },
    isSearch: function (newVal, oldVal) {
      if (newVal.isSearch) {
        this.setGridData();
      }
    },
  },
  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      suppressCellSelection: true, // block cell click event
    };
    this.frameworkComponents = {
      AwsAcctCreateBtn: AwsAcctCreateBtn,
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.setColumn();
  },
  methods: {
    getDataPath: function (data) {
      return data.orgHierarchy;
    },
    onGridReady(params) {
      this.gridApi = params.api;
    },
    async setGridData() {
      this.rowData = await awsAcctMgmtService
        .fetchList(this.param)
        .then((result) => {
          this.pageObj.totalCnt = result.data.data.length;
          this.pageObj.currentPageNo = 1;
          let values = [];
          const temp = result.data.data.map((data) => {
            if (data.roleArn) {
              return { ...data, tooltip: this.$t('setting.accountDelete') };
            } else {
              return { ...data, tooltip: this.$t('setting.accountRegister') };
            }
          });
          values = [...temp];
          return values;
        })
        .catch((error) => {
          alert(this.$t('setting.errorOccurredContact'));
        });
    },
    setColumn() {
      this.columnDefs = [
        {
          field: 'acntNm',
          headerName: this.$t('setting.accountName'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          width: 400,
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'acntId',
          headerName: this.$t('setting.accountId'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'status',
          headerName: this.$t('setting.status'),
          resizable: true,
          sortable: true,
          filter: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            if (params.value === 'S') {
              return `<span class="round-wrap blue">${this.$t('setting.normal')}</span>`;
            } else if (params.value === 'E') {
              return `<span class="round-wrap pink">${this.$t('setting.error')}</span>`;
            } else {
              return `<span class="round-wrap gray">${this.$t('setting.unregistered')}</span>`;
            }
          },
        },
        {
          field: 'frstRegDtm',
          headerName: this.$t('setting.registrationDate'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueFormatter: (params) => params.value || '-',
        },
        {
          field: 'setting',
          headerName: this.$t('setting.management'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          tooltipField: 'tooltip',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: 'AwsAcctCreateBtn',
        },
        {
          field: 'tooltip',
          headerName: 'tooltip',
          hide: true,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
      ];
      this.defaultColDef = {
        flex: 1,
        resizable: true,
      };
    },
    pageChange(pageNo) {
      this.pageObj.currentPageNo = pageNo;
      this.gridApi.paginationGoToPage(pageNo - 1);
    },
  },
};
</script>

<style>
.ag-header-cell-label {
  display: flex;
  justify-content: center;
  align-items: center;
}
.round-wrap.blue {
  color: #fff;
  background-color: #00a5ed;
}

.ag-grid-font {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 70px;
  /* or 467% */
  color: #515151;
}

/* .ag-theme-alpine .ag-layout-auto-height .ag-center-cols-clipper,
.ag-theme-alpine .ag-layout-auto-height .ag-center-cols-container,
.ag-theme-alpine .ag-layout-print .ag-center-cols-clipper,
.ag-theme-alpine .ag-layout-print .ag-center-cols-container {
  min-height: 200px !important;
} */
</style>
