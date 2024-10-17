<template>
  <div id="comparisonGrid" ref="comparisonGrid" class="relative">
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
      :suppress-context-menu="true"
      :pagination="true"
      :auto-height="true"
      :suppress-pagination-panel="true"
      :suppress-scroll-on-new-data="true"
      :suppress-row-transform="true"
      :row-class-rules="rowClassRules"
      @first-data-rendered="autoSizeAll"
      @row-data-changed="autoSizeAll"
      @grid-ready="onGridReady"
      @filter-changed="onFilterChanged"
      @column-moved="onColumnMoved"
      @bodyScroll="handleScroll"
    ></ag-grid-vue>
    <div v-if="!isHiddenDropdown" :style="dropdownStyle">
      <div class="relative select-three" style="width: 100%">
        <ComparisonDropdown :data="dropDownData" @click="handleClickSelect" />
      </div>
    </div>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import DeleteCell from '@/pages/Advisor/components/DeleteCell.vue';
import SelectCell from '@/pages/Advisor/components/SelectCell.vue';
import AddButtonCell from '@/pages/Advisor/components/AddButtonCell.vue';
import ComparisonDropdown from '@/pages/Advisor/components/ComparisonDropdown.vue';
import ClearButtonCell from '@/pages/Advisor/components/ClearButtonCell.vue';
import demoData from '../../../../../../public/locales/comparison_demo.json';
import { EventBus } from '../../../../Setting/CloudAuth/AzureAcctMgmt/eventBus';
import iconDown from '@/assets/images/lowerIcon.svg';
import iconUp from '@/assets/images/upperIcon.svg';
import { mapState } from 'vuex';

