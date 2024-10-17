<template>
  <!-- module -->
  <div class="box-wrap">
    <div class="title bb1">
      <h4 class="tit-wrap">{{ $t('setting.howToGenerate') }}</h4>
      <p class="info">
        {{ $t('setting.followStepGuide') }}
        <br />{{ $t('setting.selectQuickCreation') }}
      </p>
      <div class="radio-wrap">
        <label class="radio">
          <input v-model="mode" type="radio" name="mode" title="단계별 가이드로 생성" value="step" checked="checked" />
          <span class="label">{{ $t('setting.stepGuide') }}</span>
        </label>
        <label class="radio">
          <input v-model="mode" type="radio" name="mode" value="quick" title="빠른 생성" />
          <span class="label">{{ $t('setting.quickCreation') }}</span>
        </label>
      </div>
    </div>
    <template v-if="mode === 'step'">
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
            <!-- 내용 활성화 : class="active"-->
            <span class="num">2</span>
            <div class="tit">{{ $t('setting.createStack') }}</div>
            <!-- detail -->
            <div class="detail">
              <p class="txt">{{ $t('setting.stackGenerationFollowing') }}</p>
              <div class="img">
                <img src="@/assets/images/img-en-regist-step2.jpg" alt="Stacks 화면에서 Create stack > [With new resource (standard)]을 클릭해 스택을 생성합니다." />
              </div>
              <button class="btn gray-line" @click="scrollTo(2, 1)">{{ $t('setting.before') }}</button>
              <button class="btn" @click="scrollTo(2, 3)">{{ $t('setting.next') }}</button>
            </div>
            <!-- //detail -->
          </li>
          <li id="step3">
            <!-- 내용 활성화 : class="active"-->
            <span class="num">3</span>
            <div class="tit">{{ $t('setting.enterTemplateSpecInfo') }}</div>
            <!-- detail -->
            <div class="detail">
              <p class="txt">{{ $t('setting.selectAmazonS3') }}</p>
              <div class="flex items-center py-2">
                <label class="text-sm text-primary-600 w-28">{{ $t('setting.templateUrl') }}</label>
                <input
                  type="text"
                  class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
                  :placeholder="$t('setting.enterTemplateUrl')"
                  :value="templateUrl"
                  disabled="disabled"
                />
                <button class="ico-copy ml-2" @click="copyClipboard(templateUrl)">{{ $t('setting.copy') }}</button>
              </div>
              <div class="img"><img src="@/assets/images/img-en-regist-step3.jpg" alt="템플릿 지정 정보 입력" /></div>
              <button class="btn gray-line" @click="scrollTo(3, 2)">{{ $t('setting.before') }}</button>
              <button class="btn" @click="scrollTo(3, 4)">{{ $t('setting.next') }}</button>
            </div>
            <!-- //detail -->
          </li>
          <li id="step4">
            <!-- 내용 활성화 : class="active"-->
            <span class="num">4</span>
            <div class="tit">{{ $t('setting.enterStackDetails') }}</div>
            <!-- detail -->
            <div class="detail">
              <p class="txt">
                {{ $t('setting.afterEnterDetail') }}
                <br />{{ $t('setting.externalAcccountFilled') }}
              </p>
              <div class="flex items-center py-2">
                <label class="text-sm text-primary-600 w-28">{{ $t('setting.externalId') }}</label>
                <input
                  type="text"
                  class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
                  :placeholder="$t('setting.enterExternalId')"
                  :value="detail.extId"
                  disabled="disabled"
                />
                <button class="ico-copy ml-2" @click="copyClipboard(detail.extId)">{{ $t('setting.copy') }}</button>
              </div>
              <div class="img"><img src="@/assets/images/img-en-regist-step4.jpg" alt="스택 세부 정보 입력" /></div>
              <button class="btn gray-line" @click="scrollTo(4, 3)">{{ $t('setting.before') }}</button>
              <button class="btn" @click="scrollTo(4, 5)">{{ $t('setting.next') }}</button>
            </div>
            <!-- //detail -->
          </li>
          <li id="step5">
            <!-- 내용 활성화 : class="active"-->
            <span class="num">5</span>
            <div class="tit">{{ $t('setting.settingStackOptions') }}</div>
            <!-- detail -->
            <div class="detail">
              <p class="txt">{{ $t('setting.clickNextButton') }}</p>
              <div class="img">
                <img src="@/assets/images/img-en-regist-step5.png" alt="스택 옵션 구성" />
              </div>
              <button class="btn gray-line" @click="scrollTo(5, 4)">{{ $t('setting.before') }}</button>
              <button class="btn" @click="scrollTo(5, 6)">{{ $t('setting.next') }}</button>
            </div>
            <!-- //detail -->
          </li>
          <li id="step6">
            <!-- 내용 활성화 : class="active"-->
            <span class="num">6</span>
            <div class="tit">{{ $t('setting.checkInputItems') }}</div>
            <!-- detail -->
            <div class="detail">
              <p class="txt">{{ $t('setting.checkCheckBox') }}</p>
              <div class="img">
                <img src="@/assets/images/img-en-regist-step6.png" alt="검토 화면에서 입력 항목 확인 및 스택 생성" />
              </div>
              <button class="btn gray-line" @click="scrollTo(6, 5)">{{ $t('setting.before') }}</button>
              <button class="btn" @click="scrollTo(6, 7)">{{ $t('setting.next') }}</button>
            </div>
            <!-- //detail -->
          </li>
          <li id="step7">
            <!-- 내용 활성화 : class="active"-->
            <span class="num">7</span>
            <div class="tit">{{ $t('setting.roleArnInput') }}</div>
            <!-- detail -->
            <div class="detail">
              <p class="txt">{{ $t('setting.clickStackCreated') }}</p>
              <div class="img">
                <img
                  src="@/assets/images/img-en-regist-step7-1.png"
                  alt="스택 목록에서 생성한 스택을 클릭하고 Resource 탭에서 [Physical ID]를 클릭합니다."
                />
              </div>
              <p class="txt">{{ $t('setting.clickPhysicalId') }}</p>
              <div class="img">
                <img
                  src="@/assets/images/img-en-regist-step7-2.png"
                  alt="Physical ID 항목을 클릭한 후 요약 화면이 나타나면, 역할 ARN의 [클립보드로 복사하기] 아이콘을 클릭하여 역할 ARN 값을 복사한 후 Configurations의 역할 ARN 입력 필드에 붙여넣습니다."
                />
              </div>
              <div class="flex items-center py-2">
                <label class="text-xl text-primary-600 w-28">{{ $t('setting.roleArn') }}</label>
                <input
                  v-model.trim="roleArn"
                  type="text"
                  class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
                  placeholder="역할 ARN을 입력해주세요"
                />
              </div>
              <button class="btn gray-line" @click="scrollTo(7, 6)">{{ $t('setting.before') }}</button>
            </div>
            <!-- //detail -->
          </li>
        </ol>
      </div>
    </template>
    <template v-if="mode === 'quick'">
      <div class="step-wrap">
        <div class="flex items-center px-8 py-2 border-b border-primary-200">
          <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.templateUrl') }}</label>
          <input
            type="text"
            class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
            :placeholder="$t('setting.enterTemplateUrl')"
            :value="templateUrl"
            disabled="disabled"
          />
          <button class="ico-copy ml-2" @click="copyClipboard(templateUrl)">{{ $t('setting.copy') }}</button>
        </div>
        <div class="flex items-center px-8 py-2 border-b border-primary-200">
          <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.externalId') }}</label>
          <input
            type="text"
            class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
            :placeholder="$t('setting.enterExternalId')"
            :value="detail.extId"
            disabled="disabled"
          />
          <button class="ico-copy ml-2" @click="copyClipboard(detail.extId)">{{ $t('setting.copy') }}</button>
        </div>
        <div class="flex items-center px-8 py-2">
          <label class="text-sm font-bold text-primary-600 w-44">{{ $t('setting.roleArn') }}</label>
          <input
            v-model.trim="roleArn"
            type="text"
            class="w-full flex-1 px-5 py-1.5 text-sm border border-gray-300 rounded"
            :placeholder="$t('setting.enterRoleArn')"
          />
        </div>
      </div>
    </template>
    <!-- //step -->
  </div>
  <!-- //module -->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import _ from 'lodash';
import { getBuildEnv } from '@/library/Common';

export default {
  components: {},
  data() {
    return {
      mode: 'step',
      templateUrl: '',
      roleArn: '',
    };
  },
  computed: {
    ...mapState('awsAcctMgmt', ['detail']),
  },
  mounted() {},
  beforeMount() {
    let server = getBuildEnv();
    if (server === 'prd') {
      this.templateUrl = `https://skt-cloudformation-prd.s3.ap-northeast-2.amazonaws.com/skt-cloudformation-template-prd-v1.0.yaml`;
    } else if (server === 'dev') {
      this.templateUrl = `https://skt-cloudformation-dev.s3.ap-northeast-2.amazonaws.com/skt-cloudformation-template-dev-v1.0.yaml`;
    } else if (server === 'stg') {
      this.templateUrl = `https://skt-cloudformation-stg.s3.ap-northeast-2.amazonaws.com/skt-cloudformation-template-stg-v1.0.yaml`;
    } else {
      this.templateUrl = `https://skt-cloudformation-dev.s3.ap-northeast-2.amazonaws.com/skt-cloudformation-template-dev-v1.0.yaml`;
    }
  },
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

<style></style>
