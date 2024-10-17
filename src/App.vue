<template>
  <div>
    <Header
      v-if="headerVisible"
      :navigation-items="navigationItems"
      :user="user"
      :setting="setting"
      :user-guide-yn="userGuideYn"
      @change-password-click="changePasswordOverlayShow = true"
    />
    <RouterView />
    <ChangePasswordOverlay
      v-if="changePasswordOverlayShow"
      @close="changePasswordOverlayShow = false"
      @cancel="changePasswordOverlayShow = false"
      @confirm="handleChangePasswordConfirm"
    />
    <Footer v-if="footerVisible" :navigation-items="navigationItems" />
    <!--    <Fab v-if="fabFaqVisible" @goPageFaq="goClickFaqPage" />-->
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { getLocal } from '@/library/Common';
import Fab from '@/components/Fab.vue';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ChangePasswordOverlay } from '@/components/Overlays';
import APICaller, { getZuulHost } from '@/library/APICaller';
import routeConstants from '@/constants/routeConstants';
import _ from 'loadsh';
import dashboardService from '@/services/dashboardService';
import { i18n } from '../public/locales/i18n';
import VueCookies from 'vue-cookies';

function toNavigationItem(item) {
  const result = {
    name: item.name,
    path: item.path,
    directPopup: item.directPopup,
  };

  if (Object.prototype.hasOwnProperty.call(item, 'children')) {
    result.children = item.children;
  }

  return result;
}

// expose = true 요소만 선택
function navigationItemFilter(item) {
  return item.expose;
}

function childrenFilter(item) {
  const result = {
    name: item.name,
    path: item.path,
  };

  if (Object.prototype.hasOwnProperty.call(item, 'children')) {
    result.children = item.children.filter(navigationItemFilter).map(toNavigationItem);
  }

  return result;
}

