<template>
  <!--  <div class="contents-wrap">-->

  <!--    이것은 상세 보기 페이지 입니다.-->
  <!--  </div>-->
  <div class="detail_cell box-wrap">
    <div class="detail_tit">베스핀글로벌 Cloud Infra 공급계약_예산<button>수정</button><button>삭제</button></div>
    <div class="detail_tab">
      <div class="detail_tab_cell ac" @click="tab_01">예산정보</div>
      <div class="detail_tab_cell" @click="tab_02">사용내역</div>
      <div class="detail_tab_cell" @click="tab_03">알림</div>
    </div>
    <div id="tab_01">
      <div class="detail_content_double">
        <div class="detail_content_cell">
          <h4>예산속성</h4>
          <div class="lb">계약명</div>
          <div class="lb_rest">베스핀글로벌 Cloud Infra 공급계약</div>
          <div class="lb">예산 관리 주기</div>
          <div class="lb_rest">월별</div>
          <div class="lb">주기별 예산 금액</div>
          <div class="lb_rest">₩1,234,567,890</div>
          <div class="lb">예산 적용 기간</div>
          <div class="lb_rest">2023년 12월 ~ 2024년 12월</div>
        </div>
        <div class="detail_content_cell">
          <h4>사용현황</h4>
          <div class="lb">예산 사용률</div>
          <div class="lb_rest">
            <div class="b_gr">
              <div class="b_gr_cell"><div class="b_gr_cell_r" style="width: 100%"></div></div>
              <span class="price">₩1,234,567,890 / ₩1,234,567,890</span>
            </div>
            <div class="b_gr_rest">101.1%</div>
          </div>
          <div class="lb">예측 사용률</div>
          <div class="lb_rest">
            <div class="b_gr">
              <div class="b_gr_cell"><div class="b_gr_cell_g" style="width: 80%"></div></div>
              <span class="price">₩1,234,567,890 / ₩1,234,567,890</span>
            </div>
            <div class="b_gr_rest">80%</div>
          </div>
        </div>
      </div>
      <div class="detail_content_cell">
        <h4>예산범위</h4>
        <div class="lb">예산 범위 설정</div>
        <div class="lb_rest">사용자 지정</div>
        <div class="clear_both"></div>
        <div class="detail-wrap w-8\/12">
          <button class="btn-close" @click="close"><span>접기</span></button>
          <button class="btn-open" @click="open"><span>펼치기</span></button>
          <div class="list">
            <div class="flex my-3">
              <span class="w-1/6 mr-4 text-sm"><strong>계정</strong></span>
              <span class="w-5/6 text-sm text-gray-700 tal"
                >0123456789012 (계정명), 0123456789012 (계정명), 0123456789012 (계정명), 0123456789012 (계정명),
                0123456789012 (계정명)</span
              >
            </div>
            <div class="flex my-3">
              <span class="w-1/6 mr-4 text-sm"><strong>서비스</strong></span>
              <span class="w-5/6 text-sm text-gray-700 tal">Amazon EC2, Amazon SageMaker </span>
            </div>
            <div class="flex my-3">
              <span class="w-1/6 mr-4 text-sm"><strong>리전</strong></span>
              <span class="w-5/6 text-sm text-gray-700 tal">전체</span>
            </div>
            <div class="flex my-3">
              <span class="w-1/6 mr-4 text-sm"><strong>인스턴스</strong></span>
              <span class="w-5/6 text-sm text-gray-700 tal"
                >m7g.medium, m7g.large, m7g.xlarge, m7g.2xlarge, m7g.medium, m7g.large, m7g.xlarge, m7g.2xlarge,
                m7g.medium, m7g.large, m7g.xlarge, m7g.2xlarge, m7g.medium, m7g.large, m7g.xlarge, m7g.2xlarge
              </span>
            </div>
            <div class="flex my-3">
              <span class="w-1/6 mr-4 text-sm"><strong>태그</strong></span>
              <span class="w-5/6 text-sm text-gray-700 tal">태그 키 : 태그 값, 태그 값, 태그 값, 태그 값 </span>
            </div>
          </div>
        </div>
        <div class="lb">비용 집계 기준</div>
        <div class="lb_rest">전체 (지불방법 기준)</div>
      </div>
      <div class="detail_content_cell">
        <h4>알림정보</h4>
        <div class="lb">임계 알림</div>
        <div class="lb_rest">
          <div class="skyblue_box">
            1) <b>실제 비용</b>이 예산의 <b>85%</b>에 도달할 경우,<br />2) <b>실제 비용</b>이 예산의 <b>100%</b>에
            도달할 경우,<br />3) <b>예측 비용</b>이 예산의 <b>100%</b>에 도달할 것으로 예측되는 경우 알림을 받게 됩니다.
          </div>
        </div>
        <div class="lb">수신자 이메일</div>
        <div class="lb_rest">
          eunsol.jeon@bespinglobal.com<br />
          dongjun.kim@bespinglobal.com
        </div>
      </div>
    </div>
    <div id="tab_02" style="display: none">
      <div class="detail_content_cell">
        <h4>사용내역</h4>
        <button class="cost_explorer">Cost Explorer 바로가기</button>
        <div class="usage_gr"></div>
      </div>
      <div class="detail_content_cell">
        <h4>월별 사용 내역</h4>
        <div class="ovf_table">
          <table>
            <thead>
              <tr>
                <th>사용일자</th>
                <th>예산</th>
                <th>실제 비용</th>
                <th>예산 - 실제 비용</th>
                <th>편차율</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024년 08월</td>
                <td>₩123,456,789</td>
                <td>₩123,456,789</td>
                <td>+ ₩123,456,789</td>
                <td>100.0%</td>
              </tr>
              <tr>
                <td>2024년 08월</td>
                <td>₩123,456,789</td>
                <td>₩123,456,789</td>
                <td>+ ₩123,456,789</td>
                <td>100.0%</td>
              </tr>
              <tr>
                <td>2024년 08월</td>
                <td>₩123,456,789</td>
                <td>₩123,456,789</td>
                <td>+ ₩123,456,789</td>
                <td>100.0%</td>
              </tr>
              <tr>
                <td>2024년 08월</td>
                <td>₩123,456,789</td>
                <td>₩123,456,789</td>
                <td>+ ₩123,456,789</td>
                <td>100.0%</td>
              </tr>
              <tr>
                <td>2024년 08월</td>
                <td>₩123,456,789</td>
                <td>₩123,456,789</td>
                <td>+ ₩123,456,789</td>
                <td>100.0%</td>
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
              class="flex items-center justify-center border rounded-sm w-9 h-9 text-xs- text-gray-600 border-gray-300"
            >
              2</button
            ><button
              class="flex items-center justify-center border rounded-sm w-9 h-9 text-xs- text-gray-600 border-gray-300"
            >
              3</button
            ><button
              class="flex items-center justify-center border rounded-sm w-9 h-9 text-xs- text-gray-600 border-gray-300"
            >
              4</button
            ><button
              class="flex items-center justify-center border rounded-sm w-9 h-9 text-xs- text-gray-600 border-gray-300"
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
    </div>
    <div id="tab_03" style="display: none">
      <div class="detail_content_cell">
        <h4>알림 목록</h4>
        <div class="ovf_table">
          <table>
            <colgroup>
              <col style="width: 70%" />
              <col style="width: 30%" />
            </colgroup>
            <thead>
              <tr>
                <th>알림내용</th>
                <th>알림 발생일</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="blu">실제</span> 비용이 예산의 85% (약 ₩123,456,789)을 초과하였습니다.</td>
                <td>2024.09.07 15:30</td>
              </tr>
              <tr>
                <td>
                  <span class="blu">예측</span> 비용이 <span class="red">₩123,456,000</span> (약 90%)을 초과하였습니다.
                </td>
                <td>2024.09.07 15:30</td>
              </tr>
              <tr>
                <td>
                  <span class="blu">실제</span> 비용이 예산의 <span class="red">100%</span> (약 ₩123,456,789)을
                  초과하였습니다.
                </td>
                <td>2024.09.07 15:30</td>
              </tr>
              <tr>
                <td>
                  <span class="blu">실제</span> 비용이 예산의 <span class="red">100%</span> (약 ₩123,456,789)을
                  초과하였습니다.
                </td>
                <td>2024.09.07 15:30</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="detail_content_cell">
        <h4>추천 사항</h4>
        <div class="ovf_table">
          <table>
            <thead>
              <tr>
                <th>계정</th>
                <th>서비스</th>
                <th>최적화 종류</th>
                <th>추천 종류</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>bespin_prd(123456789012)</td>
                <td>EC2</td>
                <td>자원 최적화</td>
                <td>Rightsizing</td>
              </tr>
              <tr>
                <td>bespin_prd(123456789012)</td>
                <td>EC2</td>
                <td>자원 최적화</td>
                <td>Rightsizing</td>
              </tr>
              <tr>
                <td>bespin_prd(123456789012)</td>
                <td>EC2</td>
                <td>자원 최적화</td>
                <td>Rightsizing</td>
              </tr>
              <tr>
                <td>bespin_prd(123456789012)</td>
                <td>EC2</td>
                <td>자원 최적화</td>
                <td>Rightsizing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
  },
  methods: {
    ...mapActions('bill', [
      // 'fetchTrend',
      'fetchTrendYear',
      'fetchChrgYm',
      // 'fetchSummary',
      // 'fetchBill',
      'fetchBillDetail',
      // 'fetchCtrt',
      'addFilter',
      'removeFilter',
      'setFilter',
    ]),
    close() {
      document.querySelector('.detail-wrap').classList.add('closed');
    },
    open() {
      document.querySelector('.detail-wrap').classList.remove('closed');
    },
    tab_01(e) {
      let tabs = e.target.parentNode.children;
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('ac');
      }
      e.target.classList.add('ac');
      document.querySelector('#tab_01').style.display = 'block';
      document.querySelector('#tab_02').style.display = 'none';
      document.querySelector('#tab_03').style.display = 'none';
    },
    tab_02(e) {
      let tabs = e.target.parentNode.children;
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('ac');
      }
      e.target.classList.add('ac');
      document.querySelector('#tab_01').style.display = 'none';
      document.querySelector('#tab_02').style.display = 'block';
      document.querySelector('#tab_03').style.display = 'none';
    },
    tab_03(e) {
      let tabs = e.target.parentNode.children;
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('ac');
      }
      e.target.classList.add('ac');
      document.querySelector('#tab_01').style.display = 'none';
      document.querySelector('#tab_02').style.display = 'none';
      document.querySelector('#tab_03').style.display = 'block';
    },
  },
};
</script>
<style src="@/assets/jhstyle.css"></style>
