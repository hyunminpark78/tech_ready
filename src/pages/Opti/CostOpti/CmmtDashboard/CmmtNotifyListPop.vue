<template>
  <div :class="visible ? '' : 'hidden'" style="height: 440px">
    <div class="mb-3 flex items-center">
      <p class="text-sm text-primary-600 font-bold">{{ $t('notify.clickNotiContent') }}</p>
      <div class="flex-1 text-right">
        <span class="text-primary-600 text-xs- font-bold">{{ $t('notify.baseDate') }}</span>
        <span class="text-gray-700 text-sm ml-6">{{ today }}</span>
      </div>
    </div>

    <ag-grid-vue
      style="width: 100%; height: 100%"
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
      :auto-height="true"
      :tooltip-show-delay="tooltipShowDelay"
      :tooltip-hide-delay="tooltipHideDelay"
      @first-data-rendered="onFirstDataRendered"
      @grid-ready="onGridReady"
    ></ag-grid-vue>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import moment from 'moment';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import { numberProcess } from '../CmmtPsblTgt/CostOptiCommon';
import costOptiService from '@/services/costOptiService';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: { AgGridVue },
  mixins: [AgGridMixin()],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    autoDisplay: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      today: '',
      alarmCheckYn: 'N',
      gridOptions: null,
      rowData: [],
      rowHeight: null,
      columnDefs: null,
      defaultColDef: null,
      defaultExcelExportParams: null,
      frameworkComponents: null,
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
      loading: false,
    };
  },
  computed: {
    ...mapState('costOpti', ['filter', 'isSearch']),
  },
  watch: {
    '$i18n.locale': ['setToday', 'setGridData'],
    loading(newVal) {
      if (newVal) this.gridApi.showLoadingOverlay();
    },
  },
  created() {
    this.setToday();
    this.setGridData();
  },
  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      suppressDragLeaveHidesColumns: true,
      defaultColDef: {
        flex: 1,
        lockPinned: true, // Don't allow pinning for this example
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

    this.setGridData();
  },
  methods: {
    ...mapActions('costOpti', ['fetchAlarmList', 'fetchActive']),
    setToday() {
      if (i18n.locale === 'ko') {
        this.today = moment().format('YYYY.MM.DD');
      } else {
        this.today = moment().format('MMM.DD.YYYY');
      }
    },
    async setGridData() {
      this.loading = true;

      try {
        this.setColumn();
        const result = await costOptiService.fetchAlarmList(this.filter);
        const hasData = !!result.data;
        this.alarmCheckYn = hasData ? result.data.data.alarmCheckYn : 'Y';
        this.rowData = hasData ? result.data.data.alarm : [];
        // 자동 팝업 표시
        const curPath = window.location.pathname;
        if (curPath === '/opti/cost/dashboard' || !this.autoDisplay) {
          if (this.alarmCheckYn === 'N' && this.rowData.length > 0) {
            this.$emit('openPop');
          }
        }
        // 알람 갯수 표시 건으로 더 이상 사용되지 않음.
        this.$emit('updateAlarmCheckYn', this.alarmCheckYn);
        // 알람 갯수 표시
        this.$emit('updateAlarmCount', this.rowData.length);
      } catch (err) {
        console.error('setGridData()', err);
      }

      this.loading = false;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
    setColumn() {
      this.columnDefs = [
        {
          field: 'alarmTypCd',
          headerName: this.$t('notify.notiType'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 128,
          cellClass: ['ag-grid-font', 'pop-text-center', 'vertical-center'],
          valueGetter: (params) => {
            const alarmTypCd = params.data.alarmTypCd;
            let alarmTypCdNm = null;
            switch (alarmTypCd) {
              case 'CVRG_STD':
                alarmTypCdNm = this.$t('notify.coverageStandards');
                break;
              case 'UTL_STD':
                alarmTypCdNm = this.$t('notify.usageRateStandard');
                break;
              case 'SAVE_STD':
                alarmTypCdNm = this.$t('notify.usageRateStandard');
                break;
              case 'CMMT_RCMD':
                alarmTypCdNm = this.$t('notify.contractRecommendation');
                break;
              case 'CMMT_EXPR':
                alarmTypCdNm = this.$t('notify.contractExpireDate');
                break;
            }
            return alarmTypCdNm;
          },
        },
        {
          field: 'alarmMsg',
          headerName: this.$t('notify.notiContent'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 514,
          cellClass: ['ag-grid-font', 'multiline-cell', 'vertical-left', 'button'],
          cellRenderer: (params) => {
            const cspTypCd = params.data.cspTypCd;
            const cmmtTyp = params.data.cmmtTyp;
            const alarmTypCd = params.data.alarmTypCd;
            const acntId = params.data.acntId;
            const prodCd = params.data.prodCd;
            const prodNm = params.data.prodNm;
            const alarmVal = params.data.alarmVal;
            const alarmStdVal = params.data.alarmStdVal;
            let alarmDiv = null;

            let cmmtTypCd;
            switch (cspTypCd) {
              case 'AWS':
                cmmtTypCd = cmmtTyp.replace(/\/RI/g, '');
                break;
              case 'AZURE':
                cmmtTypCd = 'AzureRI';
                break;
              case 'GCP':
                cmmtTypCd = cmmtTyp;
                break;
            }
            if (i18n.locale === 'ko') {
              switch (alarmTypCd) {
                case 'CVRG_STD':
                  alarmDiv = `<a href="/opti/cost/status?cmmtTyp=${cmmtTypCd}&acntId=${acntId}&prod=${prodCd}&chart=cvrg&grid=cvrg&focus=chart" style="color:blue">
                  ${prodNm} ${cmmtTyp} 커버리지가 ${numberProcess(alarmVal)}%으로 ${alarmStdVal}% 미만입니다.</a>`;
                  break;
                case 'UTL_STD':
                  alarmDiv = `<a href="/opti/cost/status?cmmtTyp=${cmmtTypCd}&acntId=${acntId}&prod=${prodCd}&chart=utl&grid=utl&focus=chart" style="color:blue">
                  ${prodNm} ${cmmtTyp} 사용률이 ${numberProcess(alarmVal)}%으로 ${alarmStdVal}% 미만입니다.</a>`;
                  break;
                case 'SAVE_STD':
                  alarmDiv = `<a href="/opti/cost/status?cmmtTyp=${cmmtTypCd}&acntId=${acntId}&prod=${prodCd}&chart=netSave&grid=utl&focus=chart" style="color:blue">
                  ${prodNm} ${cmmtTyp} 절감률이 ${numberProcess(alarmVal)}%으로 0% 미만입니다.</a>`;
                  break;
                case 'CMMT_RCMD':
                  alarmDiv = `<a href="/opti/cost/recommend?cmmtTyp=${cmmtTypCd}&acntId=${acntId}&prod=${prodCd}" style="color:blue">
                  ${prodNm} ${cmmtTyp} 커버리지가 ${numberProcess(alarmVal)}%으로 약정 추천이 있습니다.</a>`;
                  break;
                case 'CMMT_EXPR':
                  {
                    let color = 'blue';
                    if (alarmVal <= 30) {
                      color = '#ff2d47';
                    } else if (alarmVal <= 60) {
                      color = '#f5a323';
                    }
                    alarmDiv = `<a href="/opti/cost/status?cmmtTyp=${cmmtTypCd}&acntId=${acntId}&prod=${prodCd}&chart=utl&grid=prch&focus=grid"style="color:${color}">
                  ${prodNm} ${cmmtTyp} 약정이 ${alarmVal}일 후 만료됩니다.</a>`;
                  }
                  break;
              }
            } else {
              switch (alarmTypCd) {
                case 'CVRG_STD':
                  alarmDiv = `<a href="/opti/cost/status?cmmtTyp=${cmmtTypCd}&acntId=${acntId}&prod=${prodCd}&chart=cvrg&grid=cvrg&focus=chart" style="color:blue">
                  ${prodNm} ${cmmtTyp} coverage is ${numberProcess(alarmVal)}% and less than ${alarmStdVal}%.</a>`;
                  break;
                case 'UTL_STD':
                  alarmDiv = `<a href="/opti/cost/status?cmmtTyp=${cmmtTypCd}&acntId=${acntId}&prod=${prodCd}&chart=utl&grid=utl&focus=chart" style="color:blue">
                  ${prodNm} ${cmmtTyp} usage rate is ${numberProcess(alarmVal)}% and less than ${alarmStdVal}%.</a>`;
                  break;
                case 'SAVE_STD':
                  alarmDiv = `<a href="/opti/cost/status?cmmtTyp=${cmmtTypCd}&acntId=${acntId}&prod=${prodCd}&chart=netSave&grid=utl&focus=chart" style="color:blue">
                  ${prodNm} ${cmmtTyp} savings rate is ${numberProcess(alarmVal)}%and less than 0%.</a>`;
                  break;
                case 'CMMT_RCMD':
                  alarmDiv = `<a href="/opti/cost/recommend?cmmtTyp=${cmmtTypCd}&acntId=${acntId}&prod=${prodCd}" style="color:blue">
                  ${prodNm} ${cmmtTyp} coverage is ${numberProcess(
                    alarmVal
                  )}% and there are contract recommendations.</a>`;
                  break;
                case 'CMMT_EXPR':
                  {
                    let color = 'blue';
                    if (alarmVal <= 30) {
                      color = '#ff2d47';
                    } else if (alarmVal <= 60) {
                      color = '#f5a323';
                    }
                    alarmDiv = `<a href="/opti/cost/status?cmmtTyp=${cmmtTypCd}&acntId=${acntId}&prod=${prodCd}&chart=utl&grid=prch&focus=grid"style="color:${color}">
                    The Contract of ${prodNm} ${cmmtTyp} expires in ${alarmVal}.</a>`;
                  }
                  break;
              }
            }
            return alarmDiv;
          },
        },
        // {
        //   field: 'ctrtNm',
        //   headerName: '계약',
        //   menuTabs: [],
        //   resizable: true,
        //   sortable: true,
        //   width: 261,
        //   cellClass: ['ag-grid-font', 'multiline-cell', 'vertical-center'],
        // },
        {
          field: 'acntNm',
          headerName: this.$t('notify.accountName'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 167,
          cellClass: ['ag-grid-font', 'multiline-cell', 'vertical-center'],
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
        },
      ];
    },
    numberProcess(number) {
      return numberProcess(number);
    },
  },
};
</script>

<style>
.notify-pop .ag-grid-font {
  font-style: normal;
  font-size: 13px;
  line-height: 70px;
  /* color: #515151; */
  width: 120px;
  line-height: 2 !important;
  padding: 10px 0 !important;
  word-break: break-all !important;
}
.notify-pop .ag-body-horizontal-scroll-viewport {
  overflow-x: hidden;
}

.notify-pop .ag-body-viewport {
  left: 0;
  right: 0;
  box-shadow: 0 2px 6px 0 rgba(0, 165, 237, 0.22);
  max-height: 380px;
  overflow-y: scroll;
}
.pop-text-center {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.multiline-cell {
  white-space: normal !important; /* 오버플로우시 자동 줄바꿈 */
}
.vertical-center {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.vertical-left {
  display: flex !important;
  justify-content: left !important;
  align-items: center;
  margin-left: 8px !important;
  margin-right: 8px !important;
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
</style>
