<template>
  <h2 :class="titleClass">
    <img v-if="!!icon.src" :src="icon.src" :alt="icon.alt" />
    <span class="ml-3">청구정보 </span>
    <img :src="require('@/assets/images/arrow-typ-02-black.svg')" class="mx-1 -rotate-90-" />
    <span class="text-2xl-- font-bold">{{ title }}</span>
  </h2>
</template>

<script>
export default {
  props: {
    titleClass: {
      type: [Object, Array, String],
      default: 'flex items-center mb-5 text-xl',
    },
    icon: {
      type: Object,
      default: () => ({ src: '', alt: 'icon' }),
    },
    title: {
      type: String,
      default: '',
    },
  },
};
</script>
