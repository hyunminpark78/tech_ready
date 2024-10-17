import Vue from 'vue';

export default Vue.extend({
  data: function () {
    return {
      filterText: null,
    };
  },
  methods: {
    isFilterActive() {
      return this.filterText != null && this.filterText !== '';
    },
    getModel() {
      return { value: this.filterText };
    },

    setModel(model) {
      this.filterText = model.value;
    },
  },
  template: `
      <div style="padding: 4px; width: 200px;">
      <div style="font-weight: bold;">계약</div>
      <div style="margin-top: 20px;">This filter does partial word search on multiple words, eg "mich phel" still brings back Michael Phelps.</div>
      <div style="margin-top: 20px;">Just to emphasise that anything can go in here, here is an image!!</div>
      <div>
      </div>
      {{filterText}}
      </div>
    `,
});
