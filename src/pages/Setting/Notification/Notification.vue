<template>
  <div class="contents-wrap">
    <SectionLnb></SectionLnb>
    <div class="contents">
      <SectionNewHeader
        title-class="flex items-center py-5"
        :main-icon="{ src: require('@/assets/images/ico-setting-aws.svg') }"
        :icon="{ src: require('@/assets/images/arrow-typ-02-black.svg'), alt: 'arrow-typ-02-black.svg' }"
        :title="$t('menu.setting')"
        :title2="$t('menu.notiSetting')"
      />
      <div class="box-wrap">
        <Section>
          <SectionMain>
            <div class="box-wrap">
              <div class="overflow-hidden bg-white border rounded-lg border-primary-200 dashboard-card">
                <div class="px-8 border-b py-4 border-primary-200">
                  <div class="flex items-center justify-between" style="padding-bottom: 0px">
                    <p class="text-sm" style="line-height: 25px">
                      {{ $t('setting.notiFeedSent') }}<br />
                      {{ $t('setting.notiSetChange') }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center px-8 py-2 border-b border-primary-200">
                  <label class="text-sm text-primary-600 w-44 font-bold">{{ $t('setting.notiReceivedEmail') }}</label>
                  <template v-if="!emailEditable">
                    <input
                      v-model="inputEmail"
                      type="email"
                      class="px-5 py-1.75 text-sm w-56 bg-transparent"
                      disabled
                    />
                    <button
                      type="button"
                      class="ico-modify mx-3"
                      :title="$t('setting.editEmail')"
                      @click="toggleEmailEditBtn"
                    ></button>
                  </template>
                  <template v-else>
                    <input
                      v-model="inputEmail"
                      type="email"
                      class="px-5 py-1.5 text-sm w-56 border rounded"
                      :class="validField.email ? 'border-gray-300' : 'border-red'"
                      :placeholder="$t('setting.enterEmail')"
                    />
                    <button
                      class="px-1 py-1 mx-3 text-sm text-white border rounded bg-primary-400 border-primary-400 w-6"
                      @click="updateSetEmailBtn"
                    >
                      {{ $t('setting.save') }}
                    </button>
                  </template>
                </div>

                <div id="notification">
                  <div class="flex items-center px-8 py-4 border-b border-primary-200">
                    <label class="text-sm text-primary-600 w-44 font-bold">{{ $t('setting.allNotiOnOff') }}</label>
                    <span class="tab-wrap2 all ml-8" @click="handleActiveAllBtnClick">
                      <a href="javascript:void(0);" class="off" :class="allActive ? '' : 'active'"></a>
                      <a href="javascript:void(0);" class="on" :class="allActive ? 'active' : ''"></a>
                    </span>
                    <span class="tab ml-8">
                      <template v-for="item in days">
                        <button
                          class="inline-block rounded px-4 mr-2 py-1.5 font-bold border border-primary-400 text-sm"
                          :class="
                            allActive && checkIncludeDay(item.id)
                              ? 'text-white bg-primary-400'
                              : 'text-primary-400 bg-white'
                          "
                          :style="!allActive ? 'border-color:#e9ebed; color:#e9ebed' : ''"
                          :disabled="!allActive"
                          @click="handleClickDay(item.id)"
                        >
                          {{ item.nm }}
                        </button>
                      </template>
                    </span>
                  </div>

                  <template v-for="item in setNotification">
                    <div
                      v-if="item.alarSepCd !== 'SAVE_STD'"
                      :key="`${item.alarSepCd}`"
                      class="flex items-center ml-8 px-8 py-4 border-b border-primary-200"
                    >
                      <label v-if="$i18n.locale === 'ko'" class="text-sm text-primary-600 w-44 font-bold">{{
                        item.alarSepNm
                      }}</label>
                      <label v-if="$i18n.locale === 'en'" class="text-sm text-primary-600 w-44 font-bold">{{
                        item.alarSepEnNm
                      }}</label>
                      <span class="tab-wrap2" @click="toggleActiveBtn(`${item.alarSepCd}`)">
                        <a
                          href="javascript:void(0);"
                          class="off"
                          :class="item.current.alarOptNo === '0' ? 'active' : ''"
                        ></a>
                        <a
                          href="javascript:void(0);"
                          class="on"
                          :class="item.current.alarOptNo === '1' ? 'active' : ''"
                        ></a>
                      </span>
                      <span v-if="$i18n.locale === 'ko'" class="text-sm ml-8">{{
                        item.alarSepDesc.replace('#{OPT_VAL}', item.current.optVal)
                      }}</span>
                      <span v-if="$i18n.locale === 'en'" class="text-sm ml-8">{{
                        item.alarSepEmDesc.replace('#{OPT_VAL}', item.current.optVal)
                      }}</span>

                      <div class="radio-wrap2">
                        <template v-for="opt in item.optValList">
                          <label :key="`${opt}`" class="radio2">
                            <input
                              v-model="item.current.optVal"
                              type="radio"
                              :name="`${item.alarSepNm}`"
                              :title="`${opt}`"
                              :value="`${opt}`"
                              :checked="`${item.current.optVal === opt ? 'checked' : ''}`"
                            />
                            <span v-if="$i18n.locale === 'ko'" class="label">{{ opt }}{{ item.optUnitVal }}</span>
                            <span v-if="$i18n.locale === 'en'" class="label">{{ opt }}{{ item.optUnitEmVal }}</span>
                          </label>
                        </template>
                      </div>
                    </div>
                  </template>

                  <div v-if="!!valid" class="flex items-center px-8 py-2">
                    <label class="w-52"></label>
                    <div class="w-full mb-5 text-sm text-secondary">{{ errMsg }}</div>
                  </div>

                  <div class="flex justify-center px-8 py-7">
                    <RouterLink
                      to="/dashboard/total"
                      class="px-1 py-3 mx-3 text-sm bg-white border rounded text-center text-primary-400 border-primary-400 w-28"
                    >
                      {{ $t('setting.cancel') }}
                    </RouterLink>
                    <button
                      type="button"
                      class="px-1 py-3 mx-3 text-sm text-white border rounded bg-primary-400 border-primary-400 w-28"
                      @click="handleSubmitButtonClick"
                    >
                      {{ $t('setting.save') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SectionMain>
        </Section>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'loadsh';
import { mapActions, mapState } from 'vuex';
import Section, { SectionLnb, SectionNewHeader, SectionMain } from '@/components/Section';
import { i18n } from '../../../../public/locales/i18n';
import notificationLang from '../../../../public/locales/notification.json';

export default {
  name: 'Notification',
  components: {
    Section,
    SectionLnb,
    SectionNewHeader,
    SectionMain,
  },
  data() {
    return {
      inputEmail: window.keycloak.idTokenParsed.email,
      inputForm: { email: window.keycloak.idTokenParsed.email },
      validField: { email: true },
      valid: false,
      emailEditable: false,
      setNotification: [],
      dowSepCds: [],
      activeDayClass: 'text-white bg-primary-400',
      days: {},
    };
  },
  computed: {
    ...mapState('notification', ['notification', 'userSchdInfo']),
    allActive() {
      const exceptSaveStd = this.setNotification.filter((item) => item.alarSepCd !== 'SAVE_STD');
      let allActive = exceptSaveStd.some((item) => item.current.alarOptNo === '1');
      return allActive;
    },
  },
  watch: {
    '$i18n.locale': 'setDays',
  },
  created() {
    this.setDays();
    this.getNotification();
  },
  methods: {
    ...mapActions('notification', ['fetchNotification', 'updateSetEmail', 'updateNotification']),
    setDays() {
      if (i18n.locale === 'ko') {
        this.days = [
          { id: '2', nm: '월' },
          { id: '3', nm: '화' },
          { id: '4', nm: '수' },
          { id: '5', nm: '목' },
          { id: '6', nm: '금' },
          { id: '7', nm: '토' },
          { id: '1', nm: '일' },
        ];
      } else {
        this.days = [
          { id: '2', nm: 'MON' },
          { id: '3', nm: 'TUE' },
          { id: '4', nm: 'WED' },
          { id: '5', nm: 'THR' },
          { id: '6', nm: 'FRI' },
          { id: '7', nm: 'SAT' },
          { id: '1', nm: 'SUN' },
        ];
      }
    },
    async getNotification() {
      await this.fetchNotification();
      this.inputEmail = this.userSchdInfo.alarSetEmail;
      // this.setNotification = _.cloneDeep(this.notification);
      const tempNotification = _.cloneDeep(this.notification);
      console.log('notificationLang', notificationLang);
      tempNotification.forEach((noti, index) => {
        tempNotification[index].alarSepEnNm = notificationLang.data[index].alarSepEnNm;
        tempNotification[index].alarSepEmDesc = notificationLang.data[index].alarSepEmDesc;
        tempNotification[index].optUnitEmVal = notificationLang.data[index].optUnitEmVal;
      });
      console.log('tempNotification', tempNotification);
      this.setNotification = tempNotification;
      this.dowSepCds = _.cloneDeep(this.userSchdInfo.dowSepCds == null ? [] : this.userSchdInfo.dowSepCds);
    },
    handleActiveAllBtnClick() {
      let active = !this.allActive;
      _.forEach(this.setNotification, (item) => {
        item.current.alarOptNo = active ? '1' : '0';
      });
    },
    toggleEmailEditBtn() {
      this.emailEditable = !this.emailEditable;
    },
    toggleActiveBtn(alarSepCd) {
      const clickedItem = _.find(this.setNotification, (item) => item.alarSepCd == alarSepCd);
      clickedItem.current.alarOptNo = clickedItem.current.alarOptNo === '0' ? '1' : '0';

      // 사용률 기준, 절감률 기준 값 동일하게 설정
      if (clickedItem.current.alarSepCd === 'UTL_STD') {
        const saveStd = _.find(this.setNotification, (item) => item.alarSepCd == 'SAVE_STD');
        saveStd.current.alarOptNo = clickedItem.current.alarOptNo;
      }
    },
    async updateSetEmailBtn() {
      await this.updateSetEmail({ alarSetEmail: this.inputEmail })
        .then(() => {
          this.emailEditable = !this.emailEditable;
          alert(this.$t('setting.notiEmailModified'));
        })
        .catch(() => {
          alert(this.$t('setting.errorOccurredContact'));
        });
    },
    async handleSubmitButtonClick() {
      const clonedData = _.cloneDeep(this.setNotification);
      const data = _.map(clonedData, 'current');
      if (!this.allActive) {
        this.dowSepCds = [];
      }
      const userSchdInfo = { ...this.userSchdInfo, ['dowSepCds']: this.dowSepCds };
      let param = {
        notifications: data,
        userSchdInfo: userSchdInfo,
      };
      await this.updateNotification(param)
        .then(() => {
          alert(this.$t('setting.notiSettingsModified'));
        })
        .catch(() => {
          alert(this.$t('setting.errorOccurredContact'));
        });
    },
    handleClickDay(day) {
      // 포함되었으면 삭제, 미포함이면 추가
      if (this.dowSepCds.indexOf(day) > -1) {
        if (this.dowSepCds.length === 1) {
          alert(this.$t('setting.selectOneDayWeek'));
          return;
        }
        this.dowSepCds.splice(this.dowSepCds.indexOf(day), 1);
      } else {
        this.dowSepCds.push(day);
      }
    },
    checkIncludeDay(day) {
      return this.dowSepCds == null ? false : this.dowSepCds.includes(day) ? true : false;
    },
  },
};
</script>

<style scoped>
.bg-transparent {
  background-color: transparent;
}
.py-1\.75 {
  padding-top: 0.438rem;
  padding-bottom: 0.438rem;
}
.radio-wrap2 {
  margin-left: auto;
}
.radio2 {
  margin-left: 1rem;
}
.tab-wrap2 .off.active {
  background-color: #e9ebed;
}
.tab-wrap2 .off:not(.active) {
  background-color: white;
}
.tab-wrap2 .on.active {
  background-color: #00a5ed;
}
.tab-wrap2 .on:not(.active) {
  background-color: white;
}
</style>
