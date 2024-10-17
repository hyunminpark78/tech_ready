<template>
  <div v-if="visible" class="notify-pop">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <section class="z-30 p-8 rounded policy-content w-1050 h-695 total-dashboard" style="width: 1050px; height: 695px">
      <h2 class="mb-4 text-2xl text-primary-400">{{ $t('notify.notify') }}</h2>
      <button class="absolute top-0 right-0 close-policy-modal mt-7 mr-7" @click="$emit('close')">
        <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
      </button>

      <div class="mb-6 flex dashboard-tab-buttons">
        <button
          :class="tab === 0 ? ['clicked', upbuttonClass] : upbuttonClass"
          class="rounded-tl-lg rounded-bl-lg"
          @click="handleClickTab(0)"
        >
          <span class="ml-3">{{ $t('notify.notiHistory') }}</span>
        </button>
        <button
          :class="tab === 1 ? ['clicked', upbuttonClass] : upbuttonClass"
          class="rounded-tr-lg rounded-br-lg"
          @click="handleClickTab(1)"
        >
          <span class="ml-3">{{ $t('notify.notiTypeInfo') }}</span>
        </button>
      </div>
      <template v-if="tab === 0">
        <div style="width: 100%; height: 100%">
          <div class="mb-3 flex items-center">
            <p class="text-sm text-primary-600 font-bold">{{ $t('notify.clickNotiContent') }}</p>
            <div class="flex-1 text-right">
              <span class="text-primary-600 text-xs- font-bold">{{ $t('notify.baseDate') }}</span>
              <span class="text-gray-700 text-sm ml-6">{{ today }}</span>
            </div>
          </div>
          <ag-grid-vue
            style="width: 100%; height: 470px; border-radius: 0; margin-right: -12px"
            class="ag-theme-alpine notify-pop ag-custom-scroll"
            :grid-options="gridOptions"
            :row-data="rowData"
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
            :tooltip-show-delay="tooltipShowDelay"
            :tooltip-hide-delay="tooltipHideDelay"
            @grid-ready="onGridReady"
          ></ag-grid-vue>
        </div>
      </template>
      <template v-if="tab === 1">
        <div class="notify-wrap" style="height: 460px; overflow-y: auto">
          <strong class="tit">{{ $t('notify.coverageCriteriaNoti') }}</strong>
          <ul>
            <li v-if="i18n().locale === 'ko'" class="text-primary-400">
              커버리지 70%<span class="small">(기본)</span> 미만 알림
            </li>
            <li v-if="i18n().locale === 'en'" class="text-primary-400">
              Notification below 70%<span class="small">(default)</span> coverage
            </li>
            <li>{{ $t('notify.oppoCostIncrease') }}</li>
            <li>{{ $t('notify.analyzeCauseChanges') }}</li>
            <li>{{ $t('notify.reviewAdditionalWays') }}</li>
          </ul>
          <strong class="tit">{{ $t('notify.notiBasedUtilization') }}</strong>
          <ul>
            <li v-if="i18n().locale === 'ko'" class="text-primary-400">
              사용률 70%<span class="small">(기본)</span> 미만 알림 / 절감액 0원 미만 알림
            </li>
            <li v-if="i18n().locale === 'en'" class="text-primary-400">
              Notification of usage rate less than 70%<span class="small">(default)</span> / Notification of savings
              less than 0 won
            </li>
            <li>{{ $t('notify.reducedResourceUse') }}</li>
            <li>{{ $t('notify.analyzeCauseChanges') }}</li>
          </ul>
          <strong class="tit">{{ $t('notify.contractRecommendNoti') }}</strong>
          <ul>
            <li v-if="i18n().locale === 'ko'" class="text-primary-400">
              커버리지 80%<span class="small">(기본)</span> 미만 약정 추천 알림
            </li>
            <li v-if="i18n().locale === 'en'" class="text-primary-400">
              Notification of contract recommendation for less than 80%<span class="small">(default)</span> coverage
            </li>
            <li>{{ $t('notify.considerWaysSaveMoney') }}</li>
          </ul>
          <strong class="tit">{{ $t('notify.contractExpireNoti') }}</strong>
          <ul>
            <li v-if="i18n().locale === 'ko'" class="text-primary-400">
              약정 만료 60일<span class="small">(기본)</span> 전 알림
            </li>
            <li v-if="i18n().locale === 'en'" class="text-primary-400">
              Notification 60 days<span class="small">(default)</span> before contract expiration
            </li>
            <li>{{ $t('notify.checkExpiringContracts') }}</li>
            <li>{{ $t('notify.reviewContractPurchases') }}</li>
          </ul>
          <strong class="tit">{{ $t('notify.unusedResourceNoti') }}</strong>
          <ul>
            <li class="text-primary-400">{{ $t('notify.notiUnusedResources') }}</li>
            <li>{{ $t('notify.checkResourcesUsedInefficiently') }}</li>
          </ul>
          <strong class="tit">{{ $t('notify.rightsizingNotice') }}</strong>
          <ul>
            <li class="text-primary-400">{{ $t('notify.notiRightsizingTarget') }}</li>
            <li>{{ $t('notify.recommendEfficientResourceTypes') }}</li>
          </ul>
          <strong class="tit">{{ $t('notify.abnormalCostDetection') }}</strong>
          <ul>
            <li class="text-primary-400">{{ $t('notify.notiAbnormalCosts') }}</li>
            <li>{{ $t('notify.detectAnomalousCost') }}</li>
          </ul>
        </div>
      </template>
    </section>
  </div>
  <!-- 알림 -->
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import totalDashboardService from '@/services/totalDashboardService';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: { AgGridVue },
  mixins: [AgGridMixin()],
  props: {
    visible: {
      type: Boolean,
    },
  },
  data() {
    return {
      today: '',
      tab: 0,
      gridOptions: null,
      rowData: [],
      rowHeight: null,
      columnDefs: null,
      defaultColDef: null,
      defaultExcelExportParams: null,
      frameworkComponents: null,
      loading: false,
      upbuttonClass: 'flex items-center justify-center flex-1 py-2l font-medium border',
      lobuttonClass: 'inline-block h-32 text-sm border rounded-sm border-primary-400 font-bold',
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
    };
  },
  computed: {
    ...mapState('totalDashboard', ['filter']),
    ...mapState('common', ['myCtrts']),
    getCspTyp() {
      return this.myCtrts.find((ctrt) => ctrt.ctrtId === this.filter.contract.ctrtId).cspTypCd;
    },
  },
  watch: {
    '$i18n.locale': ['setToday', 'setColumn', 'setData'],
    loading(newVal) {
      if (newVal) this.gridApi.showLoadingOverlay();
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
      onCellClicked: (params) => {
        this.onCellClicked(params);
      },
    };
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  mounted() {
    this.rowHeight = 70;
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  created() {
    this.setToday();
    this.setColumn();
    this.setData();
  },
  methods: {
    i18n() {
      return i18n;
    },
    setToday() {
      if (i18n.locale === 'ko') {
        this.today = moment().format('YYYY.MM.DD');
      } else {
        this.today = moment().format('MMM.DD.YYYY');
      }
    },
    handleClickTab(tab) {
      this.tab = tab;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      // this.gridApi.sizeColumnsToFit();
    },
    async setData() {
      this.loading = true;
      const result = await totalDashboardService.fetchAlarmList({ ctrtId: this.filter.contract.ctrtId });
      this.rowData = result.data.data || [];
      this.loading = false;
    },
    routeFraudDetection(params) {
      let paramValues = params;
      if (paramValues === null) {
        paramValues = {};
        paramValues.ctrtId = this.filter.contract.ctrtId;
        paramValues.detail = 'Y';
      }
      this.$router.push({
        name: '이상비용탐지',
        params: paramValues,
        props: true,
      });
    },
    routeRightSizing(params) {
      let paramValues = {};
      paramValues.cspTypCd = this.getCspTyp;
      paramValues.acntId = params.data.acntId;
      paramValues.ctrtId = params.data.ctrtId;
      paramValues.category = params.data.rsrcType;
      this.$router.push({
        name: 'Rightsizing',
        params: paramValues,
        props: true,
      });
    },
    routeUnusedRsrc(params) {
      let paramValues = {};
      paramValues.cspTypCd = this.getCspTyp;
      paramValues.acntId = params.data.acntId;
      paramValues.ctrtId = params.data.ctrtId;
      paramValues.category = params.data.rsrcType;
      this.$router.push({
        name: '미사용자원',
        params: paramValues,
        props: true,
      });
    },
    onCellClicked(params) {
      let alarmType = params.data.alarmType;
      if (params.column.colId === 'alarmMsg') {
        if (alarmType === '이상비용탐지') {
          this.routeFraudDetection(null);
        } else if (alarmType === '미사용자원') {
          this.routeUnusedRsrc(params);
        } else if (alarmType === 'Rightsizing') {
          this.routeRightSizing(params);
        }
      }
    },
    setColumn() {
      this.columnDefs = [
        {
          field: 'alarmType',
          headerName: this.$t('notify.notiType'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 128,
          cellClass: ['ag-grid-font', 'pop-text-center', 'vertical-center'],
          valueFormatter: (params) => {
            if (i18n.locale === 'ko') {
              return params.value;
            } else {
              return params.data.alarmEnType;
            }
          },
        },
        {
          field: 'alarmMsg',
          headerName: this.$t('notify.notiContent'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 514,
          cellClass: ['ag-grid-font', 'multiline-cell', 'vertical-left'],
          cellRenderer: (params) => {
            let cmmtTyp;
            switch (this.getCspTyp) {
              case 'AWS':
                cmmtTyp = params.value.indexOf('SP') !== -1 ? 'SP' : 'RI';
                break;
              case 'AZURE':
                cmmtTyp = 'AzureRI';
                break;
              case 'GCP': // TODO: GCP 화면 추가 시 변경 필요!!
                cmmtTyp = 'GcpRI';
                break;
              default:
                cmmtTyp = 'SP';
                break;
            }

            const acntId = params.data.acntId;
            const prodCd = params.data.rsrcType;
            let color = 'blue';

            const alarmType = params.data.alarmType;
            if (alarmType === '약정 추천') {
              return `<a href="/opti/cost/recommend?cmmtTyp=${cmmtTyp}&acntId=${acntId}&prod=${prodCd}" style="color:${color}">${
                i18n.locale === 'ko' ? params.value : params.data.alarmEnMsg
              }</a>`;
            } else if (alarmType === '약정 만료') {
              const alarmVal = params.value.replace(/[^0-9]/g, ''); // 만료 일자
              let color1 = 'blue';
              if (alarmVal <= 30) {
                color1 = '#ff2d47';
              } else if (alarmVal <= 60) {
                color1 = '#f5a323';
              }
              return `<a href="/opti/cost/status?cmmtTyp=${cmmtTyp}&acntId=${acntId}&prod=${prodCd}&chart=utl&grid=prch&focus=grid" style="color:${color1}">${
                i18n.locale === 'ko' ? params.value : params.data.alarmEnMsg
              }</a>`;
            } else if (alarmType === '이상비용탐지' || alarmType === '미사용자원' || alarmType === 'Rightsizing') {
              return `<a href="javascript:void(0);" style="color:${color}">${
                i18n.locale === 'ko' ? params.value : params.data.alarmEnMsg
              }</a>`;
            } else {
              const grid = alarmType === '커버리지 기준' ? 'cvrg' : 'utl';
              const chart = params.value.indexOf('절감률') !== -1 ? 'netSave' : grid;
              return `<a href="/opti/cost/status?cmmtTyp=${cmmtTyp}&acntId=${acntId}&prod=${prodCd}&chart=${chart}&grid=${grid}&focus=chart" style="color:${color}">${
                i18n.locale === 'ko' ? params.value : params.data.alarmEnMsg
              }</a>`;
            }
          },
        },
        // {
        //   field: 'ctrtNm',
        //   headerName: '계약',
        //   menuTabs: [],
        //   resizable: true,
        //   sortable: true,
        //   width: 261,
        //   cellClass: ['ag-grid-font', 'multiline-cell', 'vertical-left'],
        // },
        // {
        //   field: 'cspTyp',
        //   headerName: '클라우드',
        //   menuTabs: [],
        //   resizable: true,
        //   sortable: true,
        //   width: 155,
        //   cellClass: ['ag-grid-font', 'pop-text-center', 'vertical-center'],
        // },
        {
          field: 'acntNm',
          headerName: this.$t('notify.accountName'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 167,
          cellClass: ['ag-grid-font', 'multiline-cell', 'vertical-center'],
          headerValueGetter: () => {
            switch (this.filter.cspTypCd) {
              case 'AWS':
                return this.$t('notify.accountName');
              case 'AZURE':
                return 'Subscription';
              case 'GCP':
                return this.$t('notify.accountName'); // TODO: GCP 기능 추가시 변경 필요!!
            }
          },
          valueFormatter: (params) => params.value || '-',
        },
        {
          field: 'acntId',
          headerName: this.$t('notify.account'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 167,
          suppressHtmlEscape: false,
          cellClass: ['ag-grid-font', 'multiline-cell', 'vertical-center'],
          valueFormatter: (params) => params.value || '-',
          headerValueGetter: () => {
            switch (this.filter.cspTypCd) {
              case 'AWS':
                return this.$t('notify.account');
              case 'AZURE':
                return 'Subscription ID';
              case 'GCP':
                return this.$t('notify.account'); // TODO: GCP 기능 추가시 변경 필요!!
            }
          },
        },
      ];
    },
  },
};
</script>
<style>
.notify-pop .total-dashboard .ag-grid-font {
  font-style: normal;
  font-size: 13px;
  line-height: 70px;
  color: #515151;
  width: 120px;
  line-height: 2 !important;
  padding: 10px 0 !important;
  word-break: break-all !important;
}
.notify-pop .total-dashboard .ag-header {
  width: calc(100% - 12px) !important;
}
.notify-pop .total-dashboard .ag-body-viewport {
  max-height: 420px;
  box-shadow: 0 0 0 0 rgba(0, 165, 237, 0.22);
  overflow-y: auto;
}
.notify-pop .ag-body-horizontal-scroll-viewport {
  overflow-x: hidden;
}
.pop-text-center {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.multiline-cell {
  white-space: normal !important; /* 오버플로우시 자동 줄바꿈 */
}
.vertical-left {
  display: flex !important;
  justify-content: left !important;
  align-items: center;
  margin-left: 8px !important;
  margin-right: 8px !important;
}
.vertical-center {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
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
</style>
