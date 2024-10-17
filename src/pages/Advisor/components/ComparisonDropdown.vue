<template>
  <div style="width: 100%">
    <div style="overflow-y: auto; width: 100%">
      <ul :class="[optionListClass]" :style="optionListStyle">
        <form class="flex items-center py-4" @submit.prevent>
          <img src="@/assets/images/ico-search.svg" alt="search" style="margin: 0 0 0 22px" />
          <input
            v-model="keyword"
            type="search"
            class="px-1 py-1.5 text-sm text-gray-500 mx-2 w-full"
            :placeholder="$t('common.placeholder.enterSearchTerm')"
          />
        </form>
        <hr />
        <div>
          <SelectOption
            v-for="(item, index) in data.filter((item) => item.text.toLowerCase().indexOf(keyword) > -1)"
            :key="index"
            :class="[optionListItemClass, !item.isActiveOptionValue && inActiveClass]"
            :item="item"
            :text-getter="textGetter"
            @click="() => handleItemClick(item)"
          />
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import selectMixin from '../../../components/Select/selectMixin';
import SelectOption from '../../../components/Select/SelectOption.vue';

export default {
  components: {
    SelectOption,
  },
  mixins: [selectMixin],
  props: {
    defaultSelected: {
      type: [Number, String, Function],
      default: 0,
      vaildator: (v) => (Number.isFinite(Number(v)) && Number(v) >= -1) || typeof v === 'function',
    },
    arrowSrc: {
      type: [String],
      default: () => require('@/assets/images/arrow-typ-03-up.svg'),
    },
    arrowClass: {
      type: [Object, Array, String],
      default: 'ml-4 -mr-2 arrow-class',
    },
    optionListItemClass: {
      type: [Object, Array, String],
      default: 'px-5 py-2 cursor-pointer hover:bg-primary-300',
    },
    optionListStyle: {
      type: [Object, Array, String],
      default: 'overflow-y: auto; background-color: #FFFFFF; max-height: 344px; top: 0',
    },
    optionListClass: {
      type: [Object, Array, String],
      default: 'absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200',
    },
  },
  data() {
    return {
      selectedItem: '',
      spanStyleData: 'text-align: center; font-size: 16px; color: #00A5ED',
      keyword: '',
      inActiveClass: 'inActiveOption',
    };
  },
  computed: {
    hasValue() {
      return !isEmpty(this.selectedItem);
    },
    text() {
      if (this.pending) {
        return '-';
      }
      return this.textGetter(this.selectedItem) || this.$t('common.select.select');
    },
  },
  watch: {
    selectedItem(curr, prev) {
      if (this.keyGetter(curr) !== this.keyGetter(prev)) {
        this.$emit('change', this.selectedItem);
      }
    },
  },
  methods: {
    handleItemClick(item) {
      if (item.isActiveOptionValue) {
        this.$emit('click', item);
        this.selectedItem = item;
      }
    },
  },
};
</script>

<style>
.optionListItemClass {
  color: #4a4a4a;
  font-size: 14px;
}
.inActiveOption {
  color: #b3b3b3;
  background-color: #f0f0f0;
}
</style>
