<template>
  <div>
    <main class="contents-wrap pxy1">
      <CtrtSelection></CtrtSelection>
      <div class="grid2-wrap">
        <BillInfo></BillInfo>
        <BillDetail :csp-typ-cd="cspTypCd"></BillDetail>
      </div>
      <div class="grid4-wrap">
        <div class="left">
          <CmmtInfo></CmmtInfo>
          <div class="grid2-wrap col2 h306">
            <RsrcInfo></RsrcInfo>
            <RsrcOptiRcmd></RsrcOptiRcmd>
          </div>
        </div>
        <div v-if="hasAdminRole() === false" class="right">
          <CostPattern></CostPattern>
        </div>
        <div v-if="hasAdminRole() === true" class="right">
          <CostPatternMini></CostPatternMini>
          <div class="box-wrap pb24 list-wrap jhplus2">
            <div class="title">
              <h4 class="tit-wrap">예산현황</h4>
            </div>
            <div class="list7-wrap" style="margin-top: -40px">
              <div class="tit4-wrap">
                <button class="more single">상세보기</button>
              </div>
              <div class="jh_celling">
                <div class="jh_celling_left">
                  <b class="tit_jh">당월 예산 요약</b>
                  <div class="gr_inner"></div>
                </div>
                <div class="jh_celling_right">
                  <div class="jh_celling_right_top">
                    <b class="tit_jh">등록된 알림 수</b>
                    <div class="te"><span class="blu">15</span><em>개</em></div>
                  </div>
                  <div class="jh_celling_right_bottom">
                    <b class="tit_jh">임계 초과 수 </b>
                    <div class="te"><span>4</span><em>개</em></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CtrtSelection from '@/pages/TotalDashboard/sections/CtrtSelection.vue';
import BillInfo from '@/pages/TotalDashboard/sections/BillInfo.vue';
import BillDetail from '@/pages/TotalDashboard/sections/BillDetail.vue';
import CmmtInfo from '@/pages/TotalDashboard/sections/CmmtInfo.vue';
import CostPattern from '@/pages/TotalDashboard/sections/CostPattern.vue';
import CostPatternMini from '@/pages/TotalDashboard/sections/CostPatternMini.vue';
import RsrcInfo from '@/pages/TotalDashboard/sections/RsrcInfo.vue';
import RsrcOptiRcmd from '@/pages/TotalDashboard/sections/RsrcOptiRcmd.vue';
import { hasAdminRole } from '@/pages/TotalDashboard/sections/role-permission';

export default {
  name: 'TotalDashboard',
  components: {
    CtrtSelection,
    BillInfo,
    BillDetail,
    CmmtInfo,
    CostPattern,
    RsrcInfo,
    RsrcOptiRcmd,
    CostPatternMini,
  },
  data() {
    return {
      cspTypCd: '',
      isSearch: true,
      isId: false,
    };
  },
  computed: {
    ...mapState('totalDashboard', ['filter']),
    ...mapState('common', ['myCmmts']),
  },
  created() {
    this.initCSP();
  },
  methods: {
    hasAdminRole,
    ...mapActions('totalDashboard', ['setFilter']),
    initCSP() {
      if (this.myCmmts.includes('SP') || this.myCmmts.includes('RI')) {
        this.cspTypCd = 'AWS';
      } else if (this.myCmmts.includes('AzureRI')) {
        this.cspTypCd = 'AZURE';
      } else if (this.myCmmts.includes('GcpRI')) {
        // for GCP RI
      } else {
        this.cspTypCd = 'AWS';
      }
      this.setFilter({ name: 'cspTypCd', payload: this.cspTypCd });
    },
  },
};
</script>
