<template>
  <div v-if="curSchdDateNm && curSchdTimeNm" class="flex justify-center">
    <!--    <div-->
    <!--      class="ml-1 mr-1 rounded-xlg border-2 border-gray-300 px-2.5 py-1 text-sm"-->
    <!--      :class="[styleMap[curSchdDateNm].textColor]"-->
    <!--    >-->
    <!--      {{ $t(`advisor.schedulingRecommend.detailTable.${curSchdDateNm}`) }}-->
    <!--    </div>-->
    <div class="ml-1 mr-1" style="display: flex; justify-content: center; align-items: center">
      {{ curSchdTimeNm }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    curSchdDateNm() {
      return this.params.data.curSchdDateNm;
    },
    curSchdTimeNm() {
      return this.params.data.curSchdTimeNm;
    },
    styleMap() {
      return this.params.styleMap;
    },
  },
};
</script>

<style></style>
