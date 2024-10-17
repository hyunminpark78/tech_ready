<template>
  <Card v-if="hasData" border="2" :wrapper-class="dualData">
    <!-- 이상 비용 탐지 (main) -->
    <div class="flex items-center justify-between">
      <h3 class="mb-1 font-bold relative flex items-center">
        이상 비용 탐지
        <button class="ml-3 cursor-pointer" @click="clickInfo(true)">
          <img src="@/assets/images/ico-infomation.svg" alt="." />
        </button>
        <div
          v-show="isShowInfo"
          class="
            absolute
            z-10
            p-4
            pr-12
            font-normal
            text-gray-700
            bg-white
            border
            rounded
            border-primary-400
            text-xs-
            popup-comment
            left__100
          "
        >
          <p class="title"><img src="@/assets/images/ico_person_data.svg" alt="." />이상 비용 탐지 서비스란?</p>
          클라우드 사용량과 비용 데이터를 학습한 후 머신러닝 알고리즘으로 클라우드 사용량과 비용을 실시간으로 분석하고,
          평소와 다른 사용 패턴을 매일 탐지하여 사용자가 설정한 AI 탐지 민감도에 따라 알람을 발송하는 서비스입니다.
          <img src="@/assets/images/arrow.jpg" alt="." />
          <button class="absolute top-0 right-0 mt-2.5 mr-2" @click="clickInfo(false)">
            <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
          </button>
        </div>
      </h3>

      <div class="flex items-center">
        <CardIconSensitivity @click="$emit('sensitivity-change', 'sensitivity')" />
        <CardIconUserArmIntvl @click="$emit('sensitivity-change', 'userArmIntvl')" />
      </div>
    </div>
    <CardMessage v-if="isAbNormal">
      <OcpTextInline>
        <span class="txt__status" :class="getAiGuideAlarm()">{{ aiGuide.alarm }}</span> {{ aiGuide.cspTypCd }}의 실제비용이 AI 예측 비용 대비
      </OcpTextInline>
      <OcpTextInline secondary>{{ aiGuide.pricingCurcyCd }}{{ aiGuide.price }}({{ aiGuide.rate }})</OcpTextInline>
      <OcpTextInline>{{ aiGuide.upDown }}했습니다.</OcpTextInline>
    </CardMessage>

    <CardMain>
      <div class="relchart__wrap">
        <div class="abs__text">
          민감도 : <span>{{ getSenseMsg() }}</span>
        </div>
        <div class="mt-5">
          <g-area-chart
            :curcyCode="getCurcyCode()"
            chartHeight="287"
            chartTheme="dash_abNormalDetect"
            chartLocation="CardFraudDetection"
            :data="abNormalDetect"
            :propsInfo="propsInfo"
            @route-fraud-detection="routeFraudDetection"
          />
        </div>
      </div>
    </CardMain>
    <!-- <template v-else>
      <div class="flex justify-between">
        <div>
          <h3 class="mb-1 font-bold">이상 비용 탐지</h3>
        </div>
        <div></div>
      </div>

      <div class="relative mt-8 nodata">
        <img src="@/assets/images/chart-nodata-05.svg" alt="." class="" />
        <p class="text-xl font-bold text-primary-600">
          표시할 데이터를 수집중입니다
        </p>
      </div>
    </template> -->
  </Card>
</template>

<script>
import Card, { CardIconSensitivity, CardIconUserArmIntvl, CardMain, CardMessage } from '@/components/Card';
import { mapState, mapGetters } from 'vuex';
import { OcpTextInline } from '@/components/shared/Text';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
import * as _ from 'lodash';

export default {
  components: {
    Card,
    CardMain,
    CardMessage,
    OcpTextInline,
    CardIconSensitivity,
    CardIconUserArmIntvl,
    // CardIconCause,
  },
  props: {
    senseVal: {
      type: String,
      default: 'M',
    },
  },
  data() {
    return {
      propsInfo: {
        dateProp: 'forcstDt',
      },
      aiGuide: {
        isAbNormal: false,
        alarm: '',
        rate: '',
        price: '',
        upDown: '',
        cspTypCd: '',
        pricingCurcyCd: '',
      },
      isShowInfo: false,
    };
  },
  computed: {
    ...mapState('dashboard', ['abNormalDetect', 'aiPattern']),
    ...mapState('analysis', ['fraudDetection']),
    ...mapGetters('dashboard', ['selectedContract']),
    hasData() {
      if (this.abNormalDetect.length > 0) {
        this.setData(this.abNormalDetect, this.fraudDetection);
        return true;
      }
      return false;
    },
    fraudDetectionRouterLinkTo() {
      return {
        name: '이상 비용 탐지',
        params: { ctrtId: this.selectedContract.ctrtId },
      };
    },
    dualData() {
      return this.abNormalDetect.length > 0 && this.aiPattern.length === 0
        ? 'flex-1 p-8 bg-white border rounded-lg border-primary-200 dashboard-card'
        : 'p-8 bg-white rounded-lg border-primary-200 dashboard-card';
    },
    getFraudDetection() {
      return this.fraudDetection.length > 0 ? this.fraudDetection : [];
    },
  },
  watch: {},
  methods: {
    setData(abNormal, data) {
      let diffToday = [];
      if (abNormal !== undefined && abNormal.length > 0) {
        diffToday = _.filter(abNormal, (item) => Number(item.diffDay) === 0);
        this.isAbNormal = diffToday[0].anomlYn === 'Y' ? true : false;
      }

      if (data !== undefined && data.length > 0) {
        let tmpData = data[data.length - 1];
        let grade = '';
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
        console.log('diffToday[0]', diffToday[0]);
        let price = _.replace(diffToday[0].diffCost, '$', '').replaceAll(',', '');
        let pricingCurcyCd = diffToday[0].pricingCurcyCd === 'KRW' ? ' ₩' : ' $';
        let cspTypCd = tmpData.cspTypCd;
        let msg = Number(price) > 0 ? '증가' : '감소';
        this.aiGuide.alarm = grade;
        this.aiGuide.upDown = msg;
        this.aiGuide.cspTypCd = cspTypCd;
        this.aiGuide.price = numberWithCommas(price);
        this.aiGuide.rate = Math.abs(diffToday[0].diffRate) + '%';
        this.aiGuide.pricingCurcyCd = pricingCurcyCd;
      }
    },
    getAiGuideAlarm() {
      return this.aiGuide.alarm === '심각' ? 'serious' : this.aiGuide.alarm === '중요' ? 'important' : 'normal';
    },
    getCurcyCode() {
      if (this.abNormalDetect.length > 0) {
        return this.abNormalDetect[0].pricingCurcyCd;
      }
      return 'USD';
    },
    getSenseMsg() {
      let val = this.senseVal;
      return val === 'H' ? '높음' : val === 'L' ? '낮음' : '중간';
    },
    clickInfo(isShow) {
      this.isShowInfo = isShow;
    },
    routeFraudDetection(value) {
      this.$router.push({
        name: '이상비용탐지',
        params: value,
        props: true,
      });
    },
  },
};
</script>
