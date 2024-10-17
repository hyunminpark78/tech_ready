<template>
  <div class="outer">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <section class="z-30 p-8 rounded alarm-detail-content">
      <!-- Popup Header -->
      <div>
        <h2 class="mb-4 text-2xl text-primary-400 relative">
          {{ $t('cost.alarmDetails') }}
          <button @click="viewToolTip('titleToolTip')"><img src="@/assets/images/ico-info.svg" alt="." /></button>

          <div
            v-show="onToolTip.titleToolTip"
            class="absolute z-10 p-4 pr-12 font-normal text-gray-700 bg-white border rounded border-primary-400 text-xs- popup-comment left__120"
          >
            {{ $t('cost.checkDetailsAlarms') }}
            <img src="@/assets/images/arrow.jpg" alt="." />
            <button @click="viewToolTip('titleToolTip')" class="absolute top-0 right-0 mt-2.5 mr-2">
              <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
            </button>
          </div>
        </h2>
        <button @click="popUpOff" class="absolute top-0 right-0 close-policy-modal mt-7 mr-7">
          <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
        </button>
      </div>
      <!--// Popup Header -->

      <!-- Content -->
      <div class="inner__wrap">
        <div v-if="i18n().locale === 'ko'" class="inner_header">
          <!-- <span class="status">심각</span>AWS의 실제 비용이 AI 예측 비용 대비 -->
          <span class="txt__status" :class="getArmGradeCss()">{{ getArmGradeMsg() }}</span>
          {{ fraudDetectionDetail.cspTypCd }}의 실제비용이 AI 예측 비용 대비&nbsp;
          <span class="price">{{ getPrice() }}</span>
          &nbsp;{{ fraudDetectionDetail.diffCost > 0 ? '증가' : '감소' }}했습니다.
        </div>
        <div v-if="i18n().locale === 'en'" class="inner_header">
          <!-- <span class="status">심각</span>AWS의 실제 비용이 AI 예측 비용 대비 -->
          <span class="txt__status" :class="getArmGradeCss()">{{ getArmGradeMsg() }}</span>
          {{ fraudDetectionDetail.cspTypCd }} actual cost
          {{ fraudDetectionDetail.diffCost > 0 ? 'increased by ' : 'decreased by ' }}&nbsp;
          <span class="price">{{ getPrice() }}</span>
          compared to AI-predicted cost.
        </div>

        <div class="col2__wrap">
          <div class="col2_item">
            <div class="title">{{ $t('cost.abnormalCostDetection') }}</div>

            <div class="chart_box" style="height: 200px">
              <GAreaCardCostChart
                chart-height="300"
                chart-theme="dash_abNormalDetect"
                chart-location="FraudDetectionDetail"
                :data="abNormalDetect"
                :props-info="propsInfo"
                :curcyCode="getCurcyCode()"
              />
            </div>
          </div>
          <div class="col2_item">
            <div class="title flex items-center">
              {{ $t('cost.anomalyDetectionMethod') }}
              <button class="ml-3 mt__3 cursor-pointer" @click="viewToolTip('rightToolTip')">
                <img src="@/assets/images/ico-infomation.svg" alt="." />
              </button>
              <div
                v-show="onToolTip.rightToolTip"
                class="absolute z-10 p-4 pr-12 font-normal text-gray-700 bg-white border rounded border-primary-400 text-xs- popup-comment left__85"
              >
                {{ $t('cost.anomalyCostDetected') }}
                <img src="@/assets/images/arrow.jpg" alt="." />
                <button @click="viewToolTip('rightToolTip')" class="absolute top-0 right-0 mt-2.5 mr-2">
                  <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
                </button>
              </div>
            </div>

            <div v-if="i18n().locale === 'ko'" class="info__txtbox mt__10">
              {{ getAnalDt() }}의 클라우드 사용량과 비용을 분석한 결과
              <span>{{ anomlCtntCnt }}개의 AI 모델에서 이상 비용이 탐지</span>되었습니다.
            </div>
            <div v-if="i18n().locale === 'en'" class="info__txtbox mt__10">
              After analyzing cloud usage and costs on {{ getAnalDt() }},
              <span>{{ anomlCtntCnt }} AI models detected abnormal costs</span>
            </div>

            <ul class="detection_wrap">
              <li v-show="isInAnomlCtnt('ARIMA')">
                <div class="ico_dot"></div>
                <div class="right_txtbox">
                  <div class="title_txt">ARIMA(Autoregressive Integrated Moving Average)</div>
                  <div class="con_txt">
                    {{ $t('cost.timeSeriesPredicts') }}
                  </div>
                </div>
              </li>
              <li v-show="isInAnomlCtnt('ETS')">
                <div class="ico_dot"></div>
                <div class="right_txtbox">
                  <div class="title_txt">ETS(Exponential Smoothing)</div>
                  <div class="con_txt">
                    {{ $t('cost.timeSeriesGives') }}
                  </div>
                </div>
              </li>
              <li v-show="isInAnomlCtnt('PCR')">
                <div class="ico_dot"></div>
                <div class="right_txtbox">
                  <div class="title_txt">PCR(Principal Component Regression)</div>
                  <div class="con_txt">
                    {{ $t('cost.modelUsesPrincipal') }}
                  </div>
                </div>
              </li>
            </ul>

            <div class="rate__wrap">
              <div class="rate_item">
                <div class="reate_title">{{ $t('cost.fluctuationRate') }}</div>
                <!--
                - 업, 다운 아이콘 : class="ico_arrow"에 클레스 'up', 'down'
                -->
                <div class="rate_numbox" :class="fraudDetectionDetail.diffCost > 0 ? 'up' : 'down'">
                  <i class="ico_arrow"></i>
                  <span class="b__txt"
                    >{{ getCurcyUnit(fraudDetectionDetail.pricingCurcyCd) }}{{ fraudDetectionDetail.diffCost }}</span
                  >
                  ({{ fraudDetectionDetail.diffRate }}%)
                </div>
              </div>
              <div class="rate_item">
                <div class="cost__box">
                  <div class="cost__title">{{ $t('cost.aiPredictionCost') }}</div>
                  <div class="cost_num">
                    {{ getCurcyUnit(fraudDetectionDetail.pricingCurcyCd) }} {{ fraudDetectionDetail.forcstCost }}
                  </div>
                </div>
                <div class="cost__box">
                  <div class="cost__title">{{ $t('cost.actualCosts') }}</div>
                  <div class="cost_num">
                    {{ getCurcyUnit(fraudDetectionDetail.pricingCurcyCd) }} {{ fraudDetectionDetail.realCost }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FraudDetectionDetailGrid ref="detailGrid" />
      </div>
      <!--// Content -->

      <!-- Bottom Button -->
      <div class="popbtn__wrap">
        <button type="button" class="popbtm_btn" @click="popUpOff">{{ $t('common.button.close') }}</button>
      </div>
      <!--// Bottom Button -->
    </section>
  </div>
</template>

<script>
import FraudDetectionDetailGrid from './FraudDetectionDetailGrid.vue';
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import _ from 'lodash';
import { i18n } from '../../../../public/locales/i18n';
import GAreaCardCostChart from '@/pages/Dashboard/cards/GAreaCardCostChart.vue';

export default {
  components: { GAreaCardCostChart, FraudDetectionDetailGrid },
  props: {
    param: {
      type: Object,
      default: () => {
        return {
          ctrtId: '',
          analDt: '',
        };
      },
    },
  },
  data() {
    return {
      propsInfo: {
        dateProp: 'forcstDt',
      },
      contractId: this.$route.params.ctrtId || null,
      onToolTip: {
        titleToolTip: false,
        rightToolTip: false,
        gridToolTip: false,
      },
      // GRID //
      gridOptions: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: {
        suppressSizeToFit: true,
      },
      frameworkComponents: null,
      // GRID //
    };
  },
  computed: {
    ...mapState('dashboard', ['abNormalDetect']),
    ...mapState('analysis', ['fraudDetectionDetail', 'fraudDetectionDetailGrid']),
    anomlCtntCnt() {
      let anomlCtntArr = this.fraudDetectionDetail.anomlCtnt.split(',');
      return anomlCtntArr.length;
    },
  },
  watch: {
    // contractId() {
    //   this.fetchFraudDetectionDetail({ ctrtId: this.contractId });
    //   this.fetchFraudDetectionDetailGrid({ ctrtId: this.contractId });
    // },
    param: {
      deep: true,
      handler() {
        this.fetchFraudDetectionDetail(this.param);
        this.fetchFraudDetectionDetailGrid(this.param);
      },
    },
  },
  created() {
    if (!this.contractId) {
      return;
    }
    this.setAiFilter({ ctrtId: this.contractId });
  },
  methods: {
    i18n() {
      return i18n;
    },
    ...mapActions('analysis', ['fetchFraudDetectionDetail', 'fetchFraudDetectionDetailGrid']),
    getCurcyCode() {
      if (this.abNormalDetect.length > 0) {
        return this.abNormalDetect[0].pricingCurcyCd;
      }
      return 'USD';
    },
    getCurcyUnit(curcyCd) {
      return curcyCd === 'KRW' ? '₩' : '$';
    },
    getArmGradeCss() {
      return this.fraudDetectionDetail.armGrade === 'C'
        ? 'serious'
        : this.fraudDetectionDetail.alarm === 'I'
        ? 'important'
        : 'normal';
    },
    getArmGradeMsg() {
      return this.fraudDetectionDetail.armGrade === 'C'
        ? this.$t('cost.critical')
        : this.fraudDetectionDetail.alarm === 'I'
        ? this.$t('cost.important')
        : this.$t('cost.normal');
    },
    getPrice() {
      let diffCost = Math.abs(this.fraudDetectionDetail.diffCost);
      let diffRate = Math.abs(this.fraudDetectionDetail.diffRate);
      let curcyCd = this.getCurcyUnit(this.fraudDetectionDetail.pricingCurcyCd);
      return `${curcyCd}${diffCost}(${diffRate}%)`;
    },
    getAnalDt() {
      return moment(this.param.analDt).format('YYYY.MM.DD');
    },
    isInAnomlCtnt(anomlCtnt) {
      let anomlCtntArr = this.fraudDetectionDetail.anomlCtnt.split(',');
      return _.includes(anomlCtntArr, anomlCtnt);
    },
    viewToolTip(toolTip) {
      this.onToolTip[toolTip] = !this.onToolTip[toolTip];
    },
    popUpOff() {
      this.onToolTip['titleToolTip'] = false;
      this.onToolTip['rightToolTip'] = false;
      this.$refs.detailGrid.onToolTip['gridToolTip'] = false;
      this.$emit('popUpOff');
    },
  },
};
</script>
