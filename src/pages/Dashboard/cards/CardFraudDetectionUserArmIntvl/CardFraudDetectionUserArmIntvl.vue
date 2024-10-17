<template>
  <Card :wrapper-class="dualData" border="2">
    <!-- 민감도 설정 (flip) -->
    <!-- <CardHeader type1 title="민감도 설정" :title-icon-src="require('@/assets/images/ico-info.svg')" /> -->
    <div class="flex items-center relative">
      <h3 class="mr-3 font-bold">알람 구간 설정</h3>
      <button @click="clickInfo(true)"><img src="@/assets/images/ico-info.svg" alt="." /></button>

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
          left__80
        "
      >
        실제 비용과 AI 예측 비용 간의 차이를 기반으로 등급을 구분하여 알람을 설정할 수 있습니다.
        <img src="@/assets/images/arrow.jpg" alt="." />
        <button class="absolute top-0 right-0 mt-2.5 mr-2" @click="clickInfo(false)">
          <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
        </button>
      </div>
    </div>

    <CardMain>
      <div>
        <div class="info__txtbox">
          - <span>최소 7일 이상 경과</span>해야 AI 서비스를 사용할 수 있습니다.<br />
          - 지난 14일 간(최초 설정 시 7일)의 <span>사용 패턴을 분석하여 모델을 생성</span>합니다.<br />
          - 매일 사용 패턴을 분석하여 재학습합니다.
        </div>

        <div class="gauge__wrap">
          <div class="rule_txt">단위 : {{ getCurcyUnit() }}</div>
          <div class="img__wrap"><img src="@/assets/images/img_sensitivity_alaram.svg" alt="." /></div>
          <div class="input__wrap">
            <input v-model="intvl.intvlStrAmt" type="text" />
            <input v-model="intvl.intvlEndAmt" type="text" />
          </div>
        </div>

        <div class="flex btnbox__210 box__center mt__20">
          <Button primary @click="onBtn('confirm')">저장</Button>
          <Button @click="onBtn('cancel')">취소</Button>
        </div>
      </div>
    </CardMain>
  </Card>
</template>

<script>
import Card, { CardHeader, CardMain } from '@/components/Card';
import Button from './CardFraudDetectionUserArmIntvlButton.vue';
import { mapState } from 'vuex';
import * as _ from 'lodash';

export default {
  components: {
    Button,
    Card,
    // CardHeader,
    CardMain,
  },
  props: {
    userArmIntvl: {
      type: Object,
      default: () => {
        return {
          intvlStrAmt: 0,
          intvlEndAmt: 0,
        };
      },
    },
  },
  data() {
    return {
      intvl: {
        intvlStrAmt: 0,
        intvlEndAmt: 0,
      },
      isShowInfo: false,
    };
  },
  computed: {
    ...mapState('dashboard', ['abNormalDetect', 'aiPattern']),
    dualData() {
      return this.abNormalDetect.length > 0 && this.aiPattern.length === 0
        ? 'flex-1 p-8 bg-white border-2 rounded-lg border-primary-200 dashboard-card flip'
        : 'p-8 bg-white rounded-lg border-primary-200 dashboard-card';
    },
  },
  watch: {
    userArmIntvl() {
      this.intvl = _.cloneDeep(this.userArmIntvl);
    },
    'intvl.intvlStrAmt'() {
      // 정수만
      this.intvl.intvlStrAmt = this.getInt(this.intvl.intvlStrAmt);
      this.intvl.intvlStrAmt = Math.floor(this.intvl.intvlStrAmt);
      // 최대는 원화 1억 미만, 달러 10만달러 미만
      let maxVal = this.getCurcyCode() === 'KRW' ? 100000000 : 100000;
      if (this.intvl.intvlStrAmt > maxVal) {
        this.intvl.intvlStrAmt = maxVal;
      }
      // 천단위 콤마 표기
      this.intvl.intvlStrAmt = this.intvl.intvlStrAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    'intvl.intvlEndAmt'() {
      // 정수만
      this.intvl.intvlEndAmt = this.getInt(this.intvl.intvlEndAmt);
      this.intvl.intvlEndAmt = Math.floor(this.intvl.intvlEndAmt);
      // 최대는 원화 1억 미만, 달러 10만달러 미만
      let maxVal = this.getCurcyCode() === 'KRW' ? 100000000 : 100000;
      if (this.intvl.intvlEndAmt > maxVal) {
        this.intvl.intvlEndAmt = maxVal;
      }
      // 천단위 콤마 표기
      this.intvl.intvlEndAmt = this.intvl.intvlEndAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.intvl = _.cloneDeep(this.userArmIntvl);
    },
    onBtn(type) {
      if (type === 'confirm') {
        let dataIntvl = _.cloneDeep(this.intvl);
        dataIntvl['intvlStrAmt'] = this.getInt(this.intvl.intvlStrAmt);
        dataIntvl['intvlEndAmt'] = this.getInt(this.intvl.intvlEndAmt);
        // 최소가 최대를 넘지 않게
        if (dataIntvl['intvlStrAmt'] >= dataIntvl['intvlEndAmt']) {
          alert('최대값이 최소값보다 커야합니다.');
          return;
        }
        this.$emit('card-change', false);
        this.$emit('user-arm-intvl-set', dataIntvl);
      } else {
        this.$emit('card-change', false);
      }
    },
    getCurcyCode() {
      if (this.abNormalDetect.length > 0) {
        return this.abNormalDetect[0].pricingCurcyCd;
      }
      return 'USD';
    },
    getCurcyUnit() {
      return this.getCurcyCode() === 'KRW' ? '₩' : '$';
    },
    getInt(num) {
      return Number(num.toString().replace(/[^-\.0-9]/g, ''));
    },
    clickInfo(isShow) {
      this.isShowInfo = isShow;
    },
  },
};
</script>
