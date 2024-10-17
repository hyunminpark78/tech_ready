<template>
  <transition name="flip" mode="out-in">
    <slot v-if="face === 'front'" name="front" />
    <slot v-else name="back" />
  </transition>
</template>

<script>
export default {
  props: {
    face: {
      type: String,
      default: 'front',
    },
  },
};
</script>

<style lang="sass" scoped>
.flip-enter-active
  // animation: flip-in .35s
  animation: flip-in .35s 0s 1 normal both

.flip-leave-active
  // animation: flip-in .35s reverse
  animation: flip-in .35s 0s 1 reverse both

@keyframes flip-in
  from
    transform: rotateX(90deg)
    opacity: 0.5
  to
    transform: rotateX(0)
    opacity: 1
</style>
