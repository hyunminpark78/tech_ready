import Vue from 'vue';

export default Vue.extend({
  data: function () {
    return {};
  },
  beforeMount() {},
  mounted() {},
  methods: {},
  template: `
        <span :style="params.style">{{params.value}}</span>
    `,
});
