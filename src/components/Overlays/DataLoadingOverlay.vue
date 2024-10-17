<template>
  <div class="relative" :style="{ height: getHeight, width: getWidth }">
    <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
      <div class="mb-4 loading_rotate">
        <span class="loadingcolor"></span>
      </div>
      <div v-if="!disabledText" class="loading_txt">Loading...</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disabledText: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [String, Number],
      default: '100%',
    },
    width: {
      type: [String, Number],
      default: '100%',
    },
  },
  computed: {
    getHeight() {
      return typeof this.height === 'number' ? this.height + 'px' : this.height;
    },
    getWidth() {
      return typeof this.width === 'number' ? this.width + 'px' : this.width;
    },
  },
};
</script>
