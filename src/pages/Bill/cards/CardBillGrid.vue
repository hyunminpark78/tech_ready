<template>
  <Card wrapper-class="bg-white border rounded-lg border-primary-200 dashboard-card mb-7">
    <h3 class="px-8 font-bold border-b py-7 border-primary-200 border-bottom-none">{{ $t('cost.billList') }}</h3>
    <!-- <div class="h-40 bg-gray-700 rounded-b-lg"></div> -->
    <div style="height: 100%; width: 100%">
      <ag-grid-vue
        id="billGrid"
        :style="{ width: '100%', height }"
        :dom-layout="domLayout"
        class="ag-theme-alpine bill-info-grid"
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
        :popup-parent="popupParent"
        @first-data-rendered="onFirstDataRendered"
        @rowDataChanged="onFirstDataRendered"
        @grid-ready="onGridReady"
      ></ag-grid-vue>
    </div>
  </Card>
</template>

<script>
import Card from '@/components/Card';
import { mapActions, mapState } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import GridButton from './GridButton.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
// import DataNoRow from '@/pages/Bill/cards/DataNoRowInBillInfo';
import DataLoading from '@/pages/AgGrid/DataLoading';
import svcGrpMgmtService from '@/services/svcGrpMgmtService';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: {
    AgGridVue,
    Card,
  },
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
      cacheOverflowSize: null,
      maxConcurrentDatasourceRequests: null,
      infiniteInitialRowCount: null,
      maxBlocksInCache: null,
      frameworkComponents: null,
      modules: null,
      billList: null,
      height: '174px',
      checkOne: false,
    };
  },
  computed: {
    ...mapState('bill', ['filter', 'bill', 'billInfo', 'chrgYm']),
  },
  watch: {
    // 다국어 변경 시 차트를 재매핑
    '$i18n.locale': 'setColumn',
    chrgYm(newData) {
      if (newData.length === 0) {
        this.setColumn();
        this.rowData = [];
      }
    },
    bill(newData) {
      console.log('newData', newData);
      // 계약 선택에 따른 청구목록 dataSetting
      if (this.gridApi !== null) {
        this.gridApi.showLoadingOverlay();
      }
      setTimeout(() => {
        if (newData.length !== 0) {
          let contractCheck = 0;
          if (
            this.filter.ctrt === 'total' ||
            this.filter.ctrt === 'TOTAL' ||
            Object.keys(this.filter.ctrt).length === 0
          ) {
            this.setData(newData);
            this.checkOne = false;
          } else {
            // contractCheck = newData.findIndex((selectBill) => selectBill.ctrtId === this.filter.ctrt);
            console.log('contractCheck', newData);
            this.setData(newData);
            if (newData.length < 2) {
              this.checkOne = true;
            }
          }
          /*  if (newData.length < 6) {
            this.height = 49 + 42 * newData.length + 'px';
          } else {
            this.height = '301px';
          }
          if (this.checkOne) {
            this.height = '110px';
          } */
          if (newData.length < 4) {
            this.height = '174px';
            this.domLayout = null;
          } else {
            this.height = '100%';
            this.domLayout = 'autoHeight';
          }
          this.getDetail(newData[0]);
        } else {
          this.height = '100%';
          this.setColumn();
          this.rowData = [];
        }
      }, 100);
    },
  },

  beforeMount() {
    this.gridOptions = {
      onCellClicked: (params) => {
        //console.log("grid click", params);
        // contextMenu 클릭
        if (params.column.colId === 'add') {
          params.api.contextMenuFactory.showMenu(params.node, params.column, params.value, params.event);
        }
        /*this.setBillInfo({
          billYm: params.data.billYm.replaceAll('.', ''),
          ctrtId: params.data.ctrtId,
          chrgYm: params.data.chrgYm,
          billId: params.data.billId,
        });*/
        params.data.billYm = params.data.billYm.replaceAll('.', '');
        this.setBillStoreInfo(params.data);
      },
      suppressCellSelection: true,
    };
    this.frameworkComponents = {
      gridButton: GridButton,
      noRowsOverlayComponent: DataNoRow,
    };

    if (this.chrgYm === undefined) {
      this.frameworkComponents.loadingOverlayComponent = DataNoRow;
    } else {
      this.frameworkComponents.loadingOverlayComponent = DataLoading;
    }

    this.popupParent = document.querySelector('body');
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    if (this.chrgYm.length === 0) {
      const noDataHeight = document.getElementsByClassName('ag-center-cols-clipper')[0];
      noDataHeight.style.height = '122px';
    }
  },
  created() {
    // this.setData();
  },
  methods: {
    ...mapActions('bill', ['setBillInfo', 'setSvcCtgryList']),
    ...mapActions('contract', ['fetchDetail', 'fetchCtrtId']),
    getDetail(billData) {
      /*this.setBillInfo({
        billYm: billData.billYm,
        ctrtId: billData.ctrtId,
        chrgYm: billData.chrgYm,
        billId: billData.billId,
      });*/
      this.setBillStoreInfo(billData);
    },
    setBillStoreInfo(billData) {
      this.setBillInfo({
        billYm: billData.billYm,
        ctrtId: billData.ctrtId,
        chrgYm: billData.chrgYm,
        billId: billData.billId,
        cspTypCd: billData.cspTypCd,
      });
      this.setSvcCtgry(billData.ctrtId);
    },
    async setSvcCtgry(ctrtId) {
      let svcCtgryList = [];
      await svcGrpMgmtService.fetchSvcCtgry({ ctrtId: ctrtId }).then((response) => {
        if (response.data.code === 'SUCCESS') {
          svcCtgryList = response.data.data;
        }
      });
      await this.setSvcCtgryList(svcCtgryList);
    },
    dateFilter(value) {
      return value.substring(0, 4) + '.' + value.substring(4, 6);
    },
    excelDownload(ctrtNm) {
      const excelParams = {
        fileName: ctrtNm,
        sheetName: ctrtNm,
        rowHeight: 40,
        headerRowHeight: 60,
        /*  https://www.ag-grid.com/vue-grid/excel-export-api/ */
      };
      this.gridApi.exportDataAsExcel(excelParams);
    },
    /* createImage() {
      return '<img border="0" width="50" height="50" src="https://picsum.photos/600/600/?random';
    }, */
    getContextMenuItems(params) {
      return [
        // {
        //   /* icon: '<img src="https://www.ag-grid.com/example-assets/skills/mac.png"/>', */
        //   name: '청구서 전체보기',
        //   action: () => {
        //     alert('청구서 전체보기 ', params.node.data.ctrtNm);
        //   },
        //   cssClasses: ['redFont', 'bold'],
        // },
        /* {
          name: '세부내역 다운로드',
          action: () => {
            this.excelDownload(params.node.data.ctrtNm);
          },

          cssClasses: ['redFont', 'bold'],
        }, */
        {
          // name: '계약정보 보기',
          name: this.$t('cost.viewContractInfo'),
          action: () => {
            this.fetchDetail({ ctrtId: params.node.data.ctrtId });
            this.fetchCtrtId({ ctrtId: params.node.data.ctrtId });
            this.$router.push(`/cost/ctrtInfo`);
          },
          cssClasses: ['redFont', 'bold'],
          /* icon: this.createImage(), */
        },
      ];
    },
    onGridReady(params) {},
    setData(data) {
      this.setColumn();
      let tempData = [];
      data.map((billData) => {
        tempData.push({
          ctrtId: billData.ctrtId,
          billYm: this.dateFilter(billData.billYm),
          chrgYm: this.dateFilter(billData.chrgYm),
          ctrtNm: billData.ctrtNm,
          billAmt: Number(billData.billAmt),
          dscntAmt: Number(billData.dscntAmt),
          credit: billData.creditAplyAmt !== undefined ? Number(billData.creditAplyAmt) : '-',
          billId: billData.billId,
          add: null,
          cspTypCd: billData.cspTypCd,
        });
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
          // headerName: '청구월',
          headerName: this.$t('cost.billingMonth'),
          field: 'chrgYm',
          resizable: true,
          sortable: true,
          menuTabs: [],
          // width: 110,
          width: i18n.locale === 'ko' ? 110 : 140,
          cellClass: ['ag-grid-color-font', 'text-center', 'pl-32'],
          headerComponentParams: {
            template: this.template,
          },
        },
        {
          // headerName: '사용월',
          headerName: this.$t('cost.monthOfUsage'),
          field: 'billYm',
          resizable: true,
          sortable: true,
          menuTabs: [],
          // width: 100,
          width: i18n.locale === 'ko' ? 100 : 140,
          cellClass: ['ag-grid-color-font', 'text-center'],
          headerComponentParams: {
            template: this.template,
          },
        },
        {
          // headerName: '계약명',
          headerName: this.$t('cost.contractName'),
          field: 'ctrtNm',
          resizable: true,
          sortable: true,
          width: this.bill.length > 5 ? 380 : 400,
          menuTabs: [],
          cellClass: 'ag-grid-font',
          tooltipField: 'ctrtNm',
          headerComponentParams: {
            template: this.template,
          },
        },
        {
          // headerName: '청구금액',
          headerName: this.$t('cost.billingAmount'),
          field: 'billAmt',
          resizable: true,
          sortable: true,
          menuTabs: [],
          type: 'rightAligned',
          width: 170,
          cellClass: ['ag-grid-color-font', 'text-right'],
          filter: 'agNumberColumnFilter',
          valueFormatter: this.customValueFormatter,
        },
        {
          // headerName: '할인금액',
          headerName: this.$t('cost.discountAmount'),
          field: 'dscntAmt',
          resizable: true,
          sortable: true,
          menuTabs: [],
          type: 'rightAligned',
          cellStyle: { color: '#00a5ed' },
          width: 170,
          cellClass: ['ag-grid-color-font', 'text-right'],
          filter: 'agNumberColumnFilter',
          valueFormatter: this.customValueFormatter,
        },
        {
          headerName: 'Credit',
          field: 'credit',
          resizable: true,
          sortable: true,
          menuTabs: [],
          width: 127,
          type: 'rightAligned',
          cellStyle: { color: '#00a5ed' },
          cellClass: ['ag-grid-color-font', 'text-right'],
          filter: 'agNumberColumnFilter',
          valueFormatter: this.customValueFormatter,
        },
        {
          headerName: '',
          field: 'add',
          width: 70,
          menuTabs: [],
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
        // minWidth: 200,
        resizable: true,
      };
    },
  },
};
</script>
<style scoped>
.ag-header-cell-label {
  justify-content: center;
}

.bill-info-grid >>> .ag-body-viewport.ag-layout-auto-height.ag-row-animation {
  min-height: 94px !important;
}
</style>
