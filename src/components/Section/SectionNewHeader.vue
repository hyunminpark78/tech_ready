<template>
  <div :class="titleClass" style="padding-top: 0px">
    <img :src="mainIcon.src" alt="." class="mr-2" style="height: 20px" />
    <!-- <span class="text-2xl--">{{ title }}</span>
    <img v-if="!!icon.src" :src="icon.src" :alt="icon.alt" class="mx-1 -rotate-90-" style="height: 20px" />
    -->
    <template v-if="title3 == null || title3 === ''">
      <span class="text-2xl--">{{ title2 }}</span>
    </template>
    <template v-if="title3 != null && title3 !== ''">
      <!-- <img v-if="!!icon.src" :src="icon.src" :alt="icon.alt" class="mx-1 -rotate-90-" /> -->
      <span class="text-2xl--">{{ title3 }}</span>
    </template>
    <div v-if="title === $t('menu.mainOptimization') && subTitle !== ''" class="ml-6 text-left">
      <span class="font-normal text-gray-700"><span class="text-primary-400">※ </span>{{ subTitle }}</span>
    </div>

    <div
      v-show="
        displayExchgRate &&
        (title === $t('menu.mainOptimization') ||
          title === $t('advisor.recommendation') ||
          title === $t('advisor.status') ||
          title === 'GPU Spot')
      "
      class="flex-1 text-right exchRate"
    ></div>
    <div
      v-show="
        displayExchgRate &&
        (title === $t('menu.mainOptimization') ||
          title === $t('advisor.recommendation') ||
          title === $t('advisor.status') ||
          title === 'GPU Spot')
      "
      class="tooltip-wrap exchRate"
    >
      <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
      <div class="tooltip-layer pos_r excRateTip" style="width: max-content; padding-right: 48px">
        2024년 04월 04일 환율 기준
        <button class="close jsTooltipClose1">툴팁 닫기</button>
      </div>
    </div>

    <div v-if="title2 === '구매비용최적화'" class="exchVisYn">
      <button class="ml-2 new" @click="handleAlarmBtn">
        <img src="@/assets/images/notify-01.svg" alt="알림" />
        <em>{{ alarmCount }}</em>
      </button>
    </div>

    <CmmtNotifyPop
      v-if="title2 === '구매비용최적화'"
      :visible="visible"
      :auto-display="autoDisplay"
      @openPop="openPop"
      @closePop="closePop"
      @updateAlarmCheckYn="updateAlarmCheckYn"
      @updateAlarmCount="updateAlarmCount"
    ></CmmtNotifyPop>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CmmtNotifyPop from '@/pages/Opti/CostOpti/CmmtDashboard/CmmtNotifyPop.vue';

export default {
  components: { CmmtNotifyPop },
  props: {
    titleClass: {
      type: [Object, Array, String],
      default: 'flex items-center py-5',
    },
    title2Class: {
      type: [Object, Array, String],
      default: '',
    },
    mainIcon: {
      type: Object,
      default: () => ({ src: require('@/assets/images/ico-report.svg') }),
    },
    icon: {
      type: Object,
      default: () => ({ src: '', alt: 'icon' }),
    },
    title: {
      type: String,
      default: '',
    },
    title2: {
      type: String,
      default: '',
    },
    title3: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    displayExchgRate: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      visible: false,
      autoDisplay: true,
      alarmCheckYn: 'N', // 알람 수 표기로 변경되어 사용되지 않음.
      alarmCount: 0,
    };
  },
  methods: {
    ...mapActions('costOpti', ['fetchPopVisible']),
    handleAlarmBtn() {
      this.autoDisplay = false;
      this.openPop();
    },
    updateAlarmCheckYn(alarmCheckYn) {
      this.alarmCheckYn = alarmCheckYn;
    },
    updateAlarmCount(alarmCount) {
      this.alarmCount = alarmCount;
    },
    openPop() {
      this.visible = true;
      this.fetchPopVisible({ popVisible: true });
    },
    closePop() {
      this.visible = false;
      this.fetchPopVisible({ popVisible: false });
    },
  },
};
</script>
