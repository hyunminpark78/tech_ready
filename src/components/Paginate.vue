<template>
  <div class="flex items-center justify-center my-7 pagination">
    <button :style="disablePrev" @click="clickPage(1, 'pick')">
      <img src="@/assets/images/btn-first.svg" alt="처음 페이지" />
    </button>
    <button :style="disablePrev" @click="clickPage(-1, 'move')">
      <img src="@/assets/images/btn-pre.svg" alt="이전 페이지" />
    </button>
    <button
      v-for="(page, index) in pages"
      :key="index"
      class="flex items-center justify-center border rounded-sm w-9 h-9 text-xs-"
      :class="
        page === currentPage
          ? ['text-white', 'border-primary-400', 'bg-primary-400']
          : ['text-gray-600', 'border-gray-300']
      "
      @click="clickPage(page, 'pick')"
    >
      {{ page }}
    </button>
    <button :style="disableNext" @click="clickPage(1, 'move')">
      <img src="@/assets/images/btn-pre.svg" class="rotate-180-" alt="다음 페이지" />
    </button>
    <button :style="disableNext" @click="clickPage(totalPages, 'pick')">
      <img src="@/assets/images/btn-first.svg" class="rotate-180-" alt="마지막 페이지" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    totalCnt: {
      type: Number,
      default: 1,
    },
    totalPageCnt: {
      default: 5,
      type: Number,
    },
    pageNo: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      currentPage: this.pageNo,
    };
  },
  computed: {
    disablePrev: function () {
      return this.currentPage === 1 ? 'visibility: hidden' : '';
    },
    disableNext: function () {
      return this.currentPage >= this.totalPages ? 'visibility: hidden' : '';
    },
    pageCountLimit() {
      return this.totalPageCnt;
    },
    totalPages() {
      if (this.totalCnt !== 0) {
        return Math.ceil(this.totalCnt / this.pageSize);
      }

      return 0;
    },
    padding() {
      return Math.floor(this.pageCountLimit / 2);
    },
    pages() {
      const pages = [];
      let index = 0;
      if (this.pageCountLimit >= this.currentPage) {
        index = 1;
      } else {
        index = this.currentPage - this.padding;
      }
      const start =
        index <= 1
          ? 1
          : index + this.pageCountLimit > this.totalPages
          ? this.totalPages - this.pageCountLimit + 1
          : index;
      const end = start + (this.pageCountLimit > this.totalPages ? this.totalPages || 1 : this.pageCountLimit);

      for (let i = start; i < end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  watch: {
    pageNo(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.currentPage = newVal;
      }
    },
    pageSize(newVal, oldVal) {
      if (newVal !== oldVal) {
        // this.pageNo = 1;
        this.currentPage = 1;
      }
    },
    currentPage(newVal, oldVal) {
      if (this.currentPage < 1) {
        this.currentPage = 1;
      } else if (this.currentPage >= this.totalPages) {
        this.currentPage = this.totalPages;
      }
      this.$emit('input', this.currentPage);
    },
  },
  methods: {
    clickPage(page, type) {
      if (type !== 'pick') {
        page = this.currentPage + page;
      }
      this.$emit('changepage', page, type);
    },
  },
};
</script>

<style></style>
