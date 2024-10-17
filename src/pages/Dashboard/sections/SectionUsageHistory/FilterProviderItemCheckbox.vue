<template>
  <button class="mx-4" :disabled="isDisabled" @click="$emit('change', !checked)">
    <img :src="src" alt="." />
  </button>
</template>

<script>
export default {
  props: {
    checked: Boolean,
    isDisabled: {
      type: Boolean,
    },
  },
  computed: {
    src() {
      return require(`@/assets/images/ico-rcheck-${this.checked ? 'on' : 'off'}.svg`);
    },
  },
};
</script>
