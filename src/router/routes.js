import Dashboard from '@/pages/Dashboard';
import TotalDashboard from '@/pages/TotalDashboard';
import MainPage from '@/pages/Main';
import Analysis, { FraudDetection, PatternAnalysis, UsageHistory } from '@/pages/Analysis';
// import Bill from '@/pages/Bill';
import Opti, {
  CmmtAbout,
  CmmtDashboard,
  CmmtPsblTgt,
  Main,
  CmmtCurStat,
  UnusedResource,
  ResourceOptiSumm,
  ResourceRightSizing,
  CostOptiTA,
} from '@/pages/Opti';
import BillRouter, { Bill, BillReport } from '@/pages/Bill';
import Contract from '@/pages/Contract';
import Cost, { BillInfo, BillRpt, CostEx, CostPattern, AnomalCostDetect, CtrtInfo, History, BdgtMgmt, BdgtMgmtCreate, BdgtMgmtDetail } from '@/pages/Cost';
import Rsrc, { Usag, Performance } from '@/pages/Rsrc';
import Support, { NoticeList, NoticeDetail, FaqList, FaqDetail, QnaList, QnaDetail, QnaForm } from '@/pages/Support';
import Setting, {
  CloudAuthMgmt,
  AwsAcctCreate,
  AwsAcctDelete,
  AzureAcctCreate,
  AzureAcctUpdate,
  AzureAcctDelete,
  SvcGrpMgmt,
  Notification,
} from '@/pages/Setting';
import NotFound from '@/pages/404NotFound.vue';
import Advisor, {
  SpotRecommend,
  SpotStatus,
  SpotRateCheck,
  SpotGPU,
  SchedulingRecommend,
  SchedulingRecommendGPU,
} from '@/pages/Advisor';
import { getLocal } from '@/library/Common';

