<template>
  <div class="contents">
    <!-- intro -->
    <div class="intro-wrap">
      <!-- title -->
      <div class="title">
        <div class="cell">
          <h3 class="tit"><span>클라우드 약정 최적화 서비스</span></h3>
          <p class="info">클라우드 서비스의 약정 정보를 한 화면에서 쉽고 편하게 모니터링해 보세요.</p>
        </div>
      </div>
      <!-- //title -->
      <!-- con1 -->
      <div class="con1">
        <div class="conBg">
          <div class="tit">
            온디맨드 대비 <strong>최대 72%의 할인율을 제공</strong>하는 약정 구매는 <br />클라우드 비용 절감 전략의 필수
            요소입니다.
          </div>
          <div class="txt">
            클라우드 서비스는 다양한 요금체계를 제시합니다.
            <br />예를 들면, 서비스를 사용한 만큼의 비용을 지불하는 온디맨드(On-Demand) 요금제와 <br />일정한 사용 기간
            및 제품 범위를 약정하고 할인된 금액을 지불하는 약정 요금제가 있습니다.

            <br /><br />클라우드 서비스를 비교적 일정하고 예상할 수 있는 규모로 지속해서 사용하는 경우, <br />대표적인
            약정 요금제 방법인 <strong>Savings Plans(SP)</strong>와 <strong>Reserved Instances(RI)</strong>를 이용하여
            클라우드 사용 비용을 최적화할 수 있습니다.
          </div>
          <!-- TODO: STG 기준 하드코딩 -->
          <div class="button-wrap">
            <a :href="`/support/faq/${spFaqId}`" class="btn l w320"
              ><img src="@/assets/images/ico-info-sp.png" alt="SP" />SAVINGS PLANS</a
            >
            <a :href="`/support/faq/${riFaqId}`" class="btn l w320 green"
              ><img src="@/assets/images/ico-info-ri.png" alt="RI" />RESERVED INSTANCES</a
            >
          </div>
        </div>
      </div>
      <!-- //con1 -->
      <!-- con2 -->
      <div class="con2">
        <div class="conBg">
          <div class="titl"><strong>약정 최적화 서비스</strong></div>
          <div class="txt">
            <br />Radar에서는 약정 최적화 서비스를 통해 SP/RI를 효과적으로 사용 및 관리할 수 있도록 <br />아래와 같이
            다양한 관리 기능과 화면을 제공하고 있습니다.
          </div>
        </div>
      </div>
      <!-- //con2 -->
      <!-- con3 -->
      <div class="con3">
        <div class="conBg">
          <div class="titl"><strong>주요 기능</strong></div>
          <div class="lst">
            <div class="col i1">
              <a href="/opti/cost/dashboard"
                ><img src="@/assets/images/img-intro04-1.png" alt="RI" />
                <strong class="ti">약정대시보드</strong>
                <p class="tx">클라우드 서비스 약정 정보를 한 화면에 <br />요약하여 제공합니다.</p></a
              >
            </div>
            <div class="col i2">
              <a href="/opti/cost/tgt"
                ><img src="@/assets/images/img-intro04-2.png" alt="RI" />
                <strong class="ti">약정가능대상</strong>
                <p class="tx">현재 온디맨드 사용 비용 기반으로 약정 <br />적용이 가능한 대상 정보를 제공합니다.</p></a
              >
            </div>
            <div class="col i3">
              <a href="/opti/cost/status"
                ><img src="@/assets/images/img-intro04-3.png" alt="RI" />
                <strong class="ti">약정현황</strong>
                <p class="tx">
                  현재 구매하여 사용 중인 사용률, 커버리지, <br />인벤토리뿐만 아니라 사용률 및 커버리지 <br />변화 추이
                  정보를 제공합니다.
                </p></a
              >
            </div>
            <div class="col i4">
              <a href="/opti/cost/recommend"
                ><img src="@/assets/images/img-intro04-4.png" alt="RI" />
                <strong class="ti">약정추천</strong>
                <p class="tx">
                  온디맨드 요금으로 리소스를 사용하고 <br />있거나 추가 약정 구매를 돕기 위해 <br />옵션별 시뮬레이션
                  정보를 제공합니다.
                </p></a
              >
            </div>
          </div>
          <div class="img">
            <img src="@/assets/images/img-db.png" alt="약정대상현황, 약정사용현황, 약정추천" />
          </div>
        </div>
      </div>
      <!-- //con3 -->
      <!-- con4 -->
      <div class="con4">
        <div class="conBg">
          <div class="titl"><strong>서비스 흐름도</strong></div>
          <div class="img">
            <img
              src="@/assets/images/img-intro05.png"
              alt="SKT AI Cloud Management Platform(온디맨드 사용 비용 및 약정 추천 분석), Cloud Radar(약정대상 정보 -> 약정사용 현황정보 -> 약정추천 및 절감정보 -> 약정 옵션 별 시뮬레이션) <-> 구매 및 비용 절감 효과 모니터링"
            />
          </div>
        </div>
      </div>
      <!-- //con4 -->
      <!-- con5 -->
      <div class="con5">
        <div class="conBg">
          <div class="titl"><strong>약정 최적화 가이드</strong></div>
          <div class="txt">
            <br />약정 요금제를 사용하여 클라우드 사용 비용을 최적화하기 위해서는 시스템의 사용 서비스와 사용량,
            <br />그리고 사용 패턴에 따라서 적절한 약정 요금제를 구매/사용하는 것이 매우 중요합니다.
            <br />이처럼, 시스템 및 서비스의 특성에 맞는 약정을 찾고 효과적으로 구매 및 사용하기 위해서 지속적인 관리 활동이 필요합니다.

            <br /><br />관리 활동의 주요 3가지는
            <strong>1)약정 가능 대상에 대한 분석, 2) 약정 현황 분석, 3) 약정 추천 검토 및 구매</strong> 입니다.

            <br /><br />이러한 활동을 지속적이고 반복적으로 실행해서 최적의 약정 상태를 적용하고 유지, 관리 할 수 있습니다.
            <br />Cloud Radar에서는 이러한 활동을 지원하기 위해서 아래와 같은 약정 관련 메뉴와 가이드를 제공하고
            있습니다.
          </div>
          <div class="img type2">
            <div class="w591">
              <img src="@/assets/images/img-intro06.png" alt="약정 가능 대상 분석, 약정 현황 분석, 추천 검토 및 구매" />

              <button class="bt pos1 jsBtnShow2">약정 가능 대상 분석</button>
              <!-- layer -->
              <div class="layer2-wrap pos1">
                <strong class="ti">약정 가능 대상 분석</strong>
                <p class="tx">
                  현재 사용중인 클라우드 서비스 중에서 약정이 가능한 서비스를 얼마나 어떻게 사용하고 있는지 분석해
                  보세요. 약정을 통해 비용을 절약할 수 있음에도 불구하고 놓치고 있는 부분이 없는지 꼼꼼히 검토해 보실 수
                  있습니다. 조회 조건을 바꾸어가면서 약정이 필요한 서비스를 찾아 볼 수 있습니다. 보통의 경우
                  <em>약정 커버리지는 80% 유지 권장</em> 드립니다.
                </p>
                <button class="close jsBtnClose3">레이어 닫기</button>
              </div>
              <!-- //layer -->

              <button class="bt pos2 jsBtnShow2">약정 현황 분석</button>
              <!-- layer -->
              <div class="layer2-wrap pos2">
                <strong class="ti">약정 현황 분석</strong>
                <p class="tx">
                  약정 현황 메뉴를 통해 약정이 적용된 효과와 트렌드를 분석해 보세요. 구매한 약정의 상세 내용과 약정을
                  통한 절감 현황, 약정 사용률, 약정 커버리지 등 상세 내역을 조회할 수 있습니다. 이를 통해서 약정을
                  효과적으로 사용하고 있는지 확인할 수 있고 자원의 효율적인 사용 계획을 세우거나 추가 약정 구매 등의
                  활동을 고려해 볼 수 있습니다.
                </p>
                <button class="close jsBtnClose3">레이어 닫기</button>
              </div>
              <!-- //layer -->

              <button class="bt pos3 jsBtnShow2">추천 검토 및 구매</button>
              <!-- layer -->
              <div class="layer2-wrap pos3">
                <strong class="ti">약정 추천 검토 및 구매</strong>
                <p class="tx">
                  약정 추천 메뉴에서는 고객의 사용 서비스 및 사용 데이터를 기반으로 최적의 약정을 추천합니다. 약정 유형,
                  분석기간, 약정 옵션 등의 조건을 변경해가면서 해당하는 약정 종류와 월/예상 절감액, 예상 총 커버리지
                  등을 확인해 볼 수 있습니다.
                  <br />추천된 약정의 구매를 위해서는 CSP의 관리 콘솔에서 직접 신청하거나, Radar의 1:1문의 또는 SKT
                  담당자의 도움을 받아서 상세한 내용을 확인하고 구매할 수 있습니다.
                </p>
                <button class="close jsBtnClose3">레이어 닫기</button>
              </div>
              <!-- //layer -->
            </div>
          </div>
        </div>
      </div>
      <!-- //con5 -->
    </div>
    <!-- //intro -->
  </div>
