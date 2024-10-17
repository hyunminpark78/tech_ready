<template>
  <div class="contents-wrap">
    <SectionLnb
      :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
    ></SectionLnb>

    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.mainCost')"
        title2="Cost Explorer"
        :main-icon="{ src: require('@/assets/images/ico-cost.svg') }"
      />
      <Section>
        <SectionMain>
          <div class="flex-1 text-right cost">
            <CustomLoading v-if="isDownload" style="position: absolute; top: 44px; right: 300px" />
            <p v-if="isDownload" class="downloading">{{ $t('common.paragraph.excelDownloadedWait') }}</p>
            <button v-if="!isDownload" class="download" @click="popToggle">
              {{ $t('common.button.downloadDetailInfo') }}
            </button>
          </div>
          <div class="sort-wrap" style="display: flex">
            <SelectCloudFilter
              ref="cloud"
              style="width: 200px"
              :csp-typ-cd-from-parent="searchParam.cspTypCd"
              @onCspTypCdInitialized="onCspTypCdInitialized"
              @onCspTypCdChanged="onCspTypCdChanged"
            />
            <div class="flex flex-grow-1 white-nowrap">
              <div class="relative py-4 px-7 select-three" style="width: 25%">
                <div class="text-sm text-primary-600">{{ $t('cost.viewType') }}</div>

                <Select
                  :data="periodTypeList"
                  :value="periodType"
                  :text-getter="(item) => item.name"
                  :key-getter="(item) => item.name"
                  select-class="flex items-center justify-between w-full font-bold text-gray-700"
                  :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
                  arrow-class="ml-4"
                  option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
                  option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
                  :default-selected="(periodObject) => periodObject.value === periodType"
                  @change="selectPeriod"
                />
              </div>

              <div class="relative py-4 px-7 select-three" style="width: 30%">
                <div class="text-sm text-primary-600">{{ $t('cost.dateRange') }}</div>
                <SelectDatepicker
                  v-if="periodType === 'DALY'"
                  :default-select="defaultSelect"
                  :text-visiblity="false"
                  :period-type="periodType"
                  :date-ranges="dateRanges"
                  @change="handleFilterDateRangeChange"
                />
                <SelectMonthPicker
                  v-if="periodType === 'MNTH'"
                  :default-select="defaultSelect"
                  :text-visiblity="false"
                  :period-type="periodType"
                  :date-ranges="dateRanges"
                  @change="handleFilterDateRangeChange"
                />
              </div>
              <div class="relative py-4 px-7 select-three" style="width: 45%">
                <div class="text-sm text-primary-600">{{ $t('cost.groupBy') }}</div>

                <CostExSelect
                  ref="grpSelect"
                  :data="grpTypeList[cspTypCd]"
                  :value="periodType"
                  :text-getter="(item) => item.name"
                  :key-getter="(item) => item.name"
                  select-class="flex items-center justify-between w-full font-bold text-gray-700"
                  :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
                  arrow-class="ml-4"
                  option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
                  option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
                  :default-selected="(grpTypeObject) => grpTypeObject.value === grpType"
                  @click="selectGroup"
                />
                <template v-if="grpType === 'service_group_id' || grpType === 'tag_val'">
                  <Select
                    style="padding-left: 50px"
                    :data="subGrpTypeList"
                    :value="periodType"
                    :text-getter="(item) => item.name"
                    :key-getter="(item) => item.name"
                    select-class="flex items-center justify-between w-full font-bold text-gray-700"
                    :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
                    arrow-class="ml-4"
                    option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
                    option-list-style="left: 50%"
                    option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
                    :default-selected="0"
                    @click="selectSubGroup"
                  />
                </template>
              </div>
              <!-- //col -->
            </div>
            <a class="btn" @click="onSearch">{{ $t('common.button.apply') }}</a>
          </div>

          <div class="grid-filter" style="margin-top: 10px">
            <!-- left -->
            <div class="grid-left">
              <CostExGridFilter ref="filter" @contractChanged="onContractChanged" />
            </div>
            <!-- //left -->

            <!-- right -->
            <div class="gird-right">
              <CostExChart ref="chart" :period-type="periodType" @updateCurcyCode="(c) => (curcyCode = c)" />
              <CostExGrid ref="grid" :group-name="groupName" :period-type="periodType" :curcy-code="curcyCode" />
            </div>
            <!-- //right -->
          </div>
        </SectionMain>
      </Section>
    </div>
    <CostExDetailDownload ref="detailDownload" :visible="visibleDetailExcelPop" @closeDetailExcelPop="popToggle">
    </CostExDetailDownload>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import CostExGridFilter from '@/pages/Cost/CostEx/CostExGridFilter';
