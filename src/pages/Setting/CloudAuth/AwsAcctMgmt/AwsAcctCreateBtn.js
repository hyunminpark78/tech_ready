import Vue from 'vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  data() {
    return {
      roleArn: '',
    };
  },
  beforeMount() {
    this.roleArn = this.params.data.roleArn;
  },
  methods: {
    ...mapActions('awsAcctMgmt', ['fetchDetail']),
    acctCreatePage() {
      this.$router.push('/setting/awsAcctCreate');
      const param = {
        acntId: this.params.data.acntId,
        acntNm: this.params.data.acntNm,
        extId: this.params.data.extId,
        roleArn: this.params.data.roleArn,
        custCorpId: this.params.data.custCorpId,
        corpRegNo: this.params.data.corpRegNo,
      };
      this.fetchDetail(param);
    },
    acctDeletePage() {
      this.$router.push('/setting/awsAcctDelete');
      const param = {
        acntId: this.params.data.acntId,
        acntNm: this.params.data.acntNm,
        extId: this.params.data.extId,
        roleArn: this.params.data.roleArn,
        custCorpId: this.params.data.custCorpId,
        corpRegNo: this.params.data.corpRegNo,
      };
      this.fetchDetail(param);
    },
  },
  template: `
    <div>
      <template v-if="roleArn">
        <button class="ico-delete" style="margin-left: 4px;" @click="acctDeletePage()">삭제</button>
      </template>
      <template v-else>
        <button class="ico-write" @click="acctCreatePage()">등록</button>
      </template>
    </div>`,
});
