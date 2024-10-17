<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <main class="main">
      <div class="contents">
        <Section>
          <SectionNewHeader
            title-class="flex items-center py-5"
            :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
            :title="'예산관리'"
            :title2="'예산관리'"
            :main-icon="{ src: require('@/assets/images/ico-cost.svg') }"
          />
        </Section>
        <SectionMain>
          <div class="el_box box-wrap">
            <div class="el_box_title">예산현황</div>
            <div class="el_box_select_cell_wrap">
              <div class="el_box_select_cell">
                <h5>연간예산</h5>
                <div class="graph"></div>
              </div>
              <div class="el_box_select_cell">
                <h5>월간예산</h5>
                <div class="graph"></div>
              </div>
              <div class="el_box_select_cell">
                <h5>일간예산</h5>
                <div class="graph"></div>
              </div>
              <div class="el_box_select_cell">
                <h5>알림</h5>
                <div style="width: 100%; height: 170px; display: flex; justify-content: center; align-items: center">
                  <div>
                    <div class="al_cell_top">등록된 알림 수: <b>15개</b></div>
                    <div class="al_cell_top">
                      임계초과 수: <b><span>4</span>개</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="el_box box-wrap">
            <div class="el_box_title">예산목록</div>
            <div class="title">
              <div class="search-wrap">
                <span style="color: #00a5f0; font-weight: bold; margin-right: 20px"
                  ><img
                    src="@/assets/icon.png"
                    alt=""
                    style="
                      width: 14px;
                      height: 14px;
                      display: inline-block;
                      vertical-align: top;
                      margin-top: 10px;
                      margin-right: 10px;
                    "
                  />대표예산 지정</span
                ><input type="text" placeholder="검색어를 입력하세요" class="keyword" />
                <a href="#" class="btn">검색</a>
              </div>
              <div class="pos-right">
                <span class="date" style="margin-right: 24px">기준시간 : 2024.9.25 11:35</span>

                <a class="btn" style="cursor: pointer" @click="move">예산생성</a>
              </div>
            </div>
            <div class="ovf_table">
              <table>
                <thead>
                  <tr>
                    <th>계약명</th>
                    <th>예산이름</th>
                    <th>임계정보</th>
                    <th>예산</th>
                    <th>사용비용</th>
                    <th>예측금액</th>
                    <th>예산 사용률</th>
                    <th>예측 사용률</th>
                    <th>예산범위</th>
                    <th>주기</th>
                    <th>예산기간</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="text-align: left">
                      <input type="checkbox" id="ch1" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>
                    </td>
                    <td>Default Budget</td>
                    <td>초과 (3개)</td>
                    <td>₩130,471,750</td>
                    <td>₩130,471,750</td>
                    <td>₩150,042,513</td>
                    <td>
                      <div class="br_ch">
                        <span class="r">101.2%</span>
                        <div class="bar">
                          <div class="bar_cell r" style="width: 100%"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="br_ch">
                        <span class="r">115.5%</span>
                        <div class="bar">
                          <div class="bar_cell b" style="width: 100%"></div>
                        </div>
                      </div>
                    </td>
                    <td>전체</td>
                    <td>월별</td>
                    <td>2024.01~2026.12</td>
                    <td>활성화</td>
                  </tr>
                  <tr>
                    <td style="text-align: left">
                      <input type="checkbox" id="ch1" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>
                    </td>
                    <td>Default Budget</td>
                    <td>초과 (3개)</td>
                    <td>₩130,471,750</td>
                    <td>₩130,471,750</td>
                    <td>₩150,042,513</td>
                    <td>
                      <div class="br_ch">
                        <span class="b">74.2%</span>
                        <div class="bar">
                          <div class="bar_cell g" style="width: 74.2%"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="br_ch">
                        <span>80%</span>
                        <div class="bar">
                          <div class="bar_cell b" style="width: 80%"></div>
                        </div>
                      </div>
                    </td>
                    <td>전체</td>
                    <td>월별</td>
                    <td>2024.01~2026.12</td>
                    <td>활성화</td>
                  </tr>
                  <tr>
                    <td style="text-align: left">
                      <input type="checkbox" id="ch1" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>
                    </td>
                    <td>Default Budget</td>
                    <td>초과 (3개)</td>
                    <td>₩130,471,750</td>
                    <td>₩130,471,750</td>
                    <td>₩150,042,513</td>
                    <td>
                      <div class="br_ch">
                        <span class="b">74.2%</span>
                        <div class="bar">
                          <div class="bar_cell g" style="width: 74.2%"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="br_ch">
                        <span>80%</span>
                        <div class="bar">
                          <div class="bar_cell b" style="width: 80%"></div>
                        </div>
                      </div>
                    </td>
                    <td>전체</td>
                    <td>월별</td>
                    <td>2024.01~2026.12</td>
                    <td>활성화</td>
                  </tr>
                  <tr>
                    <td style="text-align: left">
                      <input type="checkbox" id="ch1" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>
                    </td>
                    <td>Default Budget</td>
                    <td>초과 (3개)</td>
                    <td>₩130,471,750</td>
                    <td>₩130,471,750</td>
                    <td>₩150,042,513</td>
                    <td>
                      <div class="br_ch">
                        <span class="b">74.2%</span>
                        <div class="bar">
                          <div class="bar_cell g" style="width: 74.2%"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="br_ch">
                        <span>80%</span>
                        <div class="bar">
                          <div class="bar_cell b" style="width: 80%"></div>
                        </div>
                      </div>
                    </td>
                    <td>전체</td>
                    <td>월별</td>
                    <td>2024.01~2026.12</td>
                    <td>활성화</td>
                  </tr>
                  <tr>
                    <td style="text-align: left">
                      <input type="checkbox" id="ch1" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>
                    </td>
                    <td>Default Budget</td>
                    <td>초과 (3개)</td>
                    <td>₩130,471,750</td>
                    <td>₩130,471,750</td>
                    <td>₩150,042,513</td>
                    <td>
                      <div class="br_ch">
                        <span class="b">74.2%</span>
                        <div class="bar">
                          <div class="bar_cell g" style="width: 74.2%"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="br_ch">
                        <span>80%</span>
                        <div class="bar">
                          <div class="bar_cell b" style="width: 80%"></div>
                        </div>
                      </div>
                    </td>
                    <td>전체</td>
                    <td>월별</td>
                    <td>2024.01~2026.12</td>
                    <td>활성화</td>
                  </tr>
                  <tr>
                    <td style="text-align: left">
                      <input type="checkbox" id="ch1" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>
                    </td>
                    <td>Default Budget</td>
                    <td>초과 (3개)</td>
                    <td>₩130,471,750</td>
                    <td>₩130,471,750</td>
                    <td>₩150,042,513</td>
                    <td>
                      <div class="br_ch">
                        <span class="b">74.2%</span>
                        <div class="bar">
                          <div class="bar_cell g" style="width: 74.2%"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="br_ch">
                        <span>80%</span>
                        <div class="bar">
                          <div class="bar_cell b" style="width: 80%"></div>
                        </div>
                      </div>
                    </td>
                    <td>전체</td>
                    <td>월별</td>
                    <td>2024.01~2026.12</td>
                    <td>활성화</td>
                  </tr>
                  <tr>
                    <td style="text-align: left">
                      <input type="checkbox" id="ch1" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>
                    </td>
                    <td>Default Budget</td>
                    <td>초과 (3개)</td>
                    <td>₩130,471,750</td>
                    <td>₩130,471,750</td>
                    <td>₩150,042,513</td>
                    <td>
                      <div class="br_ch">
                        <span class="b">74.2%</span>
                        <div class="bar">
                          <div class="bar_cell g" style="width: 74.2%"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="br_ch">
                        <span>80%</span>
                        <div class="bar">
                          <div class="bar_cell b" style="width: 80%"></div>
                        </div>
                      </div>
                    </td>
                    <td>전체</td>
                    <td>월별</td>
                    <td>2024.01~2026.12</td>
                    <td>활성화</td>
                  </tr>
                  <tr>
                    <td style="text-align: left">
                      <input type="checkbox" id="ch1" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>
                    </td>
                    <td>Default Budget</td>
                    <td>초과 (3개)</td>
                    <td>₩130,471,750</td>
                    <td>₩130,471,750</td>
                    <td>₩150,042,513</td>
                    <td>
                      <div class="br_ch">
                        <span class="b">74.2%</span>
                        <div class="bar">
                          <div class="bar_cell g" style="width: 74.2%"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="br_ch">
                        <span>80%</span>
                        <div class="bar">
                          <div class="bar_cell b" style="width: 80%"></div>
                        </div>
                      </div>
                    </td>
                    <td>전체</td>
                    <td>월별</td>
                    <td>2024.01~2026.12</td>
                    <td>활성화</td>
                  </tr>
                  <tr>
                    <td style="text-align: left">
                      <input type="checkbox" id="ch1" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>
                    </td>
                    <td>Default Budget</td>
                    <td>초과 (3개)</td>
                    <td>₩130,471,750</td>
                    <td>₩130,471,750</td>
                    <td>₩150,042,513</td>
                    <td>
                      <div class="br_ch">
                        <span class="b">74.2%</span>
                        <div class="bar">
                          <div class="bar_cell g" style="width: 74.2%"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="br_ch">
                        <span>80%</span>
                        <div class="bar">
                          <div class="bar_cell b" style="width: 80%"></div>
                        </div>
                      </div>
                    </td>
                    <td>전체</td>
                    <td>월별</td>
                    <td>2024.01~2026.12</td>
                    <td>활성화</td>
                  </tr>
                  <tr>
                    <td style="text-align: left">
                      <input type="checkbox" id="ch1" /><label for="ch1">베스핀글로벌 Cloud Infra 공급계약</label>
                    </td>
                    <td>Default Budget</td>
                    <td>초과 (3개)</td>
                    <td>₩130,471,750</td>
                    <td>₩130,471,750</td>
                    <td>₩150,042,513</td>
                    <td>
                      <div class="br_ch">
                        <span class="b">74.2%</span>
                        <div class="bar">
                          <div class="bar_cell g" style="width: 74.2%"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="br_ch">
                        <span>80%</span>
                        <div class="bar">
                          <div class="bar_cell b" style="width: 80%"></div>
                        </div>
                      </div>
                    </td>
                    <td>전체</td>
                    <td>월별</td>
                    <td>2024.01~2026.12</td>
                    <td>활성화</td>
                  </tr>
                </tbody>
              </table>
              <div class="flex items-center justify-center my-7 pagination">
                <button style="visibility: hidden">
                  <img src="@/assets/images/btn-first.svg" alt="처음 페이지" />
                </button>
                <button style="visibility: hidden">
                  <img src="@/assets/images/btn-pre.svg" alt="이전 페이지" />
                </button>
                <button
                  class="
                    flex
                    items-center
                    justify-center
                    border
                    rounded-sm
                    w-9
                    h-9
                    text-xs- text-white
                    border-primary-400
                    bg-primary-400
                  "
                >
                  1</button
                ><button
                  class="
                    flex
                    items-center
                    justify-center
                    border
                    rounded-sm
                    w-9
                    h-9
                    text-xs- text-gray-600
                    border-gray-300
                  "
                >
                  2</button
                ><button
                  class="
                    flex
                    items-center
                    justify-center
                    border
                    rounded-sm
                    w-9
                    h-9
                    text-xs- text-gray-600
                    border-gray-300
                  "
                >
                  3</button
                ><button
                  class="
                    flex
                    items-center
                    justify-center
                    border
                    rounded-sm
                    w-9
                    h-9
                    text-xs- text-gray-600
                    border-gray-300
                  "
                >
                  4</button
                ><button
                  class="
                    flex
                    items-center
                    justify-center
                    border
                    rounded-sm
                    w-9
                    h-9
                    text-xs- text-gray-600
                    border-gray-300
                  "
                >
                  5
                </button>
                <button>
                  <img src="@/assets/images/btn-pre.svg" alt="다음 페이지" class="rotate-180-" />
                </button>
                <button>
                  <img src="@/assets/images/btn-first.svg" alt="마지막 페이지" class="rotate-180-" />
                </button>
              </div>
            </div>
          </div>
        </SectionMain>
      </div>
    </main>

    <!-- <input type="button" value="등록하기" @click="move" /> -->
    <!--    <BdgtMgmtCreate v-if="toggle" />-->
    <!-- 여기에 작업 부탁 드립니다!!!
    <input type="button" value="상세보기" @click="move2" /> -->
    <!--    <BdgtMgmtCreate v-if="toggle" />-->
    <!--이것은 상세 보기 버튼입니다. -->
  </div>
