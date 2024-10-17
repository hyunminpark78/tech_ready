import Dashboard from '@/pages/Dashboard';
import TotalDashboard from '@/pages/TotalDashboard';
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
import Cost, { BillInfo, BillRpt, CostEx, CostPattern, AnomalCostDetect, BdgtMgmt, BdgtMgmtCreate, BdgtMgmtDetail, CtrtInfo, History } from '@/pages/Cost';
import Rsrc, { Usag, Performance } from '@/pages/Rsrc';
import Support, { NoticeList, NoticeDetail, FaqList, FaqDetail, QnaList, QnaDetail, QnaForm } from '@/pages/Support';
import Setting, { SvcGrpMgmt, CloudAuthMgmt, Notification } from '@/pages/Setting';
import NotFound from '@/pages/404NotFound.vue';
import MainPage from '@/pages/Main';

const COMPONENT = {
  DASHBOARD: MainPage,
  DASHBOARD_TOTAL: TotalDashboard,
  DASHBOARD_BASIC: Dashboard,
  COST: Cost,
  COST_BILLINFO: BillInfo,
  COST_BILLRPT: BillReport,
  COST_EXPLORER: CostEx,
  COST_HISTORY: History,
  COST_PATTERN: CostPattern,
  COST_DETECTION: AnomalCostDetect,
  COST_BDGTMGMT: BdgtMgmt,
  COST_BDGTMGMT_CREATE: BdgtMgmtCreate,
  COST_BDGTMGMT_DETAIL: BdgtMgmtDetail,
  COST_CTRTINFO: CtrtInfo,
  RESOURCE: Rsrc,
  RESOURCE_USAG: Usag,
  RESOURCE_PERFORMANCE: Performance,
  OPTI: Opti,
  OPTI_RESOURCE: ResourceOptiSumm,
  OPTI_RESOURCE_SUMMARY: ResourceOptiSumm,
  OPTI_RESOURCE_UNUSED: UnusedResource,
  OPTI_RESOURCE_RIGHTSIZING: ResourceRightSizing,
  OPTI_COST: CmmtDashboard,
  OPTI_COST_DASHBOARD: CmmtDashboard,
  OPTI_COST_TGT: CmmtPsblTgt,
  OPTI_COST_STATUS: CmmtCurStat,
  OPTI_COST_RECOMMEND: Main,
  OPTI_COST_INFO: CmmtAbout,
  OPTI_TA: CostOptiTA,
  OPTI_TA_COST: CostOptiTA,
  SUPPORT: Support,
  SUPPORT_NOTICE: NoticeList,
  SUPPORT_FAQ: FaqList,
  SUPPORT_QNA: QnaList,
  SETTING: Setting,
  SETTING_SVCGRPMGMT: SvcGrpMgmt,
  SETTING_CLOUDAUTHMGMT: CloudAuthMgmt,
  SETTING_NOTICIATION: Notification,
};

const EXPOSE = {
  DASHBOARD: true,
  DASHBOARD_TOTAL: true,
  DASHBOARD_BASIC: true,
  COST: true,
  COST_BILLINFO: true,
  COST_BILLRPT: true,
  COST_EXPLORER: true,
  COST_HISTORY: true,
  COST_PATTERN: true,
  COST_DETECTION: true,
  COST_BDGTMGMT: true,
  COST_BDGTMGMT_CREATE: false,
  COST_BDGTMGMT_DETAIL: false,
  COST_CTRTINFO: true,
  RESOURCE: true,
  RESOURCE_USAG: true,
  RESOURCE_PERFORMANCE: true,
  OPTI: true,
  OPTI_RESOURCE: true,
  OPTI_RESOURCE_SUMMARY: false,
  OPTI_RESOURCE_UNUSED: false,
  OPTI_RESOURCE_RIGHTSIZING: false,
  OPTI_COST: true,
  OPTI_COST_DASHBOARD: false,
  OPTI_COST_TGT: false,
  OPTI_COST_STATUS: false,
  OPTI_COST_RECOMMEND: false,
  OPTI_COST_INFO: false,
  OPTI_TA: true,
  OPTI_TA_COST: false,
  SUPPORT: true,
  SUPPORT_NOTICE: true,
  SUPPORT_FAQ: true,
  SUPPORT_QNA: true,
  SETTING: false,
  SETTING_SVCGRPMGMT: true,
  SETTING_CLOUDAUTHMGMT: true,
  SETTING_NOTIFICATION: true,
  ADVISOR: true,
  ADVISOR_SPOT: true,
  ADVISOR_SCHEDULE: true,
};

const REDIRECT = {
  DASHBOARD: 'TotalDashboard',
  COST: 'explorer',
  RESOURCE: 'usag',
  OPTI: 'cost',
  SUPPORT: 'notice',
  SETTING: 'svcGrpMgmt',
  OPTI_COST: 'dashboard',
  OPTI_RESOURCE: 'summary',
  OPTI_TA: 'cost',
};

const ROLE = {
  ALL: 'ROLE0000190001',
  NEW: 'ROLE0000190002',
  NO_OPTI: 'ROLE0000190003',
  NO_RSRC: 'ROLE0000190004',
  OLD: 'ROLE0000190005',
};

// 팝업으로 안띄울리면 항목 삭제
const DIRECTPOPUP = {
  SUPPORT_QNA: true,
};

export default Object.freeze({
  COMPONENT,
  EXPOSE,
  REDIRECT,
  ROLE,
  DIRECTPOPUP,
});
