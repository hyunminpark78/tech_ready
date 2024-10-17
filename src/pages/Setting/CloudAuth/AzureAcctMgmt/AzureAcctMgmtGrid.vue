<template>
  <div class="board-wrap">
    <div style="height: 100%; width: 100%">
      <ag-grid-vue
        id="azureAcctGird"
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
        :tooltip-show-delay="tooltipShowDelay"
        :tooltip-hide-delay="tooltipHideDelay"
        @first-data-rendered="autoSizeAll"
        @row-data-changed="autoSizeAll"
        @row-data-updated="onFirstDataRendered"
        @grid-size-changed="onFirstDataRendered"
        @cellClicked="onCellClicked"
        @grid-ready="onGridReady"
      ></ag-grid-vue>
      <div v-if="showAppListTitle" class="text-right mt-1.5 mr-2 text-xs- text-primary-600 font-bold">
        {{ $t('setting.allAppAffect') }}
      </div>
      <Paginate
        v-if="pageObj.totalCnt > 0"
        :page-size="pageObj.pageSize"
        :page-no="pageObj.currentPageNo"
        :total-cnt="pageObj.totalCnt"
        @changepage="pageChange"
      />
    </div>

    <AppDetailPopup
      v-if="popupVisible"
      ref="detailPopup"
      :visible="popupVisible"
      :ctrt-id="appDetailParam.ctrtId"
      :app-id="appDetailParam.appId"
      :app-desc="appDetailParam.appDesc"
      :tenant-id="appDetailParam.tenantId"
      :client-scr-expr-dtm="appDetailParam.clientScrExprDtm"
      :subs-list="appDetailParam.subsList"
      @close="popupClose"
    ></AppDetailPopup>
    <Popup :visible="inquiryPopup.visible" :content="inquiryPopup.content" @closePopup="closeInquiryPopup" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import Paginate from '@/components/Paginate.vue';
