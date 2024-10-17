<template>
  <div class="grid2-wrap">
    <svc-grp-mgmt-ctgry-grid></svc-grp-mgmt-ctgry-grid>
    <svc-grp-mgmt-grp-grid></svc-grp-mgmt-grp-grid>
    <svc-grp-mgmt-acct-grid></svc-grp-mgmt-acct-grid>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import SvcGrpMgmtCtgryGrid from './SvcGrpMgmtCtgryGrid';
import SvcGrpMgmtGrpGrid from './SvcGrpMgmtGrpGrid';
import SvcGrpMgmtAcctGrid from './SvcGrpMgmtAcctGrid';

export default {
  components: {
    SvcGrpMgmtCtgryGrid,
    SvcGrpMgmtGrpGrid,
    SvcGrpMgmtAcctGrid,
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style></style>
