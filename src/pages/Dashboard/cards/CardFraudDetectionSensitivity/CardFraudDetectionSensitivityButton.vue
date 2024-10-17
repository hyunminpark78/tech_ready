<template>
  <button class="flex-1 px-3 py-1.5 text-sm font-bold border border-primary-400" :class="classArr" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    primary: Boolean,
  },
  computed: {
    classArr() {
      return this.primary ? ['text-white', 'bg-primary-400'] : ['bg-white', 'text-primary-400'];
    },
  },
};
</script>
