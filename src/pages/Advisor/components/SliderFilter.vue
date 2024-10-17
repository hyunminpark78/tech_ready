<template>
  <div class="filter-slider">
    <div class="filter-slider__input">
      <div class="instance-family">
        <p class="title">{{ $t('advisor.gpuSPot.gpuSpotFilter.instanceFamily') }}</p>
        <div class="input">
          <Select
            div-class="input-filter"
            :data="gpuTypeInstanceFamily"
            :text-getter="(item) => item.name"
            :key-getter="(item) => item.id"
            select-class="flex items-center justify-between w-full font-bold text-gray-700"
            :placeholder="$t('advisor.gpuSPot.gpuSpotFilter.all')"
            :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
            arrow-class="ml-4"
            option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
            option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
            text-class="input-text"
            option-list-style="width: 100%; left: 0px; overflow-y: auto; max-height: 300px"
          />

          <img src="@/assets/images/restart-icon.svg" alt="다시 시작" style="cursor: pointer; width: 17px" />
        </div>
      </div>
    </div>
    <div class="filter-slider__content">
      <RangeSlider
        :min-title="$t('advisor.spotRateCheck.inquiryFilter.minimum')"
        :max-title="$t('advisor.spotRateCheck.inquiryFilter.maximum')"
        :min="4"
        :max="192"
        :default-min-value="4"
        :default-max-value="192"
        field-title="vCPU"
        :is-require="true"
      />
      <RangeSlider
        :min-title="$t('advisor.spotRateCheck.inquiryFilter.minimum')"
        :max-title="$t('advisor.spotRateCheck.inquiryFilter.maximum')"
        :min="8"
        :max="1152"
        :default-min-value="8"
        :default-max-value="1152"
        field-title="메모리 (GiB)"
        :is-require="true"
      />
      <RangeSlider
        :min-title="$t('advisor.spotRateCheck.inquiryFilter.minimum')"
        :max-title="$t('advisor.spotRateCheck.inquiryFilter.maximum')"
        :min="1"
        :max="32"
        :default-min-value="1"
        :default-max-value="32"
        field-title="GPU"
      />
      <RangeSlider
        :min-title="$t('advisor.spotRateCheck.inquiryFilter.minimum')"
        :max-title="$t('advisor.spotRateCheck.inquiryFilter.maximum')"
        :min="8"
        :max="640"
        :default-min-value="8"
        :default-max-value="640"
        field-title="GPU (GiB)"
      />
    </div>
    <div v-if="currentTab !== 'interruptionFrequency'" class="filter-slider__filter-props">
      <div v-for="(attribute, index) in selectedAdditionAtrributeList" :key="attribute.id">
        <div class="wrapper select-type" v-if="attribute">
          <div class="input-wrapper" style="background-color: #fff">
            <DropDownFilterProps
              div-class="input"
              :data="attribute.options"
              :text-getter="(item) => item.name"
              :key-getter="(item) => item.id"
              select-class="flex items-center justify-between w-full font-bold text-gray-700"
              :placeholder="attribute.name"
              :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
              arrow-class="ml-4"
              option-list-class="absolute w-full z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
              option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
              text-class="input-text"
              option-list-style="top: -11rem; left: 0px"
              :cur-index="index"
              @updateOption="updateDetailsAttribute"
            />
          </div>
          <img
            src="@/assets/images/ico-remove-01.svg"
            alt="제거"
            style="cursor: pointer"
            @click="handleClearAdditionalOption(index)"
          />
        </div>
        <div
          v-if="detailsAttributeList[index]"
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 12px;
            margin-left: 20px;
            margin-bottom: 20px;
          "
        >
          <div
            v-for="(details, idx) in detailsAttributeList[index]"
            :key="idx"
            style="
              display: flex;
              padding: 4px 4px 4px 8px;
              align-items: center;
              gap: 2px;
              border-radius: 4px;
              background: #eee;
            "
          >
            <p style="font-size: 14px; font-weight: 400">
              {{ details.name }}
            </p>
            <img
              src="@/assets/images/ico-remove-01.svg"
              alt="제거"
              style="cursor: pointer"
              @click="deleteDetailsAttribute(index, idx)"
            />
          </div>
        </div>
      </div>
      <div class="wrapper">
        <div class="input-wrapper">
          <p class="title">{{ $t('advisor.gpuSPot.gpuSpotFilter.filterProperties') }}</p>
          <Select
            div-class="input"
            :data="addtionFilterOption"
            :text-getter="(item) => item.name"
            :key-getter="(item) => item.id"
            select-class="flex items-center justify-between w-full font-bold text-gray-700"
            placeholder="--선택--"
            :arrow-src="require('@/assets/images/arrow-typ-02.svg')"
            arrow-class="ml-4"
            option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
            option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
            text-class="input-text"
            option-list-style="top: -6.5rem; left: 0px"
            v-model="selectedAttribute"
            @change="onSelectChange"
          />
        </div>
        <button class="filter-btn" @click="handleFilterAttributeAddtion">속성 추가</button>
        <img
          src="@/assets/images/restart-icon.svg"
          alt="다시 시작"
          style="cursor: pointer; padding-right: 12px"
          @click="clearSelectedAdditionAttributeOption"
        />
      </div>

      <div class="warning">
        <div class="required">
          <img src="@/assets/images/required-01.svg" alt="요구해요" />
          <p style="font-size: 0.75rem; color: #999">
            최소 3가지 인스턴스를 선택하셔야 합니다. 3가지 이하의 인스턴스를 조회할 경우 낮은 배치 점수로 리턴됩니다.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Select from '@/components/Select';
