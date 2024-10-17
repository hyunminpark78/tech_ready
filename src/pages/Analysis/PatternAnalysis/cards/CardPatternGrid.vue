<template>
  <div>
    <template v-if="aiPatternTab.length !== 0">
      <div class="bg-white border rounded-lg border-primary-200 dashboard-card">
        <RadioGroup
          ref="radioGroup"
          class="flex overflow-hidden border-t border-b rounded-tl-lg rounded-tr-lg border-primary-200 tab-one"
          :active-classes="['clicked']"
          @change="$console.log"
        >
          <template v-if="aiPatternTab.length !== 0">
            <button
              v-for="(item, index) in aiPatternTab"
              :key="item.topRnk"
              :class="
                index === aiPatternTab.length - 1
                  ? 'w-1/5 py-5 text-gray-600 bg-white'
                  : 'w-1/5 py-5 text-gray-600 border-r bg-white'
              "
              @click="() => tabChange(item.cspPrdtCd)"
            >
              TOP{{ item.topRnk }}.<br />
              <div class="tab-text">{{ item.cspPrdtCd }}</div>
            </button>
          </template>
        </RadioGroup>

        <div v-show="aiPatternDetail.length > 0 && aiPatternTabList.diffRate !== undefined" class="px-8 py-7">
          <p v-if="i18n().locale === 'ko'" class="mb-4 text-sm text-primary-600">
            {{ aiPatternTabList.cspPrdtCd }}상품은 과거 패턴과 비교해보니
            <span class="text-secondary">{{ aiPatternTabList.diffRate }}% 청구 비용 변화가 감지</span>되었습니다.<br />
            {{ thisMonth }} 비용이

            <span v-if="high.length === 0 && low.length !== 0" class="text-secondary"
              >실제 {{ beforeMonth }}

              <template v-for="(lowValue, lowIdx) in low"
                >{{ lowValue }}<template v-if="low.length - 1 !== lowIdx">, </template></template
              >비용보다 낮습니다.</span
            >
            <span v-if="low.length === 0 && high.length !== 0" class="text-secondary"
              >실제
              <template v-for="(highValue, highIdx) in high"
                >{{ highValue }}<template v-if="high.length - 1 !== highIdx">, </template></template
              >비용보다 높습니다.</span
            >
            <span v-if="low.length >= 1 && high.length >= 1" class="text-secondary"
              >실제
              <template v-for="item in high"
                >{{ item }}<template v-if="high.length - 1 !== highIdx"></template></template
              >비용보다 높고,
              <template v-for="item2 in low">{{ item2 }}<template v-if="low.length - 1 !== lowIdx"></template></template
              >비용보다 낮습니다.
            </span>
          </p>
          <p v-if="i18n().locale === 'en'" class="mb-4 text-sm text-primary-600">
            Comparing the {{ aiPatternTabList.cspPrdtCd }} product with past patterns,
            <span class="text-secondary">a {{ aiPatternTabList.diffRate }}% change in billing costs was detected.</span
            ><br />
            Cost of {{ thisMonth }} is
            <span v-if="high.length === 0 && low.length !== 0" class="text-secondary">
              <template v-for="(lowValue, lowIdx) in low"
                >lower than the actual {{ lowValue }}<template v-if="low.length - 1 !== lowIdx">, </template></template
              >
              cost in {{ beforeMonth }}.</span
            >
            <span v-if="low.length === 0 && high.length !== 0" class="text-secondary"
              >higher than the actual
              <template v-for="(highValue, highIdx) in high"
                >{{ highValue }}<template v-if="high.length - 1 !== highIdx">,</template></template
              >
              cost.</span
            >
            <span v-if="low.length >= 1 && high.length >= 1" class="text-secondary">
              <template v-for="item in high"
                >higher than the actual {{ item
                }}<template v-if="high.length - 1 !== highIdx"> cost,</template></template
              >
              <template v-for="item2 in low"
                >lower than the actual {{ item2 }}<template v-if="low.length - 1 !== lowIdx"> cost.</template></template
              >
            </span>
          </p>
          <h3 class="font-bold">{{ $t('cost.possibleCausesChange', { value: aiPatternTabList.cspPrdtCd }) }}</h3>
        </div>
        <div v-show="aiPatternDetail.length === 0 || aiPatternTabList.diffRate === undefined" class="px-8 py-7">
          <h3 class="font-bold">{{ $t('cost.possibleCausesChange', { value: aiPatternTabList.cspPrdtCd }) }}</h3>
        </div>

        <div class="rounded-bl-lg rounded-br-lg max-h-856-">
          <ag-grid-vue
            id="AiPatternGrid"
            style="width: 100%; height: 500px"
            class="ag-theme-alpine"
            :grid-options="gridOptions"
            :row-data="rowData"
            :column-defs="columnDefs"
            :default-col-def="defaultColDef"
            :animate-rows="true"
            :modules="modules"
            :framework-components="frameworkComponents"
            :loading-overlay-component="loadingOverlayComponent"
            :loading-overlay-component-params="loadingOverlayComponentParams"
            :no-rows-overlay-component="noRowsOverlayComponent"
            :no-rows-overlay-component-params="noRowsOverlayComponentParams"
            :popup-parent="popupParent"
            :suppress-context-menu="true"
            @first-data-rendered="autoSizeAll"
            @rowDataChanged="autoSizeAll"
            @grid-ready="onGridReady"
          ></ag-grid-vue>
          <!--   :get-context-menu-items="getContextMenuItems" 상세보기 추가시 그리드 속성추가 -->
        </div>
      </div>
    </template>
    <!-- No Data -->
    <template v-else>
      <div class="p-8 mb-8 bg-white border rounded-lg border-primary-200 dashboard-card">
        <div class="flex items-center justify-between">
          <h3 class="mb-1 font-bold">청구 비용 변화의 예상 원인</h3>
        </div>
        <div class="flex flex-col items-center justify-center" style="height: 293px">
          <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
          <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
        </div>
      </div>
    </template>
    <!-- // No Data -->
  </div>
