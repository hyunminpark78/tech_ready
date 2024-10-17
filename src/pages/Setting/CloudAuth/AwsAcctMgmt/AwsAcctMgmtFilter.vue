<template>
  <div class="title pr30">
    <!-- search -->
    <div class="search-wrap flex">
      <div class="flex-1">
        <input
          v-model.trim="searchKeyword"
          type="text"
          :placeholder="$t('common.placeholder.enterSearchTerm')"
          class="keyword"
          @input="handleInput"
          @keyup.enter="onSearch"
        />
      </div>
      <a href="javascript:void(0);" class="btn ml-2" @click="onSearch">{{ $t('common.button.search') }}</a>
    </div>
    <!-- //search -->
  </div>
  <!-- //module -->
</template>

<script>
import { mapActions } from 'vuex';

export default {
  components: {},
  data() {
    return {
      searchKeyword: '',
      isSearch: true,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.onSearch();
  },
  methods: {
    ...mapActions('awsAcctMgmt', ['fetchSearch', 'fetchParam']),
    handleInput($event) {
      const replaced = $event.target.value.replace(/\s{2,}/g, ' ');
      $event.target.value = replaced;
      this.$emit('input', replaced);
    },
    onSearch() {
      this.fetchParam({ state: { searchKeyword: this.searchKeyword } });
      this.isSearch = true;
      this.initSearch();
    },
    initSearch() {
      this.fetchSearch({ isSearch: { isSearch: this.isSearch } });
      this.isSearch = false;
    },
  },
};
</script>

<style></style>
