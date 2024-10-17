<template>
  <section class="filter-setting-wrap" :class="visible ? '' : 'hidden'">
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <section class="z-30 p-8 rounded policy-content w-600">
      <h2 class="mb-3 text-2xl text-primary-400">세부 내역 다운로드</h2>
      <span class="text-primary-600 text-sm font-bold"
        >계약 별 비용 및 사용량 데이터를 분석하기 위한 1개월의 세부 데이터를 제공합니다.
      </span>
      <div class="detail-pop mt-4">
        <div class="list">
          <div style="padding-bottom: 10px">
            <span class="text-primary-600 text-xs- font-bold"> 사용년월 </span>
            <div>
              <Select
                :data="chrgYearList"
                div-style="border-radius: 4px; border: 1px solid rgb(233, 235, 237); width: 30%; margin-top: 0.5rem; float: left;"
                :text-getter="(item) => item.text"
                :key-getter="(item) => item.unixTimestamp"
                select-class="flex items-center justify-between w-full text-sm"
                select-style="padding: 0 10px 0 16px;"
                :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
                arrow-class="ml-4"
                option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
                option-list-style="width: 26.5%; max-height: 30%; overflow-y:scroll;"
                option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
                :default-selected="0"
                @change="handleYearChange"
              />
              <Select
                :data="chrgMonthList"
                div-style="order-radius: 4px; border: 1px solid rgb(233, 235, 237); width: 30%; margin-top: 0.5rem; margin-left: 10px; display:inline-block;"
                :text-getter="(item) => item.text"
                :key-getter="(item) => item.unixTimestamp"
                select-class="flex items-center justify-between w-full text-sm"
                select-style="padding: 0 10px 0 16px;"
                :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
                arrow-class="ml-4"
                option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
                option-list-style="width: 26.5%; max-height: 30%; overflow-y:scroll;"
                option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
                :default-selected="0"
                @change="handleMonthChange"
              />
            </div>
          </div>
          <div style="padding-bottom: 10px">
            <span class="text-primary-600 text-xs- font-bold"> 기준 </span>
            <Select
              :data="periodTypeList"
              :div-style="divStyle30"
              :text-getter="(item) => item.name"
              :key-getter="(item) => item.name"
              select-class="flex items-center justify-between w-full text-sm"
              select-style="padding: 0 10px 0 16px;"
              :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
              arrow-class="ml-4"
              option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
              option-list-style="width: 26.5%; max-height: 30%; overflow-y:scroll;"
              option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
              :default-selected="0"
              @change="handlePeriodTypeChange"
            />
          </div>
          <div>
            <span class="text-primary-600 text-xs- font-bold"> 계약명 </span>
            <Select
              :data="ctrtList"
              :div-style="divStyle100"
              :text-getter="(item) => item.ctrtNm"
              :key-getter="(item) => item.ctrtId"
              select-class="flex items-center justify-between w-full text-sm"
              select-style="padding: 0 10px 0 16px;"
              :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
              arrow-class="ml-4"
              option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
              option-list-style="width: 89%; max-height: 50%; overflow-y:scroll;"
              option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
              :default-selected="0"
              @change="handleCtrtChange"
            />
          </div>
        </div>
        <div style="margin: 20px 0 0; text-align: left">
          <button class="btn line" style="min-width: 100px">
            <span :class="moreFilter ? 'icon-down' : 'icon-up'" @click="onMoreFilter">추가필터</span>
          </button>
        </div>
        <div :class="moreFilter ? '' : 'hidden'" class="list">
          <span class="text-primary-600 text-xs- font-bold"> 태그 키 </span>
          <Select
            :data="tagList"
            :div-style="divStyle100"
            :text-getter="(item) => item.name"
            :key-getter="(item) => item.id"
            select-class="flex items-center justify-between w-full text-sm"
            select-style="padding: 0 10px 0 16px;"
            :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
            arrow-class="ml-4"
            option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
            option-list-style="width: 89% max-height: 40%; overflow-y:scroll;"
            option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
            :default-selected="0"
            @change="handleTagChange"
          />
        </div>
        <div class="text-center mt-7">
          <button
            class="inline-block px-6 h-32 text-sm text-primary-400 border rounded-sm bg-white border-primary-400 font-bold"
            @click="closePop"
          >
            취소
          </button>
          <button
            class="inline-block px-6 h-32 text-sm text-white border rounded-sm bg-primary-400 border-primary-400 font-bold ml-1.5"
            @click="downloadExcel"
          >
            다운로드
          </button>
        </div>
      </div>
      <button class="absolute top-0 right-0 close-policy-modal mt-7 mr-7" @click="closePop">
        <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
      </button>
    </section>
    <div ref="dimmed" class="dimmed" style="display: none"></div>
  </section>
