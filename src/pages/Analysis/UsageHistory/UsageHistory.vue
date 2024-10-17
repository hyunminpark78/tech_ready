<template>
  <div>
    <div class="flex flex-wrap bg-white border rounded-lg border-primary-200 dashboard-card">
      <div class="relative w-5/12 py-4 border-b border-r px-7 select-five border-primary-200">
        <div class="text-sm text-primary-600">기간 설정</div>
        <SelectDatepicker ref="datepicker" @change="handleFilterDateRangeChange" />
      </div>

      <div class="relative w-7/12 py-4 border-b px-7 select-four border-primary-200">
        <div class="text-sm text-primary-600">계약선택</div>
        <Select
          ref="contract"
          :pending="requestStatus.filterContractOptions === 'pending'"
          :data="filterOptions.contracts"
          :key-getter="(item) => item.ctrtId"
          :text-getter="(item) => item.ctrtNm"
          select-class="flex items-center justify-between w-full font-bold text-gray-700"
          arrow-class="ml-4"
          @change="handleFilterContractChange"
        />
      </div>

      <div class="relative w-2/12 py-4 border-r px-7 select-four border-primary-200">
        <div class="text-sm text-primary-600">클라우드</div>
        <SelectCount
          ref="selectProviders"
          :pending="requestStatus.filterOptions === 'pending'"
          :data="filterOptions.providers"
          :text-getter="(item) => item.name"
          select-class="flex items-center justify-between w-full text-gray-700"
          arrow-class="ml-4"
          @change="(values) => handleFilterChange('providers', values)"
        />
      </div>

      <div class="relative w-4/12 py-4 border-r px-7 select-four border-primary-200">
        <div class="text-sm text-primary-600">계정</div>
        <SelectCount
          ref="selectAccounts"
          :pending="requestStatus.filterOptions === 'pending'"
          :data="filterOptions.accounts"
          :text-getter="(item) => item.name"
          select-class="flex items-center justify-between w-full text-primary-400"
          arrow-class="ml-4"
          @change="(values) => handleFilterChange('accounts', values)"
        />
      </div>

      <div class="relative w-3/12 py-4 border-r px-7 select-four border-primary-200">
        <div class="text-sm text-primary-600">서비스</div>
        <SelectCount
          ref="selectServices"
          :pending="requestStatus.filterOptions === 'pending'"
          :data="filterOptions.services"
          :key-getter="(item) => `${item.id}_${item.name}`"
          :text-getter="(item) => item.name"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button w-96"
          @change="(values) => handleFilterChange('services', values)"
        />
      </div>

      <div class="relative w-3/12 py-4 px-7 select-four">
        <div class="text-sm text-primary-600">리전</div>
        <SelectCount
          ref="selectRegions"
          :pending="requestStatus.filterOptions === 'pending'"
          :data="filterOptions.regions"
          :text-getter="(item) => item.name"
          option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button w-96 left-auto"
          @change="(values) => handleFilterChange('regions', values)"
        />
      </div>
    </div>

    <p class="text-gray-500 p-3 text-sm">※ AWS 비용은 Cost Explorer에서 상세한 조회가 가능합니다.</p>
    <div class="flex justify-center pb-8">
      <button
        class="px-1 py-3 mx-1 text-sm bg-white border rounded text-primary-400 border-primary-400 w-28"
        @click="reset"
      >
        초기화
      </button>
      <button
        class="px-1 py-3 mx-1 text-sm text-white border rounded bg-primary-400 border-primary-400 w-28"
        @click="fetch"
      >
        검색
      </button>
    </div>

    <div class="mb-3 overflow-hidden bg-white border dashboard-card rounded-lg">
      <RadioGroup
        class="flex overflow-hidden text-center rounded-t-lg dashboard-tab-buttons border-primary-200"
        :active-classes="['clicked']"
        :standard-classes="['']"
        @change="$console.log"
      >
        <button
          class="flex items-center justify-center flex-1 py-4 border-r border-primary-200"
          :class="{ clicked: headerType === 'CTRT' }"
          @click="tabClick('CTRT')"
        >
          계약별
        </button>
        <button
          class="flex items-center justify-center flex-1 py-4 border-r border-primary-200"
          :class="{ clicked: headerType === 'ACNT' }"
          @click="tabClick('ACNT')"
        >
          계정별
        </button>
        <button
          class="flex items-center justify-center flex-1 py-4 border-r border-primary-200"
          :class="{ clicked: headerType === 'PRDT' }"
          @click="tabClick('PRDT')"
        >
          서비스별
        </button>
        <button
          class="flex items-center justify-center flex-1 py-4 border-r border-primary-200"
          :class="{ clicked: headerType === 'REGION' }"
          @click="tabClick('REGION')"
        >
          리전별
        </button>
      </RadioGroup>

      <div class="p-8 border-t border-primary-200">
        <template v-if="hasChartData === 'D'">
          <div class="relative flex items-center justify-center mb-4">
            <span class="mr-3 text-xl font-bold text-primary-600">Total</span>
            <span class="text-3xl">
              <span class="text-2xl--">￦</span>
              {{ getTotalPice | number }}
            </span>

            <div class="absolute top-0 right-0 pt-3">
              <button class="mr-2" @click="chgChartType('stack')">
                <template v-if="chartType === 'stack'">
                  <img src="@/assets/images/ico-chart-bar-on.svg" alt="." />
                </template>
                <template v-else>
                  <img src="@/assets/images/ico-chart-bar-off.svg" alt="." />
                </template>
              </button>
              <button class="mr-2" @click="chgChartType('line')">
                <template v-if="chartType === 'line'">
                  <img src="@/assets/images/ico-chart-line-on.svg" alt="." />
                </template>
                <template v-else>
                  <img src="@/assets/images/ico-chart-line-off.svg" alt="." />
                </template>
              </button>
            </div>
          </div>
          <div class="text-xs ml-5 text-center text-red-500">
            ※ 사용 기록을 수집하여 추정한 요금으로 계약 조건, 환율, 절사 방식, 서비스 제공 업체의 요금 확정 여부 등에
            따라 실제 청구 요금과 다를 수 있습니다.
          </div>

          <div>
            <g-stack-chart
              v-if="chartType === 'stack'"
              chart-height="350"
              chart-theme="use_usageCost"
              :data="convertData"
              :props-info="propsInfo"
            />
            <g-area-chart
              v-if="chartType === 'line'"
              chart-height="350"
              chart-theme="use_usageCost"
              :data="convertData"
              :props-info="propsInfo"
            />
          </div>
        </template>

        <!-- Loading -->
        <template v-else-if="hasChartData === 'L'">
          <div class="relative" style="height: 350px">
            <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
              <div class="mb-4 loading_rotate">
                <span class="loadingcolor"></span>
              </div>
              <div class="loading_txt">Loading...</div>
            </div>
          </div>
        </template>

        <!-- No Data -->
        <template v-else>
          <div class="flex flex-col items-center justify-center" style="height: 350px">
            <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
            <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
          </div>
        </template>
        <!-- // No Data -->
      </div>
    </div>

    <CardUsageHistoryGrid />
  </div>
