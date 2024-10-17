<template>
  <Card wrapper-class="p-8 bg-white border rounded-lg border-primary-200 dashboard-card mb-7">
    <div>
      <template>
        <CardHeader wrapper-class="relative flex items-center justify-center mb-5">
          <OcpButton
            small
            class="px-2.5 py-1 mr-3 h-8"
            :text="$t('cost.byContract')"
            :number="400"
            :active="activeDataType === 'CTRT'"
            @click="() => setActiveDataType('CTRT')"
          />
          <OcpButton
            small
            class="px-2.5 py-1 mr-3 h-8"
            :text="$t('cost.byProduct')"
            :number="400"
            :active="activeDataType === 'ITEM'"
            @click="() => setActiveDataType('ITEM')"
          />

          <div class="relative inline-block dashboard-card select-three">
            <Select
              :data="selectYearOptions"
              :key-getter="(item) => item.unixTimestamp"
              select-class="flex items-center justify-between w-full px-4 py-1.5 text-sm text-left bg-white border rounded border-primary-400 h-8"
              :arrow-src="require('@/assets/images/arrow-typ-03-up.svg')"
              arrow-class="ml-4 -mr-2"
              option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
              option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
              @click="handleYearChange"
            />
          </div>

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
        </CardHeader>
      </template>

      <CardMain>
        <template v-if="hasData === 'D'">
          <div style="height: 494px; overflow: hidden !important">
            <!-- TODO: CHART -->
            <g-stack-bill-chart
              v-if="chartType === 'stack'"
              style="overflow: hidden !important"
              curcyCode="KRW"
              chart-height="354"
              chartTheme="bill_trend"
              :data="convertData"
              :propsInfo="propsInfo"
            />
            <g-area-bill-chart
              v-if="chartType === 'line'"
              curcyCode="KRW"
              chart-height="354"
              chartTheme="bill_trend"
              :data="convertData"
              :propsInfo="propsInfo"
              style="overflow: hidden !important"
            />
          </div>
        </template>
        <template v-else-if="hasData === 'L'">
          <div class="relative" style="height: 350px">
            <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
              <div class="mb-4 loading_rotate">
                <span class="loadingcolor"></span>
              </div>
              <div class="loading_txt">Loading...</div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex flex-col items-center justify-center" style="height: 350px">
            <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
            <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
          </div>
        </template>
      </CardMain>
    </div>
  </Card>
</template>

<script>
import Card, { CardHeader, CardMain } from '@/components/Card';
import Select from '@/components/Select';
import OcpButton from '@/components/shared/OcpButton.vue';
import { mapGetters, mapActions, mapState } from 'vuex';
import GStackBillChart from '@/pages/Bill/cards/GStackBillChart';
import GAreaBillChart from '@/pages/Bill/cards/GAreaBillChart';
export default {
  components: {
    Card,
    CardHeader,
    CardMain,
    Select,
    OcpButton,
    GStackBillChart,
    GAreaBillChart,
  },
  data() {
    return {
      activeDataType: '',
      selectYearOptions: [],
      chartType: '',
      propsInfo: {
        dateProp: 'billYm',
        keyProp: 'grpId',
        nameProp: 'grpNm',
        valueProp: 'billAmt',
      },
    };
  },
  computed: {
    ...mapState('bill', ['filter', 'trendYear']),
    ...mapGetters('bill', ['trend']),
    hasData() {
      let cData = _.cloneDeep(this.trend);
      /** E(Empty) / L(lodaing) / D(data) */
      let lState = '';
      if (!cData && cData.length === 0) {
        lState = 'E';
      } else {
        let tData = cData[0];
        if (!_.isEmpty(tData)) {
          if (tData['grpId'] === 'init') {
            lState = 'L';
          } else {
            lState = 'D';
          }
        }
      }
      return lState;
    },
    convertData() {
      let data = this.trend;
      data = _.sortBy(data, ['billYm', 'billAmt'], ['asc', 'desc']);
      return data;
    },
    getTrendYear() {
      return this.trendYear[0];
    },
  },
  watch: {
    getTrendYear(newVal, oldVal) {
      this.dataset();
    },
  },
  methods: {
    ...mapActions('bill', ['setFilter', 'fetchTrend']),
    dataset() {
      if (this.trendYear.length) {
        let obj = { unixTimestamp: '', text: '' };
        this.trendYear.map((elem) => {
          obj = {
            unixTimestamp: elem.chrgYear,
            text: elem.chrgYear,
          };
          this.selectYearOptions.push(obj);
        });
        this.setFilter({ name: 'trendYear', payload: this.trendYear[0] });
        this.setActiveDataType('ITEM');
        this.chartType = 'stack';
      }
    },
    setActiveDataType(dataType) {
      let chrgYear = '';
      if (this.filter.trendYear.chrgYear === undefined) {
        chrgYear = this.filter.trendYear.text;
      } else {
        chrgYear = this.filter.trendYear.chrgYear;
      }
      this.activeDataType = dataType;
      this.setFilter({ name: 'trendType', payload: dataType });
      this.fetchTrend({
        trendYear: chrgYear,
        tabType: this.filter.trendType,
      });
    },
    handleYearChange(item) {
      this.setFilter({ name: 'trendYear', payload: item });
      this.fetchTrend({
        trendYear: item.text,
        tabType: this.filter.trendType,
      });
    },
    chgChartType(type) {
      this.chartType = type;
    },
  },
};
</script>
<style>

</style>
