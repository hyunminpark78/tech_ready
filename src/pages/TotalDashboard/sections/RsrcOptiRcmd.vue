<template>
  <div class="box-wrap pb24">
    <div class="title">
      <h4 class="tit-wrap">{{ $t('dashboard.resourceOptimizationRecommendation') }}</h4>
      <button v-if="isAuth && (existUnData || existRsData)" class="more single" @click="routeDetail">
        {{ $t('common.button.viewDetails') }}
      </button>
    </div>
    <div v-if="!isAuth" class="flex flex-col items-center justify-center" style="height: 180px">
      <img src="@/assets/images/ico-nodata-chart.svg" alt="." style="width: 30%; height: 30%" />
      <p class="mt-3 text-gray-700 text-center" style="font-size: 15px">
        미사용 자원에 대한 상세정보와<br />적정자원 추천정보를 제공하는 서비스입니다. <br />
        사용 등록을 원하실 경우 관리자<br />
        <span style="color: #00a5ed; font-size: 15px">(cmp-help@sktelecom.com)</span>에 문의하시길 바랍니다.
      </p>
    </div>
    <div v-else>
      <DataLoadingOverlay v-if="loading" :height="180"></DataLoadingOverlay>
      <template v-else-if="existUnData || existRsData">
        <div v-if="existUnData" class="list7-wrap">
          <div class="col">
            <div class="tit4-wrap">{{ $t('dashboard.unusedResource') }}</div>
            <div class="ls2">
              <div class="n">
                <strong> {{ unTotalCnt }} </strong> {{ $t('dashboard.unit') }}
              </div>
              <div class="p">
                <img src="@/assets/images/ico-pink.svg" alt="." />
                <strong>￦{{ numberCutDecimal(unTotalCost) }}</strong>
              </div>
            </div>
          </div>
          <div class="col">
            <div v-show="existUnData" id="unUsedChart" style="height: 100px"></div>
            <NoDataOverlay v-if="!existUnData" :icon-type="'chart'" :height="100"></NoDataOverlay>
          </div>
        </div>
        <div v-if="existRsData" class="list7-wrap">
          <div class="col">
            <div class="tit4-wrap" style="padding-top: 15px">Rightsizing</div>
            <div class="ls2">
              <div class="n">
                <strong>{{ rsTotalCnt }}</strong> {{ $t('dashboard.unit') }}
              </div>
              <div class="p">
                <img src="@/assets/images/ico-pink.svg" alt="." />
                <strong>￦{{ numberCutDecimal(rsTotalCost) }}</strong>
              </div>
            </div>
          </div>
          <div class="col">
            <div v-show="existRsData" id="rightSizingChart" class="chart-wrap" style="height: 104px"></div>
            <NoDataOverlay v-if="!existRsData" icon-type="'chart'" :height="104"></NoDataOverlay>
          </div>
        </div>
      </template>
      <NoDataOverlay v-else :icon-type="'chart'" :height="180"></NoDataOverlay>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { numberCutDecimal } from '@/pages/Opti/CostOpti/CmmtPsblTgt/CostOptiCommon';
