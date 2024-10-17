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
            <div class="el_box_title">
              예산현황
              <div class="popup_info" @click="popup_info_open">
                !
                <div class="popup_info_detail">
                  <b>예산 현황</b>
                  <div class="popup_info_detail_x" @click="popup_info_close">x</div>
                  예산 현황은 로딩 시 대표 예산 또는 목록 중 선택한 예산들을 기준으로 제공됩니다.<br />
                  목록 중 선택한 예산들을 동일한 주기로 환산 후 합산하여 제공합니다.<br />
                  각 항목별 활용 데이터 기간은 툴팁으로 제공됩니다. <br />
                  목록 중 예산들을 선택 후 대표예산 지정을 클릭하여 대표 예산으로 등록/변경 할 수 있습니다.
                </div>
              </div>
            </div>
            <div class="el_box_select_cell_wrap">
              <div class="el_box_select_cell">
                <h5>연간예산</h5>
                <div class="graph"></div>
              </div>
              <div class="el_box_select_cell high">
                <h5>월간예산</h5>
                <div class="graph"></div>
              </div>
              <div class="el_box_select_cell">
                <h5>일간예산</h5>
                <div class="graph"></div>
              </div>
              <div class="el_box_select_cell">
                <h5>알림</h5>
                <div class="ari">
                  <div>
                    <div class="al_cell_top">
                      등록된 알림 수: <b>15<em>개</em></b>
                    </div>
                    <div class="al_cell_top">
                      임계초과 수:
                      <b>
                        <span @click="popup_info_open">
                          4
                          <div class="popup_info_detail">
                            <b>임계 초과</b>
                            <div class="popup_info_detail_x" @click="popup_info_close">x</div>
                            <div class="ovf_table">
                              <table>
                                <thead>
                                  <tr>
                                    <th>예산명</th>
                                    <th>알림 내용</th>
                                    <th>알림 발생일</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Default Budget</td>
                                    <td>
                                      <span class="b">예측 비용</span>이 예산의 <span class="r">100%</span> (약
                                      ₩150,042,513)을 초과하였습니다.
                                    </td>
                                    <td>2024.09.07 15:30</td>
                                  </tr>
                                  <tr>
                                    <td>AI 예산</td>
                                    <td>
                                      <span class="b">예측 비용</span>이 예산의 <span class="r">100%</span> (약
                                      ₩150,863,232)을 초과하였습니다.
                                    </td>
                                    <td>2024.09.07 15:30</td>
                                  </tr>
                                  <tr>
                                    <td>Cloud Infra 전체_월별예산</td>
                                    <td>
                                      <span class="b">예측 비용</span>이 예산의 <span class="r">100%</span> (약
                                      ₩242,728,025)을 초과하였습니다.
                                    </td>
                                    <td>2024.09.07 15:30</td>
                                  </tr>
                                  <tr>
                                    <td>월별 예산</td>
                                    <td>
                                      <span class="b">실제 비용</span>이 예산의 <span class="r">₩200,000,000</span> (약
                                      92%)을 초과하였습니다.
                                    </td>
                                    <td>2024.09.25 14:54</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
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
                        </span>
                        <em>개</em>
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="el_box box-wrap six">
            <div class="el_box_title">
              예산목록
              <div class="popup_info" @click="popup_info_open">
                !
                <div class="popup_info_detail">
                  <b>Default Budget</b>
                  <div class="popup_info_detail_x" @click="popup_info_close">x</div>
                  Default Budget은 Cloud Radar 에서 계약과 과거 사용 비용을 기준으로 자동<br />생성 후 제공하는 관리
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
