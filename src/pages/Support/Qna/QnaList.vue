<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        title="고객지원"
        title2="1:1문의"
        :main-icon="{ src: require('@/assets/images/ico-sr.svg') }"
      />
      <div class="box-wrap">
        <template v-if="hasData">
          <div class="flex border-b border-pprimary-200">
            <div class="w-1/3 p-4 text-center border-r border-primary-200">
              <div class="text-sm text-primary-600">전체 문의</div>
              <div class="text-xl font-bold text-gray-700">
                {{ qnaStatus && qnaStatus.total ? qnaStatus.total : 0 }}
              </div>
            </div>
            <div class="w-1/3 p-4 text-center border-r border-primary-200">
              <div class="text-sm text-primary-600">신규</div>
              <div class="text-xl font-bold text-gray-700">
                {{ qnaStatus && qnaStatus.newReg ? qnaStatus.newReg : 0 }}
              </div>
            </div>
            <div class="w-1/3 p-4 text-center border-r border-primary-200">
              <div class="text-sm text-primary-600">답변대기</div>
              <div class="text-xl font-bold text-gray-700">
                {{ qnaStatus && qnaStatus.ready ? qnaStatus.ready : 0 }}
              </div>
            </div>
            <div class="w-1/3 p-4 text-center border-r border-primary-200">
              <div class="text-sm text-primary-600">최종해결</div>
              <div class="text-xl font-bold text-gray-700">
                {{ qnaStatus && qnaStatus.final ? qnaStatus.final : 0 }}
              </div>
            </div>
            <div class="w-1/3 p-4 text-center">
              <div class="text-sm text-primary-600">종료됨</div>
              <div class="text-xl font-bold text-gray-700">
                {{ qnaStatus && qnaStatus.complete ? qnaStatus.complete : 0 }}
              </div>
            </div>
          </div>

          <div class="px-8 bg-white">
            <div class="flex items-center justify-end py-4">
              <RouterLink
                to="qna/form"
                class="
                  px-1
                  py-1.5
                  text-sm text-white text-center
                  border
                  rounded-sm
                  bg-primary-400
                  border-primary-400
                  w-28
                "
              >
                1:1문의하기
              </RouterLink>
            </div>
          </div>

          <table class="w-full bg-white border-t border-primary-200 board-table">
            <thead class="font-bold text-xs- text-primary-600">
              <tr class="border-b border-primary-200">
                <th class="w-1/6 px-8 py-4">답변상태</th>
                <th class="px-8 py-4 text-left">제목</th>
                <th class="w-1/6 px-8 py-4">등록일</th>
              </tr>
            </thead>

            <tbody class="text-sm">
              <tr v-for="qna in tempDspQnaList" :key="qna.id" class="border-b border-primary-200 hover:bg-primary-300">
                <td class="text-center" :class="statusColor(qna.status)">{{ statusNm(qna.status) }}</td>
                <td class="px-8 py-4">
                  <RouterLink :to="`qna/${qna.id}`">
                    {{ qna.subject }}
                  </RouterLink>
                </td>
                <td class="px-8 py-4 text-center">{{ Moment(qna.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-if="!hasData">
          <div class="flex flex-col items-center justify-center py-64" style="padding-bottom: 16rem">
            <img src="@/assets/images/ico-nodata-view.svg" alt="." />
            <p class="pt-5 pb-8 text-gray-700">문의하신 내용이 없습니다.</p>
            <RouterLink
              to="qna/form"
              class="px-5 py-1.5 text-sm text-white border rounded-sm bg-primary-400 border-primary-400"
            >
              문의 작성
            </RouterLink>
          </div>
        </template>
        <Paginate
          v-if="qnaTotalCount > 0"
          :class="qnaTotalCount < 3 && 'pb-24'"
          :total-cnt="qnaTotalCount"
          :total-page-cnt="10"
          :page-no="qnaPageNo"
          :page-size="qnaPaging.pageSize"
          @changepage="qnaPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import boardListMixin from '../boardListMixin';
import TabNavigation from '../TabNavigation.vue';
import Paginate from '@/components/Paginate.vue';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { SectionLnb, SectionNewHeader } from '@/components/Section';

export default {
  components: { SectionLnb, SectionNewHeader, TabNavigation, Paginate },
  mixins: [boardListMixin],
  data() {
    return {
      qnaPageNo: 1,
      tempDspQnaList: [],
    };
  },
  computed: {
    ...mapState('notice', ['qnaList', 'dspQnaList', 'qnaStatus', 'qnaTotalCount', 'qnaPaging']),
    hasData() {
      return this.qnaList && this.qnaList.length > 0;
    },
  },
  watch: {
    qnaPageNo() {
      if (this.qnaList && this.qnaList.length > 0) {
        const endIndex = this.qnaPageNo * 10;
        console.log('splice', endIndex - 10, endIndex);
        this.tempDspQnaList = cloneDeep(this.qnaList).splice(endIndex - 10, 10);
        console.log(this.tempDspQnaList);
      }
    },
    dspQnaList() {
      this.tempDspQnaList = cloneDeep(this.dspQnaList);
    },
  },
  created() {
    this.fetchQna();
  },
  methods: {
    ...mapActions('notice', ['fetchFreshDesk']),
    fetchQna() {
      this.fetchFreshDesk();
    },
    statusNm(status) {
      switch (status) {
        case '2':
          return '신규';
        case '3':
          return '답변대기';
        case '4':
          return '답변완료';
        case '5':
          return '종료됨';
        default:
          break;
      }
    },
    statusColor(status) {
      switch (status) {
        case '2':
          return 'text-secondary';
        case '3':
          return 'text-gray-500';
        case '4':
          return 'text-primary-400';
        case '5':
          return 'text-gray-600';
        default:
          break;
      }
    },
    Moment(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    qnaPageChange(page) {
      console.log('page', page);
      this.qnaPageNo = page;
    },
  },
};
</script>
