const PreventRefreshMixin = {
  mounted() {
    document.addEventListener('keydown', this.handleRefreshKeyPress);
  },
  methods: {
    handleRefreshKeyPress(event) {
      if (event.keyCode === 116 || (event.ctrlKey && event.keyCode === 82)) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleRefreshKeyPress);
  },
};

export { PreventRefreshMixin };
