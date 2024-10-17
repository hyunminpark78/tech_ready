<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :main-icon="{ src: require('@/assets/images/ico-setting-aws.svg') }"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.setting')"
        :title2="$t('menu.azureAccountRegistration')"
        :title3="$t('menu.appUpdate')"
      />
      <Section>
        <SectionMain>
          <AzureAcctUpdateInfo v-model="params" :valid-inputs="isNotEmpty"></AzureAcctUpdateInfo>
          <AzureAcctUpdateGuide v-if="invalidInfos"></AzureAcctUpdateGuide>
          <div class="button-wrap">
            <button
              :disabled="processing"
              :class="[
                processing ? 'text-gray-500 border-gray-500 cursor-not-allowed' : 'text-primary-400 border-primary-400',
              ]"
              class="py-3.5 text-base font-bold bg-white border rounded mr-3"
              @click.stop="onCancel"
            >
              {{ $t('common.button.cancel') }}
            </button>
            <button
              :disabled="invalidInfos || processing"
              :class="[invalidInfos || processing ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-400']"
              class="py-3.5 text-base font-bold border text-white rounded"
              @click="onUpdate"
            >
              {{ processing ? 'Processing...' : $t('menu.appUpdate') }}
            </button>
          </div>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { PreventRefreshMixin } from '@/pages/Mixin/PreventRefreshMixin';

export default {
  name: 'AzureAcctUpdate',
  components: {
    Section: () => import('@/components/Section/Section'),
    SectionLnb: () => import('@/components/Section/SectionLnb'),
    SectionNewHeader: () => import('@/components/Section/SectionNewHeader'),
    SectionMain: () => import('@/components/Section/SectionMain'),
    AzureAcctUpdateInfo: () => import('./AzureAcctUpdateInfo'),
    AzureAcctUpdateGuide: () => import('./AzureAcctUpdateGuide'),
  },
  mixins: [PreventRefreshMixin],
  data() {
    return {
      params: {},
      processing: false,
    };
  },
  computed: {
    ...mapState('azureAcctMgmt', ['eventType', 'updateInfo']),
    invalidInfos() {
      const invalid = !this.isNotEmpty(this.params, 'ctrtId', 'appId', 'tenantId', 'clientScrVal', 'subscriptions');
      return invalid;
    },
  },
  created() {
    this.params = { ...this.updateInfo, subscriptions: [] };
  },
  mounted() {
    // 메뉴 선택
    const elems = document.getElementsByClassName('nosub');
    elems.forEach((elem) => {
      if (elem.getElementsByTagName('a')[0].href.includes('/setting/azureAcctMgmt')) {
        elem.className += ' active';
      }
    });
  },
  methods: {
    ...mapActions('azureAcctMgmt', ['setCSP', 'updateAzureApp']),
    goToList() {
      this.setCSP('AZURE');
      this.$router.push(`/setting/cloudAuthMgmt`);
    },
    onCancel() {
      this.goToList();
    },
    async onUpdate() {
      this.processing = true;
      if (this.eventType === 2 && window.confirm(this.$t('setting.updateCurrentApp'))) {
        const result = await this.updateAzureApp(this.params);
        if (result.error) {
          alert(result.error);
        } else {
          this.goToList();
        }
      }
      this.processing = false;
    },
    isNotEmpty(obj, ...props) {
      for (let prop of props) {
        if (
          !obj.hasOwnProperty(prop) ||
          obj[prop] === null ||
          obj[prop] === undefined ||
          (typeof obj[prop] === 'string' && obj[prop].length === 0) ||
          (Array.isArray(obj[prop]) && obj[prop].length === 0)
        ) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>
