<template>
  <div class="flex text-center dashboard-tab-buttons border-l border-t border-r">
    <FilterCategoryItem
      v-for="item in data"
      :key="item.name"
      :icon-src="item.iconSrc"
      :title="item.name"
      :active="item.name === filter.name"
      :disabled="isDisabled(item)"
      @click="() => handleClick(item)"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import FilterCategoryItem from './FilterCategoryItem.vue';
export default {
  components: { FilterCategoryItem },
  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    availableItems: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {},
  methods: {
    handleClick(item) {
      if (this.isActive(item)) {
        return false;
      }

      this.$emit('change', item);
    },
    isActive(item) {
      return item.name === this.filter.name;
    },
    isDisabled(item) {
      return !this.availableItems.map((e) => e.name).includes(item.name);
    },
  },
};
</script>
