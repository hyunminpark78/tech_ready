<template>
  <main class="pt-8 pb-12 main">
    <div class="container">
      <div class="flex items-center mb-5">
        <img src="@/assets/images/arrow-typ-01-black.svg" alt="." class="rotate-90-" />
        <RouterLink to="/support/qna" class="ml-3">1:1문의 목록 페이지로</RouterLink>
      </div>

      <div class="overflow-hidden bg-white border rounded-lg border-primary-200 dashboard-card">
        <!-- 헤더 -->
        <div class="px-8 border-b py-7 border-primary-200">
          <div class="flex items-center justify-between">
            <h3 class="font-bold">{{ qnaDetail.subject }}</h3>
            <div class="flex items-center">
              <div class="ml-12">
                <span class="mr-6 font-bold text-xs- text-primary-600">답변상태</span>
                <span
                  class="text-sm font-bold"
                  :class="statusColor(qnaDetail.status)"
                  @click="$router.push({ ...$route, query: { view: 'a' } })"
                  >{{ qnaDetail && qnaDetail.status ? statusNm(qnaDetail.status) : '' }}</span
                >
              </div>
              <!-- <div class="ml-12">
                <span class="mr-6 font-bold text-xs- text-primary-600">조회</span>
                <span class="text-sm text-gray-700">1,234</span>
              </div> -->
              <div class="ml-12">
                <span class="mr-6 font-bold text-xs- text-primary-600">등록일</span>
                <span class="text-sm text-gray-700">{{
                  qnaDetail && qnaDetail.created_at ? Moment(qnaDetail.created_at) : ''
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-start px-8 py-4 border-b border-primary-200" v-html="qnaDetail.description"></div>

        <div
          v-if="qnaDetail.attachments && qnaDetail.attachments.length > 0"
          class="flex items-start px-8 py-4 border-b border-primary-200"
        >
          <span class="mr-8 font-bold text-xs- text-primary-600">첨부파일</span>
          <div class="-mt-0.5 -mb-3">
            <a
              v-for="file in qnaDetail.attachments"
              class="block mb-3 text-sm text-gray-700 underline"
              :key="file.id"
              :href="file.attachment_url"
              @click.prevent="downloadFile(file.attachment_url, file.name)"
              >{{ file.name }}</a
            >
          </div>
        </div>

        <div v-for="rep in qnaReplys" :key="rep.id">
          <!-- (답변) 본문 -->
          <div class="p-8 text-sm whitespace-pre-line leading-4 border-t border-b">
            <div class="flex items-center text-sm text-primary-600">
              <img src="@/assets/images/ico-a.svg" alt="." class="mr-3" /> 답변내용 ({{ Moment(rep.createdAt) }})
            </div>
            <div name="replyOriginHtml" v-html="rep.body" />
          </div>
          <div
            v-if="rep.resFiles && rep.resFiles.length > 0"
            class="flex items-start px-8 py-4 border-b border-primary-200"
          >
            <span class="mr-8 font-bold text-xs- text-primary-600">첨부파일</span>
            <div class="-mt-0.5 -mb-3">
              <a
                v-for="file in rep.resFiles"
                class="block mb-3 text-sm text-gray-700 underline"
                :key="file.id"
                :href="file.attachment_url"
                @click.prevent="downloadFile(file.attachment_url, file.name)"
                >{{ file.name }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import APICaller from '@/library/APICaller';

export default {
  computed: {
    ...mapState('notice', ['qnaDetail', 'qnaReplys']),
    id() {
      return this.$route.params.id;
    },
    hasData() {
      return this.qnaDetail && this.qnaDetail.subject;
    },
    layout() {
      const { view } = this.$route.query;
      switch (view) {
        case 'q':
          return 'view.question';
        case 'a':
          return 'view.answer';
        default:
          return 'view.question';
      }
    },
  },
  created() {
    console.log(`QnA 상세 (id: ${this.id})`);
    this.getDetail(this.id);
  },
  methods: {
    ...mapActions('notice', ['fetchGetFreshTicket', 'fetchGetFreshTicketReply']),
    getDetail(id) {
      this.fetchGetFreshTicket(id);
      this.fetchGetFreshTicketReply(id);
    },
    statusNm(status) {
      switch (status + '') {
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
      switch (status + '') {
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
    downloadFile(url, filename) {
      // cors void
      APICaller.download(
        `/FRESH_DOWNLOAD/${url.replace('https://5gmarketplace.attachments.freshservice.com/', '')}`,
        filename
      );
    },
  },
};
</script>
