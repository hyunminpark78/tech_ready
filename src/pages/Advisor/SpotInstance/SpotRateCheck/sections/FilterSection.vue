<template>
  <div class="filterChartBox box-wrap" style="margin-top: 0">
    <Tooltip style="margin-bottom: 23px" :title="$t('advisor.spotRateCheck.inquiryFilter.title')">
      <div style="font-weight: 700" class="ti">{{ $t('advisor.spotRateCheck.inquiryFilter.rateCheck') }}</div>
      <div class="ls">
        {{ $t('advisor.spotRateCheck.inquiryFilter.rateCheckDes') }}
      </div>
      <div class="ls">
        <span style="color: #ea1718; margin-right: 5px">*</span>
        {{ $t('advisor.spotRateCheck.inquiryFilter.rateCheckNote') }}
      </div>
    </Tooltip>
    <div>
      <div class="flex" style="margin-left: 26%; width: 100%">
        <p class="noted-text">
          {{ $t('advisor.spotRateCheck.inquiryFilter.notedMessage') }}
        </p>
      </div>
      <div class="flex justify-between">
        <div
          class="flex"
          style="
            border: 1px solid #00a5ed;
            border-top: 0;
            border-top-right-radius: 8px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            width: 74%;
          "
        >
          <div style="position: relative; width: 33%">
            <div class="flex" style="position: absolute; z-index: 20; top: -43px; left: -1px; width: 101%">
              <div :class="tab === 1 ? 'filterTab active' : 'filterTab'" @click="switchTab(1)">
                {{ $t('advisor.spotRateCheck.inquiryFilter.availabilityZone') }}
              </div>
              <div :class="tab === 2 ? 'filterTab active' : 'filterTab'" @click="switchTab(2)">
                {{ $t('advisor.spotRateCheck.inquiryFilter.instanceType') }}
              </div>
            </div>
            <InstanceTypeSelect v-if="tab === 1" />
            <RegionSelect v-else />
          </div>
          <div style="border-top: 1px solid; border-top-color: #00a5ed; width: 33%">
            <RegionSelect v-if="tab === 1" />
            <AvailableZonesSelect v-else :row-display="true" />
          </div>
          <div style="border-top: 1px solid; border-top-color: #00a5ed; flex: 1; border-top-right-radius: 8px">
            <OptSystemSelect v-if="tab === 1" />
            <OptSystemSelect v-else />
          </div>
        </div>
        <div style="width: 24%">
          <ContractAndAccountSelect :is-contract-padding="true" />
        </div>
      </div>
    </div>
    <div
      v-if="tab === 2"
      class="flex"
      style="
        margin-top: 0.75rem;
        gap: 3.75rem;
        padding: 1rem 1.75rem;
        align-items: center;
        border: 1px solid #e3ebf1;
        border-radius: 0.5rem;
      "
    >
      <div class="flex">
        <div style="color: #ea1718">*</div>
        <p style="color: #5ba9ca; margin-left: 5px">{{ $t('advisor.spotRateCheck.inquiryFilter.selectInstance') }}</p>
      </div>
      <div class="flex justify-between" style="flex: 1">
        <div style="width: 15%; display: flex; flex-direction: row; align-items: center; gap: 1rem">
          <p style="margin-bottom: 0; color: #999999">
            {{ $t('advisor.spotRateCheck.inquiryFilter.instanceFamily') }}
          </p>
          <div class="relative select-three">
            <Select
              :data="instanceDropdown"
              :key-getter="(item) => item.value"
              :select-style="instanceStyle"
              :default-selected="1"
              select-class="flex items-center justify-between w-full px-4 py-1.5 text-sm text-left bg-white border rounded h-8"
              :arrow-src="require('@/assets/images/arrow-typ-03-up.svg')"
              arrow-class="ml-4 -mr-2"
              option-list-class="absolute z-20 text-sm text-gray-700 bg-white border rounded border-primary-200"
              option-list-item-class="px-5 py-2 cursor-pointer hover:bg-primary-300"
            />
          </div>
        </div>
        <div style="width: 35%">
          <RangeSlider
            :row-display="true"
            :min-title="$t('advisor.spotRateCheck.inquiryFilter.minimum')"
            :max-title="$t('advisor.spotRateCheck.inquiryFilter.maximum')"
            min="0"
            max="130"
            default-min-value="2"
            default-max-value="4"
            field-title="vCPU"
          />
        </div>
        <div style="width: 35%">
          <RangeSlider
            :row-display="true"
            :min-title="$t('advisor.spotRateCheck.inquiryFilter.minimum')"
            :max-title="$t('advisor.spotRateCheck.inquiryFilter.maximum')"
            min="2"
            max="25000"
            default-min-value="2"
            default-max-value="8"
            :field-title="$t('advisor.spotRateCheck.inquiryFilter.memory')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Tooltip, RangeSlider } from '@/pages/Advisor/components';
import RegionSelect from './RegionSelect.vue';
import InstanceTypeSelect from './InstanceTypeSelect.vue';
import AvailableZonesSelect from './AvailableZonesSelect.vue';
import OptSystemSelect from './OptSystemSelect.vue';
import ContractAndAccountSelect from './ContractAndAccountSelect.vue';
import Select from '@/components/Select';
import demoData from '../../../../../../public/locales/comparison_demo.json';

export default {
  components: {
    Tooltip,
    RegionSelect,
    InstanceTypeSelect,
    OptSystemSelect,
    ContractAndAccountSelect,
    RangeSlider,
    Select,
    AvailableZonesSelect,
  },
  props: {
    tab: {
      type: Number,
      default: 1,
    },
    switchTab: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      savingData: [],
      coverageData: [],
      instanceDropdown: [
        {
          text: 't3',
          value: '3',
        },
        {
          text: 't4',
          value: '4',
        },
        {
          text: 't5',
          value: '5',
        },
      ],
      instanceStyle: 'color: #00a5ed;',
    };
  },
  computed: {},
  watch: {
    '$i18n.locale': [],
  },

  created() {
    // Apply theme
    am4core.useTheme(am4themes_animated);
  },

  mounted() {
    this.setInstanceFamilyData();
  },
  methods: {
    setInstanceFamilyData() {
      const instanceFamilyList = Array.from(
        new Set(
          demoData.InstanceTypes.map((item) => {
            return item.split('.')[0];
          })
        )
      );
      this.instanceDropdown = instanceFamilyList.map((item, index) => ({
        text: item,
        value: index,
      }));
    },
  },
};
</script>

<style lang="scss">
.filterChartBox {
  margin-top: 0;
  padding: 20px 24px;
}

.filterTab {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 44px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #f5f5f5;
  color: #888888;
  border-bottom: 1px solid;
  border-bottom-color: #00a5ed;
  cursor: pointer;
}

.filterTab.active {
  border: 1px solid;
  background-color: #ffffff;
  border-color: #00a5ed;
  border-bottom: 0;
  color: #00a5ed;
  font-weight: 700;
}

.select-three .absolute {
  top: 32px;
}

.noted-text {
  font-size: 14px;
  font-weight: 400;
  color: #ea1718;
  max-width: 60%;
  padding-bottom: 8px;
}
</style>
