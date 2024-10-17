<template>
  <div class="box-wrap">
    <div class="title bb1">
      <h4 class="tit-wrap">{{ $t('setting.appUpdate') }}</h4>
    </div>
    <div class="flex items-center px-8 py-2 border-b border-primary-200">
      <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.appId') }}<br />(Application ID)</label>
      <input
        type="text"
        class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
        :placeholder="$t('setting.enterAppId')"
        :value="detail.appId"
        disabled="disabled"
      />
    </div>
    <div class="flex items-center px-8 py-2 border-b border-primary-200">
      <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.tenantId') }}<br />(Tenant ID)</label>
      <input
        type="text"
        class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
        :value="detail.tenantId"
        disabled="disabled"
      />
    </div>
    <div class="flex items-center px-8 py-2 border-b border-primary-200">
      <label class="text-sm font-bold text-primary-600 w-44"
        >{{ $t('setting.clientSecretValue') }}<br />(Client Secret - value)</label
      >
      <InputTextPwd
        v-model="detail.clientScrVal"
        :placeholder="$t('setting.enterClientSecret')"
        :disabled="isLookupSubs"
        :css="'w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded'"
      ></InputTextPwd>
    </div>
    <div class="flex items-center px-8 py-2">
      <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.remarks') }}</label>
      <input
        v-model="detail.appDesc"
        type="text"
        class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
        :placeholder="$t('setting.enterRemark')"
      />
      <button
        :disabled="appDescInvalidInput || updateProcessing"
        :class="[appDescInvalidInput || updateProcessing ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-400']"
        class="ml-2 px-2 py-2 text-sm font-bold border text-white rounded"
        style="width: 150px"
        @click="updateAppDesc()"
      >
        {{ updateProcessing ? 'Processing' : $t('setting.updateRemark') }}
      </button>
    </div>
    <div class="my-3 ml-8">
      <button
        :disabled="invalidInputs || loading"
        :class="[invalidInputs || loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-400']"
        class="px-2 py-2 text-sm font-bold border text-white rounded"
        style="width: 200px"
        @click="loadSubs()"
      >
        {{ loading ? 'Loading...' : $t('setting.loadSubscriptions') }}
      </button>

      <div v-if="subsError" class="error">{{ subsErrorMsg }}</div>
      <div v-show="viewSubsList" style="width: 900px; height: 100%; margin-top: 10px">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine notify-pop ag-custom-scroll"
          :grid-options="gridOptions"
          :row-data="subsList"
          :row-height="rowHeight"
          :column-defs="columnDefs"
          :default-col-def="defaultColDef"
          :dom-layout="domLayout"
          :modules="modules"
          :framework-components="frameworkComponents"
          :loading-overlay-component="loadingOverlayComponent"
          :loading-overlay-component-params="loadingOverlayComponentParams"
          :no-rows-overlay-component="noRowsOverlayComponent"
          :no-rows-overlay-component-params="noRowsOverlayComponentParams"
          :popup-parent="popupParent"
          :suppress-context-menu="true"
          :tooltip-show-delay="tooltipShowDelay"
          :tooltip-hide-delay="tooltipHideDelay"
          @grid-ready="onGridReady"
        ></ag-grid-vue>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import InputTextPwd from '@/components/inputs/InputTextPwd';

