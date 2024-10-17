<template>
  <div v-if="category" class="dashboard-card rounded-lg mb-4">
    <!-- tab -->
    <div class="flex tab-one">
      <button
        v-for="usageCategory in usageCategoryList"
        :key="usageCategory.code"
        :ref="usageCategory.code"
        :class="[
          ...getCategoryButtonDefaultClassList(usageCategory.rsrcType),
          {
            clicked: category === usageCategory.rsrcType,
            unclicked: category !== usageCategory.rsrcType,
          },
        ]"
        :disabled="category === usageCategory.rsrcType"
        @click="() => updateCategory(usageCategory.rsrcType)"
      >
        {{ usageCategory.name }}
      </button>
    </div>
    <!-- //tab -->

    <!-- grid -->
    <div class="box-wrap grid3-wrap">
      <!-- col -->
      <div v-if="usageCategoryMap.get(category).targetTitle" class="col">
        <div v-if="usageCategoryMap.get(category).targetTitle === '상태'" class="title">
          <h4 class="tit-wrap">{{ $t('resource.status') }}</h4>
        </div>
        <div v-if="usageCategoryMap.get(category).targetTitle === '연결 상태'" class="title">
          <h4 class="tit-wrap">{{ $t('resource.connectionStatus') }}</h4>
        </div>

        <div style="display: flex; justify-content: center; align-items: center">
          <div class="relative" :class="!isLoading ? 'hidden' : ''" style="width: 100%; height: 264px">
            <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
              <div class="mb-4 loading_rotate">
                <span class="loadingcolor"></span>
              </div>
              <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
            </div>
          </div>

          <div
            id="targetRsrcChart"
            :class="targetTotalCnt !== 0 && !isLoading ? '' : 'hidden'"
            style="
              width: 100%;
              fllex: 1;
              letter-spacing: -0.03px;
              text-align: center;
              color: #fff;
              line-height: 264px;
              min-height: 264px;
              overflow: hidden !important;
            "
          >
            Chart
          </div>
          <div id="targetLegend" style="flex: 1"></div>
          <div
            :class="targetTotalCnt === 0 && !isLoading ? '' : 'hidden'"
            class="flex items-center justify-center"
            style="height: 264px; width: 100%"
          >
            <div class="text-center" style="margin: auto">
              <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
              <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- //col -->

      <!-- col -->
      <div v-if="usageCategoryMap.get(category).regionTitle === '리전'" class="col">
        <div class="title">
          <h4 class="tit-wrap">{{ $t('resource.region') }}</h4>
        </div>
        <div style="display: flex; justify-content: center; align-items: center">
          <div class="relative" :class="!isLoading ? 'hidden' : ''" style="width: 100%; height: 264px">
            <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
              <div class="mb-4 loading_rotate">
                <span class="loadingcolor"></span>
              </div>
              <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
            </div>
          </div>

          <div
            id="regionChart"
            :class="regionTotalCnt !== 0 && !isLoading ? '' : 'hidden'"
            style="
              width: 100%;
              fllex: 1;
              letter-spacing: -0.03px;
              text-align: center;
              color: #fff;
              line-height: 264px;
              min-height: 264px;
              overflow: hidden !important;
            "
          >
            Chart
          </div>
          <div id="regionLegend" style="flex: 1"></div>
          <div
            :class="regionTotalCnt === 0 && !isLoading ? '' : 'hidden'"
            class="flex items-center justify-center"
            style="height: 264px; width: 100%"
          >
            <div class="text-center" style="margin: auto">
              <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
              <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- //col -->
      <!-- col -->
      <div v-if="usageCategoryMap.get(category).typeTitle" class="col">
        <div v-if="usageCategoryMap.get(category).typeTitle === '인스턴스 유형'" class="title">
          <h4 class="tit-wrap">{{ $t('resource.instanceType') }}</h4>
        </div>
        <div v-if="usageCategoryMap.get(category).typeTitle === '엔진 유형'" class="title">
          <h4 class="tit-wrap">{{ $t('resource.engineType') }}</h4>
        </div>
        <div v-if="usageCategoryMap.get(category).typeTitle === '볼륨 유형'" class="title">
          <h4 class="tit-wrap">{{ $t('resource.volumeType') }}</h4>
        </div>
        <div v-if="usageCategoryMap.get(category).typeTitle === '로드밸런서 유형'" class="title">
          <h4 class="tit-wrap">{{ $t('resource.loadbalancerType') }}</h4>
        </div>
        <div style="display: flex; justify-content: center; align-items: center">
          <div class="relative" :class="!isLoading ? 'hidden' : ''" style="width: 100%; height: 264px">
            <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
              <div class="mb-4 loading_rotate">
                <span class="loadingcolor"></span>
              </div>
              <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
            </div>
          </div>

          <div
            id="typeChart"
            :class="typeRsrcTotalCnt !== 0 && !isLoading ? '' : 'hidden'"
            style="
              width: 100%;
              fllex: 1;
              letter-spacing: -0.03px;
              text-align: center;
              color: #fff;
              line-height: 264px;
              min-height: 264px;
              overflow: hidden !important;
            "
          >
            Chart
          </div>
          <div id="typeLegend" style="flex: 1"></div>
          <div
            :class="typeRsrcTotalCnt === 0 && !isLoading ? '' : 'hidden'"
            class="flex items-center justify-center"
            style="height: 264px; width: 100%"
          >
            <div class="text-center" style="margin: auto">
              <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
              <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- //col -->
    </div>

    <!-- //grid -->
  </div>
