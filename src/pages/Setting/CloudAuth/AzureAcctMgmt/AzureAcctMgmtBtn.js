import Vue from 'vue';
import { mapActions } from 'vuex';
import { EventBus } from './eventBus.js';
import { i18n } from '../../../../../public/locales/i18n';

export default Vue.extend({
  computed: {
    showButton() {
      return this.params.data.userCtrtMpYn === 'Y';
    },
  },
  methods: {
    ...mapActions('azureAcctMgmt', ['setEvent', 'setUpdateInfo', 'setDeleteInfo']),
    acctUpdatePage() {
      this.setUpdateInfo({ ...this.params.data, appDesc: this.decodeHTML(this.params.data.appDesc) });
      this.$router.push('/setting/azureAcctUpdate');
    },
    acctDeletePage() {
      this.setDeleteInfo(this.params.data);
      this.$router.push('/setting/azureAcctDelete');
    },
    decodeHTML(html) {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    },
    getInquiryPopup() {
      EventBus.$emit('getInquiryPopup');
    },
  },
  template: `
    <div v-if="showButton">
      <button class="ico-write" title="수정" @click="acctUpdatePage()" >수정</button>
      <button class="ico-delete" style="margin-left: 10px;" title="삭제" @click="acctDeletePage()">삭제</button>
    </div>
    <div v-else>
      <button class="ico-qna" title="문의" @click="getInquiryPopup()" >문의</button>
    </div>`,
});
