<template>
  <form class="flex items-center py-4" @submit.prevent>
    <img src="@/assets/images/ico-search.svg" alt="search" />
    <input
      type="search"
      class="px-1 py-1.5 text-sm text-gray-500 mx-2 w-full"
      :placeholder="$t('common.placeholder.enterSearchTerm')"
      :value="value"
      @input="handleInput"
    />
    <button
      class="px-1 py-1.5 text-sm text-white border rounded-sm bg-primary-400 border-primary-400 w-28"
      @click="search"
    >
      {{ $t('common.button.search') }}
    </button>
  </form>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleInput($event) {
      const replaced = $event.target.value.replace(/\s{2,}/g, ' ');
      $event.target.value = replaced;
      this.$emit('input', replaced);
    },
    search() {
      this.$emit('search', this.value);
    },
  },
};
</script>