</template>

<script>
import Section, { SectionNewHeader, SectionMain, SectionLnb } from '@/components/Section';
import BdgtMgmtCreate from '@/pages/Cost/BdgtMgmt/BdgtMgmtCreate';
export default {
  components: {
    SectionNewHeader,
    Section,
    SectionMain,

    SectionLnb,
    BdgtMgmtCreate,
  },
  data() {
    return {
      toggle: false,
    };
  },
  created() {},
  methods: {
    move() {
      // this.toggle = !this.toggle;

      this.$router.push('/cost/bdgtMgmt/create');
    },
    move2() {
      // this.toggle = !this.toggle;

      this.$router.push('/cost/bdgtMgmt/detail');
    },
  },
};
</script>
<style lang="css" scoped>
* {
  box-sizing: border-box;
}
.el_box {
  width: 100%;
  position: relative;
  height: auto;
  background: white;
  border: 1px solid #e3ebf1;
  border-radius: 7px;
  margin-bottom: 16px;
  padding-top: 80px;
  line-height: 18px;
}

.el_box_title {
  width: 100%;
  height: 80px;
  line-height: 80px;
  border-bottom: 0px solid #e3ebf1;
  position: absolute;
  left: 0px;
  top: 0px;
  text-align: left;
  padding-left: 31px;
  font-size: 19px;
  font-weight: bold;
  color: black;
}
.el_box_select_cell_wrap {
  display: flex;
  flex-direction: row;
}
.el_box_select_cell {
  width: auto;
  height: 265px;
  border: 1px solid #00c1ff;
  position: relative;
  margin: 0px;
  padding: 20px;
  flex: 1;
  border-radius: 4px;
  margin: 7px;
  margin-bottom: 30px;
}
.el_box_select_cell h5 {
  display: block;
  font-size: 14px;
  font-weight: Bold;
  color: rgba(0, 165, 237, 1);
  padding: 0px;
  margin: 0px;
}
.el_box_select_cell:first-of-type {
  margin-left: 30px;
}
.el_box_select_cell:last-of-type {
  margin-right: 30px;
}

