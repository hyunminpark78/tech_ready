<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <!-- header -->
      <SectionNewHeader
        title-class="flex items-center py-5"
        title2-class="font-bold"
        :main-icon="{ src: require('@/assets/images/chart.svg') }"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title2="$t('advisor.spotRateCheck.title')"
        :title="$t('advisor.spotRateCheck.title')"
      />
      <!-- header -->
      <Section>
        <SectionMain style="display: flex; flex-direction: column; gap: 16px">
          <FilterSection :tab="tab" :switch-tab="switchTab" />
          <div class="box-wrap">
            <div class="flex justify-between items-center" style="padding-top: 23px; padding-bottom: 23px">
              <p style="font-size: 18px; font-weight: 700; margin-left: 30px">
                {{ $t('advisor.spotRateCheck.priceGrid') }}
              </p>
              <div class="flex" style="gap: 20px; margin-right: 10px">
                <span>
                  <a :class="currency === 'won' ? `${btnStyle} ${btnActiveStyle}` : btnStyle" @click="currency = 'won'"
                    >KRW</a
                  >
                  <a :class="currency === 'usd' ? `${btnStyle} ${btnActiveStyle}` : btnStyle" @click="currency = 'usd'"
                    >USD</a
                  >
                </span>
                <Select
                  :data="selectTimeData"
                  :key-getter="(item) => item.value"
                  :default-selected="3"
                  :placeholder="$t('3개월')"
                  div-class="relative"
                  select-class="flex items-center justify-between w-full px-4 py-1.5 text-sm text-left bg-white border rounded h-8"
                  :arrow-src="require('@/assets/images/arrow-typ-03-up.svg')"
                  arrow-class="ml-4 -mr-2"
                  option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
                  option-list-style="width: 100%"
                  option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
                  @change="selectTypeRange"
                />
              </div>
            </div>
            <SearchPriceGraph
              :currency="currency"
              :tab="tab"
              :range-type="rangeType"
              :graph-data="graphData"
              :grid-data="legendData"
            />
            <SearchPriceGrid :currency="currency" :tab="tab" :grid-data="gridData" :range-type="rangeType" />
          </div>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>

<script>
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import { FilterSection, SearchPriceGrid, SearchPriceGraph } from './sections';
import { i18n } from '../../../../../public/locales/i18n';
import resourceOptiService from '@/services/resourceOptiService';
import moment from 'moment';
import Select from '@/components/Select';
import demoData from '../../../../../public/locales/comparison_demo.json';

