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

    <div ref="list" :class="[optionListWrapperClass, { hidden: !isOpened }]" class="option-list-wrapper-class">
      <form class="flex items-center py-4" @submit.prevent>
        <img src="@/assets/images/ico-search.svg" alt="search" style="margin: 0 0 0 22px" />
        <input
          type="search"
          class="px-1 py-1.5 text-sm text-gray-500 mx-2 w-full"
          :placeholder="$t('common.placeholder.enterSearchTerm')"
          :value="keyword"
          @input="changeKeyword"
        />
      </form>
      <hr />
      <ul :class="optionListClass" class="option-list-class" tabindex="0">
        <SelectCountOptionDepth
          v-if="!disableCheckAll && allItem.text.indexOf(keyword) > -1"
          type="check"
          :class="optionListItemClass"
          :item="allItem"
          :checked="allItemChecked"
          @click="handleCheckAllClick"
        />
        <li v-for="item in data" :key="item.id">
          <SelectCountOptionDepth
            v-if="
              item[childkey].filter((acnt) => acnt.nm.indexOf(keyword) > -1 || acnt.id.indexOf(keyword) > -1).length >
                0 || item.nm.indexOf(keyword) > -1
            "
            :key="keyGetter(item)"
            type="check"
            :class="optionListItemClass"
            :item="item"
            :text-getter="textGetter"
            :checked="checkedItems.map(keyGetter).includes(keyGetter(item))"
            @click="() => handleParentsClick(item, !checkedItems.map(keyGetter).includes(keyGetter(item)))"
          />
          <ul style="margin: 0 0 0 31px">
            <SelectCountOptionDepth
              v-for="acnt in item[childkey].filter(
                (acnt) => acnt.nm.indexOf(keyword) > -1 || acnt.id.indexOf(keyword) > -1
              )"
              :key="keyGetter(acnt)"
              type="check"
              :class="optionListItemClass"
              :item="acnt"
              :text-getter="textGetterById"
              :checked="checkedItems.map(keyGetter).includes(keyGetter(acnt))"
              @click="() => updateCheckedItem(acnt, !checkedItems.map(keyGetter).includes(keyGetter(acnt)))"
            />
          </ul>
        </li>
      </ul>
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
import SelectCountOptionDepth from './SelectCountOptionDepth.vue';
import { i18n } from '../../../public/locales/i18n';
export default {
  components: { SelectCountOptionDepth },
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
    childkey: {
      type: String,
      default: 'acntList',
    },
    filterParamList: {
      type: [Array],
      default: () => [],
    },
    filterCtrtId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      allItem: {},
      checkedItems: [],
      previousCheckedItems: [],
      previousCheckedItemsBeforeCheckAll: [],
      keyword: '',
      initFilter: true,
    };
  },
  computed: {
    isOpened() {
      return this.showOptions;
    },
    activeCount() {
      return this.childActiveCount; //this.checkedItems.length;
    },
    childActiveCount() {
      return this.checkedItems.filter((item) => !item[this.childkey]).length; ///this.checkedItems.filter((item) => !!item[this.childkey]).length;
    },
    totalCount() {
      let cnt = 0;
      cnt = this.data.reduce((accum, val) => {
        accum += val[this.childkey].length;
        return accum;
      }, 0);

      return cnt; //this.data.length;
    },
    noItemChecked() {
      return this.activeCount === 0;
    },
    allItemChecked() {
      return this.childActiveCount === this.totalCount; //this.parentActiveCount === this.totalCount; // pareant all check됐을 때
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
    textGetterById(item) {
      return `${item.nm}(${item.id})`;
    },
    updateCheckedItem(e, checked) {
      // e -> check한값
      if (checked) {
        this.checkedItems = [...this.checkedItems, e];
      } else {
        this.checkedItems = this.checkedItems.filter((item) => this.keyGetter(item) !== this.keyGetter(e));
      }

      const parentItem = this.data.filter((data) => data.id === e.ctrtId)[0];
      const childChecked = this.checkedItems.filter((item) => item.ctrtId === parentItem.id);
      if (parentItem[this.childkey].length === childChecked.length) {
        this.checkedItems = [...this.checkedItems, parentItem];
      } else {
        this.checkedItems = this.checkedItems.filter((item) => item.id !== e.ctrtId);
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
    handleParentsClick(e, checked) {
      /*if (checked) {
        this.checkedItems = [...this.checkedItems, e];
        if (e[this.childkey]) {
          e[this.childkey].forEach((val) => {
            this.checkedItems = [...this.checkedItems, val];
          });
        }
      } else {
        this.checkedItems = this.checkedItems.filter((item) => this.keyGetter(item) !== this.keyGetter(e));
        if (e[this.childkey]) {
          e[this.childkey].forEach((val) => {
            this.checkedItems = this.checkedItems.filter((item) => this.keyGetter(item) !== this.keyGetter(val));
          });
        }
      }*/
      if (!checked) {
        this.checkedItems = this.checkedItems.filter((item) => item.id !== e.id && !e[this.childkey].includes(item));
      } else {
        // 체크 시, 부모와 모든 자식을 추가하기 전에 기존 자식들을 제거
        this.checkedItems = this.checkedItems.filter((item) => item.id !== e.id && !e[this.childkey].includes(item));

        // 부모 항목 추가
        this.checkedItems.push(e);

        // 자식 항목 추가
        e[this.childkey].forEach((childItem) => {
          this.checkedItems.push(childItem);
        });
      }
    },
    handleCheckCtrtClick() {
      this.data.forEach((val) => {
        if (val.id === this.filterCtrtId) {
          this.handleParentsClick(val, true);
        }
      });
      this.$emit('change', this.checkedItems);
    },
    handleCheckAllClick() {
      this.previousCheckedItemsBeforeCheckAll = [...this.checkedItems];
      this.allchildCheck();
      this.checkedItems = this.allItemChecked ? [...this.checkedItems, ...this.data] : [];
      if (this.initFilter && this.filterParamList.length > 0) {
        const remaindList = this.checkedItems.filter((item) => this.filterParamList.includes(item.id));
        // const remainObj = {};
        // remaindList.forEach((val) => {
        // remainObj[val.ctrtId] = remainObj[val.ctrtId] >= 0 ? (remainObj[val.ctrtId] += 1) : 0;
        // });
        this.checkedItems = [...remaindList];
        this.initFilter = false;
      }
    },
    allchildCheck() {
      const tempArrayList = [];
      this.data.forEach((val) => {
        val[this.childkey].forEach((val2) => {
          this.allItemChecked ? [] : tempArrayList.push(val2);
        });
      });
      this.checkedItems = tempArrayList;
    },
    changeKeyword(e) {
      this.keyword = e.target.value;
    },
  },
};
</script>

<style>
.option-list-wrapper-class {
  max-height: 385px !important;
  min-width: 400px;
  overflow-y: auto !important;
}
.option-list-class {
  max-height: 277px;
  overflow-y: scroll;
}
</style>
