import Vue from 'vue';

export default Vue.extend({
  methods: {
    btnClickedHandler() {
      let data = {
        ctgryId: this.params.data.ctgryId,
        svcGrpId: this.params.data.svcGrpId,
      };
      this.params.clicked(data);
    },
  },
  template: `
    <div>
        <button class="ico-delete" style="margin-left: 2px;" @click="btnClickedHandler()">삭제</button>
    </div>`,
});
