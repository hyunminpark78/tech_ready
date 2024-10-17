<template>
  <div ref="container" @click="handleClick">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'radio',
    },
    defaultActiveIndex: {
      type: Number,
      default: 0,
    },
    activeClasses: {
      type: Array,
      default: () => [],
    },
    standardClasses: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      mutationObserver: undefined,
      activeIndex: 0,
    };
  },
  computed: {
    siblings() {
      return Array.prototype.slice.call(this.$refs.container.children);
    },
    validActiveClasses() {
      return this.activeClasses.filter((c) => Boolean(c.trim()));
    },
    validStandardClasses() {
      return this.standardClasses.filter((c) => Boolean(c.trim()));
    },
  },
  mounted() {
    // mount 후 initialize
    this.initialize();

    // child node 변경 될 때 initialize
    this.mutationObserver = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.type === 'childList')) {
        this.initialize();
      }
    });
    this.mutationObserver.observe(this.$el, { childList: true });
  },
  beforeDestroy() {
    if (this.mutationObserver.disconnect) {
      this.mutationObserver.disconnect();
    }
  },
  methods: {
    initialize() {
      this.$el.children.forEach((element, index) =>
        this.defaultActiveIndex === index ? this.activate(element) : this.standardization(element)
      );
      this.activeIndex = this.defaultActiveIndex;
    },
    setActiveIndex(index) {
      this.updateActive(index, { skipEmit: true });
    },
    setActiveValue(value) {
      const targetIndex = this.siblings.findIndex((element) => element.value === value);
      this.updateActive(targetIndex, { skipEmit: true });
    },
    activate(target) {
      target.classList.remove(...this.validStandardClasses);
      target.classList.add(...this.validActiveClasses);
    },
    standardization(target) {
      target.classList.remove(...this.validActiveClasses);
      target.classList.add(...this.validStandardClasses);
    },
    updateActive(value, config = { skipEmit: false }) {
      // 현재 활성화 된 요소일 경우 무시
      if (value === this.activeIndex) {
        return;
      }

      this.siblings.forEach((element, index) =>
        index === value ? this.activate(element) : this.standardization(element)
      );
      this.activeIndex = value;

      if (!config.skipEmit) {
        this.$emit('change', value);
      }
    },
    handleClick({ target }) {
      // 부모 요소 클릭 무시
      if (target.isEqualNode(this.$el)) {
        return;
      }

      this.updateActive(this.siblings.indexOf(target));
    },
  },
};
</script>
