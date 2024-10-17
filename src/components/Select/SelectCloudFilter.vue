<template>
  <div class="select_wrap mr-3" style="width: 200px; height: auto">
    <button class="sel jsBtnShow1" style="height: 100%" @click="onCloudButtonClicked">
      <span class="down flex show-arrow mx-3" style="display: flex">
        <span class="mr-3">Cloud</span>
        <span class="contents-line"></span>
        <span v-if="cspTypCd === 'AWS'" class="mt-5 ml-6">
          <img src="@/assets/images/logo_typ_aws.svg" alt="aws" />
        </span>
        <span v-else-if="cspTypCd === 'AZURE'" class="mt-5 ml-4">
          <img src="@/assets/images/logo_typ_azure.svg" alt="azure" />
        </span>
        <span v-else-if="cspTypCd === 'GCP'" class="mt-6 ml-4">
          <img src="@/assets/images/logo_typ_gcp.svg" alt="gcp" />
        </span>
      </span>
    </button>
    <div class="cloud_select_layer">
      <!-- radio -->
      <label class="radio">
        <input
          v-model="checkedCspTypCd"
          type="radio"
          name="cspTypCd"
          value="AWS"
          :disabled="awsCtrt.length <= 0"
          @click="awsCtrt.length > 0"
        />
        <span class="label">
          <span class="i"><img src="@/assets/images/logo_aws.svg" alt="aws" /></span>
          <span class="t">
            <strong>AWS</strong>
            <span>{{ awsCtrt.length }} Accounts</span>
          </span>
        </span>
      </label>
      <!-- //radio -->
      <!-- radio -->
      <label class="radio">
        <input
          v-model="checkedCspTypCd"
          type="radio"
          name="cspTypCd"
          value="AZURE"
          :disabled="azureCtrt.length <= 0"
          @click="azureCtrt.length > 0"
        />
        <span class="label">
          <span class="i"><img src="@/assets/images/logo_azure.svg" alt="AZURE" /></span>
          <span class="t">
            <strong>AZURE</strong>
            <span>{{ azureCtrt.length }} Accounts</span>
          </span>
        </span>
      </label>
      <!-- //radio -->
      <!-- radio -->
      <label class="radio">
        <input
          v-model="checkedCspTypCd"
          type="radio"
          name="cspTypCd"
          value="GCP"
          :disabled="gcpCtrt.length <= 0"
          @click="gcpCtrt.length > 0"
        />
        <span class="label">
          <span class="i"><img src="@/assets/images/logo_gcp.svg" alt="GCP" /></span>
          <span class="t">
            <strong>GCP</strong>
            <span>{{ gcpCtrt.length }} Accounts</span>
          </span>
        </span>
      </label>
      <!-- //radio -->
      <button class="btn jsBtnClose2" @click="applyCheckedCspTypCd()">{{ $t('common.button.apply') }}</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import totalDashboardService from '@/services/totalDashboardService';

export default {
  props: {
    cspTypCdFromParent: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    ...mapState('totalDashboard', ['billInfo', 'ctrt', 'azureCtrt', 'awsCtrt', 'gcpCtrt']),
    ...mapState('notice', ['qnaStatus']),
    ...mapGetters('totalDashboard', ['selectContractOptions']),
  },
  // eslint-disable-next-line vue/order-in-components
  data() {
    return {
      cspTypCd: 'AWS',
      checkedCspTypCd: 'AWS',
      isSearch: true,
    };
  },
  created() {
    this.initCspTypCd();
    this.fetchFreshDesk();
  },
  mounted() {
    const btnShows = document.querySelectorAll('.jsBtnShow1');
    btnShows.forEach((btnShow) => {
      btnShow.onclick = function () {
        if (this.parentNode.classList.contains('active')) {
          this.parentNode.classList.remove('active');
          this.childNodes[0].classList.remove('up');
        } else {
          for (let i = 0; i < btnShows.length; i++) {
            btnShows[i].parentNode.classList.remove('active');
          }
          this.childNodes[0].classList.add('up');
          this.parentNode.classList.add('active');
        }
      };
    });
    const btn2Closes = document.querySelectorAll('.jsBtnClose2');
    btn2Closes.forEach((btn2Close) => {
      btn2Close.onclick = function () {
        this.parentNode.parentNode.classList.remove('active');
      };
    });
  },
  methods: {
    ...mapActions('totalDashboard', ['fetchCtrt', 'setFilter', 'fetchSearch', 'setCtrtList']),
    ...mapActions('notice', ['fetchFreshDesk']),
    setTotalDashboardFilter() {
      this.setFilter({ name: 'cspTypCd', payload: this.cspTypCd });
      this.setCtrtList({ type: this.cspTypCd });
      this.setFilter({
        name: 'contract',
        payload: this.ctrt[0],
      });
      this.onSearch();
    },
    applyCspTypCd(cspTypCd) {
      this.cspTypCd = cspTypCd;
      this.checkedCspTypCd = cspTypCd;
      this.setTotalDashboardFilter();
    },
    applyCheckedCspTypCd() {
      this.cspTypCd = this.checkedCspTypCd;
      this.setTotalDashboardFilter();
      this.$emit('onCspTypCdChanged', { cspTypCd: this.cspTypCd });
    },
    initSearch() {
      this.fetchSearch({ isSearch: { isSearch: this.isSearch } });
      this.isSearch = false;
    },
    onSearch() {
      this.isSearch = true;
      this.initSearch();
    },
    onCloudButtonClicked() {
      // 체크된 cspTypCd 원복
      this.checkedCspTypCd = this.cspTypCd;
    },
    async initCspTypCd() {
      // 외부로 부터 설정된 csp가 있으면 우선 임시로 설정하여 csp 변경에 따른 깜빡임 방지
      if (this.cspTypCdFromParent) {
        this.cspTypCd = this.cspTypCdFromParent;
      }

      try {
        // 유저가 가지고 있는 계약에 따라 초기 csp 값 설정
        const response = await totalDashboardService.fetchCtrt();
        const result = response.data.data;
        if (result.length > 0) {
          this.fetchCtrt(result);
          // 외부로부터 설정된 csp가 있으면 설정
          if (this.cspTypCdFromParent) {
            this.applyCspTypCd(this.cspTypCdFromParent);
          } else if (this.awsCtrt.length) {
            this.applyCspTypCd('AWS');
          } else if (this.azureCtrt.length) {
            this.applyCspTypCd('AZURE');
          }
        }
      } catch (e) {
        console.error('[Error] SelectCloudFilter > initCspTypCd() > totalDashboardService.fetchCtrt() : ', e);
      }

      this.$emit('onCspTypCdInitialized', { cspTypCd: this.cspTypCd });
    },
  },
};
</script>
