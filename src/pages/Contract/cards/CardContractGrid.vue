<template>
  <div class="mb-8 bg-white border rounded-lg border-primary-200 dashboard-card">
    <h3 class="px-8 font-bold border-b py-7 border-primary-200 border-bottom-none">{{ $t('cost.contractList') }}</h3>

    <!-- <div class="overflow-y-scroll rounded-bl-lg rounded-br-lg max-h-856-"> -->
    <div class="rounded-bl-lg rounded-br-lg max-h-856-">
      <!-- <div class="grid h-32 text-white bg-gray-700 place-content-center">grid</div> -->
      <div style="height: 100%">
        <ag-grid-vue
          id="contractGrid"
          :style="{ width: '100%', height }"
          class="ag-theme-alpine"
          :column-defs="columnDefs"
          :row-data="rowData"
          :get-context-menu-items="getContextMenuItems"
          :modules="modules"
          :animate-rows="true"
          :grid-options="gridOptions"
          :framework-components="frameworkComponents"
          :loading-overlay-component="loadingOverlayComponent"
          :loading-overlay-component-params="loadingOverlayComponentParams"
          :no-rows-overlay-component="noRowsOverlayComponent"
          :no-rows-overlay-component-params="noRowsOverlayComponentParams"
          :pagination="true"
          :pagination-page-size="paginationPageSize"
          :suppress-pagination-panel="true"
          :row-selection="rowSelection"
          :paginate-child-rows="true"
          :suppress-scroll-on-new-data="true"
          :debug="true"
          :popup-parent="popupParent"
          :suppress-context-menu="true"
          @pagination-changed="onPaginationChanged"
          @first-data-rendered="onFirstDataRendered"
          @rowDataChanged="onFirstDataRendered"
          @grid-ready="onGridReady"
        ></ag-grid-vue>
        <GridPagenate
          v-if="list.length > 0"
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
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import { AgGridVue } from 'ag-grid-vue';
import moment from 'moment';
import GridButton from '@/pages/Bill/cards/GridButton';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import GridPagenate from '@/components/GridPagenate.vue';
import { i18n } from '../../../../public/locales/i18n';

