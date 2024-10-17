<template>
  <div>
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>

    <section
      class="z-30 p-8 rounded policy-content w-850"
      style="position: relative; margin-top: 220px; margin-left: -98px; width: 1450px; z-index: 105"
    >
      <div class="flex">
        <h2 class="mb-4 text-2xl text-primary-400">{{ mainTitle }}</h2>
        <div v-show="param.type === 'AzureRI'" class="tooltip-wrap mt5" style="margin-top: 7px">
          <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
          <div class="tooltip-layer pos_l">
            <strong class="ti">{{ $t('optimization.selectReservationsOption') }}</strong>
            <div class="ls">
              ・ {{ $t('optimization.periodDesc') }}<br />
              ・ {{ $t('optimization.rangeDesc') }}
            </div>
            <button class="close jsTooltipClose1">툴팁 닫기</button>
          </div>
        </div>
      </div>

      <button class="absolute top-0 right-0 close-policy-modal mt-7 mr-7" @click="cancel">
        <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
      </button>

      <div class="mb-3 flex items-center">
        <p class="text-sm text-gray-700 font-medium">
          <template v-if="param.type === 'SP' || param.type === 'RI'">
            {{ $t('optimization.spRiDesc1') }}
            <br />{{ $t('optimization.spRiDesc2') }}
          </template>
          <template v-else-if="param.type === 'AzureRI'">
            {{ $t('optimization.azureRIDesc1') }} <br />
            {{ $t('optimization.spRiDesc2') }}
          </template>
        </p>
      </div>
      <div style="height: 100%" class="bl_none">
        <div class="example-wrapper">
          <ag-grid-vue
            id="billOverViewGrid"
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
            :suppress-row-hover-highlight="true"
            :suppress-context-menu="true"
            @first-data-rendered="onFirstDataRendered"
            @grid-ready="onGridReady"
          ></ag-grid-vue>
        </div>
      </div>
      <div v-if="param.type === 'AzureRI'" class="text-right mt-1.5">
        * {{ $t('optimization.totalCostReservation') }}
      </div>
      <div class="text-center mt-5">
        <a href="#" :class="cssBtnCancel" @click="cancel">{{ $t('common.button.cancel') }}</a>
        <a href="javascript:void(0)" :class="cssBtnOK" @click="apply">{{ $t('common.button.selectionComplete') }}</a>
      </div>
      <div v-show="param.type === 'AzureRI'" style="position: absolute; top: 145px; left: 200px">
        <div class="tooltip-wrap mt5">
          <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
          <div class="tooltip-layer pos_l">
            <strong class="ti">{{ $t('optimization.range') }}</strong>
            <div class="ls">{{ $t('optimization.reservationRangeHandle') }}</div>
            <div class="ls">
              ・ {{ $t('optimization.sharedReservationDiscount') }} <br />
              ・ {{ $t('optimization.singleSubscription') }}
            </div>
            <div class="ls">{{ $t('optimization.renewYourCoverage') }}</div>
            <button class="close jsTooltipClose1">툴팁 닫기</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import { numberCutDecimal, numberProcess } from '../CmmtPsblTgt/CostOptiCommon';
