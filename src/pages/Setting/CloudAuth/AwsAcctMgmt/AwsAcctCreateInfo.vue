<template>
  <!-- module -->
  <div class="box-wrap">
    <div class="title bb1">
      <h4 class="tit-wrap">{{ $t('setting.basicInfo') }}</h4>
    </div>
    <div class="flex items-center px-8 py-2 border-b border-primary-200">
      <label class="text-sm text-primary-600 w-44">{{ $t('setting.accountName1') }}</label>
      <input
        type="text"
        v-model="detail.acntNm"
        class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
        disabled="disabled"
      />
    </div>
    <div class="flex items-center px-8 py-2">
      <label class="text-sm text-primary-600 w-44">{{ $t('setting.accountId') }}</label>
      <input
        type="text"
        v-model="detail.acntId"
        class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
        disabled="disabled"
      />
    </div>
  </div>
  <!-- //module -->
</template>

<script>
import { mapState } from 'vuex';

export default {
  components: {},
  data() {
    return {
      param: {},
    };
  },
  computed: {
    ...mapState('awsAcctMgmt', ['detail']),
  },
  watch: {
    detail: function (newVal, oldVal) {
      this.param = newVal;
    },
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
