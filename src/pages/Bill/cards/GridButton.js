import Vue from 'vue';

export default Vue.extend({
  props: {
    imgUrl: {
      type: [String],
      default: '',
    },
    text: {
      type: [String],
      default: '',
    },
  },
  methods: {
    btnClickedHandler() {
      this.params.clicked(this.params);
    },
  },
  template: `
          <div class="test-image mt-2">{{text}}</div>
      `,
});
