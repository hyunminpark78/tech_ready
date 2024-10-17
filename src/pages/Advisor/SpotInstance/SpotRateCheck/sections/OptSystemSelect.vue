<template>
  <div style="display: flex; height: 100%">
    <div class="relative select-three" style="width: 100%; height: 100%">
      <SelectOne
        :row-display="true"
        select-type="noHeader"
        :field-title="$t('advisor.spotRateCheck.inquiryFilter.operateSys')"
        :required="true"
        :data="dropDownData"
        :key-getter="(item) => item.value"
        select-class="flex items-center justify-between w-full px-4 py-1.5 text-sm text-left bg-white border rounded border-primary-400 h-8"
        :arrow-src="require('@/assets/images/arrow-typ-03-up.svg')"
        arrow-class="ml-4 -mr-2"
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

export default {
  components: { SelectOne },
  mixins: [commonMixin],
  data() {
    return {
      dropDownData: [],
    };
  },

  mounted() {
    this.setSelectTimeData();
  },

  methods: {
    setSelectTimeData() {
      this.dropDownData = [
        {
          text: 'Linux/UNIX',
          value: '1',
        },
        {
          text: 'SUSE Linux',
          value: '2',
        },
        {
          text: 'Rat Hat Enterprise Linux',
          value: '3',
        },
        {
          text: 'Windows',
          value: '4',
        },
      ];
    },
  },
};
</script>

<style></style>
