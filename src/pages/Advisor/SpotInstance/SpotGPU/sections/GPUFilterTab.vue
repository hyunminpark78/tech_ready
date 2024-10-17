<template>
  <div :class="['gpuTab', { active: isActive }]" @click="$emit('click')">
    <p>{{ label }}</p>
  </div>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.gpuTab {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem 0rem 0rem 0.5rem;
  border: 1px solid #e3ebf1;
  background: #f5f5f5;
  font-size: 0.875rem;
  text-align: center;
  cursor: pointer;
}

.gpuTab:last-child {
  border-radius: 0rem 0.5rem 0.5rem 0rem;
}

.gpuTab p {
  color: #888888;
  font-size: 14px;
}

.gpuTab.active {
  border: 1px solid #00a5ed;
  background: #fff;
}

.gpuTab.active p {
  color: #00a5ed;
  font-weight: 700;
}
</style>
