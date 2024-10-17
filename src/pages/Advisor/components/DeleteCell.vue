<template>
  <div>
    <div v-if="params.data.customData" class="delete-cell" @click="handleClick">
      <img
        src="@/assets/images/ico-close-typ-01.svg"
        style="width: 24px; height: 24px; background-color: #bbbbbb; border-radius: 50%"
        alt=""
      />
    </div>
    <p v-else></p>
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
    handleClick() {
      this.params.onClick(this.params.data.id);
    },
  },
};
</script>

<style>
.delete-cell {
  cursor: pointer;
  width: 24px;
  height: 24px;
}
</style>
