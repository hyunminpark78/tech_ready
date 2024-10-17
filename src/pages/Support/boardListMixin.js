export default {
  props: {
    query: {
      type: String,
      default: '',
    },
    page: {
      type: [String, Number],
      default: 1,
      validator: (v) => Number.isInteger(Number(v)),
    },
  },
  computed: {
    pageNo() {
      return Number(this.page);
    },
  },
  methods: {
    search(value) {
      if (this.query === value) {
        return;
      }

      const query = {};
      if (value) {
        query.q = value;
      }

      this.$router.push({
        path: this.$route.path,
        query,
      });
    },
    pageChange(page) {
      if (this.pageNo === page) {
        return;
      }

      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          page,
        },
      });
    },
  },
};
