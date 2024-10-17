<template>
  <div style="display: flex; height: 100%">
    <div class="relative select-three border" style="width: 100%; padding: 5px; border-radius: 8px">
      <SelectOne
        :row-display="true"
        :field-title="$t('advisor.spotRateCheck.inquiryFilter.contractsAccounts')"
        :required="false"
        :is-contract-padding="isContractPadding"
        :data="dropDownData"
        :key-getter="(item) => item.value"
        :has-default-value="false"
        select-class="flex items-center justify-between w-full px-4 py-1.5 text-sm text-left bg-white border rounded border-primary-400 h-8"
        :arrow-src="require('@/assets/images/arrow-typ-03-up.svg')"
        arrow-class="ml-4 -mr-2"
        option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
        option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
        select-one-style="paddingTop: 8px; height: 100%"
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
  props: {
    isContractPadding: {
      type: Boolean,
      default: false,
    },
  },
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
          text: '테크레디 계약1',
          children: [
            {
              text: 'TR-develop-alice(27272727271)',
              value: '',
            },
            {
              text: 'TR-develop-alice(27272727271)',
              value: '',
            },
            {
              text: 'TR-operation-amanda(27390027271)',
              value: '',
            },
            {
              text: 'TR-operation-ellen(27084159271)',
              value: '',
            },
          ],
        },
        {
          text: '테크레디 계약2',
          children: [
            {
              text: 'TR-operation-lewis(271605948371)',
              value: '',
            },
            {
              text: 'TR-operation-lewis(271605948371)',
              value: '',
            },
            {
              text: 'TR-operation-lewis(271605948371)',
              value: '',
            },
            {
              text: 'TR-operation-lewis(271605948371)',
              value: '',
            },
            {
              text: 'TR-operation-lewis(271605948371)',
              value: '',
            },
          ],
        },
      ];
    },
  },
};
</script>

<style></style>
