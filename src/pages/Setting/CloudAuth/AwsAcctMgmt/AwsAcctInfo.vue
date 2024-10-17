<template>
  <!-- module -->
  <div class="box-wrap">
    <div class="title bb1">
      <h4 class="tit-wrap">{{ $t('setting.accountInformation') }}</h4>
    </div>
    <div class="flex items-center px-8 py-2 border-b border-primary-200">
      <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.templateUrl') }}</label>
      <input
        type="text"
        class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
        :placeholder="$t('setting.enterTemplateUrl')"
        :value="templateUrl"
        disabled="disabled"
      />
      <button class="ico-copy ml-2" @click="copyClipboard(templateUrl)">{{ $t('setting.copy') }}</button>
    </div>
    <div class="flex items-center px-8 py-2 border-b border-primary-200">
      <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.externalId') }}</label>
      <input
        type="text"
        class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
        :placeholder="$t('setting.enterExternalId')"
        :value="detail.extId"
        disabled="disabled"
      />
      <button class="ico-copy ml-2" @click="copyClipboard(detail.extId)">{{ $t('setting.copy') }}</button>
    </div>
    <div class="flex items-center px-8 py-2">
      <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.roleArn') }}</label>
      <input
        type="text"
        class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
        :placeholder="$t('setting.enterRoleArn')"
        :value="detail.roleArn"
        disabled="disabled"
      />
      <button class="ico-copy ml-2" @click="copyClipboard(detail.roleArn)">{{ $t('setting.copy') }}</button>
    </div>
  </div>
  <!-- //module -->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import { getBuildEnv } from '@/library/Common';
export default {
  components: {},
  data() {
    return {
      acntNm: '',
      acntId: '',
      templateUrl: '',
    };
  },
  computed: {
    ...mapState('awsAcctMgmt', ['detail']),
  },
  beforeMount() {
    let server = getBuildEnv();
    if (server === 'prd') {
      this.templateUrl = `https://skt-cloudformation-prd.s3.ap-northeast-2.amazonaws.com/skt-cloudformation-template-prd-v1.0.yaml`;
    } else if (server === 'dev') {
      this.templateUrl = `https://skt-cloudformation-dev.s3.ap-northeast-2.amazonaws.com/skt-cloudformation-template-dev-v1.0.yaml`;
    } else if (server === 'stg') {
      this.templateUrl = `https://skt-cloudformation-stg.s3.ap-northeast-2.amazonaws.com/skt-cloudformation-template-stg-v1.0.yaml`;
    } else {
      this.templateUrl = `https://skt-cloudformation-dev.s3.ap-northeast-2.amazonaws.com/skt-cloudformation-template-dev-v1.0.yaml`;
    }
  },
  created() {},
  mounted() {},
  methods: {
    copyClipboard(text) {
      this.$copyText(text);
    },
  },
};
</script>
