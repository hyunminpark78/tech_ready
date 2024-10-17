<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div class="box-wrap type2 mb-4" style="min-height: 251.83px">
      <div class="title flex flex-between align-center">
        <h4 class="tit-wrap">
          <span>{{ $t('optimization.contractPurchaseStatus') }}</span>
          <div class="tooltip-wrap">
            <button class="ico jsTooltip1"><span>툴팁 열기</span></button>
            <div class="tooltip-layer">
              <strong class="ti">{{ $t('optimization.contractPurchaseStatus') }}</strong>
              {{ $t('optimization.providesContractPurchased') }}
              <br />{{ $t('optimization.contractScheduledTo') }} <br />
              {{ $t('optimization.contractExpirationDateApproaching') }}
              <button class="close jsTooltipClose1">툴팁 닫기</button>
            </div>
          </div>
        </h4>
        <a v-if="urlIsStatus" class="flex flex-between align-center more-v2" @click="scrollTo('prch', 'stat-grid')">{{
          $t('common.button.viewDetails')
        }}</a>
        <RouterLink
          v-else
          class="flex flex-between align-center more-v2 dd"
          to="/opti/cost/status?remote=Y&focus=grid&grid=prch"
          >{{ $t('common.button.viewDetails') }}</RouterLink
        >
      </div>
      <div class="invn flex-wrap flex-column" :class="filter.cmmtTypList.length > 0 ? 'mb-30' : ''">
        <div v-if="filter.cmmtTypList.includes('SP')" class="flex-col mt-16">
          <div class="tit2-wrap">Savings Plans</div>
          <DataLoadingOverlay v-if="loading" :height="113"></DataLoadingOverlay>
          <div v-else-if="list.SP.length > 0" class="grid2-flex">
            <template v-for="(val, idx) in list.SP">
              <div :key="idx" class="col" :class="getResourceIcon(val.prodNm)">
                <div class="ti" v-html="getResTitleNewLine(val.prodNm)"></div>
                <div class="tx">
                  <div class="n font-bold" style="font-size: 15px">
                    <strong>{{ val.cmmtCnt || 0 }}</strong> {{ $t('optimization.unit') }}
                  </div>
                  <div v-if="val.exprCmmtCnt > 0 && filter.endDate === today" class="t">
                    {{ $t('optimization.expired') }} {{ val.exprCmmtCnt }} {{ $t('optimization.case') }}
                  </div>
                  <div v-else class="t"><br /></div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="filter.cmmtTypList.includes('RI')" class="flex-col mt-16">
          <div class="tit2-wrap">Reserved Instances</div>
          <DataLoadingOverlay v-if="loading" :height="134"></DataLoadingOverlay>
          <div v-else-if="list.RI.length > 0" class="grid2-flex x-scroll">
            <template v-for="(val, idx) in list.RI">
              <div :key="idx" class="col" :class="getResourceIcon(val.prodNm)">
                <div class="ti" v-html="getResTitleNewLine(val.prodNm)"></div>
                <div class="tx">
                  <div class="n font-bold" style="font-size: 15px">
                    <strong>{{ val.cmmtCnt || 0 }}</strong> {{ $t('optimization.unit') }}
                  </div>
                  <div v-if="val.exprCmmtCnt > 0 && filter.endDate === today" class="t">
                    {{ $t('optimization.expired') }} {{ val.exprCmmtCnt }} {{ $t('optimization.case') }}
                  </div>
                  <div v-else class="t"><br /></div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="filter.cmmtTypList.includes('AzureRI')" class="flex-col">
          <div class="flex flex-between tit2-wrap">
            <div class="mt-auto">
              Reservations
              <span v-if="list.AzureRI.length > 0" style="color: #fc5aa1"
                >({{ $t('optimization.expired') }} {{ expiredTotal.AzureRI }} {{ $t('optimization.case') }})</span
              >
            </div>
            <div class="pos-right">
              <!-- 우측 배치 -->
              <a v-if="list.AzureRI.length > 0" class="ml-1.5 btn" @click="foldExpand">
                {{
                  isFold
                    ? `${$t('optimization.expandAll')} (+${coveredList.AzureRI.length - sliceSize})`
                    : $t('optimization.collapse')
                }}</a
              >
            </div>
          </div>
          <DataLoadingOverlay v-if="loading" :height="153"></DataLoadingOverlay>
          <template v-else>
            <div
              v-for="(items, idx) in list.AzureRI"
              :key="idx"
              class="row x-scroll"
              :class="foldExpandCss(idx)"
              :style="setResRowStyle(items)"
            >
              <template v-if="idx === 0">
                <div v-for="(val, idx2) in items" :key="idx2" class="col" :style="setBoxStyle(items, idx2)">
                  <div class="ti" v-html="getResTitleNewLine(val.prodNm)"></div>
                  <div class="tx-area">
                    <div class="tx-box" :class="getResourceIcon(val.prodNm)"></div>
                    <div class="tx">
                      <div class="n font-bold" style="font-size: 15px">
                        <strong>{{ val.cmmtCnt || 0 }}</strong> {{ $t('optimization.unit') }}
                      </div>
                      <div v-if="val.exprCmmtCnt > 0 && filter.endDate === today" class="t">
                        {{ $t('optimization.expired') }} {{ val.exprCmmtCnt }}{{ $t('optimization.case') }}
                      </div>
                      <div v-else class="t"><br /></div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="!isFold && idx > 0">
                <div
                  v-for="(val, idx2) in items"
                  :key="idx2"
                  class="col"
                  :style="setBoxStyle(items, idx2)"
                  :class="getResourceIcon(val.prodNm)"
                >
                  <div class="ti" v-html="getResTitleNewLine(val.prodNm)"></div>
                  <div class="tx-area">
                    <div class="tx-box" :class="getResourceIcon(val.prodNm)"></div>
                    <div class="tx">
                      <div class="n font-bold" style="font-size: 15px">
                        <strong>{{ val.cmmtCnt || 0 }}</strong> {{ $t('optimization.unit') }}
                      </div>
                      <div v-if="val.exprCmmtCnt > 0 && filter.endDate === today" class="t">
                        {{ $t('optimization.expired') }} {{ val.exprCmmtCnt }}{{ $t('optimization.case') }}
                      </div>
                      <div v-else class="t"><br /></div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapState } from 'vuex';
