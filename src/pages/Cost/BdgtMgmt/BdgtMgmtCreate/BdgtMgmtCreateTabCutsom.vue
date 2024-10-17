<template>
  <div>
    <!-- 예산 생성 탭 상세 -->
    <div>
      <!-- 예산 생성 탭 상세 왼쪽 -->
      <div class="create_cell_left">
        <!--          <div class="cont">-->
        <!--            <h4><span>1</span>카테고리 선택</h4>-->
        <!--            <div class="mini">AI 서비스 예산을 적용할 카테고리를 선택해 주세요.</div>-->
        <!--            <div class="mini_tab">-->
        <!--              <div class="mini_tab_cell ac">-->
        <!--                <b>GPU 인스턴스</b>-->
        <!--                GPU를 사용하는 인스턴스를<br />대상으로 예산을 생성합니다.-->
        <!--              </div>-->
        <!--              <div class="mini_tab_cell">-->
        <!--                <b>기계학습 서비스</b>-->
        <!--                기계학습에 특화된 서비스를<br />대상으로 예산을 생성합니다.-->
        <!--              </div>-->
        <!--              <div class="mini_tab_cell">-->
        <!--                <b>AI 서비스</b>-->
        <!--                GPU 인스턴스와 기계학습 서비스를<br />대상으로 예산을 생성합니다.-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <div class="cont">
          <h4>
            <span>2</span>
            계약 선택
            <select>
              <option>베스핀글로벌 Cloud Infra 공급계약</option>
              <option>베스핀글로벌 Cloud Infra 공급계약</option>
              <option>베스핀글로벌 Cloud Infra 공급계약</option>
              <option>베스핀글로벌 Cloud Infra 공급계약</option>
            </select>
          </h4>
        </div>
        <div class="cont">
          <h4><span>3</span>예산 정보</h4>
          <div class="mini">예산 기간동안 주기별로 예산금액이 초기화 됩니다.</div>
          <!--            <div class="labeling">예산 이름</div>-->
          <div class="labeling">예산 명</div>
          <div class="label_rest">
            <input type="text" value="베스핀글로벌 Cloud Infra 공급계약_월별 예산" />
            <span class="span">예산 이름은 80자(영문,숫자 기준) 이내로 입력해 주세요. </span>
          </div>
          <div class="labeling">예산 관리 주기</div>
          <div class="label_rest">
            <select>
              <option>일별</option>
              <option>일별</option>
              <option>일별</option>
              <option>일별</option>
            </select>
          </div>
          <div class="labeling">주기별 예산 금액</div>
          <div class="label_rest">
            <input type="text" value="1,234" style="width: 50%" />
            <div class="gr_info"></div>
          </div>
          <div class="labeling">예산 적용 기간</div>
          <div class="label_rest">
            <input type="text" value="2023" style="width: 70px" />&nbsp; 년&nbsp;&nbsp;
            <input type="text" value="12" style="width: 70px" />&nbsp; 월 &nbsp;&nbsp;&nbsp;&nbsp; ~
            &nbsp;&nbsp;&nbsp;&nbsp; <input type="text" value="2024" style="width: 70px" />&nbsp; 년&nbsp;&nbsp;
            <input type="text" value="12" style="width: 70px" />&nbsp; 월
          </div>
        </div>
        <div class="cont">
          <h4><span>4</span>예산 범위</h4>
          <div class="labeling">계정</div>
          <div class="label_rest">
            <select class="big">
              <option>계정 선택 (1개)</option>
              <option>계정 선택 (1개)</option>
              <option>계정 선택 (1개)</option>
              <option>계정 선택 (1개)</option>
            </select>
          </div>
          <div class="labeling">서비스</div>
          <div class="label_rest">
            <div class="select_big" @click="open_select">
              서비스 선택 (3개)
              <div class="select_big_cell">
                <div class="search">
                  <input type="text" placeholder="검색어를 입력해 주세요" />
                </div>
                <div class="search_ovf">
                  <table>
                    <tbody>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="search_btns">
                  <button class="close_btn" @click="close_select">닫기</button>
                  <button class="sel_btn">선택완료</button>
                </div>
              </div>
            </div>
          </div>

          <div class="labeling">리전</div>
          <div class="label_rest">
            <div class="select_big" @click="open_select">
              리전 선택 (5개)
              <div class="select_big_cell">
                <div class="search">
                  <input type="text" placeholder="검색어를 입력해 주세요" />
                </div>
                <div class="search_ovf">
                  <table>
                    <tbody>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="search_btns">
                  <button class="close_btn" @click="close_select">닫기</button>
                  <button class="sel_btn">선택완료</button>
                </div>
              </div>
            </div>
          </div>
          <div class="labeling">인스턴스</div>
          <div class="label_rest">
            <div class="select_big" @click="open_select">
              전체
              <div class="select_big_cell">
                <div class="search">
                  <input type="text" placeholder="검색어를 입력해 주세요" />
                </div>
                <div class="search_ovf">
                  <table>
                    <tbody>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="search_btns">
                  <button class="close_btn" @click="close_select">닫기</button>
                  <button class="sel_btn">선택완료</button>
                </div>
              </div>
            </div>
          </div>
          <div class="labeling">태그</div>
          <div class="label_rest">
            <select class="big" style="width: 45% !important; margin-right: 10px !important; float: left !important">
              <option>태그키 선택</option>
              <option>계정 선택 (1개)</option>
              <option>계정 선택 (1개)</option>
              <option>계정 선택 (1개)</option>
            </select>
            <div
              class="select_big"
              style="float: left !important; width: calc(55% - 10px) !important"
              @click="open_select"
            >
              태그값 선택
              <div class="select_big_cell">
                <div class="search">
                  <input type="text" placeholder="검색어를 입력해 주세요" />
                </div>
                <div class="search_ovf">
                  <table>
                    <tbody>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                      <tr>
                        <td><input id="ch" type="checkbox" /><label for="ch">cdsn ,acdm,snc,msdna,mcnsd,a</label></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="search_btns">
                  <button class="close_btn" @click="close_select">닫기</button>
                  <button class="sel_btn">선택완료</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cont">
          <h4><span>5</span>비용 집계 기준</h4>
          <div class="mini">예산을 사용할 비용에 해당하는 요금 유형을 지정합니다.</div>
          <div class="labeling">요금유형</div>
          <div class="label_rest">
            <div class="radio-wrap">
              <label class="radio"
                ><input type="radio" name="mode" title="단계별 가이드" value="step" checked="checked" />
                <span class="label">전체</span></label
              >
              <label class="radio"
                ><input type="radio" name="mode" value="quick" title="빠른 등록" />
                <span class="label">약정 구매 비용 제외</span></label
              >
            </div>
          </div>
          <div class="labeling">집계 기준</div>
          <div class="label_rest">
            <div class="radio-wrap">
              <label class="radio"
                ><input type="radio" name="mode1" title="단계별 가이드" value="step" checked="checked" />
                <span class="label">지불방법 기준</span></label
              >
              <label class="radio"
                ><input type="radio" name="mode1" value="quick" title="빠른 등록" />
                <span class="label">분할 상환 기준</span></label
              >
            </div>
          </div>
          <div style="clear: both"></div>
          <div class="mini">
            * [지불방법 기준]을 선택하면 약정 비용의 발생일을 기준으로 계산되며, [분할 상환 기준]을 선택하면 약정 비용이
            전체 약정에 걸쳐 균등하게 분배됩니다.<br />
            ** 선결제의 경우 약정 구매일에 전체 약정 요금이 발생하며, 후불결제의 경우 매월 특정일에 발생합니다.
          </div>
        </div>
        <div class="cont">
          <h4><span>6</span>알림 설정</h4>
          <div class="mini">
            실제 사용 비용이나 예측 금액이 일정한 비율 혹은 지정된 값을 초과하는 경우 알림을 받습니다. 알림을 수신할
            이메일을 입력해 주세요.
          </div>
          <div class="skyblue_box">
            1) <b>사용 비용</b>이 예산의 <b>85%</b>에 도달할 경우,<br />
            2) <b>사용 비용</b>이 예산의 <b>100%</b>에 도달할 경우, <br />
            3) <b>예측 금액</b>이 예산의 <b>100%</b>에 도달할 것으로 예측되는 경우 알림을 받게 됩니다.
          </div>
          <div class="labeling">수신자 이메일</div>
          <div class="label_rest">
            <input type="text" value="eunsol.jeon@bespinglobal.com" style="width: 50%" />
            <div class="trash"></div>
            <span class="span">이메일 형식이 올바르지 않습니다. </span><br />
            <input type="text" value="eunsol.jeon@bespinglobal.com" style="width: 50%" />
            <div class="trash"></div>
            <br />
            <div class="add_email">+ 이메일 추가</div>
          </div>
        </div>
      </div>
      <!-- 예산 생성 탭 상세 오른쪽 -->
      <div class="create_cell_right">
        <h4>예산현황</h4>
        <h5>월별예산</h5>
        <div class="gr"></div>
      </div>
    </div>
  </div>
  <!--        </SectionMain>-->
  <!--      </div>-->
  <!--    </main>-->
  <!--  </div>-->
