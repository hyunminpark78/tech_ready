<template>
  <div class="flex flex-col items-center justify-center" :style="{ height: getHeight, width: getWidth }">
    <img :src="getIconUrl" alt="." />
    <p class="mt-3 text-gray-700" style="font-size: 15px">{{ $t('common.paragraph.noDataDisplay') }}</p>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: [String, Number],
      default: '100%',
    },
    width: {
      type: [String, Number],
      default: '100%',
    },
    iconType: {
      type: String,
      default: 'view', // or 'chart'
    },
  },
  computed: {
    getHeight() {
      return typeof this.height === 'number' ? this.height + 'px' : this.height;
    },
    getWidth() {
      return typeof this.width === 'number' ? this.width + 'px' : this.width;
    },
    getIconUrl() {
      return require(`@/assets/images/ico-nodata-${this.iconType}.svg`);
    },
  },
};
</script>