import costOptiService from '@/services/costOptiService';
import DataLoadingOverlay from '@/components/Overlays/DataLoadingOverlay';

export default {
  components: {
    DataLoadingOverlay,
  },
  props: {},
  data() {
    return {
      currInvn: {},
      exprInvn: {},
      today: null,
      list: {
        SP: [],
        RI: [],
        AzureRI: [],
      }, // 약정구매현황 목록
      isFold: true, // 약정구매현황 접기/펴기
      sliceSize: 7, // 한 줄 표시 갯수 (Only for AzureRI)
      expiredTotal: {
        SP: 0,
        RI: 0,
        AzureRI: 0,
      },
      coveredList: {
        // 약정 서비스별 구매현황 표시 아이템 필수 목록 (순서)
        SP: ['Compute', 'EC2 Instance', 'SageMaker'],
        RI: ['EC2', 'RDS', 'Redshift', 'OpenSearch', 'ElastiCache', 'DynamoDB', 'Elemental MediaLive'],
        AzureRI: [
          'VM',
          'SQL Database',
          'PostgreSQL',
          'MySQL',
          'MariaDB',
          'CosmosDB',
          'App Service',
          'Arc-enabled SQL Managed Instance',
          'Backup',
          'Blob Storage',
          'Cache for Redis',
          'Databricks',
          'Data Explorer',
          'Data Factory',
          'Dedicated Host',
          'Files Reserved Capacity',
          'JBoss EAP Integrated Support',
          'Managed Disks',
          'Microsoft Fabric',
          'Red Hat OpenShift',
          'Red Hat Plans',
          'SUSE Linux',
          'SQL Edge',
          'SQL Managed Instance',
          'Synapse Analytics',
          'Synapse Analytics Pre-Purchase Plan',
          'VMWare solution',
        ],
      },
      loading: false,
    };
  },
  computed: {
    ...mapState('costOpti', ['filter', 'isSearch']),
    urlIsStatus() {
      return window.location.href.includes('/status');
    },
  },
  watch: {
    filter(newVal) {
      if (!newVal.cmmtTypList.includes('AzureRI')) {
        this.isFold = true; // 다른 CSP로 이동 시 접기 활성화
      }
    },
    isSearch(newVal) {
      if (newVal.isSearch) this.getUtlSummary();
    },
  },
  created() {
    this.today = moment().format('YYYYMMDD');
  },
  methods: {
    ...mapActions('costOpti', ['fetchActive']),
    setBoxStyle(items, idx) {
      if (idx > 0 && idx % (items.length - 1) === 0) {
        return 'border-right: 0';
      }
      return 'border-right: 1px solid #00a5ed';
    },
    setResRowStyle(items) {
      if (items.length === this.sliceSize) {
        // 상자 개수와 한줄표시 개수가 같다면 마진을 줄 필요가 없음
        return '';
      }
      let marginRight = 14.25 * (this.sliceSize - items.length); // 적정 마진값 * 빈 개수
      return 'margin-right: ' + marginRight + '%';
    },
    jsonDiff(jsonArr1, jsonArr2, key) {
      // 교차대칭차집합
      const set1 = new Set(jsonArr1.map((obj) => obj[key]));
      const set2 = new Set(jsonArr2.map((obj) => obj[key]));

      const diff1 = jsonArr1.filter((obj) => !set2.has(obj[key]));
      const diff2 = jsonArr2.filter((obj) => !set1.has(obj[key]));

      return diff1.concat(diff2).length > 0;
    },
    arrDiff(arr1, arr2) {
      // 교차대칭차집합
      const intersection = arr1.filter((element) => arr2.includes(element));

      const diff1 = arr1.filter((element) => !intersection.includes(element));
      const diff2 = arr2.filter((element) => !intersection.includes(element));

      return diff1.concat(diff2).length > 0;
    },

    foldExpand() {
      this.isFold = !this.isFold;
    },
    foldExpandCss(idx) {
      if (this.isFold && idx > 0) {
        // 접힌 상태에서 두번째 이상의 아이템인 경우 -> 스타일 제거
        return '';
      } else if (!this.isFold && idx > 0) {
        // 펼쳐진 상태에서 두번째 이상의 아이템인 경우 -> margin-top 10 및 border
        return 'grid5-flex mt-2';
      } else if (idx === 0) {
        // 첫번째 아이템인 경우 -> border만
        return 'grid5-flex';
      }
    },
    async getUtlSummary() {
      this.loading = true;
      try {
        const result = await costOptiService.fetchInvnSummary(this.filter);
        const invnData = result.data.data || [];
        this.setData(invnData);
      } catch (err) {
        console.error('getUtlSummary', err);
      }
      this.loading = false;
    },
    setData(data) {
      // 구매내역에 대해 약정 유형별로 그룹화
      const grouped = data.reduce((acc, cur) => {
        (acc[cur.cmmtTyp] = acc[cur.cmmtTyp] || []).push(cur);
        return acc;
      }, {});

      // 약정 유형에 따라 개별 저장
      // (Reason: 약정대시보드 메뉴에서 CSP별로 1개 이상의 약정 유형에 대한 구매내역을 표현 해야함)
      if (this.filter.cmmtTypList.includes('SP')) {
        if (!grouped.SP) grouped['SP'] = [];
        this.expiredTotal.SP = grouped.SP.reduce((acc, item) => acc + Number(item.exprCmmtCnt), 0);
        this.list.SP = this.getResourceList('SP', grouped.SP);
        if (this.urlIsStatus) {
          this.AzureRI = [];
        }
      }
      if (this.filter.cmmtTypList.includes('RI')) {
        if (!grouped.RI) grouped['RI'] = [];
        this.expiredTotal.RI = grouped.RI.reduce((acc, item) => acc + Number(item.exprCmmtCnt), 0);
        this.list.RI = this.getResourceList('RI', grouped.RI);
        if (this.urlIsStatus && this.list.AzureRI.length > 0) {
          this.AzureRI = [];
        }
      }
      if (this.filter.cmmtTypList.includes('AzureRI')) {
        if (!grouped.RI) grouped['RI'] = [];
        this.expiredTotal.AzureRI = grouped.RI.reduce((acc, item) => acc + Number(item.exprCmmtCnt), 0);
        const resList = this.getResourceList('AzureRI', grouped.RI);
        this.list.AzureRI = this.getFoldableList(resList, this.sliceSize);
        if (this.urlIsStatus) {
          this.list.SP = [];
          this.list.RI = [];
        }
      }
    },
    getFoldableList(items, chunkSize) {
      var chunkedList = [];
      for (var i = 0; i < items.length; i += chunkSize) {
        chunkedList.push(items.slice(i, i + chunkSize));
      }
      return chunkedList.map((subArr) => [...subArr]);
    },
    getResTitleNewLine(resourceName) {
      if (resourceName && resourceName.length > 20)
        // return resourceName.replace(/^(\S+\s+\S+)\s/, '$1<br/>');
        // return resourceName.replace(/\s/g, '<br/>');
        return resourceName;
      return resourceName;
    },
    getResourceIcon(resourceName) {
      if (!resourceName) return '';

      let iconName;
      // 공백이 있는 문자열이면
      if (/\s/.test(resourceName)) {
        // 공백 기준으로 각 단어의 첫 알바벳만 추출하여 공백업는 소문자로 반환
        iconName = resourceName.replace(/\b\w\S*\s*/g, (match) => match.charAt(0)).toLowerCase();
      } else {
        iconName = resourceName.substring(0, 3).toLowerCase(); // 최대 3글자 반환
      }
      return iconName;
    },
    getResourceList(type, data) {
      // 구매현황 목록
      const usedResources = data;
      // 구매 대상별 표시할 리소스 목록
      const targetResources = this.coveredList[type];
      // b 변수에 입력된 순서대로 처리
      for (let i = 0; i < targetResources.length; i++) {
        const itemName = targetResources[i];

        // 이미 있는 항목이 아니라면 추가
        if (!usedResources.some((item) => item.prodNm.toUpperCase() === itemName.toUpperCase())) {
          usedResources.push({
            cmmtTyp: type,
            prodCd: '',
            prodNm: itemName,
            cmmtCnt: 0,
            exprCmmtCnt: 0,
          });
        }
      }

      let sortedList = [];

      // 현재 AzureRI에 한정하여 순서 정렬
      // confirmed from 민지홍, 2024-02-07
      if (type === 'AzureRI') {
        sortedList = usedResources.sort((a, b) => {
          // 1순위: 'exprCmmtCnt' 만료 예정 내림차순
          if (parseInt(b.exprCmmtCnt) - parseInt(a.exprCmmtCnt) !== 0) {
            return parseInt(b.exprCmmtCnt) - parseInt(a.exprCmmtCnt);
          }
          // 2순위: 'cmmtCnt' 구매 개수 내림차순
          if (parseInt(b.cmmtCnt) - parseInt(a.cmmtCnt) !== 0) {
            return parseInt(b.cmmtCnt) - parseInt(a.cmmtCnt);
          }
          // 3순위: 'prodNm' 알파벳 오름차순
          return a.prodNm.localeCompare(b.prodNm);
        });
      } else {
        // prodNm을 기준으로 매핑된 객체로 만들기
        var aMap = Object.fromEntries(usedResources.map((entry) => [entry.prodNm, entry]));
        // 정렬
        sortedList = targetResources.map((item) => aMap[item]);
        // var sortedList = stringArray.map((item) => jsonArray.find((entry) => entry.prodNm === item));
      }
      return sortedList;
    },
    scrollTo(active, refName) {
      this.fetchActive({
        state: {
          grid: active,
          refName: refName,
        },
      });
      const location = document.querySelector('#' + refName).offsetTop;
      window.scrollTo({ left: 0, top: location, behavior: 'smooth' });
    },
  },
};
</script>
<style scoped>
.invn.flex-wrap.flex-column {
  flex-wrap: nowrap;
  flex-direction: column;
}

.mt-10 {
  margin-top: 10px;
}

.invn.flex-wrap .flex-col + .flex-col {
  margin-left: 0 !important;
}
.flex-between {
  justify-content: space-between;
}

.align-center {
  align-items: center;
}

a,
a label {
  cursor: pointer;
}
</style>
