<template>
  <div class="flex justify-center">
    <div v-if="tagList.length" class="ml-1 mr-1 rounded-lg px-2 py-1.5 text-sm bg-gray-200">
      {{ tagList[0].key }} <span class="text-gray-500"> | </span> {{ tagList[0].value }}
    </div>
    <div v-if="tagList.length > 1" class="ml-1 mr-1 rounded-lg px-2 py-1.5 text-sm bg-gray-200 text-gray-500">
      +{{ tagList.length - 1 }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    tagList() {
      return this.params.value;
    },
  },
};
</script>

<style></style>