export default {
  components: {
    AgGridVue,
    ComparisonDropdown,
    DeleteCell,
    SelectCell,
    AddButtonCell,
    ClearButtonCell,
  },
  mixins: [AgGridMixin()],
  props: {
    rangeType: {
      type: Number,
      default: 90,
    },
  },
  data() {
    return {
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      frameworkComponents: null,
      loading: false,
      gridToolPanelVisible: false,
      selectTimeData: [],
      rowClassRules: {
        customFirstRow: (params) =>
          params.data.sortation === this.$t('advisor.detailTable.spotComparison.currentInformation'),
        customLastRow: (params) => params.data.filterSection,
        customTypeRow: (params) =>
          params.data.recommendationOptions ? params.data.recommendationOptions.value === this.category : false,
      },
      customData: {
        instanceFamily: '',
        availableZone: '',
        region: '',
        operateSys: '',
      },
      posDropdown: {
        left: 0,
        top: 0,
      },
      isHiddenDropdown: true,
      dropDownData: [
        {
          text: 'r6i.xlarge',
          value: '1',
        },
        {
          text: 'r6i.2xlarge',
          value: '2',
        },
        {
          text: 'r6i.4xlarge',
          value: '3',
        },
        {
          text: 'r6i8.xlarge',
          value: '4',
        },
        {
          text: 'r6i12.xlarge',
          value: '5',
        },
      ],
      activeField: '',
      typeData: {
        sameType: {
          text: this.$t('advisor.detailTable.spotComparison.sameType'),
          value: 'SameFamily',
        },
        priceFirst: {
          text: this.$t('advisor.detailTable.spotComparison.costPriority'),
          value: 'PricePrior',
        },
        stabilityFirst: {
          text: this.$t('advisor.detailTable.spotComparison.stabilityFirst'),
          value: 'StabilityPrior',
        },
      },
    };
  },
  computed: {
    ...mapState('spotAdvisor', {
      category: 'category',
    }),
    firstId() {
      const item = this.rowData.find((item) => item.customData || item.filterSection);
      return item ? item.id : 0;
    },
    dropdownStyle() {
      return `position: absolute; top: ${this.posDropdown.top}px; left: ${this.posDropdown.left}px; width: 250px`;
    },
    isValidateSelect() {
      let isValidate = true;
      const fields = ['region', 'instanceFamily', 'availableZone', 'operateSys'];
      fields.forEach((item) => {
        isValidate = this.customData[item] ? true : false;
      });
      return isValidate;
    },
    selectedRecommendSpot() {
      return this.rowData.find((item) => item.recommendationOptions.value === this.category);
    },
  },

  watch: {
    '$i18n.locale': ['setGridData', 'setColumn'],
    rangeType() {
      this.calculateWithRange();
    },
  },

  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      enableAdvancedFilter: true,
      suppressCellSelection: true,
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
      sideBar: {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: '컬럼설정',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
              suppressRowGroups: true,
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true,
              suppressColumnFilter: true,
              suppressColumnSelectAll: true,
              suppressColumnExpandAll: true,
            },
          },
        ],
        defaultToolPanel: 'columns',
        hiddenByDefault: true,
      },
      rowHeight: 50,
    };
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },

  mounted() {
    this.setGridDataInit();
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.setColumn();

    if (document.querySelector('.jsFoldGrid')) {
      const btnFolds = document.querySelectorAll('.jsFoldGrid');
      btnFolds.forEach((btnFold) => {
        btnFold.onclick = function () {
          if (this.parentNode.parentNode.parentNode.classList.contains('close')) {
            this.parentNode.parentNode.parentNode.classList.remove('close');
          } else {
            this.parentNode.parentNode.parentNode.classList.add('close');
          }
        };
      });
    }
  },

  methods: {
    async setGridDataInit() {
      this.setGridData();
    },
    async setGridData() {
      const rowData = [
        {
          id: 1,
          sortation: this.$t('advisor.detailTable.spotComparison.currentInformation'),
          recommendationOptions: '',
          instanceFamily: 'g4dn-xlarge',
          region: 'Asia Pacific (Seoul)',
          availableZone: 'ap-northeast-2a',
          operateSys: 'Linux/UNIX',
          vCPU: 4,
          CPUMemory: '16 GiB',
          GPUType: 'NVIDIA T4 Tensor',
          GPUMemory: 16,
          interruptionFrequency: '',
          currentRate: 877,
          estimatedCost: 1894320,
          averageAmount: ``,
          averageSavingsRate: '',
        },
        {
          id: 2,
          sortation: this.$t('advisor.detailTable.spotComparison.recommendedSpot'),
          recommendationOptions: this.typeData.sameType,
          instanceFamily: 'g4dn-xlarge',
          region: 'Asia Pacific (Seoul)',
          availableZone: 'ap-northeast-2d',
          operateSys: 'Linux/UNIX',
          vCPU: 4,
          CPUMemory: '16 GiB',
          GPUType: 'NVIDIA T4 Tensor',
          GPUMemory: 16,
          interruptionFrequency: '5~10%',
          currentRate: (demoData.average.Column12 * 1355.55 + 8).toFixed(0),
          estimatedCost: (demoData.average.Column12 * 1355.55 * 24 * 90).toFixed(0),
          averageAmount: Number(demoData.average.Column12 * 1355.55).toFixed(0),
          averageSavingsRate: Number(demoData.savingRate.Column12.toFixed(2)),
        },
        {
          id: 3,
          sortation: '',
          recommendationOptions: this.typeData.priceFirst,
          instanceFamily: 'g4ad-xlarge',
          region: 'Asia Pacific (Seoul)',
          availableZone: 'ap-northeast-2b',
          operateSys: 'Linux/UNIX',
          vCPU: 4,
          CPUMemory: '16 GiB',
          GPUType: 'AMD EPYC 7R32',
          GPUMemory: 8,
          interruptionFrequency: '5~10%',
          currentRate: (demoData.average.Column13 * 1355.55 + 27).toFixed(0),
          estimatedCost: (demoData.average.Column13 * 1355.55 * 24 * 90).toFixed(0),
          averageAmount: Number(demoData.average.Column13 * 1355.55).toFixed(0),
          averageSavingsRate: Number(demoData.savingRate.Column13.toFixed(2)),
        },
        {
          id: 4,
          sortation: '',
          recommendationOptions: this.typeData.stabilityFirst,
          instanceFamily: 'g5-xlarge',
          region: 'Asia Pacific (Seoul)',
          availableZone: 'ap-northeast-2a',
          operateSys: 'Linux/UNIX',
          vCPU: 4,
          CPUMemory: '16 GiB',
          GPUType: 'AMD EPYC 7R32',
          GPUMemory: 16,
          interruptionFrequency: '<5%',
          currentRate: (demoData.average.Column11 * 1355.55 + 12).toFixed(0),
          estimatedCost: (demoData.average.Column11 * 1355.55 * 24 * 90).toFixed(0),
          averageAmount: Number(demoData.average.Column11 * 1355.55).toFixed(0),
          averageSavingsRate: Number(demoData.savingRate.Column11.toFixed(2)),
        },
        {
          id: 5,
          sortation: '',
          recommendationOptions: '',
          instanceFamily: this.customData.instanceFamily.text,
          region: this.customData.region.text,
          availableZone: this.customData.availableZone.text,
          operateSys: this.customData.operateSys.text,
          vCPU: '',
          CPUMemory: '',
          GPUType: '',
          GPUMemory: '',
          interruptionFrequency: '',
          currentRate: ``,
          averageAmount: ``,
          averageSavingsRate: '',
          filterSection: true,
        },
      ];
      this.setEipData(rowData);
    },
    setEipData(rowData) {
      this.rowData = rowData;
    },
    calculateWithRange() {
      let newData;
      this.setGridData();
      if (this.rangeType === 7) {
        newData = this.rowData.map((item) => {
          return {
            ...item,
            estimatedCost: ((item.estimatedCost / 90) * 7).toFixed(0),
          };
        });
        this.setEipData(newData);
      } else if (this.rangeType === 30) {
        newData = this.rowData.map((item) => {
          return {
            ...item,
            estimatedCost: (item.estimatedCost / 3).toFixed(0),
          };
        });
        this.setEipData(newData);
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.autoSizeAll();
      this.gridApi.sizeColumnsToFit();
    },
    autoSizeAll() {
      let gridId = 'usageGrid_';
      let columnState = localStorage.getItem(gridId + '_columnState');
      let columnGroupState = localStorage.getItem(gridId + '_columnGroupState');
      if (!this.gridColumnApi.getAllColumns()) return;
      var allColumnIds = [];
      if (columnState && columnState !== 'undefined') {
        this.gridColumnApi.applyColumnState({
          state: JSON.parse(columnState),
          applyOrder: true,
        });
        allColumnIds = JSON.parse(columnState).map((row) => row.colId);
      } else {
        this.gridColumnApi.getAllColumns().forEach(function (column) {
          allColumnIds.push(column.colId);
        });
      }
      if (columnGroupState && columnGroupState !== 'undefined') {
        this.gridColumnApi.setColumnGroupState(JSON.parse(columnGroupState));
      }
      this.gridColumnApi.autoSizeColumns(allColumnIds, false);
    },
    setColumn() {
      this.columnDefs = [
        {
          headerName: this.$t('advisor.detailTable.spotComparison.sortation'),
          field: 'sortation',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'bolder-font'],
          menuTabs: [],
          valueFormatter: this.valueCustomFormatter,
          rowSpan: (params) =>
            params.data.sortation === this.$t('advisor.detailTable.spotComparison.recommendedSpot') ? 3 : 1,
          cellClassRules: {
            'cell-span': (params) =>
              params.data.sortation === this.$t('advisor.detailTable.spotComparison.recommendedSpot'),
          },
          cellRenderer: (params) =>
            this.firstId === params.data.id
              ? this.$t('advisor.detailTable.spotComparison.customization')
              : params.value,
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.recommendationOptions'),
          field: 'recommendationOptions',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          valueFormatter: (params) => (params.value ? params.value.text || '' : ''),
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.instanceType'),
          field: 'instanceFamily',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          valueFormatter: this.valueCustomFormatter,
          cellRendererFramework: 'SelectCell',
          cellRendererParams: {
            onClick: this.handleOpenDropdown,
          },
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.region'),
          field: 'region',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          valueFormatter: this.valueCustomFormatter,
          cellRendererFramework: 'SelectCell',
          cellRendererParams: {
            onClick: this.handleOpenDropdown,
          },
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.availableZone'),
          field: 'availableZone',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          valueFormatter: this.valueCustomFormatter,
          cellRendererFramework: 'SelectCell',
          cellRendererParams: {
            onClick: this.handleOpenDropdown,
          },
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.operateSys'),
          field: 'operateSys',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          valueFormatter: this.valueCustomFormatter,
          cellRendererFramework: 'SelectCell',
          cellRendererParams: {
            onClick: this.handleOpenDropdown,
          },
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.interruptionFrequency'),
          field: 'interruptionFrequency',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          valueFormatter: this.valueCustomFormatter,
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.vCPU'),
          field: 'vCPU',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding', 'small-size'],
          menuTabs: [],
          valueFormatter: this.valueCustomFormatter,
          cellRendererFramework: 'AddButtonCell',
          cellRendererParams: {
            onClick: this.handleAddRowData,
          },
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.CPUMemory'),
          field: 'CPUMemory',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          valueFormatter: this.valueCustomFormatter,
          cellRendererFramework: 'ClearButtonCell',
          cellRendererParams: {
            onClick: this.handleClearData,
          },
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.GPUType'),
          field: 'GPUType',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          valueFormatter: this.valueCustomFormatter,
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.GPUMemory'),
          field: 'GPUMemory',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          valueFormatter: this.valueCustomFormatter,
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.currentRate'),
          field: 'currentRate',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          cellRenderer: this.currentRateRenderer,
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.averageAmount'),
          field: 'estimatedCost',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          cellRenderer: this.currentRateRenderer,
        },
        {
          headerName: this.$t('advisor.detailTable.spotComparison.averageSavingsRate'),
          field: 'averageSavingsRate',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          valueFormatter: this.customValuePercentage,
        },
        {
          headerName: '',
          field: '',
          resizable: false,
          cellClass: ['ag-grid-font', 'text-center', 'comparison-cell-padding'],
          menuTabs: [],
          cellRendererFramework: 'DeleteCell',
          cellRendererParams: {
            onClick: this.handleDelete,
          },
        },
      ];
      this.defaultColDef = {
        flex: 1,
        filter: true,
        enableValue: false,
        enableRowGroup: false,
        enablePivot: false,
      };
      this.enabledTooltips(this.columnDefs);
    },
    handleAddRowData() {
      if (this.isValidateSelect) {
        const rowData = this.rowData;
        const customDataCount = rowData.filter((item) => item.customData).length || 0;

        EventBus.$emit('eventFromComparisonTable', { instanceType: this.customData.instanceFamily.text });
        const lastItemId = rowData[rowData.length - 1].id;
        const customData = {
          id: lastItemId + customDataCount + 1,
          customData: true,
          instanceFamily: this.customData.instanceFamily.text,
          region: this.customData.region.text,
          availableZone: this.customData.availableZone.text,
          operateSys: this.customData.operateSys.text,
          vCPU: 8,
          CPUMemory: '32 GiB',
          GPUType: 'AMD EPYC 7R32',
          GPUMemory: 16,
          interruptionFrequency: '<5%',
          currentRate: 506,
          estimatedCost: 506 * 24 * 90 + 204,
          averageAmount: 512,
          averageSavingsRate: '59.10',
        };
        const insertIndex = rowData.findIndex((item) => item.filterSection);
        rowData.splice(insertIndex, 0, customData);
        this.rowData = rowData;
        this.handleClearData();
        this.triggerAddChartSeriesEvent(this.customData.instanceFamily.text);
      }
    },
    handleDelete(id) {
      const rowData = this.rowData;
      const selectedIdx = rowData.findIndex((item) => item.id === id);
      rowData.splice(selectedIdx, 1);
      EventBus.$emit('eventFromComparisonTableDelete', {});
    },
    setDataDropDown(field) {
      switch (field) {
        case 'instanceFamily':
          this.dropDownData = demoData.InstanceTypes.map((item, index) => ({
            text: item,
            value: index,
            isActiveOptionValue: true,
          }));
          break;
        case 'region':
          this.dropDownData = this.dropDownData = demoData.Regions.map((item, index) => ({
            text: item,
            value: index,
            isActiveOptionValue: Number(index) % 3 === 0 || Number(index) % 5 === 0 ? true : false,
          }));
          break;
        case 'availableZone':
          this.dropDownData = this.dropDownData = demoData.AvailabilityZone.map((item, index) => ({
            text: item,
            value: index,
            isActiveOptionValue: Number(index) === 9 || Number(index) === 10 ? true : false,
          }));
          break;
        case 'operateSys':
          this.dropDownData = [
            {
              text: 'Linux/Unix',
              value: '1',
              isActiveOptionValue: true,
            },
            {
              text: 'SUSE Linux',
              value: '2',
              isActiveOptionValue: true,
            },
            {
              text: 'Red Hat Enterprise Linux',
              value: '3',
              isActiveOptionValue: false,
            },
            {
              text: 'Windows',
              value: '4',
              isActiveOptionValue: true,
            },
          ];
          break;
        default:
          break;
      }
    },
    handleOpenDropdown(data) {
      if (!this.isHiddenDropdown && this.activeField === data.field) {
        this.isHiddenDropdown = true;
      } else {
        this.isHiddenDropdown = false;
        this.activeField = data.field;
        this.setDataDropDown(data.field);
        const posTable = this.$refs.comparisonGrid.getBoundingClientRect();
        this.posDropdown = {
          left: Math.floor(data.left - posTable.left),
          top: Math.floor(data.top - posTable.top) + 35,
        };
      }
    },
    handleClickSelect(data) {
      let copyCustomData = this.customData;
      const field = this.activeField;
      copyCustomData = { ...copyCustomData, [field]: data };
      this.customData = copyCustomData;
      const rowData = this.rowData;
      const customDataIndex = rowData.findIndex((item) => item.filterSection);
      const customData = this.rowData[customDataIndex];
      const newData = {
        ...customData,
        [field]: data.text,
      };
      rowData.splice(customDataIndex, 1, newData);
      this.rowData = rowData;
      this.isHiddenDropdown = true;
    },
    handleClearData() {
      const rowData = this.rowData;
      const customDataIndex = rowData.findIndex((item) => item.filterSection);
      const customData = this.rowData[customDataIndex];
      rowData.splice(customDataIndex, 1, {
        ...customData,
        region: '',
        instanceFamily: '',
        availableZone: '',
        operateSys: '',
      });
      this.rowData = rowData;
      this.customData = {};
    },
    valueCustomFormatter(params) {
      return params.data.filterSection ? '' : params.value || '-';
    },
    handleScroll() {
      this.isHiddenDropdown = true;
    },
    customValueCurrency(params) {
      const formatted = this.numberWithCommas(params.value);
      return params.data.filterSection ? '' : formatted ? '₩' + formatted : '-';
    },
    customValuePercentage(params) {
      return params.data.filterSection ? '' : params.value ? `${params.value}%` : '-';
    },
    currentRateRenderer(params) {
      if (params.data.customData) {
        const classCell =
          Number(params.value) > Number(this.selectedRecommendSpot.currentRate) ? 'higherValue' : 'lowerValue';
        const icon = Number(params.value) > Number(this.selectedRecommendSpot.currentRate) ? iconUp : iconDown;
        return params.value
          ? `<div class="flex justify-end ${classCell}" >
          <img src="${icon}" alt="." class="mr-1"/>` +
              this.customValueCurrency(params) +
              '</div>'
          : '-';
      } else {
        return this.customValueCurrency(params);
      }
    },
    averageAmountRenderer(params) {
      if (params.data.customData) {
        const classCell =
          Number(params.value) > Number(this.selectedRecommendSpot.averageAmount) ? 'higherValue' : 'lowerValue';
        const icon = Number(params.value) > Number(this.selectedRecommendSpot.averageAmount) ? iconUp : iconDown;
        return params.value
          ? `<div class="flex justify-end ${classCell}" >
          <img src="${icon}" alt="." class="mr-1"/>` +
              this.customValueCurrency(params) +
              '</div>'
          : '-';
      } else {
        return this.customValueCurrency(params);
      }
    },
  },
};
</script>
<style>
#comparisonGrid {
  width: 99%;
}
.ag-header-group-text {
  text-align: center !important;
  font-size: 13px;
  font-style: normal;
  line-height: 18px;
  font-weight: bold !important;
  color: #5ba9ca;
  font-family: 'Noto Sans KR';
}

