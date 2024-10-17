<template>
  <header class="relative bg-white border-b border-primary-200 header">
    <Logo :user="user" class="absolute" />
    <NavBar :items="navigationItems" />
    <UserInfo
      :setting="setting"
      :user="user"
      :panel-visible="userInfoPanelShow"
      :user-guide-yn="userGuideYn"
      @click="userInfoPanelShow = !userInfoPanelShow"
    />
    <UserInfoPanel
      v-show="userInfoPanelShow"
      @closePop="closePop"
      @change-password-click="$emit('change-password-click')"
    />
  </header>
</template>

<script>
import Logo from './Logo.vue';
import NavBar from './NavBar.vue';
import UserInfo from './UserInfo.vue';
import UserInfoPanel from './UserInfoPanel.vue';

export default {
  components: {
    Logo,
    NavBar,
    UserInfo,
    UserInfoPanel,
  },
  props: {
    navigationItems: {
      type: Array,
      default: () => [],
    },
    setting: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default: () => ({}),
    },
    userGuideYn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userInfoPanelShow: false,
    };
  },
  methods: {
    closePop() {
      this.userInfoPanelShow = !this.userInfoPanelShow;
    },
  },
};
</script>