</template>

<script>
import Select from '@/components/Select/Select.vue';
import SelectCount from '@/components/Select/SelectCount.vue';
import SelectDatepicker from '@/components/Select/SelectDatepicker.vue';
import RadioGroup from '@/components/RadioGroup.vue';
import { mapState, mapActions, mapGetters } from 'vuex';
import CardUsageHistoryGrid from '@/pages/Analysis/UsageHistory/cards/CardUsageHistoryGrid.vue';
import moment from 'moment';
import _ from 'loadsh';

export default {
  components: {
    CardUsageHistoryGrid,
    Select,
    SelectCount,
    SelectDatepicker,
    RadioGroup,
  },
  data() {
    return {
      isMounted: false,
      filterContractReady: false,
      filterDateRangeReady: false,
      headerType: 'CTRT',
      chartType: 'stack',
      propsInfo: {
        dateProp: 'stdDt',
        keyProp: 'grpId',
        nameProp: 'grpNm',
        valueProp: 'krwUnblendCost',
      },
    };
  },
  computed: {
    ...mapState('analysis', ['requestStatus', 'usageCost', 'filter', 'filterOptions']),
    ...mapGetters('analysis', [
      'selectContractOptions',
      'selectCloudOptions',
      'selectAcntOptions',
      'selectServiceOptions',
      'selectRegionOptions',
    ]),
    hasRequiredValues() {
      return this.isMounted && this.$refs.datepicker.hasValue && this.$refs.contract.hasValue;
    },
    hasChartData() {
      let cData = _.cloneDeep(this.usageCost);
      /** E(Empty) / L(lodaing) / D(data) */
      let lState = '';
      if (cData.length === 0) {
        lState = 'E';
      } else {
        let tData = cData[0];
        if (tData['grpId'] === 'init') {
          lState = 'L';
        } else {
          lState = 'D';
        }
      }

      return lState;
    },
    getTotalPice() {
      return _.sumBy(this.usageCost, (x) => x.krwUnblendCost);
    },
    convertData() {
      /* [  NOTICE  ]
            8월 5일 신성수매니저님 요구사항. 차트 범례 너무 많을 시 성능 이슈로 인해 ETC로 줄여서 보여줘야함
      */
      let cData = _.cloneDeep(this.usageCost);
      let xData = _.groupBy(cData, (x) => x.grpId);
      let convertData;
      let topPrice = [];
      let topRankCnt = 20;

      // 마지막 누적금액 비교
      _.map(xData, (list) => {
        topPrice.push(list[list.length - 1]);
      });

      // ROWDATA 그룹화 후 RANKING작업
      topPrice = _.sortBy(topPrice, (c) => c.krwUnblendCost || 0).reverse();

      // 상위 DATA 추출 (계약일때는 전부 보여줘야 함)
      if (this.headerType !== 'CTRT') {
        topPrice = _.take(topPrice, topRankCnt);
      }
      // ROWDATA > TOP RANK TARGET ROW DATA 추출
      let topData = _.map(topPrice, (row) => {
        return xData[row.grpId];
      });

      if (this.headerType !== 'CTRT') {
        // ROWDATA > ETC생성할 TARGET ROW DATA 추출
        let etcData = _.filter(xData, (data) => _.findIndex(topPrice, (p) => p.grpId === data[0].grpId) === -1);

        /* ETC 데이터 날짜별 SUM */
        etcData = _.flatten(etcData);
        etcData = _.groupBy(etcData, (etc) => etc.stdDt);

        let etcList = [];
        Object.entries(etcData).map(([d, data], index) => {
          let sum = _.sumBy(data, (da) => da.krwUnblendCost);
          let t = {};
          t['headerTyp'] = this.headerType;
          t['cspTypCd'] = data[0].cspTypCd;
          t['grpId'] = 'ETC';
          t['grpNm'] = 'ETC';
          t['krwUnblendCost'] = sum;
          t['stdDt'] = data[0].stdDt;
          etcList.push(t);
        });
        // 기존 TOP ROWdATA랑 ETC 생성 DATA 합치기
        convertData = Array.concat(_.flatten(topData), etcList);
      } else {
        convertData = _.flatten(topData);
      }
      convertData = _.sortBy(convertData, (item) => [item.accumKrwUnblendCost, item.stdDt]);

      return convertData;
    },
  },
  watch: {
    hasRequiredValues(ready) {
      if (ready) {
        this.fetch();
      }
    },
  },
  created() {
    // this.fetchFilterContractOptions({ ctrtId: 'CTRT_ALL' });
  },
  mounted() {
    this.isMounted = true;
    window.scrollTo(0, 0);
  },
  methods: {
    ...mapActions('analysis', [
      'fetchFilterContractOptions',
      'fetchFilterOptions',
      'fetchUsage',
      'resetFilter',
      'setFilter',
    ]),
    fetch() {
      this.fetchUsage({ headerType: this.headerType });
    },
    handleFilterDateRangeChange(dateRange) {
      this.setFilter({ name: 'dateRange', data: dateRange });
      this.fetchFilterContractOptions({
        ctrtId: 'CTRT_ALL',
        strDt: moment(dateRange.startDate).format('YYYYMMDD'),
        endDt: moment(dateRange.endDate).format('YYYYMMDD'),
      });

      if (!this.filterDateRangeReady) {
        this.filterDateRangeReady = true;
      }

      if (this.filterContractReady && this.filterDateRangeReady) {
        this.reset();
      }
    },
    handleFilterContractChange({ ctrtId }) {
      if (!this.filterContractReady) {
        this.filterContractReady = true;
      }

      this.setFilter({ name: 'contractId', data: ctrtId });

      if (this.filterContractReady && this.filterDateRangeReady) {
        this.reset();
      }
    },
    handleFilterChange(name, data) {
      this.setFilter({ name, data });
      this.fetchFilterOptions();
    },
    reset() {
      this.resetFilter();
      this.$refs.selectProviders.reset();
      this.$refs.selectAccounts.reset();
      this.$refs.selectServices.reset();
      this.$refs.selectRegions.reset();
      this.fetchFilterOptions();
    },
    tabClick(tabName) {
      this.fetchUsage({ ctrtId: 'CTRT_ALL', headerType: tabName }).then(() => {
        this.headerType = tabName;
      });
    },
    chgChartType(type) {
      this.chartType = type;
    },
  },
};
</script>
