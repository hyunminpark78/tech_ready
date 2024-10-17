<template>
  <RouterView />
</template>

<script>
import { mapActions } from 'vuex';

export default {
  created() {
    // this.fetchCtrt();
    // this.fetchFilter();
    // this.fetchUsage({ ctrtId: 'CTRT_ALL', headerType: 'PRDT' });
  },
  methods: {
    ...mapActions('analysis', ['fetchCtrt', 'fetchFilter', 'fetchUsage']),
  },
};
</script>
