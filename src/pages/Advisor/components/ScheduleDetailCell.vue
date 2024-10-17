<template>
  <div class="flex justify-center">
    <button
      class="ml-1 mr-1 rounded-xlg px-4 py-1.5 text-sm"
      :class="buttonClass"
      @mouseover="() => (isButtonActive = true)"
      @mouseleave="() => (isButtonActive = false)"
    >
      {{ $t(`advisor.schedulingRecommend.detailTable.check`) }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isButtonActive: false,
    };
  },
  computed: {
    buttonClass() {
      if (this.isButtonActive) {
        return 'text-white bg-primary-400';
      }
      return 'text-primary-400 bg-gray-200';
    },
  },
  watch: {
    isPopupVisible() {
      if (!this.isPopupVisible) {
        this.isButtonActive = false;
      }
    },
  },
};
</script>

<style></style>
