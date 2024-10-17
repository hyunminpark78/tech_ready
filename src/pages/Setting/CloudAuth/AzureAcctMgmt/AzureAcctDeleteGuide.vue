<template>
  <div class="box-wrap">
    <div class="title bb1">
      <h4 class="tit-wrap">{{ $t('setting.deleteAppAzure') }}</h4>
      <p class="info">
        {{ $t('setting.followGuideDeleteApp') }}
        <br /><span style="color: #fc5aa1">{{ $t('setting.warningAppDelete') }}</span>
      </p>
    </div>
    <div class="step-wrap">
      <ol>
        <li id="step1" class="active">
          <!-- 내용 활성화 : class="active"-->
          <span class="num">1</span>
          <div class="tit">{{ $t('setting.appDelete') }}</div>
          <div class="detail">
            <p class="txt">{{ $t('setting.selectAppDelete') }}</p>
            <div class="img">
              <img src="@/assets/images/img-azure-regist-step1-1-d.jpg" alt="애플리케이션 삭제" />
            </div>
            <p class="txt">
              {{ $t('setting.deleteButtonOVerview') }}
            </p>
            <div class="img">
              <img src="@/assets/images/img-azure-regist-step1-2-d.jpg" alt="애플리케이션 삭제" />
            </div>
            <button class="btn" @click="scrollTo(1, 2)">{{ $t('setting.next') }}</button>
          </div>
        </li>
        <li id="step2">
          <span class="num">2</span>
          <div class="tit">{{ $t('setting.deleteSubscriptionPrivileges') }}</div>
          <div class="detail">
            <p class="txt">{{ $t('setting.selectSubscriptionMenu') }}</p>
            <div class="img">
              <img
                src="@/assets/images/img-azure-regist-step2-1-d.jpg"
                alt="전체 서비스 목록 (All services)에서 [구독](Subscriptions) 메뉴를 선택합니다."
              />
            </div>
            <div class="txt">
              {{ $t('setting.removeReadPermission') }}
            </div>
            <div class="img">
              <img
                src="@/assets/images/img-azure-regist-step2-2-d.jpg"
                alt="권한을 부여했던 구독별로 [액세스 제어] (Access control (IAM)) 메뉴에서 읽기권한을 삭제합니다."
              />
            </div>
            <button class="btn gray-line" @click="scrollTo(2, 1)">{{ $t('setting.before') }}</button>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AzureAcctDeleteGuide',
  components: {},
  data() {
    return {
      mode: 'step',
    };
  },
  methods: {
    scrollTo(cur, dist) {
      document.getElementById('step' + cur).classList.remove('active');
      document.getElementById('step' + dist).classList.add('active');
    },

    copyClipboard(text) {
      this.$copyText(text);
    },
  },
};
</script>
