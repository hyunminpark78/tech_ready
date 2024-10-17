<template>
  <div style="display: flex; height: 100%">
    <div class="" style="width: 100%; height: 100%">
      <SelectOne
        ref="instSel"
        select-type="noHeader"
        :field-title="$t('advisor.spotRateCheck.inquiryFilter.instanceType')"
        :required="true"
        :row-display="true"
        :data="dropDownData"
        :default-selected="6"
        :arrow-class="arrowClass"
        :key-getter="(item) => item.value"
        select-class="flex items-center justify-between w-full px-4 py-1.5 text-sm text-left bg-white border rounded border-primary-400 h-8"
        :arrow-src="require('@/assets/images/arrow-typ-03-up.svg')"
        option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
        option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
        select-one-style="width: 100%; height: 93%; paddingTop: 8px"
      />
    </div>
  </div>
</template>

<script>
import { SelectOne } from '../../../components';
import commonMixin from '@/pages/Mixin/commonMixin';
import demoData from '../../../../../../public/locales/comparison_demo.json';

export default {
  components: { SelectOne },
  mixins: [commonMixin],
  data() {
    return {
      dropDownData: [],
      arrowClass: 'ml-4 -mr-2 arrow-class',
    };
  },

  mounted() {
    this.setSelectTimeData();
  },

  methods: {
    setSelectTimeData() {
      this.dropDownData = demoData.InstanceTypes.map((item, index) => ({
        text: item,
        value: index,
      }));
    },
  },
};
</script>

<style>
.arrow-class {
  width: 20px;
  height: 20px;
}
</style>
