<template>
  <div v-if="visible" class="pst-history-pop">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <section class="z-30 p-8 rounded policy-content w-1050 h-695" style="width: 1050px; height: 695px">
      <h2 class="mb-4 text-2xl text-primary-400">{{ $t('cost.postpaidInvoice') }}</h2>
      <button class="absolute top-0 right-0 close-policy-modal mt-7 mr-7" @click="onCancel">
        <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
      </button>
      <div v-if="$i18n.locale === 'ko'" class="mb-6 flex text-base" style="color: #666666; margin-top: -10px">
        (후불 청구월 : {{ this.pstBillYmLast.slice(0, 4) }}년 {{ this.pstBillYmLast.slice(4, 6) }}월)
      </div>
      <div v-if="$i18n.locale === 'en'" class="mb-6 flex text-base" style="color: #666666; margin-top: -10px">
        ({{ $t('cost.postBillingMonth') }} : {{ this.pstBillYmLast.slice(4, 6) | toMonthEn }},
        {{ this.pstBillYmLast.slice(0, 4) }})
      </div>
      <div style="width: 100%; height: 100%">
        <div class="mb-3 flex items-center">
          <p class="text-xl font-bold">{{ $t('cost.postpaidAmount') }}</p>
          <div class="flex-1 text-right">
            <span class="text-xl font-bold ml-6">&#8361;{{ this.supTrcAmtTot }}</span>
          </div>
        </div>

        <div style="height: 460px; overflow-y: auto">
          <table class="table table-2 w-full">
            <colgroup>
              <col style="width: 70%" />
              <col style="width: 30%" />
            </colgroup>

            <tr v-for="(row, index) in rows" :key="index">
              <td v-if="$i18n.locale === 'ko'">
                {{ row.billYm.slice(0, 4) }}년 {{ row.billYm.slice(4, 6) }}월 후불 금액
              </td>
              <td v-if="$i18n.locale === 'en'">
                {{ $t('cost.amount') }} {{ row.billYm.slice(4, 6) | toMonthEn }}, {{ row.billYm.slice(0, 4) }}
              </td>
              <td class="text-right">&#8361;{{ Number(row.supTrcAmt).toLocaleString() }}</td>
            </tr>
          </table>
        </div>
      </div>
    </section>
  </div>
  <!-- 알림 -->
</template>

<script>
import moment from 'moment';
import billService from '@/services/billService';

export default {
  components: {},
  mixins: [],
  props: {
    visible: {
      type: Boolean,
    },
    billId: '',
    ctrtId : '',
    billDt : '',
    pstBillYmLast : ''
  },
  data() {
    return {
      param: {},
      rows: [],
      supTrcAmtTot: 0,
    };
  },
  computed: {},
  beforeMount() {},
  mounted() {
    this.pstHistoryList();
  },
  created() {
    this.today = moment().format('YYYY.MM.DD');
  },
  methods: {
    onCancel() {
      this.$emit('closePopup');
    },
    //후불 리스트
    pstHistoryList() {
      const billId = this.billId;
      const ctrtId = this.ctrtId;
      const billDt = this.billDt;
      //console.log("ctrtId",ctrtId);
      //console.log("billDt",billDt);
      billService
        .fetchPstBillList({
          billId: billId,
          ctrtId: ctrtId,
          billDt: billDt,
        })
        .then((res) => {
          const fetchData = res.data.data;

          //console.log("pstHistoryPop",fetchData);
          this.rows = fetchData.pstHisList;
          this.supTrcAmtTot = Number(fetchData.supTrcAmtTot).toLocaleString();
        });

    },
    isNull(val) {
      let res = false;
      if(String(val) == 'undefined' || String(val) == 'null' || String(val) == ''){
        res = true;
      }
      return res;
    },
  },
};
</script>
<style>
.pst-history-pop {
  font-style: normal;
  font-size: 14px;
  line-height: 70px;
  color: #515151;
  width: 120px;
  line-height: 2 !important;
  padding: 10px 0 !important;
  word-break: break-all !important;
}
td {
  border-bottom: 1px solid #cdcdcd;
  font-size: 14px;
  color: #4a4a4a;
  padding: 15px 0 15px 0;
  line-height: 1.3;
}

</style>
