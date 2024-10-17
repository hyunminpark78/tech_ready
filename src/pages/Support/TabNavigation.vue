<template>
  <div class="flex border-t border-b border-pprimary-200 tab-one">
    <button
      class="flex items-center justify-center w-1/3 py-5 text-gray-600 bg-white border-r border-primary-200"
      :class="{ clicked: isActive('공지사항') }"
    >
      <!-- TODO: 개발 완료 후 다시 추가 예정 -->
      <!-- <button class="flex items-center justify-center w-1/3 py-5 text-gray-600 bg-white border-r border-primary-200" :class="{ clicked: isActive('공지사항') }"> -->
      <RouterLink to="notice" class="flex items-center justify-center">
        <img
          :src="require(`@/assets/images/ico-notice-${isActive('공지사항') ? 'on' : 'off'}.svg`)"
          alt="."
          class="mr-3"
        />
        공지사항
      </RouterLink>
    </button>
    <button
      class="flex items-center justify-center w-1/3 py-5 text-gray-600 bg-white border-r border-primary-200"
      :class="{ clicked: isActive('자주묻는 질문들') }"
    >
      <!-- TODO: 개발 완료 후 다시 추가 예정 -->
      <!-- <button class="flex items-center justify-center w-1/3 py-5 text-gray-600 bg-white border-r border-primary-200" :class="{ clicked: isActive('자주묻는 질문들') }"> -->
      <RouterLink to="faq" class="flex items-center justify-center">
        <img
          :src="require(`@/assets/images/ico-faq-${isActive('자주묻는 질문들') ? 'on' : 'off'}.svg`)"
          alt="."
          class="mr-3"
        />
        자주묻는 질문들
      </RouterLink>
    </button>
    <!-- TODO: 개발 완료 후 다시 추가 예정 -->
    <button
      class="flex items-center justify-center w-1/3 py-5 text-gray-600 bg-white border-r border-primary-200"
      :class="{ clicked: isActive('1:1문의') }"
    >
      <RouterLink to="qna" class="flex items-center justify-center">
        <img
          :src="require(`@/assets/images/ico-counseling-${isActive('1:1문의') ? 'on' : 'off'}.svg`)"
          alt="."
          class="mr-3"
        />
        1:1문의
      </RouterLink>
    </button>
  </div>
</template>

<script>
export default {
  computed: {
    routeName() {
      return this.$route.name;
    },
  },
  methods: {
    isActive(routeName) {
      return this.routeName === routeName;
    },
  },
};
</script>
