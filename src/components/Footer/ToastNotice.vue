<template>
  <RouterLink :to="`/support/notice/${data.bbmId}`">
    <div
      class="
        z-10
        flex
        items-center
        w-full
        p-4
        text-sm
        font-bold
        text-white
        bg-gray-700 bg-opacity-75
        rounded-lg
        footer-noti
        hover:bg-opacity-100
      "
    >
      <div class="flex items-center">
        <img :src="require('@/assets/images/ico-notice.svg')" alt="notice" />
        <span class="ml-1 text-xs-">공지사항</span>
      </div>
      <span class="mx-8">{{ data.titNm }}</span>
      <span class="text-white text-opacity-50 text-xs-">{{ data.frstRegDtm | toDateDot }}</span>
      <button class="ml-auto">
        <img :src="require('@/assets/images/ico-close-typ-01.svg')" alt="close" @click.stop.prevent="$emit('close')" />
      </button>
    </div>
  </RouterLink>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>
