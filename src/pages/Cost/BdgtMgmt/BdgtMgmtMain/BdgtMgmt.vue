<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <main class="main">
      <div class="contents">
        <Section>
          <SectionNewHeader
            title-class="flex items-center py-5"
            :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
            :title="title"
            :title2="title"
            :main-icon="{ src: require('@/assets/images/ico-cost.svg') }"
          />
        </Section>
        <SectionMain v-if="currentScreen === 'main'">
          <!-- 예산 현황 -->
          <BdgtMgmtSituation :bdgt-list-data="bdgtListData" />
          <!-- 예산 목록 -->
          <BdgtMgmtList :bdgt-list-data="bdgtListData" @switch="switchScreen" />
        </SectionMain>
        <SectionMain v-if="currentScreen === 'create'">
          <BdgtMgmtCreate @switch="switchScreen" />
        </SectionMain>
        <SectionMain v-if="currentScreen === 'detail'">
          <BdgtMgmtDetail @switch="switchScreen" />
        </SectionMain>
      </div>
    </main>
  </div>
</template>

<script>
import Section, { SectionNewHeader, SectionMain, SectionLnb } from '@/components/Section';
import BdgtMgmtSituation from '@/pages/Cost/BdgtMgmt/BdgtMgmtMain/BdgtMgmtSituation.vue';
import BdgtMgmtList from '@/pages/Cost/BdgtMgmt/BdgtMgmtMain/BdgtMgmtList.vue';
import BdgtMgmtCreate from '@/pages/Cost/BdgtMgmt/BdgtMgmtCreate/BdgtMgmtCreate.vue';
import BdgtMgmtDetail from '@/pages/Cost/BdgtMgmt/BdgtMgmtDetail/BdgtMgmtDetail.vue';

