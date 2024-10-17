import { AllModules } from 'ag-grid-enterprise';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import { VanillaFrameworkOverrides } from 'ag-grid-community';

export default function () {
  let _params = null;
  return {
    data() {
      return {
        modules: AllModules,
        gridOptions: null,
        gridApi: null,
        domLayout: 'autoHeight',
        defaultColDef: {
          suppressMenu: true,
          sortable: true,
          enableRowGroup: true,
          enablePivot: true,
          enableValue: true,
          filter: true,
          resizable: true,
          minWidth: 100,
        },
        template:
          '<div class="ag-cell-label-container" role="presentation">' +
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
        overlayLoadingTemplate: null,
        overlayNoRowsTemplate: null,
        loadingOverlayComponent: null,
        loadingOverlayComponentParams: {},
        noRowsOverlayComponent: null,
        noRowsOverlayComponentParams: {},
        frameworkComponents: null,
        excelStyles: null,
      };
    },
    computed: {},
    methods: {
      setGridParams(params) {
        _params = params;
      },
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },
      autoSizeAll() {
        const allColumnIds = this.gridColumnApi.getAllColumns().map((column) => column.colId);
        this.gridColumnApi.autoSizeColumns(allColumnIds, false);
      },
      enabledTooltips(columns, type = 'formatted') {
        (columns || []).forEach((column) => {
          // 컬럼에 tooltipValueGetter 설정 되어 있지 않은 경우에 설정
          if (!column.tooltipValueGetter) {
            column.tooltipValueGetter = (params) => {
              switch (type) {
                case 'formatted':
                  return params.valueFormatted || params.value;
                case 'value':
                default:
                  return params.value;
              }
            };
          }
          // 그룹화된 children 컬럼의 tooltipValueGetter 설정을 위해 재귀적 호출
          if (column.children) {
            this.enabledTooltips(column.children);
          }
        });
      },
      enabledResizingAutoFit() {
        if (this.gridApi) {
          window.addEventListener('resize', () => {
            setTimeout(() => this.gridApi.sizeColumnsToFit());
          });
        } else {
          console.error(`gridApi object is ${this.gridApi}`);
        }
      },
      numberWithCommas(num) {
        if (num !== undefined) {
          const parts = num.toString().split('.');
          return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '');
        } else {
          return ['-'];
        }
      },
      customValueFormatter(params) {
        const formatted = this.numberWithCommas(params.value);

        if (formatted.indexOf('-') === 0) {
          return '-';
        }
        return '￦' + formatted;
      },
      customNumberFilter(params) {
        let val = params.value;
        val = val.split('₩')[1];
        const formatted = this.numberWithCommas(val);
        if (formatted.indexOf('-') === 0) {
          return '-';
        }
        return '￦' + formatted;
      },
    },
    beforeMount() {
      this.frameworkComponents = {
        noRowsOverlayComponent: DataNoRow,
        loadingOverlayComponent: DataLoading,
      };
      this.noRowsOverlayComponent = 'noRowsOverlayComponent';
      this.loadingOverlayComponent = 'loadingOverlayComponent';
      this.popupParent = document.querySelector('body');
    },
    mounted() {
      this.gridApi = this.gridOptions.api;
      this.gridColumnApi = this.gridOptions.columnApi;
    },
    created() {
      this.excelStyles = [
        {
          id: 'numberType',
          numberFormat: { format: '\u20A9#,##0_);-\u20A9#,##0' },
        },
        {
          id: 'dollarType',
          numberFormat: { format: '$#,##0.000_);-$#,##0.000' },
        },
        {
          id: 'percentType',
          numberFormat: { format: '0.00%' },
        },
        {
          id: 'defaultNumberType',
          numberFormat: { format: '###0' },
        },
      ];
    },
  };
}
