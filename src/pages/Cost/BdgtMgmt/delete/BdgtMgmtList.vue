<template>
  <div class="el_box box-wrap six">
    <div class="el_box_title">
      예산목록
      <div class="popup_info" @click="popup_info_open">
        !
        <div class="popup_info_detail">
          <b>Default Budget</b>
          <div class="popup_info_detail_x" @click="popup_info_close">x</div>
          Default Budget은 Cloud Radar 에서 계약과 과거 사용 비용을 기준으로 자동<br />생성 후 제공하는 관리 예산 예산
          예산 항목입니다.
        </div>
      </div>
    </div>
    <div class="title">
      <div class="search-wrap">
        <span style="color: #00a5f0; font-weight: bold; margin-right: 20px"
          ><img src="@/assets/icon.png" alt="" class="img_jh" />대표예산 지정</span
        ><input type="text" placeholder="검색어를 입력하세요" class="keyword" />
        <a href="#" class="btn">검색</a>
      </div>
      <div class="pos-right">
        <span class="date" style="margin-right: 24px">기준시간 : 2024.9.25 11:35</span>

        <a class="btn" style="cursor: pointer" @click="move">예산생성</a>
      </div>
    </div>
    <div class="ovf_table" style="height: 100%; width: 100%">
      <ag-grid-vue
        id="bdgtGrid"
        :style="{ width: '100%', height }"
        class="ag-theme-alpine"
        :column-defs="columnDefs"
        :row-data="rowData"
        @grid-ready="onGridReady"
      ></ag-grid-vue>
    </div>
    <!--    <div class="ovf_table">-->
    <!--      <table>-->
    <!--        <thead>-->
    <!--          <tr>-->
    <!--            <th>계약명</th>-->
    <!--            <th>예산이름</th>-->
    <!--            <th>임계정보</th>-->
    <!--            <th>예산</th>-->
    <!--            <th>사용비용</th>-->
    <!--            <th>예측금액</th>-->
    <!--            <th>예산 사용률</th>-->
    <!--            <th>예측 사용률</th>-->
    <!--            <th>예산범위</th>-->
    <!--            <th>주기</th>-->
    <!--            <th>예산기간</th>-->
    <!--            <th>상태</th>-->
    <!--          </tr>-->
    <!--        </thead>-->
    <!--        <tbody>-->
    <!--          <tr>-->
    <!--            <td style="text-align: left">-->
    <!--              <input id="ch1" type="checkbox" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>-->
    <!--            </td>-->
    <!--            <td>Default Budget</td>-->
    <!--            <td>초과 (3개)</td>-->
    <!--            <td>₩130,471,750</td>-->
    <!--            <td>₩130,471,750</td>-->
    <!--            <td>₩150,042,513</td>-->
    <!--            <td>-->
    <!--              <div class="br_ch">-->
    <!--                <span class="r">101.2%</span>-->
    <!--                <div class="bar">-->
    <!--                  <div class="bar_cell r" style="width: 100%"></div>-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </td>-->
    <!--            <td>-->
    <!--              <div class="br_ch">-->
    <!--                <span class="r">115.5%</span>-->
    <!--                <div class="bar">-->
    <!--                  <div class="bar_cell b" style="width: 100%"></div>-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </td>-->
    <!--            <td>전체</td>-->
    <!--            <td>월별</td>-->
    <!--            <td>2024.01~2026.12</td>-->
    <!--            <td>활성화</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td style="text-align: left">-->
    <!--              <input id="ch1" type="checkbox" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>-->
    <!--            </td>-->
    <!--            <td>Default Budget</td>-->
    <!--            <td>초과 (3개)</td>-->
    <!--            <td>₩130,471,750</td>-->
    <!--            <td>₩130,471,750</td>-->
    <!--            <td>₩150,042,513</td>-->
    <!--            <td>-->
    <!--              <div class="br_ch">-->
    <!--                <span class="b">74.2%</span>-->
    <!--                <div class="bar">-->
    <!--                  <div class="bar_cell g" style="width: 74.2%"></div>-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </td>-->
    <!--            <td>-->
    <!--              <div class="br_ch">-->
    <!--                <span>80%</span>-->
    <!--                <div class="bar">-->
    <!--                  <div class="bar_cell b" style="width: 80%"></div>-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </td>-->
    <!--            <td>전체</td>-->
    <!--            <td>월별</td>-->
    <!--            <td>2024.01~2026.12</td>-->
    <!--            <td>활성화</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td style="text-align: left">-->
    <!--              <input id="ch1" type="checkbox" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>-->
    <!--            </td>-->
    <!--            <td>Default Budget</td>-->
    <!--            <td>초과 (3개)</td>-->
    <!--            <td>₩130,471,750</td>-->
    <!--            <td>₩130,471,750</td>-->
    <!--            <td>₩150,042,513</td>-->
    <!--            <td>-->
    <!--              <div class="br_ch">-->
    <!--                <span class="b">74.2%</span>-->
    <!--                <div class="bar">-->
    <!--                  <div class="bar_cell g" style="width: 74.2%"></div>-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </td>-->
    <!--            <td>-->
    <!--              <div class="br_ch">-->
    <!--                <span>80%</span>-->
    <!--                <div class="bar">-->
    <!--                  <div class="bar_cell b" style="width: 80%"></div>-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </td>-->
    <!--            <td>전체</td>-->
    <!--            <td>월별</td>-->
    <!--            <td>2024.01~2026.12</td>-->
    <!--            <td>활성화</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td style="text-align: left">-->
    <!--              <input id="ch1" type="checkbox" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>-->
    <!--            </td>-->
    <!--            <td>Default Budget</td>-->
    <!--            <td>초과 (3개)</td>-->
    <!--            <td>₩130,471,750</td>-->
    <!--            <td>₩130,471,750</td>-->
    <!--            <td>₩150,042,513</td>-->
    <!--            <td>-->
    <!--              <div class="br_ch">-->
    <!--                <span class="b">74.2%</span>-->
    <!--                <div class="bar">-->
    <!--                  <div class="bar_cell g" style="width: 74.2%"></div>-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </td>-->
    <!--            <td>-->
    <!--              <div class="br_ch">-->
    <!--                <span>80%</span>-->
    <!--                <div class="bar">-->
    <!--                  <div class="bar_cell b" style="width: 80%"></div>-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </td>-->
    <!--            <td>전체</td>-->
    <!--            <td>월별</td>-->
    <!--            <td>2024.01~2026.12</td>-->
    <!--            <td>활성화</td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td style="text-align: left">-->
    <!--              <input id="ch1" type="checkbox" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>-->
    <!--            </td>-->
    <!--            <td>Default Budget</td>-->
    <!--            <td>초과 (3개)</td>-->
    <!--            <td>₩130,471,750</td>-->
    <!--            <td>₩130,471,750</td>-->
    <!--            <td>₩150,042,513</td>-->
    <!--            <td>-->
    <!--              <div class="br_ch">-->
    <!--                <span class="b">74.2%</span>-->
    <!--                <div class="bar">-->
    <!--                  <div class="bar_cell g" style="width: 74.2%"></div>-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </td>-->
    <!--            <td>-->
    <!--              <div class="br_ch">-->
    <!--                <span>80%</span>-->
    <!--                <div class="bar">-->
    <!--                  <div class="bar_cell b" style="width: 80%"></div>-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </td>-->
    <!--            <td>전체</td>-->
    <!--            <td>월별</td>-->
    <!--            <td>2024.01~2026.12</td>-->
    <!--            <td>활성화</td>-->
    <!--          </tr>-->
    <!--        </tbody>-->
    <!--      </table>-->
    <!--      <div class="flex items-center justify-center my-7 pagination">-->
    <!--        <button style="visibility: hidden">-->
    <!--          <img src="@/assets/images/btn-first.svg" alt="처음 페이지" />-->
    <!--        </button>-->
    <!--        <button style="visibility: hidden">-->
    <!--          <img src="@/assets/images/btn-pre.svg" alt="이전 페이지" />-->
    <!--        </button>-->
    <!--        <button-->
    <!--          class="-->
    <!--            flex-->
    <!--            items-center-->
    <!--            justify-center-->
    <!--            border-->
    <!--            rounded-sm-->
    <!--            w-9-->
    <!--            h-9-->
    <!--            text-xs- text-white-->
    <!--            border-primary-400-->
    <!--            bg-primary-400-->
    <!--          "-->
    <!--        >-->
    <!--          1</button-->
    <!--        ><button-->
    <!--          class="flex items-center justify-center border rounded-sm w-9 h-9 text-xs- text-gray-600 border-gray-300"-->
    <!--        >-->
    <!--          2</button-->
    <!--        ><button-->
    <!--          class="flex items-center justify-center border rounded-sm w-9 h-9 text-xs- text-gray-600 border-gray-300"-->
    <!--        >-->
    <!--          3</button-->
    <!--        ><button-->
    <!--          class="flex items-center justify-center border rounded-sm w-9 h-9 text-xs- text-gray-600 border-gray-300"-->
    <!--        >-->
    <!--          4</button-->
    <!--        ><button-->
    <!--          class="flex items-center justify-center border rounded-sm w-9 h-9 text-xs- text-gray-600 border-gray-300"-->
    <!--        >-->
    <!--          5-->
    <!--        </button>-->
    <!--        <button>-->
    <!--          <img src="@/assets/images/btn-pre.svg" alt="다음 페이지" class="rotate-180-" />-->
    <!--        </button>-->
    <!--        <button>-->
    <!--          <img src="@/assets/images/btn-first.svg" alt="마지막 페이지" class="rotate-180-" />-->
    <!--        </button>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import Section, { SectionNewHeader, SectionMain, SectionLnb } from '@/components/Section';
