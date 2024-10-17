<template>
  <!-- 서비스 그룹 -->
  <div class="box-wrap">
    <div class="title">
      <h4 class="tit-wrap">{{ $t('setting.serviceGroup') }}</h4>
    </div>
    <!-- search -->
    <div class="search2-wrap">
      <div class="tit4-wrap blue">{{ ctgryNm }}</div>
      <div class="flex2-wrap">
        <span class="flex-col">
          <input v-model="svcGrpNm" type="text" :placeholder="$t('setting.enterServiceGroupName')" class="keyword" />
        </span>
        <button class="btn" :disabled="isProcessing" @click="addSvcGrp">{{ $t('setting.add') }}</button>
      </div>
    </div>
    <!-- //search -->
    <div class="svc-grp-grid" style="height: 100%; width: 100%">
      <ag-grid-vue
        id="svcGrpMgmtGrpGrid"
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
  <!-- //서비스 그룹 -->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import { isEmpty } from 'loadsh';
import svcGrpMgmtService from '@/services/svcGrpMgmtService';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import SvcGrpDeleteBtn from '@/pages/Setting/SvcGrpMgmt/SvcGrpDeleteBtn';
import { i18n } from '../../../../public/locales/i18n';

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
      ctgryNm: '-',
      svcGrpNm: '',
      refreshYn: true,
      selectedSvcGrpId: '',
      isProcessing: false,
    };
  },
  computed: {
    ...mapState('svcGrpMgmt', ['ctrt', 'filter', 'ctgryFilter', 'isRefresh']),
  },
  watch: {
    '$i18n.locale': ['setColumn', 'setSvcGrpData'],
    ctgryFilter: function (newVal, oldVal) {
      if (!isEmpty(newVal)) {
        if (newVal.ctgryId !== oldVal.ctgryId) {
          this.ctgryNm = newVal.ctgryNm;
          this.setSvcGrpData('INIT');
        }
      } else {
        this.ctgryNm = '-';
        this.rowData = [];
        this.setSvcGrpFilter({});
        this.selectedSvcGrpId = '';
      }
    },
    isRefresh: function (newVal, oldVal) {
      if (newVal.isRefresh && newVal.type === 'SVCGRP') {
        this.setSvcGrpData('REFRESH');
      }
    },
  },
  created() {},
  beforeMount() {
    this.gridOptions = {
      rowSelection: 'single',
      onRowClicked: this.onRowClicked,
      getRowNodeId: (params) => params.svcGrpId,
    };
    this.frameworkComponents = {
      SvcGrpDeleteBtn: SvcGrpDeleteBtn,
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.setColumn();
  },
  methods: {
    ...mapActions('svcGrpMgmt', ['setFilter', 'fetchRefresh', 'setSvcGrpFilter']),
    getDataPath: function (data) {
      return data.orgHierarchy;
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
      if (this.rowData.length > 0) {
        this.setNodeSelected(this.selectedSvcGrpId);
      }
    },
    setNodeSelected(id) {
      const rowNode = this.gridApi.getRowNode(id);
      rowNode.setSelected(true, true);
    },
    onGridReady(params) {
      this.gridApi = params.api;
    },
    onRowClicked(event) {
      this.setSvcGrpFilter(event.node.data);
      this.selectedSvcGrpId = event.node.data.svcGrpId;
    },
    async setSvcGrpData(flag) {
      this.rowData = await svcGrpMgmtService
        .fetchSvcGrp({
          ctrtId: this.filter.contract.ctrtId,
          ctgryId: this.ctgryFilter.ctgryId,
          cspTypCd: this.filter.contract.cspTypCd,
        })
        .then((res) => {
          if (res.data.data.length > 0) {
            if (flag === 'INIT') {
              this.setSvcGrpFilter(res.data.data[0]);
              this.selectedSvcGrpId = res.data.data[0].svcGrpId;
            }
          } else {
            this.setSvcGrpFilter({});
            this.selectedSvcGrpId = '';
          }
          return res.data.data;
        });
    },
    async addSvcGrp() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      if (!this.svcGrpNm) {
        alert(this.$t('setting.enterServiceGroupName'));
        return;
      }
      try {
        const duplicateCheck = await svcGrpMgmtService.checkDuplicateGrpNm({
          ctgryId: this.ctgryFilter.ctgryId,
          svcGrpNm: this.svcGrpNm,
        });

        if (duplicateCheck.data.data > 0) {
          alert(this.$t('setting.serviceGroupNameExists'));
        } else {
          let param = {};
          param.ctgryId = this.ctgryFilter.ctgryId;
          param.svcGrpNm = this.svcGrpNm;
          const addResult = await svcGrpMgmtService.addSvcGrp(param);

          if (addResult.data.code === 'SUCCESS') {
            alert(this.$t('setting.serviceGroupAdded'));
            this.svcGrpNm = '';
            this.onRefresh();
            this.setSvcGrpData('INIT');
          }
        }
      } catch (error) {
        alert(this.$t('setting.errorOccurredContact'));
      } finally {
        this.isProcessing = false;
      }
    },
    async deleteSvcGrp(params) {
      if (window.confirm(`${this.$t('setting.youSureDeleteServiceGroup')}`)) {
        await svcGrpMgmtService
          .deleteSvcGrp({ svcGrpId: params.svcGrpId })
          .then((res) => {
            const data = res.data;
            if (data.code === 'SUCCESS') {
              alert(this.$t('setting.serviceGroupDeleted'));
              this.onRefresh();
              this.setSvcGrpData('INIT');
            }
          })
          .catch((error) => {
            alert(this.$t('setting.errorOccurredContact'));
          });
      }
    },
    setColumn() {
      this.columnDefs = [
        {
          field: 'svcGrpNm',
          headerName: this.$t('setting.serviceGroupName'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          width: i18n.locale === 'ko' ? 150 : 110,
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'svcAcntCnt',
          headerName: this.$t('setting.numberLinkedAccounts'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          width: i18n.locale === 'ko' ? 150 : 200,
          cellClass: ['ag-grid-font', 'text-center'],
          valueFormatter: (params) => `${params.value}/${params.data.svcAcntTotCnt}` || '-',
        },
        {
          field: 'setting',
          headerName: this.$t('setting.management'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          width: i18n.locale === 'ko' ? 70 : 140,
          cellClass: ['ag-grid-font', 'text-center'],
          cellRenderer: 'SvcGrpDeleteBtn',
          cellRendererParams: {
            clicked: (params) => {
              this.deleteSvcGrp(params);
            },
          },
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
      this.fetchRefresh({ isRefresh: { type: 'CTGRY', isRefresh: this.refreshYn } });
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
.svc-grp-grid .ag-body-viewport {
  max-height: 650px !important;
  min-height: 650px !important;
  overflow-y: auto !important;
}
.svc-grp-grid .ag-grid-font {
  font-style: normal !important;
  font-size: 13px !important;
}
.svc-grp-grid .ag-body-horizontal-scroll {
  display: none !important;
}
</style>
