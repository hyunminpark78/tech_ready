<template>
  <div v-click-outside="handleClickOutside">
    <button :class="selectClass" :disabled="pending || !hasData || filteredData.length === 0" @click="toggle">
      <template v-if="pending || filteredData.length === 0">
        <span class="text-primary-400">-</span>
      </template>
      <template v-else-if="allItemChecked || noItemChecked">
        <span class="text-primary-400">{{ $t('optimization.all') }}</span>
      </template>
      <template v-else-if="data === null || data.length === 0">
        <span class="text-primary-400">-</span>
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
        <!--        <div
          class="relative bg-white border rounded border-primary-400 dashboard-card select-two"
          style="width: 85%; margin: auto; margin-top: 12px !important"
        >
          <Select
            v-show="filteredCustCorpList.length > 1"
            ref="svcCustCorpSel"
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
            :default-selected="
              filteredCtrtData
                ? (c) => c.corpRegNo === filteredCtrtData.corpRegNo && c.nm === filteredCtrtData.custCorpNm
                : 0
            "
            @click="handleSvcGrpCustCorpChange"
          />
        </div>-->
        <!--        <form class="flex items-center py-4" @submit.prevent>
          <img src="@/assets/images/ico-search.svg" alt="search" style="margin: 0 0 0 22px" />
          <input
            type="search"
            class="px-1 py-1.5 text-sm text-gray-500 mx-2 w-full"
            placeholder="검색어를 입력하세요."
            :value="keyword"
            @input="changeKeyword"
          />
        </form>-->
        <hr />
        <ul :class="optionListClass" tabindex="0">
          <li v-for="item in filteredData" :key="item.id">
            <span class="flex items-start px-5 py-3 cursor-pointer hover:bg-primary-300">
              <span class="flex-1">{{ item.nm }}</span>
            </span>
            <ul style="margin: 0 0 0 31px">
              <li v-for="ctgry in item[childkey]" :key="ctgry.id">
                <span class="flex items-start px-5 py-3 cursor-pointer hover:bg-primary-300">
                  <span class="flex-1">{{ ctgry.nm }}</span>
                </span>
                <ul style="margin-left: 31px">
                  <RsrcAcntSelectCount
                    v-for="grp in ctgry[secondChildkey]"
                    :key="keyGetter(grp)"
                    type="check"
                    svc="svc"
                    :class="optionListItemClass"
                    :item="grp"
                    :text-getter="textGetter"
                    :checked="checkedItems.map(keyGetter).includes(keyGetter(grp))"
                    @click="() => updateCheckedItem(grp, !checkedItems.map(keyGetter).includes(keyGetter(grp)))"
                  />
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="flex fixedSearch">
        <button
          class="w-1/2 px-1 py-2.5 text-sm text-gray-600 bg-white border-t border-gray-300 rounded-bl"
          @click="cancelSvcGrpSelect"
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
import Select from '@/components/Select';
import { mapActions, mapState } from 'vuex';
import RsrcAcntSelectCount from '@/pages/Opti/ResourceOpti/RsrcAcntSelectCount.vue';
export default {
  components: { Select, RsrcAcntSelectCount },
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
      default: 'svcCtgryList',
    },
    secondChildkey: {
      type: String,
      default: 'svcGrpList',
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
      allItem: { id: 'checkAll', text: '전체' },
      previousSelectedCustCorpIds: [],
      svcGrpSelectedCustCorpIds: [],
      changePage: false,
    };
  },
  computed: {
    ...mapState('resourceOpti', {
      filter: 'filter',
      storeCategory: 'category',
      companyId: 'svcGrpSelectedCustCorpIds',
      selectedCustCorpIds: 'selectedCustCorpIds',
    }),
    isOpened() {
      return this.showOptions;
    },
    activeCount() {
      return this.checkedItems.length;
    },
    totalCount() {
      const cnt = this.filteredData.reduce((accum, val) => {
        // 첫 번째 reduce: svcCtgryList의 각 항목에 대해 반복
        return (
          accum +
          val[this.childkey].reduce((innerAccum, child) => {
            // 두 번째 reduce: svcGrpList의 길이를 합산
            return innerAccum + child[this.secondChildkey].length;
          }, 0)
        );
      }, 0);
      return cnt;
    },
    noItemChecked() {
      return this.activeCount === 0;
    },
    allItemChecked() {
      const totalFilteredChildCount = this.filteredData.reduce((accum, val) => {
        // 첫 번째 reduce: svcCtgryList의 각 항목에 대해 반복
        return (
          accum +
          val[this.childkey].reduce((innerAccum, child) => {
            // 두 번째 reduce: svcGrpList의 길이를 합산
            return innerAccum + child[this.secondChildkey].length;
          }, 0)
        );
      }, 0);

      return this.childActiveCount === totalFilteredChildCount;
    },
    filteredData() {
      if (this.svcGrpSelectedCustCorpIds.length === 0) return this.data;
      const selectedCorpRegNos = new Set(this.svcGrpSelectedCustCorpIds.map((item) => item.nm));
      // Filter data
      return this.data.filter((item) => selectedCorpRegNos.has(item.custCorpNm));
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
    data() {
      const flattenedData = this.data.flatMap((svcCtgry) =>
        svcCtgry.svcCtgryList.flatMap((svcGrp) => svcGrp.svcGrpList)
      );
      this.checkedItems = this.checkedItems.filter((checkedItem) =>
        flattenedData.some((dataItem) => dataItem.id === checkedItem.id)
      );
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
    selectedCustCorpIds: {
      handler(newValue, oldValue) {
        this.custCorpChanged(newValue[0]);
      },
    },
  },
  mounted() {},
  methods: {
    ...mapActions('resourceOpti', [
      'fetchFilter',
      'fetchSearch',
      'fetchParam',
      'setFilter',
      'fetchSvcGrpSelectedCorpCustIds',
    ]),
    initializeFilteredData() {
      this.checkedItems = [];

      if (this.changePage) {
        let selectedCtrt = this.filteredCtrtData;
        if (!this.companyId || this.companyId.length === 0) {
          if (selectedCtrt) {
            this.filteredCustCorpList.forEach((item) => {
              if (item.corpRegNo === selectedCtrt.corpRegNo && item.nm === selectedCtrt.custCorpNm) {
                this.svcGrpSelectedCustCorpIds.push(item);
              }
            });
          } else {
            this.svcGrpSelectedCustCorpIds.push(this.custCorpList[0]);
          }
        } else {
          this.svcGrpSelectedCustCorpIds = [...this.companyId];
          this.$nextTick(() => {
            /*this.$refs.svcCustCorpSel.handleItemClick(this.svcGrpSelectedCustCorpIds[0]);
            this.$refs.svcCustCorpSel.selectedItem = { ...this.svcGrpSelectedCustCorpIds[0] };*/
          });
        }
        this.fetchSvcGrpSelectedCorpCustIds({ state: this.svcGrpSelectedCustCorpIds });
        this.processFilteredData(this.filteredData, this.childkey, this.secondChildkey);
        this.fetchParam({ state: { svcGrpList: this.checkedItems } });
        return;
      }
      if (this.custCorpList.length > 0) {
        this.svcGrpSelectedCustCorpIds.push(this.custCorpList[0]);
        this.fetchSvcGrpSelectedCorpCustIds({ state: this.svcGrpSelectedCustCorpIds });
      }

      // Refactored part for processing filteredData
      this.processFilteredData(this.filteredData, this.childkey, this.secondChildkey);
      this.fetchParam({ state: { svcGrpList: this.checkedItems } });
      this.$emit('invokeOnSearch');
    },

    processFilteredData(filteredData, childKey, secondChildKey) {
      filteredData.forEach((parentItem) => {
        if (parentItem[childKey]) {
          parentItem[childKey].forEach((childItem) => {
            if (childItem[secondChildKey]) {
              this.checkedItems = [...new Set([...this.checkedItems, ...childItem[secondChildKey]])];
            }
          });
        }
      });

      // 0번째 서비스그룹과 같은 카테고리의 서비스그룹만 남도록
      if (this.checkedItems.length > 0 && this.checkedItems[0].ctgryId) {
        const firstSvcCtgryId = this.checkedItems[0].ctgryId;
        this.checkedItems = this.checkedItems.filter((item) => item.ctgryId === firstSvcCtgryId);
      }
    },
    isChangePage(bool) {
      this.changePage = bool;
    },
    updateCheckedItem(e, checked) {
      if (checked) {
        const hasDifferentCtgryId = this.checkedItems.some((item) => item.ctgryId !== e.ctgryId);

        if (hasDifferentCtgryId) {
          this.checkedItems = [e];
        } else {
          if (!this.checkedItems.includes(e)) {
            this.checkedItems = [...this.checkedItems, e];
          }
        }
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
      this.isOpened ? this.cancelSvcGrpSelect() : this.open();
    },
    handleSearchClick() {
      this.close();
      this.$emit('search');
    },
    apply() {
      this.previousSelectedCustCorpIds = [...this.svcGrpSelectedCustCorpIds];
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
    cancelSvcGrpSelect() {
      if (this.previousSelectedCustCorpIds && this.previousSelectedCustCorpIds.length > 0) {
        if (this.previousSelectedCustCorpIds[0].nm === this.svcGrpSelectedCustCorpIds[0].nm) {
          this.svcGrpSelectedCustCorpIds = [...this.previousSelectedCustCorpIds];
          this.checkedItems = [...this.previousCheckedItems];
        } else {
          this.checkedItems = [];
        }
      }
      // this.checkedItems = [...this.previousCheckedItems];
      this.previousSelectedCustCorpIds = [];
      this.previousCheckedItemsBeforeCheckAll = [];
      this.close();
    },
    reset() {
      this.checkedItems = [];
      this.previousCheckedItems = [];
      this.previousCheckedItemsBeforeCheckAll = [];
      this.previousSelectedCustCorpIds = [];
      this.fetchParam({ state: { svcGrpList: [] } });
    },
    handleParentsClick(e, checked) {
      const updatedCheckedItems = [...this.SecondDepthCheckedItems];

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

      this.SecondDepthCheckedItems = updatedCheckedItems;
    },
    handleCheckAllClick() {
      if (this.allItemChecked) {
        this.checkedItems = [];
      } else {
        // 전체 데이터 대신 filteredData 사용하여 체크
        this.checkedItems = this.filteredData.reduce((acc, item) => {
          // Add the main item
          // acc.push(item);

          // Add items from svcCtgryList
          item[this.childkey].forEach((ctgryItem) => {
            // acc.push(ctgryItem);

            // Add items from svcGrpList
            ctgryItem[this.secondChildkey].forEach((grpItem) => {
              acc.push(grpItem);
            });
          });

          return acc;
        }, []);
        // 0번째 서비스그룹과 같은 카테고리의 서비스그룹만 남도록
        if (this.checkedItems.length > 0 && this.checkedItems[0].ctgryId) {
          const firstSvcCtgryId = this.checkedItems[0].ctgryId;
          this.checkedItems = this.checkedItems.filter((item) => item.ctgryId === firstSvcCtgryId);
        }
      }
    },
    changeKeyword(e) {
      this.keyword = e.target.value;
    },

    handleSvcGrpCustCorpChange(selectedItems) {
      this.previousSelectedCustCorpIds = [...this.svcGrpSelectedCustCorpIds];
      if (selectedItems) {
        this.svcGrpSelectedCustCorpIds = [];
        if (selectedItems.id === 'all') {
          this.svcGrpSelectedCustCorpIds = this.custCorpList.map((item) => item);
        } else {
          // this.svcGrpSelectedCustCorpIds.push(selectedItems);
          this.svcGrpSelectedCustCorpIds = [...this.selectedCustCorpIds];
          this.checkedItems = [];
        }
        this.fetchSvcGrpSelectedCorpCustIds({ state: this.svcGrpSelectedCustCorpIds });

        // this.checkedItems = [];
      }
    },

    custCorpChanged(selectedItems) {
      if (selectedItems && selectedItems.nm != this.svcGrpSelectedCustCorpIds[0].nm) {
        this.handleSvcGrpCustCorpChange(selectedItems);
      }
      /*this.$refs.svcCustCorpSel.handleItemClick(this.svcGrpSelectedCustCorpIds[0]);
      this.$refs.svcCustCorpSel.selectedItem = { ...this.svcGrpSelectedCustCorpIds[0] };*/
    },

    setCustCorpPrevPage(item) {
      this.svcGrpSelectedCustCorpIds = [];
      this.svcGrpSelectedCustCorpIds.push(item[0]);
      this.fetchSvcGrpSelectedCorpCustIds({ state: this.svcGrpSelectedCustCorpIds });
      //this.$refs.svcCustCorpSel.handleItemClick(this.svcGrpSelectedCustCorpIds[0]);
    },
  },
};
</script>

<style scoped>
.is-w-100per {
  width: 100% !important;
}
</style>
