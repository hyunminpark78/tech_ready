<template>
  <li v-on="$listeners">
    <template v-if="type === 'check'">
      <button class="w-5 mr-3">
        <img :src="require(`@/assets/images/ico-rcheck-${checked ? 'on' : 'off'}.svg`)" alt="." />
      </button>
      <span class="flex-1">
        <span v-html="formattedText"></span>
      </span>
    </template>
    <template v-else>
      <span class="flex-1">{{ text }}</span>
    </template>
  </li>
</template>

<script>
export default {
  props: {
    type: String,
    item: Object,
    textGetter: Function,
    checked: Boolean,
    isUnmapped: Boolean,
    svc: String,
  },
  computed: {
    text() {
      return this.textGetterById(this.item);
    },
    formattedText() {
      if (this.isUnmapped) {
        return `${this.text} <span style="color: red;">${this.$t('optimization.notConnected')}</span>`;
      }
      return this.text;
    },
  },
  methods: {
    textGetterById(item) {
      if (this.svc === 'svc') {
        return `${item.nm}`;
      }
      return `${item.nm}(${item.id})`;
    },
  },
};
</script>

<style>
.text-red {
  color: red;
}
</style>
