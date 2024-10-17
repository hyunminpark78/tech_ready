<template>
  <Card :wrapper-class="dualData" border="2">
    <!-- 민감도 설정 (flip) -->
    <!-- <CardHeader type1 title="민감도 설정" :title-icon-src="require('@/assets/images/ico-info.svg')" /> -->
    <div class="flex items-center relative">
      <h3 class="mr-3 font-bold">민감도 설정</h3>
      <button @click="clickInfo(true)"><img src="@/assets/images/ico-info.svg" alt="."></button>

      <div v-show="isShowInfo"
        class="absolute z-10 p-4 pr-12 font-normal text-gray-700 bg-white border rounded border-primary-400 text-xs- popup-comment left__60">
        AI 예측 비용이 민감도 범위를 벗어나면 이상을 감지하고 경고를<br />
        보냅니다. 민감도가 늦으면 더 적은 알람을 받고, 민감도가 높으면<br />
        더 많은 알람을 수신합니다.
        <img src="@/assets/images/arrow.jpg" alt=".">
        <button class="absolute top-0 right-0 mt-2.5 mr-2" @click="clickInfo(false)">
          <img src="@/assets/images/ico-btn-search-close.svg" alt=".">
        </button>
      </div>
    </div>

    <CardMain>
      <div class="flip__setting">
        <div class="info_txtbox">
          - <span>최소 7일 이상 경과</span>해야 AI 서비스를 사용할 수 있습니다.<br />
          - 지난 14일 간(최초 설정 시 7일)의 <span>사용 패턴을 분석하여 모델을 생성</span>합니다.<br />
          - 매일 사용 패턴을 분석하여 재학습합니다.
        </div>

        <div class="col3__wrap">
          <div class="item_box">
            <div class="radio__wrap">
              <input id="radio1" type="radio" name="radio" :checked="senseVal === 'L'" @click="changeSens('L')" />
              <label for="radio1">낮음</label>
            </div>
            <div class="chart_img">
              <img src="@/assets/images/img_sensitivity_typ01.svg" alt="." />
            </div>
          </div>

          <div class="item_box">
            <div class="radio__wrap">
              <input id="radio2" type="radio" name="radio" :checked="senseVal === 'M'" @click="changeSens('M')" />
              <label for="radio2">중간</label>
            </div>
            <div class="chart_img">
              <img src="@/assets/images/img_sensitivity_typ02.svg" alt="." />
            </div>
          </div>

          <div class="item_box">
            <div class="radio__wrap">
              <input id="radio3" type="radio" name="radio" :checked="senseVal === 'H'" @click="changeSens('H')" />
              <label for="radio3">높음</label>
            </div>
            <div class="chart_img">
              <img src="@/assets/images/img_sensitivity_typ03.svg" alt="." />
            </div>
          </div>
        </div>

        <div class="legend__box">
          <div class="ico_lgd lgd_01">실제비용</div>
          <div class="ico_lgd lgd_02">예측비용</div>
          <div class="ico_lgd lgd_03">이상비용</div>
          <div class="ico_lgd lgd_04">민감도</div>
        </div>

        <div class="flex btnbox__210 box__center mt__20">
          <Button
            primary
            @click="
              $emit('card-change', false);
              $emit('sensitivity-value', senseVal);
            "
            >저장</Button
          >
          <Button @click="$emit('card-change', false)">취소</Button>
        </div>
      </div>
    </CardMain>
  </Card>
</template>

<script>
import Card, { CardHeader, CardMain } from '@/components/Card';
import Button from './CardFraudDetectionSensitivityButton.vue';
import { mapState } from 'vuex';

export default {
  components: {
    Button,
    Card,
    // CardHeader,
    CardMain,
  },
  props: {
    senseSetVal: {
      type: String,
      default: 'M',
    },
  },
  data() {
    return {
      senseVal: '',
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
    senseSetVal: function () {
      this.senseVal = this.senseSetVal;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.senseVal = this.senseSetVal;
    },
    changeSens(param) {
      this.senseVal = param;
    },
    clickInfo(isShow) {
      this.isShowInfo = isShow;
    },
  },
};
</script>
