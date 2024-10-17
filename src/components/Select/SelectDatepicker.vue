<template>
  <DateRangePicker
    ref="picker"
    :key="pickerKey"
    v-model="dateRange"
    v-click-outside="handleClickOutside"
    :locale-data="localeData"
    :min-date="minDate"
    :max-date="maxDate"
    :ranges="ranges"
    :linked-calendars="false"
    :always-show-calendars="false"
    :auto-apply="false"
    :auto-apply-on-predefined-range="true"
    @toggle="(opened) => (showOptions = opened)"
    @update="(value) => $emit('change', value)"
    @startSelection="selectDate('start')"
    @finishSelection="selectDate('end')"
  >
    <template #input>
      <button :class="selectClass">
        <span v-if="textVisiblity">{{ dateRangeOption }}</span>
        <span class="ml-auto font-normal">{{ dateRangeText }}</span>
        <img :src="arrowSrc" alt="arrow" :class="[arrowClass, arrowRotationClass]" />
      </button>
    </template>

    <template #footer="footerProps">
      <div
        v-if="curPath === '/opti/cost/dashboard' || curPath === '/opti/cost/tgt' || curPath === '/opti/cost/status'"
        class="footer-text"
      >
        <span>{{ $t('common.paragraph.specifyPeriodThreeMonths') }}</span>
      </div>
      <div v-else-if="curPath === '/cost/explorer'" class="footer-text">
        <span v-if="periodType === 'DALY'">{{ $t('common.paragraph.specifyPeriodThreeMonths') }}</span>
        <span v-if="periodType === 'MNTH'">{{ $t('common.paragraph.specifyPeriodPastYear') }}</span>
      </div>

      <div class="flex justify-center">
        <button
          class="px-5 py-1.5 text-sm border rounded-sm bg-white text-primary-400 border-primary-400 mx-1.5"
          @click="footerProps.clickCancel"
        >
          {{ $t('common.button.cancel') }}
        </button>
        <button
          class="px-5 py-1.5 text-sm text-white border rounded-sm bg-primary-400 border-primary-400 mx-1.5"
          @click="footerProps.clickApply"
        >
          {{ $t('common.button.confirmation') }}
        </button>
      </div>
    </template>
  </DateRangePicker>
</template>

<script>
import moment from 'moment';
import DateRangePicker from 'vue2-daterange-picker';

export default {
  components: {
    DateRangePicker,
  },
  props: {
    dateRanges: {
      type: Object,
      default: () => {
        return {
          이번달: [moment().startOf('month').toDate(), moment().toDate()],
          지난달: [
            moment().subtract(1, 'month').startOf('month').toDate(),
            moment().subtract(1, 'month').endOf('month').toDate(),
          ],
          '최근 14일': [moment().subtract(14, 'days').toDate(), moment().toDate()],
          '최근 1개월': [moment().subtract(1, 'month').toDate(), moment().toDate()],
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
    remoteStartDate: {
      type: [String],
      default: '',
    },
    remoteEndDate: {
      type: [String],
      default: '',
    },
  },
  data() {
    return {
      showOptions: false,
      // minDate: moment().subtract(3, 'months').subtract(1, 'day').toDate(),
      maxDate: moment().toDate(),
      minDate: moment().subtract(3, 'years').toDate(),
      dateRange: {},
      dateRangeOption: {},
      ranges: null,
      localeData: {},
      pickerKey: 0,
      curPath: null,
    };
  },
  computed: {
    dateRangeText() {
      return `${moment(this.dateRange.startDate).format('YYYY.MM.DD')} ~ ${moment(this.dateRange.endDate).format(
        'YYYY.MM.DD'
      )}`;
    },
    arrowRotationClass() {
      return this.showOptions ? 'rotate-180-' : '';
    },
    hasValue() {
      return !!this.dateRange.startDate && !!this.dateRange.endDate;
    },
  },
  watch: {
    '$i18n.locale': ['setLocaleData', 'setDateRangeOption'],
    dateRanges() {
      this.setDateRange();
    },
  },
  created() {
    this.setLocaleData();
    this.setDateRangeOption();
    this.curPath = window.location.pathname;
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
    setDateRangeOption() {
      this.dateRangeOption = Object.keys(this.dateRanges).find((key) => {
        const [startDate, endDate] = this.dateRanges[key];
        return (
          moment(this.dateRange.startDate).isSame(moment(startDate)) &&
          moment(this.dateRange.endDate).isSame(moment(endDate))
        );
      });
      // || '사용자 지정';
    },
    setLocaleData() {
      if (this.$i18n.locale === 'ko') {
        this.localeData = {
          direction: 'ltr',
          format: 'yyyy.mm.dd',
          separator: ' ~ ',
          applyLabel: '확인',
          cancelLabel: '취소',
          weekLabel: '주',
          customRangeLabel: '사용자 지정',
          daysOfWeek: ['일', '월', '화', '수', '목', '금', '토'],
          monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
          firstDay: 0,
        };
      } else {
        this.localeData = {
          direction: 'ltr',
          format: 'MMMM.dd.yyyy',
          separator: ' ~ ',
          applyLabel: 'Confirm',
          cancelLabel: 'Cancel',
          weekLabel: 'Week',
          customRangeLabel: 'Custom',
          daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          firstDay: 0,
        };
      }
      this.pickerKey += 1; // Picker를 다시 렌더링하도록 키 증가
    },
    setDateRange() {
      if (!!this.remoteStartDate && !!this.remoteEndDate) {
        this.dateRange = {
          startDate: moment(this.remoteStartDate).toDate(),
          endDate: moment(this.remoteEndDate).toDate(),
        };
      } else {
        this.dateRange = ((range) => ({
          startDate: range[0],
          endDate: range[1],
        }))(this.dateRanges[Object.keys(this.dateRanges)[this.defaultSelect]]);
      }
      this.ranges = this.dateRanges;
    },
    cancel() {
      this.showOptions = false;
    },
    handleClickOutside() {
      if (this.cancelOnClickOutside) {
        this.cancel();
      }
    },
    selectDate(type) {
      let today = moment().toDate();
      let sDate = this.$refs.picker.start;
      if (type === 'start') {
        this.maxDate = moment(sDate).add(3, 'months').toDate();
        if (moment(this.maxDate).isAfter(today)) {
          this.maxDate = today;
        }
      } else {
        this.maxDate = today;
      }
    },
  },
};
</script>
