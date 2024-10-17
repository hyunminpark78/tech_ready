<template>
  <div v-click-outside="handleClickOutside" :class="divClass">
    <button type="button" :class="selectClass" :disabled="pending || !hasData" @click="showOptions = !showOptions">
      <span>{{ text }}</span>
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
import selectMixin from '@/components/Select/selectMixin';
import SelectOption from '@/components/Select//SelectOption';
import { mapState } from 'vuex';

const defaultSelectedItem = {};

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
    divClass: {
      type: [Object, Array, String],
      default: 'groupSel',
    },
    selectClass: {
      type: [Object, Array, String],
      default: 'flex items-center justify-between w-full py-5 text-xl text-left px-7 text-primary-400',
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
      default: '',
    },
  },
  data() {
    return {
      selectedItem: defaultSelectedItem,
    };
  },
  computed: {
    ...mapState('costEx', ['searchParam']),
    hasValue() {
      return !isEmpty(this.selectedItem);
    },
    text() {
      if (this.pending) {
        return '-';
      }

      return this.textGetter(this.selectedItem) || '선택';
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
      if (item.value === 'service_group_id' || item.value === 'tag_val') {
        const selectedContractIdArr = this.searchParam['contractId'];
        if (selectedContractIdArr.length === 1) {
          this.$emit('click', item);
          this.selectedItem = item;
          this.showOptions = false;
        } else {
          alert(this.$t('common.alert.selectContractForServiceGroup', { value: item.name }));
          return;
        }
      } else {
        this.$emit('click', item);
        this.selectedItem = item;
        this.showOptions = false;
      }
    },
  },
};
</script>
