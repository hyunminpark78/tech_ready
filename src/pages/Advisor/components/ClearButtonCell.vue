<template>
  <div>
    <button v-if="params.data.filterSection" class="clear-btn" @click="handleClearData">
      <img src="@/assets/images/restart-icon.svg" alt="" />
      <p>{{ $t('advisor.detailTable.spotComparison.initialization') }}</p>
    </button>
    <p v-else>{{ params.value }}</p>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {
    handleClearData() {
      this.params.onClick();
    },
  },
};
</script>

<style>
.clear-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #999999;
}
</style>
