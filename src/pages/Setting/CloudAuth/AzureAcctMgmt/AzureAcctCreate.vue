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
        :title3="$t('menu.appRegistration')"
      />
      <Section>
        <SectionMain>
          <AzureAcctCreateGuide
            ref="guide"
            v-model="params"
            :status="status"
            :valid-inputs="isNotEmpty"
          ></AzureAcctCreateGuide>
          <div class="button-wrap">
            <button
              :disabled="processing"
              :class="[
                processing ? 'text-gray-500 border-gray-500 cursor-not-allowed' : 'text-primary-400 border-primary-400',
              ]"
              class="py-3.5 text-base font-bold bg-white border rounded mr-3"
              @click.stop="onCancel"
            >
              {{ $t('setting.cancel') }}
            </button>
            <button
              :disabled="invalidInfos || processing"
              :class="[invalidInfos || processing ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-400']"
              class="py-3.5 text-base font-bold border text-white rounded"
              @click="onSave"
            >
              {{ processing ? 'Processing...' : $t('setting.appRegistration') }}
            </button>
          </div>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AzureAcctMgmtCreate',
  components: {
    Section: () => import('@/components/Section/Section'),
    SectionLnb: () => import('@/components/Section/SectionLnb'),
    SectionNewHeader: () => import('@/components/Section/SectionNewHeader'),
    SectionMain: () => import('@/components/Section/SectionMain'),
    AzureAcctCreateGuide: () => import('./AzureAcctCreateGuide'),
  },
  data() {
    return {
      params: {
        ctrtId: '',
        appId: '',
        appDesc: '',
        tenantId: '',
        clientScrVal: '',
        subscriptions: [],
      },
      status: {
        ok: false,
      },
      processing: false,
    };
  },
  computed: {
    ...mapState('azureAcctMgmt', ['appId', 'eventType']),
    invalidInfos() {
      const invalid = !this.isNotEmpty(this.params, 'ctrtId', 'appId', 'tenantId', 'clientScrVal', 'subscriptions');
      return invalid;
    },
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
    ...mapActions('azureAcctMgmt', ['addAzureApp', 'setCSP']),
    initObj(obj) {
      // obj가 객체인지 확인
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 재귀적으로 객체의 모든 속성을 확인하고 null로 초기화
            obj[key] = initObj(obj[key]);
          }
        }
        return obj;
      } else {
        // 객체가 아니면 그대로 반환
        return obj;
      }
    },
    async onSave() {
      this.processing = true;
      if (window.confirm(this.$t('setting.registerNewApp'))) {
        const result = await this.addAzureApp(this.params);
        if (result.error) {
          this.status.ok = false;
          alert(result.error);
        } else {
          this.status.ok = true;
          this.goToList();
        }
      }
      this.processing = false;
    },
    goToList() {
      this.setCSP('AZURE');
      this.$router.push(`/setting/cloudAuthMgmt`);
    },
    onCancel() {
      this.goToList();
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
