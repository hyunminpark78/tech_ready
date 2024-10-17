<template>
  <a class="cursor-pointer" @click="reloadMain">
    <img :src="require('@/assets/images/top-logo.svg')" alt="logo" />
  </a>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    reloadMain() {
      window.location.href = this.user.redirectRoute;
    },
  },
};
</script>
