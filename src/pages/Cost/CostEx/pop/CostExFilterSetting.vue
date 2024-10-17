<template>
  <section class="filter-setting-wrap">
    <!-- 알림 -->
    <div class="fixed top-0 bottom-0 left-0 right-0 z-30 bg-black bg-opacity-75-"></div>
    <section class="z-30 p-8 rounded policy-content w-600" style="min-height: 300px">
      <h2 class="mb-1 text-2xl text-primary-400">{{ $t('menu.filterSettings') }}</h2>

      <button class="absolute top-0 right-0 close-policy-modal mt-7 mr-7" @click="close">
        <img src="@/assets/images/ico-btn-search-close.svg" alt="." />
      </button>
      <div v-if="isLoading" class="relative" style="min-height: 200px">
        <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
          <div class="mb-4 loading_rotate">
            <span class="loadingcolor"></span>
          </div>
          <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
        </div>
      </div>
      <div
        v-else-if="!isLoading && !allFilterSetting.length"
        class="flex flex-col items-center justify-center"
        style="height: 198px"
      >
        <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
        <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
      </div>
      <div v-else-if="!isLoading && allFilterSetting.length">
        <div class="mb-5 flex items-center">
          <p class="text-sm text-gray-700 font-medium">
            {{ $t('setting.selectUpFiveFilter') }}
          </p>
        </div>

        <div class="list4-wrap">
          <dl>
            <dt v-if="basicGroup.length > 0">{{ $t('setting.default') }}</dt>
            <dd v-if="basicGroup.length > 0">
              <template v-for="item in basicGroup">
                <label class="checkbox2">
                  <input
                    type="checkbox"
                    name="checkbox1"
                    :title="i18n().locale === 'ko' ? item.fltSepCdNm : item.fltSepCdEnNm"
                    :value="item.fltSepCd"
                    :checked="isChecked(item.fltSepCd)"
                    @click="checked($event)"
                  />
                  <span v-if="i18n().locale === 'ko'" class="label">{{ item.fltSepCdNm }}</span>
                  <span v-if="i18n().locale === 'en'" class="label">{{ item.fltSepCdEnNm }}</span>
                </label>
              </template>
            </dd>
            <dt v-if="resourceGroup.length > 0">{{ $t('setting.resourceType') }}</dt>
            <dd v-if="resourceGroup.length > 0">
              <template v-for="item in resourceGroup">
                <label class="checkbox2">
                  <input
                    type="checkbox"
                    name="checkbox1"
                    :title="i18n().locale === 'ko' ? item.fltSepCdNm : item.fltSepCdEnNm"
                    :value="item.fltSepCd"
                    :checked="isChecked(item.fltSepCd)"
                    @click="checked($event)"
                  />
                  <span v-if="i18n().locale === 'ko'" class="label">{{ item.fltSepCdNm }}</span>
                  <span v-if="i18n().locale === 'en'" class="label">{{ item.fltSepCdEnNm }}</span>
                </label>
              </template>
            </dd>
            <dt v-if="platformGroup.length > 0">{{ $t('setting.platformType') }}</dt>
            <dd v-if="platformGroup.length > 0">
              <template v-for="item in platformGroup">
                <label class="checkbox2">
                  <input
                    type="checkbox"
                    name="checkbox1"
                    :title="i18n().locale === 'ko' ? item.fltSepCdNm : item.fltSepCdEnNm"
                    :value="item.fltSepCd"
                    :checked="isChecked(item.fltSepCd)"
                    @click="checked($event)"
                  />
                  <span v-if="i18n().locale === 'ko'" class="label">{{ item.fltSepCdNm }}</span>
                  <span v-if="i18n().locale === 'en'" class="label">{{ item.fltSepCdEnNm }}</span>
                </label>
              </template>
            </dd>
            <dt v-if="costTypeGroup.length > 0">{{ $t('setting.costType') }}</dt>
            <dd v-if="costTypeGroup.length > 0">
              <template v-for="item in costTypeGroup">
                <label class="checkbox2">
                  <input
                    type="checkbox"
                    name="checkbox1"
                    :title="i18n().locale === 'ko' ? item.fltSepCdNm : item.fltSepCdEnNm"
                    :value="item.fltSepCd"
                    :checked="isChecked(item.fltSepCd)"
                    @click="checked($event)"
                  />
                  <span v-if="i18n().locale === 'ko'" class="label">{{ item.fltSepCdNm }}</span>
                  <span v-if="i18n().locale === 'en'" class="label">{{ item.fltSepCdEnNm }}</span>
                </label>
              </template>
            </dd>
            <dt v-if="customGroup.length > 0">{{ $t('setting.customType') }}</dt>
            <dd v-if="customGroup.length > 0">
              <template v-for="item in customGroup">
                <label class="checkbox2">
                  <input
                    type="checkbox"
                    name="checkbox1"
                    :title="i18n().locale === 'ko' ? item.fltSepCdNm : item.fltSepCdEnNm"
                    :value="item.fltSepCd"
                    :checked="isChecked(item.fltSepCd)"
                    @click="checked($event)"
                  />
                  <span v-if="i18n().locale === 'ko'" class="label">{{ item.fltSepCdNm }}</span>
                  <span v-if="i18n().locale === 'en'" class="label">{{ item.fltSepCdEnNm }}</span>
                </label>
              </template>
            </dd>
          </dl>
        </div>

        <div class="text-center mt-7">
          <button
            class="inline-block px-6 h-32 text-sm text-primary-400 border rounded-sm bg-white border-primary-400 font-bold"
            @click="close"
          >
            {{ $t('setting.cancel') }}
          </button>
          <button
            class="inline-block px-6 h-32 text-sm text-white border rounded-sm bg-primary-400 border-primary-400 font-bold ml-1.5"
            :disabled="!isSaveAvailable"
            :style="
              !isSaveAvailable
                ? {
                    'background-color': '#e3ebf1 !important',
                    'border-color': '#e3ebf1 !important',
                  }
                : {}
            "
            @click="save"
          >
            {{ $t('setting.save') }}
          </button>
        </div>
      </div>
    </section>
    <!-- 알림 -->
  </section>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import costExService from '@/services/costExService';
