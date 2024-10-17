<template>
  <div v-click-outside="handleClickOutside" :class="divClass" :style="divStyleData">
    <button
      type="button"
      :class="selectClass"
      :style="selectStyle"
      :disabled="pending || !hasData"
      @click="showOptions = !showOptions"
    >
      <span :style="spanStyleData">{{ text }}</span>
      <img :src="arrowSrc" alt="." :class="[arrowClass, arrowRotationClass]" />
    </button>
    <ul :class="[optionListClass, { hidden: !showOptions }]" :style="optionListStyle">
      <SelectOption
        v-for="item in data"
        :key="keyGetter(item)"
        :class="[optionListItemClass, { clicked: keyGetter(selectedItem) === keyGetter(item) }]"
        :item="item"
        :text-getter="textGetter"
        @click="() => handleItemClick(item)"
      />
    </ul>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import selectMixin from './selectMixin';
import SelectOption from './SelectOption.vue';

const defaultSelectedItem = {};

export default {
  components: {
    SelectOption,
  },
  mixins: [selectMixin],
  props: {
    ctrtCreate: {
      type: Boolean,
      default: false,
    },
    quickCreate: {
      type: Boolean,
      default: false,
    },
    defaultSelected: {
      type: [Number, String, Function],
      default: 0,
      vaildator: (v) => (Number.isFinite(Number(v)) && Number(v) >= -1) || typeof v === 'function',
    },
    divClass: {
      type: [Object, Array, String],
      default: '',
    },
    divStyle: {
      type: [Object, Array, String],
      default: '',
    },
    selectClass: {
      type: [Object, Array, String],
      default: 'flex items-center justify-between w-full py-5 text-xl text-left px-7 text-primary-400',
    },
    selectStyle: {
      type: [Object, Array, String],
      default: () => {
        return '';
      },
    },
    arrowSrc: {
      type: [String],
      default: () => require('@/assets/images/arrow-typ-02.svg'),
    },
    arrowClass: {
      type: [Object, Array, String],
      default: '-mr-2',
    },
    optionListClass: {
      type: [Object, Array, String],
      default: 'absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200',
    },
    optionListItemClass: {
      type: [Object, Array, String],
      default: 'px-5 py-3 cursor-pointer hover:bg-primary-300',
    },
    optionListStyle: {
      type: [Object, Array, String],
      default: 'overflow-y: auto; width:auto;',
    },
  },
  data() {
    return {
      selectedItem: defaultSelectedItem,
      spanStyleData: '',
      divStyleData: '',
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
      if (this.ctrtCreate) {
        this.setSpanStyle();
        this.setDivStyle();
      }
      if (this.quickCreate) {
        this.setSpanStyle();
        this.setDivClass();
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
    setDivStyle() {
      if (this.ctrtCreate) {
        this.divStyleData = 'width: 100%';
      }
    },
    setDivClass() {
      if (this.quickCreate) {
        // eslint-disable-next-line vue/no-mutating-props
        this.divClass = '';
        this.divStyleData = 'width:100%; height: 42px';
      }
    },
    setSpanStyle() {
      this.spanStyleData =
        'text-align: center; padding-left: 10px; padding-right: 10px; font-size: 14px; color: #00A5ED';
    },
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
        this.selectedItem = this.data[index];
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
