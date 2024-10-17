<template>
  <nav class="py-8 -mr-4">
    <RouterLink v-for="item in navigationItems" :key="item.id" :to="item.path" class="px-2 mx-4 text-gray-700">
      {{ item.name }}
    </RouterLink>
  </nav>
</template>

<script>
export default {
  props: {
    navigationItems: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
