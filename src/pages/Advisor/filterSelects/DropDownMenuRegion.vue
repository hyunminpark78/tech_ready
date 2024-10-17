<template>
  <div v-click-outside="handleClickOutside">
    <button :class="selectClass" :disabled="pending || !hasData" @click="toggle">
      <template v-if="pending">
        <span class="text-primary-400 selected-text">-</span>
      </template>
      <template v-else-if="allItemChecked || noItemChecked">
        <span class="text-primary-400 selected-text">{{ $t('resource.all') }}</span>
      </template>
      <template v-else-if="data === null || data.length === 0">
        <span class="text-primary-400 selected-text">{{ $t('resource.all') }}</span>
      </template>
      <template v-else>
        <span>
          <span class="text-primary-400 selected-text">{{ activeCount }}</span
          >{{ `/${totalCount}` }}</span
        >
      </template>
      <img :src="arrowSrc" alt="arrow" :class="[arrowClass, arrowRotationClass]" />
    </button>

    <div
      ref="list"
      :class="[optionListWrapperClass, { hidden: !isOpened }]"
      style="max-height: 385px !important; overflow-y: hidden; width: 100%"
    >
      <div style="overflow-y: scroll; max-height: 344px">
        <form class="flex items-center py-4" @submit.prevent>
          <img src="@/assets/images/ico-search.svg" alt="search" style="margin: 0 0 0 22px" />
          <input
            v-model="keyword"
            type="text"
            class="px-1 py-1.5 text-sm text-gray-500 mx-2 w-full"
            :placeholder="$t('common.placeholder.enterSearchTerm')"
          />
        </form>
        <hr />
        <ul :class="optionListClass" tabindex="0">
          <SelectCountOption
            v-if="!disableCheckAll"
            type="check"
            :class="optionListItemClass"
            :item="allItem"
            :checked="allItemChecked"
            @click="handleCheckAllClick"
          />
          <SelectCountOption
            v-for="item in data.filter((x) => textGetter(x).toLowerCase().includes(keyword.trim()))"
            :key="keyGetter(item)"
            type="check"
            :class="optionListItemClass"
            :item="item"
            :text-getter="textGetter"
            :checked="checkedItems.map(keyGetter).includes(keyGetter(item))"
            @click="() => updateCheckedItem(item, !checkedItems.map(keyGetter).includes(keyGetter(item)))"
          />
        </ul>
      </div>
      <div class="flex fixedSearch">
        <button
          class="w-1/2 select-button text-sm text-gray-600 bg-white border-t border-gray-300 rounded-bl"
          @click="cancel"
        >
          {{ $t('common.button.cancel') }}
        </button>
        <button
          class="w-1/2 select-button text-sm font-bold text-white border-t rounded-br bg-primary-400 border-primary-400"
          @click="apply"
        >
          {{ $t('common.button.confirmation') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import selectMixin from '@/components/Select/selectMixin';
import SelectCountOption from '@/components/Select/SelectCountOption';
import { mapActions } from 'vuex';
import { i18n } from '../../../../public/locales/i18n';
export default {
  components: { SelectCountOption },
  mixins: [selectMixin],
  props: {
    disableCheckAll: Boolean,
    selectClass: {
      type: [Object, Array, String],
      default: 'flex items-center justify-between w-full text-gray-700',
    },
    arrowSrc: {
      type: [String],
      default: () => require('@/assets/images/arrow-typ-02.svg'),
    },
    arrowClass: {
      type: [Object, Array, String],
      default: 'ml-4',
    },
    optionListWrapperClass: {
      type: [Object, Array, String],
      default: 'absolute z-20 bg-white border rounded border-primary-200 with-button is-h-220',
    },
    optionListClass: {
      type: [Object, Array, String],
      default: 'text-sm text-gray-700',
    },
    optionListItemClass: {
      type: [Object, Array, String],
      default: 'flex items-start px-5 py-3 cursor-pointer hover:bg-primary-300',
    },
  },
  data() {
    return {
      checkedItems: [],
      allItem: {},
      previousCheckedItems: [],
      previousCheckedItemsBeforeCheckAll: [],
      keyword: '',
    };
  },
  computed: {
    isOpened() {
      return this.showOptions;
    },
    activeCount() {
      return this.checkedItems.length;
    },
    totalCount() {
      return this.data.length;
    },
    noItemChecked() {
      return this.data.length !== 0 && this.activeCount === 0;
    },
    allItemChecked() {
      return this.data.length !== 0 && this.activeCount === this.totalCount;
    },
    checkData() {
      return this.keyword;
    },
  },

  watch: {
    '$i18n.locale': 'setAllItem',
    data() {
      this.checkedItems = this.checkedItems.filter((checked) =>
        this.data.find((item) => this.keyGetter(item) === this.keyGetter(checked))
      );
      this.previousCheckedItems = this.previousCheckedItems.filter((checked) =>
        this.data.find((item) => this.keyGetter(item) === this.keyGetter(checked))
      );
      this.previousCheckedItemsBeforeCheckAll = this.previousCheckedItemsBeforeCheckAll.filter((checked) =>
        this.data.find((item) => this.keyGetter(item) === this.keyGetter(checked))
      );
    },
  },
  mounted() {
    this.setAllItem();
  },
  methods: {
    ...mapActions('spotAdvisor', ['fetchParam']),
    setAllItem() {
      if (i18n.locale === 'ko') {
        this.allItem = {
          id: 'checkAll',
          text: '전체',
        };
      } else {
        this.allItem = {
          id: 'checkAll',
          text: 'All',
        };
      }
    },
    updateCheckedItem(e, checked) {
      if (checked) {
        this.checkedItems = [...this.checkedItems, e];
      } else {
        this.checkedItems = this.checkedItems.filter((item) => this.keyGetter(item) !== this.keyGetter(e));
      }
    },
    open() {
      this.showOptions = true;
    },
    close() {
      this.showOptions = false;
    },
    toggle() {
      this.isOpened ? this.cancel() : this.open();
    },
    handleSearchClick() {
      this.close();
      this.$emit('search');
    },
    apply() {
      this.previousCheckedItems = [...this.checkedItems];
      this.previousCheckedItemsBeforeCheckAll = [];
      this.close();
      this.$emit('change', this.checkedItems);
    },
    applyNotChangeListner() {
      this.previousCheckedItems = [...this.checkedItems];
      this.previousCheckedItemsBeforeCheckAll = [];
      this.close();
    },
    cancel() {
      this.checkedItems = [...this.previousCheckedItems];
      this.previousCheckedItemsBeforeCheckAll = [];
      this.close();
    },
    reset() {
      this.checkedItems = [];
      this.previousCheckedItems = [];
      this.previousCheckedItemsBeforeCheckAll = [];
      this.fetchParam({ state: { regionSepList: [] } });
    },
    handleCheckAllClick() {
      if (this.allItemChecked) {
        this.checkedItems = [];
      } else {
        this.checkedItems = [...this.data];
      }
    },
  },
};
</script>
<style scoped>
.is-h-220 {
  min-height: 220px !important;
}
.select-button {
  padding: 10px 4px;
}
.selected-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
