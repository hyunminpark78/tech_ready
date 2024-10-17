<template>
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
                              <span class="b">예측 비용</span>이 예산의 <span class="r">100%</span> (약 ₩150,042,513)을
                              초과하였습니다.
                            </td>
                            <td>2024.09.07 15:30</td>
                          </tr>
                          <tr>
                            <td>AI 예산</td>
                            <td>
                              <span class="b">예측 비용</span>이 예산의 <span class="r">100%</span> (약 ₩150,863,232)을
                              초과하였습니다.
                            </td>
                            <td>2024.09.07 15:30</td>
                          </tr>
                          <tr>
                            <td>Cloud Infra 전체_월별예산</td>
                            <td>
                              <span class="b">예측 비용</span>이 예산의 <span class="r">100%</span> (약 ₩242,728,025)을
                              초과하였습니다.
                            </td>
                            <td>2024.09.07 15:30</td>
                          </tr>
                          <tr>
                            <td>월별 예산</td>
                            <td>
                              <span class="b">실제 비용</span>이 예산의 <span class="r">₩200,000,000</span> (약 92%)을
                              초과하였습니다.
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
</template>
<script>
import Section, { SectionNewHeader, SectionMain, SectionLnb } from '@/components/Section';

export default {
  components: {
    SectionNewHeader,
    Section,
    SectionMain,
    SectionLnb,
  },
  data() {
    return {
      toggle: false,
    };
  },
  created() {},
  methods: {
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
