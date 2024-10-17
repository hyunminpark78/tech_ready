<template>
  <li v-on="$listeners">
    <span>{{ text }}</span>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    textGetter: {
      type: Function,
      default: (item) => item.text,
    },
    checked: Boolean,
  },
  computed: {
    text() {
      return this.textGetter(this.item);
    },
  },
};
</script>
