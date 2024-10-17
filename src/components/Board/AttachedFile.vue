<template>
  <button class="block mb-3 text-sm text-gray-700 underline" @click="handleClick">{{ file.oriFileNm }}</button>
</template>

<script>
import { downloadFile } from '@/services/fileService';

export default {
  props: {
    file: {
      type: Object,
      required: true,
      vaildator: (file) => {
        Object.prototype.hasOwnProperty.call(file, 'oriFileNm') &&
          Object.prototype.hasOwnProperty.call(file, 'saveFileNm');
      },
    },
  },
  methods: {
    async handleClick() {
      const response = await downloadFile({ filename: this.file.saveFileNm });

      // 정상 응답인 경우 blob, 오류 발생 시 에러 object
      // 정상
      if (!response.isAxiosError) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = this.file.oriFileNm;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        return;
      }

      // 오류
      const { status } = response.response || {};
      if (status === 404) {
        this.$emit('onError', status);
        return;
      }
    },
  },
};
</script>