import { types } from '@/store/modules/costEx';
import _ from 'lodash';
import { i18n } from '../../../../../public/locales/i18n';

export default {
  name: 'CostExFilterSetting',
  props: {
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      essentialFilter: ['contract_id'],
      checkedFilter: [],
      filterCds: [],
      basicGroup: [],
      resourceGroup: [],
      platformGroup: [],
      costTypeGroup: [],
      customGroup: [],
    };
  },
  computed: {
    ...mapState('costEx', ['allFilterSetting', 'userFilterSetting', 'searchParam']),
    ...mapGetters('costEx', ['cspTypCd']),
    isSaveAvailable() {
      const savedUserFilter = _.uniq(this.userFilterSetting.map((item) => item.fltSepCd));
      return !_.isEqual(_.sortBy(this.checkedFilter), _.sortBy(savedUserFilter));
    },
  },
  watch: {
    allFilterSetting() {
      this.initFilterSetting();
    },
    userFilterSetting() {
      this.initFilterSetting();
    },
  },
  created() {},
  mounted() {},
  methods: {
    i18n() {
      return i18n;
    },
    ...mapActions('costEx', ['fetchAllFilterSetting', 'fetchUserFilterSetting', 'fetchSearchParam']),
    ...mapMutations('costEx', {
      setUpdateUserFilterSetting: types.SET_UPDATE_USER_FILTER_SETTING,
    }),
    initFilterSetting() {
      if (!this.allFilterSetting) {
        return;
      }
      const allFilterData = this.allFilterSetting;
      const data = _.groupBy(allFilterData, 'filterGroup');
      console.log('data', data);
      // const data = _.groupBy(this.allFilterSetting, 'filterGroup');
      this.basicGroup = data['기본'] || [];
      this.resourceGroup = data['리소스 유형'] || [];
      this.platformGroup = data['플랫폼 유형'] || [];
      this.costTypeGroup = data['비용 유형'] || [];
      this.customGroup = data['사용자 정의 유형'] || [];
      this.checkedFilter = this.getDistinctUserFilter();
    },
    getDistinctUserFilter() {
      let distinctUserFilter = [];
      if (!_.isEmpty(this.userFilterSetting)) {
        distinctUserFilter = _.uniq(this.userFilterSetting.map((item) => item.fltSepCd));
      }

      if (!distinctUserFilter.length) {
        return [...this.essentialFilter];
      }
      if (distinctUserFilter.length > 5) {
        return distinctUserFilter.slice(0, 5);
      }
      return distinctUserFilter;
    },
    close() {
      // 취소 시 원복
      this.initFilterSetting();
      this.$emit('closeFilterSetting');
    },
    async save() {
      const distinctCheckedFilter = _.uniq(this.checkedFilter);
      try {
        if (this.cspTypCd === 'AWS') {
          await costExService.saveUserFilter(distinctCheckedFilter);
        } else if (this.cspTypCd === 'AZURE') {
          await costExService.saveAzureUserFilter(distinctCheckedFilter);
        }
        // 사용자 설정 저장 시 userFilter로 설정 후 창 닫기
        this.fetchSearchParam({ ...this.searchParam, searchType: 'userFilter' });
        this.setUpdateUserFilterSetting(true); // 바뀐 사용자 필터 요청
        alert(this.$t('common.paragraph.saved'));
        this.$emit('closeFilterSetting');
      } catch (e) {
        console.error('Error) ConstExFilterSetting save() : ', e);
        alert(this.$t('common.paragraph.notSaved'));
        this.initFilterSetting();
      }
    },
    isChecked(fltSepCd) {
      return this.checkedFilter.includes(fltSepCd);
    },
    checked(e) {
      const filterCd = e.target.value;
      if (this.essentialFilter.includes(filterCd)) {
        e.preventDefault();
        return false;
      }
      if (e.currentTarget.checked === false) {
        this.checkedFilter.splice(this.checkedFilter.indexOf(filterCd), 1);
      } else {
        this.checkedFilter.push(filterCd);
      }

      if (this.checkedFilter.length > 5) {
        alert(this.$t('common.paragraph.selectUpFive'));
        e.preventDefault();
        this.checkedFilter.splice(this.checkedFilter.indexOf(filterCd), 1);
        return false;
      }
    },
  },
};
</script>