</template>

<script>
import RadioGroup from '@/components/RadioGroup.vue';
import { AgGridVue } from 'ag-grid-vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import GridButton from '@/pages/Bill/cards/GridButton';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import * as _ from 'lodash';
import moment from 'moment';
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
      gridColumnApi: null,
      gridApi: null,
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      frameworkComponents: null,
      aiPatternTabList: null,
      high: [],
      low: [],
    };
  },
  computed: {
    ...mapState('analysis', ['aiPatternTab', 'aiPatternDetail', 'aiFilter', 'aictrt']),
    thisMonth() {
      if (i18n.locale === 'ko') {
        return this.aiPatternTab.length > 0 ? moment(this.aiPatternTab[0].billYm).format('M월') : '';
      } else {
        return this.aiPatternTab.length > 0 ? moment(this.aiPatternTab[0].billYm).format('MMMM') : '';
      }
    },
    beforeMonth() {
      if (i18n.locale === 'ko') {
        return this.aiPatternTab.length > 0
          ? moment(this.aiPatternTab[0].billYm).subtract(1, 'month').format('M월')
          : '';
      } else {
        return this.aiPatternTab.length > 0
          ? moment(this.aiPatternTab[0].billYm).subtract(1, 'month').format('MMMM')
          : '';
      }
    },
  },
  watch: {
    // 다국어 변경 시 차트를 재매핑
    '$i18n.locale': 'setColumn',
    aictrt: function (newVal, oldVal) {
      if (this.contractId !== null) {
        this.fetchAiPatternTab({ ctrtId: this.contractId });
      } else {
        this.fetchAiPatternTab({ ctrtId: newVal[0].ctrtId });
      }
    },
    aiFilter: function (newVal, oldVal) {
      this.fetchAiPatternTab({ ctrtId: newVal.ctrtId });
      this.$refs.radioGroup.setActiveIndex(0);
    },
    aiPatternTab: function (newVal, oldVal) {
      if (this.aiPatternTab.length !== 0) {
        if (this.contractId != null) {
          const headerType = this.aiPatternTab[0].cspPrdtCd;
          const ctrtId = this.contractId;
          this.fetchAiPatternDetail({ ctrtId, headerType });
          this.aiPatternTabList = this.aiPatternTab[0];
          this.checkMessage();
        } else {
          const headerType = this.aiPatternTab[0].cspPrdtCd;
          const ctrtId = this.aiPatternTab[0].ctrtId;
          this.fetchAiPatternDetail({ ctrtId, headerType });

          this.aiPatternTabList = this.aiPatternTab[0];
          this.checkMessage();
        }
      }
    },
    aiPatternDetail: function (newVal, oldVal) {
      this.setData();
    },
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  beforeMount() {
    this.gridOptions = {
      onCellClicked: (params) => {
        //contextMenu 클릭
        if (params.column.colId === 'detailBtn') {
          //params.api.contextMenuFactory.showMenu(params.node, params.column, params.value, params.event);
          //this.getContextMenuItems(params);
          this.$router.push(`/bill?ctrtId=${params.node.data.ctrtId}`, () => {
            window.scrollTo(0, 0);
          });
        }
        /*     this.fetchDetail({ ctrtId: params.data.ctrtId });
        this.fetchCtrtId({ ctrtId: params.data.ctrtId }); */
      },
      suppressCellSelection: true,
    };
    this.frameworkComponents = {
      gridButton: GridButton,
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  methods: {
    i18n() {
      return i18n;
    },
    ...mapActions('analysis', ['fetchAiPatternTab', 'fetchAiPatternDetail']),
    setColumn() {
      this.columnDefs = [
        {
          field: 'ctrtId',
          hide: true,
        },
        {
          headerName: 'No.',
          field: 'no',
          menuTabs: [],
          cellClass: ['ag-grid-font', 'text-center', 'pl-32'],
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
          sortable: true,
          width: 70,
          suppressSizeToFit: true,
          resizable: true,
        },
        {
          headerName: this.$t('cost.account'),
          field: 'acntId',
          menuTabs: [],
          cellClass: ['ag-grid-font', 'text-center'],
          headerComponentParams: {
            template: this.template,
          },
          resizable: true,
        },
        {
          headerName: this.$t('cost.service'),
          field: 'cspPrdtCd',
          menuTabs: [],
          /* sortable: true, */
          cellClass: ['ag-grid-font', 'text-center'],
          headerComponentParams: {
            template: this.template,
          },
          resizable: true,
        },
        {
          headerName: this.$t('cost.region'),
          field: 'regionSepCd',
          menuTabs: [],
          /*  width: 150, */
          cellClass: ['ag-grid-font', 'text-center'],
          headerComponentParams: {
            template: this.template,
          },
          resizable: true,
        },
        {
          headerName: this.$t('cost.costOfMonth', { value: this.thisMonth }),
          field: 'curCost',
          resizable: true,
          menuTabs: [],
          /*  sortable: true, */
          /*   width: 150, */
          cellClass: ['ag-grid-font', 'text-right'],
          type: 'rightAligned',
        },

        {
          headerName: this.$t('cost.costOfMonth', { value: this.beforeMonth }),
          field: 'bfCost',
          menuTabs: [],
          /* sortable: true, */
          /*  width: 150, */
          cellClass: ['ag-grid-font', 'text-right'],
          type: 'rightAligned',
          resizable: true,
        },
        {
          headerName: this.$t('cost.avgCost'),
          field: 'avgCost',
          menuTabs: [],
          /*  sortable: true, */
          /*  width: 150, */
          cellClass: ['ag-grid-font', 'text-right'],
          type: 'rightAligned',
          resizable: true,
        },
        {
          headerName: this.$t('cost.maxCost'),
          field: 'maxCost',
          menuTabs: [],
          /* sortable: true, */
          /*  width: 150, */
          cellClass: ['ag-grid-font', 'text-right'],
          type: 'rightAligned',
          resizable: true,
        },
        {
          headerName: 'Usage type',
          field: 'usagTyp',
          menuTabs: [],
          /*  sortable: true, */
          cellClass: ['ag-grid-font', 'text-left'],
          resizable: false,
        },

        // {
        //   headerName: '상세보기',
        //   field: 'detailBtn',
        //   menuTabs: [],
        //   /*  sortable: true, */
        //   cellRenderer: () => {
        //     return `<div style="float:left">바로가기</div><div style="float:left; margin-left:5px;" class="ag-go-icon mt-2"></div>`;
        //   },
        //   cellClass: ['ag-grid-font', 'text-left', 'grid-state-end', 'ag-grid-header-font'],
        //   cellStyle: () => {
        //     return { cursor: 'pointer' };
        //   },
        //   resizable: true,
        // },

        // {
        //   headerName: '',
        //   field: 'add',
        //   menuTabs: [],
        //   width: 70,
        //   suppressSizeToFit: true,
        //   /*   sortable: true, */
        //   cellClass: ['ag-grid-font', 'text-right'],
        //   cellRenderer: 'gridButton',
        //   cellRendererParams: {
        //     clicked: (params) => {
        //       console.log(params);
        //     },
        //   },
        // },
      ];
    },
    setData() {
      this.rowData = [];
      this.setColumn();
      const data = _.cloneDeep(this.aiPatternDetail).reverse();
      if (data.length > 0) {
        data.map((v, i) => {
          this.rowData.push({
            no: data.length - i,
            acntId: v.acntId,
            avgCost: v.avgCost,
            bfCost: v.bfCost === undefined ? '$0' : v.bfCost,
            cspPrdtCd: v.cspPrdtCd,
            ctrtId: v.ctrtId,
            curCost: v.curCost,
            maxCost: v.maxCost,
            regionSepCd: v.regionSepCd,
            usagTyp: v.usagTyp,
            detailBtn: '',
          });
        });
      }
    },
    tabChange(headerType) {
      //tabClick시 해당 tabData set
      const checkIdx = this.aiPatternTab.findIndex((selectTab) => selectTab.cspPrdtCd === headerType);
      this.aiPatternTabList = this.aiPatternTab[checkIdx];
      this.checkMessage();

      if (this.aiFilter.ctrtId !== '') {
        this.fetchAiPatternDetail({ ctrtId: this.aiFilter.ctrtId, headerType });
      } else {
        this.fetchAiPatternDetail({ ctrtId: this.aictrt[0].ctrtId, headerType });
      }
    },
    checkMessage() {
      this.low = [];
      this.high = [];
      if (this.aiPatternTabList.lastCostComp === 'H') {
        // this.high.push('전월');
      } else if (this.aiPatternTabList.lastCostComp === 'L') {
        // this.low.push('전월');
      }
      if (this.aiPatternTabList.avgCostComp === 'H') {
        this.high.push('Avg');
      } else if (this.aiPatternTabList.avgCostComp === 'L') {
        this.low.push('Avg');
      }
      if (this.aiPatternTabList.maxCostComp === 'H') {
        this.high.push('Max');
      } else if (this.aiPatternTabList.maxCostComp === 'L') {
        this.low.push('Max');
      }
      console.log(this.high, 'hight');
      console.log(this.low, 'low');
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
    // getContextMenuItems(params) {
    //   var result = [
    //     {
    //       /* icon: '<img src="https://www.ag-grid.com/example-assets/skills/mac.png"/>', */
    //       name: '상세 보기',
    //       action: () => {
    //         this.$router.push(`/bill?ctrtId=${params.node.data.ctrtId}`);
    //       },
    //       cssClasses: ['redFont', 'bold'],
    //     },
    //   ];
    //   return result;
    // }
  },
};
</script>

<style scoped>
.tab-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 10px;
}
</style>
