<template>
  <section>
    <CostExFilterSetting
      v-show="isOpenFilterSetting"
      ref="filterSetting"
      :is-loading="isLoading"
      @closeFilterSetting="closeFilterSetting"
    ></CostExFilterSetting>

    <div class="filter-wrap" style="/*box-sizing: content-box*/">
      <div class="tit">{{ $t('common.select.filter') }}</div>
      <div class="detail">
        <div class="util">
          <button class="btn line" @click="openFilterSetting">
            <span class="filter">{{ $t('common.select.filterSettings') }}</span>
          </button>
          <button class="clear" @click="clearAllOption">Clear all</button>
        </div>
        <section v-if="isLoading">
          <div class="relative border-t" style="min-height: 200px; background-color: #e3ebf1; margin-top: 20px">
            <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
              <div class="mb-4 loading_rotate">
                <span class="loadingcolor"></span>
              </div>
              <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
            </div>
          </div>
        </section>

        <section v-if="!isLoading && filters.length > 0">
          <div class="list">
            <dl v-for="(item, i) in filters" :key="`filter-${i}`">
              <!-- set -->
              <dt :id="`dropdown-${i}`">
                <span v-if="i18n().locale === 'ko'" class="ti"> {{ item.fltSepCdNm }}</span>
                <span v-if="i18n().locale === 'en'" class="ti"> {{ item.fltSepCdEnNm }}</span>
                <!-- tooltip -->
                <div class="tooltip-wrap inline-block">
                  <button class="ico jsTooltip1" @click="toggleFilterTooltip(item.fltSepCd)">
                    <span>툴팁 열기</span>
                  </button>
                  <div
                    class="tooltip-layer"
                    :style="tooltip[changeToCamelCase(item.fltSepCd)]['isShow'] ? 'display: block' : 'display: none'"
                    style="width: 300px"
                  >
                    <div v-if="item.fltSepCd === 'tag_val' && cspTypCd === 'AZURE'" style="width: 240px">
                      {{ tooltip[changeToCamelCase('azure_tag_val')]['tooltipText'] }}
                    </div>
                    <div v-else style="width: 240px">
                      {{ tooltip[changeToCamelCase(item.fltSepCd)]['tooltipText'] }}
                    </div>
                    <button class="close jsTooltipClose1" @click="toggleFilterTooltip(item.fltSepCd)">툴팁 닫기</button>
                  </div>
                </div>
                <!-- //tooltip -->
                <button class="clear" @click="clearOption(item, true)">Clear</button>
              </dt>
              <!-- //set -->
              <dd>
                <div v-if="i18n().locale === 'ko'" class="select2-wrap">
                  <button class="sel jsBtnShow1" @click="clickDropdown($event, item, i)">
                    {{ item.fltSepCdNm }} 선택
                  </button>
                </div>
                <div v-if="i18n().locale === 'en'" class="select2-wrap">
                  <button class="sel jsBtnShow1" @click="clickDropdown($event, item, i)">Select</button>
                </div>
                <div class="lst">
                  <div
                    v-for="(option, optionIndex) in tempFilterParam[changeToCamelCase(item.fltSepCd)].slice(0, 2)"
                    :key="`option-${optionIndex}`"
                    class="ls"
                  >
                    {{ option.name }}
                    <button
                      class="delete"
                      @click="changeOption(option, item.fltSepCd, true), saveFilterOption(item, null, true)"
                    >
                      삭제
                    </button>
                  </div>
                  <div
                    v-if="tempFilterParam[changeToCamelCase(item.fltSepCd)].length > 2"
                    class="button"
                    :class="{ active: isShowOptionList[changeToCamelCase(item.fltSepCd)] === true }"
                  >
                    <button class="all jsBtnShow1" @click="toggleAllSelectedOption(item.fltSepCd)">
                      모두 보기 ({{ tempFilterParam[changeToCamelCase(item.fltSepCd)].length }})
                    </button>
                    <!-- 모두보기layer -->
                    <div class="lAll1" style="z-index: 100">
                      <button class="close jsBtnClose2" @click="toggleAllSelectedOption(item.fltSepCd)">닫기</button>
                      <div class="scrollY">
                        <div
                          v-for="(option, optionIndex) in tempFilterParam[changeToCamelCase(item.fltSepCd)]"
                          :key="`option-hidden-${optionIndex}`"
                          class="ls"
                        >
                          {{ option.name }}
                          <button
                            class="delete"
                            @click="changeOption(option, item.fltSepCd, true), saveFilterOption(item, null, true)"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                    <!-- //모두보기layer -->
                  </div>
                </div>
              </dd>
            </dl>
          </div>
        </section>
        <section v-else-if="!isLoading && filters.length <= 0">
          <div class="flex flex-col items-center justify-center" style="height: 198px">
            <img src="@/assets/images/ico-nodata-chart.svg" alt="." />
            <p class="mt-3 text-gray-700">{{ $t('common.paragraph.noDataDisplay') }}</p>
          </div>
        </section>
        <div class="button-wrap bt">
          <!-- modify20230818-2 -->
          <button class="btn line" @click="filterToggle">
            <span>{{
              isAllFilterDisplayed ? $t('common.button.viewDefaultFilters') : $t('common.button.viewOtherFilters')
            }}</span>
          </button>
        </div>
      </div>
      <!-- <button class="close jsFilterMin1">필터 최소화</button> -->
      <button class="btn-min jsFilterMin1">최소화</button>
    </div>
    <!--   filter dropdown -->
    <div v-if="isDropdownVisible">
      <div class="fixed top-0 bottom-0 left-0 right-0 z-30" @click="closeDropdown()"></div>
      <div
        class="bg-white border rounded border-primary-400 dashboard-card select-two with-button dropdown-box"
        :style="dropdownStyle"
      >
        <div
          v-if="dropdownItem.fltSepCd === 'tag_key' && !isTagKeyProcessing && !isTagValueProcessing"
          class="select3-wrap"
        >
          <Select
            ref=""
            class="is-w-100per"
            :data="[
              { name: i18n().locale === 'ko' ? '태그 키 선택' : 'Select tag key', id: '' },
              ...dropdownItem.optionList,
            ]"
            :text-getter="(opt) => opt.name"
            :key-getter="(opt) => opt.id"
            select-class="flex items-center justify-between w-full px-4 py-1.5 text-sm text-left"
            :arrow-src="require('@/assets/images/arrow-typ-03.svg')"
            arrow-class="-mr-2"
            option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200 top-33"
            option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
            :default-selected="0"
            @click="(selectedItem) => onSelectTagKey(selectedItem.id)"
          />
        </div>
        <div
          v-if="dropdownItem.fltSepCd === 'ctgry_id' && !isSvcCtgryProcessing && !isSvcGrpProcessing"
          class="select3-wrap"
        >
          <Select
            ref=""
            class="is-w-100per"
            :data="[
              { name: i18n().locale === 'ko' ? '서비스 카테고리 선택' : 'Select service category', id: '' },
              ...dropdownItem.optionList,
            ]"
            :text-getter="(opt) => opt.name"
            :key-getter="(opt) => opt.id"
            select-class="flex items-center justify-between w-full px-4 py-1.5 text-sm text-left"
            :arrow-src="require('@/assets/images/arrow-typ-03.svg')"
            arrow-class="-mr-2"
            option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200 top-33"
            option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
            :default-selected="0"
            @click="(selectedItem) => onSelectSvcCtgry(selectedItem.id)"
          />
        </div>
        <!-- search -->
        <template
          v-if="
            dropdownItem.fltSepCd !== 'tag_key' &&
            dropdownItem.fltSepCd !== 'ctgry_id' &&
            !isTagKeyProcessing &&
            !isSvcCtgryProcessing
          "
        >
          <div class="search-wrap type2">
            <input
              v-model="
                searchOptionKeywords.find((optionKeyword) => optionKeyword.fltSepCd === dropdownItem.fltSepCd).keyword
              "
              type="text"
              :placeholder="$t('common.placeholder.enterSearchTerm')"
              class="keyword w-full"
              @keyup="searchInit(dropdownItem)"
            />
          </div>
          <!-- //search -->
          <div class="scrollY">
            <ul class="text-sm">
              <li
                v-if="
                  searchOptionKeywords.find((optionKeyword) => optionKeyword.fltSepCd === dropdownItem.fltSepCd)
                    .keyword === ''
                "
              >
                <label class="radio2">
                  <input v-model="dropdownItem.allOptionChecked" type="checkbox" name="filterRadio2" title="전체" />
                  <span
                    class="label"
                    style="font-size: 12px"
                    @click="selectAllOption(dropdownItem, dropdownItem.fltSepCd)"
                    >{{ $t('cost.all') }}</span
                  >
                </label>
              </li>
              <li v-for="(option, optionIndex) in dropdownItem.optionList" :key="`option-${optionIndex}`">
                <label v-show="option.visible" class="radio2 filter-option-radio">
                  <input
                    v-model="option.value"
                    type="checkbox"
                    name="filterRadio2"
                    :title="option.name"
                    @change="changeOption(option, dropdownItem.fltSepCd)"
                  />
                  <span class="label" style="font-size: 12px">{{ option.name }}</span>
                </label>
              </li>
            </ul>
          </div>
        </template>
        <template v-if="!isTagValueProcessing">
          <div v-if="dropdownItem.fltSepCd === 'tag_key' && !isTagKeyProcessing" class="noresult">
            {{ $t('common.paragraph.selectTagKey') }}
          </div>
        </template>
        <template v-if="!isSvcGrpProcessing">
          <div v-if="dropdownItem.fltSepCd === 'ctgry_id' && !isSvcCtgryProcessing" class="noresult">
            {{ $t('common.paragraph.selectServiceCategory') }}
          </div>
        </template>
        <!-- 로딩: 태그 key, value 요청시 -->
        <section
          v-if="
            (dropdownItem.fltSepCd === 'tag_key' || dropdownItem.fltSepCd === 'tag_val') &&
            (isTagKeyProcessing || isTagValueProcessing)
          "
        >
          <div class="relative border-t" style="min-height: 200px; background-color: #e3ebf1">
            <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
              <div class="mb-4 loading_rotate">
                <span class="loadingcolor"></span>
              </div>
              <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
            </div>
          </div>
        </section>
        <section
          v-if="
            (dropdownItem.fltSepCd === 'ctgry_id' || dropdownItem.fltSepCd === 'service_group_id') &&
            (isSvcCtgryProcessing || isSvcGrpProcessing)
          "
        >
          <div class="relative border-t" style="min-height: 200px; background-color: #e3ebf1">
            <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
              <div class="mb-4 loading_rotate">
                <span class="loadingcolor"></span>
              </div>
              <div class="loading_txt" style="color: #5a5a5a">Loading...</div>
            </div>
          </div>
        </section>
        <div class="flex">
          <!-- 레이어닫기 : class="jsBtnClose1" -->
          <button
            class="w-1/2 px-1 py-2.5 text-sm text-gray-600 bg-white border-t border-gray-300 rounded-bl font-medium jsBtnClose1"
            @click="closeDropdown"
          >
            {{ $t('common.button.close') }}
          </button>
          <button
            class="w-1/2 px-1 py-2.5 text-sm text-white border-t rounded-br bg-primary-400 border-primary-400 font-medium jsBtnClose1"
            @click="saveFilterOption(dropdownItem, dropdownItem.fltSepCd)"
          >
            {{ $t('common.button.selectionComplete') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CostExFilterSetting from '@/pages/Cost/CostEx/pop/CostExFilterSetting';
import Select from '@/components/Select';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import _ from 'lodash';
import costExService from '@/services/costExService';
import { types } from '@/store/modules/costEx';
import { setApiConfig } from '@/library/APICaller';
import axios from 'axios';
import { i18n } from '../../../../public/locales/i18n';

export default {
  name: 'CostExGridFilter',
  components: { Select, CostExFilterSetting },
  props: {},
  data() {
    return {
      isAllFilterLoading: true,
      isUserFilterLoading: true,
      tempOptList: [],
      searchOptionKeywords: [{ fltSepCd: '', keyword: '' }],
      isOpenFilterSetting: false,
      filters: [],
      tempFilterParam: {
        custId: [],
        contractId: [],
        serviceCode: [],
        usageAccountId: [],
        productRegion: [],
        productCode: [],
        productFamily: [],
        instanceType: [],
        usageType: [],
        physicalProcessor: [],
        productOperation: [],
        operatingSystem: [],
        databaseEngine: [],
        lineitemType: [],
        billingEntity: [],
        serviceGroupId: [],
        tagVal: [],
        meterCategory: [],
        subscriptionName: [],
        meterRegion: [],
        meterName: [],
        meterSubCategory: [],
        resourceGroup: [],
        azureTagVal: [],
      },
      isDropdownVisible: false,
      dropdownStyle: {},
      dropdownItem: {},
      isShowOptionList: {
        custId: false,
        contractId: false,
        serviceCode: false,
        usageAccountId: false,
        productRegion: false,
        productCode: false,
        productFamily: false,
        instanceType: false,
        usageType: false,
        physicalProcessor: false,
        productOperation: false,
        operatingSystem: false,
        databaseEngine: false,
        lineitemType: false,
        billingEntity: false,
        serviceGroupId: false,
        tagVal: false,
        meterCategory: false,
        subscriptionName: false,
        meterRegion: false,
        meterName: false,
        meterSubCategory: false,
        resourceGroup: false,
        azureTagVal: false,
      },
      isTagKeyProcessing: false,
      isTagValueProcessing: false,
      isSvcCtgryProcessing: false,
      isSvcGrpProcessing: false,
      tooltip: {},
      prevSelectedTagValueFilter: {},
      prevSelectedSvcGrpFilter: {},
      allFilterApiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
      userFilterApiConfig: {
        cancelTokenSource: undefined,
        cancelToken: undefined,
      },
    };
  },
  computed: {
    ...mapState('costEx', [
      'allFilterSetting',
      'userFilterSetting',
      'updateAllFilterSetting',
      'updateUserFilterSetting',
      'searchParam',
      'selectedTagKeyFilter',
      'selectedTagValueFilter',
      'selectedSvcCtgryFilter',
      'selectedSvcGrpFilter',
    ]),
    ...mapGetters('costEx', ['cspTypCd', 'filterParam']),
    isAllFilterDisplayed() {
      return this.searchParam.searchType === 'allFilter';
    },
    isLoading() {
      return this.isAllFilterLoading || this.isUserFilterLoading;
    },
  },
  watch: {
    // 다국어 변경 시 차트를 재매핑
    '$i18n.locale': 'setTooltip',
    cspTypCd: function () {
      this.clearFilters();
    },
    updateAllFilterSetting: async function () {
      if (this.updateAllFilterSetting) {
        this.setUpdateAllFilterSetting(false);
        this.isAllFilterLoading = true;

        // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
        if (this.allFilterApiConfig.cancelTokenSource) {
          this.allFilterApiConfig.cancelTokenSource.cancel();
        }
        setApiConfig(this.allFilterApiConfig);

        let allFilters = [];
        try {
          const response = await costExService.allFilterSetting({
            cspTypCd: this.cspTypCd,
            payload: this.filterParam,
            config: {
              cancelToken: this.allFilterApiConfig.cancelToken,
            },
          });
          allFilters = response.data ? response.data : [];
          this.isAllFilterLoading = false;
        } catch (e) {
          if (!axios.isCancel(e)) {
            console.error('Error) in CostExGridFilter allFilterSetting(), ', e);
            this.isAllFilterLoading = false;
          }
        } finally {
          this.setAllFilterSetting(allFilters);
          if (this.searchParam.searchType === 'allFilter') {
            this.setFilters(allFilters);
          }
        }
      }
    },
    updateUserFilterSetting: async function () {
      if (this.updateUserFilterSetting) {
        this.setUpdateUserFilterSetting(false);
        this.isUserFilterLoading = true;

        // api 중복 호출 시 가장 최근 호출에 대한 응답을 사용하기 위한 설정
        if (this.userFilterApiConfig.cancelTokenSource) {
          this.userFilterApiConfig.cancelTokenSource.cancel();
        }

        setApiConfig(this.userFilterApiConfig);
        let userFilters = [];
        try {
          const response = await costExService.userFilterSetting({
            cspTypCd: this.cspTypCd,
            payload: this.filterParam,
            config: {
              cancelToken: this.userFilterApiConfig.cancelToken,
            },
          });
          userFilters = response.data ? response.data : [];
          this.isUserFilterLoading = false;
        } catch (e) {
          if (!axios.isCancel(e)) {
            console.error('Error) in CostExGridFilter allFilterSetting(), ', e);
            this.isUserFilterLoading = false;
          }
        } finally {
          this.setUserFilterSetting(userFilters);
          if (this.searchParam.searchType === 'userFilter') {
            this.setFilters(userFilters);
          }
        }
      }
    },
    isDropdownVisible(value) {
      if (value === false) {
        this.cancelOption(this.dropdownItem);
      }
    },
  },
  created() {
    //기존에 검색한 기록(필터 선택 항목) 있으면 표출
    Object.keys(this.tempFilterParam).forEach((key) => {
      if (!_.isEmpty(this.searchParam[key])) {
        if (this.searchParam[key].length > 0) {
          this.tempFilterParam[key] = _.cloneDeep(this.searchParam[key]);
        }
      }
    });
  },
  mounted() {
    this.startWatching();
    this.setTooltip();
  },
  beforeDestroy() {
    this.stopWatching();
  },
  methods: {
    i18n() {
      return i18n;
    },
    ...mapActions('costEx', [
      'fetchSearchParam',
      'fetchTagKeyFilter',
      'fetchTagValueFilter',
      'fetchSvcCtgryFilter',
      'fetchSvcGrpFilter',
    ]),
    ...mapMutations('costEx', {
      setAllFilterSetting: types.SET_ALL_FILTER_SETTING,
      setUserFilterSetting: types.SET_USER_FILTER_SETTING,
      setUpdateAllFilterSetting: types.SET_UPDATE_ALL_FILTER_SETTING,
      setUpdateUserFilterSetting: types.SET_UPDATE_USER_FILTER_SETTING,
    }),
    setTooltip() {
      this.tooltip = {
        custId: { tooltipText: this.$t('cost.filterCustomerCompany'), isShow: false },
        contractId: { tooltipText: this.$t('cost.filterContractName'), isShow: false },
        serviceCode: {
          tooltipText: this.$t('cost.filterAwsServiceNames'),
          isShow: false,
        },
        usageAccountId: { tooltipText: this.$t('cost.filterAccountId'), isShow: false },
        productRegion: { tooltipText: this.$t('cost.filterRegionCodeNorthEast'), isShow: false },
        productCode: {
          tooltipText: this.$t('cost.filterAwsProduct'),
          isShow: false,
        },
        productFamily: {
          tooltipText: this.$t('cost.filterCategoryProduct'),
          isShow: false,
        },
        instanceType: {
          tooltipText: this.$t('cost.filterSpecificInstance'),
          isShow: false,
        },
        usageType: { tooltipText: this.$t('cost.filterUsageDetails'), isShow: false },
        physicalProcessor: {
          tooltipText: this.$t('cost.filterPhysicalHardware'),
          isShow: false,
        },
        productOperation: { tooltipText: this.$t('cost.filterSpecificAwsActions'), isShow: false },
        operatingSystem: { tooltipText: this.$t('cost.filterPlatform'), isShow: false },
        databaseEngine: {
          tooltipText: this.$t('cost.filterDatabaseEngine'),
          isShow: false,
        },
        lineitemType: {
          tooltipText: this.$t('cost.filterRateType'),
          isShow: false,
        },
        billingEntity: {
          tooltipText: this.$t('cost.filterDistinguishingPurchases'),
          isShow: false,
        },
        serviceGroupId: { tooltipText: this.$t('cost.filterServiceGroup'), isShow: false },
        tagVal: {
          tooltipText: this.$t('cost.filterAWSKeyValue'),
          isShow: false,
        },
        meterCategory: {
          tooltipText: this.$t('cost.filterAzureServiceNames'),
          isShow: false,
        },
        subscriptionName: { tooltipText: this.$t('cost.filterBySubscription'), isShow: false },
        meterRegion: { tooltipText: this.$t('cost.filterRegionCodeKoreaCentral'), isShow: false },
        meterName: {
          tooltipText: this.$t('cost.filterInstanceType'),
          isShow: false,
        },
        meterSubCategory: { tooltipText: this.$t('cost.filterInstanceGroup'), isShow: false },
        resourceGroup: { tooltipText: this.$t('cost.filterResourceGroup'), isShow: false },
        azureTagVal: {
          tooltipText: this.$t('cost.filterAzureKeyValue'),
          isShow: false,
        },
      };
    },
    setFilters(filters) {
      const tmpFilters = _.cloneDeep(filters);
      tmpFilters.forEach((filter) => (filter.visible = false));
      tmpFilters.forEach((filter) => filter.optionList.forEach((opt) => this.toggleDropdown(opt)));
      this.filters = tmpFilters;
      this.initFltOptKeywords();
    },
    watchContractId(newVal, oldVal) {
      const newObj = _.cloneDeep(newVal);
      const oldObj = _.cloneDeep(oldVal);
      if (!_.isEqual(newObj, oldObj) && this.tempFilterParam['tagVal'].length > 0) {
        this.tempFilterParam['tagVal'] = [];
      }
    },
    startWatching() {
      this.unwatch = this.$watch('tempFilterParam.contractId', this.watchContractId);
    },
    stopWatching() {
      if (typeof this.unwatch === 'function') {
        this.unwatch();
      }
    },
    changeToCamelCase(fltSepCd) {
      return fltSepCd.replace(/_./g, (match) => match.charAt(1).toUpperCase());
    },
    initFltOptKeywords() {
      this.searchOptionKeywords = [];
      // 현재 세팅 된 필터 기준으로 검색어 세팅
      this.filters.forEach((flt) => this.searchOptionKeywords.push({ fltSepCd: flt.fltSepCd, keyword: '' }));
    },
    openFilterSetting() {
      this.isOpenFilterSetting = true;
    },
    toggleDropdown(item) {
      this.$set(item, 'visible', !item.visible);
    },
    clickDropdown($event, item, i) {
      const rect = document.getElementById(`dropdown-${i}`).getBoundingClientRect();
      const top = rect.top + window.scrollY - 5;
      const left = rect.left + window.scrollX;

      this.dropdownStyle = {
        top: `${top}px`,
        left: `${left}px`,
      };

      //기본에 선택된 옵션 있다면 체크되어 있도록
      this.setSelectedOption(this.tempFilterParam[this.changeToCamelCase(item.fltSepCd)], item.optionList);

      if (item.fltSepCd === 'tag_val') {
        this.tagFilterHandler();
      } else if (item.fltSepCd === 'service_group_id') {
        this.serviceGrpFilterHandler();
      } else {
        this.dropdownItem = item;
        this.toggleDropdown(item);
        this.isDropdownVisible = !this.isDropdownVisible;
      }
    },
    async serviceGrpFilterHandler() {
      const selectedContractIdArr = this.tempFilterParam['contractId'];
      if (selectedContractIdArr.length === 1) {
        this.isSvcCtgryProcessing = true;
        this.isDropdownVisible = !this.isDropdownVisible;
        this.dropdownItem = this.filters.find((filter) => filter.fltSepCd === 'service_group_id');
        let filter;
        //직전에 불러온 목록과 같으면 store에 있는 데이터 가져옴
        if (selectedContractIdArr[0]['id'] === this.selectedSvcCtgryFilter.contractId) {
          filter = _.cloneDeep(this.selectedSvcCtgryFilter);
        } else {
          const data = await this.fetchSvcCtgryFilter({
            contractId: selectedContractIdArr[0]['id'],
          });
          if (!data) {
            alert(this.$t('common.alert.errorOccur'));
            this.isDropdownVisible = false;
            this.isSvcCtgryProcessing = false;
            return;
          }
          filter = _.cloneDeep(data);
        }
        this.dropdownItem = filter;
        this.isSvcCtgryProcessing = false;
      } else {
        alert(this.$t('common.alert.selectContractForServiceGroupFixed'));
      }
    },
    async tagFilterHandler() {
      const selectedContractIdArr = this.tempFilterParam['contractId'];
      if (selectedContractIdArr.length === 1) {
        this.isTagKeyProcessing = true;
        this.isDropdownVisible = !this.isDropdownVisible;
        this.dropdownItem = this.filters.find((filter) => filter.fltSepCd === 'tag_val');
        let filter;
        //직전에 불러온 목록과 같으면 store에 있는 데이터 가져옴
        if (selectedContractIdArr[0]['id'] === this.selectedTagKeyFilter.contractId) {
          filter = _.cloneDeep(this.selectedTagKeyFilter);
        } else {
          let param = { contractId: selectedContractIdArr[0]['id'] };
          if (this.cspTypCd === 'AZURE') {
            param = {
              ...param,
              startYm: this.searchParam.strDate.slice(0, 6),
              endYm: this.searchParam.endDate.slice(0, 6),
            };
          }
          const data = await this.fetchTagKeyFilter({
            cspTypCd: this.cspTypCd,
            payload: param,
          });

          if (!data) {
            alert(this.$t('common.alert.errorOccur'));
            this.isDropdownVisible = false;
            this.isTagKeyProcessing = false;
            return;
          }
          filter = _.cloneDeep(data);
        }
        this.dropdownItem = filter;
        this.isTagKeyProcessing = false;
      } else {
        alert(this.$t('common.alert.selectContractForTag'));
      }
    },
    async onSelectTagKey(tagKey) {
      if (tagKey === '') {
        return;
      }
      const encodedTagKey = encodeURIComponent(tagKey);
      //직전에 불러온 목록과 같으면 store에 있는 데이터 가져옴
      let filter;
      if (
        this.tempFilterParam['contractId'][0]['id'] === this.selectedTagKeyFilter.contractId &&
        this.selectedTagValueFilter.tagKeyId === encodedTagKey
      ) {
        filter = _.cloneDeep(this.selectedTagValueFilter);
      } else {
        this.isTagValueProcessing = true;
        this.prevSelectedTagValueFilter = _.cloneDeep(this.selectedTagValueFilter);
        let param = { contractId: this.tempFilterParam['contractId'][0]['id'], tagKeyId: encodedTagKey };
        if (this.cspTypCd === 'AZURE') {
          param = {
            ...param,
            startYm: this.searchParam.strDate.slice(0, 6),
            endYm: this.searchParam.endDate.slice(0, 6),
          };
        }
        const data = await this.fetchTagValueFilter({
          cspTypCd: this.cspTypCd,
          payload: param,
        });

        // 초기 호출의 경우
        if (!this.prevSelectedTagValueFilter.tagKeyId) {
          this.prevSelectedTagValueFilter = _.cloneDeep(this.selectedTagValueFilter);
        }

        if (!data) {
          alert(this.$t('common.alert.errorOccur'));
          this.isDropdownVisible = false;
          this.isTagValueProcessing = false;
          return;
        } else {
          filter = _.cloneDeep(data);
        }
      }
      filter.optionList.map((opt) => {
        opt.tagKeyId = tagKey;
        opt.visible = true;
      });
      this.setSelectedOption(this.tempFilterParam['tagVal'], filter.optionList);
      this.isTagValueProcessing = false;
      this.dropdownItem = filter;
      this.isDropdownVisible = true;
    },
    async onSelectSvcCtgry(svcCtgry) {
      if (svcCtgry === '') {
        return;
      }
      const encodedSvcCtgry = encodeURIComponent(svcCtgry);
      //직전에 불러온 목록과 같으면 store에 있는 데이터 가져옴
      let filter;
      if (
        this.tempFilterParam['contractId'][0]['id'] === this.selectedSvcCtgryFilter.contractId &&
        this.selectedSvcGrpFilter.ctgryId === encodedSvcCtgry
      ) {
        filter = _.cloneDeep(this.selectedSvcGrpFilter);
      } else {
        this.isSvcGrpProcessing = true;
        this.prevSelectedSvcGrpFilter = _.cloneDeep(this.selectedSvcGrpFilter);
        const data = await this.fetchSvcGrpFilter({
          contractId: this.tempFilterParam['contractId'][0]['id'],
          ctgryId: encodedSvcCtgry,
        });
        // 초기 호출의 경우
        if (!this.prevSelectedSvcGrpFilter.ctgryId) {
          this.prevSelectedSvcGrpFilter = _.cloneDeep(this.selectedSvcGrpFilter);
        }

        if (!data) {
          alert(this.$t('common.alert.errorOccur'));
          this.isDropdownVisible = false;
          this.isSvcGrpProcessing = false;
          return;
        } else {
          filter = _.cloneDeep(data);
        }
      }
      filter.optionList.map((opt) => {
        opt.ctgryId = svcCtgry;
        opt.visible = true;
      });
      this.setSelectedOption(this.tempFilterParam['serviceGroupId'], filter.optionList);
      this.isSvcGrpProcessing = false;
      this.dropdownItem = filter;
      this.isDropdownVisible = true;
    },
    setSelectedOption(selectedOption, allOptionList) {
      if (selectedOption.length > 0) {
        allOptionList.map((opt) => {
          selectedOption.map((selectedOpt) => {
            if (selectedOpt.id === opt.id && selectedOpt.name === opt.name) {
              opt.value = true;
            }
          });
        });
      }
    },
    closeDropdown() {
      this.isDropdownVisible = false;
    },
    closeFilterSetting() {
      this.isOpenFilterSetting = false;
    },
    clearOption(item, isDelete) {
      const { fltSepCd, optionList } = item;
      const camel = this.changeToCamelCase(fltSepCd);
      this.tempFilterParam[camel] = [];
      optionList.forEach((option) => (option.value = false));
      if (item.allOptionChecked) item.allOptionChecked = false;
      this.saveFilterOption(item, null, isDelete);
    },
    clearFilters() {
      this.filters.forEach((item) => this.clearOption(item));
      Object.keys(this.tempFilterParam).forEach((key) => (this.tempFilterParam[key] = []));
    },
    clearAllOption() {
      this.clearFilters();
      if (this.searchParam.searchType === 'allFilter') {
        this.setUpdateAllFilterSetting(true);
      } else {
        this.setUpdateUserFilterSetting(true);
      }
    },
    selectAllOption(item, fltSepCd) {
      const inputText = _.cloneDeep(this.searchOptionKeywords.find((d) => d.fltSepCd === item.fltSepCd).keyword);
      if (!inputText || inputText === '') {
        item.optionList.forEach((option) => {
          this.$set(option, 'value', !item.allOptionChecked);
          this.changeOption(option, fltSepCd);
        });
      } else {
        this.filters
          .filter((flt) => flt.fltSepCd === item.fltSepCd)[0]
          .optionList.filter((opt) => opt.name.includes(inputText))
          .forEach((opt) => {
            this.$set(opt, 'value', item.allOptionChecked);
            this.changeOption(opt, fltSepCd);
          });
      }
    },
    changeOption(option, fltSepCd, tmp) {
      const camel = this.changeToCamelCase(fltSepCd);
      const param = this.tempFilterParam[camel];
      if (tmp) option.value = false;
      if (tmp) {
        const index = this.tempFilterParam[camel].findIndex(({ id }) => option.id === id);
        param.splice(index, 1);
      }
    },
    saveFilterOption(item, fltSepCd, isDelete) {
      if (fltSepCd) {
        if (fltSepCd === 'tag_val') {
          if (item.tagKeyId !== this.prevSelectedTagValueFilter.tagKeyId) {
            this.tempFilterParam['tagVal'] = [];
          }
          const newOption = item.optionList.filter((option) => option.value);
          const mergedOption = [...this.tempFilterParam['tagVal'], ...newOption];
          const uniqueObjArr = mergedOption.reduce((acc, curr) => {
            const idx = acc.findIndex((obj) => obj['id'] === curr['id'] && obj['name'] === curr['name']);
            if (idx === -1) acc.push(curr);
            return acc;
          }, []);
          this.tempFilterParam['tagVal'] = _.uniqWith(uniqueObjArr, _.isEqual);
        } else if (fltSepCd === 'service_group_id') {
          if (item.ctgryId !== this.prevSelectedSvcGrpFilter.ctgryId) {
            this.tempFilterParam['serviceGroupId'] = [];
          }
          const newOption = item.optionList.filter((option) => option.value);
          const mergedOption = [...this.tempFilterParam['serviceGroupId'], ...newOption];
          const uniqueObjArr = mergedOption.reduce((acc, curr) => {
            const idx = acc.findIndex((obj) => obj['id'] === curr['id'] && obj['name'] === curr['name']);
            if (idx === -1) acc.push(curr);
            return acc;
          }, []);
          this.tempFilterParam['serviceGroupId'] = _.uniqWith(uniqueObjArr, _.isEqual);
        } else {
          this.tempFilterParam[this.changeToCamelCase(fltSepCd)] = item.optionList.filter((option) => option.value);
        }
      }
      this.searchOptionAllVisible(item);
      this.searchOptionKeywordInit(item);

      let prevContractId;
      if (this.searchParam.contractId.length) {
        prevContractId = this.searchParam.contractId[0].id;
      }

      if (
        fltSepCd === 'cust_id' ||
        fltSepCd === 'contract_id' ||
        (isDelete && (item.fltSepCd === 'cust_id' || item.fltSepCd === 'contract_id'))
      ) {
        this.fetchDependentFilter(isDelete ? item.fltSepCd : fltSepCd);
      }

      this.fetchSearchParam(_.cloneDeep({ ...this.searchParam, ...this.tempFilterParam }));
      if (item.fltSepCd === 'contract_id') {
        if (
          !(
            this.searchParam.contractId.length === 1 &&
            item.optionList.filter((option) => option.value).length === 1 &&
            prevContractId === item.optionList.filter((option) => option.value)[0].id
          )
        ) {
          this.$emit('contractChanged');
        }
      }
      if (item.visible) {
        this.toggleDropdown(item);
      }
      this.isDropdownVisible = false;
    },
    cancelOption(item) {
      if (item.fltSepCd !== 'tag_key' && item.fltSepCd !== 'ctgry_id') {
        this.searchOptionAllVisible(item);
        this.searchOptionKeywordInit(item);
        //체크된거 초기화
        item.optionList.map((opt) => {
          opt.value = false;
        });

        // const { fltSepCd, optionList } = item;
        // this.tempFilterParam[fltSepCd] = _.cloneDeep(this.searchParam[fltSepCd] || []);
        // optionList.forEach((option) => {
        //   if (!this.tempFilterParam[fltSepCd].includes(option)) {
        //     option.value = false;
        //   }
        // });
        if (item.allOptionChecked) item.allOptionChecked = false;
        this.toggleDropdown(item);
      }
      this.dropdownItem = {};
      this.isDropdownVisible = false;
    },
    filterToggle() {
      if (this.isAllFilterDisplayed) {
        // 현재 전체 필터가 표기되고 있는 상태에서 클릭 시 유저 필터로 전환
        this.fetchSearchParam({ ...this.searchParam, searchType: 'userFilter' });
        this.setUpdateUserFilterSetting(true);
      } else {
        // 현재 유저 필터가 표기되고 있는 상태에서 클릭 시 전체 필터로 전환
        this.fetchSearchParam({ ...this.searchParam, searchType: 'allFilter' });
        this.setUpdateAllFilterSetting(true);
      }
    },
    /**
     * 검색어 초기화
     */
    searchOptionKeywordInit(item) {
      this.searchOptionKeywords.find((d) => d.fltSepCd === item.fltSepCd).keyword = '';
    },
    /**
     * 각 필터 옵션목록 visible true
     */
    searchOptionAllVisible(item) {
      this.filters.filter((flt) => flt.fltSepCd === item.fltSepCd)[0].optionList.forEach((opt) => (opt.visible = true));

      // 서비스그룹, 태그 select의 경우 별도 초기화
      if (
        this.dropdownItem &&
        Array.isArray(this.dropdownItem.optionList) &&
        (item.fltSepCd === 'service_group_id' || item.fltSepCd === 'tag_val')
      ) {
        this.dropdownItem.optionList.forEach((opt) => (opt.visible = true));
      }
    },
    /**
     * 검색어공백인 경우 ( 입력값 지운 경우) : 전부 visible true
     * 검색어 있는 경우 : 검색 호출
     */
    searchInit(item) {
      //전체 선택된 상태에서 다시 검색하경우 init
      if (item.allOptionChecked) {
        item.allOptionChecked = false;
        const { fltSepCd, optionList } = item;
        this.tempFilterParam[fltSepCd] = _.cloneDeep(this.searchParam[fltSepCd] || []);
        optionList.forEach((option) => {
          if (!this.tempFilterParam[fltSepCd].includes(option)) {
            option.value = false;
          }
        });
        this.toggleDropdown(item);
      }

      this.searchOptionAllVisible(item); // 일단 다시 전부 true
      const inputText = _.cloneDeep(this.searchOptionKeywords.find((d) => d.fltSepCd === item.fltSepCd).keyword);
      if (!inputText || inputText === '') {
        this.searchOptionAllVisible(item); // 일단 다시 전부 true
      } else {
        this.searchOptionName(item);
      }
    },
    /**
     * 입력값으로 겁색 : 일치하지 않는 모든 옵션은 visible false
     */
    searchOptionName(item) {
      this.searchOptionAllVisible(item); // 일단 다시 전부 true
      const inputText = _.cloneDeep(this.searchOptionKeywords.find((d) => d.fltSepCd === item.fltSepCd).keyword);
      // 서비스그룹, 태그 select의 경우 별도 초기화
      if (item.fltSepCd === 'tag_val' || item.fltSepCd === 'service_group_id') {
        this.dropdownItem.optionList
          .filter((opt) => !opt.name.toUpperCase().includes(inputText.toUpperCase()))
          .forEach((opt) => (opt.visible = false));

        this.filters.optionList = _.cloneDeep(this.dropdownItem.optionList);
      }
      this.filters
        .filter((flt) => flt.fltSepCd === item.fltSepCd)[0]
        .optionList.filter((opt) => !opt.name.toUpperCase().includes(inputText.toUpperCase()))
        .forEach((opt) => (opt.visible = false));
    },
    toggleAllSelectedOption(fltSepCd) {
      const camelFltSepCd = this.changeToCamelCase(fltSepCd);
      this.isShowOptionList[camelFltSepCd] = !this.isShowOptionList[camelFltSepCd];
    },
    toggleFilterTooltip(fltSepCd) {
      this.tooltip[this.changeToCamelCase(fltSepCd)]['isShow'] =
        !this.tooltip[this.changeToCamelCase(fltSepCd)]['isShow'];
    },
    async fetchDependentFilter(fltSepCd) {
      let param = {};
      if (fltSepCd === 'cust_id') {
        param = {
          fltSepCd: fltSepCd,
          custIdList: this.tempFilterParam[this.changeToCamelCase(fltSepCd)].map((item) => {
            return item.id;
          }),
          cspTypCd: this.cspTypCd,
        };
      } else if (fltSepCd === 'contract_id') {
        param = {
          fltSepCd: fltSepCd,
          contractIdList: this.tempFilterParam[this.changeToCamelCase(fltSepCd)].map((item) => {
            return item.id;
          }),
          cspTypCd: this.cspTypCd,
        };
      }
      // 기존 선택된 데이터 제거
      this.filters
        .filter((flt) => {
          if (fltSepCd === 'cust_id') {
            return flt.fltSepCd !== fltSepCd;
          } else if (fltSepCd === 'contract_id') {
            return flt.fltSepCd !== 'cust_id' && flt.fltSepCd !== fltSepCd;
          }
        })
        .forEach((item) => this.clearOption(item));
      Object.keys(this.tempFilterParam)
        .filter((flt) => {
          if (fltSepCd === 'cust_id') {
            return flt !== this.changeToCamelCase(fltSepCd);
          } else if (fltSepCd === 'contract_id') {
            return flt !== 'custId' && flt !== this.changeToCamelCase(fltSepCd);
          }
        })
        .forEach((key) => (this.tempFilterParam[key] = []));
      if (this.searchParam.searchType === 'allFilter') {
        await costExService
          .allFilterSetting({
            cspTypCd: this.cspTypCd,
            payload: param,
          })
          .then((res) => {
            this.setFilterUnvisible(fltSepCd, res.data);
          })
          .catch((error) => {});
      } else {
        await costExService
          .userFilterSetting({
            cspTypCd: this.cspTypCd,
            payload: param,
          })
          .then((res) => {
            this.setFilterUnvisible(fltSepCd, res.data);
          })
          .catch((error) => {});
      }
    },
    setFilterUnvisible(fltSepCd, data) {
      const dataMap = data.reduce((map, obj) => {
        map.set(obj.fltSepCd, obj.optionList);
        return map;
      }, new Map());
      this.filters
        .filter((flt) => {
          if (fltSepCd === 'cust_id') {
            return flt.fltSepCd !== fltSepCd;
          } else if (fltSepCd === 'contract_id') {
            return flt.fltSepCd !== 'cust_id' && flt.fltSepCd !== fltSepCd;
          }
        })
        .forEach((item) => {
          if (dataMap.has(item.fltSepCd)) {
            let dataOptArr = dataMap.get(item.fltSepCd);
            dataOptArr.forEach((opt) => (opt.visible = true));
            item.optionList = _.cloneDeep(dataOptArr);
            this.initFltOptKeywords();
          }
        });
    },
  },
};
</script>
<style>
.tag-select {
  font-size: 14px;
  color: #000;
  line-height: 30px;
  height: 32px;
  border-radius: 4px;
  border: solid 1px #e9ebed;
  background-color: #fff;
  padding: 0 36px 0 16px;
  width: 100%;
  text-align: left;
}
</style>
