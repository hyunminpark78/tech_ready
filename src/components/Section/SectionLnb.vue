<template>
  <div class="lnb-wrap">
    <h2>{{ title }}</h2>
    <dl>
      <div
        v-for="(second, index) in subMenu"
        :key="second.path"
        style="margin-bottom: 10px"
        @click="setActive(index)"
        @mouseenter="toggleSubMenu(index, true)"
        @mouseleave="toggleSubMenu(index, false)"
      >
        <dt v-if="second.sub.length === 0" :class="second.active ? 'nosub active' : 'nosub'">
          <a v-if="second.directPopup" class="cursor-pointer" @click.stop="getPopup()">
            {{ second.title }}
          </a>
          <RouterLink v-else :key="second.fullPath" :to="second.fullPath">{{ second.title }}</RouterLink>
        </dt>
        <dt v-else :class="second.active ? 'active' : ''">
          <template v-if="second.sub[0].path === '/opti/cost/info' && cmmtInfoUrl !== ''">
            <RouterLink :key="second.sub[0].path" :to="second.sub[1].path">{{ second.title }}</RouterLink>
          </template>
          <template v-else>
            <RouterLink :key="second.sub[0].path" :to="second.sub[0].path">{{ second.title }}</RouterLink>
          </template>
        </dt>
        <dd :class="second.active ? 'active' : ''">
          <div v-for="third in second.sub" :key="third.path" :class="currentPath == third.path ? 'active' : ''">
            <template v-if="third.path === '/opti/cost/info'">
              <div style="display: flex; align-items: center" class="opti-cost-info-wrapper" @mouseover="changeImage(true)" @mouseleave="changeImage(false)">
                <a :href="cmmtInfoUrl" target="_blank" class="opti-cost-info">
                  {{ third.title }}
                <img
                  class="third-menu"
                  style="display: inline-block"
                  :src="
                      isHovered || currentPath == third.path
                        ? require('@/assets/images/ico-link-blue.png')
                        : require('@/assets/images/ico-link-black.png')
                    "
                  alt="/opti/cost/info"
                />
                </a>
              </div>
            </template>
            <template v-else>
              <RouterLink :key="third.path" :to="third.path">
                {{ third.title }}
              </RouterLink>
            </template>
          </div>
        </dd>
      </div>
    </dl>
    <button class="btn-min jsMin1">최소화</button>
    <Popup v-if="popup" :visible="popup.visible" :content="popup.content" @closePopup="closePopup" />
  </div>
</template>

