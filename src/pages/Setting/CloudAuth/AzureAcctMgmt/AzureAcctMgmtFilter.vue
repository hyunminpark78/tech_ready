<template>
  <div class="title pr30">
    <!-- search -->
    <div class="search-wrap flex flex-between mt-0.5 pr-2">
      <div class="flex">
        <RadioGroup
          ref="categoryRadioGroup"
          class=""
          :active-classes="['text-white', 'bg-primary-400', 'border-primary-400']"
          :standard-classes="['bg-white', 'text-primary-400', 'border-primary-400']"
        >
          <button class="px-2.5 py-1 text-sm font-bold border rounded-sm h-8 mr-3 border-4" @click="viewList('app')">
            {{ $t('setting.application') }}
          </button>
          <button class="px-2.5 py-1 text-sm font-bold border rounded-sm h-8 mr-3 border-4" @click="viewList('subs')">
            Subscription
          </button>
        </RadioGroup>
        <div class="ml-2">
          <input
            v-model.trim="searchKeyword"
            type="text"
            :placeholder="$t('common.placeholder.enterSearchTerm')"
            class="keyword"
            @input="handleInput"
            @keyup.enter="onSearch"
          />
          <a href="javascript:void(0);" class="btn ml-2" @click="onSearch">{{ $t('common.button.search') }}</a>
        </div>
      </div>

      <div>
        <div class="ml-2">
          <a href="javascript:void(0);" class="btn ml-2" @click="goToCreateApp">{{ $t('setting.appRegist') }}</a>
        </div>
      </div>
    </div>
    <!-- //search -->
  </div>
  <!-- //module -->
</template>

<script>
import { mapActions } from 'vuex';
import RadioGroup from '@/components/RadioGroup.vue';

export default {
  components: {
    RadioGroup,
  },
  data() {
    return {
      // isSearch: true,
      searchType: null,
      searchKeyword: null,
      appId: null,
    };
  },
  computed: {},
  created() {
    this.viewList('app');
  },
  methods: {
    ...mapActions('azureAcctMgmt', ['fetchSearch', 'fetchParam', 'setListType']),
    handleInput($event) {
      const replaced = $event.target.value.replace(/\s{2,}/g, ' ');
      $event.target.value = replaced;
      this.$emit('input', replaced);
    },
    goToCreateApp() {
      this.$router.push('/setting/azureAcctCreate');
    },
    viewList(type) {
      this.searchKeyword = null;
      this.appId = null;
      this.setListType(type);
      this.onSearch();
    },
    onSearch() {
      this.fetchParam({ searchKeyword: this.searchKeyword, appId: this.appId });
      this.fetchSearch();
    },
  },
};
</script>

<style>
.border-4 {
  border-radius: 4px;
}

.flex-between {
  justify-content: space-between;
}
</style>
