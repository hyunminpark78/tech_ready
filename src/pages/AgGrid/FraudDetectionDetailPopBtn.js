import Vue from 'vue';
import moment from 'moment';
import img from '@/assets/images/ico-flip.svg';

export default Vue.extend({
  methods: {
    btnClickedHandler() {
      let data = {
        ctrtId: this.params.value,
        analDt: moment(this.params.data.analDt).format('YYYYMMDD'),
      };
      this.params.clicked(data);
    },
  },
  template: `<button
              class="test-image"
              style="vertical-align: middle; margin-top: -2px;"
              @click="btnClickedHandler()">
             </button>`,
});
