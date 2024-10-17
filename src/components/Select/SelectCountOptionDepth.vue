<template>
  <li v-on="$listeners">
    <template v-if="type === 'check'">
      <button class="w-5 mr-3">
        <img
          style="max-width: fit-content"
          :src="require(`@/assets/images/ico-rcheck-${checked ? 'on' : 'off'}.svg`)"
          alt="."
        />
      </button>
      <span style="white-space: normal" class="flex-1">{{ text }}</span>
    </template>
    <template v-else>
      <span style="white-space: normal" class="flex-1">{{ text }}</span>
    </template>
  </li>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'normal',
      validator: (v) => ['normal', 'check'].includes(v),
    },
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