.al_cell_top {
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #e9ebed;
  text-align: center;
  line-height: 80px;
  font-size: 21px;
  font-weight: bold;
  color: #ababab;
}
.al_cell_top:last-of-type {
  border-bottom: 0px solid #d4d4d4;
}
.al_cell_top b {
  font-size: 34px;
  font-weight: lighter;
  color: black;
  margin-left: 10px;
}
.al_cell_top b span {
  color: #00c1ff;
}
.al_cell_bottom_left {
  float: left;
  width: calc(50% - 1px);
  border-right: 1px solid #e9ebed;
  height: 110px;
  text-align: center;
  line-height: 22px;
  padding-top: 20px;
  font-size: 18px;
  font-weight: Bold;
  color: #ababab;
}
.al_cell_bottom_left b {
  display: block;
  font-size: 38px;
  font-weight: normal;
  color: black;
  margin-top: 26px;
}
.al_cell_bottom_right {
  float: left;
  width: 50%;
  border-right: 0px solid #e9ebed;
  height: 110px;
  text-align: center;
  line-height: 22px;
  padding-top: 20px;
  font-size: 18px;
  font-weight: Bold;
  color: #ababab;
}
.al_cell_bottom_right b {
  display: block;
  font-size: 38px;
  font-weight: normal;
  color: black;
  margin-top: 26px;
}
.el_box_select_cell .graph {
  width: 100%;
  height: 180px;
  background: #f4f4f4;
  position: relative;
  margin-top: 20px;
}
.el_box .ovf_table {
  width: 100%;
  height: auto;
  white-space: nowrap;
  overflow: auto;
}
.el_box .ovf_table table {
  width: 100%;
  height: auto;
  border-collapse: collapse;
}
.el_box .ovf_table table th {
  width: auto;
  height: auto;
  line-height: 18px;
  padding: 10px;
  background: #f1f9ff;
  border-top: 1px solid #e3ebf1;
  border-bottom: 1px solid #e3ebf1;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: #5ba9cd;
  position: relative;
}
.el_box .ovf_table table td {
  width: auto;
  height: auto;
  line-height: 18px;
  font-size: 14px;
  font-weight: normal;
  color: black;
  padding: 10px;
  border-bottom: 1px solid #e3ebf1;
  text-align: center;
  position: Relative;
}
.el_box .ovf_table table td input[type='checkbox'] {
  opacity: 0.5;
  margin-right: 12px;
}
.el_box .ovf_table table th:after {
  content: '';
  display: block;
  width: 1px;
  height: 14px;
  background: #d5dce3;
  position: absolute;
  right: 0px;
  top: 50%;
  margin-top: -7px;
}
.el_box .ovf_table table th:last-of-type:after {
  display: none;
}
.pos-right .download:before {
  display: none;
}
.el_box .ovf_table table td .br_ch {
  width: 100%;
  height: 20px;
  position: Relative;
  line-height: 10px;
}
.el_box .ovf_table table td .br_ch .bar {
  width: 100%;
  height: 6px;
  background: #e1e1e1;
  bottom: 0px;
  left: 0px;
  position: absolute;
}
.el_box .ovf_table table td .br_ch span {
  font-size: 11px;
  font-weight: normal;
  color: black;
  line-height: 10px;
}
.el_box .ovf_table table td .br_ch span.b {
  font-size: 11px;
  font-weight: normal;
  color: #2759bf;
}
.el_box .ovf_table table td .br_ch span.r {
  font-size: 11px;
  font-weight: normal;
  color: #ff0000;
}
.el_box .ovf_table table td .br_ch .bar .bar_cell {
  width: 50%;
  height: 6px;
  position: Absolute;
  left: 0px;
  top: 0px;
}
.el_box .ovf_table table td .br_ch .bar .bar_cell.r {
  background: #fc5aa1;
}
.el_box .ovf_table table td .br_ch .bar .bar_cell.g {
  background: #6dd02a;
}
.el_box .ovf_table table td .br_ch .bar .bar_cell.b {
  background: #2cc2fd;
}
</style>
