<template>
  <div class="box-wrap">
    <div class="title bb1">
      <h4 class="tit-wrap">{{ $t('setting.appInfo') }}</h4>
    </div>
    <div class="flex items-center px-8 py-2 border-b border-primary-200">
      <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.appId') }}</label>
      <input
        type="text"
        class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
        :value="deleteInfo.appId"
        disabled="disabled"
      />
    </div>
    <div class="flex items-center px-8 py-2 border-b border-primary-200">
      <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.tenantId') }}</label>
      <input
        type="text"
        class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
        :value="deleteInfo.tenantId"
        disabled="disabled"
      />
    </div>
    <div class="flex items-center px-8 py-2">
      <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.remarks') }}</label>
      <input
        type="text"
        class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
        :value="deleteInfo.appDesc"
        disabled="disabled"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AzureAcctDeleteInfo',
  components: {},
  computed: {
    ...mapState('azureAcctMgmt', ['deleteInfo']),
  },
};
</script>