import CostExGrid from '@/pages/Cost/CostEx/CostExGrid';
import CostExChart from '@/pages/Cost/CostEx/CostExChart';
import SelectMonthPicker from '@/pages/Cost/CostEx/SelectMonthPicker.vue';
import SelectDatepicker from '@/components/Select/SelectDatepicker.vue';
import Select from '@/components/Select';
import CostExSelect from '@/pages/Cost/CostEx/CostExSelect';
import moment from 'moment';
import DataNoRow from '@/pages/AgGrid/DataNoRow';
import DataLoading from '@/pages/AgGrid/DataLoading';
import _ from 'lodash';
import CostExDetailDownload from '@/pages/Cost/CostEx/pop/CostExDetailDownload.vue';
import CustomLoading from '@/pages/Cost/CostEx/CustomLoading.vue';
import SelectCloudFilter from '@/components/Select/SelectCloudFilter.vue';
import costExService from '@/services/costExService';
import { types } from '@/store/modules/costEx';
import { setApiConfig } from '@/library/APICaller';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: {
    SelectCloudFilter,
    CostExDetailDownload,
    CostExGridFilter,
    CostExGrid,
    CostExChart,
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    SelectDatepicker,
    Select,
    SelectMonthPicker,
    CostExSelect,
    CustomLoading,
  },
  data() {
    return {
      periodType: 'DALY',
      dateRanges: {},
      defaultSelect: 3,
      strDate: '',
      endDate: '',
      grpType: '',
      subGrpType: '',
      userFileters: [
        {
          loginId: '',
          custUserId: '',
          corpRegNo: '',
          custCorpNm: '',
          userNm: '',
          fltSepCd: '',
          fltSepCdNm: '',
          serno: 0,
          ordNo: 0,
          filterGroup: '',
        },
      ],
      periodTypeList: [],
      dateRangesList: {},
      grpTypeList: {
        AWS: [],
        AZURE: [],
      },
      subGrpTypeList: [],

      // grid data
      gridOptions: null,
      columnDefs: null,
      defaultColDef: null,
      defaultExcelExportParams: null,
      frameworkComponents: null,
      loading: false,
      param: {
        vndr: 'aws',
        cmpnId: '1',
        pageNum: 1,
        limitCnt: 20,
        sortId: 'cloudProdNm',
        sortOrder: 'desc',
        accList: [],
        tz: '+09:00',
        searchText: '',
        gridType: 'rs',
        rsrcType: '',
        bzList: [],
        rgnList: [],
      },
      curcyCode: 'USD',
      rowData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: 'This month',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()]);
            },
          },
          {
            text: 'This year',
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: 'Last 6 months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      value1: '',
      value2: '',
      visibleDetailExcelPop: false,
      costExplorerApiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
    };
  },
  computed: {
    ...mapState('costEx', ['costExplorerList', 'searchParam', 'isDownload']),
    ...mapGetters('costEx', ['cspTypCd', 'filterParam']),
    groupName() {
      return this.grpTypeList[this.cspTypCd].find(({ value }) => value === this.grpType).name;
    },
  },
  watch: {
    // 다국어 변경 시 차트를 재매핑
    '$i18n.locale': ['setDateRanges', 'setDateRangesList', 'setPeriodTypeList', 'setGrpTypeList'],
    cspTypCd: ['setGrpType'],
  },
  created() {
    this.setPeriodTypeList();
    this.setGrpTypeList();
    this.setGrpType();
    this.setDateRanges();
    this.setDateRangesList();
  },
  mounted() {},
  beforeMount() {
    this.gridOptions = {};
    this.frameworkComponents = {
      noRowsOverlayComponent: DataNoRow,
      loadingOverlayComponent: DataLoading,
    };
    this.paginationPageSize = 10;
  },
  methods: {
    ...mapActions('costEx', [
      'fetchDefaultFilterOptions',
      'fetchUserFilterSetting',
      'fetchAllFilterSetting',
      'fetchSearchParam',
      'fetchCostExplorerList',
      'fetchTagKeyFilter',
      'fetchSvcCtgryFilter',
      'fetchIsDownload',
      'fetchEmptyFilter',
    ]),
    ...mapMutations('costEx', {
      setUpdateAllFilterSetting: types.SET_UPDATE_ALL_FILTER_SETTING,
      setUpdateUserFilterSetting: types.SET_UPDATE_USER_FILTER_SETTING,
      setUpdateCtrtTag: types.SET_UPDATE_CTRT_TAG,
    }),
    onCspTypCdInitialized({ cspTypCd }) {
      this.fetchSearchParam({ ...this.searchParam, cspTypCd: cspTypCd });
      this.selectPeriod(this.periodTypeList[0]);
      this.setUpdateAllFilterSetting(true);
      this.setUpdateUserFilterSetting(true);
      this.setUpdateCtrtTag(true);
      this.onSearch();
    },
    setPeriodTypeList() {
      this.periodTypeList = [
        { name: this.$t('common.select.daily'), value: 'DALY' },
        { name: this.$t('common.select.monthly'), value: 'MNTH' },
      ];
    },
    setGrpTypeList() {
      this.grpTypeList.AWS = [
        { name: this.$t('common.select.contract'), value: 'contract_id' },
        { name: this.$t('common.select.customer'), value: 'cust_id' },
        { name: this.$t('common.select.service'), value: 'service_code' },
        { name: this.$t('common.select.account'), value: 'usage_account_id' },
        { name: this.$t('common.select.region'), value: 'product_region' },
        { name: this.$t('common.select.product'), value: 'product_code' },
        { name: this.$t('common.select.productFamily'), value: 'product_family' },
        { name: this.$t('common.select.instanceType'), value: 'instance_type' },
        { name: this.$t('common.select.usageType'), value: 'usage_type' },
        { name: this.$t('common.select.cpuType'), value: 'physical_processor' },
        { name: this.$t('common.select.apiOperations'), value: 'product_operation' },
        { name: this.$t('common.select.platform'), value: 'operating_system' },
        { name: this.$t('common.select.database'), value: 'database_engine' },
        { name: this.$t('common.select.costType'), value: 'lineitem_type' },
        { name: this.$t('common.select.billingEntity'), value: 'billing_entity' },
        { name: this.$t('common.select.serviceGroup'), value: 'service_group_id' },
        { name: this.$t('common.select.tag'), value: 'tag_val' },
      ];

      this.grpTypeList.AZURE = [
        { name: this.$t('common.select.contract'), value: 'contract_id' },
        { name: this.$t('common.select.customer'), value: 'cust_id' },
        { name: this.$t('common.select.service'), value: 'meter_category' },
        { name: 'Subscription', value: 'subscription_name' },
        { name: this.$t('common.select.region'), value: 'meter_region' },
        { name: this.$t('common.select.instanceType'), value: 'meter_name' },
        { name: this.$t('common.select.instanceGroup'), value: 'meter_sub_category' },
        { name: this.$t('common.select.resourceGroup'), value: 'resource_group' },
        { name: this.$t('common.select.serviceGroup'), value: 'service_group_id' },
        { name: this.$t('common.select.tag'), value: 'tag_val' },
      ];
    },
    setGrpType: function () {
      const { value } = this.grpTypeList[this.cspTypCd][3];
      this.grpType = value;
    },
    setDateRanges() {
      if (i18n.locale === 'ko') {
        this.dateRanges = {
          이번달: [moment().startOf('month').toDate(), moment().toDate()],
          지난달: [
            moment().subtract(1, 'month').startOf('month').toDate(),
            moment().subtract(1, 'month').endOf('month').toDate(),
          ],
          '최근 14일': [moment().subtract(14, 'days').toDate(), moment().toDate()],
          '최근 1개월': [moment().subtract(1, 'month').toDate(), moment().toDate()],
        };
      } else {
        this.dateRanges = {
          'This month': [moment().startOf('month').toDate(), moment().toDate()],
          'Last month': [
            moment().subtract(1, 'month').startOf('month').toDate(),
            moment().subtract(1, 'month').endOf('month').toDate(),
          ],
          'Recent 14 days': [moment().subtract(14, 'days').toDate(), moment().toDate()],
          'Recent 1 month': [moment().subtract(1, 'month').toDate(), moment().toDate()],
        };
      }
    },
    setDateRangesList() {
      if (i18n.locale === 'ko') {
        this.dateRangesList = {
          DALY: {
            이번달: [moment().startOf('month').toDate(), moment().toDate()],
            지난달: [
              moment().subtract(1, 'month').startOf('month').toDate(),
              moment().subtract(1, 'month').endOf('month').toDate(),
            ],
            '최근 14일': [moment().subtract(14, 'days').toDate(), moment().toDate()],
            '최근 1개월': [moment().subtract(1, 'month').toDate(), moment().toDate()],
          },
          MNTH: {
            이번달: [moment().startOf('month').toDate(), moment().toDate()],
            '최근 3개월': [moment().subtract(3, 'month').startOf('month').toDate(), moment().toDate()],
            '최근 6개월': [moment().subtract(6, 'month').toDate(), moment().toDate()],
            '최근 1년': [moment().subtract(1, 'year').toDate(), moment().toDate()],
          },
        };
      } else {
        this.dateRangesList = {
          DALY: {
            'This month': [moment().startOf('month').toDate(), moment().toDate()],
            'Last month': [
              moment().subtract(1, 'month').startOf('month').toDate(),
              moment().subtract(1, 'month').endOf('month').toDate(),
            ],
            'Recent 14 days': [moment().subtract(14, 'days').toDate(), moment().toDate()],
            'Recent 1 month': [moment().subtract(1, 'month').toDate(), moment().toDate()],
          },
          MNTH: {
            'This month': [moment().startOf('month').toDate(), moment().toDate()],
            'Recent 3 months': [moment().subtract(3, 'month').startOf('month').toDate(), moment().toDate()],
            'Recent 6 months': [moment().subtract(6, 'month').toDate(), moment().toDate()],
            'Recent 1 year': [moment().subtract(1, 'year').toDate(), moment().toDate()],
          },
        };
      }
    },
    onContractChanged() {
      if (this.searchParam.grpType === 'service_group_id' || this.searchParam.grpType === 'tag_val') {
        let item = { name: this.$t('common.select.contract'), value: 'contract_id' };
        this.$refs.grpSelect.handleItemClick(item);
      }
    },
    changeLoading(val) {
      this.loading = val;
    },
    filterOption() {
      const param = {
        periodType: this.periodType,
        strDate: this.strDate,
        endDate: this.endDate,
        grpType: this.grpType,
        subGrpType: this.subGrpType,
        userFilter: this.userFileters,
      };
      this.fetchSearchParam({ ...this.searchParam, ...param });
    },
    handleFilterDateRangeChange(dateRange) {
      this.strDate = moment(dateRange.startDate).format('YYYYMMDD');
      this.endDate = moment(dateRange.endDate).format('YYYYMMDD');
      this.filterOption();
    },
    onSearch() {
      this.searchData();
      this.$refs.chart.loading = true;
      this.$refs.grid.loading = true;
    },
    async searchData() {
      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.costExplorerApiConfig.cancelTokenSource) {
        this.costExplorerApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.costExplorerApiConfig);

      await this.fetchCostExplorerList({
        cspTypCd: this.cspTypCd,
        payload: this.searchParam,
        config: { cancelToken: this.costExplorerApiConfig.cancelToken },
      });
    },

    selectPeriod(type) {
      this.periodType = type.value;
      this.dateRanges = this.dateRangesList[type.value];

      const dateRange = this.setDateRange();
      this.handleFilterDateRangeChange(dateRange);
    },
    setDateRange() {
      return ((range) => ({
        startDate: range[0],
        endDate: range[1],
      }))(this.dateRanges[Object.keys(this.dateRanges)[this.defaultSelect]]);
    },
    selectGroup(type) {
      if (type.value === 'service_group_id' || type.value === 'tag_val') {
        this.setSubGrpData(type);
      }
      this.grpType = type.value;
      this.filterOption();
    },
    selectSubGroup(type) {
      this.subGrpType = type.id;
      this.filterOption();
    },
    async setSubGrpData(type) {
      const selectedContractIdArr = this.searchParam['contractId'];
      this.subGrpTypeList = [];
      this.subGrpType = '';

      if (type.value === 'service_group_id') {
        const data = await this.fetchSvcCtgryFilter({
          contractId: selectedContractIdArr[0]['id'],
        });
        if (data && data.optionList.length !== 0) {
          this.subGrpTypeList = _.cloneDeep(data.optionList);
          this.subGrpType = this.subGrpTypeList[0].id;
        }
        this.filterOption();
      } else if (type.value === 'tag_val') {
        let param = { contractId: selectedContractIdArr[0]['id'] };
        if (this.cspTypCd === 'AZURE') {
          param = {
            ...param,
            startYm: this.strDate.slice(0, 6),
            endYm: this.endDate.slice(0, 6),
          };
        }
        const data = await this.fetchTagKeyFilter({
          cspTypCd: this.cspTypCd,
          payload: param,
        });

        if (data && data.optionList.length !== 0) {
          this.subGrpTypeList = _.cloneDeep(data.optionList);
          this.subGrpType = this.subGrpTypeList[0].id;
        }
        this.filterOption();
      }
    },
    // grid
    pagingInitialize() {
      this.pageObj.currentPage = 1;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.autoSizeAll();
      this.gridApi.sizeColumnsToFit();
    },
    autoSizeAll() {
      if (!this.gridColumnApi.getAllColumns()) return;
      var allColumnIds = [];
      this.gridColumnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, false);
    },

    setColumn: function () {
      const { name: grpTypNm } = this.grpTypeList.find(({ value }) => this.grpType === value);
      this.columnDefs = [
        {
          field: 'grptype',
          headerName: grpTypNm,
          resizable: true,
          menuTabs: [],
          cellClass: ['ag-grid-font', 'text-center'],
          sortable: true,
          valueFormatter: (params) => params.value || '-',
        },
        {
          field: 'sum',
          headerName: '소계',
          resizable: true,
          menuTabs: [],
          cellClass: this.curcyCode === 'USD' ? ['text-right', 'dollarType'] : ['text-right', 'numberType'],

          sortable: true,
          valueFormatter: (params) => {
            if (this.curcyCode === 'USD') {
              return this.dollarFormatter(params);
            } else {
              return this.customValueFormatter(params);
            }
          },
        },
      ];

      if (this.rowData == null && _.isEmpty(this.rowData)) return;

      const headerList = [];

      const dates = _.chain(this.rowData)
        .groupBy('datestd')
        .map((i, v) => {
          let headerNm = '';
          if (this.periodType === 'MNTH') {
            headerNm = v.slice(0, 4) + '.' + v.slice(4, 6);
          } else {
            headerNm = v.slice(0, 4) + '.' + v.slice(4, 6) + '.' + v.slice(6, 8);
          }

          headerList.push(headerNm);
          return headerNm;
        })
        .value();

      headerList.forEach((header) => {
        // 월별 컬럼 추가
        this.columnDefs.push({
          headerName: header,
          field: 'datestd',
          menuTabs: [],
          resizable: true,
          sortable: true,
          valueFormatter: (params) => {
            if (this.curcyCode === 'USD') {
              return this.dollarFormatter(params);
            } else {
              return this.customValueFormatter(params);
            }
          },
          type: 'rightAligned',
          cellClass: this.curcyCode === 'USD' ? ['text-right', 'dollarType'] : ['text-right', 'numberType'],
        });
      });
    },
    setGridData(data) {
      this.rowData = _.cloneDeep(this.$store.state.costEx.gridDataList);

      // grid initialize
      if (data == null || 0 == data.length) {
        // column Setting
        this.rowData = [];
        this.setColumn();
        return;
      }

      this.pageObj.totalCnt = data.length;
      this.pageObj.currentPageNo = 1;
      this.setColumn();

      this.changeLoading(false);
    },
    roundToNumber(num, point) {
      if (/[e|E]/.test(`${num}`)) num = parseFloat(num).toLocaleString();
      return +(Math.round(num + `e+${point}`) + `e-${point}`);
    },
    dollarFormatter(params) {
      if (params.value !== undefined) {
        let val = '';
        val = this.roundToNumber(params.value, 3).toFixed(3);
        const formatted = this.numberWithCommas(val);
        if (formatted.indexOf(0) === '-') {
          return -'$' + formatted;
        } else {
          return '$' + formatted;
        }
      } else {
        return '-';
      }
    },
    popToggle() {
      this.visibleDetailExcelPop = !this.visibleDetailExcelPop;
    },
    onCspTypCdChanged({ cspTypCd }) {
      this.fetchEmptyFilter();

      const param = {
        periodType: this.periodType,
        strDate: this.strDate,
        endDate: this.endDate,
        grpType: cspTypCd === 'AWS' ? 'usage_account_id' : 'subscription_name',
        subGrpType: '',
        userFilter: this.userFileters,
        custId: [],
        customerCorporationName: [],
        contractId: [],
        serviceCode: [],
        usageAccountId: [],
        productRegion: [],
        productCode: [],
        productFamily: [],
        instanceType: [],
        usageType: [],
        physicalProcessor: [],
        productOperation: [],
        operatingSystem: [],
        databaseEngine: [],
        lineitemType: [],
        billingEntity: [],
        serviceGroupId: [],
        tagVal: [],
        meterCategory: [],
        subscriptionName: [],
        meterRegion: [],
        meterName: [],
        meterSubCategory: [],
        resourceGroup: [],
        cspTypCd: cspTypCd,
      };

      this.fetchSearchParam({ ...this.searchParam, ...param });

      this.setUpdateAllFilterSetting(true);
      this.setUpdateUserFilterSetting(true);
      this.setUpdateCtrtTag(true);
      this.onSearch();
    },
  },
};
</script>
<style lang="css">
a {
  cursor: pointer !important;
}
.cost .download,
.cost .downloading {
  position: absolute;
  top: 40px;
  right: 30px;
  font-size: 14px;
  font-weight: 500;
  color: #999;
  background-size: 20px auto;
  letter-spacing: -0.9px;
  padding: 0 20px 0 0;
}
.cost .download:before {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  margin-top: -16px;
  background: url(../../../assets/images/download-01.svg) 50% 50% no-repeat;
  background-size: 14px auto;
  width: 14px;
  height: 32px;
}
.cost .download.single {
  display: inline-block;
  margin: 7px 0 0 5px;
  padding: 0;
  width: 14px;
  height: 20px;
  text-indent: -9999px;
  font-size: 0;
  vertical-align: top;
}
.flex-grow-1 {
  flex-grow: 1;
}
.white-nowrap {
  white-space: nowrap;
}
</style>
