<template>
  <div class="flex flex-row grow-1">
    <input v-model="inputValue" :type="inputType" :class="css" :placeholder="placeholder" :disabled="disabled" />
    <button :disabled="disabled" @click="toggleShowPassword()">
      <img
        v-if="showPassword === true"
        class="password"
        src="@/assets/images/password-hide-dark-blue.svg"
        alt="no-img"
      />
      <img v-else class="password" src="@/assets/images/password-show-dark-blue.svg" alt="no-img" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'InputTextPwd',
  props: {
    value: {
      type: String,
      default: () => '',
    },
    placeholder: {
      type: String,
      default: () => '',
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
    css: {
      type: [String, Array],
      default: () => '',
    },
  },
  data() {
    return {
      inputValue: this.value,
      showPassword: false,
    };
  },
  computed: {
    inputType() {
      return this.showPassword ? 'text' : 'password';
    },
  },
  watch: {
    inputValue(newVal) {
      this.$emit('input', newVal);
    },
    value(newVal) {
      if (newVal === '') this.inputValue = '';
    },
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    clearInput() {
      this.inputValue = '';
    },
  },
};
</script>

<style scoped>
.grow-1 {
  flex-grow: 1;
}
.password {
  width: 35px;
  border: 1px solid #e9ebed;
  border-radius: 3px;
  padding: 3px;
  margin: 0;
  margin-left: 5px;
}
</style>
