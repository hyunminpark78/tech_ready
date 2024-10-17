<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <main class="main">
      <div class="contents">
        <Section>
          <SectionNewHeader
            title-class="flex items-center py-5"
            :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
            :title="$t('menu.mainCost')"
            :title2="$t('menu.billingReport')"
            :main-icon="{ src: require('@/assets/images/ico-cost.svg') }"
          />
          <SectionMain>
            <Card wrapper-class="flex mb-5 bg-white border rounded-lg border-primary-200 dashboard-card">
              <div class="relative w-6/12 py-4 px-7 select-four">
                <div class="mb-1 text-sm text-primary-600">{{ $t('common.select.contract') }}</div>
                <Select
                  :data="ctrtList"
                  :text-getter="(item) => item.ctrtNm"
                  :key-getter="(item) => item.ctrtId"
                  select-class="flex items-center justify-between w-full font-bold text-gray-700"
                  :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
                  arrow-class="ml-4"
                  option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
                  option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
                  :default-selected="0"
                  @click="handleCtrtChange"
                />
              </div>
              <div class="relative w-3/12 py-4 px-7 select-four">
                <div class="mb-1 text-sm text-primary-600">{{ $t('common.select.report') }}</div>
                <Select
                  ref="report"
                  :data="reportList"
                  :text-getter="(item) => item.rptNm"
                  :key-getter="(item) => item.rptId"
                  select-class="flex items-center justify-between w-full font-bold text-gray-700"
                  :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
                  arrow-class="ml-4"
                  option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
                  option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
                  :default-selected="isDefault ? 0 : -1"
                  @click="handleReportChange"
                />
              </div>
              <div class="relative w-3/12 py-4 px-7 select-four">
                <div class="mb-1 text-sm text-primary-600">{{ $t('common.select.content') }}</div>
                <Select
                  ref="content"
                  :data="contentList"
                  :text-getter="(item) => item.rptUrlNm"
                  :key-getter="(item) => item.rptUrlVal"
                  select-class="flex items-center justify-between w-full font-bold text-gray-700"
                  :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
                  arrow-class="ml-4"
                  option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
                  option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
                  :default-selected="isDefault ? 0 : -1"
                  @click="handleContentChange"
                />
              </div>
            </Card>
            <Card wrapper-class="flex mb-5 bg-white border rounded-lg border-primary-200 dashboard-card">
              <div style="min-height: 601px; min-width: 100%">
                <div
                  v-if="!chartExist"
                  class="flex flex-col items-center justify-center"
                  style="margin: 15% 0px 0px 0px"
                >
                  <img src="@/assets/images/ico-nodata-view.svg" alt="." />
                  <p class="mt-3 text-gray-700">{{ $t('common.paragraph.pleaseSelectContent') }}</p>
                </div>
                <div
                  v-if="chartExist && !graphExist"
                  class="flex flex-col items-center justify-center"
                  style="margin: 15% 0px 0px 0px"
                >
                  <img src="@/assets/images/ico-nodata-view.svg" alt="." />
                  <p class="mt-3 text-gray-700">{{ $t('common.paragraph.reportCreationFailed') }}</p>
                </div>
                <div :style="{ visibility: chartExist && graphExist ? 'visible' : 'hidden' }">
                  <tableau-viz id="tableauViz" ref="tableauViz" hide-tabs>
                    <viz-parameter
                      v-for="param in params"
                      :key="param.key"
                      :name="param.key"
                      :value="param.value"
                    ></viz-parameter>
                  </tableau-viz>
                </div>
              </div>
            </Card>
          </SectionMain>
        </Section>
      </div>
    </main>
  </div>
