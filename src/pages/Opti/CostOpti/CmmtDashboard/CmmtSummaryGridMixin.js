import { numberProcess } from '../CmmtPsblTgt/CostOptiCommon';

export default {
  data() {
    return {
      cspTypCd: null,
      gridColumns: {},
    };
  },
  watch: {
    '$i18n.locale': 'setGridColumns',
  },
  created() {
    this.setGridColumns();
  },
  methods: {
    setGridColumns() {
      this.gridColumns = {
        AWS: [
          {
            field: 'prodNm',
            headerName: this.$t('optimization.service'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['header-merge', 'text-center'],
            cellClass: ['ag-grid-font', 'text-center', 'vetical-align'],
            tooltipValueGetter: function (params) {
              return params.value;
            },
          },
          {
            field: 'rate',
            headerName: this.$t('optimization.costStructureType'),
            menuTabs: [],
            resizable: true,
            minWidth: 180,
            headerClass: ['header-merge', 'text-center'],
            cellClass: ['ag-grid-font', 'text-center'],
            cellRenderer: (params) => {
              const spCvrgRt = numberProcess(params.data.spCvrgRt);
              const riCvrgRt = numberProcess(params.data.riCvrgRt);
              // const onDmndCvrgRt = numberProcess(params.data.onDmndCvrgRt);

              // 100 - spCvrgRt - riCvrgRt + 1 -> 미묘하게 1px 공백이 발생하여 +1를 추가.
              let onDmmdRt = 100 - spCvrgRt - riCvrgRt;
              onDmmdRt += onDmmdRt > 0 ? 1 : 0;

              return `
              <div class="percent-bar">
                <div class="percent-fill" style="--percent:${spCvrgRt}%;--fill-color:#2cc2fd"></div>
                <div class="percent-fill" style="--percent:${riCvrgRt}%;--fill-color:#1ae3bb"></div>
                <div class="percent-fill" style="--percent:${onDmmdRt}%;--fill-color:lightgray"></div>
              </div>
            `;
            },
            tooltipValueGetter: this.percentBarTooltip,
          },
          {
            headerName: this.$t('optimization.costByType'),
            headerClass: ['ag-grid-font', 'text-center'],
            children: [
              {
                field: 'spOnDmndCostEqvlnt',
                headerName: this.$t('optimization.spOnDemandCost'),
                headerComponentParams: {
                  template:
                    '<div class="ag-cell-label-container" role="presentation">' +
                    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                    `    <span class="ag-header-cell-text text-center">${this.$t(
                      'optimization.spOnDemandCost'
                    )}<br />(${this.$t('optimization.percentageTotalCost')})</span>` +
                    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                    '  </div>' +
                    '</div>',
                },
                menuTabs: [],
                resizable: true,
                sortable: true,
                type: 'numericColumn',
                headerClass: ['multiline-header', 'text-center'],
                cellClass: ['ag-grid-font', 'text-right', 'vetical-align', 'numberType'],
                cellRenderer: (params) => {
                  const spOnDmndCostEqvlnt = this.numberWithCurcyUnit(params.data.spOnDmndCostEqvlnt);
                  const spCvrgRt = numberProcess(params.data.spCvrgRt);

                  if (spOnDmndCostEqvlnt === '₩0') {
                    return `
                    <div class="outDiv">
                      <div class="param-text"><span>-</span></div>
                    </div>
                  `;
                  }
                  return `
                  <div class="outDiv">
                    <div class="param-text"><span>${spOnDmndCostEqvlnt}<p style="color: gray">(${spCvrgRt}%)</p></span></div>
                  </div>
                `;
                },
              },
              {
                field: 'spCvrgRt',
                headerName: `${this.$t('optimization.spOnDemandCost')} (%)`,
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['text-right', 'percentType'],
                valueGetter: (params) =>
                  `${params.data.spCvrgRt === 0 ? 0 : numberProcess(params.data.spCvrgRt) / 100}`,
                hide: true,
              },
              {
                field: 'riOnDmndCostEqvlnt',
                headerName: this.$t('optimization.rIOnDemand'),
                headerComponentParams: {
                  template:
                    '<div class="ag-cell-label-container" role="presentation">' +
                    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                    `    <span class="ag-header-cell-text text-center">${this.$t('optimization.rIOnDemandCost')}<br />
                        (${this.$t('optimization.percentageTotalCost')})</span>` +
                    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                    '  </div>' +
                    '</div>',
                },
                menuTabs: [],
                resizable: true,
                sortable: true,
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['ag-grid-font', 'text-right', 'vetical-align', 'numberType'],
                valueFormatter: (params) => {
                  return numberProcess(params.data.riCvrgRt);
                },
                cellRenderer: (params) => {
                  const riOnDmndCostEqvlnt = this.numberWithCurcyUnit(params.data.riOnDmndCostEqvlnt);
                  const riCvrgRt = numberProcess(params.data.riCvrgRt);

                  if (riOnDmndCostEqvlnt === '₩0') {
                    return `
                    <div class="outDiv">
                      <div class="param-text"><span>-</span></div>
                    </div>
                  `;
                  }
                  return `
                  <div class="outDiv">
                    <div class="param-text"><span>${riOnDmndCostEqvlnt}<p style="color: gray">(${riCvrgRt}%)</p></span></div>
                  </div>
                `;
                },
              },
              {
                field: 'riCvrgRt',
                headerName: `${this.$t('optimization.rIOnDemandCost')}(%)`,
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['text-right', 'percentType'],
                valueGetter: (params) =>
                  `${params.data.riCvrgRt === 0 ? 0 : numberProcess(params.data.riCvrgRt) / 100}`,
                hide: true,
              },
              {
                field: 'onDmndCost',
                headerName: this.$t('optimization.onDemandCosts'),
                headerComponentParams: {
                  template:
                    '<div class="ag-cell-label-container" role="presentation">' +
                    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                    `    <span class="ag-header-cell-text text-center">${this.$t(
                      'optimization.onDemandCosts'
                    )}<br />(${this.$t('optimization.percentageTotalCost')})</span>` +
                    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                    '  </div>' +
                    '</div>',
                },
                menuTabs: [],
                resizable: true,
                sortable: true,
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['ag-grid-font', 'text-right', 'vetical-align', 'numberType'],
                cellRenderer: (params) => {
                  const onDmndCost = this.numberWithCurcyUnit(params.data.onDmndCost);
                  const onDmndCvrgRt = numberProcess(params.data.onDmndCvrgRt);
                  const rcmdRslt = params.data.rcmdRslt;
                  const hasRcmdBtn = rcmdRslt && rcmdRslt.mnthCmmt > 0 && rcmdRslt.mnthSaveCost > 0;

                  if (onDmndCost === '₩0') {
                    return `
                    <div class="outDiv">
                      <div class="param-text"><span>-</span></div>
                    </div>
                  `;
                  }

                  // 추천 버튼
                  if (hasRcmdBtn || params.data.prodNm === '전체' || params.data.prodNm === 'All') {
                    return `
                    <div class="outDiv">
                      <div class="param-text">
                        <span>${onDmndCost}<p style="color: gray">(${onDmndCvrgRt}%)</p></span>
                      </div>
                      <a href="/opti/cost/recommend" class="rcmdBtn">${this.$t('optimization.rec')}</a>
                    </div>
                  `;
                  } else {
                    return `
                    <div class="outDiv">
                      <div class="param-text no-btn"><span>${onDmndCost}<p style="color: gray">(${onDmndCvrgRt}%)</p></span></div>
                    </div>
                  `;
                  }
                },
              },
              {
                field: 'onDmndCvrgRt',
                headerName: `${this.$t('optimization.onDemandCosts')} (%)`,
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['text-right', 'percentType'],
                valueGetter: (params) =>
                  `${params.data.onDmndCvrgRt === 0 ? 0 : numberProcess(params.data.onDmndCvrgRt) / 100}`,
                hide: true,
              },
              {
                field: 'totOnDmndCostEqvlnt',
                headerName: this.$t('optimization.totalCost'),
                menuTabs: [],
                resizable: true,
                sortable: true,
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['ag-grid-font', 'text-right', 'vetical-align', 'numberType'],
                valueFormatter: (params) => `${this.numberWithCurcyUnit(params.data.totOnDmndCostEqvlnt)}`,
              },
            ],
          },
          {
            headerName: this.$t('optimization.savingsByType'),
            headerClass: ['ag-grid-font', 'text-center'],
            children: [
              {
                field: 'spNetSaveCost',
                headerName: 'SP',
                headerComponentParams: {
                  template:
                    '<div class="ag-cell-label-container" role="presentation">' +
                    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                    `    <span class="ag-header-cell-text text-center">SP<br />(${this.$t(
                      'optimization.savingsRate'
                    )})</span>` +
                    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                    '  </div>' +
                    '</div>',
                },
                menuTabs: [],
                resizable: true,
                sortable: true,
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['ag-grid-font', 'text-right', 'vetical-align', 'numberType'],
                cellRenderer: (params) => {
                  const spNetSaveCost = this.numberWithCurcyUnit(params.data.spNetSaveCost);
                  const spNetSaveRt = numberProcess(params.data.spNetSaveRt);

                  if (spNetSaveCost === '₩0') {
                    return `
                    <div class="outDiv">
                      <div class="param-text"><span>-</span></div>
                    </div>
                  `;
                  }
                  return `
                  <div class="outDiv">
                    <div class="param-text"><span>${spNetSaveCost}<p style="color: gray">(${spNetSaveRt}%)</p></span></div>
                  </div>
                `;
                },
              },
              {
                field: 'spNetSaveRt',
                headerName: 'SP (%)',
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['text-right', 'percentType'],
                valueGetter: (params) =>
                  `${params.data.spNetSaveRt === 0 ? 0 : numberProcess(params.data.spNetSaveRt) / 100}`,
                hide: true,
              },
              {
                field: 'riNetSaveCost',
                headerName: 'RI',
                headerComponentParams: {
                  template:
                    '<div class="ag-cell-label-container" role="presentation">' +
                    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                    `    <span class="ag-header-cell-text text-center">RI<br />(${this.$t(
                      'optimization.savingsRate'
                    )})</span>` +
                    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                    '  </div>' +
                    '</div>',
                },
                menuTabs: [],
                resizable: true,
                sortable: true,
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['ag-grid-font', 'text-right', 'vetical-align', 'numberType'],
                cellRenderer: (params) => {
                  const riNetSaveCost = this.numberWithCurcyUnit(params.data.riNetSaveCost);
                  const riNetSaveRt = numberProcess(params.data.riNetSaveRt);

                  if (riNetSaveCost === '₩0') {
                    return `
                    <div class="outDiv">
                      <div class="param-text"><span>-</span></div>
                    </div>
                  `;
                  }
                  return `
                  <div class="outDiv">
                    <div class="param-text"><span>${riNetSaveCost}<p style="color: gray">(${riNetSaveRt}%)</p></span></div>
                  </div>
                `;
                },
              },
              {
                field: 'riNetSaveRt',
                headerName: 'RI (%)',
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['text-right', 'percentType'],
                valueGetter: (params) =>
                  `${params.data.riNetSaveRt === 0 ? 0 : numberProcess(params.data.riNetSaveRt) / 100}`,
                hide: true,
              },
              {
                field: 'totNetSaveCost',
                headerName: this.$t('optimization.totalSavings'),
                headerComponentParams: {
                  template:
                    '<div class="ag-cell-label-container" role="presentation">' +
                    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                    `    <span class="ag-header-cell-text text-center">${this.$t(
                      'optimization.totalSavings'
                    )}<br />(${this.$t('optimization.savingsRate')})</span>` +
                    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                    '  </div>' +
                    '</div>',
                },
                menuTabs: [],
                resizable: true,
                sortable: true,
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['ag-grid-font', 'text-right', 'vetical-align', 'numberType'],
                cellRenderer: (params) => {
                  const totNetSaveCost = this.numberWithCurcyUnit(params.data.totNetSaveCost);
                  const totNetSaveRt = numberProcess(params.data.totNetSaveRt);

                  if (totNetSaveCost === '₩0') {
                    return `
                    <div class="outDiv">
                      <div class="param-text"><span>-</span></div>
                    </div>
                  `;
                  }
                  return `
                  <div class="outDiv">
                    <div class="param-text"><span>${totNetSaveCost}<p style="color: gray">(${totNetSaveRt}%)</p></span></div>
                  </div>
                `;
                },
              },
            ],
          },
        ],
        AZURE: [
          {
            field: 'prodNm',
            headerName: this.$t('optimization.service'),
            menuTabs: [],
            resizable: true,
            sortable: true,
            headerClass: ['header-merge', 'text-center'],
            cellClass: ['ag-grid-font', 'text-center', 'vetical-align'],
            tooltipValueGetter: function (params) {
              return params.value;
            },
          },
          {
            field: 'rate',
            headerName: this.$t('optimization.costStructureType'),
            menuTabs: [],
            resizable: true,
            minWidth: 180,
            headerClass: ['header-merge', 'text-center'],
            cellClass: ['ag-grid-font', 'text-center'],
            cellRenderer: (params) => {
              const spCvrgRt = numberProcess(params.data.spCvrgRt);
              const riCvrgRt = numberProcess(params.data.riCvrgRt);
              // const onDmndCvrgRt = numberProcess(params.data.onDmndCvrgRt);

              // 100 - spCvrgRt - riCvrgRt + 1 -> 미묘하게 1px 공백이 발생하여 +1를 추가.
              let onDmmdRt = 100 - spCvrgRt - riCvrgRt;
              onDmmdRt += onDmmdRt > 0 ? 1 : 0;
              return `
              <div class="percent-bar">
                <div class="percent-fill" style="--percent:${spCvrgRt}%;--fill-color:#2cc2fd"></div>
                <div class="percent-fill" style="--percent:${riCvrgRt}%;--fill-color:#1ae3bb"></div>
                <div class="percent-fill" style="--percent:${onDmmdRt}%;--fill-color:lightgray"></div>
              </div>
            `;
            },
            tooltipValueGetter: this.percentBarTooltip,
          },
          {
            headerName: this.$t('optimization.costByType'),
            headerClass: ['ag-grid-font', 'text-center'],
            children: [
              {
                field: 'riOnDmndCostEqvlnt',
                headerName: this.$t('optimization.reservationsPayAsYouGoCosts'),
                headerComponentParams: {
                  template:
                    '<div class="ag-cell-label-container" role="presentation">' +
                    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                    `    <span class="ag-header-cell-text text-center">${this.$t(
                      'optimization.reservationsPayAsYouGoCosts'
                    )}<br />(${this.$t('optimization.percentageTotalCost')})</span>` +
                    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                    '  </div>' +
                    '</div>',
                },
                menuTabs: [],
                resizable: true,
                sortable: true,
                type: 'numericColumn',
                width: 250,
                headerClass: ['multiline-header', 'text-center'],
                cellClass: ['ag-grid-font', 'text-right', 'vetical-align', 'numberType'],
                cellRenderer: (params) => {
                  const riOnDmndCostEqvlnt = this.numberWithCurcyUnit(params.data.riOnDmndCostEqvlnt);
                  const riCvrgRt = numberProcess(params.data.riCvrgRt);

                  if (riOnDmndCostEqvlnt === '₩0') {
                    return `
                    <div class="outDiv">
                      <div class="param-text"><span>-</span></div>
                    </div>
                  `;
                  }
                  return `
                  <div class="outDiv">
                    <div class="param-text"><span>${riOnDmndCostEqvlnt}<p style="color: gray">(${riCvrgRt}%)</p></span></div>
                  </div>
                `;
                },
              },
              {
                field: 'riCvrgRt',
                headerName: `${this.$t('optimization.reservationsPayAsYouGoCosts')} (%)`,
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['text-right', 'percentType'],
                valueGetter: (params) =>
                  `${params.data.riCvrgRt === 0 ? 0 : numberProcess(params.data.riCvrgRt) / 100}`,
                hide: true,
              },
              {
                field: 'onDmndCost',
                headerName: this.$t('optimization.payAsYouGoCosts'),
                headerComponentParams: {
                  template:
                    '<div class="ag-cell-label-container" role="presentation">' +
                    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                    `    <span class="ag-header-cell-text text-center">${this.$t(
                      'optimization.payAsYouGoCosts'
                    )}<br />(${this.$t('optimization.percentageTotalCost')})</span>` +
                    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                    '  </div>' +
                    '</div>',
                },
                menuTabs: [],
                resizable: true,
                sortable: true,
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['ag-grid-font', 'text-right', 'vetical-align', 'numberType'],
                cellRenderer: (params) => {
                  const onDmndCost = this.numberWithCurcyUnit(params.data.onDmndCost);
                  const onDmndCvrgRt = numberProcess(params.data.onDmndCvrgRt);
                  const rcmdRslt = params.data.rcmdRslt;
                  const hasRcmdBtn = rcmdRslt && rcmdRslt.mnthExpctCmmtCost > 0 && rcmdRslt.mnthExpctCmmtSaveCost > 0;

                  if (onDmndCost === '₩0') {
                    return `
                    <div class="outDiv">
                      <div class="param-text"><span>-</span></div>
                    </div>
                  `;
                  }

                  if (hasRcmdBtn || params.data.prodNm === '전체' || params.data.prodNm === 'All') {
                    return `
                    <div class="outDiv">
                      <div class="param-text">
                        <span>${onDmndCost}<p style="color: gray">(${onDmndCvrgRt}%)</p></span>
                      </div>
                      <a href="/opti/cost/recommend" class="rcmdBtn">${this.$t('optimization.rec')}</a>
                    </div>
                  `;
                  } else {
                    return `
                    <div class="outDiv">
                      <div class="param-text no-btn"><span>${onDmndCost}<p style="color: gray">(${onDmndCvrgRt}%)</p></span></div>
                    </div>
                  `;
                  }
                },
              },
              {
                field: 'onDmndCvrgRt',
                headerName: `${this.$t('optimization.payAsYouGoCosts')} (%)`,
                type: 'numericColumn',
                headerClass: ['text-center'],
                cellClass: ['text-right', 'percentType'],
                valueGetter: (params) =>
                  `${params.data.onDmndCvrgRt === 0 ? 0 : numberProcess(params.data.onDmndCvrgRt) / 100}`,
                hide: true,
              },
              {
                field: 'totOnDmndCostEqvlnt',
                headerName: this.$t('optimization.totalCost'),
                menuTabs: [],
                resizable: true,
                sortable: true,
                type: 'numericColumn',
                cellClass: ['ag-grid-font', 'text-right', 'vetical-align', 'numberType'],
                valueFormatter: (params) => `${this.numberWithCurcyUnit(params.data.totOnDmndCostEqvlnt)}`,
              },
            ],
          },
          {
            field: 'totNetSaveCost',
            headerName: this.$t('optimization.totalSavings'),
            headerClass: ['header-merge', 'text-center'],
            headerComponentParams: {
              template:
                '<div class="ag-cell-label-container" role="presentation">' +
                '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                `    <span class="ag-header-cell-text text-center">${this.$t(
                  'optimization.totalSavings'
                )}<br />(${this.$t('optimization.savingsRate')})</span>` +
                '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                '  </div>' +
                '</div>',
            },
            menuTabs: [],
            resizable: true,
            sortable: true,
            type: 'numericColumn',
            cellClass: ['ag-grid-font', 'text-right', 'vetical-align', 'numberType'],
            cellRenderer: (params) => {
              const totNetSaveCost = this.numberWithCurcyUnit(params.data.totNetSaveCost);
              const totNetSaveRt = numberProcess(params.data.totNetSaveRt);

              if (totNetSaveCost === '₩0') {
                return `
                    <div class="outDiv">
                    <div class="param-text"><span>-</span></div>
                    </div>
                    `;
              }
              return `
                  <div class="outDiv">
                  <div class="param-text"><span>${totNetSaveCost}<p style="color: gray">(${totNetSaveRt}%)</p></span></div>
                  </div>
                  `;
            },
          },
        ],
      };
    },
    numberWithCurcyUnit(number) {
      const numProcessed = number ? Math.floor(Math.abs(number)).toLocaleString() : 0;
      return number >= 0 ? '₩' + numProcessed : '-₩' + numProcessed;
    },
    percentBarTooltip(params) {
      const spOnDmndCostEqvlnt = this.numberWithCurcyUnit(params.data.spOnDmndCostEqvlnt);
      const riOnDmndCostEqvlnt = this.numberWithCurcyUnit(params.data.riOnDmndCostEqvlnt);
      const onDmndCost = this.numberWithCurcyUnit(params.data.onDmndCost);

      const tot = params.data.spOnDmndCostEqvlnt + params.data.riOnDmndCostEqvlnt + params.data.onDmndCost;
      const spRt = numberProcess((100 * params.data.spOnDmndCostEqvlnt) / tot);
      const riRt = numberProcess((100 * params.data.riOnDmndCostEqvlnt) / tot);
      const onDmndRt = numberProcess((100 * params.data.onDmndCost) / tot);

      switch (this.cspTypCd) {
        case 'AWS':
          return `
      ${this.$t('optimization.spOnDemandCost')} ${spOnDmndCostEqvlnt} (${spRt}%),
      ${this.$t('optimization.rIOnDemandCost')} ${riOnDmndCostEqvlnt} (${riRt}%),
      ${this.$t('optimization.onDemandCosts')} ${onDmndCost} (${onDmndRt}%)
      `;
        case 'AZURE':
          return `
      ${this.$t('optimization.reservationsPayAsYouGoCosts')} ${riOnDmndCostEqvlnt} (${riRt}%),
      ${this.$t('optimization.payAsYouGoCosts')} ${onDmndCost} (${onDmndRt}%)
      `;
        default:
          return ``;
      }
    },
  },
};
