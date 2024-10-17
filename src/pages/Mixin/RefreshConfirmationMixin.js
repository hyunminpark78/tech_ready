const RefreshConfirmationMixin = {
  mounted() {
    window.addEventListener('beforeunload', this.confirmRefresh);
  },
  methods: {
    confirmRefresh(event) {
      event.preventDefault();
      // Show confirmation dialog
      const confirmationMessage = '새로고침을 실행할 경우, 현재 모든 데이터를 잃어버립니다.';
      event.returnValue = confirmationMessage; // For older browsers
      return confirmationMessage;
    },
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.confirmRefresh);
  },
};

export { RefreshConfirmationMixin };