</template>

<script>
import { mapActions } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import CardOverview from '@/pages/Bill/cards/CardOverview.vue';
import CardBillGrid from '@/pages/Bill/cards/CardBillGrid.vue';
import CardFilter from '@/pages/Bill/cards/CardFilter.vue';
import CardBillChart from '@/pages/Bill/cards/CardBillChart.vue';

export default {
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
    CardBillChart,
    CardFilter,
    CardBillGrid,
    CardOverview,
  },
  data() {
    return {
      selectedTab: 'monthly',
      tabInfos: [
        {
          category: 'monthly',
          title: '월별예산',
          desc: '추천 예산과 권장 구성으로 예산을 간편하게 생성합니다',
        },
        {
          category: 'aiService',
          title: 'AI 서비스',
          desc: 'GPU 인스턴스와 기계학습 서비스에 최적화 된 구성으로 예산을 간편하게 생성합니다.',
        },
        {
          category: 'custom',
          title: '사용자 지정',
          desc: '예산 생성 항목을 사용 상황에 맞게 세부적으로 설정하여 예산을 생성합니다',
        },
      ],
    };
  },
  created() {
    // this.fetchTrendYear();
    // this.fetchChrgYm();
  },
  methods: {
    tabChange(tabInfo) {
      console.log(tabInfo);
      this.selectedTab = tabInfo.category;
    },
    open_select(e) {
      if (e.target.classList.contains('with_cell')) {
        e.target.classList.remove('with_cell');
      } else {
        e.target.classList.add('with_cell');
      }
    },
    close_select(e) {
      e.target.parentNode.parentNode.parentNode.classList.remove('with_cell');
    },
  },
};
</script>
<style src="@/assets/jhstyle.css"></style>