export default {
  components: {
    BdgtMgmtDetail,
    BdgtMgmtCreate,
    SectionNewHeader,
    Section,
    SectionMain,
    SectionLnb,
    BdgtMgmtSituation,
    BdgtMgmtList,
  },
  data() {
    return {
      toggle: false,
      currentScreen: 'main',
      title: '예산관리',
      bdgtAlarmData: null,
      bdgtListData: null,
    };
  },
  computed: {
    // bdgtAlarmData: null,
    // bdgtListData: null,
  },
  created() {
    this.setData();
  },
  methods: {
    switchScreen(screen) {
      if (screen === 'main') {
        this.title = '예산관리';
      }
      if (screen === 'create') {
        this.title = '예산생성';
      }
      if (screen === 'detail') {
        this.title = '예산상세';
      }
      this.currentScreen = screen;
    },
    setData() {
      this.bdgtListData = [
        {
          ctrtId: 'CTRT0000000000', // 계약ID
          ctrtNm: 'SKT Public Cloud 공급계약', // 계약명
          bdgtProp: {
            // 예산속성
            bdgtId: '11111111-1111-1111-1111-111111111111', // 예산ID
            bdgtNm: 'Default Budget', // 예산명
            bdgtMgmtPerdTypNm: 'Monthly', // 예산관리주기유형명
            bdgtAmt: 18250000, // 예산금액
            bdgtAplyStrYm: '202401', // 예산적용시작년월
            bdgtAplyEndYm: '202412', // 예산적용종료년월
            bdgtRngSepNm: 'AI Service', // 예산범위구분명
            cmmtAmtAplyYn: 'Y', // 약정금액적용여부
            cmmtAmtTotTypNm: 'Actual', // 약정금액집계유형명
          },
          bdgtInfo: {
            // 예산정보
            bdgtStatNm: 'Active', // 예산상태명
            stdDt: '20240101', // 기준일자
            unblendCost: 18250000, // UnBlended비용
            fcstCost: 18250000, // 예측비용
          },
          bdgtRng: {
            // 예산범위
            acntId: [], // 계정ID
            cspPrdtCd: [
              // CSP상품코드
              'AmazonEC2',
              'AmazonSageMaker',
            ],
            regionSepCd: [], // 리전구분코드
            instsTypNm: [
              // 인스턴스유형명
              'g4dn.xlarge',
              'g4dn.2xlarge',
              'ml.p5.48xlarge',
            ],
            tagKeyFltVal: null, // 태그키필터값
            tagVal: [], // 태그값
          },
          bdgtCurstat: {
            // 예산현황
            bdgtYearly: {
              // 연간예산
              bdgtAmt: 219000000, // 예산금액
              unblendCost: 219000000, // UnBlended비용
              fcstCost: 219000000, // 예측비용
            },
            bdgtMonthly: {
              // 월간예산
              bdgtAmt: 18250000, // 예산금액
              unblendCost: 18250000, // UnBlended비용
              fcstCost: 18250000, // 예측비용
            },
            bdgtDaily: {
              // 일간예산
              bdgtAmt: 600000, // 예산금액
              unblendCost: 219000000, // UnBlended비용
              costHist: [
                // 비용이력
                {
                  useDt: '20231231', // 사용일자
                  unblendCost: 600000, // UnBlended비용
                },
                {
                  useDt: '20240101', // 사용일자
                  unblendCost: 600000, // UnBlended비용
                },
              ],
            },
          },
          bdgtUseDts: [
            // 예산사용내역
            {
              useDt: '202312', // 사용일자
              unblendCost: 18250000, // UnBlended비용
            },
            {
              useDt: '202401', // 사용일자
              unblendCost: 18250000, // UnBlended비용
            },
          ],
          bdgtThrs: [
            // 예산임계
            {
              bdgtThrsSerno: 1, // 예산임계일련번호
              bdgtThrsAmtTypNm: 'Actual', // 예산임계금액유형명
              bdgtThrsUnitTypNm: 'Relative', // 예산임계단위유형명
              thrsVal: 85, // 임계값
              thrsExcsDt: null, // 임계초과일자
              thrsStatNm: 'OK', // 임계상태명
            },
            {
              bdgtThrsSerno: 2, // 예산임계일련번호
              bdgtThrsAmtTypNm: 'Forecasted', // 예산임계금액유형명
              bdgtThrsUnitTypNm: 'Relative', // 예산임계단위유형명
              thrsVal: 100, // 임계값
              thrsExcsDt: null, // 임계초과일자
              thrsStatNm: 'OK', // 임계상태명
            },
            {
              bdgtThrsSerno: 3, // 예산임계일련번호
              bdgtThrsAmtTypNm: 'Actual', // 예산임계금액유형명
              bdgtThrsUnitTypNm: 'Absolute', // 예산임계단위유형명
              thrsVal: 500, // 임계값
              thrsExcsDt: '20240101', // 임계초과일자
              thrsStatNm: 'Exceeded', // 임계상태명
            },
          ],
          bdgtAlar: [
            // 예산알림
            'dongjoon.kim@bespinglobal.com',
            'hyunmin.park@bespinglobal.com',
          ],
          bdgtRecmActn: [
            // 예산권장조치사항
            {
              acntId: '000000000000', // 계정ID
              acntNm: 'SKT-CloudRadar', // 계정명
              svcCd: 'load-balancers', // 서비스코드
              svcNm: 'ELB', // 서비스명
              regionSepCd: 'ap-northeast-2', // 리전구분코드
              regionSepNm: 'Asia Pacific (Seoul)', // 리전구분명
              optiTypNm: 'ResourceOptimization', // 최적화유형명
              recmTypNm: 'UnusedResource', // 추천유형명
            },
            {
              acntId: '000000000000', // 계정ID
              acntNm: 'SKT-CloudRadar', // 계정명
              svcCd: 'ComputeSavingsPlans', // 서비스코드
              svcNm: 'Compute', // 서비스명
              regionSepCd: 'global', // 리전구분코드
              regionSepNm: 'Global', // 리전구분명
              optiTypNm: 'CommitmentOptimization', // 최적화유형명
              recmTypNm: 'SavingsPlans', // 추천유형명
            },
          ],
          reprsBdgtYn: 'Y', // 대표예산여부
        },
      ];
      // this.rowData = [
      //   {
      //     ctrtNm: '베스핀글로벌 Cloud Infra 공급계약',
      //     bdgtNm: 'Default Budget',
      //     bdgtThrs: '초과 (3개)',
      //     bdgtAmt: '₩130,471,750',
      //     bdgtUse: '₩130,471,750',
      //     fcstCost: '₩150,042,513',
      //     bdgtUsageRate: 101.2,
      //     bdgtPredictedUsageRate: 115.5,
      //     bdgtRngSepNm: '전체',
      //     bdgtMgmtPerdTypNm: '월별', // 주기
      //     bdgtPeriod: '2024.01~2026.12', // 예산 기간
      //     bdgtStatNm: '활성화', // 상태
      //   },
      //   {
      //     ctrtNm: '베스핀글로벌 Cloud Infra 공급계약',
      //     bdgtNm: 'Default Budget',
      //     bdgtThrs: '초과 (3개)',
      //     bdgtAmt: '₩130,471,750',
      //     bdgtUse: '₩130,471,750',
      //     fcstCost: '₩150,042,513',
      //     bdgtUsageRate: 74.2,
      //     bdgtPredictedUsageRate: 80,
      //     bdgtRngSepNm: '전체',
      //     bdgtMgmtPerdTypNm: '월별', // 주기
      //     bdgtPeriod: '2024.01~2026.12', // 예산 기간
      //     bdgtStatNm: '활성화', // 상태
      //   },
      // ];
    },
  },
};
</script>
<style src="@/assets/jhstyle.css"></style>
