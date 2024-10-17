<template>
  <div class="spotComparison" @click="params.onClick()">
    <p>{{ $t('common.button.confirmation') }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style>
.spotComparison {
  color: #00a5ed;
  background-color: #efefef;
  display: flex;
  height: 24px;
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  cursor: pointer;
}
.spotComparison:hover {
  color: #ffffff;
  background-color: #00a5ed;
}
</style>
