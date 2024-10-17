<template>
  <div class="notify-pop" :class="visible ? '' : 'hidden'">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>

    <section class="z-30 p-8 rounded policy-content w-1050 h-695">
      <h2 class="mb-4 text-2xl text-primary-400">{{ $t('notify.notify') }}</h2>

      <button class="absolute top-0 right-0 close-policy-modal mt-7 mr-7" @click="closePop">
        <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
      </button>

      <div class="mb-6 flex dashboard-tab-buttons">
        <button
          :class="tab === 0 ? ['clicked', upbuttonClass] : upbuttonClass"
          class="rounded-tl-lg rounded-bl-lg"
          @click="handleClickTab(0)"
        >
          <span class="ml-3">{{ $t('notify.notiHistory') }}</span>
        </button>
        <button
          :class="tab === 1 ? ['clicked', upbuttonClass] : upbuttonClass"
          class="rounded-tr-lg rounded-br-lg"
          @click="handleClickTab(1)"
        >
          <span class="ml-3">{{ $t('notify.notiTypeInfo') }}</span>
        </button>
      </div>

      <CmmtNotifyListPop
        :visible="tab === 0"
        :auto-display="autoDisplay"
        @openPop="openPop"
        @updateAlarmCheckYn="updateAlarmCheckYn"
        @updateAlarmCount="updateAlarmCount"
      ></CmmtNotifyListPop>
      <CmmtNotifyInfoPop :visible="tab === 1"></CmmtNotifyInfoPop>

      <div :class="tab === 0 ? '' : 'hidden'" class="text-center" style="margin-top: 3rem">
        <a
          href="javascript:void(0)"
          :class="lobuttonClass"
          class="px-3 text-white bg-primary-400"
          @click="disableFor1Week"
          >{{ $t('common.button.stopDisplayingWeek') }}</a
        >
        <a
          href="javascript:void(0)"
          :class="lobuttonClass"
          class="px-6 text-primary-400 bg-white ml-1.5"
          @click="closePop"
          >{{ $t('common.button.close') }}</a
        >
      </div>
    </section>
  </div>
</template>
<script>
import CmmtNotifyListPop from './CmmtNotifyListPop.vue';
import CmmtNotifyInfoPop from './CmmtNotifyInfoPop.vue';
import costOptiService from '@/services/costOptiService';
import { mapState, mapActions } from 'vuex';

export default {
  components: { CmmtNotifyListPop, CmmtNotifyInfoPop },
  props: {
    autoDisplay: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      param: {},
      tab: 0,
      visible: false,
      upbuttonClass: 'flex items-center justify-center flex-1 py-2l font-medium border',
      lobuttonClass: 'inline-block h-32 text-sm border rounded-sm border-primary-400 font-bold',
    };
  },
  computed: {
    ...mapState('costOpti', ['popVisible']),
  },
  watch: {
    filter: function (newVal) {
      this.param = newVal;
    },
    popVisible: function (newVal) {
      this.visible = newVal;
    },
  },
  methods: {
    ...mapActions('costOpti', ['fetchAlarmCheck']),
    async disableFor1Week() {
      await costOptiService.fetchAlarmCheck(this.param).then((result) => {
        if (result.status === 200) {
          this.updateAlarmCheckYn('Y');
          this.closePop();
        }
      });
    },
    handleClickTab(tab) {
      this.tab = tab;
    },
    updateAlarmCheckYn(alarmCheckYn) {
      this.$emit('updateAlarmCheckYn', alarmCheckYn);
    },
    updateAlarmCount(alarmCount) {
      this.$emit('updateAlarmCount', alarmCount);
    },
    openPop() {
      this.$emit('openPop');
    },
    closePop() {
      this.$emit('closePop');
    },
  },
};
</script>

<style>
.notify-pop .w-1050 {
  width: 1050px !important;
}
.notify-pop .h-695 {
  height: 695px !important;
}
</style>
