<template>
  <div v-click-outside="handleClickOutside">
    <button :class="selectClass" :disabled="pending || !hasData" @click="toggle">
      <template v-if="pending">
        <span class="text-primary-400">-</span>
      </template>
      <template v-else-if="noItemChecked">
        <span class="text-primary-400">{{ $t('common.select.select') }}</span>
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
      <div style="overflow-y: scroll; max-height: 344px">
        <div
          class="relative bg-white border rounded border-primary-400 dashboard-card select-two"
          style="width: 85%; margin: auto; margin-top: 12px !important"
        >
          <Select
            v-show="filteredCustCorpList.length > 1"
            ref="custCorpSel"
            class="is-w-100per"
            :data="filteredCustCorpList"
            :text-getter="(item) => item.nm"
            :key-getter="(item) => item.nm"
            select-class="flex items-center justify-between w-full px-4 py-1.5 text-sm text-left"
            :arrow-src="require('@/assets/images/arrow-typ-03.svg')"
            arrow-class="-mr-2"
            option-list-style="top:33px;"
            option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200 top-33"
            option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
            @click="handleCustCorpChange"
          />
        </div>
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
        <ul :class="optionListClass" tabindex="0">
          <li v-for="item in filteredData" :key="item.id">
            <SelectCountOption
              v-if="!disableCheckAll"
              type="check"
              :class="optionListItemClass"
              :item="allItem"
              :checked="allItemChecked"
              @click="handleCheckAllClick"
            />
            <ul style="margin: 0 0 0 31px">
              <SelectCountOption
                v-for="acnt in item[childkey].filter(
                  (child) => child.nm.indexOf(keyword) > -1 || child.id.indexOf(keyword) > -1
                )"
                :key="keyGetter(acnt)"
                type="check"
                :class="optionListItemClass"
                :item="acnt"
                :text-getter="textGetter"
                :checked="checkedItems.map(keyGetter).includes(keyGetter(acnt))"
                @click="() => updateCheckedItem(acnt, !checkedItems.map(keyGetter).includes(keyGetter(acnt)))"
              />
            </ul>
          </li>
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
import selectMixin from '@/components/Select/selectMixin';
import SelectCountOption from '@/components/Select/SelectCountOption';
import Select from '@/components/Select';
import { mapActions, mapState } from 'vuex';
import { i18n } from '../../../../public/locales/i18n';
export default {
  components: { Select, SelectCountOption },
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
    custCorpList: {
      type: Array,
      default: () => [],
    },
    filterCtrtId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      checkedItems: [],
      previousCheckedItems: [],
      previousCheckedItemsBeforeCheckAll: [],
      keyword: '',
      filteredChildList: [],
      allItem: {},
      previousSelectedCustCorpIds: [],
      selectedCustCorpIds: [],
      changePage: false,
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
      cnt = this.filteredData.reduce((accum, val) => {
        accum += val[this.childkey].length;
        return accum;
      }, 0);

      return cnt; //this.data.length;
    },
    noItemChecked() {
      return this.activeCount === 0;
    },
    allItemChecked() {
      const totalFilteredChildCount = this.filteredData.reduce((accum, val) => {
        accum += val[this.childkey].length;
        return accum;
      }, 0);

      return this.childActiveCount === totalFilteredChildCount;
    },
    filteredData() {
      if (this.selectedCustCorpIds.length === 0) return this.data;
      const selectedCorpRegNos = new Set(this.selectedCustCorpIds.map((item) => item.nm));
      // Filter data
      return this.data.filter((item) => selectedCorpRegNos.has(item.nm));
    },
    filteredCustCorpList() {
      return this.custCorpList.reduce((unique, item) => {
        if (!unique.some((obj) => obj.nm === item.nm)) {
          unique.push(item);
        }
        return unique;
      }, []);
    },
    filteredCtrtData() {
      return this.data.filter((item) => item.id === this.filterCtrtId)[0];
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
    custCorpList: {
      immediate: true,
      handler(newValue) {
        if (newValue.length > 0) {
          this.initializeFilteredData();
        }
      },
    },
    filteredCustCorpList: {
      immediate: true,
      handler(newValue) {
        if (newValue.length > 0) {
          // this.initializeFilteredData();
        }
      },
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
    initializeFilteredData() {
      // 1. checkedItems 초기화
      this.checkedItems = [];

      if (this.custCorpList.length > 0) {
        this.selectedCustCorpIds.push(this.custCorpList[0]);
      }
    },
    isChangePage(bool) {
      this.changePage = bool;
    },
    getTextWithStatus(item) {
      let text = this.textGetter(item);
      if (item.mappAcnt === '미매핑') {
        text += ' (미연결)';
      }
      return text;
    },
    updateCheckedItem(e, checked) {
      const updatedCheckedItems = [...this.checkedItems];

      if (checked) {
        if (!updatedCheckedItems.some((item) => this.keyGetter(item) === this.keyGetter(e))) {
          updatedCheckedItems.push(e);
        }
      } else {
        const index = updatedCheckedItems.findIndex((item) => this.keyGetter(item) === this.keyGetter(e));
        if (index !== -1) {
          updatedCheckedItems.splice(index, 1);
        }
      }

      const parentItem = this.data.find((data) => data.id === e.tagKey);
      const childChecked = updatedCheckedItems.filter((item) => item.tagKey === parentItem.id);

      if (parentItem[this.childkey].length === childChecked.length) {
        if (!updatedCheckedItems.some((item) => this.keyGetter(item) === this.keyGetter(parentItem))) {
          updatedCheckedItems.push(parentItem);
        }
      } else {
        const parentIndex = updatedCheckedItems.findIndex(
          (item) => this.keyGetter(item) === this.keyGetter(parentItem)
        );
        if (parentIndex !== -1) {
          updatedCheckedItems.splice(parentIndex, 1);
        }
      }

      this.checkedItems = updatedCheckedItems;
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
      this.previousSelectedCustCorpIds = [...this.selectedCustCorpIds];
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
      if (this.previousSelectedCustCorpIds && this.previousSelectedCustCorpIds.length > 0) {
        this.selectedCustCorpIds = [...this.previousSelectedCustCorpIds];
        this.$refs.custCorpSel.handleItemClick(this.previousSelectedCustCorpIds[0]);
      }
      this.checkedItems = [...this.previousCheckedItems];
      //this.previousSelectedCustCorpIds = [];
      this.previousCheckedItemsBeforeCheckAll = [];
      this.close();
    },
    reset() {
      this.checkedItems = [];
      this.previousCheckedItems = [];
      this.previousCheckedItemsBeforeCheckAll = [];
      this.previousSelectedCustCorpIds = [];
    },
    handleParentsClick(e, checked) {
      const updatedCheckedItems = [...this.checkedItems];
      if (checked) {
        if (!updatedCheckedItems.some((item) => this.keyGetter(item) === this.keyGetter(e))) {
          updatedCheckedItems.push(e);
        }
        e[this.childkey].forEach((child) => {
          if (!updatedCheckedItems.some((item) => this.keyGetter(item) === this.keyGetter(child))) {
            updatedCheckedItems.push(child);
          }
        });
      } else {
        const parentIndex = updatedCheckedItems.findIndex((item) => this.keyGetter(item) === this.keyGetter(e));
        if (parentIndex !== -1) {
          updatedCheckedItems.splice(parentIndex, 1);
        }
        e[this.childkey].forEach((child) => {
          const childIndex = updatedCheckedItems.findIndex((item) => this.keyGetter(item) === this.keyGetter(child));
          if (childIndex !== -1) {
            updatedCheckedItems.splice(childIndex, 1);
          }
        });
      }
      this.checkedItems = updatedCheckedItems;
    },
    handleParentsByAcntClick(e, checked) {
      const updatedCheckedItems = [...this.checkedItems];

      if (checked) {
        if (!updatedCheckedItems.some((item) => this.keyGetter(item) === this.keyGetter(e))) {
          updatedCheckedItems.push(e);
        }
        e[this.childkey].forEach((child) => {
          if (!updatedCheckedItems.some((item) => this.keyGetter(item) === this.keyGetter(child))) {
            if (this.filterAcntId) {
              if (this.filterAcntId === child.id) {
                updatedCheckedItems.push(child);
              }
            } else {
              updatedCheckedItems.push(child);
            }
          }
        });
      } else {
        const parentIndex = updatedCheckedItems.findIndex((item) => this.keyGetter(item) === this.keyGetter(e));
        if (parentIndex !== -1) {
          updatedCheckedItems.splice(parentIndex, 1);
        }
        e[this.childkey].forEach((child) => {
          const childIndex = updatedCheckedItems.findIndex((item) => this.keyGetter(item) === this.keyGetter(child));
          if (childIndex !== -1) {
            updatedCheckedItems.splice(childIndex, 1);
          }
        });
      }

      this.checkedItems = updatedCheckedItems;
    },

    handleCheckAllClick() {
      if (this.allItemChecked) {
        this.checkedItems = [];
      } else {
        // 전체 데이터 대신 filteredData 사용하여 체크
        this.checkedItems = [];
        this.filteredData.forEach((parent) => {
          this.checkedItems.push(parent);
          if (parent[this.childkey]) {
            this.checkedItems.push(...parent[this.childkey]);
          }
        });
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

    handleCustCorpChange(selectedItems) {
      this.previousSelectedCustCorpIds = [...this.selectedCustCorpIds];
      if (selectedItems) {
        this.selectedCustCorpIds = [];
        if (selectedItems.id === 'all') {
          this.selectedCustCorpIds = this.custCorpList.map((item) => item);
        } else {
          this.selectedCustCorpIds.push(selectedItems);
          this.checkedItems = [];
        }
        this.checkedItems = [];
      }
    },

    setCustCorpPrevPage(item) {
      this.selectedCustCorpIds = [];
      this.selectedCustCorpIds.push(item[0]);
      this.$refs.custCorpSel.handleItemClick(this.selectedCustCorpIds[0]);
    },
    handleCheckCtrtClick(contractId) {
      // id corpRegNo nm
      // this.handleParentsByAcntClick(this.filteredCtrtData, true);
      const matchingCustCorp = this.data.find((item) => item.id === contractId);
      const selectedCorpRegNo = matchingCustCorp.corpRegNo;
      const selectedCustCorp = this.custCorpList.find((item) => item.corpRegNo === selectedCorpRegNo);
      this.handleCustCorpChange(selectedCustCorp);
      this.handleParentsClick(matchingCustCorp, true);
    },
  },
};
</script>

<style scoped>
.is-w-100per {
  width: 100% !important;
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
