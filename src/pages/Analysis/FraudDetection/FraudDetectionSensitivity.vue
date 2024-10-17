<template>
  <div class="sensitive__setting">
    <div class="title">{{ $t('cost.sensitivitySettings') }}</div>
    <div class="info_01">
      {{ $t('cost.detectsAnomaliesIssues') }}<br />
      {{ $t('cost.sensitivitySlowerAlarms') }}
    </div>

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

    <div class="col3__wrap">
      <div class="item_box">
        <div class="radio__wrap">
          <input id="radio1" type="radio" name="radio" :checked="senseVal === 'L'" @click="changeSens('L')" />
          <label for="radio1">{{ $t('cost.low') }}</label>
        </div>
        <div class="chart__img">
          <img src="@/assets/images/img_sensitivity_typ01.svg" alt="." />
        </div>
      </div>

      <div class="item_box">
        <div class="radio__wrap">
          <input id="radio1" type="radio" name="radio" :checked="senseVal === 'M'" @click="changeSens('M')" />
          <label for="radio2">{{ $t('cost.medium') }}</label>
        </div>
        <div class="chart__img">
          <img src="@/assets/images/img_sensitivity_typ02.svg" alt="." />
        </div>
      </div>

      <div class="item_box">
        <div class="radio__wrap">
          <input id="radio1" type="radio" name="radio" :checked="senseVal === 'H'" @click="changeSens('H')" />
          <label for="radio3">{{ $t('cost.high') }}</label>
        </div>
        <div class="chart__img">
          <img src="@/assets/images/img_sensitivity_typ03.svg" alt="." />
        </div>
      </div>
    </div>

    <div class="legend__box">
      <div class="ico_lgd lgd_01">{{ $t('cost.actualCosts') }}</div>
      <div class="ico_lgd lgd_02">{{ $t('cost.predictedCost') }}</div>
      <div class="ico_lgd lgd_03">{{ $t('cost.abnormalCost') }}</div>
      <div class="ico_lgd lgd_04">{{ $t('cost.sensitivity') }}</div>
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
import _ from 'lodash';
import { i18n } from '../../../../public/locales/i18n';

export default {
  components: {},
  props: {
    senseSetVal: {
      type: String,
      default: 'M',
    },
  },
  data() {
    return {
      senseVal: 'M',
    };
  },
  watch: {
    senseSetVal: function () {
      this.senseVal = _.cloneDeep(this.senseSetVal);
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
      this.senseVal = _.cloneDeep(this.senseSetVal);
    },
    changeSens(sens) {
      this.senseVal = sens;
    },
    onBtn(type) {
      if (type === 'confirm') {
        this.$emit('sensePopup', { change: true, senseVal: this.senseVal });
      } else {
        this.$emit('sensePopup', { change: false });
      }
    },
  },
};
</script>
