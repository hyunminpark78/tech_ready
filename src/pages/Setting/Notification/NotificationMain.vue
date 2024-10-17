<template>
  <div class="box-wrap">
    <div class="overflow-hidden bg-white border rounded-lg border-primary-200 dashboard-card">
      <div class="px-8 border-b py-4 border-primary-200">
        <div class="flex items-center justify-between" style="padding-bottom: 0px">
          <h3 class="text-sm">설정된 이메일 주소와 알림 기준으로 데일리 피드 알림이 발송됩니다.</h3>
        </div>
      </div>

      <div class="flex items-center px-8 py-2 border-b border-primary-200">
        <label class="text-sm text-primary-600 w-44">알림 수신 이메일</label>
        <template v-if="!emailEditable">
          <input v-model="inputEmail" type="email" class="px-5 py-1.75 text-sm w-56 bg-transparent" disabled />
          <button type="button" class="ico-modify mx-3" @click="toggleEmailEditBtn"></button>
        </template>
        <template v-else>
          <input
            v-model="inputEmail"
            type="email"
            class="px-5 py-1.5 text-sm w-56 border rounded"
            :class="validField.email ? 'border-gray-300' : 'border-red'"
            placeholder="이메일을 입력해주세요"
          />
          <button
            class="px-1 py-1 mx-3 text-sm text-white border rounded bg-primary-400 border-primary-400 w-6"
            @click="updateSetEmailBtn"
          >
            저장
          </button>
        </template>
      </div>

      <form id="notification" @submit.prevent="handleSubmitButtonClick">
        <div class="flex items-center px-8 py-4 border-b border-primary-200" @click="handleActiveAllBtnClick">
          <label class="text-sm text-primary-600 w-44">알림 On/Off</label>
          <span class="tab-wrap2 all ml-8">
            <a class="off" :class="allActive ? '' : 'active'"></a>
            <a class="on" :class="allActive ? 'active' : ''"></a>
          </span>
        </div>

        <template v-for="item in setNotification">
          <div
            v-if="item.alarSepCd != 'SAVE_STD'"
            :key="`${item.alarSepCd}`"
            class="flex items-center ml-8 px-8 py-4 border-b border-primary-200"
            @click="toggleActiveBtn(`${item.alarSepCd}`)"
          >
            <label class="text-sm text-primary-600 w-44">{{ item.alarSepNm }}</label>
            <span class="tab-wrap2">
              <a class="off" :class="item.current.alarOptNo === '0' ? 'active' : ''"></a>
              <a class="on" :class="item.current.alarOptNo === '1' ? 'active' : ''"></a>
            </span>
            <span class="text-sm ml-8">{{ item.alarSepDesc.replace('#{OPT_VAL}', item.current.optVal) }}</span>

            <div class="radio-wrap2">
              <template v-for="opt in item.optValList">
                <label :key="`${opt}`" class="radio2">
                  <input
                    type="radio"
                    :name="`${item.alarSepNm}`"
                    :title="`${opt}`"
                    :value="`${opt}`"
                    :checked="`${item.current.optVal == opt ? 'checked' : ''}`"
                    disabled
                  />
                  <span class="label">{{ opt }}{{ item.optUnitVal }}</span>
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
          <button
            type="button"
            class="px-1 py-3 mx-3 text-sm bg-white border rounded text-primary-400 border-primary-400 w-28"
            @click.stop="handleCancleButtonClick"
          >
            취소
          </button>
          <button
            type="submit"
            class="px-1 py-3 mx-3 text-sm text-white border rounded bg-primary-400 border-primary-400 w-28"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import _ from 'loadsh';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Notification',
  data() {
    return {
      inputEmail: window.keycloak.idTokenParsed.email,
      inputForm: { email: window.keycloak.idTokenParsed.email },
      validField: { email: true },
      valid: false,
      emailEditable: false,
      setNotification: [],
    };
  },
  computed: {
    ...mapState('notification', ['notification']),
    allActive() {
      let allActive = this.setNotification.some((item) => item.current.alarOptNo === '1');
      // this.setNotification.forEach((item) => {
      //   console.log(item.current.alarOptNo === '1' ? 'ON' : 'OFF');
      // });

      return allActive;
    },
  },
  created() {
    this.getNotification();
  },
  methods: {
    ...mapActions('notification', ['fetchNotification', 'updateSetEmail', 'updateNotification']),
    async getNotification() {
      await this.fetchNotification();

      const alarSetEmail = this.notification.alarSetEmail;
      if (alarSetEmail) this.inputEmail = alarSetEmail;

      this.setNotification = _.cloneDeep(this.notification);
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
    },
    async updateSetEmailBtn() {
      await this.updateSetEmail({ alarSetEmail: this.inputEmail })
        .then(() => {
          this.emailEditable = !this.emailEditable;
          alert('알림 수신 이메일이 수정되었습니다.');
        })
        .catch(() => {
          alert('오류가 발생하였습니다. 관리자에게 문의하세요');
        });
    },
    async handleSubmitButtonClick() {
      const clonedData = _.cloneDeep(this.setNotification);
      const data = _.map(clonedData, 'current');

      await this.updateNotification(data)
        .then(() => {
          alert('알림 설정이 수정되었습니다.');
        })
        .catch(() => {
          alert('오류가 발생하였습니다. 관리자에게 문의하세요');
        });
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
