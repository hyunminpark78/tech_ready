import { mapState } from 'vuex';
import { chartColorByNumber, numberProcess } from './CostOptiCommon';

export default {
  data() {
    return {
      gridColumns: {},
    };
  },
  computed: {
    ...mapState('costOpti', ['filter']),
    getColumns() {
      return this.gridColumns[this.filter.cspTypCd];
    },
  },
  watch: {
    '$i18n.locale': 'setColumns',
  },
  created() {
    this.setColumns();
    this.enabledTooltips([...this.gridColumns['AWS'], ...this.gridColumns['AZURE']]);
  },
  methods: {
    setColumns() {
      this.gridColumns = {
        AWS: [
          {
            field: 'accNmId',
            headerName: this.$t('optimization.linkedAccount'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-font', 'text-center'],
            valueGetter: (params) => `${params.data.lnkdAccNm} (${params.data.lnkdAccId})`,
          },
          {
            field: 'prodNm',
            headerName: this.$t('optimization.serviceType'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-center'],
          },
          {
            field: 'cmmtTyp',
            headerName: this.$t('optimization.contractType'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-center'],
            cellRenderer: (params) => {
              if (params.value === '-') {
                return '-';
              }

              return params.value.indexOf('SP') > -1 && (this.cmmtType === 'SP' || this.cmmtType === 'All')
                ? 'SP'
                : 'RI';
            },
          },
          {
            field: 'rgnNm',
            headerName: this.$t('optimization.region'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-center'],
          },
          {
            field: 'instFmly',
            headerName: this.$t('optimization.instanceFamily'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-center'],
          },
          {
            field: 'cmmtCvrgRt',
            headerName: this.$t('optimization.coverage'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            width: 220,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-center', 'percentType'],
            valueGetter: (params) => `${numberProcess(params.data.cmmtCvrgRt) / 100}`,
            valueFormatter: (params) => `${numberProcess(params.value * 100)}%`,
            cellRenderer: (params) => {
              const percent = numberProcess(params.value * 100);
              return `<div class="outDivBox">
              <div class="percent-text"><span>${percent}%</span></div>
              <div class="percent-box">
                <div class="fill" style="--percent:${percent}%;--fill-color:${chartColorByNumber(percent)}"></div>
              </div>
            </div>`;
            },
          },
          {
            field: 'cmmtOnDmndCostEqvlnt',
            headerName: this.$t('optimization.contractedOnDemandConversionCost'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            type: 'rightAligned',
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-right', 'numberType'],
            valueFormatter: (params) => `${this.numberWithCurcyUnit(params.value)}`,
          },
          {
            field: 'onDmndCost',
            headerName: this.$t('optimization.onDemandCosts'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            type: 'rightAligned',
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-right', 'numberType'],
            valueFormatter: (params) => `${this.numberWithCurcyUnit(params.value)}`,
          },
          {
            field: 'totOnDmndCostEqvlnt',
            headerName: this.$t('optimization.totalCost'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            width: 200,
            type: 'rightAligned',
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-right', 'numberType'],
            valueFormatter: (params) => `${this.numberWithCurcyUnit(params.value)}`,
          },
        ],
        AZURE: [
          {
            field: 'acntId',
            headerName: 'Subscription ID',
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-font', 'text-center'],
          },
          {
            field: 'acntNm',
            headerName: this.$t('optimization.subscriptionName'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-font', 'text-center'],
          },
          {
            field: 'prodNm',
            headerName: this.$t('optimization.serviceType'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-center'],
          },
          {
            field: 'rgnNm',
            headerName: this.$t('optimization.region'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-center'],
          },
          {
            field: 'instNm',
            headerName: this.$t('optimization.name'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-center'],
          },
          {
            field: 'instFlexGrp',
            headerName: this.$t('optimization.instanceFlexibilityGroup'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-center'],
          },
          {
            field: 'cmmtCvrgRt',
            headerName: this.$t('optimization.coverage'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            width: 220,
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-center', 'percentType'],
            valueGetter: (params) => `${numberProcess(params.data.cmmtCvrgRt) / 100}`,
            valueFormatter: (params) => `${numberProcess(params.value * 100)}%`,
            cellRenderer: (params) => {
              const percent = numberProcess(params.value * 100);
              return `<div class="outDivBox">
              <div class="percent-text"><span>${percent}%</span></div>
              <div class="percent-box">
                <div class="fill" style="--percent:${percent}%;--fill-color:${chartColorByNumber(percent)}"></div>
              </div>
            </div>`;
            },
          },
          {
            field: 'cmmtOnDmndCostEqvlnt',
            headerName: this.$t('optimization.contractedPayAsYouGoSystemCost'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            type: 'rightAligned',
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-right', 'numberType'],
            valueFormatter: (params) => `${this.numberWithCurcyUnit(params.value)}`,
          },
          {
            field: 'onDmndCost',
            headerName: this.$t('optimization.payAsYouGoCosts'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            type: 'rightAligned',
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-right', 'numberType'],
            valueFormatter: (params) => `${this.numberWithCurcyUnit(params.value)}`,
          },
          {
            field: 'totOnDmndCostEqvlnt',
            headerName: this.$t('optimization.totalCost'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            width: 200,
            type: 'rightAligned',
            headerClass: ['text-center'],
            cellClass: ['ag-grid-color-font', 'text-right', 'numberType'],
            valueFormatter: (params) => `${this.numberWithCurcyUnit(params.value)}`,
          },
        ],
      };
    },
  },
};
