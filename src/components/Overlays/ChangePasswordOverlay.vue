<template>
  <div>
    <DimOverlay />
    <section class="z-30 change-pw login-content">
      <h1 class="mt-2 mb-4">비밀번호 변경</h1>

      <button type="button" class="absolute top-0 right-0 close-login-modal mt-7 mr-7">
        <img src="@/assets/images/ico-btn-search-close.svg" alt="close" @click="$emit('close')" />
      </button>

      <form>
        <label for="" class="block mb-2 text-sm text-primary-600">현재 비밀번호</label>
        <input
          placeholder="현재 비밀번호 입력"
          type="password"
          name=""
          id=""
          class="w-full px-5 py-4 mb-6 border rounded border-primary-200 focus:border-primary-400"
        />
        <label for="" class="block mb-2 text-sm text-primary-600">새 비밀번호</label>
        <input
          placeholder="새 비밀번호 입력"
          type="password"
          name=""
          id=""
          class="w-full px-5 py-4 mb-6 border rounded border-primary-200 focus:border-primary-400"
        />
        <label for="" class="block mb-2 text-sm text-primary-600">새 비밀번호 확인</label>
        <input
          placeholder="새 비밀번호 입력"
          type="password"
          name=""
          id=""
          class="w-full px-5 py-4 border rounded border-primary-200 focus:border-primary-400"
        />

        <!-- invisible -->
        <p class="mt-2 mb-5 text-sm text-secondary">비밀번호가 서로 일치 하지 않습니다.</p>

        <div class="flex">
          <button
            type="button"
            class="
              w-1/2
              py-5
              text-2xl
              font-bold
              bg-white
              border
              rounded-tl rounded-bl
              text-primary-400
              border-primary-400
            "
            @click="$emit('cancel')"
          >
            취소
          </button>
          <button
            class="w-1/2 py-5 text-2xl font-bold text-white rounded-tr rounded-br bg-primary-400"
            @click="$emit('confirm')"
          >
            저장
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import DimOverlay from './DimOverlay.vue';

export default {
  components: { DimOverlay },
};
</script>
