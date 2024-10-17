<template>
  <div class="block">
    <DatePicker
      v-model="range"
      type="monthrange"
      unlink-panels
      range-separator="~"
      start-placeholder=""
      end-placeholder=""
      value-format="yyyy.MM"
      :picker-options="pickerOptions"
      @change="handleMonthRangeChange"
    >
    </DatePicker>
  </div>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import { DatePicker } from 'element-ui';

import lang from 'element-ui/lib/locale/lang/ko';
import en from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import { i18n } from '../../../../public/locales/i18n';

// locale.use(lang);
// locale.use(en);

export default {
  components: {
    DatePicker,
  },
  props: {
    dateRanges: {
      type: Object,
      default: () => {
        return {
          이번달: [moment().startOf('month').toDate(), moment().toDate()],
          '최근 3개월': [moment().subtract(3, 'month').startOf('month').toDate(), moment().toDate()],
          '최근 6개월': [moment().subtract(6, 'month').toDate(), moment().toDate()],
          '최근 1년': [moment().subtract(1, 'year').toDate(), moment().toDate()],
        };
      },
    },
    periodType: {
      type: String,
      default: '',
    },
    selectClass: {
      type: [Object, Array, String],
      default: 'flex items-center justify-between w-full font-bold text-gray-700',
    },
    arrowSrc: {
      type: [String],
      default: () => require('@/assets/images/arrow-typ-02.svg'),
    },
    arrowClass: {
      type: [Object, Array, String],
      default: 'ml-4',
    },
    textVisiblity: {
      type: [Boolean],
      default: true,
    },
    defaultSelect: {
      type: [Number],
      default: 0,
    },
  },
  data() {
    return {
      range: [],
      startDate: '',
      endDate: '',
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > moment().toDate() ||
            time.getTime() < moment().subtract(1, 'years').startOf('month').toDate()
          );
        },
        shortcuts: {},
      },
    };
  },
  watch: {
    '$i18n.locale': 'setShortCuts',
  },
  created() {
    this.setShortCuts();
    // this.startDate = moment().add(-1, 'years').toDate();
    // this.endDate = moment().toDate();
    // this.range = [this.startDate, this.endDate];
  },
  mounted() {
    const range = this.dateRanges[Object.keys(this.dateRanges)[this.defaultSelect]];
    const value = {
      startDate: range[0],
      endDate: range[1],
    };
    this.setDateRange();
    this.$emit('change', value);
  },
  methods: {
    setShortCuts() {
      this.startDate = moment().add(-1, 'years').toDate();
      this.endDate = moment().toDate();
      this.range = [this.startDate, this.endDate];
      this.pickerOptions.shortcuts = [
        {
          text: i18n.locale === 'ko' ? '이번달' : 'This month',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          },
        },
        {
          text: i18n.locale === 'ko' ? '최근 3개월' : 'Recent 3 months',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 3);
            picker.$emit('pick', [start, end]);
          },
        },
        {
          text: i18n.locale === 'ko' ? '최근 6개월' : 'Recent 6 months',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          },
        },
        {
          text: i18n.locale === 'ko' ? '최근 1년' : 'Recent 1 year',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 12);
            picker.$emit('pick', [start, end]);
          },
        },
      ];
      if (i18n.locale === 'ko') {
        locale.use(lang);
      } else {
        locale.use(en);
      }
    },
    disabledDate(date) {
      return date > moment().format('YYYYMMDD') || date < moment().add(-1, 'years').format('YYYYMMDD');
    },
    setDateRange() {
      this.dateRange = ((range) => ({
        startDate: range[0],
        endDate: range[1],
      }))(this.dateRanges[Object.keys(this.dateRanges)[this.defaultSelect]]);

      this.ranges = this.dateRanges;
    },
    handleMonthRangeChange(params) {
      this.startDate = moment(params[0], 'YYYY.MM').startOf('month').toDate();
      this.endDate = moment(params[1], 'YYYY.MM').startOf('month').toDate();

      const value = {
        startDate: this.startDate,
        endDate: this.endDate,
      };

      this.range = [this.startDate, this.endDate];
      this.$emit('change', value);
    },
  },
};
</script>

<style>
@import url('//unpkg.com/element-ui@2.15.14/lib/theme-chalk/index.css');

.el-range-input {
  font-size: 16px !important;
}
.el-date-editor.el-range-editor {
  width: 200px;
  height: 30px;
  border-color: transparent;
}
.el-date-editor.el-range-editor:hover {
  border-color: transparent;
}
.el-range-separator {
  width: 15px !important;
  padding-bottom: 30px !important;
}
.el-icon-date {
  display: none;
}
.el-picker-panel__shortcut {
  font-size: 12px !important;
  margin-bottom: 15px;
}
</style>
