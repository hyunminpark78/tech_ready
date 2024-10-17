<template>
  <button class="font-bold border" :class="[sizeClass, activeClass]" v-bind="$attrs" v-on="$listeners">
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    small: Boolean,
    active: Boolean,
    text: {
      type: String,
      default: 'Button',
    },
    // 클래스명 뒤에 붙는 숫자. 의미 모르겠음
    number: {
      type: Number,
      default: 800,
    },
  },
  computed: {
    sizeClass() {
      if (this.small) {
        return 'rounded-sm text-sm';
      }
      return '';
    },
    activeClass() {
      if (this.active) {
        return 'text-white bg-primary-400 border-primary-400';
      } else {
        return `bg-white text-primary-${this.number} border-primary-${this.number}`;
      }
    },
  },
};
</script>