</template>
<script>
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { mapState, mapActions, mapGetters } from 'vuex';
import resourceService from '@/services/resourceService';
import moment from 'moment';
import colorConstants from '@/pages/Contract/cards/colorConstants';
import performanceService from '@/services/performanceService';
import { setApiConfig } from '@/library/APICaller';
import _ from 'lodash';
import axios from 'axios';
import { i18n } from '../../../../public/locales/i18n';

export default {
  data() {
    return {
      param: {
        cmpnId: '',
        prvrCd: '',
        rsrcType: '',
        accounts: [],
        regions: [],
        ocpSvcGrps: [],
        tags: [],
      },
      targetRsrcInfo: {},
      targetTotalCnt: 0,
      regionRsrcInfo: {},
      regionTotalCnt: 0,
      typeRsrcInfo: {},
      typeRsrcTotalCnt: 0,
      isLoading: true,
      chartApiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
    };
  },
  computed: {
    ...mapState('performance', {
      filter: 'filter',
      category: 'category',
      updateUsageChart: 'updateUsageChart',
      companyId: 'selectedCustCorpIds',
      svcGrpSelectedCustCorpIds: 'svcGrpSelectedCustCorpIds',
      cspReference: 'cspReference',
    }),
    ...mapGetters('performance', ['cspTypCd']),
    usageCategoryMap() {
      const usageCategoryMap = new Map();
      this.cspReference[this.cspTypCd].categoryList
        .filter((category) => category.isInUsage)
        .forEach((category) =>
          usageCategoryMap.set(
            category.rsrcType,
            _.pick(category, ['code', 'name', 'rsrcType', 'unitName', 'targetTitle', 'regionTitle', 'typeTitle'])
          )
        );
      console.log('usageCategoryMap', usageCategoryMap);
      return usageCategoryMap;
    },
    usageCategoryList() {
      return Array.from(this.usageCategoryMap.values());
    },
    defaultCategory() {
      return this.usageCategoryList[0].rsrcType;
    },
  },
  watch: {
    '$i18n.locale': 'setChartData',
    cspTypCd: function () {
      this.initCategory();
    },
    updateUsageChart: async function () {
      if (this.updateUsageChart) {
        this.fetchUpdateUsageChart(false);
        await this.setChartData();
      }
    },
  },
  created() {
    this.initCategory();
  },
  mounted() {
    this.initParam();
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
  },
  methods: {
    ...mapActions('performance', ['fetchCategory', 'fetchUpdateUsageChart']),
    getCategoryButtonDefaultClassList(category) {
      const defaultClassList = [
        'flex',
        'items-center',
        'justify-center',
        'w-full',
        'py-5',
        'bg-white',
        'border',
        'border-gray-300',
        'font-bold',
        'text-base',
      ];
      const classListByIndex = [];
      const index = this.usageCategoryList.findIndex((usageCategory) => usageCategory.rsrcType === category);

      if (index === 0) {
        classListByIndex.push('rounded-tl-lg');
      } else {
        classListByIndex.push('border-l-0');
      }
      if (index === this.usageCategoryList.length - 1) {
        classListByIndex.push('rounded-tr-lg');
      }

      return [...defaultClassList, ...classListByIndex];
    },
    capitalizeFirstLetter(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    setChartData: async function () {
      this.isLoading = true;
      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.chartApiConfig.cancelTokenSource) {
        this.chartApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.chartApiConfig);

      this.initParam();
      if (!this.companyId.length || _.isNil(this.companyId[0].id)) {
        this.isLoading = false;
        return;
      }

      this.param.cmpnId = this.companyId[0].id;
      this.param.prvrCd = this.cspReference[this.cspTypCd].prvrCd;
      this.param.rsrcType = this.category;
      this.param.accounts = this.filter.acntIdList ? this.filter.acntIdList : [];
      this.param.regions = this.filter.regionList ? this.filter.regionList : [];
      this.param.ocpSvcGrps = [];

      if (this.filter.svcGrpList.length > 0) {
        this.filter.svcGrpList.forEach((item) => {
          this.param.ocpSvcGrps.push(item.id);
        });
      }

      try {
        // chart api 호출
        const result = await resourceService.fetchUsagChart(this.param, {
          cancelToken: this.chartApiConfig.cancelToken,
        });

        if ('ok' === result.data.data.status) {
          for (const item of result.data.data.result) {
            let chartLabel = item.chartOption.chartLabel.replaceAll(' ', '').toLowerCase();
            if (chartLabel === 'status') {
              for (const subItem of item.chartData) {
                const key = `${subItem.value}`;
                this.targetRsrcInfo[key] = parseInt(subItem.cnt);
                this.targetTotalCnt += parseInt(subItem.cnt);
              }
            } else if (chartLabel === 'regions') {
              this.regionTotalCnt = item.chartData.length;
              for (const subItem of item.chartData) {
                const key = `${subItem.value}`;
                this.regionRsrcInfo[key] = parseInt(subItem.cnt);
              }
            } else if (
              chartLabel === 'types' ||
              chartLabel === 'engines' ||
              chartLabel === 'volumetypes' ||
              chartLabel === 'loadbalancertypes'
            ) {
              /**
               * ec2: types
               * rds: engine
               * ebs: volumetypes
               * elb: loadbalancertypes
               *
               * vm, postgresql, mysql, mariadb, dis, lb, pi: types
               */
              this.typeRsrcTotalCnt += item.chartData.length;
              for (const subItem of item.chartData) {
                const key = `${subItem.value}`;
                this.typeRsrcInfo[key] = parseInt(subItem.cnt);
                // this.typeRsrcTotalCnt += parseInt(subItem.cnt);
              }
            }
          }
        }

        const gridParam = {
          cmpnId: this.companyId[0].id,
          rsrcType: this.category,
          prvrCd: this.cspReference[this.cspTypCd].prvrCd,
          accounts: this.filter.acntIdList ? this.filter.acntIdList : [],
          regions: this.filter.regionList ? this.filter.regionList : [],
          ocpSvcGrps: [],
          excelYn: 'Y',
        };
        if (this.filter.svcGrpList.length > 0) {
          this.filter.svcGrpList.forEach((item) => {
            gridParam.ocpSvcGrps.push(item.id);
          });
        }

        // grid api 호출 (특정 리소스는 grid api 호출하여 chart 사용 데이터 조회 필요)
        /**
         * eip, elb
         * sqldb, vnet, dis, lb, pi
         */
        if (
          this.category === 'eip' ||
          this.category === 'load-balancers' ||
          this.category === 'Microsoft.Network/virtualNetworks' ||
          this.category === 'Microsoft.Sql/servers' ||
          this.category === 'Microsoft.Compute/disks' ||
          this.category === 'Microsoft.Network/loadBalancers' ||
          this.category === 'Microsoft.Network/publicIPAddresses'
        ) {
          const result = await resourceService.fetchUsagGrid(gridParam, {
            cancelToken: this.chartApiConfig.cancelToken,
          });

          if ('ok' === result.data.data.status) {
            if (this.category === 'eip') {
              const rowData = result.data.data.result.list;

              this.targetRsrcInfo['Associated'] = 0;
              this.targetRsrcInfo['Dissociated'] = 0;
              this.targetRsrcInfo[this.$t('resource.eC2NotRunning')] = 0;

              this.targetTotalCnt = rowData.length;
              for (let item of rowData) {
                if (item.rsrcOptiYn === 'Y' && item.rsrcOptiType === 'Detached') {
                  this.targetRsrcInfo['Dissociated'] += 1;
                } else if (item.rsrcOptiYn === 'Y' && item.rsrcOptiType === 'EC2 is not running') {
                  this.targetRsrcInfo[this.$t('resource.eC2NotRunning')] += 1;
                } else {
                  this.targetRsrcInfo['Associated'] += 1;
                }
              }
            } else if (this.category === 'load-balancers') {
              const rowData = result.data.data.result.list;

              this.targetTotalCnt = rowData.length;
              rowData.forEach((item) => {
                const key = item.detailStateContent;
                if (key) {
                  this.targetRsrcInfo[key] = (this.targetRsrcInfo[key] || 0) + 1;
                } else {
                  this.targetRsrcInfo['-'] = (this.targetRsrcInfo['-'] || 0) + 1;
                }
              });
            } else if (this.category === 'Microsoft.Network/virtualNetworks') {
              const rowData = result.data.data.result.list;

              this.targetTotalCnt = rowData.length;
              rowData.forEach((item) => {
                const key = item.detail && item.detail.properties && item.detail.properties.provisioningState;
                this.targetRsrcInfo[key] = (this.targetRsrcInfo[key] || 0) + 1;
              });
            } else if (this.category === 'Microsoft.Sql/servers') {
              const rowData = result.data.data.result.list;

              rowData.forEach((item) => {
                const targetKey = item.detailStateContent;
                this.targetRsrcInfo[targetKey] = (this.targetRsrcInfo[targetKey] || 0) + 1;

                const typeKey = item.detailTypeContent;
                this.typeRsrcInfo[typeKey] = (this.typeRsrcInfo[typeKey] || 0) + 1;
              });
              this.targetTotalCnt = rowData.length;
              this.typeRsrcTotalCnt = Object.keys(this.typeRsrcInfo).length;
            } else if (this.category === 'Microsoft.Compute/disks') {
              const rowData = result.data.data.result.list;

              this.targetTotalCnt = rowData.length;
              rowData.forEach((item) => {
                const key = item.detailStateContent;
                this.targetRsrcInfo[key] = (this.targetRsrcInfo[key] || 0) + 1;
              });
            } else if (this.category === 'Microsoft.Network/loadBalancers') {
              const rowData = result.data.data.result.list;

              this.targetTotalCnt = rowData.length;
              rowData.forEach((item) => {
                const key = item.detail && item.detail.properties && item.detail.properties.provisioningState;
                this.targetRsrcInfo[key] = (this.targetRsrcInfo[key] || 0) + 1;
              });
            } else if (this.category === 'Microsoft.Network/publicIPAddresses') {
              const rowData = result.data.data.result.list;

              rowData.forEach((item) => {
                const key = item.detailStateContent;
                this.targetRsrcInfo[key] = (this.targetRsrcInfo[key] || 0) + 1;
              });
              this.targetTotalCnt = rowData.length;
            }
          }
        }
        await this.createChart();
        this.isLoading = false;
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error fetching usage chart data:', e);
          this.isLoading = false;
        }
      }
    },
    createChart() {
      this.createRegionChart();
      this.createTargetRsrcChart();
      this.createTypeChart();
    },
    createRegionChart() {
      // let chartData = [];
      let chart = am4core.create('regionChart', am4charts.PieChart);
      const chartData = Object.keys(this.regionRsrcInfo).map((key) => {
        return {
          category: key,
          value: this.regionRsrcInfo[key],
        };
      });

      chart.data = chartData;

      chart.innerRadius = am4core.percent(65);
      let pieSeries = chart.series.push(new am4charts.PieSeries());

      const { COLOR_LIST } = colorConstants;
      pieSeries.colors.list = COLOR_LIST.map((color) => am4core.color(color));

      this.createChartLegend(chart, 'region');
      this.createChartLabel(pieSeries, this.regionTotalCnt.toString());

      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'category';
      pieSeries.labels.template.disabled = true;
      // pieSeries.labels.template.fontSize = 10;
      pieSeries.ticks.template.disabled = true;

      pieSeries.tooltip.fontSize = 12;
      pieSeries.tooltip.label.fontSize = 12;
      pieSeries.slices.template.propertyFields.fill = 'fill';
      pieSeries.slices.template.events.on('over', function (ev) {
        if (ev.target.dataItem.dataContext.fill === '#dedede') {
          pieSeries.slices.template.tooltipText = `[#000000]{category}: {value}`;
        } else {
          pieSeries.slices.template.tooltipText = `[#FFFFFF]{category}: {value}`;
        }
      });

      this.chartEventDisabled(chart);
    },
    createTargetRsrcChart() {
      let chart = am4core.create('targetRsrcChart', am4charts.PieChart);
      const chartData = Object.keys(this.targetRsrcInfo).map((key) => {
        return {
          category: this.capitalizeFirstLetter(key),
          value: this.targetRsrcInfo[key],
        };
      });

      chart.data = chartData;

      chart.innerRadius = am4core.percent(65);
      let pieSeries = chart.series.push(new am4charts.PieSeries());

      const { COLOR_LIST } = colorConstants;
      pieSeries.colors.list = COLOR_LIST.map((color) => am4core.color(color));

      this.createChartLegend(chart, 'target');

      let label = this.targetTotalCnt + `\n${this.usageCategoryMap.get(this.category).unitName}`;
      this.createChartLabel(pieSeries, label);

      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'category';
      pieSeries.labels.template.disabled = true;
      // pieSeries.labels.template.fontSize = 10;
      pieSeries.ticks.template.disabled = true;

      pieSeries.tooltip.fontSize = 12;
      pieSeries.tooltip.label.fontSize = 12;
      pieSeries.slices.template.propertyFields.fill = 'fill';
      pieSeries.slices.template.events.on('over', function (ev) {
        if (ev.target.dataItem.dataContext.fill === '#dedede') {
          pieSeries.slices.template.tooltipText = `[#000000]{category}: {value}`;
        } else {
          pieSeries.slices.template.tooltipText = `[#FFFFFF]{category}: {value}`;
        }
      });

      this.chartEventDisabled(chart);

      return chartData;
    },
    createTypeChart() {
      // let chartData = [];
      const abbreviation = {
        'Load Balancer-Application': 'ALB',
        'Load Balancer-Network': 'NLB',
        'Load Balancer-Gateway': 'GWLB',
        'Load Balancer': 'CLB',
        'General Purpose': 'gp2',
      };

      let chart = am4core.create('typeChart', am4charts.PieChart);
      const chartData = Object.keys(this.typeRsrcInfo).map((key) => {
        return {
          category: abbreviation[key] ? abbreviation[key] : key,
          value: this.typeRsrcInfo[key],
        };
      });

      chart.data = chartData;

      chart.innerRadius = am4core.percent(65);
      let pieSeries = chart.series.push(new am4charts.PieSeries());

      const { COLOR_LIST } = colorConstants;
      pieSeries.colors.list = COLOR_LIST.map((color) => am4core.color(color));

      this.createChartLegend(chart, 'type');
      this.createChartLabel(pieSeries, this.typeRsrcTotalCnt.toString());
      this.chartLabelDisabled(pieSeries);
      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'category';
      pieSeries.labels.template.disabled = true;
      // pieSeries.labels.template.fontSize = 10;
      pieSeries.ticks.template.disabled = true;

      // pieSeries.slices.template.tooltipText = '[#FFFFFF]{category}: {value}';
      pieSeries.tooltip.fontSize = 12;
      pieSeries.tooltip.label.fontSize = 12;
      pieSeries.slices.template.propertyFields.fill = 'fill';
      pieSeries.slices.template.events.on('over', function (ev) {
        if (ev.target.dataItem.dataContext.fill === '#dedede') {
          pieSeries.slices.template.tooltipText = `[#000000]{category}: {value}`;
        } else {
          pieSeries.slices.template.tooltipText = `[#FFFFFF]{category}: {value}`;
        }
      });

      this.chartEventDisabled(chart);

      return chartData;
    },

    createChartLegend(chart, chartType) {
      let legendContainer;
      if (chartType === 'type') {
        legendContainer = am4core.create('typeLegend', am4core.Container);
      } else if (chartType === 'target') {
        legendContainer = am4core.create('targetLegend', am4core.Container);
      } else {
        legendContainer = am4core.create('regionLegend', am4core.Container);
      }

      legendContainer.width = am4core.percent(100);
      legendContainer.height = am4core.percent(100);

      // chart.legend = new am4charts.Legend();
      // chart.legend.parent = legendContainer;

      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      chart.legend.valign = 'middle';
      chart.legend.labels.template.text = `[{color}]{name} {value} ${this.$t('resource.unit')}`;
      if (chartType === 'region') {
        chart.legend.labels.template.adapter.add('textOutput', function (text) {
          // '('를 찾아서 줄바꿈 적용
          return text.replace('(', '\n(');
        });
      }
      chart.legend.valueLabels.template.text = '';
      chart.legend.labels.template.fontSize = 12;
      chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      chart.legend.labels.template.truncate = false;
      chart.legend.labels.template.wrap = false;

      // chart.legend.scrollbar = new am4core.Scrollbar();
      // chart.legend.scrollbar.orientation = 'vertical';
      chart.legend.scrollable = true;
    },
    chartLabelDisabled(series) {
      series.labels.template.disabled = true;
    },
    createChartLabel(pieSeries, text) {
      /*let label = pieSeries.createChild(am4core.Label);
      label.text = text;
      label.horizontalCenter = 'middle';
      label.verticalCenter = 'middle';
      label.fontSize = 30;*/

      if (text.includes('\n')) {
        let texts = text.split('\n');

        let label1 = pieSeries.createChild(am4core.Label);
        label1.text = texts[0];
        label1.horizontalCenter = 'middle';
        label1.verticalCenter = 'middle';
        label1.fontSize = 30;
        label1.dy = -15;

        let label2 = pieSeries.createChild(am4core.Label);
        label2.text = texts[1];
        label2.horizontalCenter = 'middle';
        label2.verticalCenter = 'middle';
        label2.fontSize = 14;
        label2.dy = 15;
      } else {
        let label = pieSeries.createChild(am4core.Label);
        label.text = text;
        label.horizontalCenter = 'middle';
        label.verticalCenter = 'middle';
        label.fontSize = 30;
      }
    },
    chartEventDisabled(chart) {
      // chart.seriesContainer.events.on('over', (event) => {
      //   event.target.interactionsEnabled = false;
      // });

      chart.seriesContainer.events.on('click', (event) => {
        event.target.interactionsEnabled = false;
      });
    },
    beforeDestroy() {
      // Clean up chart instance and remove it from the DOM
      if (this.chart) {
        this.chart.dispose();
      }
    },
    updateCategory(category) {
      this.fetchCategory(category);
      this.$nextTick(() => this.$emit('onCategoryChanged'));
    },
    initCategory() {
      if (!this.usageCategoryMap.has(this.category)) {
        this.fetchCategory(this.defaultCategory);
      }
    },
    initParam() {
      this.param = {
        cmpnId: '',
        rsrcType: '',
        accounts: [],
        regions: [],
        svcGrps: [],
        ocpSvcGrps: [],
        tags: [],
      };

      this.targetRsrcInfo = {};
      this.targetTotalCnt = 0;
      this.regionRsrcInfo = {};
      this.regionTotalCnt = 0;
      this.typeRsrcInfo = {};
      this.typeRsrcTotalCnt = 0;
    },
  },
};
</script>
<style>
.unclicked {
  color: #ccc;
}
</style>
