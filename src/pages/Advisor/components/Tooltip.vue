<template>
  <div class="flex items-center">
    <div class="tit-wrap">{{ title }}</div>
    <div class="tooltip-wrap inline-block">
      <button class="ico jsTooltip1" @click="tooltip = !tooltip"><span>툴팁 열기</span></button>
      <div
        class="tooltip-layer"
        :style="
          tooltip ? `display: block; ${leftPosition && 'position: absolute; left: initial; right: 0'}` : 'display: none'
        "
      >
        <slot></slot>
        <button class="close jsTooltipClose1" @click="tooltip = false">툴팁 닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    leftPosition: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      tooltip: false,
    };
  },
};
</script>

<style lang="scss">
.primary {
  color: #00a5ed;
}

.pink {
  color: #fc5aa1 !important;
}
</style>
