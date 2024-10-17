<template>
  <div class="box-wrap pb24 list-wrap jhplus">
    <div class="title">
      <h4 class="tit-wrap">{{ $t('dashboard.aiBasedCostAnalytics') }}</h4>
    </div>
    <div class="list7-wrap">
      <div class="tit4-wrap" style="margin-bottom: -40px">
        {{ $t('dashboard.costAnomalyDetection') }}
        <button class="more single" @click="routeFraudDetection(null)">{{ $t('common.button.viewDetails') }}</button>
      </div>
      <DataLoadingOverlay v-if="detectionLoading" :height="226"></DataLoadingOverlay>
      <NoDataOverlay v-else-if="!existDetectionData" :icon-type="'chart'" :height="225"></NoDataOverlay>
      <div v-show="existDetectionData && !detectionLoading" class="chart-wrap" style="height: 43px">
        <div>
          <CardMessage v-if="isAbNormal && $i18n.locale === 'ko'">
            <OcpTextInline>
              <span class="txt__status" :class="getAiGuideAlarm()">{{ aiGuide.alarm }}</span>
              {{ aiGuide.cspTypCd }}의 실제비용이 AI 예측 비용 대비
            </OcpTextInline>
            <OcpTextInline secondary>{{ aiGuide.priceText }}({{ aiGuide.rate }})</OcpTextInline>
            <OcpTextInline>{{ aiGuide.upDown }}했습니다.</OcpTextInline>
          </CardMessage>
          <CardMessage v-if="isAbNormal && $i18n.locale === 'en'">
            <OcpTextInline>
              <span class="txt__status" :class="getAiGuideAlarm()">{{ aiGuide.alarm }}</span>
              {{ aiGuide.cspTypCd }} actual cost compared to AI predicted cost
            </OcpTextInline>
            <OcpTextInline>{{ aiGuide.upDown }}</OcpTextInline>
            <OcpTextInline secondary>{{ aiGuide.priceText }}({{ aiGuide.rate }})</OcpTextInline>
          </CardMessage>
        </div>
      </div>
      <div v-show="existDetectionData && !detectionLoading">
        <GAreaCardCostChart
          chart-height="173"
          chart-theme="dash_abNormalDetect"
          chart-location="FraudDetection"
          :data="abNormalDetect"
          :props-info="detectPropsInfo"
          :curcy-code="getCurcyCode()"
          @route-fraud-detection="routeFraudDetection"
        />
        <!--               <g-area-chart-->
        <!--                  chart-height="183"-->
        <!--                  chart-theme="dash_abNormalDetect"-->
        <!--                  chart-location="FraudDetection"-->
        <!--                  :data="abNormalDetect"-->
        <!--                  :props-info="detectPropsInfo"-->
        <!--                  :curcy-code="getCurcyCode()"-->
        <!--                  @route-fraud-detection="routeFraudDetection"-->
        <!--                />-->
      </div>
    </div>
  </div>
</template>