</template>
<script>
import Select from '@/components/Select';
import billService from '@/services/billService';
import moment from 'moment/moment';
import costExService from '@/services/costExService';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { types } from '@/store/modules/costEx';
import { setApiConfig } from '@/library/APICaller';
import axios from 'axios';

export default {
  components: { Select },
  props: {
    visible: {
      type: Boolean,
    },
  },
  data() {
    return {
      moreFilter: false,
      visibleSelect: false,
      periodTypeList: [
        { name: '월별', value: 'MNTH' },
        { name: '일별', value: 'DAY' },
      ],
      chrgYearList: [],
      chrgMonthList: [],
      tagList: [],
      chrgMonthMap: new Map(),
      ctrtList: [],
      params: {
        chrgYear: '',
        chrgMonth: '',
        ctrtId: '',
        periodType: 'DAY',
        tagKey: '',
        tagNm: '',
      },
      divStyle30: 'border-radius: 4px; border: solid 1px #e9ebed; width: 30%; margin-top: 0.5rem',
      divStyle100: 'border-radius: 4px; border: solid 1px #e9ebed; width: 100%; margin-top: 0.5rem',
      ctrtListApiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
      tagKeyApiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
    };
  },
  computed: {
    ...mapState('costEx', ['isDownload', 'updateCtrtTag']),
    ...mapGetters('costEx', ['cspTypCd']),
  },
  watch: {
    updateCtrtTag: function () {
      if (this.updateCtrtTag) {
        this.setUpdateCtrtTag(false);
        this.setCtrtTag();
      }
    },
  },
  mounted() {
    this.fetchChrgYmList();
  },
  methods: {
    ...mapActions('costEx', ['fetchIsDownload']),
    ...mapMutations('costEx', {
      setUpdateCtrtTag: types.SET_UPDATE_CTRT_TAG,
    }),
    async setCtrtTag() {
      await this.fetchCtrtList().then(() => {
        this.fetchTagKey();
      });
    },
    async fetchCtrtList() {
      // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
      if (this.ctrtListApiConfig.cancelTokenSource) {
        this.ctrtListApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.ctrtListApiConfig);

      await costExService
        .fetchCtrt({ cspTypCd: this.cspTypCd }, { cancelToken: this.ctrtListApiConfig.cancelToken })
        .then((res) => {
          this.ctrtList = [];
          const result = res.data.data;
          if (result.length > 0) {
            result.forEach((elem) => {
              let obj = {
                ctrtId: elem.ctrtId,
                ctrtNm: elem.ctrtNm,
              };
              this.ctrtList.push(obj);
            });
            this.params.ctrtId = this.ctrtList[0];
          }
        })
        .catch((e) => {
          if (!axios.isCancel(e)) {
            console.error('Error) in CostExDetailDownload fetchCtrtList() : ', e);
            this.ctrtList = [];
          }
        });
    },
    async fetchTagKey() {
      if (this.tagKeyApiConfig.cancelTokenSource) {
        this.tagKeyApiConfig.cancelTokenSource.cancel();
      }
      setApiConfig(this.tagKeyApiConfig);

      try {
        let param = { contractId: this.params.ctrtId.ctrtId };
        if (this.cspTypCd === 'AZURE') {
          param = {
            ...param,
            startYm: this.params.chrgYear + this.params.chrgMonth.toString().padStart(2, '0'),
            endYm: this.params.chrgYear + this.params.chrgMonth.toString().padStart(2, '0'),
          };
        }
        this.tagList = [];
        const response = await costExService.selectTagKeyByContractId({
          cspTypCd: this.cspTypCd,
          payload: param,
          config: { cancelToken: this.tagKeyApiConfig.cancelToken },
        });
        const result = response.data;
        if (result && result.optionList.length > 0) {
          this.tagList = result.optionList.map((item) => {
            if (item.name.includes('user:')) {
              item.name = item.name.replace('user:', '');
            }
            return item;
          });
        }
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error('Error) in CostExDetailDownload fetchTagKey() : ', e);
          this.tagList = [];
        }
      }
    },
    async fetchChrgYmList() {
      await billService
        .fetchChrgYm()
        .then((res) => {
          if (res.data.data.length > 0) {
            let data = res.data.data;
            let monthMap = new Map();
            const yearAllList = data.map((x) => {
              let year = moment(x.chrgYm).format('YYYY');
              // let month = moment(x.chrgYm).format('MM');
              // let monthList = monthMap.has(year) ? monthMap.get(year) : [];
              // let monObj = { unixTimestamp: month, text: month + '월' };
              // monthList.push(monObj);
              // monthMap.set(year, monthList);
              return year;
            });
            let yearList = [...new Set(yearAllList)];

            // 현재 년도 확인
            const currentYear = moment().format('YYYY');
            // 현재 년도가 yearList에 없다면 추가
            if (!yearList.includes(currentYear)) {
              yearList.push(currentYear);
              yearList.sort().reverse(); // 년도 순으로 정렬
            }

            yearList.forEach((elem) => {
              let montarr = [];
              for (let i = 1; i < 13; i++) {
                montarr.push({ unixTimestamp: i, text: i + '월' });
              }
              monthMap.set(elem, montarr);
            });

            this.chrgMonthMap = monthMap;
            this.chrgYearList = yearList.map((year) => ({
              unixTimestamp: year,
              text: moment(year).format('YYYY년'),
            }));

            this.chrgMonthList = this.chrgMonthMap.get(this.chrgYearList[0].unixTimestamp);

            this.params.chrgYear = this.chrgYearList[0].unixTimestamp;
            // 첫 번째 년도의 첫 번째 월로 설정
            this.params.chrgMonth = this.chrgMonthList[0].unixTimestamp;

            /*let obj = { unixTimestamp: '', text: '' };
            yearList.map((elem) => {
              obj = {
                unixTimestamp: elem,
                text: moment(elem).format('YYYY년'),
              };
              this.chrgYearList.push(obj);
              let montarr = [];
              for (let i = 1; i < 13; i++) {
                montarr.push({ unixTimestamp: i, text: i + '월' });
              }
              monthMap.set(elem, montarr);
            });

            this.chrgMonthMap = monthMap;
            this.chrgMonthList = this.chrgMonthMap.get(this.chrgYearList[0].unixTimestamp);

            this.params.chrgYear = this.chrgYearList[0].unixTimestamp;
            this.params.chrgMonth = this.chrgMonthList[0].unixTimestamp;*/
          } else {
            this.chrgYearList = [];
            this.chrgMonthMap = new Map();
          }
        })
        .catch(() => {
          this.chrgYearList = [];
          this.chrgMonthMap = new Map();
          console.error('오류가 발생하였습니다.');
        });
    },
    closePop() {
      this.$emit('closeDetailExcelPop');
    },
    inActivatePop() {
      this.fetchIsDownload({ isDownload: !this.isDownload });
    },
    onMoreFilter() {
      this.moreFilter = !this.moreFilter;
    },
    async downloadExcel() {
      const fileNm = `CostExplorer_${this.params.ctrtId.ctrtNm}_${moment().format('YYYYMMDD')}_세부내역`;
      const param = {
        periodType: this.params.periodType,
        billingYm: this.params.chrgYear + this.params.chrgMonth.toString().padStart(2, '0'),
        contractId: this.params.ctrtId.ctrtId,
        contractNm: this.params.ctrtId.ctrtNm,
        userTag: this.moreFilter ? this.params.tagKey : null,
        ccpUserYn: 'Y',
      };
      this.closePop();
      this.inActivatePop();

      if (this.cspTypCd === 'AWS') {
        await costExService
          .downloadExcelDetail(fileNm, param)
          .then((res) => {
            console.log('success');
            this.inActivatePop();
          })
          .catch(() => {
            this.inActivatePop();
            alert('오류가 발생하였습니다.');
          });
      } else if (this.cspTypCd === 'AZURE') {
        await costExService
          .downloadAzureExcelDetail(fileNm, param)
          .then((res) => {
            console.log('success');
            this.inActivatePop();
          })
          .catch(() => {
            this.inActivatePop();
            alert('오류가 발생하였습니다.');
          });
      }
    },
    openSelect() {
      this.visibleSelect = !this.visibleSelect;
    },
    handleYearChange(item) {
      this.chrgMonthList = this.chrgMonthMap.get(item.unixTimestamp);
      this.params.chrgYear = item.unixTimestamp;
      this.params.chrgMonth = this.chrgMonthList[0].unixTimestamp;
      if (this.cspTypCd === 'AZURE') {
        this.fetchTagKey();
      }
    },
    handleMonthChange(item) {
      this.params.chrgMonth = item.unixTimestamp;
      if (this.cspTypCd === 'AZURE') {
        this.fetchTagKey();
      }
    },
    handlePeriodTypeChange(item) {
      this.params.periodType = item.value;
    },
    handleCtrtChange(item) {
      let prevCtrtId = this.params.ctrtId;
      this.params.ctrtId = item;
      if (prevCtrtId !== item.ctrtId) {
        this.tagList = [];
        this.fetchTagKey();
      }
    },
    handleTagChange(item) {
      this.params.tagKey = item.id;
    },
    createDimmd() {
      this.$refs.dimmed.style.display = 'block';
    },
    removeDimmed() {
      this.$refs.dimmed.style.display = 'none';
    },
  },
};
</script>
<style scoped>
.detail-pop .list {
  border-top: solid 1px #e3ebf1;
  margin: 20px -19px 0;
  padding: 20px 19px 0; /*overflow:hidden;overflow-y:auto;*/
  max-height: calc(100% - 100px);
}
.detail-pop .list dt {
  display: -webkit-flex;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  color: #6c9fb2;
  padding: 0 0 8px;
}
.detail-pop .list dd .select2-wrap {
  position: relative;
}
.detail-pop .list dd .select2-wrap .layer-wrap {
  top: 40px !important;
  width: 238px;
}
.detail-pop .list dd .select2-wrap .layer-wrap .select3-wrap {
  border-bottom: solid 1px #e3ebf1;
}
.detail-pop .list dd .select2-wrap .sel {
  background: url(../../../../assets/images/arrow-typ-03.svg) calc(100% - 10px) 50% no-repeat;
  font-size: 14px;
  color: #000;
  line-height: 30px;
  height: 32px;
  border-radius: 4px;
  border: solid 1px #e9ebed;
  background-color: #fff;
  padding: 0 36px 0 16px;
  width: 100%;
  text-align: left;
}
.detail-pop .list dd .select2-wrap .sel2 {
  background: url(../../../../assets/images/arrow-typ-03.svg) calc(100% - 10px) 50% no-repeat;
  font-size: 14px;
  color: #000;
  line-height: 30px;
  height: 32px;
  border-radius: 4px;
  border: solid 1px #e9ebed;
  background-color: #fff;
  padding: 0 36px 0 16px;
  width: 30%;
  text-align: left;
}
.detail-pop .list dd .lst .all {
  font-size: 13px;
  font-weight: 500;
  color: #00a5ed;
  margin: 7px 0 0;
}
.detail-pop .list dd .lst .ls {
  position: relative;
  font-size: 12px;
  color: #666;
  line-height: 120%;
  padding: 6px 20px 6px 12px;
  border-radius: 4px;
  border: solid 1px #e9ebed;
  background-color: #fafafa;
  margin: 10px 0 0;
  letter-spacing: -0.5px;
}
.detail-pop .list dd .lst .ls .delete {
  position: absolute;
  top: 50%;
  right: 9px;
  background: url(../../../../assets/images/ico_delete2.svg) 50% 50% no-repeat;
  margin-top: -6px;
  width: 12px;
  height: 12px;
  text-indent: -9999px;
  font-size: 0;
}
.detail-pop .list dd .button {
  position: relative; /*z-index:1;*/
}
.detail-pop .list dd .button.active .all {
  text-decoration: underline;
}
.detail-pop .list dd .button.active .lAll1 {
  display: block;
}
.detail-pop .list dd + dt,
.detail-pop .list dl + dl {
  margin-top: 15px;
}
.detail-pop .icon-up:before {
  content: '\25B2';
  padding-right: 10px;
}
.detail-pop .icon-down:before {
  content: '\25BC';
  padding-right: 10px;
}
.dimmed {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
  opacity: 0.5;
  background-color: rgb(37 35 35);
}
</style>
