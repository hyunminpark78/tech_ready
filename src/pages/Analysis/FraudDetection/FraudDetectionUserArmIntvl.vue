<template>
  <div class="sensitive__setting">
    <div class="title">{{ $t('cost.alarmSectionSettings') }}</div>
    <div class="info_01">{{ $t('cost.setAlarmsTiers') }}</div>
    <div v-if="i18n().locale === 'ko'" class="info_02">
      - <span>최소 7일 이상 경과</span>해야 AI 서비스를 사용할 수 있습니다.<br />
      - 지난 14일 간(최초 설정 시 7일)의 <span>사용 패턴을 분석하여 모델을 생성</span>합니다.<br />
      - {{ $t('cost.reLearnsDaily') }}
    </div>
    <div v-if="i18n().locale === 'en'" class="info_02">
      - You can use the AI service after <span>at least 7 days have passed.</span><br />
      - The model is created <span>by analyzing your usage patterns</span> over the past 14 days (7 days by
      default)<br />
      - {{ $t('cost.reLearnsDaily') }}
    </div>

    <div class="img_gauge">
      <div class="gauge__inner">
        <div class="rule_txt">{{ $t('cost.unit') }} : {{ getCurcyUnit() }}</div>
        <div class="img__wrap">
          <img v-if="i18n().locale === 'en'" src="@/assets/images/img_sensitivity_alaram_en.svg" alt="." />
          <img v-else src="@/assets/images/img_sensitivity_alaram.svg" alt="." />
        </div>
        <div class="input__wrap">
          <input v-model="intvl.intvlStrAmt" type="text" />
          <input v-model="intvl.intvlEndAmt" type="text" />
        </div>
      </div>
    </div>

    <div class="flex btnbox__210 box__center mt__20">
      <button
        class="flex-1 px-3 py-1.5 text-sm font-bold text-white border rounded-l-sm bg-primary-400 border-primary-400"
        @click="onBtn('confirm')"
      >
        {{ $t('common.button.save') }}
      </button>
      <button
        class="flex-1 px-3 py-1.5 text-sm font-bold bg-white border rounded-r-sm text-primary-400 border-primary-400"
        @click="onBtn('cancel')"
      >
        {{ $t('common.button.cancel') }}
      </button>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: {},
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
    curcyCd: {
      type: String,
      default: 'USD',
    },
  },
  data() {
    return {
      intvl: {
        intvlStrAmt: 0,
        intvlEndAmt: 0,
      },
    };
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
      let maxVal = this.curcyCd === 'KRW' ? 100000000 : 100000;
      if (this.intvl.intvlStrAmt > maxVal) {
        this.intvl.intvlStrAmt = maxVal;
      }
      // 천단위 콤마 표기
      // this.intvl.intvlStrAmt = this.intvl.intvlStrAmt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
      this.intvl.intvlStrAmt = this.intvl.intvlStrAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    'intvl.intvlEndAmt'() {
      // 정수만
      this.intvl.intvlEndAmt = this.getInt(this.intvl.intvlEndAmt);
      this.intvl.intvlEndAmt = Math.floor(this.intvl.intvlEndAmt);
      // 최대는 원화 1억 미만, 달러 10만달러 미만
      let maxVal = this.curcyCd === 'KRW' ? 100000000 : 100000;
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
    i18n() {
      return i18n;
    },
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
          alert(this.$t('common.alert.maximumGreaterMinimum'));
          return;
        }
        this.$emit('intvlPopup', { change: true, userArmIntvl: dataIntvl });
      } else {
        this.$emit('intvlPopup', { change: false });
      }
    },
    getCurcyUnit() {
      return this.curcyCd === 'KRW' ? '₩' : '$';
    },
    getInt(num) {
      return Number(num.toString().replace(/[^-\.0-9]/g, ''));
    },
  },
};
</script>
