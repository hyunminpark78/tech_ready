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
        :title3="$t('menu.delete')"
      />
      <Section>
        <SectionMain>
          <AwsAcctCreateInfo ref="info"></AwsAcctCreateInfo>
          <AwsAcctInfo ref="acctInfo"></AwsAcctInfo>
          <AwsAcctDeleteGuide></AwsAcctDeleteGuide>
          <div class="button-wrap">
            <button
              class="py-3.5 text-base font-bold bg-white border rounded text-primary-400 border-primary-400 mr-3"
              @click.stop="onCancle"
            >
              {{ $t('setting.cancel') }}
            </button>
            <button class="py-3.5 text-base font-bold border text-white rounded bg-primary-400" @click="onSave">
              {{ $t('setting.accountDelete') }}
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
import AwsAcctDeleteGuide from './AwsAcctDeleteGuide';
import AwsAcctInfo from './AwsAcctInfo';
import awsAcctMgmtService from '@/services/awsAcctMgmtService';

export default {
  name: 'AwsAcctDelete',
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    AwsAcctCreateInfo,
    AwsAcctDeleteGuide,
    AwsAcctInfo,
  },
  data() {
    return {
      param: {
        acntNm: '',
        acntId: '',
        extId: '',
        roleArn: '',
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
      this.param.acntId = this.detail.acntId;
      if (
        window.confirm(
          `${this.$t('setting.youDeleteStack')}
          ${this.$t('setting.clickOkAccountRemoved')}`
        )
      ) {
        await awsAcctMgmtService
          .deleteAwsAcct(this.param)
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
