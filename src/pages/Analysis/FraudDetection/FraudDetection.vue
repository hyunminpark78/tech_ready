<template>
  <main class="pt-8 pb-12 main">
    <div class="container">
      <BreadCrumb />

      <div class="relative mb-6 bg-white border rounded-lg border-primary-200 dashboard-card select-one">
        <Select
          :data="selectAiContractOptions"
          :key-getter="(item) => item.ctrtId"
          :text-getter="(item) => item.ctrtNm"
          select-class="flex items-center justify-between w-full py-5 text-xl text-left px-7 text-primary-400"
          :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
          arrow-class="-mr-2"
          option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
          option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
          :default-selected="contractId ? (c) => c.ctrtId === contractId : null"
          @change="({ ctrtId }) => (contractId = ctrtId)"
        />
      </div>

      <div class="relative p-8 mb-8 bg-white border rounded-lg border-primary-200 dashboard-card" style="height: 520px">
        <template v-if="hasData">
          <!-- 민감도 설정 팝업 -->
          <FraudDetectionSensitivity v-show="isSense" :senseSetVal="senseVal" @sensePopup="sensePopup" />
          <FraudDetectionUserArmIntvl
            v-show="isIntvl"
            :userArmIntvl="intvlVal"
            :curcyCd="getCurcyCode()"
            @intvlPopup="intvlPopup"
          />
          <!--// 민감도 설정 팝업 -->
          <div>
            <div class="flex items-center justify-between">
              <h3 class="mb-1 font-bold">이상비용 탐지</h3>

              <!-- 민감도 설정 버튼 -->
              <div class="flex items-center">
                <button class="flex items-center text-sm text-gray-500 mr__10 letter-spacing---5" @click="sensePopup">
                  <span class="mr-1">민감도 설정</span>
                  <img src="@/assets/images/ico-flip.svg" alt="." />
                </button>
                <button class="flex items-center text-sm text-gray-500 ml__10 letter-spacing---5" @click="intvlPopup">
                  <span class="mr-1">알람 구간 설정</span>
                  <img src="@/assets/images/ico-flip.svg" alt="." />
                </button>
              </div>
              <!--// 민감도 설정 버튼 -->
            </div>

            <!-- 2022-02-22 : 추가 -->
            <div class="info__txtbox mb__20">
              <p class="mb__5">
                민감도 : <span>{{ getSenseMsg() }}</span>
              </p>
              - <span>최소 7일 이상 경과</span>해야 AI 서비스를 사용할 수 있습니다.<br />
              - 지난 14일 간(최초 설정 시 7일)의 <span>사용 패턴을 분석하여 모델을 생성</span>합니다.<br />
              - 매일 사용 패턴을 분석하여 재학습합니다.
            </div>
            <div class="mt-5" :style="{ visibility: isSense || isIntvl ? 'hidden' : 'visible' }">
              <g-area-chart
                chart-height="307"
                chart-theme="dash_abNormalDetect"
                chart-location="FraudDetection"
                :data="abNormalDetect"
                :props-info="propsInfo"
                :curcyCode="getCurcyCode()"
                @route-fraud-detection="popShortCut"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center" style="height: 350px">
            <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
            <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
          </div>
        </template>
      </div>
      <CardFraudDetectionGrid :contract-id="contractId" @popUp="popDetail" />
    </div>
    <FraudDetectionDetail v-show="isPopDetail" :param="detailParam" @popUpOff="popDetail" />
  </main>
</template>

<script>
import FraudDetectionSensitivity from './FraudDetectionSensitivity.vue';
import FraudDetectionUserArmIntvl from './FraudDetectionUserArmIntvl.vue';
import FraudDetectionDetail from './FraudDetectionDetail.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';
import Select from '@/components/Select';
import CardFraudDetectionGrid from '@/pages/Analysis/FraudDetection/cards/CardFraudDetectionGrid.vue';
// import Button from '@/pages/Dashboard/cards/CardFraudDetectionSensitivity/CardFraudDetectionSensitivityButton.vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import _ from 'lodash';

