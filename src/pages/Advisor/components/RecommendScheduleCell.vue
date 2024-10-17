<template>
  <div v-if="recmSchdDateNm && recmSchdTimeNm" class="flex justify-center">
    <div
      class="ml-1 mr-1 rounded-xlg border-2 border-gray-300 px-2.5 py-1 text-sm"
      :class="[styleMap[recmSchdDateNm].textColor]"
    >
      {{ $t(`advisor.schedulingRecommend.detailTable.${recmSchdDateNm}`) }}
    </div>
    <div
      class="ml-1 mr-1 py-1 text-sm text-gray-500"
      style="display: flex; justify-content: center; align-items: center"
    >
      <span class="mr-1 rounded-xlg px-0.5 py-0.5" :class="styleMap[recmSchdTimeNm].bgColor"></span>
      {{ $t(`advisor.schedulingRecommend.detailTable.${recmSchdTimeNm}`) }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    recmSchdDateNm() {
      return this.params.data.recmSchdDateNm;
    },
    recmSchdTimeNm() {
      return this.params.data.recmSchdTimeNm;
    },
    styleMap() {
      return this.params.styleMap;
    },
  },
};
</script>

<style></style>
