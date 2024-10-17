<template>
  <section v-if="visible" class="filter-setting-wrap">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <section class="flex flex-col justify-between h-96 z-30 p-8 rounded policy-content w-600" style="min-height: 300px">
      <header class="text-center">
        <img class="inline" :src="require('@/assets/images/top-logo.svg')" alt="logo" />
      </header>
      <div>
        <div class="flex items-center justify-center">
          <p class="text-center text-s text-gray-700 font-bold font-medium">
            <pre style="font-family: unset;">{{popupContent}}</pre>
          </p>
        </div>
      </div>
      <div class="text-center">
        <button
          class="
            inline-block
            px-6
            h-32
            text-sm text-white
            border
            rounded-sm
            bg-primary-400
            border-primary-400
            font-bold
            ml-1.5
            w-1/3
          "
          type="button"
          @click="close()"
        >
          닫기
        </button>
      </div>
    </section>
    <!-- 알림 -->
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Popup',
  props: {
    visible: {
      type: Boolean,
    },
    content: {
      type: String,
    },
  },
  computed: {
    popupContent() {
      return this.content.replaceAll('\n/g', '<br/>');
    },
  },
  watch: {
  },
  data() {
    return {
    };
  },
  methods: {
    close() {
      this.$emit('closePopup');
    },
  },
};
</script>
