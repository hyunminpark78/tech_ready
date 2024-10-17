<template>
  <div style="display: flex; height: 100%">
    <div class="relative select-three" style="width: 100%; height: 100%">
      <SelectOne
        select-type="noHeader"
        :row-display="true"
        :field-title="$t('advisor.spotRateCheck.inquiryFilter.region')"
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
import { mapActions, mapState } from 'vuex';
import demoData from '../../../../../../public/locales/comparison_demo.json';

export default {
  components: { SelectOne },
  mixins: [commonMixin],
  data() {
    return {
      dropDownData: [],
    };
  },
  computed: {
    ...mapState('spotAdvisor', {
      filter: 'filter',
    }),
  },
  mounted() {
    this.setSelectTimeData();
  },

  methods: {
    ...mapActions('spotAdvisor', ['fetchFilter']),
    async setSelectTimeData() {
      await this.fetchFilter({ cspTypCd: 'AWS' });
      [this.filter.regionList[0], this.filter.regionList[3]] = [this.filter.regionList[3], this.filter.regionList[0]];
      this.dropDownData = this.filter.regionList.map((item) => ({
        text: item.name,
        value: item.id,
      }));
    },
  },
};
</script>

<style></style>
