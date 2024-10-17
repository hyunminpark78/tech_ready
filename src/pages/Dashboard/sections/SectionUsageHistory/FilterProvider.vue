<template>
  <div class="dashboard-tab-contents">
    <div class="flex justify-center py-6 border rounded-b-lg border-primary-200">
      <FilterProviderItem
        v-for="item in data"
        :key="item.provider"
        :provider="item.provider"
        :icon-src="item.iconSrc"
        :account-count="item.accountCount"
        :checked="isChecked(item)"
        :isDisabled="isDisabled(item)"
        @change="({ provider, checked }) => $emit('change', { provider, checked })"
      />
    </div>
  </div>
</template>

<script>
import FilterProviderItem from './FilterProviderItem.vue';

export default {
  components: { FilterProviderItem },
  props: {
    data: {
      type: Array,
      required: true,
    },
    filter: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    isChecked(item) {
      return this.filter.includes(item.provider);
    },
    isDisabled(item) {
      return !item.accountCount > 0;
    },
  },
};
</script>
