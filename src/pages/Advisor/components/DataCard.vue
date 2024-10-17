<template>
  <div class="data-card">
    <div :class="['card-title', { titlePink: titlePink }]">{{ title }}</div>
    <div class="card-value">{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: 'DataCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },

    titlePink: {
      type: String,
      default: '',
      required: false,
    },
  },
};
</script>

<style scoped>
.data-card {
  border: 1px solid #e9ebed;
  border-radius: 4px;
  padding: 24px;
  width: 300px;
}
.card-title {
  color: #00a5ee;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
}

.titlePink {
  color: #fc5aa1;
}

.card-value {
  font-size: 30px;
  font-weight: bold;
}
</style>
