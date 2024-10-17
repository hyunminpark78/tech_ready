<template>
  <div :style="rowDisplay ? { display: 'flex', flexDirection: 'row', height: '100%', gap: '1rem' } : {}">
    <div class="range-slider" :style="rowDisplay ? { marginBottom: 0 } : {}">
      <img v-if="isRequire" class="required" src="@/assets/images/required-01.svg" alt="요구해요" />
      <p class="range-slider__title">
        {{ fieldTitle }}
        <span v-if="validateValue" style="color: #ea1718; font-weight: 500; margin-left: 12px">{{
          $t('advisor.spotRateCheck.inquiryFilter.numberValidate')
        }}</span>
      </p>
    </div>
    <div class="flex items-center" style="gap: 8px; padding-bottom: 0; flex-grow: 1">
      <div class="flex items-center" style="gap: 8px">
        <p class="range-slider__label">{{ minTitle }}</p>
        <input v-model="minValue" :class="displayMinField" @input="handleChangeMinValue" @blur="handleBlurMinValue" />
      </div>
      <div class="slider-container">
        <input ref="slider1" v-model="minPercent" type="range" class="slider" @input="updateSliderMin" />
        <input ref="slider2" v-model="maxPercent" type="range" class="slider" @input="updateSliderMax" />
        <div class="slider-track"></div>
        <div class="slider-range" :style="rangeStyle"></div>
      </div>
      <div class="flex items-center" style="gap: 8px; padding-bottom: 0">
        <p class="range-slider__label">{{ maxTitle }}</p>
        <input v-model="maxValue" :class="displayMaxField" @input="handleChangeMaxValue" @blur="handleBlurMaxValue" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isRequire: {
      type: Boolean,
      default: false,
    },
    fieldTitle: {
      type: String,
      default: '',
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    minTitle: {
      type: String,
      default: '',
    },
    maxTitle: {
      type: String,
      default: '',
    },
    defaultMinValue: {
      type: Number,
      default: 20,
    },
    defaultMaxValue: {
      type: Number,
      default: 80,
    },
    rowDisplay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      minValue: this.defaultMinValue,
      maxValue: this.defaultMaxValue,
      minPercent: Math.floor((this.defaultMinValue * 100) / this.max),
      maxPercent: Math.floor((this.defaultMaxValue * 100) / this.max),
    };
  },
  computed: {
    rangeStyle() {
      const percent1 = ((this.minPercent - 0) / (100 - 0)) * 100;
      const percent2 = ((this.maxPercent - 0) / (100 - 0)) * 100;
      const distance = percent2 - percent1;
      return {
        left: `${percent1 > 100 ? 0 : percent1}%`,
        width: `${distance < 0 || distance > 100 ? 0 : distance}%`,
      };
    },
    validateValue() {
      return (
        +this.minValue < +this.min ||
        +this.minValue > +this.max ||
        +this.maxValue < +this.min ||
        +this.maxValue > +this.max ||
        +this.minValue > +this.maxValue
      );
    },
    displayMinField() {
      return this.minValue < +this.min || this.minValue > +this.max || +this.minValue > +this.maxValue
        ? 'display error'
        : 'display';
    },
    displayMaxField() {
      return this.maxValue < +this.min || this.maxValue > +this.max || +this.minValue > +this.maxValue
        ? 'display error'
        : 'display';
    },
  },
  methods: {
    updateSliderMin(e) {
      const valuePercent = +e.target.value;
      const max = this.max;
      const maxPercent = this.maxPercent;
      if (valuePercent > maxPercent) {
        this.minPercent = maxPercent;
        this.minValue = Math.floor((maxPercent / 100) * max);
      } else {
        this.minValue = Math.floor((valuePercent / 100) * max);
      }
    },
    updateSliderMax(e) {
      const valuePercent = +e.target.value;
      const max = this.max;
      const minPercent = this.minPercent;
      if (minPercent > valuePercent) {
        this.maxPercent = minPercent;
        this.maxValue = Math.floor((minPercent / 100) * max);
      } else {
        this.maxValue = Math.floor((valuePercent / 100) * max);
      }
    },
    handleChangeMinValue(e) {
      const value = +e.target.value;
      const max = this.max;
      if (isNaN(value)) {
        this.minValue = 0;
        this.minPercent = 0;
      } else {
        this.minPercent = Math.floor((value * 100) / max);
      }
    },
    handleChangeMaxValue(e) {
      const value = +e.target.value;
      const max = this.max;
      if (isNaN(value)) {
        this.maxValue = 0;
        this.maxPercent = 0;
      } else {
        this.maxPercent = Math.floor((value * 100) / max);
      }
    },
    handleBlurMinValue(e) {
      if (e.target.value === '') {
        this.minValue = 0;
      }
    },
    handleBlurMaxValue(e) {
      if (e.target.value === '') {
        this.maxValue = 0;
      }
    },
  },
};
</script>

<style lang="scss">
/* styles.css */

.slider-container {
  position: relative;
  flex: 1;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: transparent;
  position: absolute;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #00a5ed;
  margin-bottom: 4px;
  background: #ffffff;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.slider-track {
  position: absolute;
  height: 4px;
  background: #dedede;
  border-radius: 4px;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
}

.slider-range {
  position: absolute;
  height: 4px;
  background: #2cc2fd;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 1;
}

.slider-label {
  position: absolute;
  background: #2cc2fd;
  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 12px;
  white-space: nowrap;
  transform: translateX(-50%);
}

.display {
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 40px;
  border: 1px solid #e9ebed;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  border-radius: 4px;
}

.error {
  color: #ea1718;
}

.range-slider {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 10px;

  &__title {
    font-size: 14px;
    font-weight: 500;
    color: #999;
  }
}

.range-slider__label {
  color: #4a4a4a;
  font-size: 13px;
  font-weight: 400;
}
</style>
