<template>
  <div ref="selectCell">
    <div v-if="params.data.filterSection" class="select-cell" @click="getPosition">
      <p>
        {{ params.value || $t('advisor.detailTable.spotComparison.choice') }}
      </p>
      <img src="@/assets/images/arrow-typ-02-black.svg" alt="" style="width: 25px; height: 26px" />
    </div>
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
    getPosition() {
      const { left, top } = this.$refs.selectCell.getBoundingClientRect();
      this.params.onClick({ left, top, field: this.params.colDef.field });
    },
  },
};
</script>

<style>
.select-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border: 1px solid #e9ebed;
  border-radius: 4px;
  padding: 6px 12px;
  background-color: #ffffff;
}
</style>
