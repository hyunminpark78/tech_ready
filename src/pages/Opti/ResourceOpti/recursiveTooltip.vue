<template>
  <div>
    <div v-for="item in tooltipText" :key="item.text || item">
      <p :style="getTextStyle(item)" style="line-height: 1">
        {{ item.text || item }}
      </p>
      <recursive-tooltip v-if="item.subpoints" :tooltip-text="item.subpoints" :depth="depth + 1"></recursive-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecursiveTooltip',
  props: {
    tooltipText: {
      type: Array,
      default: () => [],
    },
    depth: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: '',
    },
  },
  methods: {
    getTextStyle(item, depth) {
      let baseStyle = null;
      if (this.type === 'preformance') {
        const spacesAtStart = item.text.match(/^ */)[0].length;
        baseStyle = { marginLeft: `${spacesAtStart}em` };
      } else {
        baseStyle = { marginLeft: `${depth}em` };
      }
      if (item.text === 'Downsize') {
        return { ...baseStyle, color: '#1AE3BB' };
      }
      if (item.text === 'Upsize') {
        return { ...baseStyle, color: '#fc5aa1' };
      }
      if (item.text === 'Modernize') {
        return { ...baseStyle, color: '#2CC2FD' };
      }
      return baseStyle;
    },
  },
};
</script>
<style>
.text-item {
  margin-bottom: 0.5em;
}

.sub-item {
  margin-bottom: 0.25em;
}
</style>
