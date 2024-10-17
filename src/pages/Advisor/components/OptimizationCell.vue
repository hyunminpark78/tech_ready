<template>
  <div @click="handleClick">
    <p :class="{ optimization: !isEmptyValue }">{{ text }}</p>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    text() {
      return this.params.value ? this.params.value : '-';
    },
    isEmptyValue() {
      return !this.params.value;
    },
  },
  methods: {
    handleClick() {
      if (!this.isEmptyValue) {
        const routeName = this.params.value === 'unused' ? 'Unused' : 'Rightsizing';
        console.log('debug > ', this.params.data.rsrcId);
        // this.$router.push({ name: routeName, query: { searchText: this.params.data.rsrcId } });
      }
    },
  },
};
</script>

<style>
.optimization {
  text-decoration: underline;
  cursor: pointer;
}
</style>
