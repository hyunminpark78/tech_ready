<template>
  <div class="pos-right">
    <a v-if="userGuideYn" :href="userGuideUrl" class="btn" target="_blank">{{ $t('menu.userGuide') }}</a>
    <button @click="routePage('/support/notice')" class="ico-notice">공지</button>
    <!-- 신규 알람이 있을 경우 :
        <a href="#" class="ico-notice new">공지</a>
    -->
    <span :style="setting.length > 0 ? '' : 'display: none'" class="set-wrap">
      <button class="ico-set jsSet1">설정</button>
      <!-- layer -->
      <span class="set-layer" style="z-index: 1000">
        <a v-for="(menu, idx) in setting" :key="idx" href="#" @click.prevent="handleMenuClick(menu.lnkUrl)">{{
          $i18n.locale === 'ko' ? menu.menuNm : menu.menuEnNm
        }}</a>
      </span>
      <!-- //layer -->
    </span>
    <span class="set-wrap">
      <button class="language_select">{{ lang }}</button>
      <!-- layer -->
      <span class="set-layer-lang" style="z-index: 1000">
        <a v-for="(lang, idx) in langList" :key="idx" href="#" @click.prevent="langChange(lang.value)">
          {{ lang.name }}</a
        >
      </span>
    </span>
    <button class="relative flex items-center" @click="$emit('click')">
      <span class="mr-1 text-sm font-bold text-gray-700">{{ text }}</span>
      <img src="@/assets/images/arrow-typ-01.svg" alt="arrow" />
    </button>
  </div>
</template>

<script>
import { getLocal } from '@/library/Common';
import { i18n } from '../../../public/locales/i18n';
import VueCookies from 'vue-cookies';

export default {
  props: {
    user: {
      type: Object,
      default: () => ({
        name: '',
        department: null,
      }),
    },
    setting: {
      type: Array,
      default: () => [],
    },
    panelVisible: Boolean,
    userGuideYn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userGuideUrl: getLocal('userInfo').userGuideUrl,
      // 다국어 코드
      langList: [
        { name: 'KOR', value: 'ko' },
        { name: 'ENG', value: 'en' },
      ],
      lang: '',
    };
  },
  computed: {
    text() {
      const { name, department } = this.user;
      return `${name}${department ? `(${department})` : ''}`;
    },
  },
  created() {},
  mounted() {
    this.initLanguage();
    this.openMenuEvent();
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
  },
  methods: {
    // 최초 쿠키 언어 설정
    initLanguage() {
      i18n.locale = this.$cookies.get('lang');
      this.langList.forEach((lang) => {
        if (lang.value === this.$cookies.get('lang')) {
          this.lang = lang.name;
        }
      });
    },
    // 언어 변경
    langChange(langValue) {
      i18n.locale = langValue;
      VueCookies.set('lang', langValue, '90d');
      this.langList.forEach((lang) => {
        if (lang.value === langValue) {
          this.lang = lang.name;
        }
      });
      this.closeMenuEvent();
    },
    openMenuEvent() {
      /* 설정 */
      if (document.querySelector('.jsSet1') || document.querySelector('.language_select')) {
        const setFold = document.querySelector('.jsSet1');
        const setLayer = document.querySelector('.set-layer');
        const setFoldLang = document.querySelector('.language_select');
        const setLayerLang = document.querySelector('.set-layer-lang');
        setFold.onclick = function () {
          if (setLayer.classList.contains('active')) {
            setLayer.classList.remove('active');
          } else {
            setLayer.classList.add('active');
          }
        };
        setFoldLang.onclick = function () {
          if (setLayerLang.classList.contains('active')) {
            setLayerLang.classList.remove('active');
          } else {
            setLayerLang.classList.add('active');
          }
        };
      }
    },
    closeMenuEvent() {
      const setLayer = document.querySelector('.set-layer');
      const setLayerLang = document.querySelector('.set-layer-lang');
      setLayer.classList.remove('active');
      setLayerLang.classList.remove('active');
    },
    handleMenuClick(path) {
      this.routePage(path);
      this.closeMenuEvent();
    },
    routePage(_path) {
      this.$router.push(_path);
    },
  },
};
</script>
