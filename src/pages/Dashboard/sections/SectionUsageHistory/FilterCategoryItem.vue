<template>
  <button
    class="flex items-center justify-center flex-1 py-4 border-r border-primary-200"
    :class="{ clicked: active, 'cursor-default': disabled }"
    :disabled="disabled"
    v-on="$listeners"
  >
    <img :src="src" :alt="iconSrc.filename" :class="{ 'opacity-50-': disabled }" />
    <span class="ml-3" :class="{ 'opacity-50-': disabled }">{{ title }}</span>
  </button>
</template>

<script>
export default {
  props: {
    active: Boolean,
    iconSrc: {
      type: Object,
      default: () => ({ path: 'assets/images', filename: '', extension: '' }),
    },
    title: {
      type: String,
      default: '',
    },
    disabled: Boolean,
  },
  computed: {
    src() {
      const { filename, extension } = this.iconSrc;
      if (!filename) {
        return null;
      }
      return require(`@/assets/images/${filename}${this.suffix}.${extension}`);

      // FIXME: warning 이유 찾기
      // const { path, filename, extension } = this.iconSrc;
      // return require(`@/${path}/${filename}${this.suffix}.${extension}`);
    },
    suffix() {
      if (this.active) {
        return '-clicked';
      }
      if (this.disabled) {
        return '-disabled';
      }
      return '';
    },
  },
};
</script>