import { AgGridVue } from 'ag-grid-vue';

export default {
  components: {
    AgGridVue,
    SectionNewHeader,
    Section,
    SectionMain,
    SectionLnb,
  },
  data: function () {
    return {
      toggle: false,
      columnDefs: null,
      rowData: null,
      height: '174px',
    };
  },
  created() {
    this.setColumn();
    this.setData();
  },
  methods: {
    onGridReady(params) {},
    setColumn() {
      this.columnDefs = [
        {
          // headerCheckboxSelection: true, // 헤더 체크박스 추가
          checkboxSelection: true, // 각 행에 체크박스 추가
          // headerName: '',
          width: 80,
          menuTabs: [],
        },
        {
          field: 'ctrtId',
          hide: true,
        },
        {
          // headerName: '계약명',
          headerName: '계약명',
          width: 320,
          field: 'ctrtNm',
          resizable: true,
          sortable: true,
          menuTabs: [],
          cellClass: 'ag-grid-font',
        },
        {
          headerName: '예산 이름',
          field: 'bdgtNm',
          width: 160,
          resizable: true,
          sortable: true,
          menuTabs: [],
        },
        {
          headerName: '임계 경보',
          field: 'bdgtThrs',
          width: 140,
          resizable: true,
          sortable: true,
          menuTabs: [],
        },
        {
          headerName: '예산',
          field: 'bdgtAmt',
          width: 150,
          resizable: true,
          sortable: true,
          menuTabs: [],
        },
        {
          headerName: '사용 비용',
          field: 'bdgtUse',
          width: 150,
          resizable: true,
          sortable: true,
          menuTabs: [],
        },
        {
          headerName: '예측 금액',
          field: 'fcstCost',
          width: 150,
          resizable: true,
          sortable: true,
          menuTabs: [],
        },
        {
          headerName: '예산 사용률',
          field: 'bdgtUsageRate',
          // cellRendererFramework: 'PercentBarRenderer', // 커스텀 렌더러 사용
          width: 150,
          resizable: true,
          sortable: true,
          menuTabs: [],
        },
        {
          headerName: '예측 사용률',
          field: 'bdgtPredictedUsageRate',
          width: 150,
          resizable: true,
          sortable: true,
          menuTabs: [],
        },
        {
          headerName: '예산 범위',
          field: 'bdgtRngSepNm',
          width: 110,
          resizable: true,
          sortable: true,
          menuTabs: [],
        },
        {
          headerName: '주기',
          field: 'bdgtMgmtPerdTypNm',
          width: 100,
          resizable: true,
          sortable: true,
          menuTabs: [],
        },
        {
          headerName: '예산 기간',
          field: 'bdgtPeriod',
          width: 160,
          resizable: true,
          sortable: true,
          menuTabs: [],
        },
        {
          headerName: '상태',
          field: 'bdgtStatNm',
          width: 140,
          resizable: true,
          sortable: true,
          menuTabs: [],
        },
      ];
    },
    setData() {
      this.rowData = [
        {
          ctrtNm: '베스핀글로벌 Cloud Infra 공급계약',
          bdgtNm: 'Default Budget',
          bdgtThrs: '초과 (3개)',
          bdgtAmt: '₩130,471,750',
          bdgtUse: '₩130,471,750',
          fcstCost: '₩150,042,513',
          bdgtUsageRate: '101.2%',
          bdgtPredictedUsageRate: '115.5%',
          bdgtRngSepNm: '전체',
          bdgtMgmtPerdTypNm: '월별', // 주기
          bdgtPeriod: '2024.01~2026.12', // 예산 기간
          bdgtStatNm: '활성화', // 상태
        },
        {
          ctrtNm: '베스핀글로벌 Cloud Infra 공급계약',
          bdgtNm: 'Default Budget',
          bdgtThrs: '초과 (3개)',
          bdgtAmt: '₩130,471,750',
          bdgtUse: '₩130,471,750',
          fcstCost: '₩150,042,513',
          bdgtUsageRate: '74.2%',
          bdgtPredictedUsageRate: '80%',
          bdgtRngSepNm: '전체',
          bdgtMgmtPerdTypNm: '월별', // 주기
          bdgtPeriod: '2024.01~2026.12', // 예산 기간
          bdgtStatNm: '활성화', // 상태
        },
      ];
    },
    move() {
      // this.toggle = !this.toggle;

      this.$router.push('/cost/bdgtMgmt/create');
    },
    popup_info_open(e) {
      if (e.target.classList.contains('with_detail')) {
        e.target.classList.remove('with_detail');
      } else {
        e.target.classList.add('with_detail');
      }
    },
    popup_info_close(e) {
      e.target.parentNode.parentNode.classList.remove('with_detail');
    },
  },
};
</script>
<style src="@/assets/jhstyle.css"></style>