<script>
import GAreaCardCostChart from '@/pages/Dashboard/cards/GAreaCardCostChart.vue';
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import { CardMessage } from '@/components/Card';
import { OcpTextInline } from '@/components/shared/Text';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import _ from 'lodash';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay.vue';
import NoDataOverlay from '@/components/Overlays/NoDataOverlay.vue';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: { GAreaCardCostChart, OcpTextInline, CardMessage, DataLoadingOverlay, NoDataOverlay },
  data() {
    return {
      existPatternData: false,
      patternLoading: true,
      existDetectionData: false,
      detectionLoading: true,
      detectPropsInfo: {
        dateProp: 'forcstDt',
      },
      propsInfo: {
        keyProp: 'cspPrdtCd',
        insProp: ['curCost', 'bfCost', 'maxCost', 'avgCost'],
        isFormat: true,
      },
      aiGuide: {
        service: '',
        rate: '',
        alarm: '',
      },
      patternGuide: {
        service: '',
        rate: '',
      },
      isAbNormal: false,
      cspTypCd: '',
    };
  },
  computed: {
    ...mapState('totalDashboard', ['filter', 'aiPattern', 'isSearch', 'abNormalDetect', 'fraudDetection']),
    // 차트
    styleObject() {
      return {
        height: this.chartHeight + 'px',
      };
    },
    //
    convertData() {
      let cData = _.cloneDeep(this.aiPattern);
      let tList = [];
      _.map(cData, (item) => {
        let newMap = {};
        if (item.bfCost === undefined || item.bfCost === '') {
          newMap['cspPrdtCd'] = item.cspPrdtCd;
          newMap['billYm'] = item.billYm;
          newMap['curCost'] = item.curCost;
          newMap['bfCost'] = '0';
          newMap['maxCost'] = item.maxCost;
          newMap['avgCost'] = item.avgCost;
          tList.push(newMap);
        }
        if (item.curCost === undefined || item.curCost === '') {
          newMap['cspPrdtCd'] = item.cspPrdtCd;
          newMap['billYm'] = item.billYm;
          newMap['curCost'] = '0';
          newMap['bfCost'] = item.bfCost;
          newMap['maxCost'] = item.maxCost;
          newMap['avgCost'] = item.avgCost;
          tList.push(newMap);
        }
      });

      if (tList.length > 0) {
        cData = tList;
      }
      return cData;
    },
  },
  watch: {
    // 다국어 변경 시 차트를 재매핑
    '$i18n.locale': 'setData',
    isSearch: function (newVal) {
      if (newVal.isSearch) {
        this.cspTypCd = this.filter.cspTypCd;
        this.patternLoading = true;
        this.detectionLoading = true;
        this.setData();
      }
    },
    filter: function (newVal) {
      this.cspTypCd = newVal.cspTypCd;
    },
  },
  created() {
    am4core.useTheme(am4themes_animated);
    am4core.addLicense('CH303240742');
    am4core.options.autoDispose = true;
    // INIT
    this.cspTypCd = this.filter.cspTypCd;
    this.patternLoading = true;
    this.detectionLoading = true;
  },
  mounted() {},
  methods: {
    i18n() {
      return i18n;
    },
    ...mapActions('totalDashboard', ['fetchAiPatternAnalysis', 'fetchFraudDetection', 'fetchAbNormalDetect']),
    ...mapActions('common', ['waitGettingCtrts']),
    async setData() {
      await this.waitGettingCtrts();
      await this.fetchAbNormalDetect({ ctrtId: this.filter.contract.ctrtId }).then(() => {
        if (this.abNormalDetect && this.abNormalDetect.length > 0) {
          this.existDetectionData = true;
          this.detectionLoading = false;
          this.fetchFraudDetection({ ctrtId: this.filter.contract.ctrtId, headerType: 'TOTAL' }).then(() => {
            if (this.fraudDetection && this.fraudDetection.length > 0) {
              this.setDetectionData(this.abNormalDetect, this.fraudDetection);
            }
          });
        } else {
          this.existDetectionData = false;
          this.detectionLoading = false;
        }
      });

      await this.fetchAiPatternAnalysis({ ctrtId: this.filter.contract.ctrtId }).then(() => {
        if (this.aiPattern && this.aiPattern.length > 0) {
          this.existPatternData = true;
          this.setPatternData(this.aiPattern);
          this.setPatternChart();
        } else {
          this.existPatternData = false;
          this.patternLoading = false;
        }
      });
    },
    setPatternData(data) {
      let topData = data[0];
      let cur = topData.pricingCurcyCd === 'USD' ? '$' : '₩';
      this.patternGuide.service = topData.cspPrdtCd;
      // TOP1의 전월데이터가 0일때는 당월 사용금액 표기(08.27)
      if (Math.abs(Number(topData.bfCost)) === 0) {
        this.patternGuide.rate = cur + numberWithCommas(topData.curCost);
      } else {
        if (topData.diffRate === undefined || topData.diffRate === '') {
          if (topData.curCost === undefined || topData.curCost === '') {
            topData.curCost = 0;
          }
          if (topData.bfCost === undefined || topData.bfCost === '') {
            topData.bfCost = 0;
          }
          let price = Math.abs(Number(topData.curCost) - Number(topData.bfCost));
          this.patternGuide.rate = cur + numberWithCommas(price);
        } else {
          this.patternGuide.rate = Number.parseFloat(topData.diffRate).toFixed(2) + '%';
        }
      }
    },
    setPatternChart() {
      const data = this.convertData;
      const chart = am4core.create('patternChart', am4charts.XYChart);
      this.chartEventDisabled(chart);
      this.createBarChart(chart, data);
      this.patternLoading = false;
    },
    chartEventDisabled(chart) {
      chart.seriesContainer.events.on('click', (event) => {
        event.target.interactionsEnabled = false;
      });
    },
    createBarChart(chart, data) {
      chart.data = data;
      chart.fontFamily = 'AppleSDGothicNeo';
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.maxTooltipDistance = -1;
      chart.cursor.lineY.disabled = true;
      chart.cursor.lineX.disabled = true;
      chart.paddingLeft = -10;
      chart.paddingBottom = -10;

      chart.legend = new am4charts.Legend();
      chart.legend.position = 'bottom';
      chart.legend.fontSize = 13;
      chart.legend.align = 'center';
      chart.legend.showData = false;

      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 11;
      markerTemplate.height = 11;

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'cspPrdtCd';
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.labels.template.fontSize = 13;
      categoryAxis.renderer.cellStartLocation = 0.15;
      categoryAxis.renderer.cellEndLocation = 0.85;
      categoryAxis.renderer.minGridDistance = 0;
      categoryAxis.tooltip.disabled = true;
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.renderer.labels.template.adapter.add('textOutput', function (text) {
        if (text !== '' && text !== undefined) {
          if (text.length > 10) {
            text = ''.concat(text.substring(0, 10), '...');
          }
        }
        return text;
      });

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.fontSize = 13;
      valueAxis.renderer.labels.template.disabled = true;
      valueAxis.renderer.minGridDistance = 22;
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.tooltip.disabled = true;

      /* 범례 커스텀 */
      let thisMonth = '';
      let nextMonth = '';
      const series1 = chart.series.push(new am4charts.ColumnSeries());
      series1.dataFields.categoryX = 'cspPrdtCd';
      series1.dataFields.valueY = 'curCost';
      const series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.categoryX = 'cspPrdtCd';
      series2.dataFields.valueY = 'bfCost';

      // 다국어 처리
      if (i18n.locale === 'ko') {
        thisMonth = moment(data[0].billYm).format('M');
        nextMonth = moment(data[0].billYm).subtract(1, 'months').format('M');
        series1.name = thisMonth + '월';
        series2.name = nextMonth + '월';
      } else {
        thisMonth = moment(data[0].billYm, 'YYYYMM').format('MMM');
        nextMonth = moment(data[0].billYm, 'YYYYMM').subtract(1, 'months').format('MMM');
        series1.name = thisMonth;
        series2.name = nextMonth;
      }
      this.chartDefaultSetting(series1, '#00a5ed');
      this.tooltipSetting(chart, series1, data);
      this.chartDefaultSetting(series2, '#1ae3bb');
      this.tooltipSetting(chart, series2, data);

      const series3 = chart.series.push(new am4charts.ColumnSeries());
      series3.dataFields.categoryX = 'cspPrdtCd';
      series3.dataFields.valueY = 'maxCost';
      series3.name = 'Max';
      this.chartDefaultSetting(series3, '#fc5aa1');
      this.tooltipSetting(chart, series3, data);

      const series4 = chart.series.push(new am4charts.ColumnSeries());
      series4.dataFields.categoryX = 'cspPrdtCd';
      series4.dataFields.valueY = 'avgCost';
      series4.name = 'Avg';
      this.chartDefaultSetting(series4, '#a166f1');
      this.tooltipSetting(chart, series4, data);
    },
    chartDefaultSetting(series, color) {
      series.fill = am4core.color(color);
      series.stroke = am4core.color(color);
    },
    tooltipSetting(chart, series, data) {
      series.adapter.add('tooltipHTML', (html, target) => {
        series.tooltip.getFillFromObject = false;
        series.tooltip.strokeOpacity = 1;
        series.tooltip.getStrokeFromObject = false;
        series.tooltip.background.stroke = am4core.color('#6c9fb2');
        series.tooltip.background.fill = am4core.color('white');
        series.tooltip.label.fill = am4core.color('#6c9fb2');
        series.tooltip.fontSize = 12;
        let t = target.tooltipDataItem.categoryX;
        let data = _.filter(chart.data, (d) => d.cspPrdtCd === t);
        data = data[0];

        let thisMonth = '';
        let nextMonth = '';
        let curcy = data.pricingCurcyCd === 'USD' ? '$' : '₩';
        let strHtml = "<div class='aiPatternDiv'>" + data.cspPrdtCd + '</br></br>';

        // 다국어 처리
        if (i18n.locale === 'ko') {
          thisMonth = moment(data.billYm).format('M');
          nextMonth = moment(data.billYm).subtract(1, 'months').format('M');
          strHtml += thisMonth + '월 : ' + curcy + numberWithCommas(data.curCost) + ' </br>';
          strHtml += nextMonth + '월 : ' + curcy + numberWithCommas(data.bfCost) + ' </br>';
        } else {
          thisMonth = moment(data.billYm, 'YYYYMM').format('MMM');
          nextMonth = moment(data.billYm, 'YYYYMM').subtract(1, 'months').format('MMM');
          strHtml += thisMonth + ' : ' + curcy + numberWithCommas(data.curCost) + ' </br>';
          strHtml += nextMonth + ' : ' + curcy + numberWithCommas(data.bfCost) + ' </br>';
        }
        strHtml += 'Max :  ' + curcy + numberWithCommas(data.maxCost) + ' </br>';
        strHtml += 'Avg :  ' + curcy + numberWithCommas(data.avgCost);
        return strHtml;
      });
    },
    setDetectionData(abNormal, data) {
      let diffToday = [];
      if (abNormal !== undefined && abNormal.length > 0) {
        diffToday = _.filter(abNormal, (item) => Number(item.diffDay) === 0);
        this.isAbNormal = diffToday[0].anomlYn === 'Y';
      }

      if (data !== undefined && data.length > 0) {
        let tmpData = data[data.length - 1];
        let grade = '';
        if (i18n.locale === 'ko') {
          switch (tmpData.armGrade) {
            case 'G':
              grade = '보통';
              break;
            case 'C':
              grade = '심각';
              break;
            case 'I':
              grade = '중요';
              break;
          }
        }
        if (i18n.locale === 'en') {
          switch (tmpData.armGrade) {
            case 'G':
              grade = 'Normal';
              break;
            case 'C':
              grade = 'Critical';
              break;
            case 'I':
              grade = 'Important';
              break;
          }
        }
        let price = _.replace(diffToday[0].diffCost, '$', '').replaceAll(',', '');
        let pricingCurcyCd = diffToday[0].pricingCurcyCd === 'KRW' ? ' ₩' : ' $';
        let cspTypCd = tmpData.cspTypCd;
        let msg = '';
        if (i18n.locale === 'ko') {
          msg = Number(price) > 0 ? '증가' : '감소';
        } else {
          msg = Number(price) > 0 ? 'increased' : 'decreased';
        }
        this.aiGuide.alarm = grade;
        this.aiGuide.upDown = msg;
        this.aiGuide.cspTypCd = cspTypCd;
        this.aiGuide.price = numberWithCommas(price);
        this.aiGuide.rate = Math.abs(diffToday[0].diffRate) + '%';
        this.aiGuide.pricingCurcyCd = pricingCurcyCd;
        if (this.aiGuide.price.indexOf('-') !== -1 && this.aiGuide.price.indexOf('-') === 0) {
          this.aiGuide.priceText = '-' + pricingCurcyCd + numberWithCommas(price).substring(1);
        }
      }
    },
    getAiGuideAlarm() {
      // class style 분기 처리
      if (this.aiGuide.alarm === '심각' || this.aiGuide.alarm === 'Critical') {
        return 'serious';
      }
      if (this.aiGuide.alarm === '중요' || this.aiGuide.alarm === 'Important') {
        return 'important';
      } else {
        return 'normal';
      }
      // return this.aiGuide.alarm === '심각' ? 'serious' : this.aiGuide.alarm === '중요' ? 'important' : 'normal';
    },
    routeFraudDetection(value) {
      if (value === null) {
        value = {};
        value.ctrtId = this.filter.contract.ctrtId;
        value.detail = 'Y';
      }
      this.$router.push({
        name: '이상비용탐지',
        params: value,
        props: true,
      });
    },
    routeCostPattern(value) {
      if (value === null) {
        value = {};
        value.ctrtId = this.filter.contract.ctrtId;
        value.detail = 'Y';
      }
      this.$router.push({
        name: '비용패턴분석',
        params: value,
        props: true,
      });
    },
    getCurcyCode() {
      if (this.abNormalDetect.length > 0) {
        return this.abNormalDetect[0].pricingCurcyCd;
      }
      return 'USD';
    },
  },
};
</script>
