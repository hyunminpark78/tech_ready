<template>
  <!-- sort -->
  <div class="sort-wrap mb-4" style="display: flex">
    <!-- select -->
    <div class="select_wrap mr-3">
      <button class="sel jsBtnShow1">
        <span class="flex show-arrow mx-3 down up" style="display: flex">
          <span class="mr-3"> Cloud </span>
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
      <div class="select_layer">
        <!-- radio -->
        <label class="radio">
          <input
            type="radio"
            name="cspTypCd"
            value="AWS"
            :checked="cspTypCd === 'AWS'"
            :disabled="getAwsCtrts.length > 0 ? false : true"
            @click="getAwsCtrts.length > 0 ? true : false"
          />
          <span class="label">
            <span class="i"><img src="@/assets/images/logo_aws.svg" alt="aws" /></span>
            <span class="t">
              <strong>AWS</strong>
              <span>{{ getAwsCtrts.length }} Accounts</span>
            </span>
          </span>
        </label>
        <!-- //radio -->
        <!-- radio -->
        <label class="radio">
          <input
            type="radio"
            name="cspTypCd"
            value="AZURE"
            :checked="cspTypCd === 'AZURE'"
            :disabled="getAzureCtrts.length > 0 ? false : true"
            @click="getAzureCtrts.length > 0 ? true : false"
          />
          <span class="label">
            <span class="i"><img src="@/assets/images/logo_azure.svg" alt="AZURE" /></span>
            <span class="t">
              <strong>AZURE</strong>
              <span>{{ getAzureCtrts.length }} Accounts</span>
            </span>
          </span>
        </label>
        <!-- //radio -->
        <!-- radio -->
        <label class="radio">
          <input
            type="radio"
            name="cspTypCd"
            value="GCP"
            :checked="cspTypCd === 'GCP'"
            :disabled="getGcpCtrts.length > 0 ? false : true"
            @click="getGcpCtrts.length > 0 ? true : false"
          />
          <span class="label">
            <span class="i"><img src="@/assets/images/logo_gcp.svg" alt="GCP" /></span>
            <span class="t">
              <strong>GCP</strong>
              <span>{{ getGcpCtrts.length }} Accounts</span>
            </span>
          </span>
        </label>
        <!-- //radio -->
        <button class="btn jsBtnClose2" @click="handleCspTypeChange(null)">{{ $t('common.button.apply') }}</button>
      </div>
    </div>
    <div class="flex dashboard-card" style="flex-grow: 1">
      <!-- col -->
      <div class="relative py-4 px-7 select-one">
        <div class="text-sm text-primary-600">{{ $t('common.select.contract') }}</div>
        <!-- 계약 Select-->
        <Select
          :data="selectContractOptions"
          :key-getter="(item) => item.ctrtId"
          :text-getter="(item) => item.ctrtNm"
          select-class="flex items-center justify-between w-full text-gray-700 font-bold"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="-mr-2"
          div-class="w-full"
          option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
          option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
          @click="handleFilterContractChange"
        />
      </div>
      <!-- //col -->
    </div>
    <!-- //select -->
    <div class="pos-right">
      <button class="new" @click="popupToggle">
        <img :src="noticeImgUrl" alt="알림" />
        <em>{{ alarmCount }}</em>
      </button>
      <button class="new" @click="getInquiryPopup">
        <img src="@/assets/images/qna-01.svg" alt="QA" />
        <em>{{ qnaCount }}</em>
      </button>
    </div>
    <NotifyPop v-if="popupVisible" :visible="popupVisible" @close="popupToggle"></NotifyPop>
    <Popup :visible="inquiryPopup.visible" :content="inquiryPopup.content" @closePopup="closeInquiryPopup" />
  </div>
  <!-- //sort -->
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Select from '@/components/Select';
import NotifyPop from '@/pages/TotalDashboard/sections/NotifyPop.vue';
import totalDashboardService from '@/services/totalDashboardService';
import Popup from '@/components/Popup.vue';

