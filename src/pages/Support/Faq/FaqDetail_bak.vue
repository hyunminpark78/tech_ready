<template>
  <main class="pt-8 pb-12 main">
    <div class="container">
      <div class="flex items-center mb-5">
        <img src="@/assets/images/arrow-typ-01-black.svg" alt="." class="rotate-90-" />
        <RouterLink to="." class="ml-3">자주하는 질문들 목록 페이지로</RouterLink>
      </div>

      <div class="overflow-hidden bg-white border rounded-lg border-primary-200 dashboard-card">
        <div class="px-8 border-b py-7 border-primary-200">
          <div class="flex items-center justify-between">
            <h3 class="font-bold">{{ details.title }}</h3>

            <div class="flex items-center">
              <div class="ml-12">
                <span class="mr-6 font-bold text-xs- text-primary-600">분류</span>
                <span class="text-sm text-gray-700">{{ details.category }}</span>
              </div>
              <div class="ml-12">
                <span class="mr-6 font-bold text-xs- text-primary-600">조회</span>
                <span class="text-sm text-gray-700">{{ details.viewCount | number }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="hasFile" class="flex items-start px-8 py-4 border-b border-primary-200">
          <span class="mr-8 font-bold text-xs- text-primary-600">첨부파일</span>
          <div class="-mt-0.5 -mb-3">
            <AttachedFile v-for="file in files" :key="file.fileSerno" :file="file" />
          </div>
        </div>

        <div class="p-8 text-sm leading-6 whitespace-pre-line">
          <AttachedImage
            v-for="file in imageFiles"
            :key="file.fileListSerno"
            :file="file"
            class="mx-auto view-content-image"
          />
          {{ details.content }}
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import boardDetailsMixin from '../boardDetailsMixin';
import { AttachedFile, AttachedImage } from '@/components/Board';

export default {
  components: { AttachedFile, AttachedImage },
  mixins: [boardDetailsMixin],
  computed: {
    ...mapGetters('faq', ['details']),
  },
  created() {
    this.fetchDetails(this.boardId);
  },
  methods: {
    ...mapActions('faq', ['fetchDetails']),
  },
};
</script>
