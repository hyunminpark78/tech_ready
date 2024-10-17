<template>
  <a
    :href="href"
    target="_blank"
    class="flex flex-col items-center pt-8 pb-10 bg-white border rounded-lg border-primary-200 dashboard-card"
  >
    <div class="flex items-center h-24 mb-3">
      <img :src="iconSrc" :alt="title" />
    </div>
    <!-- eslint-disable-next-line vue/no-v-html-->
    <h3 :class="titleClass" v-html="title" />
    <!-- eslint-disable-next-line vue/no-v-html-->
    <p :class="descriptionClass" v-html="description" />
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      required: true,
    },
    iconSrc: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    titleClass: {
      type: String,
      default: 'mb-5 text-2xl text-center text-gray-700',
    },
    description: {
      type: String,
      required: true,
    },
    descriptionClass: {
      type: String,
      default: 'mt-1 leading-5 text-center text-xs- text-primary-800',
    },
  },
};
</script>

<style lang="sass" scoped>
.description
  white-space: pre-line
</style>
