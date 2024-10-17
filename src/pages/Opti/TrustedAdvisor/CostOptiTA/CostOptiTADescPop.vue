<template>
  <div class="notify-pop" :class="visibleDescPop ? '' : 'hidden'">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <section class="z-30 p-8 rounded policy-content w-1050" style="border: 1px solid #00a5ed; overflow: auto">
      <h2 class="mb-4" style="color: #000; font-size: 16px; font-weight: 700">{{ chkDesc.name }}</h2>

      <button class="absolute top-0 right-0 close-policy-modal mt-7 mr-7" @click="closePop">
        <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
      </button>
      <div class="mb-3 flex items-center ta-desc">
        <span v-html="chkDesc.desc" class="text-sm text-gray-700 font-medium"></span>
      </div>
    </section>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
  computed: {
    ...mapState('trustedAdvisor', ['visibleDescPop', 'chkDesc']),
  },
  methods: {
    ...mapActions('trustedAdvisor', ['fetchVisibleDescPop']),
    closePop() {
      this.fetchVisibleDescPop(false);
    },
  },
};
</script>
<style>
.ta-desc a {
  color: #00a5ed;
  text-decoration: underline;
}
</style>
