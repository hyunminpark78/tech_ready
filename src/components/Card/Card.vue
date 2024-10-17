<template>
  <div :class="[wrapperClass, borderClass]">
    <slot />
  </div>
</template>

<script>
export default {
  abstract: true,
  props: {
    dualClass: {
      type: Boolean,
      default: false,
    },
    wrapperClass: {
      type: [Object, Array, String],
      default: 'p-8 bg-white rounded-lg border-primary-200 dashboard-card',
    },
    border: {
      type: [String],
      default: '',
      validator: (value) => {
        return !value || value === '2';
      },
    },
  },
  computed: {
    borderClass() {
      return this.border === '2' ? 'border-2' : this.border === 'none' ? '' : 'border';
    },
  },
  watch: {
    dualClass() {
      if (this.dualClass) {
        this.wrapperClass = 'flex-1 p-8 bg-white border rounded-lg border-primary-200 dashboard-card';
      }
    },
  },
};
</script>
