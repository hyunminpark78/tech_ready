<template>
  <!-- module -->
  <div class="box-wrap">
    <div class="title bb1">
      <h4 class="tit-wrap">{{ $t('setting.deleteAccountInfo') }}</h4>
      <p class="info">
        {{ $t('setting.followStepGuide') }}
        <br />{{ $t('setting.selectQuickCreation') }}
      </p>
    </div>
    <!-- step -->
    <div class="step-wrap">
      <ol>
        <li id="step1" class="active">
          <!-- 내용 활성화 : class="active"-->
          <span class="num">1</span>
          <div class="tit">{{ $t('setting.connectAwsCloudFormation') }}</div>
          <!-- detail -->
          <div class="detail">
            <p v-if="$i18n.locale === 'ko'" class="txt">
              AWS에 로그인한 후, <em>AWS Management Console</em>에서 [CloudFormation] 서비스를 선택합니다.
            </p>
            <p v-if="$i18n.locale === 'en'" class="txt">
              Once you are logged in to AWS, select the CloudFormation service in <em>the AWS Management Console</em>,
            </p>
            <div class="img"><img src="@/assets/images/img-regist-step1.jpg" alt="AWS CloudFormation 접속" /></div>
            <button class="btn" @click="scrollTo(1, 2)">{{ $t('setting.next') }}</button>
          </div>
          <!-- //detail -->
        </li>
        <li id="step2">
          <span class="num">2</span>
          <div class="tit">{{ $t('setting.checkStack') }}</div>
          <!-- detail -->
          <div class="detail">
            <p class="txt">{{ $t('setting.clickStackDelete') }}</p>
            <div class="img">
              <img
                src="@/assets/images/img-en-regist-step7-1.png"
                alt="스택 목록에서 삭제할 스택을 클릭하고 Resources 탭에서 [Physical ID]를 클릭합니다."
              />
            </div>
            <div class="txt">{{ $t('setting.clickPhysicalIdCheck') }}</div>
            <div class="img">
              <img
                src="@/assets/images/img-en-regist-step7-2.png"
                alt="Physical ID 항목을 클릭한 후 요약 화면이 나타나면, 역할 ARN의 정보가 기존 등록한 위 정보와 동일한지 확인합니다."
              />
            </div>
            <button class="btn gray-line" @click="scrollTo(2, 1)">{{ $t('setting.before') }}</button>
            <button class="btn" @click="scrollTo(2, 3)">{{ $t('setting.next') }}</button>
          </div>
          <!-- //detail -->
        </li>
        <li id="step3">
          <span class="num">3</span>
          <div class="tit">{{ $t('setting.deleteStack') }}</div>
          <!-- detail -->
          <div class="detail">
            <p class="txt">{{ $t('setting.checkStackDelete') }}</p>
            <div class="img"><img src="@/assets/images/img-en-regist-step3-d.png" alt="스택 삭제" /></div>
            <button class="btn gray-line" @click="scrollTo(3, 2)">{{ $t('setting.before') }}</button>
          </div>
          <!-- //detail -->
        </li>
      </ol>
    </div>
    <!-- //step -->
  </div>
  <!-- //module -->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
export default {
  components: {},
  data() {
    return {
      mode: 'step',
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    scrollTo(cur, dist) {
      document.getElementById('step' + cur).classList.remove('active');
      document.getElementById('step' + dist).classList.add('active');
      // let location = document.querySelector('#step' + top).offsetTop;
      // window.scrollTo({ top: location, behavior: 'smooth' });
    },

    copyClipboard(text) {
      this.$copyText(text);
    },
  },
};
</script>
