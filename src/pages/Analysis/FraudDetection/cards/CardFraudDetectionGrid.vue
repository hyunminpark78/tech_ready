<template>
  <div class="bg-white border rounded-lg border-primary-200 dashboard-card">
    <RadioGroup
      ref="radioGroup"
      class="flex overflow-hidden border-t border-b rounded-tl-lg rounded-tr-lg border-primary-200 tab-one"
      :active-classes="['clicked']"
      @change="$console.log"
    >
      <button class="w-1/5 py-5 text-gray-600 border-r bg-white" @click="tabChange('TOTAL')">
        {{ $t('cost.all') }}
      </button>
      <button class="w-1/5 py-5 text-gray-600 border-r bg-white" @click="tabChange('C')">
        {{ $t('cost.critical') }}
      </button>
      <button class="w-1/5 py-5 text-gray-600 border-r bg-white" @click="tabChange('I')">
        {{ $t('cost.important') }}
      </button>
      <button class="w-1/5 py-5 text-gray-600 border-r bg-white" @click="tabChange('G')">
        {{ $t('cost.normal') }}
      </button>
    </RadioGroup>

    <div class="px-8 py-7">
      <template v-if="msgShow">
        <p v-if="msgData !== null" class="mb-4 text-sm text-primary-600">
          {{ msgData.cspTypCd }}
          의 실제 비용이 AI 예측 비용 대비
          <span class="text-secondary">{{ msgData.diffCost }}({{ Math.abs(msgData.diffRate) }}%)</span>
          <template v-if="msgData.diffRate.slice(0, 1) === '-'">감소했습니다.</template>
          <template v-if="msgData.diffRate.slice(0, 1) !== '-'">증가했습니다.</template>
        </p>
      </template>
      <h3 class="font-bold">
        {{ $t('cost.anomalyCostList') }}
        <span class="header__infotxt ml__20">* {{ $t('cost.criteriaPredictedActual') }}</span>
      </h3>
    </div>

    <div class="rounded-bl-lg rounded-br-lg max-h-856-">
      <ag-grid-vue
        id="FraudDetectionGrid"
        style="width: 100%; height: 500px"
        class="ag-theme-alpine"
        :grid-options="gridOptions"
        :row-data="rowData"
        :column-defs="columnDefs"
        :default-col-def="defaultColDef"
        col-resize-default="shift"
        :animate-rows="true"
        :framework-components="frameworkComponents"
        :loading-overlay-component="loadingOverlayComponent"
        :loading-overlay-component-params="loadingOverlayComponentParams"
        :no-rows-overlay-component="noRowsOverlayComponent"
        :no-rows-overlay-component-params="noRowsOverlayComponentParams"
        :popup-parent="popupParent"
        :suppress-context-menu="true"
        @grid-ready="onGridReady"
        @first-data-rendered="(params) => params.api.sizeColumnsToFit()"
        @grid-size-changed="(params) => params.api.sizeColumnsToFit()"
      ></ag-grid-vue>
    </div>
  </div>
</template>

