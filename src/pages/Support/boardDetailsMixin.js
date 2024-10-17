export default {
  computed: {
    boardId() {
      return this.$route.params.id;
    },
    files() {
      return this.details.files;
    },
    imageFiles() {
      return this.files.filter((file) => file.fileTypCd === 'IMG');
    },
    hasFile() {
      return Array.isArray(this.files) && this.files.length > 0;
    },
  },
};