export default {
  name: 'CardContarctGrid',
  components: { AgGridVue, GridPagenate },
  mixins: [AgGridMixin()],
  data: function () {
    return {
      gridOptions: null,
      gridApi: null,
      rowData: null,
      columnApi: null,
      columnDefs: null,
      defaultColDef: null,
      components: null,
      paginationPageSize: null,
      frameworkComponents: null,
      modules: null,
      billList: null,
      height: '300px',
      paging: {
        pageSize: 0,
        totalPage: 0,
        currentPage: 1,
      },
      rowSelection: null,
    };
  },
  computed: {
    ...mapState('contract', ['list']),
  },
  watch: {
    '$i18n.locale': 'setData',
    list(newData) {
      if (newData.length === 0) {
        this.height = '300px';
        this.setColumn();
        this.rowData = [];
      } else {
        if (newData.length < 10) {
          this.height = 97 + 42 * newData.length + 'px';
        } else {
          this.height = '480px';
        }
        this.setData(newData);
      }

      this.fetchDetail({ ctrtId: this.list[0].ctrtId });
    },
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  beforeMount() {
    this.gridOptions = {
      onCellClicked: (params) => {
        // contextMenu 클릭
        if (params.column.colId === 'add') {
          params.api.contextMenuFactory.showMenu(params.node, params.column, params.value, params.event);
        }
        this.fetchDetail({ ctrtId: params.data.ctrtId });
        this.fetchCtrtId({ ctrtId: params.data.ctrtId });
      },
      suppressCellSelection: true,
    };
    this.frameworkComponents = {
      gridButton: GridButton,
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
    this.paginationPageSize = 10;
  },
  methods: {
    ...mapActions('contract', ['fetchDetail', 'fetchCtrtId']),
    onGridReady(params) {
      /*       this.setGridParams(params);
      this.fitGrid(); */
    },
    onBtNext() {
      this.gridApi.paginationGoToNextPage();
    },
    onBtPrevious() {
      this.gridApi.paginationGoToPreviousPage();
    },
    clickPage(page) {
      this.gridApi.paginationGoToPage(page);
    },
    pagingFn() {
      this.paging.pageSize = this.gridApi.paginationGetPageSize();
      this.paging.totalPage = this.gridApi.paginationGetTotalPages();
      this.paging.currentPage = this.gridApi.paginationGetCurrentPage() + 1;
      console.log(this.paging, 'paging!!');
    },
    onPaginationChanged() {
      if (this.gridApi) {
        this.pagingFn();
      }
    },
    setData(data) {
      this.setColumn();
      let tempData = [];
      data.map((contractList) => {
        if (i18n.locale === 'ko') {
          tempData.push({
            ctrtId: contractList.ctrtId,
            ctrtNm: contractList.ctrtNm,
            mmngUserNm: contractList.mmngUserNm !== undefined ? contractList.mmngUserNm.split('/')[0] : '',
            ctrtStrDt: moment(contractList.ctrtStrDt).format('YYYY.MM.DD'),
            ctrtEndDt: moment(contractList.ctrtEndDt).format('YYYY.MM.DD'),
            ctrtTotAmt: contractList.ctrtTotAmt !== undefined ? Number(contractList.ctrtTotAmt) : Number(0),
            ctrtStatCd: contractList.ctrtStatCd === 'ING' ? '진행중' : '계약 만료',
            add: null,
          });
        } else {
          tempData.push({
            ctrtId: contractList.ctrtId,
            ctrtNm: contractList.ctrtNm,
            mmngUserNm: contractList.mmngUserNm !== undefined ? contractList.mmngUserNm.split('/')[0] : '',
            ctrtStrDt: moment(contractList.ctrtStrDt).format('YYYY.MM.DD'),
            ctrtEndDt: moment(contractList.ctrtEndDt).format('YYYY.MM.DD'),
            ctrtTotAmt: contractList.ctrtTotAmt !== undefined ? Number(contractList.ctrtTotAmt) : Number(0),
            ctrtStatCd: contractList.ctrtStatCd === 'ING' ? 'Proceeding' : 'Contract expiration',
            add: null,
          });
        }
      });

      this.rowData = tempData;
      this.billList = tempData;
    },
    setColumn() {
      this.columnDefs = [
        {
          field: 'ctrtId',
          hide: true,
        },
        {
          headerName: this.$t('cost.contract'),
          field: 'ctrtNm',
          resizable: true,
          filter: true,
          menuTabs: ['filterMenuTab'],
          cellClass: ['ag-grid-color-font', 'text-left', 'ag-grid-header-font', 'pl-32'],
          width: 400,
          headerComponentParams: {
            template:
              '<div class="ag-cell-label-container pl-15" role="presentation">' +
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
          headerName: this.$t('cost.manager'),
          field: 'mmngUserNm',
          resizable: true,
          filter: true,
          menuTabs: ['filterMenuTab'],
          width: 220,
          cellClass: ['ag-grid-color-font', 'text-center', 'ag-grid-header-font'],
          headerComponentParams: {
            template: this.template,
          },
        },
        {
          headerName: this.$t('cost.startDate'),
          field: 'ctrtStrDt',
          resizable: true,
          menuTabs: [],
          sortable: true,
          cellClass: ['ag-grid-color-font', 'text-center'],
          width: 120,
          headerComponentParams: {
            template: this.template,
          },
        },
        {
          headerName: this.$t('cost.endDate'),
          field: 'ctrtEndDt',
          resizable: true,
          sortable: true,
          menuTabs: [],
          cellClass: ['ag-grid-color-font', 'text-center', 'ag-grid-header-font'],
          width: 120,
          headerComponentParams: {
            template: this.template,
          },
        },
        {
          headerName: this.$t('cost.contractAmount'),
          field: 'ctrtTotAmt',
          resizable: true,
          sortable: true,
          menuTabs: [],
          valueFormatter: this.customValueFormatter,
          cellClass: ['ag-grid-color-font', 'text-right', 'ag-grid-header-font'],
          type: 'rightAligned',
        },
        {
          headerName: this.$t('cost.status'),
          field: 'ctrtStatCd',
          filter: true,
          resizable: true,
          menuTabs: ['filterMenuTab'],
          width: 120,
          cellClass: (params) => {
            return params.value === '진행중' || params.value === 'Proceeding'
              ? ['ag-grid-font', 'text-center', 'grid-state-ing', 'ag-grid-header-font']
              : ['ag-grid-font', 'text-center', 'grid-state-end', 'ag-grid-header-font'];
          },
          headerComponentParams: {
            template: this.template,
          },
        },
        {
          headerName: '',
          field: 'add',
          menuTabs: [],
          width: 70,
          cellClass: 'ag-grid-font',
          cellRenderer: 'gridButton',
          cellRendererParams: {
            clicked: (params) => {
              console.log(params);
            },
          },
          resizable: false,
        },
      ];
      this.defaultColDef = {
        flex: 1,
        resizable: true,
        /*  minWidth: 100, */
      };
    },
    getContextMenuItems(params) {
      return [
        {
          /* icon: '<img src="https://www.ag-grid.com/example-assets/skills/mac.png"/>', */
          name: this.$t('cost.viewYourBill'),
          action: () => {
            this.$router.push(
              `/cost/billInfo?ctrtId=${params.node.data.ctrtId}&billYm=${params.node.data.ctrtId.replaceAll('.', '')}`
            );
          },
          cssClasses: ['redFont', 'bold'],
        },
      ];
    },
  },
};
</script>
