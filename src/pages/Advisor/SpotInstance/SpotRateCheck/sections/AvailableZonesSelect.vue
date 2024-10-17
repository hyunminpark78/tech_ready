<template>
  <div
    class="availableZonesSelect relative flex flex-col"
    :style="{
      gap: '10px',
      flexDirection: rowDisplay ? 'row' : 'column',
      padding: rowDisplay ? '16px 28px' : 0,
      height: '100%',
      alignItems: 'center',
    }"
  >
    <div class="flex" :style="rowDisplay ? {} : { 'padding-top': '16px', 'padding-left': '28px' }">
      <div style="color: #ea1718">*</div>
      <p class="az-field-title" style="color: #5ba9ca; margin-left: 5px">
        {{ $t('advisor.spotRateCheck.inquiryFilter.availabilityZone') }}
      </p>
    </div>
    <div style="flex: 1">
      <SelectDisplayOption
        ref="prodSel"
        :data="avaZonesList"
        :text-getter="(item) => item.nm"
        :key-getter="(item) => item.cd"
        :select-class="selectClass"
        :arrow-class="arrowClass"
        option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button mh-385"
        :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
        :is-has-search="true"
        @change="handleServiceChange"
      />
    </div>
  </div>
</template>

<script>
import commonMixin from '@/pages/Mixin/commonMixin';
import SelectDisplayOption from '@/components/Select/SelectDisplayOption.vue';
import demoData from '../../../../../../public/locales/comparison_demo.json';

export default {
  components: { SelectDisplayOption },
  mixins: [commonMixin],
  props: {
    rowDisplay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      avaZonesList: [],
      selectClass: this.rowDisplay
        ? 'flex items-center justify-between w-full'
        : 'flex items-center justify-between w-full selectClass',
      arrowClass: 'ml-4 arrow-class',
    };
  },

  mounted() {
    this.setDataOptions();
  },

  methods: {
    filterOption() {
      this.avaZonesList = demoData.AvailabilityZone.map((item, index) => ({
        cd: item,
        nm: item,
      })).slice(9, 12);
    },
    remoteAllCheck() {
      this.$refs.prodSel.reset();
      this.$refs.prodSel.handleCheckAllClick();
      this.$refs.prodSel.applyNotChangeListner();
    },
    async setDataOptions() {
      await this.filterOption();
      this.$refs.prodSel.updateCheckedItem(this.avaZonesList[9], true);
    },
  },
};
</script>

<style lang="scss">
.availableZonesSelect {
  cursor: pointer;
  .mh-385 {
    max-height: 385px !important;
  }

  .selectClass {
    padding: 0px 28px 16px 28px;
  }

  .arrow-class {
    width: 24px;
    height: 24px;
  }
  .select-three .absolute {
    top: 100%;
  }
  .az-field-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
