<template>
  <!-- module -->
  <div class="box-wrap">
    <div class="title bb1">
      <h4 class="tit-wrap">{{ $t('setting.appRegistration') }}</h4>
      <p class="info">
        {{ $t('setting.createAzureApp') }}
        <br />{{ $t('setting.selectQuickRegistration') }}
      </p>
      <div class="radio-wrap">
        <label class="radio">
          <input v-model="mode" type="radio" name="mode" title="단계별 가이드" value="step" checked="checked" />
          <span class="label">{{ $t('setting.stepByStepGuide') }}</span>
        </label>
        <label class="radio">
          <input v-model="mode" type="radio" name="mode" value="quick" title="빠른 등록" />
          <span class="label">{{ $t('setting.quickRegistration') }}</span>
        </label>
      </div>
    </div>
    <template v-if="mode === 'step'">
      <div style="padding: 30px 32px 20px 75px">
        <div class="tit" style="font-weight: 700">{{ $t('setting.contractSelect') }}</div>
        <div class="detail" style="padding-top: 10px">
          <p class="txt">{{ $t('setting.selectContract') }}</p>
          <div class="">
            <div class="sort-wrap" style="width: 550px; height: 40px">
              <div class="flex mt-4" style="border-color: #00a5ed">
                <div class="relative py-1 px-3 select-one w-52">
                  <div class="text-sm text-primary-600" style="text-align: center; padding-right: 0">
                    {{ $t('setting.contract') }}
                  </div>
                  <!-- ctrt-create 추가 -->
                  <Select
                    :data="ctrtList"
                    :ctrt-create="true"
                    :text-getter="(item) => item.ctrtNm"
                    :key-getter="(item) => item.ctrtId"
                    :default-selected="detail.ctrtId ? (c) => c.ctrtId === detail.ctrtId : 0"
                    :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
                    :disabled="isLookupSubs"
                    arrow-class="ml-4"
                    select-class="flex items-center justify-between h-10-important w-full text-gray-700 font-bold"
                    option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200 w-52 top-auto-important"
                    option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
                    @click="handleCtrtChange"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- step -->
      <div class="step-wrap">
        <ol>
          <li id="step1" class="active">
            <!-- 내용 활성화 : class="active"-->
            <span class="num">1</span>
            <div class="tit">{{ $t('setting.enterEntraId') }}</div>
            <!-- detail -->
            <div class="detail">
              <p v-if="$i18n.locale === 'ko'" class="txt">
                <em><a href="https://portal.azure.com/" target="_blank">Azure 포탈</a></em
                >에 로그인 후, 메뉴에서 [Microsoft Entra ID]를 선택합니다.
              </p>
              <p v-if="$i18n.locale === 'en'" class="txt">
                Once you are logged in to
                <em><a href="https://portal.azure.com/" target="_blank">the azure portal</a></em
                >, select Microsoft Entra ID from the menu.
              </p>
              <div class="img"><img src="@/assets/images/img-azure-regist-step1.jpg" alt="Entra ID 메뉴 진입" /></div>
              <button class="btn" @click="scrollTo(1, 2)">{{ $t('setting.next') }}</button>
            </div>
            <!-- //detail -->
          </li>
          <li id="step2">
            <!-- 내용 활성화 : class="active"-->
            <span class="num">2</span>
            <div class="tit">{{ $t('setting.createNewApp') }}</div>
            <!-- detail -->
            <div class="detail">
              <p class="txt">{{ $t('setting.clickNewRegistration') }}</p>
              <div class="img">
                <img src="@/assets/images/img-azure-regist-step2-1.jpg" alt="b. 현재 실행 중인 스택이 있는 경우" />
              </div>

              <p class="txt">{{ $t('setting.clickRegisterButton') }}</p>
              <div class="img">
                <img src="@/assets/images/img-azure-regist-step2-2.jpg" alt="b. 현재 실행 중인 스택이 있는 경우" />
              </div>

              <button class="btn gray-line" @click="scrollTo(2, 1)">{{ $t('setting.before') }}</button>
              <button class="btn" @click="scrollTo(2, 3)">{{ $t('setting.next') }}</button>
            </div>
            <!-- //detail -->
          </li>
          <li id="step3">
            <!-- 내용 활성화 : class="active"-->
            <span class="num">3</span>
            <div class="tit">{{ $t('setting.checkId') }}</div>
            <!-- detail -->
            <div class="detail">
              <p class="txt">
                {{ $t('setting.findAppId') }}
              </p>
              <!-- <div class="flex items-center py-2"> -->
              <div class="img">
                <img src="@/assets/images/img-azure-regist-step3.jpg" alt="등록 정보 ID 확인" />
              </div>

              <!-- <div> -->
              <div class="flex flex-center justify-center">
                <label class="text-sm text-primary-600 w-28">{{ $t('setting.appId') }}</label>
                <input
                  v-model.trim="detail.appId"
                  type="text"
                  class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
                  :placeholder="$t('setting.enterAppId')"
                  :disabled="isLookupSubs"
                />
              </div>
              <div class="flex flex-center justify-center">
                <label class="text-sm text-primary-600 w-28">{{ $t('setting.tenantId') }}</label>
                <input
                  v-model.trim="detail.tenantId"
                  type="text"
                  class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
                  :placeholder="$t('setting.enterTenantId')"
                  :disabled="isLookupSubs"
                />
              </div>
              <!-- <button class="ico-copy ml-2" @click="copyClipboard(templateUrl)">복사</button> -->
              <!-- </div> -->
              <button class="btn gray-line" @click="scrollTo(3, 2)">{{ $t('setting.before') }}</button>
              <button class="btn" @click="scrollTo(3, 4)">{{ $t('setting.next') }}</button>
            </div>
            <!-- </div> -->
            <!-- //detail -->
          </li>
          <li id="step4">
            <!-- 내용 활성화 : class="active"-->
            <span class="num">4</span>
            <div class="tit">{{ $t('setting.apiAuth') }}</div>
            <!-- detail -->
            <div class="detail">
              <p class="txt">{{ $t('setting.apiPermission') }}</p>
              <div class="img"><img src="@/assets/images/img-azure-regist-step4-1.jpg" alt="API 권한 부여" /></div>
              <div class="img"><img src="@/assets/images/img-azure-regist-step4-2.jpg" alt="API 권한 부여" /></div>
              <button class="btn gray-line" @click="scrollTo(4, 3)">{{ $t('setting.before') }}</button>
              <button class="btn" @click="scrollTo(4, 5)">{{ $t('setting.next') }}</button>
            </div>
            <!-- //detail -->
          </li>
          <li id="step5">
            <!-- 내용 활성화 : class="active"-->
            <span class="num">5</span>
            <div class="tit">{{ $t('setting.verifyClientPassword') }}</div>
            <!-- detail -->
            <div class="detail">
              <p class="txt">{{ $t('setting.selectNewClient') }}</p>
              <div class="img">
                <img src="@/assets/images/img-azure-regist-step5-1.jpg" alt="클라이언트 암호 확인" />
              </div>

              <div class="img">
                <img src="@/assets/images/img-azure-regist-step5-2.jpg" alt="클라이언트 암호 확인" />
              </div>

              <div class="flex items-center py-2">
                <label class="text-sm text-primary-600 w-28">{{ $t('setting.clientPassword') }}</label>
                <InputTextPwd
                  v-model="detail.clientScrVal"
                  :placeholder="$t('setting.enterClientPassword')"
                  :disabled="isLookupSubs"
                  :css="'w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded'"
                ></InputTextPwd>
              </div>

              <button class="btn gray-line" @click="scrollTo(5, 4)">{{ $t('setting.before') }}</button>
              <button class="btn" @click="scrollTo(5, 6)">{{ $t('setting.next') }}</button>
            </div>
            <!-- //detail -->
          </li>
          <li id="step6">
            <!-- 내용 활성화 : class="active"-->
            <span class="num">6</span>
            <div class="tit">{{ $t('setting.grantSubscriptionAppRole') }}</div>
            <!-- detail -->
            <div class="detail">
              <p class="txt">{{ $t('setting.selectSubscriptionsMenu') }}</p>
              <div class="img">
                <img
                  src="@/assets/images/img-azure-regist-step6-1.jpg"
                  alt="전체메뉴에서 [구독](Subscriptions) 메뉴를 선택합니다."
                />
              </div>
              <p class="txt">{{ $t('setting.selectsubscriptionRole') }}</p>
              <div class="img">
                <img
                  src="@/assets/images/img-azure-regist-step6-2.jpg"
                  alt="역할을 부여할 구독을 선택한 뒤, [액세스 제어] (Access control (I AM)) 메뉴에서 [역할 할당 추가] (Add role assignment) 옵션을 선택합니다."
                />
              </div>
              <p class="txt">{{ $t('setting.selectReaderPermission') }}</p>
              <div class="img">
                <img
                  src="@/assets/images/img-azure-regist-step6-3.jpg"
                  alt="[독자] (Reader) 권한을 선택한 뒤 ‘다음’을 클릭합니다."
                />
              </div>
              <p class="txt">{{ $t('setting.searchAddApp') }}</p>
              <div class="img">
                <img
                  src="@/assets/images/img-azure-regist-step6-4.jpg"
                  alt="[구성원 선택] (Select members) 클릭 후 우측 패널에서 권한을 부여한 애플리케이션을 검색한 뒤 추가합니다."
                />
              </div>
              <p class="txt">{{ $t('setting.completeAuthRegistration') }}</p>
              <div class="img">
                <img src="@/assets/images/img-azure-regist-step6-5.jpg" alt="권한 등록을 완료합니다." />
              </div>

              <p class="txt">{{ $t('setting.repeatEachSubscription') }}</p>
              <button class="btn gray-line" @click="scrollTo(6, 5)">{{ $t('setting.before') }}</button>
              <button class="btn" @click="scrollTo(6, 7)">{{ $t('setting.next') }}</button>
            </div>
            <!-- //detail -->
          </li>
          <li id="step7">
            <!-- 내용 활성화 : class="active"-->
            <span class="num">7</span>
            <div class="tit">{{ $t('setting.checkLinkedSubscription') }}</div>
            <!-- detail -->
            <div class="detail">
              <button
                :disabled="invalidInputs || loading"
                :class="[invalidInputs || loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-400']"
                class="mt-2 px-2 py-2 text-sm font-bold border text-white rounded"
                style="width: 200px"
                @click="loadSubs()"
              >
                {{ loading ? 'Loading...' : $t('setting.loadingSubscription') }}
              </button>

              <div v-if="subsError" class="error">{{ subsErrorMsg }}</div>
              <div v-show="viewSubsList" style="width: 900px; height: 100%; margin-top: 10px">
                <p style="color: #5ba9ca">{{ $t('setting.appCollectData') }}</p>
                <ag-grid-vue
                  style="width: 100%; height: 100%"
                  class="ag-theme-alpine ag-custom-scroll"
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
                  :auto-height="true"
                  :tooltip-show-delay="tooltipShowDelay"
                  :tooltip-hide-delay="tooltipHideDelay"
                ></ag-grid-vue>
              </div>
              <div class="flex items-center py-2">
                <label class="text-sm text-primary-600 w-28">{{ $t('setting.remarks') }}</label>
                <input
                  v-model.trim="detail.appDesc"
                  type="text"
                  class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
                  :placeholder="$t('setting.describeApp')"
                />
              </div>
              <p class="txt"></p>
              <button class="btn gray-line" @click="scrollTo(7, 6)">{{ $t('setting.before') }}</button>
            </div>
            <!-- //detail -->
          </li>
        </ol>
      </div>
    </template>
    <template v-if="mode === 'quick'">
      <div class="">
        <div class="flex items-center px-8 py-2 border-b border-primary-200">
          <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.contractSelect') }}</label>
          <div class="">
            <div class="sort-wrap">
              <div class="flex" style="border-color: #00a5ed">
                <div class="relative py-1 px-3 select-one w-52" style="width: 470px; height: 40px">
                  <div class="text-sm text-primary-600" style="text-align: center; padding-right: 0">{{ $t('setting.contract') }}</div>
                  <!-- quick-create 추가 -->
                  <Select
                    :data="ctrtList"
                    :text-getter="(item) => item.ctrtNm"
                    :key-getter="(item) => item.ctrtId"
                    :default-selected="detail.ctrtId ? (c) => c.ctrtId === detail.ctrtId : 0"
                    :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
                    :quick-create="true"
                    arrow-class="ml-4"
                    select-class="flex items-center justify-between h-10-important w-full text-gray-700 font-bold"
                    option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200 w-52 top-auto-important"
                    option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
                    @click="handleCtrtChange"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center px-8 py-2 border-b border-primary-200">
          <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.appId') }}<br />(Application ID)</label>
          <input
            v-model.trim="detail.appId"
            type="text"
            class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
            :placeholder="$t('setting.enterAppId')"
            :disabled="isLookupSubs"
          />
          <!-- <button class="ico-copy ml-2" @click="copyClipboard(templateUrl)">복사</button> -->
        </div>
        <div class="flex items-center px-8 py-2 border-b border-primary-200">
          <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.tenantId') }}<br />(Tenant ID)</label>
          <input
            v-model.trim="detail.tenantId"
            type="text"
            class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
            :placeholder="$t('setting.enterTenantId')"
            :disabled="isLookupSubs"
          />
          <!-- <button class="ico-copy ml-2" @click="copyClipboard(detail.extId)">복사</button> -->
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
            v-model.trim="detail.appDesc"
            type="text"
            class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
            :placeholder="$t('setting.describeApp')"
          />
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
            <p style="font-size: 14px; color: #5ba9ca">{{ $t('setting.appCollectData') }}</p>
            <ag-grid-vue
              style="width: 100%; height: 100%"
              class="ag-theme-alpine ag-custom-scroll"
              :grid-options="gridOptions2"
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
            ></ag-grid-vue>
          </div>
        </div>
      </div>
    </template>
    <!-- //step -->
  </div>
  <!-- //module -->
