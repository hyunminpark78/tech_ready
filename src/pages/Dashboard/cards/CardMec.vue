<template>
  <Card :wrapper-class="costClass">
    <CardHeader type3 title="이번달 누적 사용금액" isMec="Y"></CardHeader>
    <template v-if="hasData === 'D'">
      <div class="flex items-center my-2">
        <div v-if="true" class="relative ml-6 bg-white w-52">계약별({{ ctrtLength }})</div>
        <div class="mr-auto">
          <template v-if="totalCost !== ''">
            <span class="text-sm text-gray-700">Total : </span>
            <span class="font-bold"> ₩{{ totalCost }}</span>
          </template>
        </div>
        <button class="mr-2" @click="chgChartType('stack')">
          <template v-if="chartType === 'stack'">
            <img src="@/assets/images/ico-chart-bar-on.svg" alt="." />
          </template>
          <template v-else>
            <img src="@/assets/images/ico-chart-bar-off.svg" alt="." />
          </template>
        </button>
        <button @click="chgChartType('line')">
          <template v-if="chartType === 'line'">
            <img src="@/assets/images/ico-chart-line-on.svg" alt="." />
          </template>
          <template v-else>
            <img src="@/assets/images/ico-chart-line-off.svg" alt="." />
          </template>
        </button>
      </div>
      <CardMain>
        <div>
          <!-- TODO: CHART -->
          <g-stack-chart
            v-if="chartType === 'stack'"
            chart-height="195"
            chart-theme="dash_usageCost"
            :data="convertData"
            :props-info="propsInfo"
            @total-price="targetDatePrice"
          />
          <g-area-chart
            v-if="chartType === 'line'"
            chart-height="195"
            chart-theme="dash_usageCost"
            :data="convertData"
            :props-info="propsInfo"
          />
          <span class="text-xs text-gray-500 ml-12"
            >※ 사용 기록을 수집하여 추정한 요금으로 계약 조건, 환율, 절사 방식, 서비스 제공 업체의 요금 확정 여부 등에
            따라 실제 청구 요금과 다를 수 있습니다.
          </span>
        </div>
      </CardMain>
    </template>

    <template v-else-if="hasData === 'L'">
      <div class="relative" style="height: 195px">
        <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
          <div class="mb-4 loading_rotate">
            <span class="loadingcolor"></span>
          </div>
          <div class="loading_txt">Loading...</div>
        </div>
      </div>
    </template>

    <!-- No Data -->
    <template v-else>
      <div class="flex justify-between">
        <div>
          <!-- <h3 class="mb-1 font-bold">이번달 사용 비용</h3> -->
        </div>
        <div>
          <!-- <p class="text-xs text-right text-gray-500">최근 업데이트 : 2021.05.28 11:00 AM</p> -->
        </div>
      </div>

      <div class="flex flex-col items-center justify-center" style="height: 195px">
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
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
import Select from '@/components/Select';
import moment from 'moment';

