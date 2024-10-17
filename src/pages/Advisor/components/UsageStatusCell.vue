<template>
  <div
    ref="customCell"
    style="padding: 0; gap: 5px"
    :style="displayArrow ? 'cursor: pointer' : ''"
    class="flex items-center justify-center"
  >
    <p :class="{ redHighlight: redHighlight, blueHighlight: blueHighlight }">
      {{ textRender }}
    </p>
    <div v-if="displayArrow" ref="arrowIcon">
      <img :src="require('@/assets/images/filled-white-arrow.svg')" alt="." />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      redList: ['badParameters', 'systemError'],
      blueList: ['pendingEvaluation', 'pendingFulfillment', 'fulfilled'],
    };
  },
  computed: {
    redHighlight() {
      return this.redList.includes(this.params.value);
    },
    blueHighlight() {
      return this.blueList.includes(this.params.value);
    },
    textRender() {
      return this.params.value ? this.params.value : '-';
    },
    displayArrow() {
      return !!this.params.value;
    },
  },
  methods: {},
};
</script>

<style>
.redHighlight {
  color: #ea1718;
}
.blueHighlight {
  color: #00a5ed;
}
</style>