</template>

<script>
import { mapActions } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import AgGridMixin from '@/pages/Mixin/AgGridMixin.js';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import Select from '@/components/Select';
import InputTextPwd from '@/components/inputs/InputTextPwd';
import _ from 'loadsh';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  name: 'AzureAcctCreateGuide',
  components: { AgGridVue, Select, InputTextPwd },
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
    status: {
      type: [Object],
      required: true,
    },
    validInputs: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      mode: 'step',
      detail: { ...this.value },
      invalidInputs: true,
      subsErrorMsg: null,
      ctrtList: [],
      subsList: [],
      columnDefs: [],
      gridOptions: null,
      gridOptions2: null,
      rowHeight: null,
      defaultColDef: null,
      defaultExcelExportParams: null,
      frameworkComponents: null,
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
      loading: false,
      isLookupSubs: false,
    };
  },
  computed: {
    subsError() {
      return this.subsErrorMsg != null;
    },
    viewSubsList() {
      return !this.loading && this.isLookupSubs && this.subsErrorMsg === null;
    },
  },
  watch: {
    '$i18n.locale': ['setColumn', 'loadCtrts'],
    detail: {
      handler(newValue) {
        this.$emit('input', { ...newValue });
        this.invalidInputs = !this.validInputs(newValue, 'ctrtId', 'appId', 'tenantId', 'clientScrVal');
      },
      deep: true,
    },
    status(newValue) {
      if (newValue != null) this.isLookupSubs = newValue.ok;
    },
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

    this.gridOptions2 = _.cloneDeep(this.gridOptions);

    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
  },
  created() {
    this.loadCtrts();
  },
  methods: {
    ...mapActions('azureAcctMgmt', ['fetchAzureCtrtList', 'fetchAzureAppSubsList']),
    init() {
      this.subsErrorMsg = null;
    },
    resetDetail() {
      this.init();
      this.isLookupSubs = false;
      if (typeof this.detail === 'object') {
        for (let key in this.detail) {
          if (Object.prototype.hasOwnProperty.call(this.detail, key)) {
            this.detail[key] = '';
          }
        }
      }
    },
    handleCtrtChange(ctrt) {
      this.resetDetail();
      this.detail.ctrtId = ctrt.ctrtId;
    },
    setCtrtList(ctrts) {
      this.ctrtList = ctrts;
      this.ctrtList.unshift({
        ctrtId: null,
        ctrtNm: this.$t('common.select.select'),
      });
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
          headerName: this.$t('setting.status'),
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
    async loadCtrts() {
      const result = await this.fetchAzureCtrtList();
      const ctrts = result.data;
      this.setCtrtList(ctrts);
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
    scrollTo(cur, dist) {
      document.getElementById('step' + cur).classList.remove('active');
      document.getElementById('step' + dist).classList.add('active');
    },
    copyClipboard(text) {
      this.$copyText(text);
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
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
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
label.radio {
  cursor: pointer;
}
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
