export default {
  props: {
    data: {
      type: Array,
      required: true,
      validator: (v) => Array.isArray(v),
    },
    keyGetter: {
      type: Function,
      default: (item) => item.id,
    },
    textGetter: {
      type: Function,
      default: (item) => item.text,
    },
    cancelOnClickOutside: {
      type: Boolean,
      default: true,
    },
    pending: {
      type: Boolean,
    },
  },
  data() {
    return {
      showOptions: false,
    };
  },
  computed: {
    hasData() {
      return this.data.length > 0;
    },
    arrowRotationClass() {
      return this.showOptions ? 'rotate-180-' : '';
    },
  },
  methods: {
    cancel() {
      this.showOptions = false;
    },
    handleClickOutside() {
      if (this.cancelOnClickOutside) {
        this.cancel();
      }
    },
  },
};
