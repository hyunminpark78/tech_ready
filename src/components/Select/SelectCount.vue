<template>
  <div v-click-outside="handleClickOutside">
    <button :class="selectClass" :disabled="pending || !hasData" @click="toggle">
      <template v-if="pending">
        <span class="text-primary-400">-</span>
      </template>
      <template v-else-if="allItemChecked || noItemChecked">
        <span class="text-primary-400">{{ $t('optimization.all') }}</span>
      </template>
      <template v-else>
        <span>
          <span class="text-primary-400">{{ activeCount }}</span
          >{{ `/${totalCount}` }}</span
        >
      </template>
      <img :src="arrowSrc" alt="arrow" :class="[arrowClass, arrowRotationClass]" />
    </button>

    <div
      ref="list"
      :class="[optionListWrapperClass, { hidden: !isOpened }]"
      style="max-height: 385px; overflow-y: hidden"
    >
      <div style="overflow-y: auto; max-height: 344px">
        <ul ref="optionList" :class="optionListClass" tabindex="0">
          <SelectCountOption
            v-if="!disableCheckAll"
            type="check"
            :class="optionListItemClass"
            :item="allItem"
            :checked="allItemChecked"
            @click="handleCheckAllClick"
          />
          <SelectCountOption
            v-for="item in data"
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
          class="w-1/2 px-1 py-2.5 text-sm text-gray-600 bg-white border-t border-gray-300 rounded-bl"
          @click="cancel"
        >
          {{ $t('common.button.cancel') }}
        </button>
        <button
          class="w-1/2 px-1 py-2.5 text-sm font-bold text-white border-t rounded-br bg-primary-400 border-primary-400"
          @click="apply"
        >
          {{ $t('common.button.confirmation') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import selectMixin from './selectMixin';
import SelectCountOption from './SelectCountOption.vue';
import { i18n } from '../../../public/locales/i18n';

export default {
  components: { SelectCountOption },
  mixins: [selectMixin],
  props: {
    disableCheckAll: Boolean,
    selectedProdList: {
      type: [Array, String],
      default: null,
    },
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
      default: 'absolute z-20 bg-white border rounded border-primary-200 with-button',
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
      return this.activeCount === 0;
    },
    allItemChecked() {
      return this.activeCount === this.totalCount;
    },
  },
  watch: {
    '$i18n.locale': 'setAllItem',
    data() {
      this.checkedItems = this.checkedItems.filter((checked) => this.data.find((item) => item.id === checked.id));
      this.previousCheckedItems = this.previousCheckedItems.filter((checked) =>
        this.data.find((item) => item.id === checked.id)
      );
      this.previousCheckedItemsBeforeCheckAll = this.previousCheckedItemsBeforeCheckAll.filter((checked) =>
        this.data.find((item) => item.id === checked.id)
      );
    },
    selectedProdList() {
      if (this.selectedProdList) {
        this.checkedItems = this.checkedItems.filter((checked) =>
          this.selectedProdList.find((item) => item === checked.cd)
        );
        this.previousCheckedItems = [...this.checkedItems];
      }
    },
  },
  mounted() {
    this.setAllItem();
  },
  methods: {
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
    },
    handleCheckAllClick() {
      /*
      if (this.previousCheckedItemsBeforeCheckAll.length > 0) {
        this.checkedItems = [...this.previousCheckedItemsBeforeCheckAll];
        this.previousCheckedItemsBeforeCheckAll = [];
      } else {
        this.previousCheckedItemsBeforeCheckAll = [...this.checkedItems];
        this.checkedItems = this.allItemChecked ? [] : [...this.data]; // 다른 부분
      }
      */

      this.previousCheckedItemsBeforeCheckAll = [...this.checkedItems];
      this.checkedItems = this.allItemChecked ? [] : [...this.data]; // 다른 부분
    },
  },
};
</script>
<style scoped>
.left-auto {
  left: auto !important;
}
</style>