import AzureAcctMgmtBtn from './AzureAcctMgmtBtn.js';
import AzureAcctMgmtEnBtn from './AzureAcctMgmtEnBtn.js';
import AppDetailPopup from './AzureAcctAppDetailPop';
import Popup from '@/components/Popup.vue';
import { EventBus } from './eventBus.js';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: { Popup, AppDetailPopup, AgGridVue, Paginate },
  mixins: [AgGridMixin()],
  data() {
    return {
      loading: false,
      gridOptions: null,
      rowData: [],
      columnDefs: null,
      defaultColDef: null,
      frameworkComponents: null,
      modules: null,
      pageObj: {
        currentPageNo: 1,
        pageSize: 10,
        totalCnt: 0,
      },
      detailData: {},
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
      popupVisible: false,
      inquiryPopup: {
        visible: false,
        content: '',
      },
      screenX: 0,
      screenY: 0,
      appDetailParam: {
        ctrtId: null,
        appId: null,
        appDesc: null,
        tenantId: null,
        clientScrVal: null,
        subsList: [],
      },
      showAppListTitle: false,
      appListOrder: [
        'ctrtNm',
        'appId',
        'appDesc',
        'lnkdSubscCnt',
        'appLinkStatCd',
        'clientScrExprDtm',
        'frstRegDtm',
        'lastUptDtm',
        'setting',
      ],
      subsListOrder: [
        'ctrtNm',
        'subscId',
        'subscNm',
        'appId',
        'subscFrstLinkDtm',
        'subscLastLinkDtm',
        'subscLinkStatCd',
      ],
      allColumns: [],
    };
  },
  computed: {
    ...mapState('azureAcctMgmt', ['filter', 'isSearch', 'listType']),
    isAppList() {
      return this.listType === 'app';
    },
    isSubsList() {
      return this.listType === 'subs';
    },
  },
  watch: {
    '$i18n.locale': ['setAllColumns', 'setGridData'],
    loading(newVal) {
      if (newVal) this.gridApi.showLoadingOverlay();
    },
    isSearch(newVal) {
      if (newVal === true) {
        this.setGridData();
      }
    },
    rowData() {
      this.setNoRowDataGridHeight();
    },
  },
  created() {
    EventBus.$on('getInquiryPopup', this.getInquiryPopup);
    this.onGridReady();
  },
  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      suppressCellSelection: true, // block cell click event
      autoRowHeight: true,
    };
    this.frameworkComponents = {
      AzureAcctMgmtBtn: AzureAcctMgmtBtn,
      AzureAcctMgmtEnBtn: AzureAcctMgmtEnBtn,
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  mounted() {
    this.setAllColumns();
    this.setGridData();
  },
  methods: {
    ...mapActions('azureAcctMgmt', ['fetchAzureAppList', 'fetchAzureSubsList']),
    setAllColumns() {
      this.allColumns = [
        {
          field: 'ctrtNm',
          headerName: this.$t('setting.contract'),
          width: 150,
          suppressSizeToFit: true,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            return `<span>${params.value || '-'}</span>`;
          },
        },
        {
          field: 'appId',
          headerName: this.$t('setting.appId'),
          width: 200,
          suppressSizeToFit: true,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            return `<span class="${params.value ? 'blue cursor-pointer' : ''}">${params.value || '-'}</span>`;
          },
        },
        {
          field: 'subscId',
          headerName: 'Subscription ID',
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            return `<span>${params.value || '-'}</span>`;
          },
        },
        {
          field: 'subscNm',
          headerName: this.$t('setting.subscriptionName'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            return `<span>${params.value || '-'}</span>`;
          },
        },
        {
          field: 'appDesc',
          headerName: this.$t('setting.remarksExplanation'),
          width: 240,
          suppressSizeToFit: true,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font'],
          cellRenderer: (params) => {
            const encodedValue = (params.value || '-').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<span>${encodedValue}</span>`;
          },
          // valueFormatter: (params) => this.decodeHTML(params.value),
        },
        {
          field: 'lnkdSubscCnt',
          headerName: this.$t('setting.numberLinkedSubscriptions'),
          width: 220,
          suppressSizeToFit: true,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'appLinkStatCd',
          headerName: this.$t('setting.status'),
          suppressSizeToFit: true,
          resizable: true,
          sortable: true,
          filter: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueFormatter: (params) => {
            switch (params.value) {
              case 'S':
                return this.$t('setting.normal');
              case 'E':
                return this.$t('setting.error');
              default:
                return this.$t('setting.unregistered');
            }
          },
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
          field: 'clientScrExprDtm',
          headerName: this.$t('setting.clientPasswordExpiration'),
          width: 210,
          suppressSizeToFit: true,
          resizable: true,
          sortable: true,
          filter: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            if (params.value === null) return '<span>-</span>';
            let time = new Date(params.value);
            let currentTime = new Date();
            let diffSec = time.getTime() - currentTime.getTime();
            let diffDate = Math.floor(diffSec / (24 * 60 * 60 * 1000));

            let html = '<div class="outDiv"><div class="param-text">';

            if (diffDate < 0) {
              html += `<span class="red">${params.value}<p>${this.$t('setting.expired')}</p></span>`;
            } else if (diffDate >= 30 && diffDate <= 60) {
              html += `<span class="orange">${params.value}<p>(D-${diffDate})</p></span>`;
            } else if (diffDate < 30) {
              html += `<span class="red">${params.value}<p>(D-${diffDate})</p></span>`;
            } else {
              html += `<span class="">${params.value}<p>(D-${diffDate})</p></span>`;
            }
            html += '</div></div>';
            return html;
          },
        },
        {
          field: 'frstRegDtm',
          headerName: this.$t('setting.registrationDate'),
          width: 150,
          suppressSizeToFit: true,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            return `<span>${params.value || '-'}</span>`;
          },
        },

        {
          field: 'lastUptDtm',
          headerName: this.$t('setting.updatedDate'),
          width: 130,
          suppressSizeToFit: true,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center', 'multiline-cell'],
          cellRenderer: (params) => {
            if (params.value === params.data.frstRegDtm) {
              return `<span>-</span>`;
            }
            return `<span>${params.value || '-'}</span>`;
          },
        },
        {
          field: 'subscFrstLinkDtm',
          headerName: this.$t('setting.firstLinkedDate'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center', 'multiline-cell'],
          cellRenderer: (params) => {
            return `<span>${params.value || '-'}</span>`;
          },
        },
        {
          field: 'subscLastLinkDtm',
          headerName: this.$t('setting.recentLinkedDate'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center', 'multiline-cell'],
          cellRenderer: (params) => {
            return `<span>${params.value || '-'}</span>`;
          },
        },
        {
          field: 'subscLinkStatCd',
          headerName: this.$t('setting.iAMStatus'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          tooltipField: 'tooltip',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            const status = (params.value || '').toUpperCase();
            switch (status) {
              case 'ASSIGNED':
                return `<span class="round-wrap blue" style='width:110px'>${status}</span>`;
              case 'ERROR':
                return `<span class="round-wrap red" style='width:110px'>${status}</span>`;
              default:
                return `<span class="round-wrap gray" style='width:110px'>${status}</span>`;
            }
          },
        },
      ];
      if (this.allColumns.findIndex((column) => column.field === 'setting')) {
        this.allColumns.pop();
      }
      this.allColumns.push({
        field: 'setting',
        headerName: this.$t('setting.management'),
        width: 120,
        suppressSizeToFit: true,
        resizable: true,
        menuTabs: [],
        tooltipField: 'tooltip',
        headerClass: ['text-center'],
        cellClass: ['ag-grid-font', 'text-center'],
        cellRenderer: i18n.locale === 'ko' ? 'AzureAcctMgmtBtn' : 'AzureAcctMgmtEnBtn',
      });
    },
    getDataPath(data) {
      return data.orgHierarchy;
    },
    setNoRowDataGridHeight() {
      this.$nextTick(() => {
        const overlay = document.querySelector('.ag-center-cols-clipper');
        if (this.rowData.length === 0 && overlay) {
          overlay.style.height = '200px';
        }
      });
    },
    autoSize() {
      const cols = this.gridColumnApi
        .getAllColumns()
        .filter((col) => col.colId !== 'appDesc')
        .map((col) => col.colId);
      this.gridColumnApi.autoSizeColumns(cols, false);

      const appDesc = this.gridColumnApi.getColumn('appDesc');
      if (appDesc) {
        this.gridColumnApi.setColumnWidth(appDesc, 300);
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.autoSizeAll(params);
      params.api.sizeColumnsToFit();
    },
    autoSizeAll(params) {
      const allColumnIds = [];
      params.columnApi.getAllColumns().forEach((column) => {
        allColumnIds.push(column.getId());
      });
      params.columnApi.autoSizeColumns(allColumnIds);
    },
    getResult(result) {
      if (result.error) alert(result.error);
      else return result.data;
    },
    async setGridData() {
      this.loading = true;

      let data = [];
      switch (this.listType) {
        case 'app':
          data = this.getResult(await this.fetchAzureAppList(this.filter));
          break;
        case 'subs':
          data = this.getResult(await this.fetchAzureSubsList(this.filter));
          break;
      }

      this.showAppListTitle = this.isAppList && data.some((item) => item.userCtrtMpYn === 'N');

      this.setColumn();
      this.rowData = data;
      this.pageObj.totalCnt = data.length;
      this.pageObj.currentPageNo = 1;

      this.loading = false;
    },
    alignColumnOrder(columnOrder, allColumns) {
      const alignedColumns = [];
      columnOrder.forEach((fieldName) => {
        const column = allColumns.find((col) => col.field === fieldName);
        if (column) {
          alignedColumns.push(column);
        }
      });
      return alignedColumns;
    },
    setColumn() {
      this.gridApi.setColumnDefs([]);
      switch (this.listType) {
        case 'app':
          this.columnDefs = this.alignColumnOrder(this.appListOrder, this.allColumns);
          break;
        case 'subs':
          this.columnDefs = this.alignColumnOrder(this.subsListOrder, this.allColumns);
          break;
      }
      this.defaultColDef = {
        flex: 1,
        resizable: true,
        suppressSizeToFit: true,
        // cellStyle: {
        //   'white-space': 'pre-line', // 줄바꿈을 처리
        // },
      };

      this.enabledTooltips(this.columnDefs);
    },
    pageChange(pageNo) {
      this.pageObj.currentPageNo = pageNo;
      this.gridApi.paginationGoToPage(pageNo - 1);
    },
    onCellClicked(params) {
      if (params.column.colId !== 'appId' || !params.data.appId) {
        return;
      }

      if (this.isAppList) {
        const { ctrtId, appId, appDesc, tenantId, clientScrExprDtm, clientScrExprDtCnt, lnkdSubscList } = params.data;

        this.appDetailParam.ctrtId = ctrtId;
        this.appDetailParam.appId = appId;
        this.appDetailParam.appDesc = this.decodeHTML(appDesc);
        this.appDetailParam.tenantId = tenantId;
        this.appDetailParam.clientScrExprDtm = `${clientScrExprDtm} (D-${clientScrExprDtCnt})`;
        this.appDetailParam.subsList = lnkdSubscList;

        this.popupVisible = true;
      } else if (this.isSubsList) {
        const { appId, appCtrtId } = params.data;
        const filter = { appId, ctrtId: appCtrtId };
        this.fetchAzureAppList(filter).then((result) => {
          const data = this.getResult(result).find((_) => true) || [];

          this.appDetailParam.ctrtId = appCtrtId;
          this.appDetailParam.appId = data.appId;
          this.appDetailParam.appDesc = this.decodeHTML(data.appDesc);
          this.appDetailParam.tenantId = data.tenantId;
          this.appDetailParam.clientScrExprDtm = `${data.clientScrExprDtm} (D-${data.clientScrExprDtCnt})`;
          this.appDetailParam.subsList = data.lnkdSubscList;

          this.popupVisible = true;
        });
      }
    },
    decodeHTML(html) {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    },
    popupClose() {
      this.popupVisible = false;
    },
    getInquiryPopup() {
      this.inquiryPopup.content = `${this.$t('support.hello')}\n${this.$t(
        'support.inquiryFunctionPrepared'
      )}\n${this.$t('support.anyQuestionsEmail')}\n${this.$t('support.thankYou')}`;
      this.inquiryPopup.visible = true;
    },
    closeInquiryPopup() {
      this.inquiryPopup.content = '';
      this.inquiryPopup.visible = false;
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
.blue {
  color: #00a5ed;
}
.red {
  color: #ff0000;
}
.orange {
  color: #ff6b00;
}
.ag-grid-font {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 70px;
  /* or 467% */
  color: #515151;
}

.cursor-pointer {
  cursor: pointer;
}

/*
.ag-theme-alpine .ag-layout-auto-height .ag-center-cols-clipper,
.ag-theme-alpine .ag-layout-auto-height .ag-center-cols-container,
.ag-theme-alpine .ag-layout-print .ag-center-cols-clipper,
.ag-theme-alpine .ag-layout-print .ag-center-cols-container {
  min-height: 200px !important;
} */

.multiline-cell {
  white-space: normal !important; /* 오버플로우시 자동 줄바꿈 */
}

.outDiv {
  height: 100%;
  width: 109%;
  display: flex; /* Flexbox 레이아웃 사용 */
  justify-content: space-between; /* 요소들 사이의 간격을 균등하게 배치 */
}

.param-text {
  width: 95%;
  line-height: normal;
  font-size: 14px;
}
</style>
