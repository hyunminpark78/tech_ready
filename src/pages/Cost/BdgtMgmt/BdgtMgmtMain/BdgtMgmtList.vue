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
        :grid-options="gridOptions"
        :row-data="rowData"
        :column-defs="columnDefs"
        :suppress-context-menu="true"
        :pagination="true"
        :suppress-pagination-panel="true"
        :suppress-scroll-on-new-data="true"
        @grid-ready="onGridReady"
        @selection-changed="onSelectionChanged"
        @cellClicked="onCellClicked"
      ></ag-grid-vue>
      <GridPagenate
        :total-cnt="pageObj.totalCnt"
        :total-page-cnt="5"
        :page-no="pageObj.currentPageNo"
        :page-size="1"
        @onBtnNext="onBtnNext"
        @onBtPrevious="onBtPrevious"
        @clickPage="clickPage"
      />
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
import { chartColorByUseRate } from '@/pages/Opti/CostOpti/CmmtPsblTgt/CostOptiCommon';
import GridPagenate from '@/components/GridPagenate.vue';
import { isEqual } from 'lodash';

export default {
  components: {
    GridPagenate,
    AgGridVue,
    SectionNewHeader,
    Section,
    SectionMain,
    SectionLnb,
  },
  props: {
    bdgtListData: {
      type: [Object, Array],
    },
  },
  data: function () {
    return {
      gridOptions: null,
      toggle: false,
      columnDefs: null,
      rowData: null,
      height: '174px',
      pageObj: {
        currentPageNo: 1,
        pageSize: 10,
        totalCnt: 0,
      },
    };
  },
  // watch: {
  //   bdgtListData(newVal, oldVal) {
  //     console.log('1');
  //     if (!isEqual(newVal, oldVal)) {
  //       console.log('2');
  //       this.setData(newVal);
  //     }
  //   },
  // },
  created() {
    this.setColumn();
    this.setData();
  },
  beforeMount() {
    this.gridOptions = {
      rowSelection: 'multiple',
      suppressRowClickSelection: true, // 셀 텍스트 선택 가능
      enableCellTextSelection: true, // 셀 텍스트 선택 가능
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
    },
    onSelectionChanged() {
      const selectedRows = this.gridApi.getSelectedRows();
      console.log('Selected rows:', selectedRows);
      // 선택된 체크박스에 대한 추가 처리 로직
    },
    onCellClicked(event) {
      // console.log('field', event.colDef.field);
      if (event.colDef.field === 'bdgtProp.bdgtNm') {
        this.$emit('switch', 'detail');
        // const selectedRows = this.gridApi.getSelectedRows();
        // 클릭된 셀 정보 출력
        // console.log('Cell clicked', event);
        // console.log('Row data:', event.data);
        // console.log('Column field:', event.colDef.field);
      }
    },
    onBtnNext() {
      this.gridApi.paginationGoToNextPage();
    },
    onBtPrevious() {
      this.gridApi.paginationGoToPreviousPage();
    },
    clickPage(page) {
      this.gridApi.paginationGoToPage(page);
    },
    setColumn() {
      this.columnDefs = [
        {
          field: 'ctrtId',
          hide: true,
        },
        {
          headerName: '계약명',
          checkboxSelection: true, // 각 행에 체크박스 추가
          width: 280,
          field: 'ctrtNm',
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center'],
        },
        {
          headerName: '예산 이름',
          field: 'bdgtProp.bdgtNm',
          width: 140,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center', 'cell-pointer'],
          cellStyle: { color: '#00A6ED' },
        },
        {
          headerName: '임계 경보',
          field: 'bdgtThrs',
          width: 130,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center'],
          // 계약에 임계 경보가 하나라도 있으면 '초과(num개)'로 표시
          // 없으면 '정상'으로 표시
          cellRenderer: (params) => {
            let budgetThrs = params.value;
            let count = 0;
            let stat = '정상';
            budgetThrs.forEach((budget) => {
              if (budget.thrsStatNm === 'Exceeded') {
                count++;
                stat = '초과';
              }
            });
            if (count === 0) {
              return stat;
            } else {
              return `${stat}(${count}개)`;
            }
          },
        },
        {
          headerName: '예산',
          field: 'bdgtProp.bdgtAmt',
          width: 140,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center'],
          cellRenderer: (params) => {
            let value = params.value;
            return `￦${this.formatNumber(value)}`;
          },
        },
        {
          headerName: '사용 비용',
          field: 'bdgtUseDts',
          width: 140,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center'],
          cellRenderer: (params) => {
            let bdgtUseDts = params.value;
            let unblendCost = 0;
            bdgtUseDts.forEach((budget) => {
              unblendCost = unblendCost + budget.unblendCost;
            });
            return `￦${this.formatNumber(unblendCost)}`;
          },
        },
        {
          headerName: '예측 금액',
          field: 'bdgtInfo.fcstCost',
          width: 150,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center'],
          cellRenderer: (params) => {
            let value = params.value;
            return `￦${this.formatNumber(value)}`;
          },
        },
        {
          headerName: '예산 사용률',
          field: 'bdgtUsageRate',
          // cellRendererFramework: 'PercentBarRenderer', // 커스텀 렌더러 사용
          width: 150,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center', 'percentType'],
          cellRenderer: (params) => {
            const bdgtUseDts = params.data.bdgtUseDts;
            // 사용금액
            let unblendCost = 0;
            bdgtUseDts.forEach((budget) => {
              unblendCost = unblendCost + budget.unblendCost;
            });
            // 예산금액
            const bdgtAmt = params.data.bdgtProp.bdgtAmt;
            // 사용률 = 사용금액 / 예산금액 * 100
            const useRate = (unblendCost / bdgtAmt) * 100;
            return `<div class="outDivBox">
              <div class="percent-text"><span>${this.formatToFixed(useRate)}%</span></div>
              <div class="percent-box">
                <div class="fill" style="--percent:${this.formatToFixed(useRate)}%;--fill-color:${chartColorByUseRate(
              useRate
            )}"></div>
              </div>
            </div>`;
          },
        },
        {
          headerName: '예측 사용률',
          field: 'bdgtPredictedUsageRate',
          width: 150,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center', 'percentType'],
          cellRenderer: (params) => {
            // 예측 사용률 = (예측 비용 / 예산 금액) * 100
            // 예측 비용
            const fcstCost = params.data.bdgtInfo.fcstCost;
            // 예산 금액
            // 예산금액
            const bdgtAmt = params.data.bdgtProp.bdgtAmt;
            const fcstRate = (fcstCost / bdgtAmt) * 100;
            return `<div class="outDivBox">
              <div class="percent-text"><span>${this.formatToFixed(fcstRate)}%</span></div>
              <div class="percent-box">
                <div class="fill" style="--percent:${this.formatToFixed(fcstRate)}%;--fill-color:${chartColorByUseRate(
              fcstRate
            )}"></div>
              </div>
            </div>`;
          },
        },
        {
          headerName: '예산 범위',
          field: 'bdgtProp.bdgtRngSepNm',
          width: 110,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center'],
        },
        {
          headerName: '주기',
          field: 'bdgtProp.bdgtMgmtPerdTypNm',
          width: 86,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center'],
          cellRenderer: (params) => {
            if (params.value === 'Yearly') {
              return '연별';
            }
            if (params.value === 'Monthly') {
              return '월별';
            }
            if (params.value === 'Daily') {
              return '일별';
            }
          },
        },
        {
          headerName: '예산 기간',
          field: 'bdgtPeriod',
          width: 160,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center'],
          cellRenderer: (params) => {
            // 예산시작년월 ~ 예산종료년월
            let bdgtAplyStrYm = params.data.bdgtProp.bdgtAplyStrYm.toString().replace(/(\d{4})(\d{2})/, '$1.$2'); // 예산적용시작년월
            let bdgtAplyEndYm = params.data.bdgtProp.bdgtAplyEndYm.toString().replace(/(\d{4})(\d{2})/, '$1.$2'); // 예산적용종료년월
            return `${bdgtAplyStrYm} ~ ${bdgtAplyEndYm}`;
          },
        },
        {
          headerName: '상태',
          field: 'bdgtInfo.bdgtStatNm',
          width: 120,
          resizable: true,
          sortable: true,
          menuTabs: [],
          headerClass: ['text-center'],
          cellClass: ['ag-grid-color-font', 'text-center'],
          cellRenderer: (params) => {
            // Active - 활성화 - 현재 날짜가 적용기간 내에 있을 경우
            // Creating - 생성중 - 현재 날짜가 적용기간 내에 있고, 생성중 체크된 경우
            // Updating - 수정중 - 현재 날짜가 적용기간 내에 있고, 수정중 체크된 경우
            // Expired - 만료 - 현재 날짜가 적용종료기간 이후일 경우
            // Pending - 대기 - 현재 날짜가 적용시작기간 이전일 경우
            if (params.value === 'Active') {
              return '활성화';
            }
            if (params.value === 'Creating') {
              return '생성중';
            }
            if (params.value === 'Updating') {
              return '수정중';
            }
            if (params.value === 'Expired') {
              return '만료';
            }
            if (params.value === 'Pending') {
              return '대기';
            }
          },
        },
      ];
    },
    setData() {
      this.rowData = this.bdgtListData;
      // if (listData !== undefined) {
      //   this.rowData = listData;
      // }
    },
    move() {
      this.$emit('switch', 'create');
      // this.toggle = !this.toggle;
      // this.$router.push('/cost/bdgtMgmt/create');
    },
    formatNumber(num) {
      if (num === '-') {
        return num;
      } else if (num === undefined) {
        return '-';
      } else {
        // 천 단위마다 쉼표를 추가
        return new Intl.NumberFormat().format(num);
      }
    },
    formatToFixed(num) {
      // 소수점 첫째자리로 표기
      let number = parseFloat(num);
      if (number !== 0) {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(number);
      } else {
        return 0;
      }
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
<style>
.ovf_table .ag-invisible div div input[type='checkbox'] {
  background-color: #52525245;
  opacity: 100 !important;
}
.ovf_table .ag-theme-alpine .cell-pointer {
  cursor: pointer;
}
.ovf_table .ag-theme-alpine .ag-row-selected .ag-grid-font,
.ovf_table .ag-theme-alpine .ag-row-selected .ag-grid-color-font {
  color: #4a4a4a !important;
}
.ovf_table .ag-theme-alpine .ag-row-selected {
  background-color: #eefaff !important;
}
.outDivBox {
  height: 100%;
  width: 100%;
  display: flex; /* Flexbox 레이아웃 사용 */
  flex-direction: column;
}
.outDivBox .percent-text {
  width: 110px;
  height: 20px;
  margin: 2px 0 5px 0;
  display: flex;
  justify-content: center;
}
.outDivBox .percent-box {
  /* width: 100%; */
  width: 110px;
  height: 10px;
  margin: 5px 0 5px 0;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
}
.outDivBox .fill {
  flex-grow: 1;
  background: linear-gradient(
    to right,
    var(--fill-color) 0%,
    var(--fill-color) var(--percent),
    transparent var(--percent)
  );
}
</style>
