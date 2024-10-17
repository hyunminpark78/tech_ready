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
      let modifiedText;
      if (this.text.length >= 35) {
        const breakPoint = this.text.indexOf('(');
        if (breakPoint !== -1) {
          modifiedText = this.text.substring(0, breakPoint) + '<br>' + this.text.substring(breakPoint);
        } else {
          modifiedText = this.text;
        }
      } else {
        modifiedText = this.text;
      }

      if (this.isUnmapped) {
        return `${modifiedText} <span style="color: red;">${this.$t('resource.notConnected')}</span>`;
        // return `${this.text} <span style="color: red;">(미연결)</span>`;
      }
      return modifiedText;
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
