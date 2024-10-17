<template>
  <footer :class="wrapperClass">
    <slot />
  </footer>
</template>

<script>
export default {
  props: {
    wrapperClass: {
      type: [Object, Array, String],
      default: 'p-3 mt-8 -mx-8 -mb-8 text-sm text-center rounded-b-lg text-primary-600 bg-primary-200',
    },
  },
};
</script>
