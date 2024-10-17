<template>
  <div v-if="visible" class="notify-pop">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <section class="z-30 p-8 rounded policy-content" style="width: 1500px; height: 830px">
      <h2 class="mb-4 text-2xl text-primary-400">{{ $t('setting.appDetails') }}</h2>
      <button class="absolute top-0 right-0 close-policy-modal mt-7 mr-7" @click="$emit('close')">
        <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
      </button>

      <table
        class="w-full bg-white border-t border-primary-200 board-table"
        style="border-top: 1px solid rgb(0, 165, 237); border-bottom: 1px solid rgb(227, 235, 241)"
      >
        <thead class="font-bold text-xs- text-primary-600">
          <tr class="border-b border-primary-200 bg-primary-300">
            <th class="px-10 py-2 text-left">{{ $t('setting.appId') }}</th>
            <td class="bg-white is-w-300">{{ appId }}</td>
            <th class="px-10 py-2">{{ $t('setting.tenantId') }}</th>
            <td class="bg-white is-w-300">{{ tenantId }}</td>
          </tr>
          <tr>
            <th class="px-10 py-2">{{ $t('setting.remarksExplanation') }}</th>
            <td class="flex flex-row justify-center is-w-300" style="align-items: center; border-bottom: 0">
              <p>{{ subStringAppDesc(appDesc) }}</p>
              <div v-if="showAppDescToolTip" class="tooltip-wrap">
                <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
                <div class="tooltip-layer width-max pos_l" style="text-align: left">
                  <strong class="ti">{{ $t('setting.remarksExplanation') }}</strong>
                  <div class="ls">{{ appDesc }}</div>
                  <button class="close jsTooltipClose1">툴팁 닫기</button>
                </div>
              </div>
            </td>
            <th class="px-10 py-2">{{ $t('setting.clientPassword') }}<br />{{ $t('setting.expireDate') }}</th>
            <td class="bg-whtie is-w-300">{{ clientScrExprDtm }}</td>
          </tr>
        </thead>
      </table>

      <div style="width: 100%; height: 100%">
        <div class="my-3 flex items-center">
          <p class="text-sm text-primary-600 font-bold"></p>
        </div>

        <div>
          <ag-grid-vue
            ref="agGrid2"
            style="width: 100%; height: 100%"
            class="ag-theme-alpine notify-pop ag-custom-scroll"
            :grid-options="gridOptions"
            :row-data="subsList"
            :row-height="rowHeight"
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
            :auto-height="true"
            :tooltip-show-delay="tooltipShowDelay"
            :tooltip-hide-delay="tooltipHideDelay"
            @first-data-rendered="onFirstDataRendered"
            @grid-ready="onGridReady"
          ></ag-grid-vue>
        </div>
        <div v-if="existsNonMySubs" class="text-right mt-1.5 text-xs- text-primary-600 font-bold">
          {{ $t('setting.listCompleteSubscription') }}
        </div>
        <div class="button-wrap">
          <button
            class="mt-3 mr-2 py-2 text-base font-bold bg-white border rounded text-primary-400 border-primary-400"
            @click.stop="$emit('close')"
          >
            {{ $t('common.button.close') }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import _ from 'loadsh';

export default {
  components: { AgGridVue },
  mixins: [AgGridMixin()],
  props: {
    visible: {
      type: Boolean,
    },
    ctrtId: {
      type: String,
      required: true,
    },
    appId: {
      type: String,
      default: '-',
    },
    tenantId: {
      type: String,
      default: '-',
    },
    appDesc: {
      type: String,
      default: '-',
    },
    clientScrExprDtm: {
      type: String,
      default: '-',
    },
    subsList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      gridOptions: null,
      gridOptions2: null,
      rowData: [],
      rowHeight: null,
      columnDefs: null,
      columnDefs2: null,
      defaultColDef: null,
      defaultExcelExportParams: null,
      frameworkComponents: null,
      frameworkComponents2: null,
      loading: false,
      upbuttonClass: 'flex items-center justify-center flex-1 py-2l font-medium border',
      lobuttonClass: 'inline-block h-32 text-sm border rounded-sm border-primary-400 font-bold',
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
      agGridSize: '',
      showAppDescToolTip: false,
    };
  },
  computed: {
    existsNonMySubs() {
      return this.subsList.some((item) => item.userCtrtMpYn === 'N');
    },
  },
  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      suppressCellSelection: true,
      suppressDragLeaveHidesColumns: true,
      defaultColDef: {
        flex: 1,
        lockPinned: true, // Don't allow pinning for this example
      },
      rowClassRules: {
        'no-my-subs-rows': (params) => {
          return params.data.userCtrtMpYn !== 'Y';
        },
      },
    };

    this.gridOptions2 = _.cloneDeep(this.gridOptions);

    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  mounted() {
    this.rowHeight = 70;
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.setTooltips();
    this.setGridData();
  },
  created() {},
  methods: {
    ...mapActions('azureAcctMgmt', ['fetchAzureAppSubsList']),
    subStringAppDesc(appDesc) {
      if (appDesc && appDesc.length > 20) {
        let substringResult = appDesc.substring(0, 15);
        this.showAppDescToolTip = true;
        return substringResult + '...';
      }
      return appDesc;
    },
    onGridReady(params) {
      // params.api.sizeColumnsToFit();
    },
    setTooltips() {
      const tooltips = document.querySelectorAll('.tooltip-wrap');
      const tooltipBtns = document.querySelectorAll('.jsTooltip1');
      tooltipBtns.forEach((tooltip) => {
        tooltip.onclick = function () {
          for (let i = 0; i < tooltips.length; i++) {
            tooltips[i].classList.remove('active');
          }
          if (this.parentNode.classList.contains('active')) {
            this.parentNode.classList.remove('active');
          } else {
            this.parentNode.classList.add('active');
          }
        };
      });
      const tooltipCloses = document.querySelectorAll('.jsTooltipClose1');
      tooltipCloses.forEach((tooltipClose) => {
        tooltipClose.onclick = function () {
          this.parentNode.parentNode.classList.remove('active');
        };
      });
    },
    setGridData() {
      this.columnDefs = this.getColumns();
      this.enabledTooltips(this.columnDefs);
      this.columnDefs2 = this.getColumns();
      this.enabledTooltips(this.columnDefs2);
    },
    getColumns() {
      return [
        {
          field: 'ctrtNm',
          headerName: this.$t('setting.contractName'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            return `<span>${params.value || '-'}</span>`;
          },
        },
        {
          field: 'subscId',
          headerName: 'Subscription ID',
          menuTabs: [],
          resizable: true,
          sortable: true,
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            return `<span>${params.value || '-'}</span>`;
          },
        },
        {
          field: 'subscNm',
          headerName: this.$t('setting.subscriptionName'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            return `<span>${params.value || '-'}</span>`;
          },
        },
        {
          field: 'subscFrstLinkDtm',
          headerName: this.$t('setting.firstLinkedDate'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          suppressSizeToFit: true,
          width: 135,
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
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
          suppressSizeToFit: true,
          width: 135,
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
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
          suppressSizeToFit: true,
          width: 130,
          tooltipField: 'tooltip',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            const status = (params.value || '').toUpperCase();
            switch (status) {
              case 'ASSIGNED':
                return `<span class="round-wrap blue">${status}</span>`;
              case 'ERROR':
                return `<span class="round-wrap red">${status}</span>`;
              default:
                return `<span class="round-wrap gray">${status}</span>`;
            }
          },
        },
      ];
    },
  },
};
</script>
<style>
.notify-pop .ag-grid-font {
  font-style: normal;
  font-size: 13px;
  //line-height: 70px;
  color: #515151;
  width: 120px;
  line-height: 2 !important;
  padding: 10px 0 !important;
  word-break: break-all !important;
}
.notify-pop .ag-body-viewport {
  max-height: 450px;
  overflow-y: auto;
  box-shadow: none !important;
}

.notify-pop .ag-body-horizontal-scroll-viewport {
  overflow-x: hidden;
}

.ag-header-cell-label {
  justify-content: center;
}
/* 수직 스크롤바의 색상 지정 */
.ag-custom-scroll .ag-body-viewport::-webkit-scrollbar {
  width: 12px;
}

.ag-custom-scroll .ag-body-viewport::-webkit-scrollbar-track {
  background-color: #d9d9d9;
}

.ag-custom-scroll .ag-body-viewport::-webkit-scrollbar-thumb {
  background-color: #a8a8a8;
}

/* 아이콘 숨기기 */
.ag-custom-scroll .ag-body-viewport::-webkit-scrollbar-button {
  display: none;
}

.text-primary-400 > .small {
  font-size: 12px;
}

.width-max {
  width: max-content;
}

.no-my-subs-rows {
  opacity: 0.5;
}

.policy-content {
  top: 54%;
}
</style>

<style scoped>
.button-wrap {
  margin-top: 10px;
  text-align: right;
}
.button-wrap button {
  min-width: 100px;
}
</style>
