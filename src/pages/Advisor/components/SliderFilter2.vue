<template>
  <div class="filter-slider">
    <div class="filter-slider__input">
      <div class="left" style="padding-top: 12px; box-sizing: border-box">
        <div class="required">
          <div class="flex-container column" style="display: flex; flex-direction: column">
            <div class="label-container" style="display: flex; flex-direction: row; align-items: center">
              <p class="table__search-title">인스턴스 수</p>
              <img src="@/assets/images/required-01.svg" alt="required" />
              <input type="number" /> &nbsp; 개
            </div>
          </div>
        </div>
      </div>
      <div class="right" style="padding-top: 12px; box-sizing: border-box">
        <div class="required" style="display: flex; flex-direction: column; align-items: flex-start">
          <div class="input-wrapper" style="width: 100%">
            <span style="font-size: 14px; font-weight: 400; color: #999999; margin-right: 8px">인스턴스 패밀리</span>
            <select class="f">
              <option>선택</option>
              <option>선택</option>
              <option>선택</option>
            </select>
          </div>
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
      <div class="last_selections added">
        <select>
          <option>필터속성</option>
          <option>필터속성</option>
          <option>필터속성</option>
          <option>필터속성</option>
        </select>
        <select class="ga">
          <option>선택</option>
          <option>선택</option>
          <option>선택</option>
          <option>선택</option>
        </select>
        <button>속성 추가</button>
        <div class="alrim">!</div>
      </div>
      <div class="last_selections">
        <select>
          <option>필터속성</option>
          <option>필터속성</option>
          <option>필터속성</option>
          <option>필터속성</option>
        </select>
        <select class="ga">
          <option>선택</option>
          <option>선택</option>
          <option>선택</option>
          <option>선택</option>
        </select>
        <button>속성 추가</button>
        <div class="alrim">!</div>
      </div>

      <div class="warning">
        <div class="required">
          <img src="@/assets/images/required-01.svg" alt="요구해요" />
          <p style="font-size: 11px; color: #999">
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
<style lang="scss">
.spot-tab-filter-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #5ba9ca;

  .left,
  .right {
    width: 50%;
  }

  .flex-container {
    display: flex;
    align-items: center;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
  }

  .input {
    display: flex;
    align-items: center;
    position: relative;
  }

  .input input {
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .input img {
    position: absolute;
    left: 0.5rem;
  }

  .input span {
    margin-left: 0.5rem;
    font-size: 1rem;
  }
}

.table__search .input-wrapper {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
}

.table__search .input-wrapper .input {
  display: flex;
  flex-direction: row;
  padding: 6px 16px 6px 32px;
  max-width: 262px;
  width: 100%;
  border-radius: 0.25rem;
  border: 1px solid #e9ebed;
  background: #fff;
  position: relative;

  img {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
}

.warning {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0.75rem;
  color: #999;
  font-size: 0.75rem;
  font-weight: 400;
}

.ag-header-group-text {
  text-align: center !important;
  font-size: 13px;
  font-style: normal;
  line-height: 18px;
  font-weight: bold !important;
  color: #5ba9ca;
  font-family: 'Noto Sans KR';
}

.ag-header-group-cell-label {
  align-items: center !important;
  justify-content: center !important;
}

.ag-header-cell-label {
  justify-content: center;
}

.filter-grid .ag-body-viewport {
  min-height: 186px;
  text-align: center;
  height: 210px;
  overflow: auto !important;

  &::-webkit-scrollbar-thumb {
    background-color: #a8a8a8;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #a8a8a8;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }
  .ag-center-cols-viewport {
    overflow: auto !important;
  }
}

.ag-root-wrapper-body .no-display-in-grid {
  display: none !important;
}

.example-wrapper .gpu-header-merge {
  height: 100px !important;
  position: fixed !important;
  top: 0px;
  border-top: none !important;
}

.example-wrapper .ag-header-group-cell-no-group {
  height: 0px !important;
}

.ag-row .ag-cell {
  display: flex;
  justify-content: center; /* align horizontal */
  align-items: center;
  line-height: 24px;
}

.box-wrap .flex.items-center:last-child {
  padding-bottom: 0;
  margin: 10px 0;
}
</style>
