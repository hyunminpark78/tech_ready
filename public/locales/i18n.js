import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "./en/en.json";
import ko from "./ko/ko.json";


Vue.use(VueI18n);

// 최초 화면 진입 시 브라우저 언어 적용
// let locale = navigator.language

export const i18n = new VueI18n({
    locale: "ko",
    // locale: locale,
    fallbackLocale: "en",
    messages: { ko, en }
});

const loadedLanguages = ["ko"]

export function loadLanaguageAsync(lang) {
    if (i18n.locale === lang) {
        return Promise.resolve(lang)
    }

    if (loadedLanguages.includes(lang)) {
        return Promise.resolve()
    }
}
