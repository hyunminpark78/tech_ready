<template>
  <div class="box-wrap s3-wrap s3">
    <strong class="tit">{{ $t('optimization.awsS3OptiOverview') }}</strong>
    <ul class="list10-wrap">
      <li>{{ $t('optimization.awsS3Desc1') }}</li>
      <li>{{ $t('optimization.awsS3Desc2') }}</li>
    </ul>

    <strong class="tit">AWS S3 Storage Class</strong>
    <ul class="list10-wrap">
      <li>{{ $t('optimization.awsS3StorageClassDesc1') }}</li>
      <li>{{ $t('optimization.awsS3StorageClassDesc2') }}</li>
    </ul>
    <ul class="list11-wrap">
      <li>
        <button class="jsTooltip2">
          <span class="img"><img src="@/assets/images/ico-s3-01.svg" alt="S3 Standard" /></span>
          <span class="tit">S3 Standard</span>
        </button>
        <!-- tooltip -->
        <div class="tooltip2-wrap">
          <strong class="ti">S3 Standard</strong>
          {{ $t('optimization.s3StandardDesc') }}
          <strong class="ti2">{{ $t('optimization.exampleOfUse') }}</strong>
          {{ $t('optimization.s3StandardExample') }}
          <button class="close jsTooltipClose2">툴팁 닫기</button>
        </div>
        <!-- //tooltip -->
      </li>
      <li>
        <button class="jsTooltip2">
          <span class="img"><img src="@/assets/images/ico-s3-02.svg" alt="S3 Intelligent-Tiering" /></span>
          <span class="tit">S3 Intelligent-<br />Tiering</span>
        </button>
        <!-- tooltip -->
        <div class="tooltip2-wrap">
          <strong class="ti">S3 Intelligent–Tiering</strong>
          {{ $t('optimization.s3IntelligentTiering') }}
          <strong class="ti2">{{ $t('optimization.exampleOfUse') }}</strong>
          {{ $t('optimization.s3IntelligentTieringExample') }}
          <button class="close jsTooltipClose2">툴팁 닫기</button>
        </div>
        <!-- //tooltip -->
      </li>
      <li>
        <button class="jsTooltip2">
          <span class="img"><img src="@/assets/images/ico-s3-03.svg" alt="S3 Standard-IA" /></span>
          <span class="tit">S3 Standard-IA</span>
        </button>
        <!-- tooltip -->
        <div class="tooltip2-wrap">
          <strong class="ti">S3 Standard–IA</strong>
          {{ $t('optimization.s3StandardIaDesc') }}
          <strong class="ti2">{{ $t('optimization.exampleOfUse') }}</strong>
          {{ $t('optimization.s3StandardIaExample') }}
          <button class="close jsTooltipClose2">툴팁 닫기</button>
        </div>
        <!-- //tooltip -->
      </li>
      <li>
        <button class="jsTooltip2">
          <span class="img"><img src="@/assets/images/ico-s3-04.svg" alt="S3 One Zone-IA" /></span>
          <span class="tit">S3 One Zone-IA</span>
        </button>
        <!-- tooltip -->
        <div class="tooltip2-wrap">
          <strong class="ti">S3 One Zone–IA</strong>
          {{ $t('optimization.s3OneZoneIaDesc') }}
          <strong class="ti2">{{ $t('optimization.exampleOfUse') }}</strong>
          {{ $t('optimization.s3OneZoneIaExample') }}
          <button class="close jsTooltipClose2">툴팁 닫기</button>
        </div>
        <!-- //tooltip -->
      </li>
      <li>
        <button class="jsTooltip2">
          <span class="img"><img src="@/assets/images/ico-s3-05.svg" alt="S3 Glacier Instant Retrieval" /></span>
          <span class="tit">S3 Glacier Instant <br />Retrieval</span>
        </button>
        <!-- tooltip -->
        <div class="tooltip2-wrap">
          <strong class="ti">S3 Glacier Instant Retrieval</strong>
          {{ $t('optimization.s3GlacierInstantRetrievalDesc') }}
          <strong class="ti2">{{ $t('optimization.exampleOfUse') }}</strong>
          {{ $t('optimization.s3GlacierInstantRetrievalExample') }}
          <button class="close jsTooltipClose2">툴팁 닫기</button>
        </div>
        <!-- //tooltip -->
      </li>
      <li>
        <button class="jsTooltip2">
          <span class="img"><img src="@/assets/images/ico-s3-06.svg" alt="S3 Glacier Flexible Retrieval" /></span>
          <span class="tit">S3 Glacier Flexible <br />Retrieval</span>
        </button>
        <!-- tooltip -->
        <div class="tooltip2-wrap">
          <strong class="ti">S3 Glacier Flexible Retrieval</strong>
          {{ $t('optimization.s3GlacierFlexibleRetrievalDesc') }}
          <strong class="ti2">{{ $t('optimization.exampleOfUse') }}</strong>
          {{ $t('optimization.s3GlacierFlexibleRetrievalExample') }}
          <button class="close jsTooltipClose2">툴팁 닫기</button>
        </div>
        <!-- //tooltip -->
      </li>
      <li>
        <button class="jsTooltip2">
          <span class="img"><img src="@/assets/images/ico-s3-07.svg" alt="S3 Glacier Deep Archive" /></span>
          <span class="tit">S3 Glacier Deep <br />Archive</span>
        </button>
        <!-- tooltip -->
        <div class="tooltip2-wrap">
          <strong class="ti">S3 Glacier Deep Archive</strong>
          {{ $t('optimization.s3GlacierDeepArchiveDesc') }}
          <strong class="ti2">{{ $t('optimization.exampleOfUse') }}</strong>
          {{ $t('optimization.s3GlacierDeepArchiveExample') }}
          <button class="close jsTooltipClose2">툴팁 닫기</button>
        </div>
        <!-- //tooltip -->
      </li>
    </ul>

    <div class="arrow-wrap">
      <span class="lt">{{ $t('optimization.highAccessHighCost') }}</span>
      <span class="rt">{{ $t('optimization.lowAccessLowCost') }}</span>
    </div>
    <ul class="list10-wrap">
      <li>{{ $t('optimization.sevenS3StorageClassSort') }}</li>
      <li>{{ $t('optimization.sevenS3StorageClassSortDesc1') }}</li>
      <li>{{ $t('optimization.sevenS3StorageClassSortDesc2') }}</li>
    </ul>

    <strong class="tit">{{ $t('optimization.s3CostOptiGuide') }}</strong>
    <ul class="list11-wrap">
      <li>
        <div class="img"><img src="@/assets/images/ico-s3-it.svg" alt="." /></div>
        <div class="txt">
          <strong class="ti">Intelligent-Tiering</strong>
          {{ $t('optimization.intelligentTieringDesc') }}
        </div>
      </li>
      <li>
        <div class="img"><img src="@/assets/images/ico-s3-life.svg" alt="수명주기 구성" /></div>
        <div class="txt">
          <strong class="ti">{{ $t('optimization.lifeCycleConfig') }}</strong>
          {{ $t('optimization.lifeCycleConfigDesc') }}
        </div>
      </li>
      <li>
        <div class="img"><img src="@/assets/images/ico-s3-optimum.svg" alt="스토리지 클래스 최적화" /></div>
        <div class="txt">
          <strong class="ti">{{ $t('optimization.optimizingStorageClasses') }}</strong>
          {{ $t('optimization.optimizingStorageClassesDesc') }}
        </div>
      </li>
    </ul>

    <div class="list12-wrap">
      <dl>
        <dt class="jsBtnToggle1 active">
          <!-- 활성화 : class="active" -->
          <button>Intelligent-Tiering</button>
        </dt>
        <dd>
          <p>{{ $t('optimization.intelligentTieringDesc') }}</p>
          <strong class="ti good"
            ><span>{{ $t('optimization.advantage') }}</span></strong
          >
          <ul class="list10-wrap">
            <li>{{ $t('optimization.intelligentTieringAdv1') }}</li>
            <li>{{ $t('optimization.intelligentTieringAdv2') }}</li>
            <li>{{ $t('optimization.intelligentTieringAdv3') }}</li>
          </ul>
          <strong class="ti bad"
            ><span>{{ $t('optimization.disadvantage') }}</span></strong
          >
          <ul class="list10-wrap">
            <li>{{ $t('optimization.intelligentTieringDisAdv') }}</li>
          </ul>
          <strong class="ti2">{{ $t('optimization.useCase') }}</strong>
          <p v-if="i18n().locale === 'ko'">
            {{ $t('optimization.intelligentTieringUseCaseExample') }}
            <br /><br />설정 방법을 알고 싶다면 <a :href="userGuideUrl1" target="_blank" class="ul">여기</a>를 누르세요.
          </p>
          <p v-if="i18n().locale === 'en'">
            {{ $t('optimization.intelligentTieringUseCaseExample') }}
            <br /><br />Click <a :href="userGuideUrl1" target="_blank" class="ul">here</a> if you want to know how to
            set it up.
          </p>
        </dd>
        <dt class="jsBtnToggle1">
          <button>{{ $t('optimization.lifecycleConfiguration') }}</button>
        </dt>
        <dd>
          <p>{{ $t('optimization.lifecycleConfigDesc') }}</p>
          <strong class="ti good"
            ><span>{{ $t('optimization.advantage') }}</span></strong
          >
          <ul class="list10-wrap">
            <li>{{ $t('optimization.lifecycleConfigAdv1') }}</li>
            <li>{{ $t('optimization.lifecycleConfigAdv2') }}</li>
          </ul>
          <strong class="ti bad"
            ><span>{{ $t('optimization.disadvantage') }}</span></strong
          >
          <ul class="list10-wrap">
            <li>{{ $t('optimization.lifecycleConfigDisadv1') }}</li>
            <li>{{ $t('optimization.lifecycleConfigDisadv2') }}</li>
          </ul>
          <strong class="ti2">{{ $t('optimization.useCase') }}</strong>
          <p v-if="i18n().locale === 'ko'">
            {{ $t('optimization.lifecycleConfigUseCaseExample') }}
            <br /><br />설정 방법을 알고 싶다면 <a :href="userGuideUrl2" target="_blank" class="ul">여기</a>를 누르세요.
          </p>
          <p v-if="i18n().locale === 'en'">
            {{ $t('optimization.lifecycleConfigUseCaseExample') }}
            <br /><br />Click <a :href="userGuideUrl2" target="_blank" class="ul">here</a> if you want to know how to
            set it up.
          </p>
        </dd>
        <dt class="jsBtnToggle1">
          <button>{{ $t('optimization.optimizingStorageClasses') }}</button>
        </dt>
        <dd>
          <p>{{ $t('optimization.optimizingStorageClassesDesc') }}</p>
          <strong class="ti good"
            ><span>{{ $t('optimization.advantage') }}</span></strong
          >
          <ul class="list10-wrap">
            <li>{{ $t('optimization.optimizingStorageClassesAdv1') }}</li>
            <li>{{ $t('optimization.optimizingStorageClassesAdv2') }}</li>
          </ul>
          <strong class="ti bad"
            ><span>{{ $t('optimization.disadvantage') }}</span></strong
          >
          <ul class="list10-wrap">
            <li>{{ $t('optimization.optimizingStorageClassesDisAdv1') }}</li>
            <li>{{ $t('optimization.optimizingStorageClassesDisAdv2') }}</li>
            <li>{{ $t('optimization.optimizingStorageClassesDisAdv3') }}</li>
          </ul>
          <strong class="ti2">{{ $t('optimization.useCase') }}</strong>
          <p v-if="i18n().locale === 'ko'">
            {{ $t('optimization.optimizingStorageClassesUseCaseExample1') }}
            <br />{{ $t('optimization.optimizingStorageClassesUseCaseExample2') }} <br /><br />설정 방법을 알고 싶다면
            <a :href="userGuideUrl3" target="_blank" class="ul">여기</a>를 누르세요.
          </p>
          <p v-if="i18n().locale === 'en'">
            {{ $t('optimization.optimizingStorageClassesUseCaseExample1') }}
            <br />{{ $t('optimization.optimizingStorageClassesUseCaseExample2') }}<br /><br />Click
            <a :href="userGuideUrl3" target="_blank" class="ul">here</a> if you want to know how to set it up.
          </p>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { getLocal } from '@/library/Common';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  methods: {
    i18n() {
      return i18n;
    },
  },
  data() {
    return {
      userGuideUrl1: getLocal('userInfo').userGuideUrl.replace(
        '/ccp/guide/home/dashboard',
        '/ccp/guide/optimization/resource/rightsizing/s3-intelligent-tiering'
      ),
      userGuideUrl2: getLocal('userInfo').userGuideUrl.replace(
        '/ccp/guide/home/dashboard',
        '/ccp/guide/optimization/resource/rightsizing/s3-lifecycle-configuration'
      ),
      userGuideUrl3: getLocal('userInfo').userGuideUrl.replace(
        '/ccp/guide/home/dashboard',
        '/ccp/guide/optimization/resource/rightsizing/s3-storage-class-optimization'
      ),
    };
  },
  mounted() {
    const btn1Toggles = document.querySelectorAll('.s3 .jsBtnToggle1');
    btn1Toggles.forEach((btn1Toggle) => {
      btn1Toggle.onclick = function () {
        if (this.classList.contains('active')) {
          this.classList.remove('active');
        } else {
          for (let i = 0; i < btn1Toggles.length; i++) {
            btn1Toggles[i].classList.remove('active');
          }
          this.classList.add('active');
          return false;
        }
      };
    });

    const tooltips2 = document.querySelectorAll('.s3 .tooltip2-wrap');
    const tooltip2Btns = document.querySelectorAll('.s3 .jsTooltip2');
    tooltip2Btns.forEach((tooltip2) => {
      tooltip2.onclick = function () {
        if (this.parentNode.classList.contains('active')) {
          this.parentNode.classList.remove('active');
        } else {
          for (let i = 0; i < tooltips2.length; i++) {
            tooltips2[i].parentNode.classList.remove('active');
          }
          this.parentNode.classList.add('active');
        }
      };
    });

    const tooltip2Closes = document.querySelectorAll('.s3 .jsTooltipClose2');
    tooltip2Closes.forEach((tooltip2Close) => {
      tooltip2Close.onclick = function () {
        this.parentNode.parentNode.classList.remove('active');
      };
    });
  },
};
</script>
