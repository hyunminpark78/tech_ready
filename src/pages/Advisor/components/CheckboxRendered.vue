<template>
  <input v-model="checked" type="checkbox" @change="onChange" />
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checked: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.checked = newValue;
    },
  },
  methods: {
    onChange() {
      this.$emit('value-changed', this.checked);
    },
  },
};
</script>
