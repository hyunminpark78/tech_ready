<template>
  <div class="grid2-wrap" style="height: 170px">
    <!-- 월예상절감액 -->
    <div class="box-wrap list-wrap" style="flex: unset; width: 25%; padding: 0">
      <div class="title">
        <h4 class="tit2-wrap">
          <span>{{ $t('optimization.estimatedMonthlySavings') }}</span>
        </h4>
      </div>
      <div class="con1" style="padding: 0 32px 0">
        <div class="pr" style="display: flex; align-items: center; padding: 0; width: 100%; font-size: 30px">
          <span id="jsCount10">{{ status.totExpctSaveCost }}</span>
        </div>
      </div>
    </div>
    <!-- 월예상절감액 -->
    <div class="box-wrap" style="flex: unset; width: 75%">
      <div class="list9-wrap" style="padding: 0 16px 10px 32px; margin: 0; height: 140px">
        <div class="col" style="padding: 24px 35px 24px 0; border-right: thin solid #e3ebf1">
          <div class="tit2-wrap" style="color: #d50000; padding-bottom: 15px">
            <img src="@/assets/images/ico-info-action.png" alt="." style="display: inline-block; margin: 0 4px 2px 0" />
            <span>{{ $t('optimization.recForAction') }}</span>
            <div class="tooltip-wrap" style="display: inline-block">
              <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
              <div class="tooltip-layer" style="width: 200px">
                <strong class="ti">{{ $t('optimization.recForAction') }}</strong>
                {{ $t('optimization.actionsRecommended') }}
                <button class="close jsTooltipClose1">툴팁 닫기</button>
              </div>
            </div>
          </div>
          <div class="con1">
            <div
              class="pr"
              style="
                display: flex;
                align-items: center;
                width: 100%;
                border-bottom: 0;
                font-size: 45px;
                justify-content: center;
                color: #d50000;
              "
            >
              <span
                class="chk-status"
                :style="chkStatCd === 'error' ? textUnderlineStyle : ''"
                style="cursor: pointer; pointer-events: auto"
                @click="changeData('error')"
              >
                {{ status.errorCnt }}</span
              >
            </div>
          </div>
        </div>
        <div class="col" style="padding: 24px 35px 24px 0; border-right: thin solid #e3ebf1">
          <div class="tit2-wrap" style="color: #00a7f4; padding-bottom: 15px">
            <img src="@/assets/images/ico-info-review.png" alt="." style="display: inline-block; margin: 0 4px 2px 0" />
            <span>{{ $t('optimization.reviewRecommendation') }}</span>
            <div class="tooltip-wrap" style="display: inline-block">
              <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
              <div class="tooltip-layer" style="width: 200px">
                <strong class="ti">{{ $t('optimization.reviewRecommendation') }}</strong>
                {{ $t('optimization.reviewIssuesFound') }}
                <button class="close jsTooltipClose1">툴팁 닫기</button>
              </div>
            </div>
          </div>
          <div class="con1">
            <div
              class="pr"
              style="
                display: flex;
                align-items: center;
                width: 100%;
                border-bottom: 0;
                font-size: 45px;
                justify-content: center;
                color: #00a7f4;
              "
            >
              <span
                class="chk-status"
                :style="chkStatCd === 'warning' ? textUnderlineStyle : ''"
                style="cursor: pointer; pointer-events: auto"
                @click="changeData('warning')"
                >{{ status.warnCnt }}</span
              >
            </div>
          </div>
        </div>
        <div class="col" style="padding: 24px 40px 24px 0; border-right: thin solid #e3ebf1">
          <div class="tit2-wrap" style="color: #02a20f; padding-bottom: 15px">
            <img src="@/assets/images/ico-info-normal.png" alt="." style="display: inline-block; margin: 0 4px 2px 0" />
            <span>{{ $t('optimization.normal') }}</span>
            <div class="tooltip-wrap" style="display: inline-block">
              <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
              <div class="tooltip-layer" style="width: 200px">
                <strong class="ti">{{ $t('optimization.normal') }}</strong>
                {{ $t('optimization.noIssuesFound') }}
                <button class="close jsTooltipClose1">툴팁 닫기</button>
              </div>
            </div>
          </div>
          <div class="con1">
            <div
              class="pr"
              style="
                display: flex;
                align-items: center;
                width: 100%;
                border-bottom: 0;
                font-size: 45px;
                justify-content: center;
                color: #02a20f;
              "
            >
              <span
                class="chk-status"
                :style="chkStatCd === 'ok' ? textUnderlineStyle : ''"
                style="cursor: pointer; pointer-events: auto"
                @click="changeData('ok')"
                >{{ status.okCnt }}</span
              >
            </div>
          </div>
        </div>
        <div class="col" style="padding: 24px 24px 24px 0">
          <div class="tit2-wrap" style="color: #676767; padding-bottom: 15px">
            <img
              src="@/assets/images/ico-info-exception.png"
              alt="."
              style="display: inline-block; margin: 0 4px 2px 0"
            />
            <span>{{ $t('optimization.excludedItems') }}</span>
            <div class="tooltip-wrap" style="display: inline-block">
              <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
              <div class="tooltip-layer" style="width: 200px; left: -190px">
                <strong class="ti">{{ $t('optimization.excludedItems') }}</strong>
                {{ $t('optimization.itemExcludedInspection') }}
                <button class="close jsTooltipClose1">툴팁 닫기</button>
              </div>
            </div>
          </div>
          <div class="con1">
            <div
              class="pr"
              style="
                display: flex;
                align-items: center;
                width: 100%;
                border-bottom: 0;
                font-size: 45px;
                justify-content: center;
                color: #676767;
              "
            >
              <span
                class="chk-status"
                :style="chkStatCd === 'suppressed' ? textUnderlineStyle : ''"
                style="cursor: pointer; pointer-events: auto"
                @click="changeData('suppressed')"
              >
                {{ status.sprCnt }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="list9-wrap" style="margin: 0px; height: 30px; font-size: 13px; color: #5ba9ca; font-weight: bold">
        <p>{{ $t('optimization.clickOnNumbers') }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
export default {
  data() {
    return {
      textUnderlineStyle: 'text-decoration-line: underline',
    };
  },
  computed: {
    ...mapState('trustedAdvisor', ['status', 'chkStatCd']),
  },
  watch: {},
  mounted() {
    /* tooltip */
    const tooltips = document.querySelectorAll('.tooltip-wrap');
    const tooltipBtns = document.querySelectorAll('.jsTooltip1');
    tooltipBtns.forEach((tooltip) => {
      tooltip.onclick = function () {
        for (let i = 0; i < tooltips.length; i++) {
          tooltips[i].classList.remove('active');
        }
        if (this.parentNode.classList.contains('active')) {
          this.parentNode.classList.remove('active');
        } else {
          this.parentNode.classList.add('active');
        }
      };
    });
    const tooltipCloses = document.querySelectorAll('.jsTooltipClose1');
    tooltipCloses.forEach((tooltipClose) => {
      tooltipClose.onclick = function () {
        this.parentNode.parentNode.classList.remove('active');
      };
    });
    /* //tooltip */
  },
  methods: {
    changeData(chkStatCd) {
      this.$emit('changeData', chkStatCd);
    },
  },
};
</script>
<style>
.chk-status:hover {
  text-decoration-line: underline;
}
</style>
