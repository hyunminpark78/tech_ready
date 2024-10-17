<template>
  <div>
    <button v-if="params.data.filterSection" class="add-button" @click="handleAddRowData">
      {{ $t('advisor.detailTable.spotComparison.additional') }}
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
    handleAddRowData() {
      this.params.onClick();
    },
  },
};
</script>

<style>
.add-button {
  display: flex;
  align-items: center;
  color: #ffffff;
  background-color: #00a5ed;
  display: flex;
  height: 24px;
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  cursor: pointer;
  margin: 0 auto;
}
</style>
