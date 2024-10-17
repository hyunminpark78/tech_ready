<template>
  <main class="pt-8 pb-12 main">
    <div class="container">
      <div class="flex items-center mb-5">
        <img src="@/assets/images/arrow-typ-01-black.svg" alt="." class="rotate-90-" />
        <RouterLink to="." class="ml-3">1:1문의 목록 페이지로</RouterLink>
      </div>

      <div class="overflow-hidden bg-white border rounded-lg border-primary-200 dashboard-card">
        <div class="px-8 border-b py-7 border-primary-200">
          <div class="flex items-center justify-between">
            <h3 class="text-sm">1:1문의 등록</h3>
          </div>
        </div>

        <form id="regTicket" @submit.prevent="handleSubmitButtonClick">
          <div class="flex items-center px-8 py-2 border-b border-primary-200">
            <label class="text-sm text-primary-600 w-44"
              >이메일 주소 <sup class=""><img src="@/assets/images/ico-star.svg" alt="." class="inline -mt-3" /></sup
            ></label>
            <input
              v-model="inputForm.email"
              type="email"
              class="w-full flex-1 px-5 py-1.5 text-sm border rounded"
              :class="validField.email ? 'border-gray-300' : 'border-red'"
              placeholder="이메일을 입력해주세요"
              disabled
            />
          </div>

          <div class="flex items-center px-8 py-2 border-b border-primary-200">
            <label class="text-sm text-primary-600 w-44"
              >제목 <sup class=""><img src="@/assets/images/ico-star.svg" alt="." class="inline -mt-3" /></sup
            ></label>
            <input
              v-model="inputForm.subject"
              type="text"
              class="w-full flex-1 px-5 py-1.5 text-sm border rounded"
              :class="validField.subject ? 'border-gray-300' : 'border-red'"
              placeholder="제목을 입력해주세요"
              maxlength="50"
            />
          </div>

          <div class="flex items-start px-8 py-2 border-b border-primary-200">
            <label class="mt-2 text-sm text-primary-600 w-44"
              >내용 <sup class=""><img src="@/assets/images/ico-star.svg" alt="." class="inline -mt-3" /></sup
            ></label>
            <textarea
              v-model="inputForm.description"
              class="w-full flex-1 h-48 px-5 py-1.5 text-sm border rounded py"
              placeholder="내용을 입력해주세요"
              :class="validField.description ? 'border-gray-300' : 'border-red'"
              maxlength="2000"
            ></textarea>
          </div>

          <div
            class="flex items-center px-8 py-2 border-b border-primary-200"
            @click="clickInputTag()"
            @drop.prevent="dropInputTag($event)"
            @dragover.prevent
          >
            <label class="text-sm text-primary-600 w-44">파일첨부</label>
            <div
              class="file_import w-full flex-1 px-5 py-1.5 text-sm border rounded"
              :class="validField.attachments ? 'border-gray-300' : 'border-red'"
            >
              <span>첨부할 파일을 마우스로 드래그하거나 클릭하세요.</span>
              <div v-if="progressStart" class="fileupload_bar"><span :style="{ width: `${progress}%` }"></span></div>
              <ul v-if="currentFile.length > 0" class="file_wrap">
                <li v-for="(item, index) in currentFile" :key="item.id">
                  <span class="file_name"
                    >{{ item.name }} <span>{{ item.size | bytesToMb }}</span></span
                  >
                  <button type="button" class="file_del" @click.stop="deleteFile(item, index)">
                    <img src="@/assets/images/ico_delete.svg" alt="삭제" />
                  </button>
                </li>
              </ul>
            </div>
            <input
              ref="files"
              type="file"
              name="files[]"
              multiple
              class="absolute invisible"
              @change="uploadFile($event.target.files[0])"
            />
          </div>

          <div v-if="!!valid" class="flex items-center px-8 py-2">
            <label class="w-52"></label>
            <div class="w-full mb-5 text-sm text-secondary">{{ errMsg }}</div>
          </div>

          <div class="flex justify-center px-8 py-7">
            <button
              type="button"
              class="px-1 py-3 mx-3 text-sm bg-white border rounded text-primary-400 border-primary-400 w-28"
              @click.stop="handleCancleButtonClick"
            >
              취소
            </button>
            <button
              type="submit"
              class="px-1 py-3 mx-3 text-sm text-white border rounded bg-primary-400 border-primary-400 w-28"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { uniqBy, cloneDeep, sumBy } from 'lodash';