</template>

<script>
import { getBuildEnv } from '@/library/Common';
export default {
  data() {
    return {
      server: getBuildEnv(),
    };
  },
  computed: {
    spFaqId() {
      if (this.server === 'prd') {
        return 'BBM0000001014';
      } else {
        return 'BBM0000001085';
      }
    },
    riFaqId() {
      if (this.server === 'prd') {
        return 'BBM0000001015';
      } else {
        return 'BBM0000001086';
      }
    },
  },
  mounted() {
    const btn3Closes = document.querySelectorAll('.jsBtnClose3');
    btn3Closes.forEach((btn3Close) => {
      btn3Close.onclick = function () {
        this.parentNode.classList.remove('active');
      };
    });
    const btn2Shows = document.querySelectorAll('.jsBtnShow2');
    btn2Shows.forEach((btn2Show) => {
      btn2Show.onclick = function () {
        if (this.nextElementSibling.classList.contains('active')) {
          this.nextElementSibling.classList.remove('active');
        } else {
          for (let i = 0; i < btn2Shows.length; i++) {
            btn2Shows[i].nextElementSibling.classList.remove('active');
          }
          this.nextElementSibling.classList.add('active');
          return false;
        }
      };
    });
  },
};
</script>

<style scoped>
.contents {
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: 0 !important;
}
</style>
