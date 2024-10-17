<template>
  <div v-click-outside="handleClickOutside" :style="selectOneStyle">
    <button
      type="button"
      :style="{
        display: 'flex',
        'flex-direction': rowDisplay ? 'row' : 'column',
        gap: '20px',
        padding: isContractPadding ? '13px 28px 13px 28px' : '16px 28px 16px 28px',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        'background-color': '#ffffff',
      }"
      :disabled="pending || !hasData"
    >
      <div :id="fieldTitle" class="flex" :style="titleStyle">
        <div v-if="required" style="color: #ea1718; margin-right: 5px">*</div>
        <p class="field-title" style="color: #5ba9ca">{{ fieldTitle }}</p>
      </div>
      <div style="position: relative; flex: 1">
        <div
          style="display: flex; justify-content: space-between; align-items: center"
          @click="showOptions = !showOptions"
        >
          <span :style="spanStyleData">{{ text }}</span>
          <img :src="arrowSrc" alt="." :class="[arrowClass, arrowRotationClass]" />
        </div>
        <div style="overflow-y: auto; max-height: 344px; width: 100%">
          <ul :class="[optionListClass, { hidden: !showOptions }]" :style="optionListStyle">
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
            <div v-if="selectType === 'noHeader'">
              <SelectOption
                v-for="(item, index) in data.filter((item) => item.text.toLowerCase().indexOf(keyword) > -1)"
                :key="index"
                :class="[optionListItemClass]"
                :item="item"
                :text-getter="textGetter"
                style="color: #4a4a4a; font-size: 14px; text-align: left"
                @click="() => handleItemClick(item)"
              />
            </div>
            <div v-else>
              <div v-for="(item, index) in data" :key="index">
                <p style="color: #5ba9ca; font-weight: 700; padding: 12px 20px; text-align: left">{{ item.text }}</p>
                <SelectOption
                  v-for="(child, idx) in item.children.filter((item) => item.text.toLowerCase().indexOf(keyword) > -1)"
                  :key="idx"
                  :class="[optionListItemClass]"
                  :item="child"
                  :text-getter="textGetter"
                  style="color: #4a4a4a; font-size: 14px; margin-left: 10px; text-align: left"
                  @click="() => handleItemClick(child)"
                />
              </div>
            </div>
          </ul>
        </div>
      </div>
    </button>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import selectMixin from '../../../components/Select/selectMixin';
import SelectOption from '../../../components/Select/SelectOption.vue';

const defaultSelectedItem = {};

export default {
  components: {
    SelectOption,
  },
  mixins: [selectMixin],
  props: {
    selectType: {
      type: String,
      default: '',
    },
    fieldTitle: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    defaultSelected: {
      type: [Number, String, Function],
      default: 0,
      vaildator: (v) => (Number.isFinite(Number(v)) && Number(v) >= -1) || typeof v === 'function',
    },
    arrowSrc: {
      type: [String],
      default: () => require('@/assets/images/arrow-typ-02.svg'),
    },
    arrowClass: {
      type: [Object, Array, String],
      default: '-mr-2',
    },
    optionListItemClass: {
      type: [Object, Array, String],
      default: 'px-5 py-3 cursor-pointer hover:bg-primary-300 border',
    },
    optionListStyle: {
      type: [Object, Array, String],
      default: 'overflow-y: auto; background-color: #FFFFFF; max-height: 344px; top: 180%',
    },
    optionListClass: {
      type: [Object, Array, String],
      default: 'absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200',
    },
    hasDefaultValue: {
      type: Boolean,
      default: true,
    },
    rowDisplay: {
      type: Boolean,
      default: false,
    },
    isContractPadding: {
      type: Boolean,
      default: false,
    },
    titleStyle: {
      type: String,
      default: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
    },
    selectOneStyle: {
      type: String,
      default: 'width: 100%; height: 93%',
    },
  },
  data() {
    return {
      selectedItem: defaultSelectedItem,
      spanStyleData:
        'text-align: center; font-size: 16px; color: #00A5ED; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
      keyword: '',
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
    data() {
      this.selectDefaultOption();
    },
    selectedItem(curr, prev) {
      if (this.keyGetter(curr) !== this.keyGetter(prev)) {
        this.$emit('change', this.selectedItem);
      }
    },
  },
  created() {
    this.selectDefaultOption();
  },
  methods: {
    selectDefaultOption() {
      if (this.data.length <= 0) {
        this.selectedItem = {};
        return false;
      }

      const index =
        typeof this.defaultSelected === 'function'
          ? this.data.findIndex(this.defaultSelected)
          : Number(this.defaultSelected);
      if (index === -1) {
        this.selectedItem = defaultSelectedItem;
        return true;
      }

      if (index < this.data.length) {
        this.selectedItem = this.hasDefaultValue ? this.data[index] : {};
        return true;
      }

      return false;
    },
    handleItemClick(item) {
      this.$emit('click', item);
      this.selectedItem = item;
      this.showOptions = false;
    },
  },
};
</script>
<style>
.field-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