import { TYPE } from './GridHeaderEnum.js';
import _ from 'lodash';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  components: { AgGridVue },
  mixins: [AgGridMixin()],
  props: {
    param: {
      type: Object,
      default: () => {},
    },
    otherOptionList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      gridApi: null,
      gridColumnApi: null,
      optionList: {},
      rowData: [],
      loading: true,
      columnDefs: [],
      frameworkComponents: null,
      title: {},
      cssBtnCancel:
        'inline-block px-6 py-1.5 text-sm text-primary-400 border rounded-sm bg-white border-primary-400 font-bold',
      cssBtnOK:
        'inline-block px-6 py-1.5 text-sm text-white border rounded-sm bg-primary-400 border-primary-400 font-bold ml-1.5',
    };
  },
  computed: {
    ...mapState('costOpti', ['recommendOption']),
    mainTitle() {
      switch (this.param.type) {
        case 'SP':
          return i18n.locale === 'ko' ? 'Savings Plans 옵션 선택' : 'Select Savings Plans option';
        case 'RI':
          return i18n.locale === 'ko' ? 'Reserved Instances 옵션 선택' : 'Select Reserved Instances option';
        case 'AzureRI':
          return i18n.locale === 'ko' ? 'Reservations 옵션 선택' : 'Select the reservations option';
        default:
          return '{{ }}';
      }
    },
  },
  watch: {
    '$i18n.locale': 'classifyByPaymentOpt',
  },
  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      onCellClicked: this.cellClick,
      rowHeight: 150, // 200
    };
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  created() {
    this.setTitle();
  },
  mounted() {
    this.classifyByPaymentOpt();

    /* tooltip */
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
    /* //tooltip */
  },
  methods: {
    ...mapActions('costOpti', ['fetchRecommend']),
    setTitle() {
      if (i18n.locale === 'ko') {
        this.title = {
          noUpfront: { name: '선결제 없음', order: 1 }, // AWS
          partialUpfront: { name: '부분 선결제', order: 2 }, // AWs
          allUpfront: { name: '전체 선결제', order: 3 }, // AWs
          shared: { name: '공유', order: 1 }, // Azure
          single: { name: '단일 구독', order: 2 }, // Azure
        };
      } else {
        this.title = {
          noUpfront: { name: 'No upfront', order: 1 }, // AWS
          partialUpfront: { name: 'Partial upfront', order: 2 }, // AWs
          allUpfront: { name: 'All upfront', order: 3 }, // AWs
          shared: { name: 'Shared', order: 1 }, // Azure
          single: { name: 'Single subscription', order: 2 }, // Azure
        };
      }
    },
    cancel() {
      this.$emit('openOptionPopUp', false);
    },
    getDataPath: function (data) {
      return data.orgHierarchy;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
    classifyByPaymentOpt() {
      const options = this.otherOptionList; //this.recommendOption.allList;
      let classifyObj;
      switch (this.param.type) {
        case 'SP':
        case 'RI':
          classifyObj = this.classifyByUpfront(options);
          break;
        case 'AzureRI':
          classifyObj = this.classifyByScope(options);
          break;
      }
      const titleSuffix = this.param.type === 'AzureRI' ? '_az' : '';
      const gridDataArray = []; //compute는 없어도 전부 표출하도록
      Object.keys(classifyObj).forEach((key) => {
        const rowItem = {};
        rowItem['title' + titleSuffix] = this.title[key].name;
        rowItem.order = this.title[key].order;
        classifyObj[key].forEach((val) => {
          let dataField;
          if (val.analTypNm) {
            // AWS SP
            dataField = `${val.analTypNm}_${val.termLen}`;
          } else if (val.offrClss) {
            // AWS RI
            dataField = `${val.offrClss}_${val.termLen}`;
          } else if (val.cmmtTerm) {
            // Azure RI
            dataField = `${val.cmmtTerm}`;
          } else {
            dataField = `_${val.termLen}`; // like RI RDS, RI ElastiCache
          }
          rowItem[dataField] = val;
        });
        gridDataArray.push(rowItem);
      });
      // Only for AWS.
      switch (this.param.type) {
        case 'SP':
        case 'RI':
          if (
            this.recommendOption.rcmdProd.cd === 'ComputeGroup' &&
            !('EC2_1yr' in gridDataArray[0]) &&
            !('EC2_3yr' in gridDataArray[0])
          ) {
            this.createEmptyOption(gridDataArray);
          }
          break;
        default:
          break;
      }

      // 누락된 항목을 추가하여 그리드 표시 갯수를 맞춤
      this.addMissingKeys(gridDataArray, ['title', 'order', titleSuffix]);

      const afterOrderData = gridDataArray.sort((a, b) => a.order - b.order);

      const headerNames = Object.keys(gridDataArray[0]);
      this.setColumn(headerNames);
      if (options.length > 0) {
        this.setGridData(afterOrderData);
      } else {
        this.setGridData([]);
      }
    },
    // Azure RI용 분류
    classifyByScope(options) {
      const shared = options.filter((opt) => opt.scopeTyp === 'Shared');
      const single = options.filter((opt) => opt.scopeTyp === 'Single');
      return {
        shared,
        single,
      };
    },
    // AWS SP/RI용 분류
    classifyByUpfront(options) {
      const allUpfront = [];
      const partialUpfront = [];
      const noUpfront = [];
      options.forEach((val) => {
        if (val.paymentOpt === 'All Upfront') {
          // 전체 선결제
          allUpfront.push(val);
        } else if (val.paymentOpt === 'Partial Upfront') {
          // 부분 선결제
          partialUpfront.push(val);
        } else if (val.paymentOpt === 'No Upfront') {
          // 선결제 없음
          noUpfront.push(val);
        }
      });

      return {
        allUpfront,
        partialUpfront,
        noUpfront,
      };
    },
    createEmptyOption(data) {
      data.forEach((option) => {
        const tempObj = _.cloneDeep(option['Compute_1yr']);

        tempObj.analTypCd = 'ESP';
        tempObj.analTypNm = 'EC2';

        tempObj.rcmdYn = 'N';
        tempObj.minCostYn = 'N';
        tempObj.mostUseYn = 'N';

        tempObj.mnthSaveCost = 0;
        tempObj.prepaymentCost = 0;
        tempObj.mnthCost = 0;
        tempObj.onDmndCost = 0;
        tempObj.rsdlOnDmndCost = 0;
        tempObj.mnthCmmt = 0;
        tempObj.exptCvrgRt = 0;
        tempObj.mnthOnDmndCost = 0;

        option['EC2_1yr'] = tempObj;
        option['EC2_1yr'].termLen = '1yr';

        option['EC2_3yr'] = _.cloneDeep(tempObj);
        option['EC2_3yr'].termLen = '3yr';
      });
    },
    setGridData(data) {
      this.rowData = data;
    },
    // 컬럼 구성
    setColumn(columnNames) {
      const targetColumns = [];
      columnNames.map((val) => {
        if (val === 'order') return;
        const columnAttr = {};
        columnAttr.field = val;
        columnAttr.headerName = TYPE[val]['name'][i18n.locale];
        columnAttr.resizable = true;
        columnAttr.menuTabs = [];
        if (val.indexOf('title') > -1) {
          columnAttr.cellClass = ['ag-grid-font', 'text-center', 'right-border-cell', 'vertical-center'];
          columnAttr.width = 300;
          columnAttr.suppressSizeToFit = true;
          columnAttr.resizable = false;
        } else {
          columnAttr.suppressHeaderMenuButton = true;
          columnAttr.sortable = false;
          columnAttr.cellClass = ['ag-grid-color-font', 'text-left', 'right-border-cell'];
          columnAttr.cellRenderer = this.cellRender;
          // columnAttr.width = 1000;
        }
        columnAttr.suppressMovable = true;
        targetColumns.push({ order: TYPE[val].order, value: columnAttr });
      });
      this.columnDefs = this.sort(targetColumns);
      this.defaultColDef = { flex: -1 };
    },
    // 항목 구성
    cellRender(params) {
      if (params.value === null) {
        return `<div>${this.$t('optimization.none')}</div>`;
      }

      const paramValue = params.value;
      const { isRcmdYn, isMinCostYn, isMostUseYn } = this.optionSelect(paramValue);
      const { checkObj } = this.recommendOption;

      const mnthSaveCost = this.mnthSaveCost(paramValue); // 월 예상 절감액
      const prepaymentCost = this.prepayment(paramValue); // 선결제 비용 (AWS)
      const mnthNetSaveRt = this.mnthNetSaveRt(paramValue); // 월 예상 절감률 (Azure)
      const mnthCost = this.mnthCost(paramValue); // 월 비용
      const checkboxId = this.makeIdByRecOption(paramValue); // 추천항목 식별자
      const selectCheckBoxId = this.makeIdByRecOption(checkObj); // 선택된 추천항목 식별자

      return `
      <div class="cell-in-text">
        <button class="w-5 mr-3">
          <img class="cell-checkbox" id="${checkboxId}" src=${require(`@/assets/images/ico-rcheck-${
        selectCheckBoxId === checkboxId ? 'on' : 'off'
      }.svg`)} alt="." />
        </button>
        ${
          isRcmdYn
            ? `<span style="position:relative;bottom:5px" class="option-highlight px-3" >${this.$t(
                'optimization.recommendation'
              )}</span>`
            : ''
        }
        ${
          isMinCostYn
            ? `<span style="position:relative;bottom:5px" class="option-highlight px-3">${this.$t(
                'optimization.lowestPrice'
              )}</span>`
            : ''
        }
        ${
          isMostUseYn
            ? `<span style="position:relative;bottom:5px" class="option-highlight px-3">${this.$t(
                'optimization.mostUsed'
              )}</span>`
            : ''
        }
          <div class="tr">
            <div class="td text-left">
            <span>${this.$t('optimization.estimatedMonthlySavings')}</span>
            <span style="float:right">₩${numberCutDecimal(mnthSaveCost)}</span>
            </div>
            ${
              this.param.type === 'SP' || this.param.type === 'RI'
                ? `<div class="td text-left">
            <span>${this.$t('optimization.prepaidExpenses')}</span>
            <span style="float:right">₩${numberCutDecimal(prepaymentCost)}</span>
            </div>`
                : ''
            }
            ${
              this.param.type === 'AzureRI'
                ? `<div class="td text-left">
              <span>${this.$t('optimization.expectedReductionRate')}</span>
              <strong style="float:right; color:#00a5ed; display: flex">
                ${numberProcess(mnthNetSaveRt, 0)}%
                <img src="${require('@/assets/images/ico-down.svg')}" alt="." class="rotate-180-"/>
              </strong>
            </div>`
                : ''
            }
            <div class="td text-left">
            <span>${this.$t('optimization.monthlyCost')}</span>
            <span style="float:right">₩${numberCutDecimal(mnthCost)}</span>
            </div>
          </div>
      <div>
      `;
    },
    // 옵션 선택
    cellClick(params) {
      const { termLen, offrClss, analTypNm, analTypCd, paymentOpt, scopeTyp, cmmtTerm } = params.value;
      const checkboxId = this.makeIdByRecOption(params.value);

      this.$emit('setParam', {
        termLen,
        offrClss,
        analTypNm,
        analTypCd,
        paymentOpt,
        scopeTyp,
        cmmtTerm,
      });

      this.checkAllBtnOff();
      this.checkBtnOn(checkboxId);
      // 라인 바운더리 변경
    },
    checkAllBtnOff() {
      const checkboxList = document.querySelectorAll('.cell-checkbox');
      checkboxList.forEach((dom) => {
        dom.src = require(`@/assets/images/ico-rcheck-off.svg`);
      });
    },
    checkBtnOn(checkboxId) {
      const clickDom = document.querySelector(`#${checkboxId}`);
      clickDom.src = require(`@/assets/images/ico-rcheck-on.svg`);
    },
    apply() {
      // const { allList } = this.recommendOption;
      const allList = this.otherOptionList;

      // this.recommendOption
      let recOption = allList.filter((val) => {
        const paymentOpt = val.paymentOpt === this.param.paymentOpt; // AWS
        const termLen = val.termLen === this.param.termLen; // AWS
        const offrClss = val.offrClss === this.param.offrClss; // AWS RI
        const analTypNm = val.analTypNm === this.param.analTypNm; // AWS SP
        const scopeTyp = val.scopeTyp === this.param.scopeTyp; // Azure RI
        const cmmtTerm = val.cmmtTerm === this.param.cmmtTerm; // Azure RI

        switch (this.param.type) {
          case 'SP':
          case 'RI':
            return termLen && offrClss && analTypNm && paymentOpt;
          case 'AzureRI':
            return scopeTyp && cmmtTerm;
          default:
            return false;
        }
      })[0];

      if (!recOption) {
        const { analTypCd, analTypNm, offrClss, paymentOpt, termLen, scopeTyp, cmmtTerm } = this.param;

        recOption = {
          rcmdYn: 'N',
          minCostYn: 'N',
          mostUseYn: 'N',
          analTypCd,
          analTypNm,
          offrClss,
          paymentOpt,
          termLen,
          scopeTyp,
          cmmtTerm,
        };
      }
      const { isRcmdYn, isMinCostYn, isMostUseYn } = this.optionSelect(recOption);

      this.$emit('setRecOption', recOption);

      if (isRcmdYn || isMinCostYn || isMostUseYn) {
        const option = isRcmdYn ? 'rcmdYn' : isMinCostYn ? 'minCostYn' : 'mostUseYn';
        this.$emit('setCurrentOption', option);
      } else {
        this.$emit('setCurrentOption', null);
      }
      this.cancel();
    },
    // 월 예상 절감액
    mnthSaveCost(paramValue) {
      const awsSpRiExpr = () => paramValue.mnthSaveCost;
      const azureRiExpr = () => paramValue.mnthExpctCmmtSaveCost;

      switch (this.param.type) {
        case 'SP':
        case 'RI':
          return awsSpRiExpr();
        case 'AzureRI':
          return azureRiExpr();
      }
    },
    // 선결제 비용(for AWS)
    prepayment(paramValue) {
      // AWS
      const awsSpRiExpr = () => {
        const pymentType = paramValue.paymentOpt;
        const ctrtYear = parseInt(paramValue.termLen.split('')[0]);
        const mnthCmmt = paramValue.mnthCmmt;

        switch (pymentType) {
          case 'No Upfront':
            return 0;
          case 'Partial Upfront':
            return (mnthCmmt * 12 * ctrtYear) / 2;
          case 'All Upfront':
            return mnthCmmt * 12 * ctrtYear;
        }
      };

      const azureRiExpr = () => {
        // Azure RI는 '선결제비용'이 아닌 '절감률'을 표시
        return 0;
      };

      switch (this.param.type) {
        case 'SP':
        case 'RI':
          return awsSpRiExpr();
        case 'AzureRI':
          return azureRiExpr();
      }
    },
    // 월 예상 절감률 (for Azure)
    mnthNetSaveRt(paramValue) {
      const awsSpRiExpr = () => 0; // 표시하지 않음.
      const azureRiExpr = () => (paramValue.mnthExpctCmmtSaveCost / paramValue.mnthOnDmndCost) * 100;
      switch (this.param.type) {
        case 'SP':
        case 'RI':
          return awsSpRiExpr();
        case 'AzureRI':
          return azureRiExpr();
      }
    },
    // 월 비용
    mnthCost(paramValue) {
      // for AWS SP or RI
      const awsSpRiExpr = () => {
        const pymentType = paramValue.paymentOpt;
        const mnthCmmt = paramValue.mnthCmmt;

        switch (pymentType) {
          case 'No Upfront':
            return mnthCmmt;
          case 'Partial Upfront':
            return mnthCmmt / 2;
          case 'All Upfront':
            return 0;
        }
      };
      // for Azure RI
      const azureRiExpr = () => {
        // 추후 조건식이 필요한 경우를 대비
        return paramValue.mnthExpctTotCost;
      };

      switch (this.param.type) {
        case 'SP':
        case 'RI':
          return awsSpRiExpr();
        case 'AzureRI':
          return azureRiExpr();
      }
    },
    sort(targetHeaders) {
      return targetHeaders.sort((a, b) => a.order - b.order).map((item) => item.value);
    },
    makeIdByRecOption(paramValue) {
      // for AWS SP or RI
      const awsSpRiExpr = () => {
        const { paymentOpt, analTypNm, offrClss, termLen } = paramValue;
        return `${analTypNm ? analTypNm : offrClss}_${termLen}_${paymentOpt.split(' ').join('')}`;
      };
      // for Azure RI
      const azureRiExpr = () => {
        const { scopeTyp, cmmtTerm } = paramValue;
        return `${scopeTyp}_${cmmtTerm}`;
      };

      switch (this.param.type) {
        case 'SP':
        case 'RI':
          return awsSpRiExpr();
        case 'AzureRI':
          return azureRiExpr();
      }
    },
    optionSelect(recOption) {
      const { rcmdYn, minCostYn, mostUseYn } = recOption;
      const isRcmdYn = rcmdYn === 'Y';
      const isMinCostYn = minCostYn === 'Y';
      const isMostUseYn = mostUseYn === 'Y';

      return { isRcmdYn: isRcmdYn, isMinCostYn: isMinCostYn, isMostUseYn: isMostUseYn };
    },
    addMissingKeys(items, excludedKeys = []) {
      // 모든 배열에서 필요한 키를 찾아서 모아 놓음
      const requiredKeys = items.reduce((keys, item) => {
        Object.keys(item).forEach((key) => {
          if (!excludedKeys.includes(key) && !keys.includes(key)) {
            keys.push(key);
          }
        });
        return keys;
      }, []);

      // 모든 배열을 순회하면서 필요한 키를 추가하고 값을 null로 할당
      items.forEach((item) => {
        requiredKeys.forEach((key) => {
          if (!(key in item)) {
            item[key] = null;
          }
        });
      });
      return items;
    },
  },
};
</script>

<style>
.right-border-cell {
  border-right: 0.1px solid gray !important;
  border-bottom: 0.1px solid gray !important;
}
.vertical-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.cell-in-text {
  font-size: 14px;
}
.cell-in-text .tr {
  margin: -19px 0 0 0;
}
.ag-cell-focus {
  --ag-range-selection-border-color: transparent !important;
}
.option-highlight {
  background: #00a5ed;
  font-weight: 700;
  color: white;
}

.ag-theme-alpine {
  border-radius: 0;
}

.ag-header-cell-sorted-none {
  display: flex;
}

.ag-header-cell-label {
  justify-content: center;
}
</style>