</template>
<script>
import Section, { SectionNewHeader, SectionMain, SectionLnb } from '@/components/Section';
import billService from '@/services/billService';
import Select from '@/components/Select';
import Card from '@/components/Card';
export default {
  components: {
    SectionNewHeader,
    Section,
    SectionMain,
    Select,
    SectionLnb,
    Card,
  },
  data() {
    return {
      chartValue: '',
      currentCtrt: [],
      ctrtList: [],
      reportList: [],
      contentList: [],
      params: {},
      chartExist: false,
      graphExist: true,
      isDefault: true,
    };
  },
  created() {
    billService.fetchBillAllCtrt().then((data) => {
      this.ctrtList = data.data;
      this.defaultSelect(this.ctrtList[0]);
    });
  },
  mounted() {},
  updated() {
    const receiveMessage = (e) => {
      const data = e.data;
      if (typeof data === 'string' && data === 'tableau.completed') {
        this.graphExist = false;
        //error
      }
    };
    window.addEventListener('message', receiveMessage, false);
  },
  methods: {
    defaultSelect(ctrtItem) {
      const defaultCtrtItem = ctrtItem;
      this.currentCtrt = defaultCtrtItem;
      const defaultReportItem = defaultCtrtItem.reportList;
      if (defaultReportItem) {
        const defaultContentItem = defaultReportItem[0].contentList;
        this.reportList = defaultReportItem;
        this.contentList = defaultContentItem;
        this.isDefault = true;
        this.chartValue = ctrtItem.ctrtId;
        // console.log(this.chartValue);
        this.loadGraph(defaultContentItem[0]);
      } else {
        this.resetSelected(this.$refs.report);
        this.resetSelected(this.$refs.content);
        this.reportList = [];
        this.contentList = [];
        // this.isDefault = false;
        this.chartValue = ctrtItem.ctrtId;
      }
    },
    handleCtrtChange(item) {
      // this.resetSelected(this.$refs.report);
      // this.resetSelected(this.$refs.content);
      // this.reportList = this.isNullReturnZeroList(item.reportList);
      // this.contentList = this.isNullReturnZeroList(item.contentList);
      // this.chartValue = item.ctrtId;
      // console.log(this.chartValue);
      this.defaultSelect(item);
    },
    handleReportChange(item) {
      // this.resetSelected(this.$refs.content);
      this.isDefault = true;
      this.contentList = this.isNullReturnZeroList(item.contentList);
      this.loadGraph(this.contentList[0]);
    },
    handleContentChange(item) {
      this.loadGraph(item);
    },
    loadGraph(item) {
      this.parsingParams(item);
      billService.fetchBillTicket().then((data) => {
        const ticket = data.data.token;
        const viz = this.$refs.tableauViz;
        const url = item.rptUrlVal.replace('<TOKEN>', ticket);
        viz.removeEventListener('firstinteractive', () => {});
        viz.addEventListener('firstinteractive', this.handleEvent);
        viz.style.display = 'flex';
        viz.src = url;
      });
      setTimeout(() => {
        this.chartExist = true;
      }, 500);
    },
    handleEvent(e) {
      e.target._vizImpl.refreshDataAsync();
    },
    isNullReturnZeroList(list) {
      return list ? list : [];
    },
    resetSelected(ref) {
      const viz = this.$refs.tableauViz;
      if (viz) {
        viz.style.display = 'none';
        ref.selectedItem = {};
      }
      this.chartExist = false;
    },
    parsingParams(item) {
      const str = item.paramCont.split(',');
      const params = [];
      str.forEach((param) => {
        const strArr = param.split('=');
        const key = strArr[0];
        let value = strArr[1];
        if (value.indexOf('{') > -1) {
          const resultValue = this.parsingBrace(value);
          params.push({ key: key, value: this.currentCtrt[resultValue] });
        } else {
          params.push({ key: key, value: value });
        }
      });
      this.params = params;
    },
    parsingBrace(inputString) {
      const pattern = /\{([^}]+)\}/;

      const match = inputString.match(pattern);
      if (match) {
        const extractedString = match[1];
        return this.toCamelCase(extractedString);
      }
    },
    toCamelCase(str) {
      return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    },
  },
};
</script>
