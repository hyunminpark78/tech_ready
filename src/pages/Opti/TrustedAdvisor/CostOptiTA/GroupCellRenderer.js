import Vue from 'vue';
import { mapActions, mapState } from 'vuex';

export default Vue.extend({
  data() {
    return {
      style: null,
      level: null,
    };
  },
  beforeMount() {
    this.style = 'color: #5ba9ca; font-weight: bold;';
  },
  methods: {
    ...mapActions('trustedAdvisor', ['fetchVisibleDescPop', 'fetchChkDes']),
    openPop() {
      const param = {
        name: this.params.data.chkNm,
        desc: this.params.data.chkDesc,
      };
      this.fetchChkDes(param);
      this.fetchVisibleDescPop(true);
    },
  },
  template: `
    <div>
      <a href="javascript:void(0);" :style="style" @click="openPop()">{{ params.data.chkNm + '(' + params.data.chkRsrcCnt + '건)' }}</a>
    </div>`,
});
