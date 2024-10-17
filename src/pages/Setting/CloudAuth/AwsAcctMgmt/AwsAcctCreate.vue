<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :main-icon="{ src: require('@/assets/images/ico-setting-aws.svg') }"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.setting')"
        :title2="$t('menu.awsAccountRegistration')"
        :title3="$t('menu.newAccountRegistration')"
      />
      <Section>
        <SectionMain>
          <AwsAcctCreateInfo ref="info"></AwsAcctCreateInfo>
          <AwsAcctCreateGuide ref="guide"></AwsAcctCreateGuide>
          <div class="button-wrap">
            <button
              class="py-3.5 text-base font-bold bg-white border rounded text-primary-400 border-primary-400 mr-3"
              @click.stop="onCancle"
            >
              {{ $t('common.button.cancel') }}
            </button>
            <button class="py-3.5 text-base font-bold border text-white rounded bg-primary-400" @click="onSave">
              {{ $t('setting.accountRegister') }}
            </button>
          </div>
        </SectionMain>
      </Section>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import AwsAcctCreateInfo from './AwsAcctCreateInfo';
import AwsAcctCreateGuide from './AwsAcctCreateGuide';
import awsAcctMgmtService from '@/services/awsAcctMgmtService';

export default {
  name: 'AwsAcctMgmtCreate',
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    AwsAcctCreateInfo,
    AwsAcctCreateGuide,
  },
  data() {
    return {
      param: {
        acntNm: '',
        acntId: '',
        extId: '',
        roleArn: '',
        custCorpId: '',
        corpRegNo: '',
      },
    };
  },
  computed: {
    ...mapState('awsAcctMgmt', ['detail']),
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
  created() {},
  methods: {
    onCancle() {
      this.$router.back();
    },
    async onSave() {
      if (window.confirm(this.$t('setting.registAccount'))) {
        if (!this.detail.extId) {
          alert(this.$t('setting.externalIdRequired'));
          return;
        }
        if (!this.$refs.guide.roleArn) {
          alert(this.$t('setting.enterRoleArn'));
          return;
        }
        this.param.acntNm = this.detail.acntNm;
        this.param.acntId = this.detail.acntId;
        this.param.extId = this.detail.extId;
        this.param.roleArn = this.$refs.guide.roleArn;
        this.param.custCorpId = this.detail.custCorpId;
        this.param.corpRegNo = this.detail.corpRegNo;

        await awsAcctMgmtService
          .addAwsAcct(this.param)
          .then((result) => {
            const data = result.data;
            if (data.code === 'SUCCESS') {
              alert(data.message);
              this.$router.push('/setting/cloudAuthMgmt');
            } else {
              alert(this.$t('setting.registFailed'));
              this.$router.push('/setting/cloudAuthMgmt');
            }
          })
          .catch((error) => {
            alert(this.$t('setting.registFailed'));
            this.$router.push('/setting/cloudAuthMgmt');
          });
      }
    },
  },
};
</script>
