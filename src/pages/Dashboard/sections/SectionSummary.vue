<template>
  <section class="container flex py-10">
    <div class="flex-1 w-4/12">
      <div v-if="ctrtCnt" class="text-gray-600">총 계약 {{ ctrtCnt }}건</div>
      <h2 class="text-2xl font-bold text-primary-400">{{ expect.costType | toYearMonth }} 사용 금액</h2>
      <div class="font-bold text-gray-600 mb-1" style="margin-top: 45px">실제 사용 금액</div>
      <div class="text-4xl font-bold roboto"><span class="text-3xl">￦</span>{{ expect.useAmt | number }}</div>
      <div class="mt-2 text-primary-600 text-xs-">{{ hasExpctDataDtm }}일까지 사용한 금액입니다.</div>
    </div>
    <div class="flex w-8/12">
      <div v-if="hasExpctUseAmt" class="flex flex-col flex-1">
        <div class="font-bold text-gray-600" style="margin-top: 100px">예상 사용 금액</div>
        <div class="mt-2 font-bold text-2xl- roboto">
          <span class="text-xl">￦</span>{{ expect.expctUseAmt | number }}
        </div>
        <div class="mt-2 text-primary-600 text-xs-">이번달 예상 사용 금액입니다.</div>
      </div>
      <div v-if="hasExpctDscntAmt" class="flex flex-col flex-1">
        <div class="relative flex items-center mt-auto font-bold text-gray-600" style="margin-top: 100px">
          절감 가능 금액
          <button class="ml-3 cursor-pointer" @click="tooltipVisible = true">
            <img src="@/assets/images/ico-infomation.svg" alt="information" />
          </button>

          <div
            v-show="tooltipVisible"
            class="
              absolute
              z-10
              p-4
              pr-12
              font-normal
              text-gray-700
              bg-white
              border
              rounded
              border-primary-400
              text-xs-
              popup-comment
            "
          >
            On-Demand 요금으로 사용중인 서버의 50% 정도를 예약 요금제로<br />
            사용할 경우 익월부터 절감 가능한 최소 금액입니다.<br />
            OpsNow를 사용하면 상세한 추천과 자원 최적화를 통한 추가 절감<br />
            방법을 확인할 수 있습니다.
            <img src="@/assets/images/arrow.jpg" alt="arrow" />
            <button class="absolute top-0 right-0 mt-2.5 mr-2" @click="tooltipVisible = false">
              <img src="@/assets/images/ico-btn-search-close.svg" alt="close" />
            </button>
          </div>
        </div>
        <div class="flex items-baseline mt-2 font-bold text-2xl- text-primary-400 roboto">
          <span class="text-xl">￦</span>{{ expect.expctDscntAmt | number }}
          <img src="@/assets/images/ico-down.svg" alt="." class="ml-4" />
        </div>
        <div class="mt-2 text-primary-600 text-xs-">예약 요금제 사용시 절감 가능 금액입니다.</div>
      </div>
      <div class="relative flex flex-col flex-1 pt-14">
        <div class="absolute top-0 right-0 py-1 mt-auto text-xs leading-4 text-right text-primary-600 w-96">
          최근 업데이트 : {{ expect.dataDtm | date }}(UTC)<br />※ 할인, 청구시 환율에 따라 실제 청구내용과 금액이 상이할
          수 있습니다.
        </div>
        <div style="margin-top: -20px; margin-left: auto">
          <g-area-chart
            chart-height="150"
            chart-theme="dash_expectCost"
            :data="expctListData"
            :props-info="propsInfo"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
// import AnimatedNumber from 'animated-number-vue';
import { numberWithCommas } from 'openitlibrary/src/library/regexp';
import moment from 'moment';

export default {
  // components: {
  //   AnimatedNumber,
  // },
  data() {
    return {
      propsInfo: {
        dateProp: 'stdDt',
        keyProp: 'costType',
        nameProp: 'costType',
        valueProp: 'accumKrwUnblendCost',
      },
      lastDate: '',
      billYm: moment().subtract(3, 'days').format('YYYYMM'),
      tooltipVisible: false,
    };
  },
  computed: {
    ...mapState('dashboard', ['expect', 'expectList', 'ctrt']),
    ctrtCnt() {
      return this.ctrt.length > 0 ? this.ctrt.length : 0;
    },
    hasUseAmt() {
      return this.expect.useAmt !== undefined ? true : false;
    },
    hasExpctUseAmt() {
      return this.expect.expctUseAmt !== undefined && Number(this.expect.expctUseAmt) > 0 ? true : false;
    },
    hasExpctDscntAmt() {
      return this.expect.expctDscntAmt !== undefined && Number(this.expect.expctDscntAmt) > 500000 ? true : false;
    },
    hasExpctDataDtm() {
      return this.expect.dataDtm !== undefined ? moment(this.expect.dataDtm).format('D') : '';
    },
    expctListData() {
      let cData = this.expectList;
      // if (this.expect.expctUseAmt === undefined) {
      // cData = _.filter(cData, (x) => x.costType === 'USAGE');///
      // }
      // let tmpData = _.filter(this.expectList, (item) => item.costType === 'USAGE');
      // if (tmpData.length > 0) {
      //   this.lastDate = moment(tmpData[tmpData.length - 1].stdDt).format('D');
      // }

      // if (this.lastDate === undefined || this.lastDate === '') {
      //   this.lastDate = moment(this.expect.dataDtm).format('D');
      // }

      return cData;
    },
  },
  created() {
    // 임시 billYm 처리
    this.fetchExpect({ billYm: this.billYm });
    this.fetchExpectList({ billYm: this.billYm });
  },
  methods: {
    ...mapActions('dashboard', ['fetchExpect', 'fetchExpectList']),
    formatToPrice(value) {
      return numberWithCommas(parseFloat(value).toFixed(0));
    },
  },
};
</script>
