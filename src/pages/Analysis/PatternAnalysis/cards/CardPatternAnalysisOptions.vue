<template>
  <div class="relative mb-6 bg-white border rounded-lg border-primary-200 dashboard-card select-one">
    <Select
      :data="selectAiContractOptions"
      :key-getter="(item) => item.ctrtId"
      :text-getter="(item) => item.ctrtNm"
      select-class="flex items-center justify-between w-full py-5 text-xl text-left px-7 text-primary-400"
      :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
      arrow-class="-mr-2"
      option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
      option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
      :default-selected="contractId ? (c) => c.ctrtId === contractId : null"
      @change="(contract) => $emit('change', contract)"
    />
  </div>
</template>

<script>
import Select from '@/components/Select';
import { mapGetters, mapActions } from 'vuex';
export default {
  components: { Select },
  props: {
    contractId: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapGetters('analysis', ['selectAiContractOptions']),
  },
  watch: {
    contractId() {
      this.setAiFilter({ ctrtId: this.contractId });
      this.fetchAiPatternAnalysis({ ctrtId: this.contractId });
    },
  },
  created() {
    this.fetchAiCtrt();
    if (!this.contractId) {
      return;
    }
    this.setAiFilter({ ctrtId: this.contractId });
  },
  methods: {
    ...mapActions('analysis', ['fetchAiCtrt', 'setAiFilter']),
    ...mapActions('dashboard', ['fetchAiPatternAnalysis']),
  },
};
</script>

<style></style>