<script>
// import routes from '@/router/routes';
import { mapState } from 'vuex';
import Popup from '@/components/Popup';
import {getLocal} from "@/library/Common";
export default {
  components: {
    Popup,
  },
  prop: {
    curPath: '',
  },
  data() {
    return {
      title: '',
      subMenu: [],
      popup: {
        visible: false,
        content: '',
      },
      isHovered: false,
      cmmtInfoUrl: '',
      currentPath: this.curPath
    };
  },
  computed: {
    ...mapState('menu', ['menu']),
  },
  watch: {
    menu(value) {
      this.createMenu();
    },
    curPath(newVal) {
      this.currentPath = newVal;
    }
  },
  created() {
    if (this.menu) {
      this.createMenu();
    }
    const userInfo = getLocal('userInfo');
    this.cmmtInfoUrl = userInfo ? userInfo.cmmtInfoUrl : '';
  },
  mounted() {
    this.$nextTick(() => {
      this.addEventListeners();
    });
    /* tooltip */
    const tooltips = document.querySelectorAll('.tooltip-wrap');
    const tooltipBtns = document.querySelectorAll('.jsTooltip1');
    tooltipBtns.forEach((tooltip) => {
      tooltip.onclick = function () {
        for (let i = 0; i < tooltips.length; i++) {
          tooltips[i].classList.remove('active');
        }
        if (this.parentNode.classList.contains('active')) {
          this.parentNode.classList.remove('active');
        } else {
          this.parentNode.classList.add('active');
        }
      };
    });

    const tooltipCloses = document.querySelectorAll('.jsTooltipClose1');
    tooltipCloses.forEach((tooltipClose) => {
      tooltipClose.onclick = function () {
        this.parentNode.parentNode.classList.remove('active');
      };
    });
    /* //tooltip */

    /* btns */
    if (document.querySelector('.jsMin1')) {
      const btnMin = document.querySelector('.jsMin1');
      btnMin.onclick = function () {
        if (this.parentNode.parentNode.classList.contains('closed')) {
          this.parentNode.parentNode.classList.remove('closed');
        } else {
          this.parentNode.parentNode.classList.add('closed');
        }
      };
    }
    if (document.querySelector('.jsFilterMin1')) {
      const btnFilterMin = document.querySelector('.jsFilterMin1');
      btnFilterMin.onclick = function () {
        if (this.parentNode.parentNode.parentNode.parentNode.classList.contains('min')) {
          this.parentNode.parentNode.parentNode.parentNode.classList.remove('min');
        } else {
          this.parentNode.parentNode.parentNode.parentNode.classList.add('min');
        }
      };
    }

    /* show layer */
    const btnShows = document.querySelectorAll('.jsBtnShow1');
    btnShows.forEach((btnShow) => {
      btnShow.onclick = function () {
        if (this.parentNode.classList.contains('active')) {
          this.parentNode.classList.remove('active');
        } else {
          for (let i = 0; i < btnShows.length; i++) {
            btnShows[i].parentNode.classList.remove('active');
          }
          this.parentNode.classList.add('active');
        }
      };
    });
    /* hide layer */
    const btnCloses = document.querySelectorAll('.jsBtnClose1');
    btnCloses.forEach((btnClose) => {
      btnClose.onclick = function () {
        if (this.parentNode.parentNode.parentNode.classList.contains('active')) {
          this.parentNode.parentNode.parentNode.classList.remove('active');
        } else {
          this.parentNode.parentNode.parentNode.classList.add('active');
        }
      };
    });

    if (document.querySelector('.jsFold1')) {
      const btnFolds = document.querySelectorAll('.jsFold1');
      btnFolds.forEach((btnFold) => {
        btnFold.onclick = function () {
          if (this.parentNode.parentNode.parentNode.classList.contains('closed')) {
            this.parentNode.parentNode.parentNode.classList.remove('closed');
          } else {
            this.parentNode.parentNode.parentNode.classList.add('closed');
          }
        };
      });
    }
  },
  updated() {
    this.$nextTick(() => {
      this.addEventListeners();
    });
  },
  methods: {
    changeImage(isHovered) {
      this.isHovered = isHovered;
    },
    addEventListeners() {
      this.$nextTick(() => {
        const activeLinks = document.querySelectorAll('.opti-cost-info');
        activeLinks.forEach(link => {
          link.addEventListener('mouseover', this.onMouseOver);
          link.addEventListener('mouseleave', this.onMouseLeave);
        });
      });
    },
    onMouseOver(event) {
      const path = event.currentTarget.getAttribute('href');
      if (path === '/opti/cost/info') {
        this.isHovered = true;
      }
    },
    onMouseLeave(event) {
      const path = event.currentTarget.getAttribute('href');
      if (path === '/opti/cost/info') {
        this.isHovered = false;
      }
    },
    createMenu() {
      this.currentPath = window.location.pathname;
      const curPathArr = this.currentPath.split(/\//).filter(Boolean);
      const firstDepth = this.menu.filter((child) => child.path === '/' + curPathArr[0]);
      const secondDepth = firstDepth[0].children.filter((child) => child.path && !child.path.includes('/'));

      this.title = firstDepth[0].name;
      this.subMenu = secondDepth
        // eslint-disable-next-line no-prototype-builtins
        .filter((child) => child.hasOwnProperty('expose') && child.expose)
        .map((second) => {
          const thirdDepth = firstDepth[0].children.filter((child) => child.path.startsWith(second.path + '/'));
          const fullPath = firstDepth[0].path + '/' + second.path;
          const sub = thirdDepth
            .filter(function (child) {
              // eslint-disable-next-line no-prototype-builtins
              if (child.hasOwnProperty('subExpose')) {
                return child.subExpose;
              } else {
                return true;
              }
            })
            .map((third) => ({
              path: '/' + curPathArr[0] + '/' + third.path,
              title: third.meta.title,
            }));

          return {
            path: second.path,
            fullPath: fullPath,
            title: second.meta.title,
            sub: sub,
            active: this.currentPath.startsWith(fullPath),
            directPopup: second.directPopup,
          };
        });
    },
    setActive(index) {
      this.subMenu.forEach((secondDepth, idx) => {
        if (index === idx) {
          secondDepth.active = true;
        } else {
          secondDepth.active = false;
        }
      });
    },
    toggleSubMenu(index, isActive) {
      if (this.subMenu[index].sub.length > 0 && !this.currentPath.startsWith(this.subMenu[index].fullPath)) {
        this.subMenu[index].active = isActive;
      }
    },
    getPopup() {
      this.popup.content = `${this.$t('support.hello')}\n${this.$t('support.inquiryFunctionPrepared')}\n${this.$t(
        'support.anyQuestionsEmail'
      )}\n${this.$t('support.thankYou')}`;
      this.popup.visible = true;
    },
    closePopup() {
      this.popup.visible = false;
    },
  },
};
</script>
<style scoped>
.opti-cost-info {
  color: black;
  text-decoration: none;
}

.opti-cost-info-wrapper:hover .opti-cost-info {
  color: #00a5ed; /* 마우스 오버 시 텍스트 색상 변경 */
}

.opti-cost-info-wrapper {
  cursor: pointer;
}

.opti-cost-info-wrapper img {
  cursor: pointer;
}
</style>
