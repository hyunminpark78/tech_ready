<template>
  <div
    class="
      p-8
      bg-white
      border-2
      rounded-lg
      border-primary-200
      dashboard-card
      flip
    "
  >
    <div class="flex items-center">
      <h3 class="mr-3 font-bold">민감도 설정</h3>
      <button>
        <img src="/pages/images/ico-info.svg" alt="." />
      </button>
    </div>

    <div class="flex">
      <div class="flex-auto w-64 mr-12">
        <img src="/pages/images/img-sensitivity-typ-02.svg" alt="." />
      </div>

      <div class="flex-auto flip-tabs">
        <div>
          <button class="mb-3 flip-tab" @click="chagneSens('L')">
            <img src="/pages/images/img-selectblock-off.svg" alt="." />
            <span>낮은 민감도</span>
          </button>
          <button class="mb-3 flip-tab" @click="chagneSens('M')">
            <img src="/pages/images/img-selectblock-on.svg" alt="." />
            <span>중간 민감도</span>
          </button>
          <button class="mb-3 flip-tab" @click="chagneSens('H')">
            <img src="/pages/images/img-selectblock-off.svg" alt="." />
            <span>높은 민감도</span>
          </button>
        </div>

        <div class="flex pl-2 mt-4">
          <button
            class="
              flex-1
              px-3
              py-1.5
              text-sm
              font-bold
              text-white
              border
              rounded-sm
              bg-primary-400
              border-primary-400
            "
          >
            저장
          </button>
          <button
            class="
              flex-1
              px-3
              py-1.5
              text-sm
              font-bold
              bg-white
              border
              rounded-sm
              text-primary-400
              border-primary-400
            "
          >
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("dashboard", ["ruleViolate"]),
  },
  data() {
    return {
      propsInfo: {
        keyProp: "rsrcNm",
        valueProp: "viltCnt",
      },
    };
  },
  methods: {},
};
</script>
