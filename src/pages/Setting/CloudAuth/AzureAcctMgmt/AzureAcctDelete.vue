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
        :title3="$t('menu.appDelete')"
      />
      <Section>
        <SectionMain>
          <AzureAcctDeleteInfo></AzureAcctDeleteInfo>
          <AzureAcctDeleteGuide></AzureAcctDeleteGuide>
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
              :class="[processing ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-400']"
              class="py-3.5 text-base font-bold border text-white rounded"
              @click="onDelete"
            >
              {{ processing ? 'Processing...' : $t('setting.appDelete') }}
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
  name: 'AzureAcctDelete',
  components: {
    Section: () => import('@/components/Section/Section'),
    SectionLnb: () => import('@/components/Section/SectionLnb'),
    SectionNewHeader: () => import('@/components/Section/SectionNewHeader'),
    SectionMain: () => import('@/components/Section/SectionMain'),
    AzureAcctDeleteGuide: () => import('./AzureAcctDeleteGuide'),
    AzureAcctDeleteInfo: () => import('./AzureAcctDeleteInfo'),
  },
  mixins: [PreventRefreshMixin],
  data() {
    return {
      params: {},
      processing: false,
    };
  },
  computed: {
    ...mapState('azureAcctMgmt', ['eventType', 'deleteInfo']),
  },
  created() {
    this.params = { ...this.deleteInfo };
  },
  mounted() {
    // 메뉴 선택
    const elems = document.getElementsByClassName('nosub');
    elems.forEach((elem) => {
      if (elem.getElementsByTagName('a')[0].href.includes('/setting/cloudAuthMgmt')) {
        elem.className += ' active';
      }
    });
  },
  methods: {
    ...mapActions('azureAcctMgmt', ['setCSP', 'deleteAzureApp']),
    goToList() {
      this.setCSP('AZURE');
      this.$router.push(`/setting/cloudAuthMgmt`);
    },
    onCancel() {
      this.goToList();
    },
    async onDelete() {
      this.processing = true;
      if (this.eventType === 3 && window.confirm(this.$t('deleteCurrentApp'))) {
        const result = await this.deleteAzureApp(this.params);
        if (result.error) {
          alert(result.error);
        } else {
          this.goToList();
        }
      }
      this.processing = false;
    },
  },
};
</script>
