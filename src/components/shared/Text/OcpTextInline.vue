<template>
  <span :class="{ 'text-secondary': secondary }">
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    secondary: Boolean,
  },
};
</script>