export default {
  components: {
    SectionLnb,
    Section,
    SectionMain,
    SectionNewHeader,
    FilterSection,
    SearchPriceGrid,
    SearchPriceGraph,
    Select,
  },
  data() {
    return {
      btnStyle: `inline-block rounded mw60 py-1 text-center font-bold border border-primary-400 text-sm`,
      btnActiveStyle: 'bg-primary-400 text-white',
      tooltip: false,
      currency: 'won',
      selectTimeData: [],
      rangeType: 90,
      tab: 1,
      searchPriceData: {
        tab1: {
          withoutOndemand: demoData.sameTypeData.slice(1, demoData.sameTypeData.length),
          rowData: demoData.sameTypeData,
          graphData: demoData.rateSearchInstance.map((item) => ({
            usageDate: item.usedts,
            ondemand: 69,
            r6i: (Number(item['t3_medium_a']) * 1355.55).toFixed(0),
            r5: (Number(item['t3_medium_b']) * 1355.55).toFixed(0),
            m6i: (Number(item['t3_medium_c']) * 1355.55).toFixed(0),
            comparedInstanceType: (Number(item['ap-northeast-2d']) * 1355.55).toFixed(0),
          })),
        },
        tab2: {
          withoutOndemand: demoData.sameRegionData,
          rowData: demoData.sameRegionData,
          graphData: demoData.rateSearchInstance.map((item) => ({
            usageDate: item.usedts,
            m6i: (Number(item['t3_small_a']) * 1355.55).toFixed(0),
            r5: (Number(item['t3_medium_a']) * 1355.55).toFixed(0),
            r6i: (Number(item['t3_large_a']) * 1355.55).toFixed(0),
          })),
        },
      },
    };
  },
  computed: {
    legendData() {
      return this.tab === 1 ? this.searchPriceData.tab1.rowData : this.searchPriceData.tab2.rowData;
    },
    gridData() {
      return this.tab === 1 ? this.searchPriceData.tab1.withoutOndemand : this.searchPriceData.tab2.withoutOndemand;
    },
    graphData() {
      return this.tab === 1 ? this.searchPriceData.tab1.graphData : this.searchPriceData.tab2.graphData;
    },
  },
  watch: {
    '$i18n.locale': ['setAllItem', 'exchgRateSearch', 'setSelectTimeData'],
    currency() {
      if (this.currency != 'won') {
        let newData1Grid = this.searchPriceData.tab1.rowData.map((item) => {
          return {
            ...item,
            ondemand: 69,
            currentRate: (item.currentRate / 1355.55).toFixed(2),
            averageAmount: (item.averageAmount / 1355.55).toFixed(2),
            estimatedCost: (item.estimatedCost / 1355.55).toFixed(2),
            onDemandCost: (item.onDemandCost / 1355.55).toFixed(2),
          };
        });
        this.searchPriceData.tab1.rowData = newData1Grid;
        let newData2Grid = this.searchPriceData.tab2.rowData.map((item) => {
          return {
            ...item,
            currentRate: (item.currentRate / 1355.55).toFixed(2),
            averageAmount: (item.averageAmount / 1355.55).toFixed(2),
            estimatedCost: (item.estimatedCost / 1355.55).toFixed(2),
            onDemandCost: (item.onDemandCost / 1355.55).toFixed(2),
          };
        });
        this.searchPriceData.tab2.rowData = newData2Grid;
        let newData1Graph = demoData.rateSearchInstance.map((item) => ({
          usageDate: item.usedts,
          ondemand: 69,
          m6i: Number(item['t3_medium_a']).toFixed(0),
          r5: Number(item['t3_medium_b']).toFixed(0),
          r6i: Number(item['t3_medium_c']).toFixed(0),
        }));
        this.searchPriceData.tab1.graphData = newData1Graph;
        let newData2Graph = demoData.rateSearchInstance.map((item) => ({
          usageDate: item.usedts,
          m6i: Number(item['t3_small_a']).toFixed(0),
          r5: Number(item['t3_medium_a']).toFixed(0),
          r6i: Number(item['t3_large_a']).toFixed(0),
        }));
        this.searchPriceData.tab2.graphData = newData2Graph;
      } else {
        this.setInitData();
      }
    },
  },
  created() {
    this.exchgRateSearch();
  },
  mounted() {
    this.setSelectTimeData();
  },
  methods: {
    setAllItem() {
      if (i18n.locale === 'ko') {
        this.allItem = {
          id: 'checkAll',
          text: '전체',
        };
      } else {
        this.allItem = {
          id: 'checkAll',
          text: 'All',
        };
      }
    },
    async exchgRateSearch() {
      const result = await resourceOptiService.fetchExchRate(this.exchgRateSrcCd, this.curcyNm, this.exchgRateStdDt);
      const exchgRateStdDt = result.data.data.exchgRateStdDt;
      const krwExchgRate = result.data.data.krwExchgRate;
      const year = exchgRateStdDt.slice(0, 4);
      const month = exchgRateStdDt.slice(4, 6);
      const day = exchgRateStdDt.slice(6, 8);
      const formattedDate = year + '년 ' + month + '월 ' + day + '일';
      const viewKrwExchgRate = document.querySelectorAll('.exchRate');
      const viewExchgRateStdDt = document.querySelector('.excRateTip');
      const textNode = viewExchgRateStdDt.firstChild;
      viewKrwExchgRate[0].textContent = `${this.$t('optimization.appliedExchangeRate')}: ￦` + krwExchgRate;
      if (i18n.locale === 'ko') {
        textNode.nodeValue = 'Upbit 환율 ' + formattedDate;
      } else {
        textNode.nodeValue = moment().format('MMM.DD.YYYY') + ' (Upbit)';
      }
    },
    setSelectTimeData() {
      this.selectTimeData = [
        {
          text: this.$t('advisor.detailTable.spotComparison.oneWeek'),
          value: 7,
        },
        {
          text: this.$t('advisor.detailTable.spotComparison.oneMonth'),
          value: 30,
        },
        {
          text: this.$t('advisor.detailTable.spotComparison.threeMonths'),
          value: 90,
        },
      ];
    },
    selectTypeRange(typeRange) {
      this.rangeType = typeRange.value;
    },
    switchTab(tab) {
      this.tab = tab;
    },
    setInitData() {
      this.searchPriceData = {
        tab1: {
          rowData: demoData.sameTypeData,
          graphData: demoData.rateSearchInstance.map((item) => ({
            usageDate: item.usedts,
            ondemand: 69,
            r6i: (Number(item['t3_medium_a']) * 1355.55).toFixed(0),
            r5: (Number(item['t3_medium_b']) * 1355.55).toFixed(0),
            m6i: (Number(item['t3_medium_c']) * 1355.55).toFixed(0),
            comparedInstanceType: (Number(item['ap-northeast-2d']) * 1355.55).toFixed(0),
          })),
        },
        tab2: {
          rowData: demoData.sameRegionData,
          graphData: demoData.rateSearchInstance.map((item) => ({
            usageDate: item.usedts,
            m6i: (Number(item['t3_small_a']) * 1355.55).toFixed(0),
            r5: (Number(item['t3_medium_a']) * 1355.55).toFixed(0),
            r6i: (Number(item['t3_large_a']) * 1355.55).toFixed(0),
          })),
        },
      };
    },
  },
};
</script>

<style lang="scss">
/*style tab wrap currency*/
.tab-wrap-currency {
  display: inline-block;
  height: 32px;
}
.tab-wrap-currency a {
  text-align: center;
  float: left;
  font-size: 14px;
  width: 44px;
  height: 32px;
  border: solid 1px #e9ebed;
  padding-top: 2px;
  color: #999999;
  cursor: pointer;
}

.tab-wrap-currency a:first-child {
  border-radius: 6px 0 0 6px;
}
.tab-wrap-currency a:last-child {
  border-radius: 0 6px 6px 0;
}
.tab-wrap-currency a.clicked {
  background-color: #00a5ed;
  border-color: #00a5ed;
  color: #ffffff;
}
</style>
