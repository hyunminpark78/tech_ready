<template>
  <div style="display: flex">
    <SelectCount
      ref="prodSel"
      :data="prodList"
      :text-getter="(item) => item.nm"
      :key-getter="(item) => item.cd"
      select-class="flex items-center justify-between w-full"
      option-list-wrapper-class="absolute z-20 bg-white border rounded border-primary-200 with-button mh-385"
      :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
      arrow-class="ml-4"
      :is-has-search="true"
      @change="handleServiceChange"
    />
  </div>
</template>

<script>
import { SelectCount } from '@/components/Select';
import commonMixin from '@/pages/Mixin/commonMixin';

export default {
  components: { SelectCount },
  mixins: [commonMixin],
  data() {
    return {
      prodList: [],
    };
  },

  mounted() {
    this.setDataOptions();
  },

  methods: {
    filterOption() {
      this.prodList = [
        {
          cd: 'EC2',
          nm: 'EC2',
        },
        {
          cd: 'EKS',
          nm: 'EKS',
        },
        {
          cd: 'ECS',
          nm: 'ECS',
        },
        {
          cd: 'EMR',
          nm: 'EMR',
        },
        {
          cd: 'AutoScailing',
          nm: 'Auto Scailing',
        },
        {
          cd: 'Batch',
          nm: 'Batch',
        },
      ];
    },
    remoteAllCheck() {
      this.$refs.prodSel.reset();
      this.$refs.prodSel.handleCheckAllClick();
      this.$refs.prodSel.applyNotChangeListner();
    },
    async setDataOptions() {
      await this.filterOption();
      await this.remoteAllCheck();
    },
    handleServiceChange(checkedItems) {
      this.$emit('change', checkedItems);
    },
  },
};
</script>

<style>
.mh-385 {
  max-height: 385px !important;
}
.flex-grow-1 {
  flex-grow: 1;
}
.white-nowrap {
  white-space: nowrap;
}
</style>