export default {
  components: {
    ChangePasswordOverlay,
    Fab,
    Footer,
    Header,
  },
  data() {
    return {
      changePasswordOverlayShow: false,
      // navigationItems: routes.filter(navigationItemFilter).map(childrenFilter).map(toNavigationItem),
      navigationItems: [],
      routes: [],
      user: {
        name: getLocal('userInfo') ? getLocal('userInfo').userNm : '홍길동',
        department: getLocal('userInfo') ? getLocal('userInfo').userCopNm : 'SKT',
        redirectRoute: getLocal('userInfo') ? getLocal('userInfo').redirectRoute : '/dashboard',
      },
      setting: [],
      reportYn: false,
      userGuideYn: false,
      // popupVisible: true,
    };
  },
  computed: {
    headerVisible() {
      return !this.$route.meta.suppressHeader;
    },
    footerVisible() {
      return !this.$route.meta.suppressFooter;
    },
    fabFaqVisible() {
      return !(this.$route.meta.suppressFabs || {}).faq;
    },
  },
  watch: {
    '$i18n.locale': 'setMenu',
  },
  created() {
    this.fetchMyCtrts();
    this.setMenu();
  },
  mounted() {},
  methods: {
    ...mapActions('menu', ['fetchMenu']),
    ...mapActions('common', ['fetchMyCtrts']),
    async setMenu() {
      await this.setLang();
      await dashboardService.fetchAccess().then((res) => {
        this.reportYn = res.data;
      });
      this.setting = [];
      const settingMenu = [];
      let menuOrgList = [];
      let clientCd = 'CCP';
      const menuListRes = APICaller.get(`/cmm/v1/user/menu/list/${clientCd}`);
      // 한국어
      if (i18n.locale === 'ko') {
        menuListRes.then(async (menuList) => {
          const menuCloneList = _.cloneDeep(menuList.data.data);
          // 메뉴 폴더 목록 set + 대시보드
          menuCloneList.forEach((item) => {
            let folderObj = {};
            if (item.menuNm === '사용자가이드') {
              this.userGuideYn = true;
            }
            if (item.menuLvlVal === 1 && item.menuNm !== '사용자가이드') {
              if (item.lnkTypCd === 'FUNCTION') {
                folderObj = {
                  path: item.lnkUrl,
                  name: item.menuNm,
                  component: routeConstants.COMPONENT[item.lnkUrl.substr(1).toUpperCase()],
                  meta: { title: item.menuNm, menuId: item.menuId },
                  expose: routeConstants.EXPOSE[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                };
                menuOrgList.push(folderObj);
              } else if (item.lnkTypCd === 'FOLDER') {
                folderObj = {
                  path: item.lnkUrl,
                  name: item.menuNm,
                  component: routeConstants.COMPONENT[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                  meta: { title: item.menuNm, menuId: item.menuId },
                  expose: routeConstants.EXPOSE[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                  children: [
                    {
                      path: '',
                      redirect: routeConstants.REDIRECT[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                    },
                  ],
                };
                menuOrgList.push(folderObj);
              }
            }
          });
          let depthMap = new Map();
          menuCloneList.forEach((item) => {
            let functionObj = {};
            if (item.menuLvlVal !== 1) {
              for (let i = 0; i < menuOrgList.length; i++) {
                if (
                  item.uppMenuId === menuOrgList[i].meta.menuId ||
                  (depthMap.has(item.uppMenuId) && depthMap.get(item.uppMenuId) === menuOrgList[i].meta.menuId)
                ) {
                  if (item.lnkTypCd === 'FUNCTION') {
                    functionObj = {
                      path:
                        item.menuLvlVal === 2
                          ? item.lnkUrl.split('/')[2]
                          : item.lnkUrl.split('/')[2] + '/' + item.lnkUrl.split('/')[3],
                      name: item.menuNm,
                      component: routeConstants.COMPONENT[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                      meta: { title: item.menuNm, menuId: item.menuId },
                      expose: routeConstants.EXPOSE[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                      directPopup: routeConstants.DIRECTPOPUP[item.lnkUrl.substr(1).toUpperCase().replace(/[/]/g, '_')],
                    };
                    if (item.lnkUrl.includes('billRpt')) {
                      if (getLocal('userInfo').applyYn === 'Y') {
                        menuOrgList[i].children.push(functionObj);
                      }
                    } else {
                      menuOrgList[i].children.push(functionObj);
                    }
                  } else if (item.lnkTypCd === 'FOLDER') {
                    functionObj = {
                      path:
                        item.menuLvlVal === 2
                          ? item.lnkUrl.split('/')[2]
                          : item.lnkUrl.split('/')[2] + '/' + item.lnkUrl.split('/')[3],
                      name: item.menuNm,
                      component: routeConstants.COMPONENT[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                      meta: { title: item.menuNm, menuId: item.menuId },
                      expose: routeConstants.EXPOSE[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                      children: [
                        {
                          path: '',
                          redirect: routeConstants.REDIRECT[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                        },
                      ],
                    };
                    menuOrgList[i].children.push(functionObj);
                  }
                  depthMap.set(item.menuId, item.uppMenuId);
                }
              }
              // setting
              if (item.lnkUrl.includes('/setting/')) {
                // this.setting.push(item);
                settingMenu.push(item);
              }
            }
          });
          this.setting = settingMenu.filter((value, index, self) => {
            return self.indexOf(value) === index;
          });
          this.routes = _.cloneDeep(menuOrgList);
          this.navigationItems = this.routes.filter(navigationItemFilter).map(childrenFilter).map(toNavigationItem);
          await this.fetchMenu(this.routes);
        });
      } else {
        // 영어
        menuListRes.then(async (menuList) => {
          const menuCloneList = _.cloneDeep(menuList.data.data);
          // 메뉴 폴더 목록 set + 대시보드
          menuCloneList.forEach((item) => {
            let folderObj = {};
            if (item.menuEnNm === 'User guide') {
              this.userGuideYn = true;
            }
            if (item.menuLvlVal === 1 && item.menuEnNm !== 'User guide') {
              if (item.lnkTypCd === 'FUNCTION') {
                folderObj = {
                  path: item.lnkUrl,
                  name: item.menuEnNm,
                  component: routeConstants.COMPONENT[item.lnkUrl.substr(1).toUpperCase()],
                  meta: { title: item.menuEnNm, menuId: item.menuId },
                  expose: routeConstants.EXPOSE[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                };
                menuOrgList.push(folderObj);
              } else if (item.lnkTypCd === 'FOLDER') {
                folderObj = {
                  path: item.lnkUrl,
                  name: item.menuEnNm,
                  component: routeConstants.COMPONENT[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                  meta: { title: item.menuEnNm, menuId: item.menuId },
                  expose: routeConstants.EXPOSE[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                  children: [
                    {
                      path: '',
                      redirect: routeConstants.REDIRECT[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                    },
                  ],
                };
                menuOrgList.push(folderObj);
              }
            }
          });
          let depthMap = new Map();
          menuCloneList.forEach((item) => {
            let functionObj = {};
            if (item.menuLvlVal !== 1) {
              for (let i = 0; i < menuOrgList.length; i++) {
                if (
                  item.uppMenuId === menuOrgList[i].meta.menuId ||
                  (depthMap.has(item.uppMenuId) && depthMap.get(item.uppMenuId) === menuOrgList[i].meta.menuId)
                ) {
                  if (item.lnkTypCd === 'FUNCTION') {
                    functionObj = {
                      path:
                        item.menuLvlVal === 2
                          ? item.lnkUrl.split('/')[2]
                          : item.lnkUrl.split('/')[2] + '/' + item.lnkUrl.split('/')[3],
                      name: item.menuEnNm,
                      component: routeConstants.COMPONENT[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                      meta: { title: item.menuEnNm, menuId: item.menuId },
                      expose: routeConstants.EXPOSE[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                      directPopup: routeConstants.DIRECTPOPUP[item.lnkUrl.substr(1).toUpperCase().replace(/[/]/g, '_')],
                    };
                    if (item.lnkUrl.includes('billRpt')) {
                      if (getLocal('userInfo').applyYn === 'Y') {
                        menuOrgList[i].children.push(functionObj);
                      }
                    } else {
                      menuOrgList[i].children.push(functionObj);
                    }
                  } else if (item.lnkTypCd === 'FOLDER') {
                    functionObj = {
                      path:
                        item.menuLvlVal === 2
                          ? item.lnkUrl.split('/')[2]
                          : item.lnkUrl.split('/')[2] + '/' + item.lnkUrl.split('/')[3],
                      name: item.menuEnNm,
                      component: routeConstants.COMPONENT[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                      meta: { title: item.menuEnNm, menuId: item.menuId },
                      expose: routeConstants.EXPOSE[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                      children: [
                        {
                          path: '',
                          redirect: routeConstants.REDIRECT[item.lnkUrl.substr(1).toUpperCase().replace('/', '_')],
                        },
                      ],
                    };
                    menuOrgList[i].children.push(functionObj);
                  }
                  depthMap.set(item.menuId, item.uppMenuId);
                }
              }
              // setting
              if (item.lnkUrl.includes('/setting/')) {
                // this.setting.push(item);
                settingMenu.push(item);
              }
            }
          });
          this.setting = settingMenu.filter((value, index, self) => {
            return self.indexOf(value) === index;
          });
          this.routes = _.cloneDeep(menuOrgList);
          this.navigationItems = this.routes.filter(navigationItemFilter).map(childrenFilter).map(toNavigationItem);
          await this.fetchMenu(this.routes);
        });
      }
    },
    setLang() {
      // 쿠키에서 기존에 선호 언어가 설정되어 있는지 확인
      const langValue = this.$cookies.get('lang');
      // 선호 언어가 기존에 있으면 그 언어로 사용하고
      // 선호 언어가 없으면 기본 한국어 'ko' 로 설정
      if (langValue === null) {
        VueCookies.set('lang', 'ko', '90d');
      }
    },
    handleChangePasswordConfirm() {
      this.changePasswordOverlayShow = false;
    },
    goClickFaqPage() {
      const faqPath = '/support/faq';
      if (this.$route.path !== faqPath) {
        this.$router.push(faqPath);
      }
    },
  },
};
</script>

<style src="@/assets/styles/custom_v5_cost_explorer.css"></style>
<style src="@/assets/styles/custom.css"></style>
<style src="@/assets/styles/custom-v3.css"></style>
<style src="@/assets/styles/custom-v5.css"></style>
<style src="ag-grid-community/dist/styles/ag-grid.css"></style>
<style src="ag-grid-community/dist/styles/ag-theme-alpine.css"></style>
<style src="@/assets/styles/custom_ag-grid.css"></style>
<!-- vue2-daterange-picker -->
<style src="vue2-daterange-picker/dist/vue2-daterange-picker.css"></style>
<style src="@/assets/styles/vue2-daterange-picker-custom.css"></style>
<!-- // vue2-daterange-picker -->
