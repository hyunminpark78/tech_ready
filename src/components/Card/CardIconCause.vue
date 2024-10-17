<template>
  <a class="flex items-center ml-6 text-sm text-gray-500">
    <span class="mr-2">
      <RouterLink :to="to"> 원인보기 </RouterLink>
    </span>
    <img src="@/assets/images/ico-link.svg" alt="." />
  </a>
</template>

<script>
export default {
  props: {
    to: {
      type: Object,
      required: true,
    },
  },
};
</script>