.ag-header-group-cell-label {
  align-items: center !important;
  justify-content: center !important;
}

.ag-header-cell-label {
  justify-content: center;
}

.ag-body-viewport {
  min-height: 120px;
}

.ag-root-wrapper-body .no-display-in-grid {
  display: none !important;
}

.ag-row .ag-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 24px;
}
.cell-span {
  background-color: #ffffff;
}
.customFirstRow .ag-cell {
  background-color: #f9f9f9;
  color: #888888;
}

.customLastRow .ag-cell {
  background-color: #f9f9f9;
}

/*style tab wrap currency*/
.tab-wrap-currency {
  display: inline-block;
  height: 32px;
}
.tab-wrap-currency a {
  text-align: center;
  float: left;
  font-size: 14;
  width: 32px;
  height: 32px;
  border: solid 1px #e9ebed;
  padding-top: 2px;
  color: #999999;
  cursor: pointer;
}

.tab-wrap-currency a:first-child {
  border-radius: 6px 0 0 6px;
}
.tab-wrap-currency a:last-child {
  border-radius: 0 6px 6px 0;
}
.tab-wrap-currency a.clicked {
  background-color: #00a5ed;
  border-color: #00a5ed;
  color: #ffffff;
}
.bolder-font {
  font-weight: 700 !important;
}
.comparison-cell-padding {
  padding-top: 11px;
  padding-bottom: 11px;
  padding-left: 18px !important;
  padding-right: 18px !important;
}
.small-size {
  width: 50px;
}
,
.customTypeRow .ag-cell {
  color: #00a5ed;
  font-weight: 700;
}
.higherValue {
  color: #ea1718;
}
.lowerValue {
  color: #1ae3bb;
}
</style>
