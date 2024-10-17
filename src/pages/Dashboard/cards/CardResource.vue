<template>
  <Card>
    <template v-if="hasData">
      <CardHeader type1 title="서비스 사용 현황" :updated-at="resourceDate | date" />
      <CardMessage> 서비스별 사용중인 자원 개수(EA) </CardMessage>
      <div class="mb-4"></div>
      <CardMain>
        <g-stack-chart
          chartHeight="263"
          chart-theme="dash_resourceState"
          :serviceCount="groupByResourceCnt"
          :resourceCount="resourceCnt"
          :data="convertData"
          :props-info="propsInfo"
        ></g-stack-chart>
      </CardMain>
    </template>

    <!-- No Data -->
    <template v-else>
      <div class="flex items-center justify-between">
        <h3 class="mb-1 font-bold">서비스별 사용중인 자원 개수(EA)</h3>
      </div>

      <div class="flex flex-col items-center justify-center" style="height: 293px">
        <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
        <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
      </div>
    </template>
    <!-- // No Data -->
  </Card>
</template>

<script>
import Card, { CardHeader, CardMain, CardMessage } from '@/components/Card';
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';

export default {
  components: {
    Card,
    CardHeader,
    CardMain,
    CardMessage,
  },
  data() {
    return {
      propsInfo: {
        keyProp: 'cspPrdtCd',
        valueProp: 'rsrcCnt',
      },
    };
  },
  computed: {
    ...mapState('dashboard', ['resourceState', 'filter']),
    hasData() {
      return this.resourceState.length > 0 ? true : false; // FIXME
    },
    resourceDate() {
      return this.resourceState.length > 0 ? this.resourceState[0].dataDtm : '';
    },
    resourceCnt() {
      let result = 0;
      if (this.resourceState.length > 0) {
        result = this.resourceState.reduce((acc, cur) => {
          return acc + cur.rsrcCnt;
        }, 0);
      }
      return numberWithCommas(result);
    },
    groupByResourceCnt() {
      let cData = _.cloneDeep(this.resourceState);
      let len = 0;
      if (this.resourceState.length > 0) {
        cData = _.groupBy(this.resourceState, (x) => x.cspPrdtCd);
        len = _.size(cData);
      }

      return len;
    },
    convertData() {
      let cData = _.cloneDeep(this.resourceState);
      let list = [];
      let etcSum = 0;
      if (this.resourceState.length > 0) {
        cData = _.groupBy(this.resourceState, (x) => x.cspPrdtCd);
        let keyLen = Object.keys(cData).length;
        Object.entries(cData).map(([d, data], index) => {
          let sum = _.sumBy(data, (da) => da.rsrcCnt);
          let t = {};

          if (keyLen > 10 && index > 9) {
            etcSum += sum;
          } else {
            t['cspPrdtCd'] = data[0].cspPrdtCd;
            t['rsrcCnt'] = sum;
            list.push(t);
          }
        });

        list = _.sortBy(list, (l) => l.rsrcCnt).reverse();

        if (keyLen > 10) {
          let tt = {};
          tt['cspPrdtCd'] = 'ETC(' + (keyLen - 10) + ')';
          tt['rsrcCnt'] = etcSum;
          list.push(tt);
        }
      }

      return list;
    },
  },
  // watch: {
  //   filter: function (newVal, oldVal) {
  //     console.log('watch filter', newVal);
  //     if (newVal.contract.ctrtId !== undefined && newVal.contract.ctrtId !== 'CTRT_ALL') {
  //       this.getResource(newVal.contract.ctrtId);
  //     }
  //     // this.setMonth(newVal);
  //   },
  // },
  methods: {
    ...mapActions('dashboard', ['fetchResourceState']),
  },
};
</script>
