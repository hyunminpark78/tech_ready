<template>
  <!-- 연결 계정 -->
  <div class="box-wrap">
    <div class="title">
      <h4 class="tit-wrap">{{ $t('setting.linkedAccount') }}</h4>
    </div>
    <!-- search -->
    <div class="search2-wrap" style="padding: 18px 20px 16px">
      <div class="tit4-wrap blue" style="width: 320px">{{ svcGrpNm }}</div>
      <div class="flex2-wrap">
        <span class="flex-col">
          <input
            v-model="searchKeyword"
            type="text"
            :placeholder="$t('common.placeholder.enterSearchTerm')"
            class="keyword type2"
          />
        </span>
        <button class="btn" style="margin-left: 0px" @click="setSvcAcctData">{{ $t('common.button.search') }}</button>
        <button class="btn" @click="mergeSvcAcnt">{{ $t('common.button.save') }}</button>
      </div>
    </div>
    <!-- //search -->
    <div class="svc-grp-grid" style="height: 100%; width: 100%">
      <ag-grid-vue
        id="svcGrpMgmtAcctGrid"
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :grid-options="gridOptions"
        :row-data="rowData"
        :row-height="rowHeight"
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
        :suppress-context-menu="true"
        :suppress-pagination-panel="true"
        :suppress-scroll-on-new-data="true"
        @first-data-rendered="onFirstDataRendered"
        @rowDataChanged="onFirstDataRendered"
        @grid-size-changed="(params) => params.api.sizeColumnsToFit()"
        @grid-ready="onGridReady"
      ></ag-grid-vue>
    </div>
  </div>
  <!-- //연결 계정 -->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import svcGrpMgmtService from '@/services/svcGrpMgmtService';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import { isEmpty } from 'loadsh';
import _ from 'lodash';