<script>
import RadioGroup from '@/components/RadioGroup.vue';
import { AgGridVue } from 'ag-grid-vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import FraudDetectionDetailPopBtn from '@/pages/AgGrid/FraudDetectionDetailPopBtn.js';
import * as _ from 'lodash';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: { RadioGroup, AgGridVue },
  mixins: [AgGridMixin()],
  props: {
    contractId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: {
        suppressSizeToFit: true,
      },
      frameworkComponents: null,
      standardMsg: {
        A: '',
        B: 'AI 예측 비용 VS 실제비용',
      },
      msgData: null,
      msgShow: false,
    };
  },
  computed: {
    ...mapState('analysis', ['fraudDetection', 'aictrt', 'aiFilter']),
    ...mapState('dashboard', ['abNormalDetect']),
  },
  watch: {
    '$i18n.locale': 'setData',
    aiFilter: function (newVal, oldVal) {
      this.fetchFraudDetection({ ctrtId: newVal.ctrtId, headerType: 'TOTAL' });
      this.$refs.radioGroup.setActiveIndex(0);
    },
    aictrt: function (newVal, oldVal) {
      if (this.aictrt.length === 0) {
        this.setColumn();
        this.rowData = [];
      }

      if (this.contractId !== null) {
        this.fetchFraudDetection({ ctrtId: this.contractId, headerType: 'TOTAL' });
      } else {
        this.fetchFraudDetection({ ctrtId: this.aictrt[0].ctrtId, headerType: 'TOTAL' });
      }

      // ctrtId 변경에 따른 radioBtnReset
      this.$refs.radioGroup.setActiveIndex(0);
    },
    fraudDetection: function (newVal, oldVal) {
      this.setData();
      if (newVal.length !== 0) {
        this.msgData = newVal[newVal.length - 1];
      } else {
        this.msgData = null;
      }
    },
    abNormalDetect(newVal, oldVal) {
      if (newVal.length > 0) {
        for (let i = 0; i < newVal.length; i++) {
          if (newVal[i].diffDay === '0' && newVal[i].anomlYn === 'Y') {
            this.msgShow = true;
          } else {
            this.msgShow = false;
          }
        }
      }
    },
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  beforeMount() {
    this.gridOptions = {};
    this.frameworkComponents = {
      fraudDetectionDetailPopBtn: FraudDetectionDetailPopBtn,
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  methods: {
    ...mapActions('analysis', ['fetchFraudDetection']),
    setColumn() {
      this.columnDefs = [
        {
          headerName: 'No.',
          field: 'no',
          menuTabs: [],
          width: 70,
          headerComponentParams: {
            template:
              '<div style="padding-left:13px;" class="ag-cell-label-container" role="presentation">' +
              '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
              '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
              '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
              '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
              '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
              '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
              '    <span ref="eText" class="ag-header-cell-text w-full text-center" role="columnheader"></span>' +
              '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
              '  </div>' +
              '</div>',
          },
          cellClass: ['ag-grid-font', 'text-center', 'pl-32'],
        },
        {
          headerName: this.$t('cost.alarmLevel'),
          field: 'armGrade',
          menuTabs: [],
          width: i18n.locale === 'ko' ? 90 : 120,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: (params) => {
            if (params.value === 'C') {
              return `<span class="grid-alert-danger text-center">${this.$t('cost.critical')}</span>`;
            } else if (params.value === 'I') {
              return `<span class="grid-alert-important">${this.$t('cost.important')}</span>`;
            } else if (params.value === 'G') {
              return `<span class="grid-alert-normal">${this.$t('cost.normal')}</span>`;
            }
          },
        },
        {
          headerName: this.$t('cost.cloud'),
          field: 'cspTypCd',
          menuTabs: [],
          width: 90,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          headerName: this.$t('cost.analysisDate'),
          field: 'analDt',
          menuTabs: [],
          width: i18n.locale === 'ko' ? 115 : 130,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
        },
        // {
        //   headerName: '분석기준',
        //   field: 'regionSepCd',
        //   menuTabs: [],
        //   width: 200,
        //   headerComponentParams: { template: this.template },
        //   cellClass: ['ag-grid-font', 'text-left'],
        // },
        {
          headerName: this.$t('cost.detectionMessage'),
          field: 'curCost',
          menuTabs: [],
          suppressSizeToFit: false,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-left'],
        },
        {
          headerName: this.$t('cost.detectionDate'),
          field: 'forcstDt',
          menuTabs: [],
          width: i18n.locale === 'ko' ? 120 : 130,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          headerName: this.$t('cost.viewingCauses'),
          field: 'ctrtId',
          menuTabs: [],
          width: i18n.locale === 'ko' ? 120 : 140,
          suppressSizeToFit: true,
          headerComponentParams: { template: this.template },
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: 'fraudDetectionDetailPopBtn',
          cellRendererParams: {
            clicked: (data) => {
              this.$emit('popUp', data);
            },
          },
          resizable: false,
        },
      ];
    },
    setData() {
      this.rowData = [];
      this.setColumn();
      const data = _.cloneDeep(this.fraudDetection).reverse();

      data.forEach((v, i) => {
        let msg = '';
        if (v.diffRate < 0) {
          msg = i18n.locale === 'ko' ? '감소했습니다' : 'decreased by';
          v.diffRate = Math.abs(v.diffRate);
        } else if (v.diffRate > 0) {
          msg = i18n.locale === 'ko' ? '증가했습니다' : 'increased by';
        } else {
          msg = i18n.locale === 'ko' ? '변동이 없습니다.' : 'do not vary';
        }

        this.rowData.push({
          no: data.length - i,
          ctrtId: v.ctrtId,
          forcstDt: v.forcstDt.slice(0, 4) + '.' + v.forcstDt.slice(4, 6) + '.' + v.forcstDt.slice(6, 8),
          realCost: v.realCost,
          forcstCost: v.forcstCost,
          armGrade: v.armGrade,
          cspTypCd: v.cspTypCd,
          analDt: v.analDt.slice(0, 4) + '.' + v.analDt.slice(4, 6) + '.' + v.analDt.slice(6, 8),
          analStdCd: v.analStdCd,
          regionSepCd: this.standardMsg.B,
          pricingCurcyCd: v.pricingCurcyCd,
          curCost:
            i18n.locale === 'ko'
              ? '실제 비용이 AI 예측 비용 대비' +
                (v.pricingCurcyCd === 'KRW' ? ' ₩' : ' $') +
                this.numberWithCommas(Math.abs(v.diffCost)) +
                ' (' +
                v.diffRate +
                '%) ' +
                msg
              : 'Actual cost ' +
                msg +
                (v.pricingCurcyCd === 'KRW' ? ' ₩' : ' $') +
                this.numberWithCommas(Math.abs(v.diffCost)) +
                ' (' +
                v.diffRate +
                '%) ' +
                'compared to AI-predicted cost',
        });
      });
    },
    tabChange(headerType) {
      let ctrtId = '';
      if (this.aiFilter.ctrtId === '') {
        ctrtId = this.aictrt[0].ctrtId;
      } else {
        ctrtId = this.aiFilter.ctrtId;
      }
      this.fetchFraudDetection({ ctrtId, headerType });
    },
    onGridReady(params) {
      /*  this.setGridParams(params);
      this.fitGrid(); */
    },
  },
};
</script>

<style></style>
