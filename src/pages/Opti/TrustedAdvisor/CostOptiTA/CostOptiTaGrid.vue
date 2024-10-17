<template>
  <div class="box-wrap">
    <div class="title">
      <!-- search -->
      <div class="tit-wrap search-wrap">
        <span class="text-sm text-primary-600"> {{ $t('optimization.inspectionType') }} </span>
        <Select
          ref="checkTypeRef"
          :data="checkTypeList"
          :div-style="checkDivStyle"
          :text-getter="(item) => item.name"
          :key-getter="(item) => item.name"
          select-class="flex items-center justify-between w-full text-sm"
          select-style="padding: 0 10px 0 16px;"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="ml-4"
          option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
          option-list-style="width: 129px; max-height: 330px; overflow-y:scroll; font-weight: normal;"
          option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
          :default-selected="0"
          @change="handleCheckTypeChange"
        />
        <input
          v-model.trim="searchKeyword"
          type="text"
          :placeholder="$t('common.placeholder.enterSearchTerm')"
          class="keyword"
          @keyup.enter="onSearch"
        />
        <a href="javascript:void(0);" class="btn" @click="onSearch">{{ $t('common.button.search') }}</a>
        <!-- tooltip -->
        <div class="tooltip-wrap" style="margin: 0 0 0 20px">
          <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
          <div class="tooltip-layer">
            <strong class="ti">{{ $t('optimization.renewalCycle') }}</strong>
            {{ $t('optimization.trustedAdvisorInspectionResults') }}
            <button class="close jsTooltipClose1">툴팁 닫기</button>
          </div>
        </div>
        <!-- //tooltip -->
      </div>
      <!-- //search -->
      <div class="pos-right">
        <button class="download" @click="excelDownload">{{ $t('common.button.downloadExcel') }}</button>
        <!--        <button class="fold jsFold1"><span>접기</span></button>-->
      </div>
    </div>
    <div style="height: 100%">
      <template v-if="!loading">
        <div class="example-wrapper ta-grid" :class="rowData === null || rowData.length === 0 ? noContentsClass : ''">
          <ag-grid-vue
            id="trustedAdvisorCostGrid"
            style="width: 100%; height: 100%"
            class="ag-theme-alpine"
            :grid-options="gridOptions"
            :row-data="rowData"
            :column-defs="columnDefs"
            :default-col-def="defaultColDef"
            :auto-group-column-def="autoGroupColumnDef"
            :dom-layout="domLayout"
            :animate-rows="true"
            :modules="modules"
            :framework-components="frameworkComponents"
            :loading-overlay-component="loadingOverlayComponent"
            :loading-overlay-component-params="loadingOverlayComponentParams"
            :no-rows-overlay-component="noRowsOverlayComponent"
            :no-rows-overlay-component-params="noRowsOverlayComponentParams"
            :popup-parent="popupParent"
            :suppress-context-menu="true"
            :auto-height="true"
            @first-data-rendered="onFirstDataRendered"
            @grid-ready="onGridReady"
          ></ag-grid-vue>
        </div>
      </template>
      <template v-else>
        <div class="relative border-t" style="height: 195px">
          <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
            <div class="mb-4 loading_rotate">
              <span class="loadingcolor"></span>
            </div>
            <div class="loading_txt">Loading...</div>
          </div>
        </div>
      </template>
    </div>
    <CostOptiTADescPop></CostOptiTADescPop>
    <div ref="dimmed" class="dimmed" style="display: none"></div>
    <UsagPopup
      v-if="usagePopupVisible"
      :visible="usagePopupVisible"
      :detail-data="detailData"
      :screen-x="screenX"
      :screen-y="screenY"
      @close="popupClose"
    ></UsagPopup>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import trustedAdvisorService from '@/services/trustedAdvisorService';
import GroupCellRenderer from '@/pages/Opti/TrustedAdvisor/CostOptiTA/GroupCellRenderer';
import moment from 'moment';
import CostOptiTADescPop from '@/pages/Opti/TrustedAdvisor/CostOptiTA/CostOptiTADescPop.vue';
import Select from '@/components/Select';
import _ from 'loadsh';
import icoDown from '@/assets/images/ico-down.svg';
import { i18n } from '../../../../../public/locales/i18n';
import Paginate from '@/components/Paginate.vue';
import UsagPopup from '@/pages/Rsrc/Usag/UsagPopup.vue';
import resourceService from '@/services/resourceService';