export default {
  components: { NotifyPop, Select, Popup },
  data() {
    return {
      isSearch: true,
      cspTypCd: 'AWS',
      popupVisible: false,
      alarmCount: 0,
      inquiryPopup: {
        visible: false,
        content: '',
      },
    };
  },
  computed: {
    ...mapState('notice', ['qnaStatus']),
    ...mapState('totalDashboard', ['filter', 'billInfo', 'ctrt']),
    ...mapGetters('common', ['getAzureCtrts', 'getAwsCtrts', 'getGcpCtrts']),
    setDefaultSelected() {
      return this.selectContractOptions.length > 1 ? 1 : 0;
    },
    selectContractOptions() {
      switch (this.cspTypCd) {
        case 'AWS':
          return this.getAwsCtrts;
        case 'AZURE':
          return this.getAzureCtrts;
        case 'GCP':
          return this.getGcpCtrts;
        default:
          return [];
      }
    },
    qnaCount() {
      if (this.qnaStatus) {
        let finalCnt = this.qnaStatus.final ? this.qnaStatus.final : 0;
        let completeCnt = this.qnaStatus.complete ? this.qnaStatus.complete : 0;
        return finalCnt + completeCnt;
      } else {
        return 0;
      }
    },
    noticeImgUrl() {
      // '01' new item icon
      // '02' no new item icon
      const icon = this.alarmCount > 0 ? '01' : '02';
      return require(`@/assets/images/notify-${icon}.svg`);
    },
  },
  async created() {
    // !! 처음 로그인 시 서비스 API를 통해 계약 정보를 가져오는 과정에서
    // 시간차로 인하여 다른 컴포넌트는 대기하지 않고, 바로 계약 ID를 매개변수로
    // API를 호출하여 실제 매개변수가 반영되지 않는 문제를 해결하기 위한 함수.
    await this.waitGettingCtrts();
    this.fetchCtrt([...this.getAwsCtrts, ...this.getAzureCtrts, ...this.getGcpCtrts]);
    if (this.getAwsCtrts.length === 0 && this.getAzureCtrts.length > 0) {
      this.cspTypCd = 'AZURE';
      this.handleCspTypeChange(this.cspTypCd);
    } else if (this.getGcpCtrts.length > 0) {
      this.cspTypCd = 'GCP';
      this.handleCspTypeChange(this.cspTypCd);
    }
    this.setFilter({
      name: 'contract',
      payload: this.ctrt[0],
    });
    this.onSearch();
    this.setAlarmCount();
    this.fetchFreshDesk();
  },
  mounted() {
    const btnShows = document.querySelectorAll('.jsBtnShow1');
    btnShows.forEach((btnShow) => {
      btnShow.onclick = function () {
        if (this.parentNode.classList.contains('active')) {
          this.parentNode.classList.remove('active');
        } else {
          for (let i = 0; i < btnShows.length; i++) {
            btnShows[i].parentNode.classList.remove('active');
          }
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
    ...mapActions('totalDashboard', [
      'fetchCtrt',
      'setFilter',
      'fetchBillSummary',
      'fetchCostOptiSummary',
      'fetchSearch',
      'fetchBillDetail',
      'setBillDetailNull',
      'fetchAiPatternAnalysis',
      'setCtrtList',
    ]),
    ...mapActions('common', ['waitGettingCtrts']),
    ...mapActions('notice', ['fetchFreshDesk']),
    handleFilterContractChange(contract) {
      this.setFilter({ name: 'contract', payload: contract });
      this.onSearch();
      this.setAlarmCount();
    },
    onSearch() {
      this.isSearch = true;
      this.initSearch();
    },
    initSearch() {
      this.fetchSearch({ isSearch: { isSearch: this.isSearch } });
      this.isSearch = false;
    },
    handleCspTypeChange(value) {
      let cspTypCd = '';
      if (value === null) {
        const radioList = document.getElementsByName('cspTypCd');
        radioList.forEach((node) => {
          if (node.checked) {
            cspTypCd = node.value;
          }
        });
      } else {
        cspTypCd = value;
      }

      this.cspTypCd = cspTypCd;
      this.setFilter({ name: 'cspTypCd', payload: this.cspTypCd });
      this.setCtrtList({ type: this.cspTypCd });
      this.setFilter({
        name: 'contract',
        payload: this.ctrt[0],
      });
      this.onSearch();
      this.setAlarmCount();
    },
    async setAlarmCount() {
      const result = await totalDashboardService.fetchAlarmList({ ctrtId: this.filter.contract.ctrtId });
      this.alarmCount = (result.data.data || []).length;
    },
    popupToggle() {
      this.popupVisible = !this.popupVisible;
    },
    routeQna() {
      this.$router.push('/support/qna');
    },
    getInquiryPopup() {
      this.inquiryPopup.content = `${this.$t('support.hello')}\n${this.$t(
        'support.inquiryFunctionPrepared'
      )}\n${this.$t('support.anyQuestionsEmail')}\n${this.$t('support.thankYou')}`;
      this.inquiryPopup.visible = true;
    },
    closeInquiryPopup() {
      this.inquiryPopup.content = '';
      this.inquiryPopup.visible = false;
    },
  },
};
</script>

<style></style>