export default {
  components: {
    FraudDetectionSensitivity,
    FraudDetectionUserArmIntvl,
    FraudDetectionDetail,
    BreadCrumb,
    Select,
    CardFraudDetectionGrid,
  },
  props: {},
  data() {
    return {
      propsInfo: {
        dateProp: 'forcstDt',
      },
      contractId: this.$route.params.ctrtId || null,
      senseVal: 'M',
      intvlVal: {
        intvlStrAmt: 0,
        intvlEndAmt: 0,
      },
      isSense: false,
      isIntvl: false,
      isPopDetail: false,
      detailParam: {
        ctrtId: this.$route.params.ctrtId || null,
        analDt: '',
      },
    };
  },
  computed: {
    ...mapState('dashboard', ['abNormalDetect']),
    ...mapGetters('dashboard', ['selectUserSensitive', 'selectUserArmIntvl']),
    ...mapState('analysis', ['aictrt']),
    ...mapGetters('analysis', ['selectAiContractOptions']),
    hasData() {
      return this.abNormalDetect.length > 0 ? true : false; // FIXME
    },
    getBillYm() {
      return moment().format('YY년MM월');
    },
  },
  watch: {
    contractId() {
      this.setAiFilter({ ctrtId: this.contractId });
      // this.fetchAbNormalDetect({ ctrtId: this.contractId });
      this.fetchAbNormalDetect({ ctrtId: this.contractId }).then(() => {
        this.fetchUserSensitive().then(() => {
          this.senseVal = this.selectUserSensitive;
        });
        this.fetchUserArmIntvl({ ctrtId: this.contractId }).then(() => {
          this.intvlVal = this.selectUserArmIntvl;
        });
      });
    },
    aictrt(newVal) {
      if (this.contractId !== null) {
        this.fetchAbNormalDetect({ ctrtId: this.contractId });
      } else {
        this.fetchAbNormalDetect({ ctrtId: newVal[0].ctrtId });
      }
    },
    isPopDetail() {
      if (this.isPopDetail) {
        document.querySelector('body').classList.add('popup-alarm-detail');
      } else {
        document.querySelector('body').classList.remove('popup-alarm-detail');
      }
    },
  },
  created() {
    this.fetchAiCtrt().then(() => {
      this.fetchUserSensitive().then(() => {
        this.senseVal = this.selectUserSensitive;
      });
      this.fetchUserArmIntvl({ ctrtId: this.contractId }).then(() => {
        this.intvlVal = this.selectUserArmIntvl;
      });
    });

    if (!this.contractId) {
      return;
    }
    this.setAiFilter({ ctrtId: this.contractId });
  },
  mounted() {
    // DashBoard에서 바로가기로 오는 경우 바로 팝업
    /* '4/9' 형태로 들어오는 날짜가 년도를 붙였을때
     * 현재보다 미래인 경우 전년도 데이터이므로
     * 전년도로 변경한 날짜를 Param으로해서 팝업 정보 불러오기
     **/
    console.log('PARAM : ', this.$route.params);
    if (this.$route.params.ctrtId) {
      this.popShortCut(this.$route.params);
    }
  },
  methods: {
    ...mapActions('dashboard', [
      'fetchAbNormalDetect',
      'fetchUserSensitive',
      'fetchUserArmIntvl',
      'updateUserSensitive',
      'updateUserArmIntvl',
    ]),
    ...mapActions('analysis', [
      'fetchAiCtrt',
      'setAiFilter',
      'fetchFraudDetectionDetail',
      'fetchFraudDetectionDetailGrid',
    ]),
    sensePopup(val) {
      if (val && val['change']) {
        this.updateUserSensitive(val['senseVal']).then((res) => {
          if (res.data.data === 1) {
            this.fetchUserSensitive().then(() => {
              this.senseVal = this.selectUserSensitive;
            });
            this.fetchAbNormalDetect({ ctrtId: this.contractId });
            this.fetchAiCtrt();
          }
        });
      }
      this.isSense = !this.isSense;
    },
    intvlPopup(val) {
      if (val && val['change']) {
        this.updateUserArmIntvl(val['userArmIntvl']).then((res) => {
          if (res.data.data >= 1) {
            this.fetchUserArmIntvl({ ctrtId: this.contractId }).then(() => {
              this.intvlVal = this.selectUserArmIntvl;
            });
            this.fetchAbNormalDetect({ ctrtId: this.contractId });
            this.fetchAiCtrt();
          }
        });
      }
      this.isIntvl = !this.isIntvl;
    },
    getCurcyCode() {
      if (this.abNormalDetect.length > 0) {
        return this.abNormalDetect[0].pricingCurcyCd;
      }
      return 'USD';
    },
    getSenseMsg() {
      let val = this.senseVal;
      return val === 'H' ? '높음' : val === 'L' ? '낮음' : '중간';
    },
    popDetail(data) {
      if (data) {
        this.detailParam = _.cloneDeep(data);
      }
      this.isPopDetail = !this.isPopDetail;
    },
    popShortCut(param) {
      let current = moment();
      let currYear = current.year();
      let analDt = moment(currYear + '/' + param.forcstDt).format('YYYYMMDD');
      if (moment(analDt).isAfter(current)) {
        analDt = moment(analDt).subtract(1, 'year').format('YYYYMMDD');
      }

      let data = {
        ctrtId: param.ctrtId,
        analDt: analDt,
      };
      this.popDetail(data);
    },
  },
};
</script>