import { hasOptiRole, hasRsrcRole } from './role-permission';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay.vue';
import NoDataOverlay from '@/components/Overlays/NoDataOverlay.vue';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: { DataLoadingOverlay, NoDataOverlay },
  data() {
    return {
      loading: true,
      rank: 2,
      isAuth: hasOptiRole() && hasRsrcRole(),
    };
  },
  computed: {
    ...mapState('totalDashboard', [
      'filter',
      'isSearch',
      'exchangeRate',
      'unusedData',
      'unusedAzureData',
      'rightsizingData',
      'rightsizingAzureData',
      'rsTotalCnt',
      'rsTotalCost',
      'unTotalCnt',
      'unTotalCost',
    ]),
    existUnData() {
      return this.unTotalCnt > 0;
    },
    existRsData() {
      return this.rsTotalCnt > 0;
    },
  },
  watch: {
    '$i18n.locale': 'setChart',
    isSearch(newVal) {
      if (newVal.isSearch) {
        this.setData();
      }
    },
  },
  async created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    am4core.options.autoDispose = true;
    this.setData();
  },
  mounted() {},
  methods: {
    ...mapActions('totalDashboard', [
      'fetchRsOptiSummary',
      'fetchExchangeRate',
      'fetchRsOptiSummaryTable',
      'fetchEc2RsGrid',
      'fetchRsrcRightsizingInit',
    ]),
    ...mapActions('common', ['waitGettingCtrts']),
    numberCutDecimal(number) {
      return numberCutDecimal(number);
    },
    async setData() {
      this.loading = true;

      if (this.isAuth) {
        await this.waitGettingCtrts();
        try {
          await this.fetchExchangeRate(); // 현재 달러 환율.
          if (this.filter.cspTypCd === 'AWS') {
            await this.fetchEc2RsGrid({ ctrtId: this.filter.contract.ctrtId }); // Only used for AWS.
          }
          await this.fetchRsOptiSummaryTable({ ctrtId: this.filter.contract.ctrtId });
          // v-if 구문 사용 시 DOM이 재생성되는 과정에서 chart 렌더링의 높이를 조정하지 못해
          // 화면에 표시되지 않는 문제 발생. 약간의 지연시간을 통해 문제 회피.
          setTimeout(this.setChart, 100);
        } catch (err) {
          this.fetchRsrcRightsizingInit();
          console.error('Error fetching:', err);
        }
      }
      this.loading = false;
    },
    setChart() {
      let unUsedArr = this.sortUnUsedData();
      let rightSizeArr = this.sortRightSizeData();

      // UNUSED
      const unUsedchart = am4core.create('unUsedChart', am4charts.XYChart);
      this.chartEventDisabled(unUsedchart);
      this.createChart('UNUSED', unUsedchart, unUsedArr);

      // RIGHTSIZING
      const rightSizingChart = am4core.create('rightSizingChart', am4charts.XYChart);
      this.chartEventDisabled(rightSizingChart);
      this.createChart('RIGHTSIZING', rightSizingChart, rightSizeArr);

      this.loading = false;
    },
    chartEventDisabled(chart) {
      chart.seriesContainer.events.on('click', (event) => {
        event.target.interactionsEnabled = false;
      });
    },
    sortUnUsedData() {
      let arr = [];
      switch (this.filter.cspTypCd) {
        case 'AWS':
          arr.push({ category: 'EBS', value: this.unusedData.ebsCnt });
          arr.push({ category: 'EIP', value: this.unusedData.eipCnt });
          arr.push({ category: 'ELB', value: this.unusedData.elbCnt });
          arr.push({ category: 'EC2', value: this.unusedData.ec2Cnt });
          arr.push({ category: 'RDS', value: this.unusedData.rdsCnt });
          break;
        case 'AZURE':
          arr.push({ category: 'VM', value: this.unusedAzureData.vmCnt });
          arr.push({ category: 'Disk', value: this.unusedAzureData.diskCnt });
          arr.push({ category: 'Load Balancer', value: this.unusedAzureData.lbCnt });
          arr.push({ category: 'Public IP Address', value: this.unusedAzureData.ipCnt });
          break;
      }

      arr.sort((a, b) => b.value - a.value);

      // Rank Top2
      if (arr.length > this.rank) {
        let etcCnt = 0;
        for (let i = this.rank; i < arr.length; i++) {
          etcCnt += arr[i].value;
        }
        let rankArr = [];
        for (let i = 0; i < this.rank; i++) {
          rankArr.push(arr[i]);
        }
        rankArr.push({ category: 'ETC', value: etcCnt });
        return rankArr;
      } else {
        return arr;
      }
    },
    sortRightSizeData() {
      let arr = [];
      switch (this.filter.cspTypCd) {
        case 'AWS':
          arr.push({ category: 'EC2', value: this.rightsizingData.ec2Cnt });
          arr.push({ category: 'RDS', value: this.rightsizingData.rdsCnt });
          break;
        case 'AZURE':
          arr.push({ category: 'VM', value: this.rightsizingAzureData.vmCnt });
          break;
        default:
          break;
      }

      arr.sort((a, b) => b.value - a.value);
      // Rank Top2
      if (arr.length > this.rank) {
        let etcCnt = 0;
        for (let i = this.rank; i < arr.length; i++) {
          etcCnt += arr[i].value;
        }
        let rankArr = [];
        for (let i = 0; i < this.rank; i++) {
          rankArr.push(arr[i]);
        }
        rankArr.push({ category: 'ETC', value: etcCnt });
        return rankArr;
      } else {
        return arr;
      }
    },
    createChart(type, chart, data) {
      chart.data = data;
      chart.fontFamily = 'AppleSDGothicNeo';
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineY.disabled = true;
      chart.cursor.lineX.disabled = true;
      if (type === 'UNUSED') {
        chart.paddingTop = 20;
        chart.paddingBottom = -13;
        chart.paddingLeft = 0;
        chart.paddingRight = 0;
      } else if (type === 'RIGHTSIZING') {
        chart.paddingTop = 30;
        chart.paddingBottom = -15;
        chart.paddingLeft = 0;
        chart.paddingRight = 0;
      }

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = 'category';
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.labels.template.fontSize = 13;
      categoryAxis.renderer.labels.template.adapter.add('textOutput', (text) => text.replace(/ /g, '\n'));
      categoryAxis.renderer.labels.template.textAlign = 'middle';
      categoryAxis.tooltip.disabled = true;
      categoryAxis.renderer.minGridDistance = 10;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.fontSize = 13;
      valueAxis.fontSize = 13;
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.cellStartLocation = 0.2;
      valueAxis.renderer.cellEndLocation = 0.8;

      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'category';
      series.dataFields.valueY = 'value';
      series.columns.template.column.cornerRadiusTopRight = 5;
      series.columns.template.column.cornerRadiusTopLeft = 5;
      // 각 컬럼의 가로 최대 크기를 (x축 너비 중 컬럼이 차지하는 너비 / 데이터 수)로 지정
      chart.events.on('sizechanged', () => {
        series.columns.template.maxWidth = (categoryAxis.renderer.pixelWidth * 0.8) / (this.rank + 1);
      });
      this.chartDefaultSetting(series, '#fc5aa1');
      series.tooltip.autoTextColor = false;
      series.tooltip.label.fill = am4core.color('#FFFFFF');
      if (i18n.locale === 'ko') {
        series.tooltipText = `{category}: {value}개`;
      } else {
        series.tooltipText = `{category}: {value}unit(s)`;
      }
      series.tooltip.fontSize = 13;
      series.tooltip.label.fontSize = 13;
    },
    chartDefaultSetting(series, color) {
      series.strokeWidth = 0;
      series.sequencedInterpolation = true;

      series.fill = am4core.color(color);
      series.stroke = am4core.color(color);
    },
    routeDetail() {
      let value = {};
      value.contractId = this.filter.contract.ctrtId;
      value.cspTypCd = this.filter.cspTypCd;
      this.$router.push({
        name: '자원대시보드',
        params: value,
        props: true,
      });
    },
  },
};
</script>

<style></style>
