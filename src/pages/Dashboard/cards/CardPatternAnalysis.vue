<template>
  <Card v-if="hasData" :wrapper-class="dualData">
    <CardHeader type1 title="비용 패턴 분석 (변화 Top 5)">
      <!-- <template #functions>
        <CardIconCause :to="patternAnalysisRouterLinkTo" />
      </template> -->
    </CardHeader>

    <CardMessage>
      <OcpTextInline>{{ aiGuide.service }} 상품은 과거 패턴과 비교해보니</OcpTextInline>
      <OcpTextInline secondary>{{ aiGuide.rate }} 청구 비용 변화</OcpTextInline>
      <OcpTextInline>가 감지되었습니다.</OcpTextInline>
    </CardMessage>

    <!-- TODO: CHART -->
    <CardMain>
      <g-stack-chart chartHeight="227" chartTheme="dash_aiPattern" :data="convertData" :propsInfo="propsInfo" />
    </CardMain>
  </Card>
</template>

<script>
import Card, { CardHeader, CardIconCause, CardMain, CardMessage } from '@/components/Card';
import { OcpTextInline } from '@/components/shared/Text';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    Card,
    CardHeader,
    CardMain,
    CardMessage,
    OcpTextInline,
    CardIconCause,
  },
  data() {
    return {
      propsInfo: {
        keyProp: 'cspPrdtCd',
        insProp: ['curCost', 'bfCost', 'maxCost', 'avgCost'],
        isFormat: true,
      },
      aiGuide: {
        service: '',
        rate: '',
      },
    };
  },
  computed: {
    ...mapState('dashboard', ['aiPattern', 'abNormalDetect']),
    ...mapGetters('dashboard', ['selectedContract']),
    hasData() {
      if (this.aiPattern.length > 0) {
        this.setData(this.aiPattern);
        return true;
      }
      return false;
    },
    patternAnalysisRouterLinkTo() {
      return {
        name: '비용 패턴 분석',
        params: { ctrtId: this.selectedContract.ctrtId },
      };
    },
    dualData() {
      return this.aiPattern.length > 0 && this.abNormalDetect.length === 0
        ? 'flex-1 p-8 bg-white border rounded-lg border-primary-200 dashboard-card'
        : 'p-8 bg-white rounded-lg border-primary-200 dashboard-card';
    },
    convertData() {
      let cData = _.cloneDeep(this.aiPattern);
      let tList = [];
      _.map(cData, (item) => {
        let newMap = {};
        if (item.bfCost === undefined || item.bfCost === '') {
          newMap['cspPrdtCd'] = item.cspPrdtCd;
          newMap['billYm'] = item.billYm;
          newMap['curCost'] = item.curCost;
          newMap['bfCost'] = '0';
          newMap['maxCost'] = item.maxCost;
          newMap['avgCost'] = item.avgCost;
          tList.push(newMap);
        }
        if (item.curCost === undefined || item.curCost === '') {
          newMap['cspPrdtCd'] = item.cspPrdtCd;
          newMap['billYm'] = item.billYm;
          newMap['curCost'] = '0';
          newMap['bfCost'] = item.bfCost;
          newMap['maxCost'] = item.maxCost;
          newMap['avgCost'] = item.avgCost;
          tList.push(newMap);
        }
      });

      if (tList.length > 0) {
        cData = tList;
      }
      return cData;
    },
    // patternAnalysisMsg() {
    //   if (this.aiPattern.length > 0) {
    //     if (this.aiPattern[0].diffRate === undefined) {
    //       return false;
    //     }
    //   }
    //   return true;
    // },
  },
  methods: {
    setData(data) {
      let topData = data[0];
      let cur = topData.pricingCurcyCd === 'USD' ? '$' : '₩';
      this.aiGuide.service = topData.cspPrdtCd;
      // TOP1의 전월데이터가 0일때는 당월 사용금액 표기(08.27)
      if (Math.abs(Number(topData.bfCost)) === 0) {
        this.aiGuide.rate = cur + numberWithCommas(topData.curCost);
      } else {
        if (topData.diffRate === undefined || topData.diffRate === '') {
          if (topData.curCost === undefined || topData.curCost === '') {
            topData.curCost = 0;
          }
          if (topData.bfCost === undefined || topData.bfCost === '') {
            topData.bfCost = 0;
          }
          let price = Math.abs(Number(topData.curCost) - Number(topData.bfCost));
          this.aiGuide.rate = cur + numberWithCommas(price);
        } else {
          this.aiGuide.rate = Number.parseFloat(topData.diffRate).toFixed(2) + '%';
        }
      }
    },
  },
};
</script>
