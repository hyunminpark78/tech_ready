<template>
  <!-- 서비스 카테고리 -->
  <div class="box-wrap">
    <div class="title">
      <h4 class="tit-wrap">{{ $t('setting.serviceCategory') }}</h4>
    </div>
    <!-- search -->
    <div class="search2-wrap">
      <div class="tit4-wrap blue">{{ filter.contract.ctrtNm }}</div>
      <div class="flex2-wrap">
        <span class="flex-col">
          <input v-model="ctgryNm" type="text" :placeholder="$t('setting.enterServiceCategoryName')" class="keyword" />
        </span>
        <button class="btn" :disabled="isProcessing" @click="addSvcCtgry">{{ $t('setting.add') }}</button>
      </div>
    </div>
    <!-- //search -->
    <div class="svc-grp-grid" style="height: 100%; width: 100%">
      <ag-grid-vue
        id="svcGrpMgmtCtgryGrid"
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
  <!-- //서비스 카테고리 -->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import svcGrpMgmtService from '@/services/svcGrpMgmtService';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import SvcGrpDeleteBtn from '@/pages/Setting/SvcGrpMgmt/SvcGrpDeleteBtn';
// import { isEmpty } from 'loadsh';
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
      ctgryNm: '',
      selectedCtgryId: '',
      isProcessing: false,
    };
  },
  computed: {
    ...mapState('svcGrpMgmt', ['ctrt', 'filter', 'isSearch', 'isRefresh']),
  },
  watch: {
    '$i18n.locale': ['setCtgryData', 'setColumn'],
    isSearch: function (newVal, oldVal) {
      if (newVal.isSearch) {
        this.setCtgryData('INIT');
      }
    },
    isRefresh: function (newVal, oldVal) {
      if (newVal.isRefresh && newVal.type === 'CTGRY') {
        this.setCtgryData('REFRESH');
      }
    },
  },
  beforeMount() {
    this.gridOptions = {
      rowSelection: 'single',
      onRowClicked: this.onRowClicked,
      getRowNodeId: (params) => params.ctgryId,
    };
    this.frameworkComponents = {
      SvcGrpDeleteBtn: SvcGrpDeleteBtn,
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  created() {},
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.setColumn();
  },
  methods: {
    ...mapActions('svcGrpMgmt', ['setFilter', 'setCtgryFilter', 'setSvcGrpFilter']),
    getDataPath: function (data) {
      return data.orgHierarchy;
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
      if (this.rowData.length > 0) {
        this.setNodeSelected(this.selectedCtgryId);
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
    },
    onRowClicked(event) {
      this.setCtgryFilter(event.node.data);
      this.selectedCtgryId = event.node.data.ctgryId;
    },
    setNodeSelected(id) {
      const rowNode = this.gridApi.getRowNode(id);
      rowNode.setSelected(true, true);
    },
    async addSvcCtgry() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      if (!this.ctgryNm) {
        alert(this.$t('setting.enterServiceCategoryName'));
        return;
      }

      try {
        const duplicateCheck = await svcGrpMgmtService.checkDuplicateCtgryNm({
          ctrtId: this.filter.contract.ctrtId,
          ctgryNm: this.ctgryNm,
        });

        if (duplicateCheck.data.data > 0) {
          alert(this.$t('setting.serviceCategoryNameExists'));
        } else {
          const addResult = await svcGrpMgmtService.addSvcCtrgy({
            ctrtId: this.filter.contract.ctrtId,
            ctgryNm: this.ctgryNm,
          });

          if (addResult.data.code === 'SUCCESS') {
            alert(this.$t('setting.serviceCategoryAdded'));
            this.setCtgryData('INIT');
            this.ctgryNm = '';
          }
        }
      } catch (error) {
        alert(this.$t('setting.errorOccurredContact'));
      } finally {
        this.isProcessing = false;
      }
    },
    async setCtgryData(flag) {
      this.rowData = await svcGrpMgmtService.fetchSvcCtgry({ ctrtId: this.filter.contract.ctrtId }).then((res) => {
        if (res.data.data.length > 0) {
          if (flag === 'INIT') {
            this.setCtgryFilter(res.data.data[0]);
            this.selectedCtgryId = res.data.data[0].ctgryId;
          }
        } else {
          this.setCtgryFilter({});
          this.selectedCtgryId = '';
        }
        return res.data.data;
      });
    },
    async deleteSvcCtgry(params) {
      if (window.confirm(`${this.$t('setting.youSureDeleteServiceCategory')}`)) {
        await svcGrpMgmtService
          .deleteSvcCtgry({ ctgryId: params.ctgryId })
          .then((res) => {
            const data = res.data;
            if (data.code === 'SUCCESS') {
              alert(this.$t('setting.serviceCategoryDeleted'));
              this.setCtgryData('INIT');
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
          field: 'ctgryNm',
          headerName: this.$t('setting.serviceCategoryName'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          width: i18n.locale === 'ko' ? 150 : 110,
          cellClass: ['ag-grid-font', 'text-center'],
        },
        {
          field: 'svcGrpCnt',
          headerName: this.$t('setting.numberConnectedServiceGroups'),
          resizable: true,
          sortable: true,
          menuTabs: [],
          // width: 150,
          width: i18n.locale === 'ko' ? 150 : 200,
          cellClass: ['ag-grid-font', 'text-center'],
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
              this.deleteSvcCtgry(params);
            },
          },
        },
      ];
      this.defaultColDef = {
        flex: 1,
        resizable: true,
      };
    },
  },
};
</script>

<style>
.svc-grp-grid .ag-theme-alpine .ag-row-selected .ag-grid-font,
.svc-grp-grid .ag-theme-alpine .ag-row-selected .ag-grid-color-font {
  color: #4a4a4a !important;
}
.svc-grp-grid .ag-header-cell-label {
  display: flex;
  justify-content: center;
  align-items: center;
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
