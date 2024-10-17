import { numberProcess, chartColorByNumber } from '../CmmtPsblTgt/CostOptiCommon';

export default {
  data() {
    return {
      curCmmtTyp: 'SP',
      columnObj: {
        cvrg: {
          SP: [
            'accNmId',
            'spProdNm',
            'rgnNm',
            'instFmly',
            'cmmtCvrgRt',
            'cmmtOnDmndCostEqvlnt',
            'onDmndCost',
            'totOnDmndCostEqvlnt',
          ],
          RI: [
            'accNmId',
            'riProdNm',
            'rgnNm',
            'instTyp',
            'platform',
            'tenancy',
            'cmmtCvrgRt',
            'cmmtOnDmndCostEqvlnt',
            'onDmndCost',
            'totOnDmndCostEqvlnt',
          ],
          AzureRI: [
            'subscId', // Subscription ID
            'subscNm', // Subscription 명
            'riProdNm', // 서비스(제품)
            'rgnNm', // 리전
            'instNm', // 인스턴스명(이름)
            'instFlexGrp', // 인스턴스 유연성 그룹
            'cmmtCvrgRt', // 커버리지
            'cmmtOnDmndCostEqvlnt', // 약정 종량제 환산 비용 (예약사용종량제환산비용)
            'onDmndCost', // 종량제 비용
            'totOnDmndCostEqvlnt', // 총 비용
          ],
        },
        prch: {
          SP: [
            'spId',
            'accNmId',
            'spProdNm',
            'rgnNm',
            'instFmly',
            'paymentOpt',
            'stats',
            'exprDay',
            'strDate',
            'endDate',
            'dura',
            'cmmtAmt',
            'fixAmt',
            'chrgAmtSp',
          ],
          RI: [
            'riId',
            'accNmId',
            'rgnNm',
            'riProdNm',
            'platform',
            'instTyp',
            'prchCnt',
            'stats',
            'exprDay',
            'strDate',
            'endDate',
            'dura',
            'paymentOpt',
            'fixAmt',
            'fixAmtPerHours',
            'chrgAmt',
            'chrgAmtPerHours',
            'offrClss',
            'tenancy',
            'deplOptNm',
          ],
          AzureRI: [
            'rsrvNm', // Reservation명
            'rsrvId', // Reservation ID
            'rsrvOrdId', // Reservation Order ID
            'riProdNm', // 서비스
            'rgnNm', // 리전
            'instNm', // 인스턴스명(이름)
            'instFlexGrp', // 인스턴스 유연성 그룹
            'rsrvQty', // 예약 수량
            'stats', // 상태
            'exprDay', // 만료일자
            'purcDate', // 구입날짜
            'exprDate', // 만료날짜
            'cmmtTerm', // 약정기간
            'scopeTyp', // 범위유형
            'billFrqc', // 대금청구주기 -> 'OneTime': 선불, 'Recurring': 후불
            'upfrontCost', // 약정비용(선불)  -> rsrvAmt: billFrqc == 'OneTime'
            'postPaidCost', //약정비용(후불)  -> rsrvAmt: billFrqc == 'Recurring'
            'subscId', // Subscription ID
            'subscNm', // Subscription 명
          ],
        },
        utl: {
          SP: [
            'spId',
            'accNmId',
            'spProdNm',
            'rgnNm',
            'instFmly',
            'utlRt',
            'cmmtCost',
            'usedCmmtCost',
            'usedCmmtCostOnDmndEqvlnt',
            'netSaveCost',
          ],
          RI: [
            'riId',
            'accNmId',
            'riProdNm',
            'rgnNm',
            'instTyp',
            'platform',
            'prchCnt',
            'utlRt',
            'cmmtCost',
            'usedCmmtCost',
            'usedCmmtCostOnDmndEqvlnt',
            'netSaveCost',
          ],
          AzureRI: [
            'rsrvNm', // Reservation 명
            'rsrvId', // Reservation ID
            'rsrvOrdId', // Reservation Order ID
            'riProdNm', // 서비스(제품명)
            'rgnNm', // 리전
            'instNm', // 인스턴스명(이름)
            'instFlexGrp', // 인스턴스 유연성 그룹
            'rsrvQty', // 예약 수량
            'utlRt', // 사용률
            'cmmtCost', // 약정(비용)
            'usedCmmtCost', // 사용된 약정(비용)
            'usedCmmtCostOnDmndEqvlnt', // 종량제 환산 비용
            'netSaveCost', // 총 절감액
            'subscId', // Subscription ID
            'subscNm', // Subscription 명
          ],
        },
      },
      allColumns: {},
    };
  },
  created() {
    this.setAllColumns();
    this.enabledTooltips(this.allColumns);
  },
  watch: {
    '$i18n.locale': 'setAllColumns',
  },
  methods: {
    setCurCmmtTyp(cmmtTyp) {
      this.curCmmtTyp = cmmtTyp;
    },
    setAllColumns() {
      this.allColumns = [
        /*
          구매내역 (PRCH)
        */
        {
          field: 'spId', // for sp
          headerName: 'Savings Plans ID',
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center', 'ag-grid-header-font'],
          valueGetter: (params) => `${params.data.id}`,
        },
        {
          field: 'riId', // for ri
          headerName: 'Reserved Instance ID',
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center', 'ag-grid-header-font'],
          valueGetter: (params) => `${params.data.id}`,
        },
        {
          field: 'accNmId',
          headerName: this.$t('optimization.linkedAccount'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => `${params.data.lnkdAccNm} (${params.data.lnkdAccId})`,
        },
        {
          field: 'spProdNm',
          headerName: this.$t('optimization.purchaseType'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => params.data.prodNm,
        },
        {
          field: 'riProdNm',
          headerName: this.$t('optimization.service'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 145,
          suppressSizeToFit: true,
          skipHeaderOnAutoSize: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => params.data.prodNm,
        },
        {
          field: 'rgnNm',
          headerName: this.$t('optimization.region'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          width: 145,
          suppressSizeToFit: true,
          skipHeaderOnAutoSize: true,
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'instFmly',
          headerName: this.$t('optimization.instanceFamily'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => (!params.data.instFmly ? '-' : params.data.instFmly),
        },
        {
          field: 'instTyp',
          headerName: this.$t('optimization.instanceType'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => (!params.data.instTyp ? '-' : params.data.instTyp),
        },
        {
          field: 'platform',
          headerName: this.$t('optimization.platform'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'prchCnt',
          headerName: this.$t('optimization.numberOfRI'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'paymentOpt',
          headerName: this.$t('optimization.paymentOptions'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'stats',
          headerName: this.$t('optimization.status'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellStyle: (params) => {
            let color = '#333333';
            let status = `${params.data.stats}`;
            if (status === 'active' || status.toLowerCase() === 'succeeded') {
              color = '#1d8102';
            } else if (status === 'retired' || status === 'expired') {
              color = '#ff2d47';
            } else if (status === 'payment-pending' || status === 'payment-failed' || status === 'cancelled') {
              color = '#f5a323';
            }
            return { color: color };
          },
          valueGetter: (params) => {
            let status = `${params.data.stats}`;
            if (status === 'active' || status.toLowerCase() === 'succeeded') {
              status = 'Active';
            } else if (status === 'retired') {
              status = 'Retired';
            } else if (status === 'expired') {
              status = 'Expired';
            } else if (status === 'payment-pending') {
              status = 'Pending';
            } else if (status === 'payment-failed') {
              status = 'Failed';
            } else if (status === 'cancelled') {
              status = 'Cancelled';
            }
            return status;
          },
        },
        {
          field: 'exprDay',
          headerName: this.$t('optimization.expirationDate'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          cellStyle: (params) => {
            let color = '#333333';
            const status = `${params.data.stats}`;
            const exprDay = `${params.data.exprDay}`;
            if (status === 'active' || status.toLowerCase() === 'succeeded') {
              color = '#1d8102';
              if (exprDay <= 30) {
                color = '#ff2d47';
              } else if (exprDay <= 60) {
                color = '#f5a323';
              }
            }
            return { color: color };
          },
          valueGetter: (params) => `${params.data.exprDay} ${this.$t('optimization.days')}`,
        },
        {
          field: 'strDate',
          headerName: this.$t('optimization.startDateUTC'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => `${params.data.strDate}`.slice(0, 16),
        },
        {
          field: 'endDate',
          headerName: this.$t('optimization.endDateUTC'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => `${params.data.endDate}`.slice(0, 16),
        },
        {
          field: 'dura',
          headerName: this.$t('optimization.period'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => {
            const dura = `${params.data.dura}`;
            const year = dura / (60 * 60 * 24 * 365);
            return year >= 1
              ? `${year} ${this.$t('optimization.year')}`
              : `${year * 365} ${this.$t('optimization.days')}`;
          },
        },
        {
          field: 'cmmtAmt', // for prchSp
          headerName: this.$t('optimization.hourlyCommitment'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueFormatter: (params) => `${this.numberWithCurcyUnit(params.data.cmmtAmt)}`,
        },
        {
          field: 'fixAmt',
          headerName: this.$t('optimization.prePaidCost'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueFormatter: (params) => `${this.numberWithCurcyUnit(params.data.fixAmt)}`,
        },
        {
          field: 'fixAmtPerHours', // for prchRi
          headerName: this.$t('optimization.prePaidCostHour'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueGetter: (params) => `${params.data.fixAmt}` / (`${params.data.dura}` / 60 / 60),
          cellRenderer: (params) => {
            const val = `${params.data.fixAmt}` / (`${params.data.dura}` / 60 / 60);
            return `${this.numberWithCurcyUnit(val)}`;
          },
        },
        {
          field: 'chrgAmtSp',
          headerName: this.$t('optimization.postpaidCost'), // for prchSp
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueGetter: (params) => `${params.data.chrgAmt}`,
          cellRenderer: (params) => `${this.numberWithCurcyUnit(params.data.chrgAmt)}`,
        },
        {
          field: 'chrgAmt',
          headerName: this.$t('optimization.postpaidCost'), // for prchRi
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueGetter: (params) => `${params.data.chrgAmt}` * (`${params.data.dura}` / 60 / 60),
          cellRenderer: (params) => {
            const val = `${params.data.chrgAmt}` * (`${params.data.dura}` / 60 / 60);
            return `${this.numberWithCurcyUnit(val)}`;
          },
        },
        {
          field: 'chrgAmtPerHours',
          headerName: this.$t('optimization.postpaidCostHour'), // for prchRi
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueGetter: (params) => `${params.data.chrgAmt}`,
          valueFormatter: (params) => `${this.numberWithCurcyUnit(params.data.chrgAmt)}`,
        },
        {
          field: 'offrClss',
          headerName: this.$t('optimization.purchaseType'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'tenancy',
          headerName: this.$t('optimization.instanceTenancy'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => (!params.data.tenancy ? '-' : params.data.tenancy),
        },
        {
          field: 'deplOptNm', // for prchRi
          headerName: this.$t('optimization.multipleAvailabilityZones'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => (!params.data.deplOptNm ? '-' : params.data.deplOptNm),
        },
        /*
          사용내역 (UTL)
        */
        {
          field: 'utlRt',
          headerName: this.$t('optimization.utilization'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center', 'percentType'],
          valueGetter: (params) => `${numberProcess(params.data.utlRt) / 100}`,
          valueFormatter: (params) => `${numberProcess(params.value * 100)}%`,
        },
        {
          field: 'cmmtCost',
          headerName: this.$t('optimization.commitment'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueFormatter: (params) => `${this.numberWithCurcyUnit(params.data.cmmtCost)}`,
        },
        {
          field: 'usedCmmtCost',
          headerName: this.$t('optimization.commitmentUsed'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueFormatter: (params) => `${this.numberWithCurcyUnit(params.data.usedCmmtCost)}`,
        },
        {
          field: 'usedCmmtCostOnDmndEqvlnt',
          headerName: this.$t('optimization.onDemandConversionCost'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueFormatter: (params) => `${this.numberWithCurcyUnit(params.data.usedCmmtCostOnDmndEqvlnt)}`,
          headerValueGetter: () => {
            switch (this.curCmmtTyp) {
              case 'SP':
              case 'RI':
                return this.$t('optimization.onDemandConversionCost');
              case 'AzureRI':
                return this.$t('optimization.payAsYouGoConversionCost');
            }
          },
        },
        {
          field: 'netSaveCost',
          headerName: this.$t('optimization.totalSavings'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'cell-bg-blue', 'numberType'],
          valueFormatter: (params) => `${this.numberWithCurcyUnit(params.data.netSaveCost)}`,
        },
        /*
          커버리지내역 (CVRG)
        */
        {
          field: 'cmmtCvrgRt',
          headerName: this.$t('optimization.coverage'), // with gage bar
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 200,
          suppressSizeToFit: true,
          skipHeaderOnAutoSize: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center', 'percentType'],
          valueGetter: (params) => `${numberProcess(params.data.cmmtCvrgRt) / 100}`,
          valueFormatter: (params) => `${numberProcess(params.value * 100)}%`,
          cellRenderer: (params) => {
            const percent = numberProcess(params.value * 100);
            return `
              <div class="outDiv">
                <div class="percent-text"><span>${percent}%</span></div>
                <div class="percent-box">
                  <div class="fill" style="--percent:${percent}%;--fill-color:${chartColorByNumber(percent)}"></div>
                </div>
              </div>
            `;
          },
        },
        {
          field: 'cmmtOnDmndCostEqvlnt',
          headerName: this.$t('optimization.contractedOnDemandConversionCost'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueFormatter: (params) => `${this.numberWithCurcyUnit(params.data.cmmtOnDmndCostEqvlnt)}`,
          headerValueGetter: () => {
            switch (this.curCmmtTyp) {
              case 'SP':
              case 'RI':
                return this.$t('optimization.contractedOnDemandConversionCost');
              case 'AzureRI':
                return this.$t('optimization.contractedPayAsYouGoSystemCost');
            }
          },
        },
        {
          field: 'onDmndCost',
          headerName: this.$t('optimization.onDemandCosts'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueFormatter: (params) => `${this.numberWithCurcyUnit(params.data.onDmndCost)}`,
          headerValueGetter: () => {
            switch (this.curCmmtTyp) {
              case 'SP':
              case 'RI':
                return this.$t('optimization.onDemandCosts');
              case 'AzureRI':
                return this.$t('optimization.payAsYouGoCosts');
            }
          },
        },
        {
          field: 'totOnDmndCostEqvlnt',
          headerName: this.$t('optimization.totalCost'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'numeric',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueFormatter: (params) => `${this.numberWithCurcyUnit(params.data.totOnDmndCostEqvlnt)}`,
        },
        /**
         * Azure Reservation 항목 추가 (동일하거나 유사 항목은 위 정의된 항목 재활용)
         * */
        {
          field: 'subscId',
          headerName: 'Subscription ID',
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 200,
          suppressSizeToFit: true,
          skipHeaderOnAutoSize: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => `${params.data.acntId}`,
        },
        {
          field: 'subscNm',
          headerName: this.$t('optimization.subscriptionName'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 200,
          suppressSizeToFit: true,
          skipHeaderOnAutoSize: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => `${params.data.acntNm}`,
        },
        {
          field: 'rsrvId',
          headerName: 'Reservation ID',
          menuTabs: [],
          resizable: true,
          sortable: true,
          headerClass: ['text-center'],
          type: 'rightAligned',
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'rsrvNm',
          headerName: 'Reservation',
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          width: 200,
          suppressSizeToFit: true,
          skipHeaderOnAutoSize: true,
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'rsrvOrdId',
          headerName: 'Reservation order ID',
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'instFlexGrp',
          headerName: this.$t('optimization.instanceFlexibilityGroup'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 180,
          suppressSizeToFit: true,
          skipHeaderOnAutoSize: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'instNm',
          headerName: this.$t('optimization.name'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 195,
          suppressSizeToFit: true,
          skipHeaderOnAutoSize: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'scopeTyp',
          headerName: this.$t('optimization.range'), // 범위유형 (Shared, Single)
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'rsrvQty',
          headerName: this.$t('optimization.quantity'), // 예약수량
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center', 'defaultNumberType'],
        },
        {
          field: 'purcDate',
          headerName: this.$t('optimization.purchaseDate'), // 구매일자
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => `${params.data.purcDate}`.slice(0, 10),
        },
        {
          field: 'exprDate',
          headerName: this.$t('optimization.expirationDate'), // 만료일자
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => `${params.data.exprDate}`.slice(0, 10),
        },
        {
          field: 'cmmtTerm',
          headerName: this.$t('optimization.period'), // 약정기간
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => {
            switch (params.data.cmmtTerm) {
              case 'P1Y':
                return this.$t('optimization.oneYear');
              case 'P3Y':
                return this.$t('optimization.threeYears');
              default:
                return '-';
            }
          },
        },
        {
          field: 'billFrqc',
          headerName: this.$t('optimization.billingCycle'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-center'],
          valueGetter: (params) => {
            switch (params.data.billFrqc) {
              case 'OneTime':
                return this.$t('optimization.prepayment');
              case 'Recurring':
                return this.$t('optimization.everyMonth');
              default:
                return '-';
            }
          },
        },
        {
          field: 'upfrontCost',
          headerName: this.$t('optimization.contractCostPrepaid'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueFormatter: (params) => `${this.numberWithCurcyUnit(params.value)}`,
          valueGetter: (params) => {
            switch (params.data.billFrqc) {
              case 'OneTime':
                return params.data.cmmtAmt;
              default:
                return '-';
            }
          },
        },
        {
          field: 'postPaidCost',
          headerName: this.$t('optimization.contractCostPostpaid'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          type: 'rightAligned',
          headerClass: ['text-center'],
          cellClass: ['ag-grid-font', 'text-right', 'right-aligned-cell', 'numberType'],
          valueFormatter: (params) => `${this.numberWithCurcyUnit(params.value)}`,
          valueGetter: (params) => {
            switch (params.data.billFrqc) {
              case 'Recurring':
                return params.data.cmmtAmt;
              default:
                return '-';
            }
          },
        },
      ];
    },
  },
};
