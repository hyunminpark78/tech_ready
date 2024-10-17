<template>
  <div class="custom-loading">
    <div class="mb-10 loading_rotate" :style="`width:${size}px!important;height:${size}px!important`">
      <div class="loadingcolor" :style="`width:${size}px!important;height:${size}px!important`"></div>
    </div>
    <div v-if="text" class="loading_txt">{{ text }}</div>
  </div>
</template>
<script>
export default {
  props: {
    size: { type: Number, default: 15 },
    text: { type: String, default: undefined },
  },
};
</script>
<style lang="scss">
.custom-loading {
  display: inline-block;
  & .loading_rotate {
    margin: 0px !important;
    padding: 0px !important;
  }
}
</style>
