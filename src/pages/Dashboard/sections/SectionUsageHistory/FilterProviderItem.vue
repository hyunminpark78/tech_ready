<template>
  <div
    class="flex items-center py-2 mx-3 border border-gray-300 rounded-sm"
    :class="{ 'border-primary-400': $attrs.checked }"
  >
    <div class="px-4"><img :src="src" alt="." class="w-7" /></div>
    <div class="pl-4 pr-2 border-l border-gray-300">
      <div class="text-sm font-bold">{{ provider }}</div>
      <div class="text-gray-500 text-xs-">{{ accountCountText }}</div>
    </div>
    <ProviderCheckbox
      :checked="$attrs.checked"
      :isDisabled="isDisabled"
      @change="(checked) => $emit('change', { provider, checked })"
    />
  </div>
</template>

<script>
import ProviderCheckbox from './FilterProviderItemCheckbox.vue';

export default {
  components: { ProviderCheckbox },
  props: {
    provider: {
      type: String,
      required: true,
    },
    iconSrc: {
      type: Object,
      default: () => ({ path: 'assets/images', filename: '', extension: '' }),
    },
    accountCount: {
      type: Number,
      default: 0,
    },
    isDisabled: {
      type: Boolean,
    },
  },
  computed: {
    src() {
      const { filename, extension } = this.iconSrc;
      return require(`@/assets/images/${filename}.${extension}`);

      // FIXME: warning 이유 찾기
      // const { path, filename, extension } = this.iconSrc;
      // return require(`@/${path}/${filename}${this.suffix}.${extension}`);
    },
    accountCountText() {
      if (this.provider === 'Azure') {
        const isPlural = this.accountCount > 1;
        return `${this.accountCount} Subscription${isPlural ? 's' : ''}`;
      } else if (this.provider === 'GCP') {
        const isPlural = this.accountCount > 1;
        return `${this.accountCount} project${isPlural ? 's' : ''}`;
      } else {
        const isPlural = this.accountCount > 1;
        return `${this.accountCount} Account${isPlural ? 's' : ''}`;
      }
    },
  },
};
</script>
