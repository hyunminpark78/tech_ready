<template>
  <img :src="src" :alt="file.oriFileNm" />
</template>

<script>
import { downloadFile } from '@/services/fileService';

export default {
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      src: null,
    };
  },
  async created() {
    const response = await downloadFile({ filename: this.file.saveFileNm });

    // 정상 응답인 경우 blob, 오류 발생 시 에러 object
    // 정상
    if (!response.isAxiosError) {
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onload = () => (this.src = reader.result);
    }
  },
};
</script>