export default {
  components: { AgGridVue },
  mixins: [AgGridMixin()],
  data() {
    return {
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      frameworkComponents: null,
      modules: null,
      rowHeight: null,
      svcGrpNm: '-',
      searchKeyword: '',
      refreshYn: true,
    };
  },
  computed: {
    ...mapState('svcGrpMgmt', ['ctrt', 'filter', 'ctgryFilter', 'svcGrpFilter']),
  },
  watch: {
    '$i18n.locale': ['setColumn', 'setSvcAcctData'],
    svcGrpFilter: function (newVal, oldVal) {
      if (!isEmpty(newVal)) {
        if (newVal.svcGrpId !== oldVal.svcGrpId) {
          this.searchKeyword = '';
          this.svcGrpNm = newVal.svcGrpNm;
          this.setSvcAcctData();
        }
      } else {
        this.svcGrpNm = '-';
        this.rowData = [];
      }
    },
  },
  created() {},
  beforeMount() {
    this.gridOptions = {
      rowSelection: 'multiple',
      suppressRowClickSelection: true, // 셀 텍스트 선택 가능
      enableCellTextSelection: true, // 셀 텍스트 선택 가능
      ensureDomOrder: true,
      isRowSelectable: (params) => {
        return !!params.data && (params.data.svcGrpId === null || params.data.svcGrpId === this.svcGrpFilter.svcGrpId);
      },
    };
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.rowHeight = 60;
    this.setColumn();
  },
  methods: {
    ...mapActions('svcGrpMgmt', ['fetchRefresh']),
    getDataPath: function (data) {
      return data.orgHierarchy;
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
      params.api.forEachNode((node) => {
        if (node.data && node.data.svcGrpId === this.svcGrpFilter.svcGrpId) {
          node.setSelected(true);
        }
      });
    },
    onGridReady(params) {
      this.gridApi = params.api;
    },
    async setSvcAcctData() {
      this.rowData = await svcGrpMgmtService
        .fetchSvcAcnt({
          ctrtId: this.filter.contract.ctrtId,
          svcGrpId: this.svcGrpFilter.svcGrpId,
          ctgryId: this.ctgryFilter.ctgryId,
          searchKeyword: this.searchKeyword,
          cspTypCd: this.filter.contract.cspTypCd,
        })
        .then((res) => {
          return res.data.data;
        });
    },
    async mergeSvcAcnt() {
      let params = {};
      let svcGrpAcntList = [];
      let selectedRows = this.gridApi.getSelectedRows();
      selectedRows.forEach((row) => {
        row.svcGrpId = this.svcGrpFilter.svcGrpId;
        svcGrpAcntList.push(row);
      });
      params.svcGrpAcntList = _.cloneDeep(svcGrpAcntList);
      params.svcGrpId = this.svcGrpFilter.svcGrpId;
      await svcGrpMgmtService
        .mergeSvcAcnt(params)
        .then((res) => {
          const data = res.data;
          if (data.code === 'SUCCESS') {
            alert(this.$t('setting.connectionAccountSaved'));
            this.searchKeyword = '';
            this.onRefresh();
            this.setSvcAcctData();
          }
        })
        .catch((error) => {
          alert(this.$t('setting.errorOccurredContact'));
        });
    },
    setColumn() {
      this.columnDefs = [
        {
          field: 'acntId',
          headerName: this.$t('setting.accountName'),
          resizable: true,
          sortable: true,
          checkboxSelection: true,
          menuTabs: [],
          width: 230,
          cellClass: ['ag-grid-font', 'text-left'],
          cellRenderer: (params) => {
            if (params.value) {
              return `${params.data.acntNm}<br/>(${params.value})`;
            } else {
              return '-';
            }
          },
        },
        {
          field: 'svcGrpNm',
          headerName: this.$t('setting.connectionGroupName'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          width: 130,
          cellClass: ['ag-grid-font', 'text-center'],
          valueFormatter: (params) => params.value || this.$t('setting.unclassified'),
        },
      ];
      this.defaultColDef = {
        flex: 1,
        resizable: true,
      };
    },
    onRefresh() {
      this.refreshYn = true;
      this.initRefresh();
    },
    initRefresh() {
      this.fetchRefresh({ isRefresh: { type: 'SVCGRP', isRefresh: this.refreshYn } });
      this.refreshYn = false;
    },
  },
};
</script>

<style>
.svc-grp-grid .ag-header-cell-label {
  display: flex;
  justify-content: center;
  align-items: center;
}
.svc-grp-grid .ag-theme-alpine .ag-row-selected .ag-grid-font,
.svc-grp-grid .ag-theme-alpine .ag-row-selected .ag-grid-color-font {
  color: #4a4a4a !important;
}
.svc-grp-grid .ag-theme-alpine .ag-row-selected {
  background-color: #eefaff !important;
}
.svc-grp-grid .ag-theme-alpine .ag-layout-auto-height .ag-center-cols-clipper,
.svc-grp-grid .ag-theme-alpine .ag-layout-auto-height .ag-center-cols-container,
.svc-grp-grid .ag-theme-alpine .ag-layout-print .ag-center-cols-clipper,
.svc-grp-grid .ag-theme-alpine .ag-layout-print .ag-center-cols-container {
  min-height: 550px !important;
}
.svc-grp-grid .ag-cell-value {
  line-height: 1.2;
  white-space: normal;
  overflow: visible;
  display: flex;
  justify-content: center;
  align-items: center;
}
.svc-grp-grid .ag-grid-font {
  font-style: normal !important;
  font-size: 13px !important;
}
.svc-grp-grid .ag-body-viewport {
  max-height: 650px !important;
  min-height: 650px !important;
  overflow-y: auto !important;
}
.svc-grp-grid .ag-body-horizontal-scroll {
  display: none !important;
}
.svc-grp-grid .ag-invisible {
  visibility: visible !important;
}
.svc-grp-grid .ag-invisible div div input[type='checkbox'] {
  background-color: #52525245;
  opacity: 100 !important;
}
</style>