import RangeSlider from '@/pages/Advisor/components/RangeSlider.vue';
import DropDownFilterProps from '@/pages/Advisor/filterSelects/DropDownFilterProps.vue';

export default {
  components: { DropDownFilterProps, RangeSlider, Select },
  props: {
    addtionFilterOption: {
      type: Array,
      default: () => [],
    },
    additionalFilterDetailOptions: {
      type: Object,
      default: () => {},
    },
    currentTab: {
      type: String,
      default: '',
    },
  },
  computed: {
    selectedAttribute: {
      get() {
        return this.selectedAdditionAtrribute;
      },
      set(value) {
        this.selectedAdditionAtrribute = value;
        console.log('Selected attribute:', value); // 디버깅을 위한 로그
      },
    },
  },
  data() {
    return {
      tab: 0,
      selectedAdditionAtrribute: null,
      selectedAdditionAtrributeList: [],
      showAdditionalOption: true,
      gpuTypeInstanceFamily: [
        { id: 'P5', name: 'P5' },
        { id: 'P4', name: 'P4' },
        { id: 'P3', name: 'P3' },
        { id: 'P2', name: 'P2' },
        { id: 'G6e', name: 'G6e' },
        { id: 'G5g', name: 'G5g' },
        { id: 'G5', name: 'G5' },
        { id: 'G4dn', name: 'G4dn' },
        { id: 'G4ad', name: 'G4ad' },
        { id: 'G3', name: 'G3' },
        { id: 'Trn1', name: 'Trn1' },
        { id: 'Inf2', name: 'Inf2' },
        { id: 'Inf1', name: 'Inf1' },
        { id: 'DL1', name: 'DL1' },
        { id: 'DL2q', name: 'DL2q' },
        { id: 'F1', name: 'F1' },
        { id: 'VT1', name: 'VT1' },
      ],
      detailsAttributeList: [],
    };
  },
  methods: {
    onSelectChange(value) {
      this.selectedAdditionAtrribute = value;
    },
    handleFilterAttributeAddtion() {
      if (this.selectedAdditionAtrribute) {
        const attributeOptions = this.additionalFilterDetailOptions[this.selectedAdditionAtrribute.id];
        if (
          attributeOptions &&
          !this.selectedAdditionAtrributeList.some((attr) => attr.id === this.selectedAdditionAtrribute.id)
        ) {
          this.selectedAdditionAtrributeList.push({
            ...this.selectedAdditionAtrribute,
            options: attributeOptions,
          });
          this.selectedAdditionAtrribute = null;
        }
      }
    },
    handleClearAdditionalOption(index) {
      if (this.selectedAdditionAtrributeList[index]) {
        this.selectedAdditionAtrributeList.splice(index, 1);
      }
    },
    clearSelectedAdditionAttributeOption() {
      this.selectedAdditionAtrribute = null;
    },
    updateDetailsAttribute(index, option) {
      this.detailsAttributeList[index] = option;

      this.$forceUpdate();
    },
    deleteDetailsAttribute(idx1, idx2) {
      this.detailsAttributeList[idx1].splice(idx2, 1);
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss">
.select-type {
  margin-bottom: 12px;
  display: flex;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #00a5ed;
  background: #eefaff;
}
</style>