export default {
  components: {},
  data() {
    return {
      selectCategoryOptions: [],
      inputForm: { email: window.keycloak.idTokenParsed.email, subject: this.$route.params.subject || '' },
      currentFile: [],
      progress: 0,
      progressStart: false,
      validField: { email: true, subject: true, description: true, attachments: true },
      valid: false,
      errMsg: '',
    };
  },
  created() {
    this.inputForm.subject = '[약정 문의]';
    const selectCategoryOptions = [
      { id: 1, text: 'AWS' },
      { id: 2, text: 'Azure' },
      { id: 3, text: 'NBP' },
      { id: 4, text: 'Security' },
      { id: 5, text: 'Cloud Hub' },
      { id: 6, text: 'MEC' },
      { id: 7, text: '회원정보' },
      { id: 8, text: '계약' },
      { id: 9, text: '기타' },
    ];

    setTimeout(() => {
      this.selectCategoryOptions = selectCategoryOptions;
    }, 500);
  },
  methods: {
    ...mapActions('notice', ['fetchCreateFreshTicket']),
    handleCancleButtonClick() {
      this.$router.back();
    },
    handleSubmitButtonClick() {
      if (window.confirm(' 저장하시겠습니까 ? ')) {
        let valid = true;
        let msg = '';
        if (!this.inputForm.description) {
          valid = false;
          msg = '내용을 입력하세요.';
          this.validField.description = false;
        } else {
          this.validField.description = true;
        }
        if (!this.inputForm.subject) {
          valid = false;
          msg = '제목을 입력하세요.';
          this.validField.subject = false;
        } else {
          this.validField.subject = true;
        }
        if (!this.inputForm.email) {
          valid = false;
          msg = '이메일 주소를 입력하세요.';
          this.validField.email = false;
        } else {
          this.validField.email = true;
        }

        if (this.currentFile.length > 0) {
          let totalFileSize = sumBy(this.currentFile, (item) => {
            return item.size;
          });
          if (totalFileSize > 5242880) {
            valid = false;
            msg = '첨부파일의 용량은 최대 5MB 입니다.';
            this.validField.attachments = false;
          } else {
            this.validField.attachments = true;
          }

          if (this.currentFile.length > 10) {
            valid = false;
            msg = '첨부파일은 최대 10개 입니다.';
            this.validField.attachments = false;
          }
        }

        if (valid) {
          let form = new FormData();
          form.append('email', this.inputForm.email);
          form.append('subject', this.inputForm.subject);
          form.append('description', this.inputForm.description);
          if (this.currentFile.length > 0) {
            this.currentFile.forEach((item) => {
              form.append('attachments', item);
            });
            this.progressStart = true;
          }
          this.fetchCreateFreshTicket({
            inputForm: form,
            uploadProgress: (e) => {
              this.progress = Math.round((e.loaded * 100) / e.total);
            },
          }).then((res) => {
            this.$router.push('/support/qna');
          });
        } else {
          this.valid = true;
          this.errMsg = msg;
        }
      }
    },
    uploadFile(file) {
      //let form = new FormData();
      let files = file || this.$refs['files'].files[0];
      this.currentFile.push(files);
      this.currentFile = uniqBy(this.currentFile, 'name');
    },
    dropInputTag(event) {
      Array.from(event.dataTransfer.files, (item) => {
        this.uploadFile(item);
      });
    },
    clickInputTag() {
      this.$refs['files'].click();
    },
    deleteFile(file, index) {
      this.currentFile.splice(index, 1);
    },
  },
  watch: {
    currentFile(newVal, oldVal) {
      let totalFileSize = sumBy(newVal, (item) => {
        return item.size;
      });
      if (totalFileSize > 5242880) {
        this.validField.attachments = false;
      } else {
        this.validField.attachments = true;
      }
    },
  },
};
</script>
