<template>
  <div class="flex items-center py-5">
    <template v-for="(item, index) in breadcrumbArray">
      <img
        :key="`${item.path}_img`"
        :src="item.iconSrc"
        :alt="item.iconAlt"
        :class="index === 0 ? 'mr-2' : 'mx-1 -rotate-90-'"
      />
      <span
        :key="`${item.path}_span`"
        class="text-2xl--"
        :class="{ 'font-bold': index === breadcrumbArray.length - 1 }"
      >
        {{ item.title }}
      </span>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    breadcrumbArray() {
      const paths = this.$route.path.replace(/^\//, '').split('/');
      return paths.map((path) => ({
        path,
        iconSrc: this.iconSrc(path),
        iconAlt: this.iconSrc(path).match(/[^\\\/]+(?=\.[\w]+$)|[^\\\/]+$/)[0],
        title: this.title(path),
      }));
    },
  },
  methods: {
    iconSrc(path) {
      switch (path) {
        case 'analysis':
          return require('@/assets/images/ico-report.svg');
        default:
          return require('@/assets/images/arrow-typ-02-black.svg');
      }
    },
    title(path) {
      switch (path) {
        case 'analysis':
          return '사용분석';
        case 'usage-history':
          return '사용내역';
        case 'pattern-analysis':
          return '비용 패턴 분석';
        case 'fraud-detection':
          return '이상 비용 탐지';
        default:
          return '';
      }
    },
  },
};
</script>