export default {
  components: { UsagPopup, Paginate, Select, CostOptiTADescPop, AgGridVue },
  mixins: [AgGridMixin()],
  data() {
    return {
      gridOptions: null,
      gridApi: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      domLayout: 'autoHeight',
      autoGroupColumnDef: null,
      groupDefaultExpanded: null,
      frameworkComponents: null,
      gridColumnApi: null,
      loading: false,
      resultData: [],
      searchKeyword: '',
      params: {
        chkStatCd: 'error',
        accounts: [],
        regions: [],
        svcGrps: [],
      },
      checkTypeList: {},
      checkDivStyle:
        'border-radius: 4px; border: 1px solid rgb(233, 235, 237); width: 130px; margin-left: 0.5rem; margin-right: 1rem; color:#4a4a4a',
      usagePopupVisible: false,
      detailData: {},
      chkNm: '',
      noContentsClass: 'no-content',
    };
  },
  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      enableCellTextSelection: true, // 셀 텍스트 선택 가능
      groupDefaultExpanded: 0, // 0 :닫힘, 1: 열림
      masterDetail: true,
      isRowMaster: this.isRowMaster,
      // detailRowHeight: 10,
      detailCellRendererParams: this.setDetailColumn,
      getRowHeight: this.getRowHeight,
      embedFullWidthRows: 'false', // 마스터 그리드와 가로 스크롤바 동기화
    };
    this.frameworkComponents = {
      GroupCellRenderer: GroupCellRenderer,
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  mounted() {
    if (document.querySelector('.jsFold1')) {
      const btnFolds = document.querySelectorAll('.jsFold1');
      btnFolds.forEach((btnFold) => {
        btnFold.onclick = function () {
          if (this.parentNode.parentNode.parentNode.classList.contains('closed')) {
            this.parentNode.parentNode.parentNode.classList.remove('closed');
          } else {
            this.parentNode.parentNode.parentNode.classList.add('closed');
          }
        };
      });
    }

    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.setColumn();
  },
  computed: {
    ...mapState('trustedAdvisor', ['filter', 'isSearch', 'status', 'visibleDescPop', 'selectedCustCorpIds']),
  },
  watch: {
    '$i18n.locale': 'setCheckTypeList',
    isSearch: function (newVal) {
      if (newVal.isSearch) {
        this.loading = true;
        this.setData();
      }
    },
  },
  created() {
    this.setCheckTypeList();
  },
  methods: {
    ...mapActions('trustedAdvisor', ['fetchStatus', 'fetchVisibleDescPop', 'fetchChkStatCd']),
    setCheckTypeList() {
      if (i18n.locale === 'ko') {
        this.checkTypeList = [
          { name: '조치권고', value: 'error' },
          { name: '검토권고', value: 'warning' },
          { name: '정상', value: 'ok' },
          { name: '제외항목', value: 'suppressed' },
        ];
      } else {
        this.checkTypeList = [
          { name: 'Recommendation for action', value: 'error' },
          { name: 'Review recommendation', value: 'warning' },
          { name: 'Normal', value: 'ok' },
          { name: 'Excluded items', value: 'suppressed' },
        ];
      }
    },
    isRowMaster(dataItem) {
      return dataItem ? dataItem.chkRsrcList.length > 0 : false;
    },
    async setData() {
      this.params.cmpnId = null;
      for (let i = 0; i < this.selectedCustCorpIds.length; i++) {
        this.params.cmpnId = this.selectedCustCorpIds[i].id;
        break;
      }
      this.params.accounts = this.filter.acntIdList ? this.filter.acntIdList : [];
      this.params.regions = this.filter.regionAllCheckYn ? [] : this.filter.regionList;
      if (this.filter.svcGrpList !== null && this.filter.svcGrpList.length > 0) {
        let svcList = [];
        this.filter.svcGrpList.forEach((item) => {
          svcList.push(item.acntCnt === null ? '미분류' : item.id);
        });
        this.params.svcGrps = {
          ctrtId: this.filter.svcGrpList[0].ctrtId,
          ctgryId: this.filter.svcGrpList[0].ctgryId,
          ids: svcList,
        };
      } else {
        this.params.svcGrps = null;
      }
      let tempData = [];
      try {
        await trustedAdvisorService
          .fetchData(this.params)
          .then((res) => {
            if (res.data.code === 'SUCCESS') {
              this.fetchStatus(res.data.data.summary);
              this.resultData = _.cloneDeep(res.data.data.list);
              if (res.data.data.list.length > 0) {
                // 데이터가 있는 것 부터 default
                const chkData = res.data.data.list[0];
                for (let i = 0; i < this.checkTypeList.length; i++) {
                  let checkType = this.checkTypeList[i];
                  if (checkType.value === chkData.chkStatCd) {
                    this.handleCheckTypeOnlyChange(checkType);
                    break;
                  }
                }
                tempData = _.cloneDeep(chkData.chkList);
              }
            }
          })
          .catch((e) => {
            alert('오류가 발생하였습니다. 관리자에게 문의하세요.');
          });
      } catch (e) {
        alert('오류가 발생하였습니다. 관리자에게 문의하세요.');
      } finally {
        this.searchKeyword = '';
        this.rowData = tempData;
        this.setColumn();
        this.loading = false;
      }
    },
    getDataPath: function (data) {
      return data.orgHierarchy;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.autoSizeAll();
    },
    autoSizeAll() {
      this.gridColumnApi.autoSizeAllColumns();
    },
    setDetailColumn(params) {
      let res = {};
      res.getDetailRowData = function (params) {
        params.successCallback(params.data.chkRsrcList);
      };
      let _columnDefs = Object.keys(params.data.meta).map((item) => {
        return {
          field: params.data.meta[item],
          resizable: true,
          sortable: true,
          minWidth: 100,
          menuTabs: [],
          cellClass: (params) => {
            if (params.value.replace('$', '').replace('₩', '') === params.data.expctSaveCost) {
              return ['ag-grid-font', 'text-right'];
            } else {
              return ['ag-grid-font', 'text-center', 'center-aligned-cell'];
            }
          },
          cellRenderer: (params) => {
            if (params.value === params.data.resourceId) {
              return `<a href="#" onclick="return false;" style="color: #00a5ed">` + params.value + `</a>`;
            } else {
              if (params.value.replace('$', '').replace('₩', '') === params.data.expctSaveCost) {
                return `<div class="flex items-center justify-end" style="margin-right: 0px; padding-bottom: 0px;"><img src="${icoDown}" alt="." style="margin-right: 3px;"/>${params.data.expctSaveCostKrw}</div>`;
              } else {
                return params.value;
              }
            }
          },
        };
      });
      _columnDefs = Array.concat(_columnDefs, [
        {
          field: 'svcGrpNm',
          headerName: this.$t('optimization.serviceGroup'),
          resizable: true,
          cellClass: ['ag-grid-font', 'text-center', 'center-aligned-cell'],
          sortable: true,
          minWidth: 100,
          menuTabs: [],
          valueFormatter: (params) => params.value || '-',
        },
        {
          field: 'acntNm',
          headerName: this.$t('optimization.linkedAccount'),
          resizable: true,
          cellClass: ['ag-grid-font', 'text-center', 'center-aligned-cell'],
          sortable: true,
          minWidth: 100,
          menuTabs: [],
          valueFormatter: (params) => params.value || '-',
        },
      ]);
      res.detailGridOptions = {
        enableCellTextSelection: true, // 셀 텍스트 선택 가능
        suppressCellSelection: true,
        onCellClicked: (params) => {
          this.onCellClicked(params);
        },
        columnDefs: _columnDefs,
        defaultColDef: {
          flex: 1,
        },
        onGridReady: function (params) {
          const allColumnIds = [];
          params.columnApi.getAllColumns().forEach((column) => {
            allColumnIds.push(column.getId());
          });
          params.columnApi.autoSizeColumns(allColumnIds, false);
        },
      };
      res.template = function (params) {
        return (
          '<div style="height: 100%; background-color: #F1F9FF; padding: 20px; box-sizing: border-box;">' +
          '  <div ref="eDetailGrid" style="height: 100%;"></div>' +
          '</div>'
        );
      };
      return res;
    },
    getRowHeight(params) {
      if (params.node && params.node.detail) {
        var offset = 70;
        var allDetailRowHeight = params.data.chkRsrcList.length * params.api.getSizesForCurrentTheme().rowHeight;
        var gridSizes = params.api.getSizesForCurrentTheme();
        return allDetailRowHeight + ((gridSizes && gridSizes.headerHeight) || 0) + offset;
      }
    },
    setColumn() {
      this.columnDefs = [
        {
          field: 'chkNm',
          headerName: this.$t('optimization.testResults'),
          resizable: true,
          minWidth: 600,
          width: 600,
          menuTabs: [],
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {
            suppressDoubleClickExpand: true,
            innerRenderer: 'GroupCellRenderer',
          },
          valueFormatter: (params) => params.value || '',
        },
        {
          field: 'expctSaveCostKrw',
          headerName: this.$t('optimization.estimatedMonthlySavings'),
          resizable: true,
          menuTabs: [],
          cellClass: ['ag-grid-font', 'text-center', 'center-aligned-cell'],
          valueFormatter: (params) => params.value || '',
        },
        {
          field: 'chkDtm',
          headerName: this.$t('optimization.diagnosisTime'),
          resizable: true,
          menuTabs: [],
          cellClass: ['ag-grid-font', 'text-center', 'center-aligned-cell'],
          valueFormatter: (params) => params.value || '',
        },
      ];
      this.defaultColDef = { flex: 1, width: 300 };
    },
    onSearch() {
      const keyword = this.searchKeyword === undefined ? '' : this.searchKeyword;
      // this.gridApi.expandAll();
      this.gridApi.setQuickFilter(keyword);
      // this.gridApi.forEachDetailGridInfo(function (detailGridInfo) {
      //   detailGridInfo.api.setQuickFilter(keyword);
      // });
    },
    async excelDownload() {
      if (this.rowData == null || this.rowData.length <= 0) {
        alert(this.$t('optimization.noDataExist'));
        return;
      }
      const fileNm = `TrustedAdvisor_${moment().format('YYYYMMDD')}`;
      this.params.accounts = this.filter.acntIdList ? this.filter.acntIdList : [];
      this.params.regions = this.filter.regionAllCheckYn ? [] : this.filter.regionList;
      if (this.filter.svcGrpList !== null && this.filter.svcGrpList.length > 0) {
        let svcList = [];
        this.filter.svcGrpList.forEach((item) => {
          svcList.push(item.acntCnt === null ? '미분류' : item.id);
        });
        this.params.svcGrps = {
          ctrtId: this.filter.svcGrpList[0].ctrtId,
          ctgryId: this.filter.svcGrpList[0].ctgryId,
          ids: svcList,
        };
      } else {
        this.params.svcGrps = null;
      }
      this.createDimmd();
      await trustedAdvisorService
        .downloadExcel(fileNm, this.params)
        .then((res) => {
          console.log('success');
        })
        .catch(() => {
          alert(this.$t('optimization.errorHasOccurred'));
        })
        .finally(() => {
          this.removeDimmed();
        });
    },
    handleCheckTypeChange(item, flag) {
      if (flag) {
        this.$refs.checkTypeRef.handleItemClick(item);
      }
      this.params.chkStatCd = item.value;
      this.fetchChkStatCd(item.value);
      this.loading = true;
      this.changeData();
    },
    handleCheckTypeOnlyChange(item) {
      this.$refs.checkTypeRef.handleItemClick(item);
      this.params.chkStatCd = item.value;
      this.fetchChkStatCd(item.value);
    },
    changeData() {
      this.searchKeyword = '';
      this.gridApi.setQuickFilter('');
      let tempData = [];
      this.resultData.forEach((chkData) => {
        if (this.params.chkStatCd === chkData.chkStatCd) {
          tempData = _.cloneDeep(chkData.chkList);
        }
      });
      this.rowData = tempData;
      this.setColumn();
      this.loading = false;
    },
    createDimmd() {
      this.$refs.dimmed.style.display = 'block';
    },
    removeDimmed() {
      this.$refs.dimmed.style.display = 'none';
    },
    async onCellClicked(params) {
      if (params.data.resourceId !== null && params.value !== null && params.data.resourceId === params.value) {
        const param = {
          prvrCd: 'aws',
          cmpnId: this.params.cmpnId,
          instId: params.value,
          rsrcType: params.data.rsrcTypNm,
          rgnId: params.data.regionSepCd,
          accId: params.data.acntId,
        };
        try {
          this.usagePopupVisible = false;
          this.detailData = {};
          await resourceService.fetchDetailTag(param).then((res) => {
            if (res.data.data.status === 'ok') {
              this.detailData.tags = res.data.data.data;
            } else {
              this.detailData.tags = [];
            }
          });
        } finally {
          this.detailData.id = param.instId;
          this.usagePopupVisible = true;
        }
      }
    },
    popupClose() {
      this.usagePopupVisible = false;
    },
  },
};
</script>
<style>
.ta-grid .ag-body-viewport {
  min-height: auto !important;
}
.dimmed {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
  opacity: 0.5;
  background-color: rgb(37 35 35);
}

.no-content .ag-theme-alpine .ag-layout-auto-height .ag-center-cols-clipper,
.no-content .ag-theme-alpine .ag-layout-auto-height .ag-center-cols-container,
.no-content .ag-theme-alpine .ag-layout-print .ag-center-cols-clipper,
.no-content .ag-theme-alpine .ag-layout-print .ag-center-cols-container {
  min-height: 250px !important;
}
.ta-grid .ag-header-cell-label {
  justify-content: center;
}
.ta-grid .right-aligned-cell {
  text-align: right;
}
.ta-grid .text-right .ag-cell-wrapper {
  float: right;
}
.ta-grid .center-aligned-cell .ag-cell-wrapper {
  display: inline-block;
}
</style>