export default {
  name: 'AzureAcctUpdateInfo',
  components: { AgGridVue, InputTextPwd },
  mixins: [AgGridMixin()],
  props: {
    value: {
      type: Object,
      default: () => ({
        appId: '',
        tenantId: '',
        clientScrVal: '',
        appDesc: '',
        subscriptions: [],
      }),
    },
    validInputs: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      detail: { ...this.value },
      invalidInputs: true,
      subsErrorMsg: null,
      subsList: [],
      gridOptions: null,
      rowHeight: null,
      columnDefs: null,
      defaultColDef: null,
      defaultExcelExportParams: null,
      frameworkComponents: null,
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
      loading: false,
      isLookupSubs: false,
      showPassword: false,
      updateProcessing: false,
    };
  },
  computed: {
    inputType() {
      return this.showPassword ? 'text' : 'password';
    },
    subsError() {
      return this.subsErrorMsg != null;
    },
    viewSubsList() {
      return !this.loading && this.isLookupSubs && this.subsErrorMsg === null;
    },
    appDescInvalidInput() {
      return this.detail.clientScrVal != null && true && this.detail.clientScrVal !== '';
    },
  },
  watch: {
    '$i18n.locale': 'setColumn',
    detail: {
      handler(newValue) {
        this.$emit('input', { ...newValue });
        const validInputs = this.validInputs(newValue, 'ctrtId', 'appId', 'tenantId', 'clientScrVal');
        this.invalidInputs = !validInputs;
      },
      deep: true,
    },
  },
  created() {
    this.setColumn();
  },
  beforeMount() {
    this.gridOptions = {
      rowStyle: { background: 'white' },
      suppressCellSelection: true,
      suppressDragLeaveHidesColumns: true,
      defaultColDef: {
        flex: 1,
        lockPinned: true, // Don't allow pinning for this example
      },
    };
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  methods: {
    ...mapActions('azureAcctMgmt', ['setCSP', 'setUpdateInfo', 'fetchAzureAppSubsList', 'updateAzureApp']),
    async updateAppDesc() {
      this.updateProcessing = true;
      const result = await this.updateAzureApp(this.detail);
      if (result.error) {
        alert(result.error);
      } else {
        if (window.confirm(`${this.$t('setting.remarksSaved')}\r${this.$t('setting.goBackApplications')}`)) {
          this.setCSP('AZURE');
          this.$router.push(`/setting/cloudAuthMgmt`);
        }
      }
      this.updateProcessing = false;
    },
    init() {
      this.subsErrorMsg = null;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
    setColumn() {
      this.columnDefs = [
        {
          field: 'subscNm',
          headerName: this.$t('setting.subscriptionName'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 350,
          headerClass: 'text-center',
          cellClass: ['ag-grid-font', 'text-center', 'vertical-center'],
        },
        {
          field: 'subscId',
          headerName: 'Subscription ID',
          menuTabs: [],
          resizable: true,
          sortable: true,
          width: 350,
          headerClass: 'text-center',
          cellClass: ['ag-grid-font', 'text-center', 'vertical-center'],
        },
        {
          field: 'subscStat',
          headerName: this.$t('status'),
          menuTabs: [],
          resizable: true,
          sortable: true,
          // width: 150,
          headerClass: 'text-center',
          cellClass: ['ag-grid-font', 'text-center', 'vertical-center'],
          cellRenderer: (params) => {
            const status = (params.value || '').toUpperCase();
            switch (status) {
              case 'ENABLED':
                return `<span class="round-wrap blue">${status}</span>`;
              default:
                return `<span class="round-wrap gray">${status}</span>`;
            }
          },
        },
      ];
    },
    async loadSubs() {
      this.loading = true;
      this.init();
      const result = await this.fetchAzureAppSubsList(this.detail);
      if (result.error) {
        this.subsErrorMsg = result.error;
      } else {
        this.setColumn();
        this.subsList = result.data;
        this.detail.subscriptions = result.data;
        this.isLookupSubs = true;
      }
      this.loading = false;
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>
<style>
.ag-header-cell-text {
  flex: 1;
}

.round-wrap {
  padding: 0 20px;
}

.round-wrap.blue {
  color: #fff;
  background-color: #00a5ed;
}

.vertical-center {
  display: flex; /* Flexbox 레이아웃 사용 */
  flex: 1;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
}

/* 수직 스크롤바의 색상 지정 */
.ag-custom-scroll .ag-body-viewport::-webkit-scrollbar {
  width: 12px;
}

.ag-custom-scroll .ag-body-viewport::-webkit-scrollbar-track {
  background-color: #d9d9d9;
}

.ag-custom-scroll .ag-body-viewport::-webkit-scrollbar-thumb {
  background-color: #a8a8a8;
}

/* 아이콘 숨기기 */
.ag-custom-scroll .ag-body-viewport::-webkit-scrollbar-button {
  display: none;
}
</style>
<style scoped>
div.img {
  margin-bottom: 20px;
}
div.error {
  color: #fc5aa1;
  font-size: 14px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
}
</style>