export default {
  components: {
    Card,
    CardHeader,
    CardMain,
    CardMessage,
    Select,
  },
  data() {
    return {
      selectData: [],
      chartType: '',
      propsInfo: {
        dateProp: 'stdDt',
        keyProp: 'grpId',
        nameProp: 'grpNm',
        valueProp: 'accumKrwUnblendCost',
      },
      selectCategory: 'CTRT',
      usageType: 'ACNT',
      billYm: moment().subtract(3, 'days').format('YYYYMM'),
      totalCost: '',
      ctrtLength: 0,
    };
  },
  computed: {
    ...mapState('dashboard', ['mecCost', 'usageFilter', 'filter', 'period']),
    hasData() {
      let lState = '';
      let cData = _.cloneDeep(this.mecCost);
      let grpData = _.groupBy(cData, 'grpId');

      if (_.size(grpData) === 0 || grpData === undefined) {
        return (lState = 'E');
      }

      let gData = _.groupBy(cData, 'stdDt');
      let lastDate = _.findLast(gData);
      lastDate = lastDate[0].stdDt;

      cData = _.filter(cData, (c) => c.accumKrwUnblendCost !== null && c.accumKrwUnblendCost !== undefined);
      let lTotalCost = _.sumBy(gData[lastDate], (x) => x.accumKrwUnblendCost);

      if (cData && _.size(gData) > 0) {
        if (lTotalCost && Number(lTotalCost) > 0) {
          this.totalCost = numberWithCommas(lTotalCost);
        } else {
          this.totalCost = 0;
        }
      } else {
        this.totalCost = '-';
      }
      /** E(Empty) / L(lodaing) / D(data) */

      if (cData.length === 0) {
        lState = 'E';
      } else {
        let tData = cData[0];
        if (tData['grpId'] === 'init') {
          lState = 'L';
        } else {
          lState = 'D';
        }
      }
      this.ctrtLength = _.size(grpData);
      return lState;
    },
    // getTotalPrice() {},
    useDate() {
      if (this.hasData) {
        let strDate = this.period.billYm !== undefined ? moment(this.period.strDt).format('M.D일') : '';
        let endDate = this.period.billYm !== undefined ? moment(this.period.endDt).format('M.D일') : '';
        return strDate + ' ~ ' + endDate;
      }
      return '';
    },
    useUpdateDate() {
      if (this.hasData) {
        return this.period.billYm !== undefined ? this.period.stdDt : '';
      }
      return '';
    },
    costClass() {
      return 'p-8 mb-8 bg-white border rounded-lg border-primary-200 dashboard-card';
    },
    convertData() {
      let cData = _.flatten(this.mergeDate2());
      let xData = _.groupBy(cData, (x) => x.grpId);
      let convertData;
      let topPrice = [];
      let topRankCnt = 20; // 범례 보여줄 TOP 개수

      // 마지막 누적금액 비교
      _.map(xData, (list) => {
        topPrice.push(list[list.length - 1]);
      });

      // ROWDATA 그룹화 후 RANKING작업
      topPrice = _.sortBy(topPrice, (c) => c.accumKrwUnblendCost).reverse();

      // 상위 DATA 추출
      if (this.selectCategory !== 'CTRT') {
        topPrice = _.take(topPrice, topRankCnt);
      }

      // ROWDATA > TOP RANK TARGET ROW DATA 추출
      let topData = _.map(topPrice, (row) => {
        return xData[row.grpId];
      });

      if (this.selectCategory !== 'CTRT' && _.size(xData) > 20) {
        // ROWDATA > ETC생성할 TARGET ROW DATA 추출
        let etcData = _.filter(xData, (data) => _.findIndex(topPrice, (p) => p.grpId === data[0].grpId) === -1);
        /* ETC 데이터 날짜별 SUM */
        etcData = _.flatten(etcData);
        etcData = _.groupBy(etcData, (etc) => etc.stdDt);
        let etcList = [];

        Object.entries(etcData).map(([d, data], index) => {
          let sum = _.sumBy(data, (da) => da.accumKrwUnblendCost);
          let t = {};
          t['billYm'] = data[0].billYm;
          t['stdDt'] = data[0].stdDt;
          t['grpId'] = 'ETC';
          t['grpNm'] = 'ETC';
          t['accumKrwUnblendCost'] = sum;
          etcList.push(t);
        });

        // 기존 TOP ROWdATA랑 ETC 생성 DATA 합치기
        //convertData = Array.concat(_.flatten(topData), etcList);
        convertData = Array.concat(topData, [etcList]);
      } else {
        //convertData = _.flatten(topData);
        convertData = topData;
      }
      const flatDate = _.flatten(_.cloneDeep(convertData));
      const filterDate = _.filter(flatDate, (item) => {
        return !_.isEmpty(item);
      });

      let gData = _.groupBy(filterDate, 'stdDt');
      let lastDate = _.findLast(gData);
      lastDate = lastDate[0].stdDt;
      let lTotalCost = _.sumBy(gData[lastDate], (x) => x.accumKrwUnblendCost);

      if (cData && _.size(gData) > 0) {
        if (lTotalCost && Number(lTotalCost) > 0) {
          this.totalCost = numberWithCommas(lTotalCost);
        } else {
          this.totalCost = 0;
        }
      } else {
        this.totalCost = '-';
      }

      return filterDate;
    },
  },
  created() {
    // TODO: call api
    // setTimeout(() => {
    //   this.selectData = [];
    // }, 1000);
    this.chartType = 'stack';
  },
  methods: {
    ...mapActions('dashboard', ['fetchUsageFilter', 'fetchUsageCost']),
    chgChartType(type) {
      this.chartType = type;
    },
    targetDatePrice(value) {
      this.totalCost = value;
    },
    mergeDate(data) {
      const calcData = _.cloneDeep(data);

      // start 날짜
      var startDt = 99999999;
      data.forEach((item) => {
        item.forEach((item2) => {
          if (item2.stdDt < startDt) {
            startDt = item2.stdDt;
          }
        });
      });

      //max length
      var maxIndex = 0;
      data.forEach((item) => {
        item.forEach((item2, index2) => {
          if (index2 > maxIndex) {
            maxIndex = index2;
          }
        });
      });

      // 날짜 중간에 비거나 마지막날짜까지 데이터 채우기
      calcData.forEach((item, index) => {
        if (item.length > 0) {
          var start = startDt;
          var before = {};
          for (var i = 0; i <= maxIndex; i++) {
            //첫번재 데이터 비었을때
            if (i === 0 && item[0].stdDt !== start) {
              calcData[index].splice(i, 0, {});
              start = moment(start).add('1', 'days').format('YYYYMMDD');
              continue;
            }
            //앞에 날짜 비었을때
            if ((i > 0 && !calcData[index][i]) || calcData[index][i].stdDt > start) {
              if (_.isEmpty(before)) {
                calcData[index].splice(i, 0, {});
                start = moment(start).add('1', 'days').format('YYYYMMDD');
                continue;
              }
            }
            //마지막 날짜 비었을 때
            if (!item[i]) {
              var copybefore = _.cloneDeep(before);
              copybefore.stdDt = start;
              item.push(copybefore);
              start = moment(start).add('1', 'days').format('YYYYMMDD');
              continue;
            }

            if (item[i].stdDt !== start) {
              var copy = _.cloneDeep(item[i]);
              copy.stdDt = start;
              copy.bugo = 'copy before';
              calcData[index].splice(i, 0, copy);
            } else {
              // 날짜는 일치하지만
            }

            before = item[i];
            start = moment(start).add('1', 'days').format('YYYYMMDD');
          }
        }
      });
      return data;
    },
    mergeDate2() {
      let totalList = [];
      let tData = _.cloneDeep(this.mecCost);
      /** 데이터 검증 */
      let grpData = _.groupBy(tData, (x) => x.grpId);

      let maxLength = 0;

      let firstData = this.mecCost[0];
      let billYm = firstData.billYm;
      let today = moment().format('YYYYMM');
      let dataLimitDay = moment(billYm).endOf('month').format('YYYYMM');

      // 해당월 최다 데이터 구하기
      Object.entries(grpData).map(([key, data], index) => {
        if (data.length > maxLength) {
          maxLength = data.length;
        }
      });

      // 계약이 1건일 때
      let mecKeys = Object.keys(grpData).length;

      if (mecKeys < 2) {
        /* billYm이 현재달과 같을경우 > 오늘 날짜 전까지 생성
           billYm이 현재달 이전일 경우 > billYm의 마지막날까지 생성
        */
        if (Number(today) === Number(billYm)) {
          maxLength = moment().subtract(1, 'day').format('DD');
        } else {
          maxLength = moment(dataLimitDay).endOf('month').format('DD');
        }
      }

      // 빈 데이터 찾아서 맵핑하기
      Object.entries(grpData).map(([key, data], index) => {
        if (data.length < maxLength) {
          let money = 0;
          let nList = [];
          let rowData = data[0];
          for (let i = 1; i <= maxLength; i++) {
            let nMap = {};
            let days = i > 9 ? i : 0 + '' + i;
            let targetDate = moment(billYm).format('YYYYMM' + days);
            if (
              _.findIndex(data, function (item) {
                return Number(item.stdDt) === Number(targetDate);
              }) === -1
            ) {
              nMap = _.cloneDeep(rowData);
              nMap['accumKrwUnblendCost'] = money;
              nMap['stdDt'] = targetDate;
            } else {
              let idx = _.findIndex(data, function (item) {
                return Number(item.stdDt) === Number(targetDate);
              });
              nMap = _.cloneDeep(data[idx]);
              money = data[idx]['accumKrwUnblendCost'];
            }
            nList.push(nMap);
          }
          totalList.push(_.cloneDeep(nList));
        } else {
          totalList.push(data);
        }
      });

      return totalList;
    },
  },
};
</script>