const mainUrl = getLocal('userInfo') ? getLocal('userInfo').redirectRoute : '/dashboard/total';
const mainRedirectUrl = getLocal('userInfo').redirectRoute === '/dashboard/total' ? 'total' : 'basic';
export default [
  {
    path: '/',
    name: 'Index',
    redirect: mainUrl,
  },
  {
    path: '/advisor',
    name: 'Advisor',
    meta: { title: 'Advisor' },
    component: Advisor,
    expose: true,
    children: [
      {
        path: '',
        redirect: 'spot',
      },
      {
        path: 'spot',
        name: 'Spot 추천',
        meta: { title: 'Spot 추천' },
        component: SpotStatus,
        expose: true,
        children: [
          {
            path: '',
            redirect: 'status',
          },
        ],
      },
      {
        path: 'spot/recommend',
        name: 'spotRecommend',
        meta: { title: 'Spot 추천' },
        component: SpotRecommend,
        expose: false,
      },
      {
        path: 'spot/status',
        name: 'spotStatus',
        meta: { title: 'Spot 사용현황' },
        component: SpotStatus,
        expose: false,
      },
      {
        path: 'spot/rate',
        name: 'spotRateCheck',
        meta: { title: 'Spot 요금조회' },
        component: SpotRateCheck,
        expose: false,
      },
      {
        path: 'spot/gpuSpot',
        name: 'gpuSpot',
        meta: { title: 'GPU Spot' },
        component: SpotGPU,
        expose: false,
      },
      // 'Advisor > 자원 스케줄링' 하위 메뉴 구성
      {
        path: 'schedule',
        name: '자원 스케줄링',
        meta: { title: '자원 스케줄링' },
        component: SchedulingRecommend,
        expose: true,
        children: [
          {
            path: '',
            redirect: 'recommend',
          },
        ],
      },
      {
        path: 'schedule/recommend',
        name: '스케줄링 추천',
        meta: { title: '스케줄링 추천' },
        component: SchedulingRecommend,
        expose: false,
      },
      {
        path: 'schedule/gpuRecommend',
        name: 'GPU 스케줄링 추천',
        meta: { title: 'GPU 스케줄링 추천' },
        component: SchedulingRecommendGPU,
        expose: false,
      },
    ],
  },
  {
    path: '/dashboard',
    name: '대시보드',
    component: MainPage,
    meta: { title: '대시보드' },
    expose: true,
    children: [
      {
        path: '',
        redirect: mainRedirectUrl,
      },
      {
        path: 'total',
        name: '통합대시보드',
        meta: { title: '대시보드' },
        component: TotalDashboard,
        expose: true,
      },
      {
        path: 'basic',
        name: '대시보드',
        meta: { title: '대시보드' },
        component: Dashboard,
        expose: true,
      },
    ],
  },
  {
    path: '/cost',
    name: '비용',
    component: Cost,
    meta: { title: '비용' },
    expose: true,
    children: [
      {
        path: '',
        redirect: 'explorer',
      },
      {
        path: 'billInfo',
        name: '청구정보',
        meta: { title: '청구정보' },
        component: BillInfo,
        expose: true,
      },
      {
        path: 'billRpt',
        name: '청구리포트',
        meta: { title: '청구리포트' },
        component: BillReport,
        expose: true,
      },
      {
        path: 'explorer',
        name: 'Cost Explorer',
        meta: { title: 'Cost Explorer' },
        component: CostEx,
        expose: true,
      },
      {
        path: 'history',
        name: '사용내역분석',
        meta: { title: '사용내역분석' },
        component: History,
        expose: true,
      },
      {
        path: 'pattern',
        name: '비용패턴분석',
        meta: { title: '비용패턴분석' },
        component: CostPattern,
        expose: true,
      },
      {
        path: 'detection',
        name: '이상비용탐지',
        meta: { title: '이상비용탐지' },
        component: AnomalCostDetect,
        expose: true,
      },
      {
        path: 'bdgtMgmt',
        name: '예산관리',
        meta: { title: '예산관리' },
        component: BdgtMgmt,
        expose: true,
      },
      {
        path: 'bdgtMgmt/create',
        name: '예산생성',
        meta: { title: '예산생성' },
        component: BdgtMgmtCreate,
        expose: false,
      },
      {
        path: 'bdgtMgmt/detail',
        name: '예산상세',
        meta: { title: '예산상세' },
        component: BdgtMgmtDetail,
        expose: false,
      },
      {
        path: 'ctrtInfo',
        name: '계약정보',
        meta: { title: '계약정보' },
        component: CtrtInfo,
        expose: true,
      },
    ],
  },
  {
    path: '/resource',
    name: '자원',
    component: Rsrc,
    meta: { title: '자원' },
    expose: true,
    children: [
      {
        path: '',
        redirect: 'usag',
      },
      {
        path: 'usag',
        name: '사용량',
        meta: { title: '사용량' },
        component: Usag,
        expose: true,
      },
      {
        path: 'performance',
        name: '성능',
        meta: { title: '성능' },
        component: Performance,
        expose: true,
      },
    ],
  },
  {
    path: '/opti',
    name: '최적화',
    meta: { title: '최적화' },
    component: Opti,
    expose: true,
    children: [
      {
        path: '',
        redirect: 'cost',
      },
      // SubMenu : 자원비용최적화
      {
        path: 'resource',
        name: '자원최적화',
        component: ResourceOptiSumm,
        meta: { title: '자원최적화' },
        expose: true,
        children: [
          {
            path: '',
            redirect: 'summary',
          },
        ],
      },
      {
        path: 'resource/summary',
        name: '자원대시보드',
        component: ResourceOptiSumm,
        meta: { title: '자원대시보드' },
        expose: false,
      },
      {
        path: 'resource/unused',
        name: '미사용자원',
        component: UnusedResource,
        meta: { title: '미사용자원' },
        expose: false,
      },
      {
        path: 'resource/rightsizing',
        name: 'Rightsizing',
        component: ResourceRightSizing,
        meta: { title: 'Rightsizing' },
        expose: false,
      },
      // SubMenu : 구매비용최적화
      {
        path: 'cost',
        name: '약정최적화',
        component: CmmtDashboard,
        meta: { title: '약정최적화' },
        expose: true,
        children: [
          {
            path: '',
            redirect: 'dashboard',
          },
        ],
      },
      {
        path: 'cost/dashboard',
        name: '약정대시보드',
        component: CmmtDashboard,
        meta: { title: '약정대시보드' },
        expose: false,
      },
      {
        path: 'cost/tgt',
        name: '약정가능대상',
        component: CmmtPsblTgt,
        meta: { title: '약정가능대상' },
        expose: false,
      },
      {
        path: 'cost/status',
        name: '약정현황',
        component: CmmtCurStat,
        meta: { title: '약정현황' },
        expose: false,
      },
      {
        path: 'cost/recommend',
        name: '약정추천',
        component: Main,
        meta: { title: '약정추천' },
        expose: false,
      },
      {
        path: 'cost/info',
        name: '약정서비스소개',
        component: CmmtAbout,
        meta: { title: '약정서비스소개' },
        expose: false,
      },
      // Trusted Advisor
      {
        path: 'ta',
        name: 'Trusted Advisor',
        component: CostOptiTA,
        meta: { title: 'Trusted Advisor' },
        expose: true,
        children: [
          {
            path: '',
            redirect: 'cost',
          },
        ],
      },
      {
        path: 'ta/cost',
        name: '비용최적화',
        component: CostOptiTA,
        meta: { title: '비용최적화' },
        expose: false,
      },
    ],
  },
  {
    path: '/bill',
    name: '청구정보',
    meta: { title: '청구정보' },
    component: BillRouter,
    expose: false,
    children: [
      {
        path: '',
        redirect: 'info',
      },
      {
        path: 'info',
        name: '청구정보',
        component: Bill,
        meta: { title: '청구정보' },
        expose: true,
      },
      {
        path: 'report',
        name: '청구리포트',
        component: BillReport,
        meta: { title: '청구리포트' },
        expose: true,
      },
    ],
  },
  {
    path: '/analysis',
    name: '사용분석',
    component: Analysis,
    meta: { title: '사용분석' },
    expose: false,
    children: [
      {
        path: '',
        redirect: 'usage-history',
      },
      {
        path: 'usage-history',
        name: '사용내역',
        component: UsageHistory,
        meta: { title: '사용내역' },
        expose: true,
      },
      {
        path: 'pattern-analysis',
        name: '비용 패턴 분석',
        component: PatternAnalysis,
        meta: { title: '비용 패턴 분석' },
        expose: true,
      },
      {
        path: 'fraud-detection',
        name: '이상 비용 탐지',
        component: FraudDetection,
        meta: { title: '이상 비용 탐지' },
        expose: true,
      },
    ],
  },
  {
    path: '/contract',
    name: '계약정보',
    component: Contract,
    meta: { title: '계약정보' },
    expose: false,
  },
  {
    path: '/support',
    name: '고객지원',
    component: Support,
    meta: { title: '고객지원' },
    expose: true,
    children: [
      {
        path: '',
        redirect: 'notice',
      },
      {
        path: 'notice',
        name: '공지사항',
        component: NoticeList,
        meta: { title: '공지사항' },
        props: (route) => ({
          query: route.query.q,
          page: route.query.page,
        }),
        expose: true,
      },
      {
        path: 'notice/:id',
        name: '공지사항 상세',
        component: NoticeDetail,
        meta: { title: '공지사항 상세', subYn: true },
        subExpose: false,
      },
      {
        path: 'faq',
        name: '자주묻는 질문들',
        component: FaqList,
        meta: { title: '자주묻는 질문들' },
        props: (route) => ({
          category: route.query.bbmSepCd,
          query: route.query.q,
          page: route.query.page,
        }),
        expose: true,
      },
      {
        path: 'faq/:id',
        name: '자주묻는 질문들 상세',
        component: FaqDetail,
        meta: { title: '자주묻는 질문들 상세', subYn: true },
        subExpose: false,
      },
      // TODO: 개발 완료 후 다시 추가 예정
      // {
      //   path: 'qna',
      //   name: '1:1문의',
      //   component: QnaList,
      //   meta: { title: '1:1문의' },
      //   expose: true,
      // },
      {
        path: 'qna/form',
        name: '1:1문의 등록',
        component: QnaForm,
        meta: { title: '1:1문의 등록', subYn: true },
        subExpose: false,
      },
      {
        path: 'qna/:id',
        name: '1:1문의 상세',
        component: QnaDetail,
        meta: { title: '1:1문의 상세', subYn: true },
        subExpose: false,
      },
    ],
  },
  {
    path: '/setting',
    name: '설정',
    component: Setting,
    meta: { title: '설정' },
    expose: false,
    children: [
      {
        path: '',
        redirect: '/svcGrpMgmt',
      },
      {
        path: 'svcGrpMgmt',
        name: '서비스그룹관리',
        component: SvcGrpMgmt,
        meta: { title: '서비스그룹관리' },
        expose: true,
      },
      {
        path: 'cloudAuthMgmt',
        name: 'Cloud 계정 연동',
        component: CloudAuthMgmt,
        meta: { title: 'Cloud 계정 연동' },
        expose: true,
      },
      {
        path: 'awsAcctCreate',
        name: 'AWS 계정등록',
        component: AwsAcctCreate,
        meta: { title: 'AWS 계정등록', subYn: true },
      },
      {
        path: 'awsAcctDelete',
        name: 'AWS 계정삭제',
        component: AwsAcctDelete,
        meta: { title: 'AWS 계정삭제', subYn: true },
      },
      {
        path: 'azureAcctCreate',
        name: 'Azure 애플리케이션 등록',
        component: AzureAcctCreate,
        meta: { title: 'Azure 애플리케이션 등록', subYn: true },
      },
      {
        path: 'azureAcctUpdate',
        name: 'Azure 애플리케이션 수정',
        component: AzureAcctUpdate,
        meta: { title: 'Azure 애플리케이션 수정', subYn: true },
      },
      {
        path: 'azureAcctDelete',
        name: 'Azure 애플리케이션 삭제',
        component: AzureAcctDelete,
        meta: { title: 'Azure 애플리케이션 삭제', subYn: true },
      },
      {
        path: 'notification',
        name: '알림설정',
        component: Notification,
        meta: { title: '알림설정' },
        expose: true,
      },
    ],
  },
  {
    path: '404',
    name: '404 Not Found',
    component: NotFound,
    meta: { title: '404 Not Found', suppressHeader: true, suppressFooter: true, suppressFabs: { faq: true } },
  },
  {
    path: '*',
    redirect: { name: '404 Not Found' },
  },
];
